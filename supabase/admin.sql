-- Emmy STACK01 admin tools: database rules for dev.emmystack01.com
-- Run this once in the Supabase dashboard: SQL Editor > New query > paste > Run. Run schema.sql first.
--
-- Security model
--   * Only emails listed in public.admins are admins. The check happens INSIDE the database, using the email in the
--     signed login token, so the admin site cannot be tricked into showing payout details to anyone else.
--   * The admin site needs only the public (publishable) key plus the admin's own login. No secret key is used there.
--   * Admins cannot edit tables directly. They use three functions: is_admin(), admin_find_partner(), admin_adjust().
--   * Every lookup and every +1 / -1 is written to public.admin_log (view it in Table Editor).

-- ---------------------------------------------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------------------------------------------
create table if not exists public.admins (
  email    text primary key check (email = lower(btrim(email))),
  added_at timestamptz not null default now()
);

create table if not exists public.admin_log (
  id            bigint generated always as identity primary key,
  admin_email   text not null,
  action        text not null,
  partner_code  text,
  detail        text,
  created_at    timestamptz not null default now()
);

alter table public.admins    enable row level security;
alter table public.admin_log enable row level security;
-- No policies on purpose: nobody can read or change these tables from the API.
revoke all on public.admins, public.admin_log from anon, authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- Functions
-- ---------------------------------------------------------------------------------------------------------------

-- True only when the signed-in user's verified email is in public.admins.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(auth.jwt() ->> 'role', '') = 'authenticated'
     and exists (select 1 from public.admins where email = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;

-- Finds a partner by affiliate code (or by email) and returns their details and payout information.
-- Returns null when nobody matches.
create or replace function public.admin_find_partner(p_query text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_q     text := btrim(coalesce(p_query, ''));
  v_admin text := lower(auth.jwt() ->> 'email');
  v_p     public.partners;
  v_pay   public.partner_payouts;
  v_has   boolean;
begin
  if not public.is_admin() then raise exception 'not_admin' using errcode = '42501'; end if;
  if char_length(v_q) not between 3 and 254 then raise exception 'invalid_input' using errcode = '22023'; end if;

  if position('@' in v_q) > 0 then
    select * into v_p from public.partners where lower(email) = lower(v_q);
  else
    select * into v_p from public.partners where code = upper(v_q);
  end if;

  if not found then
    insert into public.admin_log (admin_email, action, detail) values (v_admin, 'lookup_miss', left(v_q, 60));
    return null;
  end if;

  select * into v_pay from public.partner_payouts where partner_id = v_p.id;
  v_has := found;

  insert into public.admin_log (admin_email, action, partner_code) values (v_admin, 'lookup', v_p.code);

  return jsonb_build_object(
    'first_name', v_p.first_name, 'last_name', v_p.last_name, 'email', v_p.email, 'code', v_p.code,
    'status', v_p.status, 'joined', v_p.created_at,
    'clicks', v_p.clicks, 'leads', v_p.leads, 'orders', v_p.orders,
    'payout', case when v_has then jsonb_build_object(
        'method', v_pay.method,
        'bank_name', v_pay.bank_name, 'account_name', v_pay.account_name, 'account_number', v_pay.account_number,
        'crypto_name', v_pay.crypto_name, 'network', v_pay.network, 'wallet_address', v_pay.wallet_address
      ) end
  );
end $$;

-- Adds or removes one lead or one order for a partner. Never goes below zero. Returns the new counts, or null.
create or replace function public.admin_adjust(p_code text, p_field text, p_delta int)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare
  v_code  text := upper(btrim(coalesce(p_code, '')));
  v_admin text := lower(auth.jwt() ->> 'email');
  v_p     public.partners;
begin
  if not public.is_admin() then raise exception 'not_admin' using errcode = '42501'; end if;
  if v_code !~ '^[A-Z0-9]{3,16}$' or p_field not in ('leads', 'orders') or p_delta not in (1, -1) then
    raise exception 'invalid_input' using errcode = '22023';
  end if;

  if p_field = 'leads' then
    update public.partners set leads = greatest(leads + p_delta, 0) where code = v_code returning * into v_p;
  else
    update public.partners set orders = greatest(orders + p_delta, 0) where code = v_code returning * into v_p;
  end if;
  if not found then return null; end if;

  insert into public.admin_log (admin_email, action, partner_code, detail)
  values (v_admin, p_field || case when p_delta > 0 then ' +1' else ' -1' end, v_code, v_p.leads || ' leads / ' || v_p.orders || ' orders');

  return jsonb_build_object('code', v_p.code, 'first_name', v_p.first_name, 'clicks', v_p.clicks, 'leads', v_p.leads, 'orders', v_p.orders);
end $$;

-- Who may run what: signed-in users can call these, and each one checks is_admin() itself.
revoke all on function public.is_admin()                           from public, anon, authenticated;
revoke all on function public.admin_find_partner(text)             from public, anon, authenticated;
revoke all on function public.admin_adjust(text, text, int)        from public, anon, authenticated;
grant execute on function public.is_admin()                        to authenticated;
grant execute on function public.admin_find_partner(text)          to authenticated;
grant execute on function public.admin_adjust(text, text, int)     to authenticated;

-- ---------------------------------------------------------------------------------------------------------------
-- Who is an admin: edit this list, then run it. To remove someone: delete from public.admins where email = '...';
-- ---------------------------------------------------------------------------------------------------------------
insert into public.admins (email) values
  ('millise112@gmail.com'),
  ('hello@emmystack01.com')
on conflict do nothing;
