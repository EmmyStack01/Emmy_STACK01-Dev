/* Shared admin shell: session check, email-code sign-in, sign out. Every tool page loads this first.
   Tools use window.Admin.api(...) and window.Admin.onReady(fn). The browser never holds a password or token:
   the server keeps the session in an httpOnly cookie. */
(() => {
  const $ = (id) => document.getElementById(id);
  const say = (el, text, kind) => { el.textContent = text || ""; el.className = el.className.replace(/\b(err|ok)\b/g, "").trim() + (kind ? " " + kind : ""); };

  const panes = { loading: $("loading"), gate: $("gate"), app: $("app") };
  const view = (name) => {
    Object.entries(panes).forEach(([k, el]) => { el.hidden = k !== name; });
    const signedIn = name === "app";
    $("who").hidden = !signedIn; $("tabs").hidden = !signedIn;
  };

  let isReady = false; const waiting = [];
  const lock = (message) => {                 // back to the sign-in gate (session ended or never started)
    isReady = false; view("gate");
    if (message) say($("aEmailMsg"), message, "err");
    $("aEmailForm").hidden = false; $("aCodeForm").hidden = true;
  };

  const api = async (path, body) => {
    const opts = body === undefined ? { credentials: "same-origin" } : { method: "POST", credentials: "same-origin", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) };
    const res = await fetch(path, opts);
    let data = {}; try { data = await res.json(); } catch (e) {}
    const auth = path === "/api/admin/otp" || path === "/api/admin/verify";
    if (!auth && (res.status === 401 || res.status === 403) && path !== "/api/admin/logout") lock("Your session ended. Please sign in again.");
    return { ok: res.ok, status: res.status, data };
  };

  window.Admin = { api, say, onReady(fn) { isReady ? fn() : waiting.push(fn); } };

  const enter = (email) => {
    $("whoEmail").textContent = email || "";
    view("app"); isReady = true; while (waiting.length) waiting.shift()();
  };

  /* Sign in: email -> code */
  let pendingEmail = "", cool = 0;
  const cooldown = (secs) => {
    const b = $("aResend"); clearInterval(cool); b.disabled = true; let left = secs; b.textContent = `Send a new code (${left}s)`;
    cool = setInterval(() => { left -= 1; if (left <= 0) { clearInterval(cool); b.disabled = false; b.textContent = "Send a new code"; } else b.textContent = `Send a new code (${left}s)`; }, 1000);
  };
  const sendCode = async (msg) => {
    const r = await api("/api/admin/otp", { email: pendingEmail });
    if (!r.ok) { say(msg, r.data.error || "We couldn't send the code.", "err"); return false; }
    return true;
  };

  $("aEmailForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("aEmailMsg"), btn = $("aEmailBtn");
    if (!$("aEmail").checkValidity()) return say(msg, "Please enter a valid email address.", "err");
    pendingEmail = $("aEmail").value.trim(); btn.disabled = true; btn.textContent = "Sending…"; say(msg, "");
    try {
      if (await sendCode(msg)) { $("aSentTo").textContent = pendingEmail; $("aOtp").value = ""; say($("aCodeMsg"), ""); $("aEmailForm").hidden = true; $("aCodeForm").hidden = false; $("aOtp").focus(); cooldown(60); }
    } catch (x) { say(msg, "Connection problem. Check your internet.", "err"); }
    finally { btn.disabled = false; btn.textContent = "Email me a code"; }
  });

  $("aCodeForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const msg = $("aCodeMsg"), btn = $("aCodeBtn");
    if (!$("aOtp").checkValidity()) return say(msg, "Enter the code from your email.", "err");
    btn.disabled = true; btn.textContent = "Checking…"; say(msg, "");
    try {
      const r = await api("/api/admin/verify", { email: pendingEmail, code: $("aOtp").value.trim() });
      if (r.ok) enter(r.data.email || pendingEmail);
      else say(msg, r.data.error || "That code didn't work.", "err");
    } catch (x) { say(msg, "Connection problem. Check your internet.", "err"); }
    finally { btn.disabled = false; btn.textContent = "Sign in"; }
  });
  $("aResend").addEventListener("click", async () => {
    const msg = $("aCodeMsg"); say(msg, "");
    try { if (await sendCode(msg)) { say(msg, "A new code is on its way.", "ok"); cooldown(60); } } catch (x) { say(msg, "Connection problem. Check your internet.", "err"); }
  });
  $("aChange").addEventListener("click", () => { clearInterval(cool); $("aCodeForm").hidden = true; $("aEmailForm").hidden = false; $("aEmail").focus(); });

  $("logoutBtn").addEventListener("click", async () => {
    try { await api("/api/admin/logout", {}); } catch (x) {}
    location.href = "/";
  });

  /* Start: ask the server who is signed in */
  (async () => {
    try {
      const r = await api("/api/admin/me");
      if (r.ok && r.data.admin) enter(r.data.email); else lock(r.status === 403 ? "This email is not authorised for admin tools." : "");
    } catch (x) { lock("Couldn't reach the server. Check your internet and refresh."); }
  })();
})();
