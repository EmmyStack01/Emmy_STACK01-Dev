// POST /api/admin/find  { query }  ->  { partner } for an affiliate code (or email), including payout details.
import { guardPost, send, throttle, clientIp, clean, requireAdmin, rpc } from "../_lib/admin.js";

// Accepts a code, an email, or a pasted referral link (…/go/?id=CODE).
function readQuery(v) {
  const q = clean(v, 254);
  const m = /[?&](?:id|partner)=([A-Za-z0-9]+)/i.exec(q);
  return m ? m[1] : q.replace(/\s+/g, "");
}

export default async function handler(req, res) {
  const body = guardPost(req, res); if (!body) return;
  if (!throttle(`find:${clientIp(req)}`, 60, 60 * 1000)) return send(res, 429, { error: "Slow down for a moment." });
  const query = readQuery(body.query);
  if (query.length < 3) return send(res, 400, { error: "Enter a partner code or email." });
  try {
    const s = await requireAdmin(req, res); if (!s) return;
    const r = await rpc("admin_find_partner", { p_query: query }, s.token);
    if (r.status >= 400) {
      const msg = String(r.data?.message || "");
      if (msg === "not_admin") return send(res, 403, { error: "This email is not authorised for admin tools." });
      if (msg === "invalid_input") return send(res, 400, { error: "Enter a partner code or email." });
      console.error("find", r.status, r.data); return send(res, 502, { error: "Search failed. Please try again." });
    }
    return send(res, 200, { partner: r.data || null });
  } catch (e) { console.error("find failed", e); return send(res, 502, { error: "Search failed. Please try again." }); }
}
