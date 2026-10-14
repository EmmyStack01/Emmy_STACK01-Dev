/* Password generator. Uses the browser's secure random source (crypto.getRandomValues). Nothing is stored or sent. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const LOWER = "abcdefghijklmnopqrstuvwxyz", UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ", NUM = "0123456789", SYM = "!@#$%&*-_=+?.";
  const LOOK = /[O0lI1]/g;
  const WORDS = ("able acid aged also area army atom aunt away baby back bake ball band bank barn base bath bead beam bear beef bell belt bend best bike bird blue boat bold bolt bone book boot born boss bowl brave bread brick brief bring brook brown brush build bulb cabin cable cake calm camel camp candy canoe cargo carry castle catch cedar chain chair chalk charm cheap check cheer chess chief child chill choir cider civic claim clay clean clear clerk click cliff climb clock cloud clover coach coast cobra coral cover craft crane crisp crown cubic curve daily dairy daisy dance dawn delta denim desk diary dingo diver dizzy dock dolly donut dove dozen draft dream dress drift drum dusty eagle early earth easel echo edge elbow elder ember empty enjoy equal even every exact extra fable fairy faith falcon fancy farm fast fern ferry field fiery final fine first fish flame flash fleet flint float flock flood floor flour fluid flute focus foggy forest forge fork fox frame fresh frost fruit fudge gadget galaxy game garden gate gecko gentle giant gift ginger glad glass gleam globe glory glove glow goat gold grace grain grand grape grass great green grid grove guard guest guide habit hammer happy harbor hawk hazel heart hedge helm herb heron hill hobby holly honey hood hope horse hotel house hover humble icon igloo image ink iron island ivory jade jelly jewel jolly jungle karma kayak kettle kind kite kiwi knack knee lace lake lamp lance lark laser lemon level lilac lily limit linen lion lively llama lodge logic lotus lucky lunar magic major maple marble march marsh mason meadow melon mercy merry metal might mint mirror misty model moose mossy motor mount mouse music noble north novel nutty oasis ocean olive onion opal orbit otter outer oval owl oxide paddle paint panda paper party peach pearl pedal pepper piano pilot pine pixel plain planet plum polar pond poppy porch pouch power prism proud pulse puppy quail quartz queen quick quiet quilt rabbit radar rain ranch rapid raven reach relay ridge river robin robot rocket rocky roof rose round royal ruby rustic sage sail salad sandy satin scarf scout seal shade shark sharp sheep shell shine shore sigma silk silver skate sky sleek slope small smart smile smoke snow solar solid sonic south spark spice spoon sport spring spruce square stable stamp star steam steel stone storm story sugar summit sunny swan sweet swift table tango teal tempo tender thorn tiger timber toast token topaz tower trail tree tulip tundra turtle twist ultra union urban valley vapor velvet verse vivid voice walnut water wave whale wheat willow wind winter wolf wonder wool yacht yellow yoga young zebra zesty zinc zone").split(/\s+/).filter((w, i, a) => w.length >= 3 && w.length <= 8 && a.indexOf(w) === i);

  const rnd = (n) => { const lim = Math.floor(4294967296 / n) * n, a = new Uint32Array(1); do { crypto.getRandomValues(a); } while (a[0] >= lim); return a[0] % n; };
  const pick = (s) => s[rnd(s.length)];
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  const els = { text: $("pwText"), bar: $("pwBar"), label: $("pwLabel"), bits: $("pwBits"), msg: $("pwMsg"), len: $("len"), lenOut: $("lenOut"), custom: $("customBox"), look: $("lookBox"), noLook: $("noLook"), copy: $("pwCopy") };
  const mode = () => (document.querySelector('input[name="mode"]:checked') || {}).value || "all";
  let current = "";

  // Random characters. Always includes at least one of every kind that is switched on.
  function randomPassword(len, sets) {
    const clean = (s) => (els.noLook.checked ? s.replace(LOOK, "") : s);
    const pools = sets.map(clean);
    const all = pools.join("");
    const chars = pools.map(pick);                         // one from each kind
    while (chars.length < len) chars.push(pick(all));
    return { pw: shuffle(chars).join(""), bits: len * Math.log2(all.length) };
  }

  // Memorable phrase: Word-Word-Word42 style, trimmed to hit the chosen length exactly when it can.
  function phrase(len) {
    const seps = "-_.!#$%&*+=?";
    let best = null;
    for (let t = 0; t < 6000; t++) {
      const n = len <= 12 || t >= 3000 ? 2 : 3;
      const sep = pick(seps), words = Array.from({ length: n }, () => { const w = pick(WORDS); return w[0].toUpperCase() + w.slice(1); });
      const d = 1 + rnd(3), num = String(rnd(10 ** d)).padStart(d, "0");
      const pw = words.join(sep) + sep + num;
      const bits = n * Math.log2(WORDS.length) + Math.log2(seps.length) + d * Math.log2(10);
      if (pw.length === len) return { pw, bits };
      if (pw.length < len && (!best || pw.length > best.pw.length)) best = { pw, bits };
    }
    return best || { pw: "Blue-Fox-42".slice(0, len), bits: 20 };
  }

  function make() {
    const len = +els.len.value, m = mode();
    let sets;
    if (m === "phrase") return phrase(len);
    if (m === "all") sets = [LOWER, UPPER, NUM, SYM];
    else if (m === "alnum") sets = [LOWER, UPPER, NUM];
    else { sets = []; if ($("cLetters").checked) sets.push(LOWER, UPPER); if ($("cNumbers").checked) sets.push(NUM); if ($("cSymbols").checked) sets.push(SYM); }
    return sets.length ? randomPassword(len, sets) : null;
  }

  function show(r) {
    els.text.textContent = "";
    if (!r) { els.text.textContent = "Pick at least one"; current = ""; els.bar.style.width = "0"; els.label.textContent = ""; els.bits.textContent = ""; els.copy.disabled = true; return; }
    els.copy.disabled = false; current = r.pw;
    const inner = document.createElement("div"); els.text.appendChild(inner);
    for (const ch of r.pw) { const s = document.createElement("span"); if (/[0-9]/.test(ch)) s.className = "d"; else if (!/[A-Za-z]/.test(ch)) s.className = "s"; s.textContent = ch; inner.appendChild(s); }
    const b = Math.round(r.bits);
    const [name, pct, col] = b < 40 ? ["Weak", 25, "#ff6b6b"] : b < 60 ? ["Fair", 50, "#ffb86b"] : b < 80 ? ["Strong", 75, "#9be564"] : ["Very strong", 100, "#34d399"];
    els.bar.style.width = pct + "%"; els.bar.style.background = col; els.label.textContent = name; els.bits.textContent = `about ${b} bits · ${r.pw.length} characters`;
  }

  function sync() {
    const m = mode();
    els.custom.hidden = m !== "custom"; els.look.hidden = m === "phrase";
    els.lenOut.textContent = els.len.value;
    show(make()); say("");
  }
  const say = (t, k) => { els.msg.textContent = t || ""; els.msg.className = "msg" + (k ? " " + k : ""); };

  async function copy() {
    if (!current) return;
    try { await navigator.clipboard.writeText(current); }
    catch (e) {
      const ta = document.createElement("textarea"); ta.value = current; ta.setAttribute("readonly", ""); ta.style.cssText = "position:fixed;top:0;left:0;opacity:0";
      document.body.appendChild(ta); ta.select(); let ok = false; try { ok = document.execCommand("copy"); } catch (_) {} ta.remove();
      if (!ok) return say("Could not copy. Press and hold the password to copy it.", "err");
    }
    const label = els.copy.querySelector("span"); label.textContent = "Copied"; say("Copied to clipboard.", "ok");
    setTimeout(() => { label.textContent = "Copy"; say(""); }, 1800);
  }

  Admin.onReady(() => {
    document.querySelectorAll('input[name="mode"]').forEach((r) => r.addEventListener("change", sync));
    ["cLetters", "cNumbers", "cSymbols"].forEach((id) => $(id).addEventListener("change", sync));
    els.noLook.addEventListener("change", sync);
    els.len.addEventListener("input", sync);
    $("pwNew").addEventListener("click", () => { show(make()); say(""); });
    els.copy.addEventListener("click", copy);
    sync();
  });
})();
