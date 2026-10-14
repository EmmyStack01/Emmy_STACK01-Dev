// POST /api/admin/adjust  { code, field: "leads" | "orders", delta: 1 | -1 }  ->  { partner } with the new counts.
import { guardPost, send, throttle, clientIp, clean, requireAdmin, rpc } from "../_lib/admin.js";

export default async function handler(req, res) {
  const body = guardPost(req, res); if (!body) return;
  if (!throttle(`adjust:${clientIp(req)}`, 60, 60 * 1000)) return send(res, 429, { error: "Slow down for a moment." });
  const code = clean(body.code, 16).toUpperCase(), field = body.field, delta = Number(body.delta);
  if (!/^[A-Z0-9]{3,16}$/.test(code) || (field !== "leads" && field !== "orders") || (delta !== 1 && delta !== -1)) return send(res, 400, { error: "Invalid request." });
  try {
    const s = await requireAdmin(req, res); if (!s) return;
    const r = await rpc("admin_adjust", { p_code: code, p_field: field, p_delta: delta }, s.token);
    if (r.status >= 400) {
      const msg = String(r.data?.message || "");
      if (msg === "not_admin") return send(res, 403, { error: "This email is not authorised for admin tools." });
      if (msg === "invalid_input") return send(res, 400, { error: "Invalid request." });
      console.error("adjust", r.status, r.data); return send(res, 502, { error: "Couldn't save the change. Please try again." });
    }
    if (!r.data) return send(res, 404, { error: "No partner with that code." });
    return send(res, 200, { partner: r.data });
  } catch (e) { console.error("adjust failed", e); return send(res, 502, { error: "Couldn't save the change. Please try again." }); }
}
