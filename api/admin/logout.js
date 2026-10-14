// POST /api/admin/logout  ->  ends the session and clears the cookies.
import { guardPost, send, auth, clearSession, accessCookie } from "../_lib/admin.js";

export default async function handler(req, res) {
  if (!guardPost(req, res)) return;
  const at = accessCookie(req);
  if (at) { try { await auth("/logout?scope=local", { method: "POST", token: at }); } catch (e) { console.error("logout upstream", e); } }
  clearSession(req, res);
  return send(res, 200, { ok: true });
}
