/* Partner Desk: find a partner by code / email / referral link, then add or remove a lead or an order. */
(() => {
  const $ = (id) => document.getElementById(id);
  let partner = null, busy = false;

  const copyText = async (text) => {
    try { await navigator.clipboard.writeText(text); return true; }
    catch (e) {
      const t = document.createElement("textarea"); t.value = text; t.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(t); t.select();
      let ok = false; try { ok = document.execCommand("copy"); } catch (x) {} t.remove(); return ok;
    }
  };
  const flash = (btn, ok) => {
    const icon = btn.querySelector("i"), old = icon ? icon.className : "";
    if (icon) icon.className = ok ? "ri-check-line" : "ri-error-warning-line";
    btn.classList.toggle("done", ok);
    setTimeout(() => { if (icon) icon.className = old; btn.classList.remove("done"); }, 1600);
  };

  const fill = (id, v) => { $(id).textContent = v || "—"; };
  const render = (p) => {
    partner = p;
    $("rName").textContent = `${p.first_name} ${p.last_name}`.trim();
    $("rJoined").textContent = p.joined ? new Date(p.joined).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
    const st = $("rStatus"); st.textContent = p.status === "active" ? "Active" : "Suspended"; st.className = "badge " + (p.status === "active" ? "ok" : "bad");
    fill("rCode", p.code); fill("rEmail", p.email);
    $("rClicks").textContent = p.clicks ?? 0; $("rLeads").textContent = p.leads ?? 0; $("rOrders").textContent = p.orders ?? 0;

    const pay = p.payout;
    $("pBank").hidden = !(pay && pay.method === "bank"); $("pCrypto").hidden = !(pay && pay.method === "crypto");
    $("pNone").hidden = !!pay; $("copyAll").hidden = !pay;
    $("pMethod").hidden = !pay; if (pay) $("pMethod").textContent = pay.method === "bank" ? "Bank (Naira)" : "Crypto";
    if (pay && pay.method === "bank") { fill("pBankName", pay.bank_name); fill("pAccName", pay.account_name); fill("pAccNo", pay.account_number); }
    if (pay && pay.method === "crypto") { fill("pCoin", pay.crypto_name); fill("pNet", pay.network); fill("pWallet", pay.wallet_address); }
    $("result").hidden = false;
  };

  const allDetails = () => {
    const p = partner, pay = p.payout, L = [`${p.first_name} ${p.last_name} (${p.code})`, p.email];
    if (pay && pay.method === "bank") L.push(`Bank: ${pay.bank_name || ""}`, `Account name: ${pay.account_name || ""}`, `Account number: ${pay.account_number || ""}`);
    if (pay && pay.method === "crypto") L.push(`Coin: ${pay.crypto_name || ""}`, `Network: ${pay.network || ""}`, `Wallet: ${pay.wallet_address || ""}`);
    return L.join("\n");
  };

  const find = async (e) => {
    e.preventDefault();
    const msg = $("findMsg"), btn = $("findBtn"), q = $("q").value.trim();
    if (q.length < 3) return Admin.say(msg, "Enter a partner code, email or referral link.", "err");
    btn.disabled = true; Admin.say(msg, "Searching…"); $("adjMsg").textContent = "";
    try {
      const r = await Admin.api("/api/admin/find", { query: q });
      if (!r.ok) { $("result").hidden = true; partner = null; return Admin.say(msg, r.data.error || "Search failed.", "err"); }
      if (!r.data.partner) { $("result").hidden = true; partner = null; return Admin.say(msg, "No partner found for that code or email.", "err"); }
      Admin.say(msg, ""); render(r.data.partner);
      $("result").scrollIntoView({ behavior: "smooth", block: "nearest" });
    } catch (x) { Admin.say(msg, "Connection problem. Check your internet.", "err"); }
    finally { btn.disabled = false; }
  };

  const adjust = async (btn) => {
    if (!partner || busy) return;
    const field = btn.dataset.adjust, delta = Number(btn.dataset.delta), label = field === "leads" ? "lead" : "order", msg = $("adjMsg");
    if (delta < 0 && !confirm(`Remove one ${label} from ${partner.first_name} (${partner.code})?`)) return;
    busy = true; document.querySelectorAll("[data-adjust]").forEach((b) => { b.disabled = true; }); Admin.say(msg, "Saving…");
    try {
      const before = partner[field];
      const r = await Admin.api("/api/admin/adjust", { code: partner.code, field, delta });
      if (!r.ok) return Admin.say(msg, r.data.error || "Couldn't save the change.", "err");
      const p = r.data.partner; partner.leads = p.leads; partner.orders = p.orders; partner.clicks = p.clicks;
      $("rLeads").textContent = p.leads; $("rOrders").textContent = p.orders; $("rClicks").textContent = p.clicks;
      const now = p[field];
      Admin.say(msg, now === before ? `Already at ${now}. Nothing changed.` : `${partner.first_name}: ${field} ${before} → ${now}`, now === before ? "" : "ok");
    } catch (x) { Admin.say(msg, "Connection problem. The change may not have saved. Search again to check.", "err"); }
    finally { busy = false; document.querySelectorAll("[data-adjust]").forEach((b) => { b.disabled = false; }); }
  };

  Admin.onReady(() => {
    $("findForm").addEventListener("submit", find);
    $("q").focus({ preventScroll: true });
    document.querySelectorAll("[data-adjust]").forEach((b) => b.addEventListener("click", () => adjust(b)));
    document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
      const t = $(b.dataset.copy).textContent; flash(b, t && t !== "—" ? await copyText(t) : false);
    }));
    $("copyAll").addEventListener("click", async () => { if (!partner) return; const ok = await copyText(allDetails()); const b = $("copyAll"), old = b.innerHTML; b.textContent = ok ? "Copied" : "Copy failed"; setTimeout(() => { b.innerHTML = old; }, 1600); });
  });
})();
