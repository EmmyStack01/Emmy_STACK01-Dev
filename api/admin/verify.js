// POST /api/admin/verify  { email, code }  ->  signs in (httpOnly cookies) only if the email is an admin.
import { guardPost, send, throttle, clientIp, normEmail, normCode, auth, rpc, setSession, clearSession } from "../_lib/admin.js";

export default async function handler(req, res) {
  const body = guardPost(req, res); if (!body) return;
  const email = normEmail(body.email), code = normCode(body.code);
  if (!email || !code) return send(res, 400, { error: "Enter the code from your email." });
  if (!throttle(`verify:${clientIp(req)}`, 10, 10 * 60 * 1000) || !throttle(`verify:${email}`, 6, 10 * 60 * 1000)) return send(res, 429, { error: "Too many attempts. Please wait a few minutes." });
  try {
    const v = await auth("/verify", { method: "POST", body: { type: "email", email, token: code } });
    if (v.status !== 200 || !v.data?.access_token) {
      if (v.status >= 500) return send(res, 502, { error: "We couldn't check the code. Please try again." });
      return send(res, 401, { error: "That code is incorrect or has expired." });
    }
    const a = await rpc("is_admin", {}, v.data.access_token);
    if (a.status !== 200) { console.error("is_admin", a.status, a.data); return send(res, 502, { error: "We couldn't check your access. Please try again." }); }
    if (a.data !== true) { clearSession(req, res); return send(res, 403, { error: "This email is not authorised for admin tools." }); }
    setSession(req, res, v.data);
    return send(res, 200, { ok: true, email });
  } catch (e) { console.error("verify failed", e); return send(res, 502, { error: "We couldn't check the code. Please try again." }); }
}
