// api/_lib/admin.js — shared helpers for the admin API routes (dev.emmystack01.com).
// The leading underscore keeps Vercel from turning this file into a route.
//
// Environment variables: SUPABASE_URL, SUPABASE_ANON_KEY (publishable key), optional ALLOWED_ORIGINS.
// This site never holds a secret key: the database itself checks that the signed-in email is in public.admins.

const SITE = "https://dev.emmystack01.com";
const AT = "adm_at", RT = "adm_rt";               // access and refresh token cookies (httpOnly)
const COOKIE_PATH = "/api/admin";
const REFRESH_MAX_AGE = 60 * 60 * 12;             // admins sign in again after 12 hours

export function send(res, status, body) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(status).json(body);
}

/* ---------- request guards ---------- */
const isLocal = (host) => /^(localhost|127\.0\.0\.1)(:|$)/.test(host || "");
const allowedOrigins = (req) => {
  const list = (process.env.ALLOWED_ORIGINS || SITE).split(",").map((s) => s.trim()).filter(Boolean);
  if (req.headers.host) {
    list.push(`https://${req.headers.host}`);
    if (isLocal(req.headers.host)) list.push(`http://${req.headers.host}`);
  }
  return list;
};

// POST only, JSON only, Origin must be ours. Returns the parsed body, or null after replying.
export function guardPost(req, res) {
  if (req.method !== "POST") { res.setHeader("Allow", "POST"); send(res, 405, { error: "Method not allowed." }); return null; }
  const origin = req.headers.origin;
  if (!origin || !allowedOrigins(req).includes(origin)) { send(res, 403, { error: "Request blocked." }); return null; }
  if (!/^application\/json\b/i.test(req.headers["content-type"] || "")) { send(res, 415, { error: "Unsupported request." }); return null; }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== "object" || Array.isArray(body)) { send(res, 400, { error: "Invalid request." }); return null; }
  return body;
}

/* Best-effort throttle (per warm instance). Add real limits in Vercel > Firewall too. */
const hits = new Map();
export function throttle(key, max, windowMs) {
  const now = Date.now(), entry = (hits.get(key) || []).filter((t) => now - t < windowMs);
  entry.push(now); hits.set(key, entry);
  if (hits.size > 2000) for (const [k, v] of hits) if (!v.some((t) => now - t < windowMs)) hits.delete(k);
  return entry.length <= max;
}
export const clientIp = (req) => String(req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket?.remoteAddress || "").split(",")[0].trim();

/* ---------- input ---------- */
export function normEmail(v) {
  const e = String(v || "").trim().toLowerCase();
  return e.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : "";
}
export const normCode = (v) => { const c = String(v || "").replace(/\s+/g, ""); return /^\d{6,10}$/.test(c) ? c : ""; };
export const clean = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, max);

/* ---------- cookies ---------- */
const parseCookies = (req) => Object.fromEntries(String(req.headers.cookie || "").split(";").map((p) => p.trim()).filter(Boolean).map((p) => { const i = p.indexOf("="); return [p.slice(0, i), decodeURIComponent(p.slice(i + 1))]; }));
const secure = (req) => !isLocal(req.headers.host);
function addCookie(res, line) { const prev = res.getHeader("Set-Cookie"); res.setHeader("Set-Cookie", [].concat(prev || [], line)); }
const cookie = (req, name, value, maxAge) => `${name}=${encodeURIComponent(value)}; Path=${COOKIE_PATH}; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure(req) ? "; Secure" : ""}`;

export function setSession(req, res, s) {
  addCookie(res, cookie(req, AT, s.access_token, Math.max(60, Math.min(Number(s.expires_in) || 3600, REFRESH_MAX_AGE))));
  addCookie(res, cookie(req, RT, s.refresh_token, REFRESH_MAX_AGE));
}
export function clearSession(req, res) { addCookie(res, cookie(req, AT, "", 0)); addCookie(res, cookie(req, RT, "", 0)); }
export const accessCookie = (req) => parseCookies(req)[AT] || "";

/* ---------- Supabase ---------- */
const conf = () => {
  const url = String(process.env.SUPABASE_URL || "").replace(/\/+$/, ""), anon = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !anon) throw new Error("SUPABASE_URL or SUPABASE_ANON_KEY is not set");
  return { url, anon };
};
async function call(url, { method = "GET", headers = {}, body } = {}) {
  const r = await fetch(url, { method, headers: { "Content-Type": "application/json", ...headers }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(15000) });
  let data = null; try { data = await r.json(); } catch { /* empty body */ }
  return { status: r.status, data };
}
export function auth(path, { method = "GET", body, token } = {}) {
  const { url, anon } = conf();
  return call(`${url}/auth/v1${path}`, { method, body, headers: { apikey: anon, ...(token ? { Authorization: `Bearer ${token}` } : {}) } });
}
// Calls a database function as the signed-in admin. Row level security and is_admin() apply.
export function rpc(name, body, token) {
  const { url, anon } = conf();
  return call(`${url}/rest/v1/rpc/${name}`, { method: "POST", body: body || {}, headers: { apikey: anon, Authorization: `Bearer ${token}` } });
}

/* Returns { token, user } for a signed-in user (refreshing when needed), or null. Throws on network errors. */
export async function getSession(req, res) {
  const c = parseCookies(req);
  if (c[AT]) {
    const r = await auth("/user", { token: c[AT] });
    if (r.status === 200 && r.data?.id) return { token: c[AT], user: r.data };
  }
  if (c[RT]) {
    const r = await auth("/token?grant_type=refresh_token", { method: "POST", body: { refresh_token: c[RT] } });
    if (r.status === 200 && r.data?.access_token) { setSession(req, res, r.data); return { token: r.data.access_token, user: r.data.user }; }
  }
  if (c[AT] || c[RT]) clearSession(req, res);
  return null;
}

/* Signed in AND an admin, or replies 401/403 and returns null. */
export async function requireAdmin(req, res) {
  const s = await getSession(req, res);
  if (!s) { send(res, 401, { error: "Please sign in." }); return null; }
  const r = await rpc("is_admin", {}, s.token);
  if (r.status !== 200) { console.error("is_admin", r.status, r.data); send(res, 502, { error: "We couldn't check your access. Try again." }); return null; }
  if (r.data !== true) { clearSession(req, res); send(res, 403, { error: "This email is not authorised for admin tools." }); return null; }
  return s;
}
