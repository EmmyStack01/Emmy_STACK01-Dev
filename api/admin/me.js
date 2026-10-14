// GET /api/admin/me  ->  { admin: true, email } when the browser holds a valid admin session.
import { send, requireAdmin } from "../_lib/admin.js";

export default async function handler(req, res) {
  if (req.method !== "GET") { res.setHeader("Allow", "GET"); return send(res, 405, { error: "Method not allowed." }); }
  try {
    const s = await requireAdmin(req, res); if (!s) return;
    return send(res, 200, { admin: true, email: s.user?.email || "" });
  } catch (e) { console.error("me failed", e); return send(res, 502, { error: "Something went wrong. Try again." }); }
}
