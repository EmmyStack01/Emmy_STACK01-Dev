/* Brand Asset Studio.
   - Everything happens in the browser. The logo and settings never leave this device (they are remembered in this browser only).
   - The right side shows five real A4 pages. The PDF is made from those same pages, so what you see is what you download.
   - Fonts come from Google Fonts and are fetched by your browser when you pick them. */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const PW = 794, PH = 1122;                         // A4 at 96 dpi (PH is 1 px short on purpose so each page is exactly one PDF page)
  const STORE = "emmy-brand-asset-v1";
  const ROLES = ["Primary", "Secondary", "Accent", "Neutral", "Background", "Text"];
  const MAXC = 7;

  /* ------------------------------------------------------------------ fonts */
  // name | category (s sans, f serif, d display, h handwriting, m mono) | weights (1-9 = 100-900)
  const FONT_SRC = `Inter|s|1-9
Roboto|s|1-9
Open Sans|s|3-8
Montserrat|s|1-9
Lato|s|1,3,4,7,9
Poppins|s|1-9
Manrope|s|2-8
DM Sans|s|1-9
Nunito|s|2-9
Raleway|s|1-9
Work Sans|s|1-9
Rubik|s|3-9
Barlow|s|1-9
Barlow Condensed|s|1-9
Barlow Semi Condensed|s|1-9
Source Sans 3|s|2-9
PT Sans|s|4,7
Archivo|s|1-9
Space Grotesk|s|3-7
Sora|s|1-8
Outfit|s|1-9
Plus Jakarta Sans|s|2-8
Figtree|s|3-9
Lexend|s|1-9
Urbanist|s|1-9
Mulish|s|2-9
Karla|s|2-8
Cabin|s|4-7
Quicksand|s|3-7
Josefin Sans|s|1-7
Titillium Web|s|2,3,4,6,7,9
Fira Sans|s|1-9
Noto Sans|s|1-9
IBM Plex Sans|s|1-7
Oswald|s|2-7
Roboto Condensed|s|1-9
Heebo|s|1-9
Hind|s|3-7
Ubuntu|s|3,4,5,7
Overpass|s|1-9
Red Hat Display|s|3-9
Libre Franklin|s|1-9
Chivo|s|1-9
Epilogue|s|1-9
Be Vietnam Pro|s|1-9
Onest|s|1-9
Bricolage Grotesque|s|2-8
Instrument Sans|s|4-7
Kanit|s|1-9
Prompt|s|1-9
Exo 2|s|1-9
Syne|s|4-8
Saira Condensed|s|1-9
Teko|s|3-7
Rajdhani|s|3-7
Assistant|s|2-8
Catamaran|s|1-9
Yanone Kaffeesatz|s|2-7
Comfortaa|s|3-7
Fredoka|s|3-7
Playfair Display|f|4-9
Merriweather|f|3,4,7,9
Lora|f|4-7
Source Serif 4|f|2-9
PT Serif|f|4,7
Libre Baskerville|f|4,7
Cormorant Garamond|f|3-7
Cormorant|f|3-7
EB Garamond|f|4-8
Crimson Text|f|4,6,7
Crimson Pro|f|2-9
Bitter|f|1-9
Arvo|f|4,7
Zilla Slab|f|3-7
Roboto Slab|f|1-9
Noto Serif|f|1-9
IBM Plex Serif|f|1-7
DM Serif Display|f|4
Spectral|f|2-8
Alegreya|f|4-9
Vollkorn|f|4-9
Cardo|f|4,7
Cinzel|f|4-9
Old Standard TT|f|4,7
Marcellus|f|4
Fraunces|f|1-9
Newsreader|f|2-8
Domine|f|4-7
Gelasio|f|4-7
Bebas Neue|d|4
Anton|d|4
Archivo Black|d|4
Alfa Slab One|d|4
Abril Fatface|d|4
Righteous|d|4
Staatliches|d|4
Bungee|d|4
Unbounded|d|2-9
Big Shoulders Display|d|1-9
Lobster|h|4
Pacifico|h|4
Dancing Script|h|4-7
Caveat|h|4-7
Permanent Marker|h|4
Satisfy|h|4
Great Vibes|h|4
Shadows Into Light|h|4
Kalam|h|3,4,7
JetBrains Mono|m|1-8
Fira Code|m|3-7
Roboto Mono|m|1-7
Space Mono|m|4,7
Inconsolata|m|2-9
Source Code Pro|m|2-9
IBM Plex Mono|m|1-7
DM Mono|m|3,4,5
Ubuntu Mono|m|4,7
Courier Prime|m|4,7
Overpass Mono|m|3-7`;
  const expandW = (t) => { const out = []; t.split(",").forEach((p) => { const m = p.match(/^(\d)-(\d)$/); if (m) for (let i = +m[1]; i <= +m[2]; i++) out.push(i * 100); else out.push(+p * 100); }); return out; };
  const FONTS = FONT_SRC.split("\n").map((l) => { const [name, cat, w] = l.split("|"); return { name, cat, w: expandW(w) }; });
  const FONT = (n) => FONTS.find((f) => f.name.toLowerCase() === String(n).toLowerCase());
  const CATLBL = { s: "Sans", f: "Serif", d: "Display", h: "Script", m: "Mono" };
  const FALLBACK = { s: "sans-serif", f: "serif", d: "sans-serif", h: "cursive", m: "monospace" };
  const WNAME = { 100: "Thin", 200: "ExtraLight", 300: "Light", 400: "Regular", 500: "Medium", 600: "SemiBold", 700: "Bold", 800: "ExtraBold", 900: "Black", 1000: "Black" };
  const SLOTS = [
    { id: "headline", label: "Headline", use: "H1, H2" },
    { id: "sub", label: "Subheading", use: "H3, H4" },
    { id: "body", label: "Body", use: "Paragraph, UI" },
    { id: "accent", label: "Accent / Mono", use: "Codes, quotes", optional: true },
  ];

  const loaded = new Set();
  function loadFont(family) {
    const f = FONT(family); if (!f || loaded.has(f.name)) return;
    loaded.add(f.name);
    const fam = f.name.replace(/ /g, "+");
    const mk = (spec) => { const l = document.createElement("link"); l.rel = "stylesheet"; l.href = "https://fonts.googleapis.com/css2?family=" + fam + spec + "&display=swap"; return l; };
    const l = mk(":wght@" + f.w.join(";"));
    l.onerror = () => { const l2 = mk(""); l.replaceWith(l2); };      // if Google rejects the weight list, fall back to the default weight
    document.head.appendChild(l);
  }
  const fcss = (slot) => {
    const s = state.fonts[slot], f = FONT(s.family);
    const fam = f ? `'${f.name}',${FALLBACK[f.cat]}` : "sans-serif";
    return `font-family:${fam};font-weight:${s.weight};`;
  };
  const nearestW = (f, w) => f.w.reduce((a, b) => (Math.abs(b - w) < Math.abs(a - w) ? b : a), f.w[0]);

  function pairing(a, b) {
    const A = FONT(a), B = FONT(b); if (!A || !B) return null;
    if (A.name === B.name) return { l: "ok", t: "Same family. Contrast it with weight and size." };
    const x = A.cat, y = B.cat;
    if (x === "m" || y === "m") return x === y ? { l: "mid", t: "Two mono fonts. Keep just one." } : { l: "ok", t: "Great pairing! Mono is a good accent." };
    if ((x === "d" || x === "h") && (y === "d" || y === "h")) return { l: "no", t: "Two decorative fonts compete. Use one." };
    if ((x === "f" && y === "s") || (x === "s" && y === "f")) return { l: "ok", t: "Great pairing! Serif and sans contrast well." };
    if (x === "d" || y === "d") return { l: "ok", t: "Great pairing! Bold display with a calm font." };
    if (x === "h" || y === "h") return { l: "ok", t: "Good: script for flair, clean font for text." };
    if (x === "s" && y === "s") return { l: "mid", t: "Both sans. Add contrast with weight or width." };
    return { l: "mid", t: "Two serifs can clash. A sans body may read better." };
  }

  /* ----------------------------------------------------------------- colour */
  let cx;
  function parseColor(input) {
    let s = String(input == null ? "" : input).trim(); if (!s) return null;
    if (/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(s)) s = "#" + s;
    const tri = s.match(/^(\d{1,3})[\s,]+(\d{1,3})[\s,]+(\d{1,3})$/); if (tri) s = `rgb(${tri[1]},${tri[2]},${tri[3]})`;
    cx = cx || document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    cx.canvas.width = cx.canvas.height = 1;
    cx.fillStyle = "#010203"; cx.fillStyle = s;
    if (cx.fillStyle === "#010203" && s.replace(/\s/g, "").toLowerCase() !== "#010203") return null;
    cx.clearRect(0, 0, 1, 1); cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data; if (d[3] < 255) return null;
    return { r: d[0], g: d[1], b: d[2] };
  }
  const h2 = (n) => n.toString(16).padStart(2, "0");
  const toHex = (c) => "#" + h2(c.r) + h2(c.g) + h2(c.b);
  const fromHex = (h) => ({ r: parseInt(h.slice(1, 3), 16), g: parseInt(h.slice(3, 5), 16), b: parseInt(h.slice(5, 7), 16) });
  function toHsl({ r, g, b }) {
    r /= 255; g /= 255; b /= 255;
    const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn; let h = 0, s = 0;
    if (d) { s = d / (1 - Math.abs(2 * l - 1)); h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function toCmyk({ r, g, b }) {
    r /= 255; g /= 255; b /= 255; const k = 1 - Math.max(r, g, b);
    if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
    return { c: Math.round((1 - r - k) / (1 - k) * 100), m: Math.round((1 - g - k) / (1 - k) * 100), y: Math.round((1 - b - k) / (1 - k) * 100), k: Math.round(k * 100) };
  }
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = (h) => { const c = fromHex(h); return 0.2126 * lin(c.r) + 0.7152 * lin(c.g) + 0.0722 * lin(c.b); };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  const level = (r) => (r >= 7 ? "AAA" : r >= 4.5 ? "AA" : r >= 3 ? "AA Large" : "Fail");
  const lvlCls = (r) => (r >= 4.5 ? "ok" : r >= 3 ? "mid" : "no");
  const textOn = (h) => (ratio(h, "#ffffff") >= ratio(h, "#000000") ? "#ffffff" : "#000000");

  function hueName(h) {
    const c = fromHex(h), { h: H, s: S, l: L } = toHsl(c);
    if (L <= 8) return "Black"; if (L >= 95 && S < 40) return "White";
    if (S < 12) return L < 30 ? "Charcoal" : L < 62 ? "Grey" : "Silver";
    const n = H < 12 || H >= 345 ? "Red" : H < 40 ? "Orange" : H < 68 ? "Yellow" : H < 100 ? "Lime" : H < 160 ? "Green" : H < 180 ? "Teal" : H < 200 ? "Cyan" : H < 255 ? "Blue" : H < 290 ? "Purple" : H < 335 ? "Magenta" : "Rose";
    return n;
  }
  function toneWord(h) { const { s, l } = toHsl(fromHex(h)); return l < 25 ? "Deep" : l < 40 ? "Dark" : l > 80 ? "Soft" : l > 62 ? "Light" : s > 80 ? "Bright" : "Rich"; }
  function autoName(c) {
    const hn = hueName(c.hex);
    if (c.role === "Background") return lum(c.hex) > 0.8 ? "Background" : "Background " + hn;
    if (c.role === "Text") return "Text " + (lum(c.hex) < 0.2 ? "Dark" : hn);
    if (c.role === "Neutral") return "Neutral " + hn;
    return c.role + " " + hn;
  }
  const suggestNames = (c) => { const hn = hueName(c.hex); return [...new Set([autoName(c), toneWord(c.hex) + " " + hn, hn + " " + c.role, hn])]; };

  const GROUP = { Background: 0, Neutral: 0, Primary: 1, Secondary: 1, Accent: 2, Text: 2 };
  const TARGET = [60, 30, 10];
  function usage(colors) {
    const cnt = [[], [], []]; colors.forEach((c, i) => cnt[GROUP[c.role]].push(i));
    const act = [0, 1, 2].filter((g) => cnt[g].length), tot = act.reduce((a, g) => a + TARGET[g], 0);
    const raw = new Array(colors.length).fill(0);
    act.forEach((g) => cnt[g].forEach((i) => { raw[i] = (TARGET[g] * 100 / tot) / cnt[g].length; }));
    const fl = raw.map(Math.floor); let rem = 100 - fl.reduce((a, b) => a + b, 0);
    raw.map((v, i) => [v - Math.floor(v), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (rem > 0) { fl[i]++; rem--; } });
    return fl;
  }

  /* ------------------------------------------------------------------ state */
  const DEFAULT = () => ({
    name: "Emmy STACK01", tagline: "Build. Launch. Grow.", logo: null,
    colors: [
      { hex: "#2d66b4", name: "Primary Blue", auto: false, role: "Primary" },
      { hex: "#22386e", name: "Secondary Blue", auto: false, role: "Secondary" },
      { hex: "#00ccff", name: "Accent Cyan", auto: false, role: "Accent" },
      { hex: "#0b1020", name: "Dark", auto: false, role: "Text" },
      { hex: "#f7f9fc", name: "Background", auto: false, role: "Background" },
    ],
    fonts: {
      headline: { family: "Barlow Condensed", weight: 700 },
      sub: { family: "Barlow Condensed", weight: 600 },
      body: { family: "Manrope", weight: 400 },
      accent: { family: "JetBrains Mono", weight: 500, on: true },
    },
    lh: 1.6, ls: 0,
  });
  let state = DEFAULT();
  let logoUrl = null, logoAltUrl = null;               // blob: URLs used inside the pages

  function sanitize(s) {
    const d = DEFAULT(), o = { ...d };
    try {
      if (typeof s.name === "string") o.name = s.name.slice(0, 40);
      if (typeof s.tagline === "string") o.tagline = s.tagline.slice(0, 80);
      if (typeof s.logo === "string" && /^data:image\/(png|jpeg|webp);base64,/.test(s.logo)) o.logo = s.logo;
      if (Array.isArray(s.colors) && s.colors.length) {
        o.colors = s.colors.slice(0, MAXC).map((c) => ({ hex: /^#[0-9a-f]{6}$/i.test(c.hex) ? c.hex.toLowerCase() : "#888888", name: String(c.name || "").slice(0, 30), auto: !!c.auto, role: ROLES.includes(c.role) ? c.role : "Neutral" }));
      }
      SLOTS.forEach((sl) => {
        const f = s.fonts && s.fonts[sl.id], fm = f && FONT(f.family);
        if (fm) o.fonts[sl.id] = { family: fm.name, weight: nearestW(fm, +f.weight || 400), ...(sl.optional ? { on: f.on !== false } : {}) };
      });
      if (+s.lh >= 1.1 && +s.lh <= 2.2) o.lh = +s.lh;
      if (+s.ls >= -0.04 && +s.ls <= 0.2) o.ls = +s.ls;
    } catch (e) { /* keep defaults */ }
    return o;
  }
  function load() { try { const r = localStorage.getItem(STORE); if (r) state = sanitize(JSON.parse(r)); } catch (e) { /* private mode */ } }
  let saveT = 0;
  function save() { clearTimeout(saveT); saveT = setTimeout(() => { try { const s = { ...state }; if (s.logo && s.logo.length > 1.8e6) s.logo = null; localStorage.setItem(STORE, JSON.stringify(s)); } catch (e) { /* ignore */ } }, 400); }

  /* ------------------------------------------------------------------- logo */
  const say = (el, t, k) => { el.textContent = t || ""; el.className = "msg" + (k ? " " + k : ""); };
  const loadImg = (src) => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => rej(new Error("img")); i.src = src; });
  const blobOf = (cv) => new Promise((res) => cv.toBlob((b) => res(b), "image/png"));

  async function fileToPng(file) {
    let src, revoke = null;
    if (file.type === "image/svg+xml" || /\.svg$/i.test(file.name)) {
      let txt = await file.text();
      const doc = new DOMParser().parseFromString(txt, "image/svg+xml"), svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== "svg" || doc.getElementsByTagName("parsererror").length) throw new Error("bad svg");
      doc.querySelectorAll("script,foreignObject").forEach((n) => n.remove());
      const vb = (svg.getAttribute("viewBox") || "").split(/[\s,]+/).map(Number);
      const num = (v) => { const n = parseFloat(v); return isFinite(n) && !/%/.test(v || "") ? n : 0; };
      let w = num(svg.getAttribute("width")), h = num(svg.getAttribute("height"));
      if ((!w || !h) && vb.length === 4 && vb[2] > 0 && vb[3] > 0) { w = vb[2]; h = vb[3]; }
      if (!w || !h) { w = 1000; h = 1000; }
      const k = 1400 / Math.max(w, h);
      svg.setAttribute("width", String(Math.round(w * k))); svg.setAttribute("height", String(Math.round(h * k)));
      if (vb.length !== 4) svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      txt = new XMLSerializer().serializeToString(svg);
      src = URL.createObjectURL(new Blob([txt], { type: "image/svg+xml" })); revoke = src;
    } else { src = URL.createObjectURL(file); revoke = src; }
    try {
      const img = await loadImg(src);
      let w = img.naturalWidth, h = img.naturalHeight; if (!w || !h) throw new Error("size");
      const k = Math.min(1, 1400 / Math.max(w, h)); w = Math.max(1, Math.round(w * k)); h = Math.max(1, Math.round(h * k));
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h; cv.getContext("2d").drawImage(img, 0, 0, w, h);
      return cv.toDataURL("image/png");
    } finally { if (revoke) URL.revokeObjectURL(revoke); }
  }
  async function applyLogo() {
    if (logoUrl) URL.revokeObjectURL(logoUrl); if (logoAltUrl) URL.revokeObjectURL(logoAltUrl);
    logoUrl = logoAltUrl = null;
    if (state.logo) {
      try {
        const img = await loadImg(state.logo), cv = document.createElement("canvas");
        cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const c = cv.getContext("2d", { willReadFrequently: true }); c.drawImage(img, 0, 0);
        logoUrl = URL.createObjectURL(await blobOf(cv));
        const d = c.getImageData(0, 0, cv.width, cv.height), p = d.data;       // "wrong colours" copy for the Don't tile: swap the colour channels
        for (let i = 0; i < p.length; i += 4) { const r = p[i], g = p[i + 1], b = p[i + 2]; p[i] = g; p[i + 1] = b; p[i + 2] = r; }
        c.putImageData(d, 0, 0); logoAltUrl = URL.createObjectURL(await blobOf(cv));
      } catch (e) { state.logo = null; }
    }
    const pv = $("baLogoPv");
    pv.innerHTML = state.logo ? `<img alt="Your logo" src="${logoUrl}">` : `<span class="ba-ph">No logo yet</span>`;
    $("baLogoRm").hidden = !state.logo;
    $("baDropMain").textContent = state.logo ? "Logo added. Tap to replace" : "Drop a logo here or tap to upload";
  }
  async function takeFile(file) {
    const msg = $("baLogoMsg");
    if (!file) return;
    if (!/^image\/(png|svg\+xml|jpeg|webp)$/.test(file.type) && !/\.svg$/i.test(file.name)) return say(msg, "Please choose a PNG or SVG file.", "err");
    if (file.size > 8 * 1024 * 1024) return say(msg, "That file is over 8 MB.", "err");
    say(msg, "Reading logo…");
    try { state.logo = await fileToPng(file); await applyLogo(); say(msg, "Logo added.", "ok"); changed(); }
    catch (e) { say(msg, "Could not read that image. Try another file.", "err"); }
    setTimeout(() => { if (!msg.classList.contains("err")) say(msg, ""); }, 2500);
  }

  /* --------------------------------------------------------- controls: colours */
  const colorsEl = () => $("baColors");
  function rowHtml(c, i) {
    const only = state.colors.length <= 1;
    return `<div class="ba-c" data-i="${i}">
      <div class="ba-c-top">
        <label class="ba-pick" style="background:${c.hex}" aria-label="Pick colour ${i + 1}"><input type="color" data-f="pick" value="${c.hex}"></label>
        <input class="input mono" type="text" data-f="hex" value="${c.hex}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Colour ${i + 1} value: HEX, RGB, HSL or name">
        <button type="button" class="ba-del" data-f="del" aria-label="Delete colour ${i + 1}" ${only ? "disabled" : ""}><i class="ri-delete-bin-6-line" aria-hidden="true"></i></button>
      </div>
      <div class="ba-c-row2">
        <input class="input" type="text" data-f="name" value="${esc(c.name)}" maxlength="30" list="nl${i}" placeholder="Colour name" autocomplete="off" aria-label="Colour ${i + 1} name"><datalist id="nl${i}"></datalist>
        <select class="ba-sel" data-f="role" aria-label="Colour ${i + 1} role">${ROLES.map((r) => `<option${r === c.role ? " selected" : ""}>${r}</option>`).join("")}</select>
      </div>
      <div class="ba-vals" data-f="vals"></div>
      <div class="ba-ct" data-f="ct"></div>
    </div>`;
  }
  function refreshRow(i) {
    const row = colorsEl().querySelector(`.ba-c[data-i="${i}"]`); if (!row) return;
    const c = state.colors[i], rgb = fromHex(c.hex), hsl = toHsl(rgb), k = toCmyk(rgb);
    row.querySelector(".ba-pick").style.background = c.hex;
    row.querySelector('[data-f="pick"]').value = c.hex;
    row.querySelector('[data-f="vals"]').innerHTML = `<span><b>HEX</b>${c.hex.toUpperCase()}</span><span><b>RGB</b>${rgb.r}, ${rgb.g}, ${rgb.b}</span><span><b>HSL</b>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</span><span><b>CMYK</b>${k.c}, ${k.m}, ${k.y}, ${k.k}</span>`;
    const w = ratio(c.hex, "#ffffff"), b = ratio(c.hex, "#000000");
    row.querySelector('[data-f="ct"]').innerHTML = `<span class="ba-chip ${lvlCls(w)}" title="White text on this colour"><i style="background:#fff"></i>White ${w.toFixed(1)} · ${level(w)}</span><span class="ba-chip ${lvlCls(b)}" title="Black text on this colour"><i style="background:#000"></i>Black ${b.toFixed(1)} · ${level(b)}</span>`;
    row.querySelector("datalist").innerHTML = suggestNames(c).map((n) => `<option value="${esc(n)}"></option>`).join("");
  }
  function buildColors() {
    colorsEl().innerHTML = state.colors.map(rowHtml).join("");
    state.colors.forEach((_, i) => refreshRow(i));
    $("baAddColor").disabled = state.colors.length >= MAXC;
    $("baCount").textContent = state.colors.length + "/" + MAXC;
    paletteBars();
  }
  function paletteBars() {
    $("baPalBar").innerHTML = state.colors.map((c) => `<i style="background:${c.hex}"></i>`).join("");
    const u = usage(state.colors);
    $("baUseBar").innerHTML = state.colors.map((c, i) => u[i] ? `<i style="flex:${u[i]};background:${c.hex};color:${textOn(c.hex)}">${u[i]}%</i>` : "").join("");
    $("baUseLeg").textContent = "60% Background / Neutral · 30% Primary / Secondary · 10% Accent / Text";
  }
  function colorEvents() {
    const root = colorsEl();
    const idx = (e) => { const r = e.target.closest(".ba-c"); return r ? +r.dataset.i : -1; };
    root.addEventListener("input", (e) => {
      const i = idx(e); if (i < 0) return; const f = e.target.dataset.f, c = state.colors[i];
      if (f === "hex") {
        const p = parseColor(e.target.value); e.target.classList.toggle("bad", !p && e.target.value.trim() !== "");
        if (p) { c.hex = toHex(p); if (c.auto) { c.name = autoName(c); root.querySelector(`.ba-c[data-i="${i}"] [data-f="name"]`).value = c.name; } refreshRow(i); paletteBars(); changed(); }
      } else if (f === "pick") {
        c.hex = e.target.value.toLowerCase(); if (c.auto) { c.name = autoName(c); root.querySelector(`.ba-c[data-i="${i}"] [data-f="name"]`).value = c.name; }
        root.querySelector(`.ba-c[data-i="${i}"] [data-f="hex"]`).value = c.hex; root.querySelector(`.ba-c[data-i="${i}"] [data-f="hex"]`).classList.remove("bad");
        refreshRow(i); paletteBars(); changed();
      } else if (f === "name") { c.name = e.target.value.slice(0, 30); c.auto = false; changed(); }
    });
    root.addEventListener("change", (e) => {
      const i = idx(e); if (i < 0) return; const f = e.target.dataset.f, c = state.colors[i];
      if (f === "hex") { e.target.value = c.hex; e.target.classList.remove("bad"); }          // tidy: show the cleaned HEX, or put back the last good one
      if (f === "name" && !e.target.value.trim()) { c.auto = true; c.name = autoName(c); e.target.value = c.name; changed(); }
      if (f === "role") {
        c.role = e.target.value;
        if (c.auto || !c.name) { c.auto = true; c.name = autoName(c); root.querySelector(`.ba-c[data-i="${i}"] [data-f="name"]`).value = c.name; }
        refreshRow(i); paletteBars(); changed();
      }
    });
    root.addEventListener("click", (e) => {
      const b = e.target.closest('[data-f="del"]'); if (!b || b.disabled) return;
      const i = idx(e); if (state.colors.length <= 1) return;
      state.colors.splice(i, 1); buildColors(); changed();
    });
    $("baAddColor").addEventListener("click", () => {
      if (state.colors.length >= MAXC) return;
      const used = state.colors.map((c) => c.role), role = ROLES.find((r) => !used.includes(r)) || "Neutral";
      const start = { Primary: "#2d66b4", Secondary: "#22386e", Accent: "#00ccff", Neutral: "#8b95a7", Background: "#f7f9fc", Text: "#0b1020" }[role];
      const c = { hex: start, name: "", auto: true, role }; c.name = autoName(c);
      state.colors.push(c); buildColors(); changed();
      const last = colorsEl().lastElementChild; if (last) last.scrollIntoView({ block: "nearest", behavior: "smooth" });
    });
  }

  /* ---------------------------------------------------------- controls: fonts */
  function fontSlotHtml(sl) {
    const st = state.fonts[sl.id];
    return `<div class="ba-font" data-s="${sl.id}">
      <div class="ba-font-h"><span>${sl.label} · ${sl.use}</span>${sl.optional ? `<label><input type="checkbox" data-f="on"> Use it</label>` : ""}</div>
      <div class="ba-combo"><input class="input" type="text" role="combobox" aria-expanded="false" aria-autocomplete="list" data-f="q" value="${esc(st.family)}" placeholder="Search Google Fonts" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${sl.label} font"><i class="ri-search-line" aria-hidden="true"></i><ul class="ba-list" role="listbox" hidden></ul></div>
      <div class="ba-font-row"><select class="ba-sel" data-f="w" aria-label="${sl.label} weight"></select><div class="ba-sample" data-f="sample">AaBbCc 123</div></div>
      <div data-f="pair"></div>
    </div>`;
  }
  function refreshFont(id) {
    const box = document.querySelector(`.ba-font[data-s="${id}"]`); if (!box) return;
    const st = state.fonts[id], f = FONT(st.family); if (!f) return;
    loadFont(f.name);
    const sel = box.querySelector('[data-f="w"]');
    sel.innerHTML = f.w.map((w) => `<option value="${w}"${w === st.weight ? " selected" : ""}>${WNAME[w] || w} ${w}</option>`).join("");
    const sm = box.querySelector('[data-f="sample"]'); sm.style.cssText = fcss(id);
    const on = box.querySelector('[data-f="on"]'); if (on) { on.checked = st.on !== false; box.classList.toggle("off", st.on === false); }
    let pr = null;
    if (id !== "headline" && st.on !== false) pr = pairing(state.fonts.headline.family, st.family);
    box.querySelector('[data-f="pair"]').innerHTML = pr ? `<span class="ba-pair ${pr.l}"><i class="ri-${pr.l === "ok" ? "sparkling-2-line" : pr.l === "mid" ? "information-line" : "error-warning-line"}" aria-hidden="true"></i> ${esc(pr.t)}</span>` : "";
  }
  const refreshFonts = () => { SLOTS.forEach((s) => refreshFont(s.id)); $("baFontCount").textContent = SLOTS.filter((s) => state.fonts[s.id].on !== false).length + "/4"; };
  function buildFonts() {
    $("baFonts").innerHTML = SLOTS.map(fontSlotHtml).join("");
    refreshFonts();
    const root = $("baFonts");
    const results = (q) => { q = q.trim().toLowerCase(); return (q ? FONTS.filter((f) => f.name.toLowerCase().includes(q)) : FONTS).slice(0, 60); };
    const open = (box, q) => {
      const ul = box.querySelector(".ba-list"), inp = box.querySelector('[data-f="q"]'), r = results(q);
      ul.innerHTML = r.length ? r.map((f, k) => `<li role="option" data-n="${esc(f.name)}" aria-selected="${k === 0}">${esc(f.name)}<small>${CATLBL[f.cat]}</small></li>`).join("") : `<li class="none">No match. Try another name.</li>`;
      ul.hidden = false; inp.setAttribute("aria-expanded", "true"); ul.scrollTop = 0;
    };
    const close = (box) => { const ul = box.querySelector(".ba-list"); ul.hidden = true; box.querySelector('[data-f="q"]').setAttribute("aria-expanded", "false"); };
    const pick = (box, name) => {
      const id = box.closest(".ba-font").dataset.s, f = FONT(name); if (!f) return;
      const st = state.fonts[id]; st.family = f.name; st.weight = nearestW(f, st.weight);
      box.querySelector('[data-f="q"]').value = f.name; close(box); refreshFonts(); changed();
    };
    root.addEventListener("focusin", (e) => { if (e.target.dataset.f === "q") { e.target.select(); open(e.target.closest(".ba-combo"), ""); } });
    root.addEventListener("input", (e) => { if (e.target.dataset.f === "q") open(e.target.closest(".ba-combo"), e.target.value); });
    root.addEventListener("mousedown", (e) => { const li = e.target.closest("li[data-n]"); if (li) { e.preventDefault(); pick(li.closest(".ba-combo"), li.dataset.n); } });
    root.addEventListener("touchend", (e) => { const li = e.target.closest("li[data-n]"); if (li) { e.preventDefault(); pick(li.closest(".ba-combo"), li.dataset.n); } });
    root.addEventListener("focusout", (e) => {
      if (e.target.dataset.f !== "q") return; const box = e.target.closest(".ba-combo"), id = e.target.closest(".ba-font").dataset.s;
      const exact = FONT(e.target.value.trim());
      setTimeout(() => { close(box); if (exact && exact.name !== state.fonts[id].family) pick(box, exact.name); else e.target.value = state.fonts[id].family; }, 120);
    });
    root.addEventListener("keydown", (e) => {
      if (e.target.dataset.f !== "q") return; const box = e.target.closest(".ba-combo"), ul = box.querySelector(".ba-list"); if (ul.hidden && e.key !== "ArrowDown") return;
      const items = [...ul.querySelectorAll("li[data-n]")]; let k = items.findIndex((li) => li.getAttribute("aria-selected") === "true");
      if (e.key === "ArrowDown") { e.preventDefault(); if (ul.hidden) open(box, e.target.value); else { k = Math.min(items.length - 1, k + 1); } }
      else if (e.key === "ArrowUp") { e.preventDefault(); k = Math.max(0, k - 1); }
      else if (e.key === "Enter") { e.preventDefault(); if (items[k]) pick(box, items[k].dataset.n); return; }
      else if (e.key === "Escape") { close(box); return; } else return;
      items.forEach((li, j) => li.setAttribute("aria-selected", String(j === k))); if (items[k]) items[k].scrollIntoView({ block: "nearest" });
    });
    root.addEventListener("change", (e) => {
      const box = e.target.closest(".ba-font"); if (!box) return; const id = box.dataset.s, st = state.fonts[id];
      if (e.target.dataset.f === "w") { st.weight = +e.target.value; refreshFonts(); changed(); }
      if (e.target.dataset.f === "on") { st.on = e.target.checked; refreshFonts(); changed(); }
    });
  }

  /* ------------------------------------------------------------------ pages */
  const initials = () => { const w = (state.name || "Brand").replace(/[^\p{L}\p{N}\s]/gu, "").trim().split(/\s+/).filter(Boolean); return ((w[0] || "B")[0] + (w[1] ? w[1][0] : "")).toUpperCase(); };
  const slug = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const dateStr = () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const roleColor = (role) => (state.colors.find((c) => c.role === role) || {}).hex;
  const palette = () => {
    const cs = state.colors, by = (f) => cs.reduce((a, b) => (f(b.hex) < f(a.hex) ? b : a), cs[0]).hex;
    const primary = roleColor("Primary") || cs[0].hex;
    const accent = roleColor("Accent") || roleColor("Secondary") || primary;
    let light = by((h) => -lum(h)); if (lum(light) < 0.75) light = "#ffffff";
    let dark = by(lum); if (lum(dark) > 0.12) dark = "#0b1020";
    const ink = roleColor("Text") && lum(roleColor("Text")) < 0.3 ? roleColor("Text") : dark;
    return { primary, accent, light, dark, ink };
  };

  function logoBox(W, H, o = {}) {
    const inner = logoUrl
      ? `<img alt="" src="${o.alt && logoAltUrl ? logoAltUrl : logoUrl}" style="width:100%;height:100%;object-fit:contain;${o.left ? "object-position:left center;" : ""}${o.opacity ? "opacity:" + o.opacity + ";" : ""}">`
      : `<div class="mono-mark" style="width:${H}px;height:${H}px;border-radius:${Math.round(H * 0.24)}px;background:${o.alt ? "#e0457b" : P.primary};color:${textOn(o.alt ? "#e0457b" : P.primary)};font-size:${Math.round(H * 0.4)}px;${fcss("headline")}${o.opacity ? "opacity:" + o.opacity + ";" : ""}">${esc(initials())}</div>`;
    const tf = [o.rot ? `rotate(${o.rot}deg)` : "", o.sx ? `scaleX(${o.sx})` : ""].filter(Boolean).join(" ");
    return `<div style="width:${W}px;height:${H}px;display:flex;align-items:center;justify-content:${o.left ? "flex-start" : "center"};${tf ? "transform:" + tf + ";" : ""}">${inner}</div>`;
  }
  let P = {};                                              // current palette helpers, set before pages are built
  const hStyle = (px, extra = "") => `${fcss("headline")}font-size:${px}px;line-height:1.05;letter-spacing:${state.ls}em;${extra}`;
  const sStyle = (px, extra = "") => `${fcss("sub")}font-size:${px}px;line-height:1.15;${extra}`;
  const aStyle = (px, extra = "") => (state.fonts.accent.on !== false ? fcss("accent") : "font-family:ui-monospace,Menlo,Consolas,monospace;") + `font-size:${px}px;${extra}`;
  const tagHtml = (hex, bgHex, label) => { const r = ratio(hex, bgHex); return `<span class="tag ${lvlCls(r)}">${label} ${r.toFixed(1)} · ${level(r)}</span>`; };

  function shell(n, title, inner) {
    return `<div class="pg" style="${fcss("body")}line-height:${state.lh};color:${P.ink};">
      <div class="pg-in">
        <div class="pg-top" style="color:${P.ink};border-color:${P.primary};${fcss("headline")}letter-spacing:.14em"><span>${esc(state.name || "Your brand")}</span><span>${esc(title)}</span></div>
        ${inner}
      </div>
      <div class="pg-foot" style="${fcss("body")}"><span>Generated by dev.emmystack01.com | ${esc(dateStr())}</span><span>${n} / 5</span></div>
    </div>`;
  }
  const heading = (t, lead) => `<h2 class="pg-h" style="${hStyle(46, "color:" + P.ink + ";")}">${esc(t)}</h2><p class="pg-lead">${esc(lead)}</p>`;

  function page1() {
    const strip = state.colors.map((c) => `<div style="flex:1;background:${c.hex}"></div>`).join("");
    const nm = state.name || "Your Brand";
    return `<div class="pg" style="${fcss("body")}line-height:${state.lh};color:${P.ink};background:${P.light};">
      <div style="position:absolute;left:56px;right:56px;top:50px;display:flex;justify-content:space-between;font-size:11px;letter-spacing:.2em;text-transform:uppercase;font-weight:700;${fcss("headline")}"><span>Brand guidelines</span><span>${new Date().getFullYear()}</span></div>
      <div style="position:absolute;left:56px;right:56px;top:210px;height:300px;display:flex;align-items:center;justify-content:flex-start">${logoBox(420, 260, { left: true })}</div>
      <div style="position:absolute;left:56px;right:56px;top:560px;">
        <div style="width:72px;height:6px;border-radius:3px;background:${P.accent};margin-bottom:26px"></div>
        <div style="${hStyle(nm.length > 22 ? 62 : nm.length > 14 ? 80 : 96, "color:" + P.ink + ";")}word-break:break-word">${esc(nm)}</div>
        ${state.tagline ? `<div style="${sStyle(28, "margin-top:20px;color:" + P.primary + ";")}">${esc(state.tagline)}</div>` : ""}
      </div>
      <div style="position:absolute;left:0;right:0;bottom:74px;height:96px;display:flex;border-top:1px solid rgba(11,16,32,.12)">${strip}</div>
      <div class="pg-foot" style="${fcss("body")}"><span>Generated by dev.emmystack01.com | ${esc(dateStr())}</span><span>1 / 5</span></div>
    </div>`;
  }

  function page2() {
    const u = usage(state.colors), n = state.colors.length;
    const rowH = Math.min(116, Math.floor((742 - (n - 1) * 8) / n));
    const bar = state.colors.map((c, i) => u[i] ? `<div style="flex:${u[i]};background:${c.hex};color:${textOn(c.hex)};display:grid;place-items:center;font-size:12px;font-weight:800">${u[i]}%</div>` : "").join("");
    const rows = state.colors.map((c, i) => {
      const rgb = fromHex(c.hex), hsl = toHsl(rgb), k = toCmyk(rgb), t = textOn(c.hex);
      return `<div style="display:flex;height:${rowH}px;border:1px solid rgba(11,16,32,.14);border-radius:14px;overflow:hidden;background:#fff">
        <div style="flex:none;width:150px;background:${c.hex};color:${t};display:flex;flex-direction:column;justify-content:center;padding:0 18px"><div style="${hStyle(Math.min(44, rowH * 0.42))}">Aa</div><div style="font-size:10px;font-weight:700;letter-spacing:.08em;opacity:.9">${esc(c.hex.toUpperCase())}</div></div>
        <div style="flex:none;width:176px;padding:0 16px;display:flex;flex-direction:column;justify-content:center;gap:7px;border-right:1px solid rgba(11,16,32,.08)">
          <div style="${sStyle(21, "word-break:break-word;")}">${esc(c.name || autoName(c))}</div>
          <div><span class="pill">${esc(c.role)}</span></div>
          <div style="font-size:12px;font-weight:700">${u[i]}% usage</div>
        </div>
        <div style="flex:1;min-width:0;padding:0 16px;display:flex;flex-direction:column;justify-content:center;gap:5px;${aStyle(11)}">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px 12px">
            <div class="mono-sm"><b>HEX</b>${esc(c.hex.toUpperCase())}</div><div class="mono-sm"><b>RGB</b>${rgb.r}, ${rgb.g}, ${rgb.b}</div>
            <div class="mono-sm"><b>CMYK</b>${k.c}, ${k.m}, ${k.y}, ${k.k}</div><div class="mono-sm"><b>HSL</b>${hsl.h}°, ${hsl.s}%, ${hsl.l}%</div>
          </div>
          <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:3px;font-family:inherit">${tagHtml("#ffffff", c.hex, "White text")}${tagHtml("#000000", c.hex, "Black text")}</div>
        </div>
      </div>`;
    }).join("");
    return shell(2, "Colour palette", `${heading("Colour palette", `${n} brand ${n === 1 ? "colour" : "colours"} with their codes. Use them in a 60-30-10 balance.`)}
      <div style="display:flex;height:34px;border-radius:9px;overflow:hidden;border:1px solid rgba(11,16,32,.14)">${bar}</div>
      <div style="margin:6px 0 14px;font-size:10.5px;opacity:.65">60% Background / Neutral · 30% Primary / Secondary · 10% Accent / Text</div>
      <div style="display:flex;flex-direction:column;gap:8px">${rows}</div>`);
  }

  function page3() {
    const on = SLOTS.filter((s) => state.fonts[s.id].on !== false);
    const cards = on.map((s) => {
      const st = state.fonts[s.id], f = FONT(st.family);
      return `<div style="display:flex;height:92px;border:1px solid rgba(11,16,32,.14);border-radius:14px;overflow:hidden">
        <div style="flex:none;width:228px;padding:12px 16px;background:${P.ink};color:${textOn(P.ink)};display:flex;flex-direction:column;justify-content:center;gap:3px">
          <div style="font-size:9.5px;letter-spacing:.1em;text-transform:uppercase;font-weight:800;opacity:.75;white-space:nowrap">${s.label}<span style="opacity:.7;letter-spacing:.06em"> · ${s.use}</span></div>
          <div style="${fcss(s.id)}font-size:${st.family.length > 18 ? 19 : st.family.length > 13 ? 23 : 27}px;line-height:1.1;white-space:nowrap;overflow:hidden">${esc(st.family)}</div>
          <div style="font-size:11px;opacity:.75">${WNAME[st.weight] || st.weight} ${st.weight} · ${CATLBL[f ? f.cat : "s"]}</div>
        </div>
        <div style="flex:1;min-width:0;padding:10px 18px;display:flex;flex-direction:column;justify-content:center;${fcss(s.id)}font-size:16px;line-height:1.3;white-space:nowrap;overflow:hidden"><div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div><div>abcdefghijklmnopqrstuvwxyz</div><div>0123456789 !?&amp;@#%</div></div>
      </div>`;
    }).join("");
    const sc = (label, meta, style, text) => `<div style="display:flex;align-items:baseline;gap:14px;padding:6px 0;border-bottom:1px solid rgba(11,16,32,.1)"><div style="flex:none;width:92px;font-size:10.5px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.55">${label}<br><span style="font-weight:500;letter-spacing:0;text-transform:none">${meta}</span></div><div style="flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;${style}">${text}</div></div>`;
    const nm = esc(state.name || "Your brand");
    return shell(3, "Typography", `${heading("Typography", `${on.length} ${on.length === 1 ? "typeface" : "typefaces"}. Line height ${state.lh}, headline letter spacing ${state.ls}em.`)}
      <div style="display:flex;flex-direction:column;gap:8px">${cards}</div>
      <div class="pg-sec" style="margin-top:16px">Type scale</div>
      ${sc("H1", "46 / 48", hStyle(46, "color:" + P.ink + ";"), nm)}
      ${sc("H2", "34 / 38", hStyle(34, "color:" + P.primary + ";"), "A clear, confident headline")}
      ${sc("H3", "24 / 28", sStyle(24), "Subheading for sections")}
      ${sc("H4", "19 / 24", sStyle(19), "Smaller subheading or card title")}
      ${sc("Body", "15 / " + state.lh, "font-size:15px;white-space:normal;line-height:" + state.lh + ";max-height:" + Math.round(15 * state.lh * 2) + "px;", "Good design is clear, consistent and made for people. This is body copy, used for paragraphs and interface text.")}
      ${sc("Small", "12 / " + state.lh, "font-size:12px;opacity:.8;", "Captions, labels and legal text are set small.")}
      ${sc("Accent", "13", aStyle(13), "“Make it simple.” const brand = &quot;" + nm + "&quot;;")}`);
  }

  function btn(label, bg, fg, border, extra = "") { return `<div style="${fcss("body")}display:inline-flex;align-items:center;height:40px;padding:0 22px;border-radius:10px;font-size:14px;font-weight:700;background:${bg};color:${fg};border:2px solid ${border};${extra}">${esc(label)}</div>`; }
  function page4() {
    const n = state.colors.length, tw = Math.floor((682 - (n - 1) * 8) / n);
    const tiles = state.colors.map((c) => {
      const a = ratio(c.hex, "#ffffff"), b = ratio(c.hex, "#12172a");
      const mk = (bg, r) => `<div style="height:42px;background:${bg};display:flex;align-items:center;justify-content:space-between;padding:0 8px"><span style="${hStyle(22, "color:" + c.hex + ";")}">Aa</span><span style="font-size:13px;font-weight:800;color:${r >= 4.5 ? "#0a7a52" : r >= 3 ? "#b88400" : "#c43030"}">${r >= 4.5 ? "✓" : r >= 3 ? "!" : "✕"}</span></div>`;
      return `<div style="width:${tw}px;border:1px solid rgba(11,16,32,.14);border-radius:10px;overflow:hidden"><div style="height:8px;background:${c.hex}"></div>${mk("#ffffff", a)}<div style="background:#12172a">${mk("#12172a", b).replace("#0a7a52", "#5be0a9").replace("#b88400", "#ffd166").replace("#c43030", "#ff8a8a")}</div></div>`;
    }).join("");
    const dont = (label, inner, bg) => `<div style="width:160px"><div style="position:relative;height:122px;border-radius:12px;border:1px solid rgba(11,16,32,.14);background:${bg};display:grid;place-items:center;overflow:hidden">${inner}<div style="position:absolute;right:7px;top:7px;width:20px;height:20px;border-radius:50%;background:#d33a3a;color:#fff;display:grid;place-items:center;font-size:12px;font-weight:800;line-height:1">✕</div></div><div style="margin-top:6px;font-size:11.5px;font-weight:700">${label}</div></div>`;
    const doItem = (t) => `<div style="display:flex;gap:10px;align-items:flex-start;font-size:12.5px;line-height:1.35"><span style="flex:none;width:18px;height:18px;border-radius:50%;background:#12a373;color:#fff;display:grid;place-items:center;font-size:11px;font-weight:800;line-height:1;margin-top:1px">✓</span><span>${t}</span></div>`;
    return shell(4, "Usage", `${heading("Logo & colour usage", "How the logo, colours and buttons behave in everyday use.")}
      <div class="pg-sec">Logo on light and dark</div>
      <div style="display:flex;gap:14px">
        <div style="flex:1"><div style="position:relative;height:176px;border-radius:12px;border:1px solid rgba(11,16,32,.14);background:${P.light};display:grid;place-items:center"><div style="position:relative;padding:22px;border:1.5px dashed ${P.primary};border-radius:6px">${logoBox(190, 76)}<div style="position:absolute;left:-1px;top:-18px;font-size:9px;font-weight:700;color:${P.primary};${aStyle(9)}">clear space = half the logo height</div></div></div><div style="margin-top:6px;font-size:11.5px;font-weight:700">Light background</div></div>
        <div style="flex:1"><div style="height:176px;border-radius:12px;background:${P.dark};display:grid;place-items:center">${logoBox(190, 76)}</div><div style="margin-top:6px;font-size:11.5px;font-weight:700">Dark background</div></div>
      </div>
      <div class="pg-sec" style="margin-top:18px">Colour as text on light and dark</div>
      <div style="display:flex;gap:8px">${tiles}</div>
      <div class="pg-sec" style="margin-top:18px">Buttons</div>
      <div style="display:flex;flex-wrap:wrap;gap:10px;align-items:center">
        ${btn("Primary", P.primary, textOn(P.primary), P.primary)}
        ${btn("Secondary", "transparent", P.primary, P.primary)}
        ${btn("Accent", P.accent, textOn(P.accent), P.accent)}
        ${btn("Text link", "transparent", P.primary, "transparent", "text-decoration:underline;padding:0 8px")}
        ${btn("Disabled", P.primary, textOn(P.primary), P.primary, "opacity:.38")}
      </div>
      <div class="pg-sec" style="margin-top:18px">Do</div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px">
        ${doItem("Keep clear space around the logo, at least half its height.")}
        ${doItem("Use the palette and fonts in this guide, in the 60-30-10 balance.")}
        ${doItem("Put the logo on backgrounds with strong contrast (AA or better).")}
      </div>
      <div class="pg-sec" style="margin-top:16px">Don't</div>
      <div style="display:flex;gap:14px">
        ${dont("Stretch or squash the logo", logoBox(100, 56, { sx: 1.55 }), P.light)}
        ${dont("Rotate the logo", logoBox(100, 56, { rot: -18 }), P.light)}
        ${dont("Change the logo colours", logoBox(100, 56, { alt: true }), P.light)}
        ${dont("Use low-contrast backgrounds", logoBox(100, 56, { opacity: 0.7 }), P.primary)}
      </div>`);
  }

  function page5() {
    const slugd = (slug(state.name) || "yourbrand").replace(/-/g, ""), nm = state.name || "Your Brand";
    const post = `<div style="width:330px;height:330px;border-radius:14px;overflow:hidden;background:${P.primary};color:${textOn(P.primary)};position:relative;box-shadow:0 8px 22px rgba(0,0,0,.18)">
      <div style="position:absolute;left:18px;top:18px;right:18px;display:flex;align-items:center;gap:10px"><div style="width:36px;height:36px;border-radius:50%;background:#fff;display:grid;place-items:center;overflow:hidden;padding:5px">${logoBox(26, 26)}</div><div style="font-size:12px;line-height:1.2"><b>${esc(nm)}</b><br><span style="opacity:.75">@${esc(slugd)}</span></div></div>
      <div style="position:absolute;left:22px;right:22px;top:92px;${hStyle(46, "")}word-break:break-word;max-height:150px;overflow:hidden">${esc(state.tagline || "Your headline goes here")}</div>
      <div style="position:absolute;left:22px;bottom:22px;display:inline-flex;align-items:center;height:34px;padding:0 16px;border-radius:9px;background:${P.accent};color:${textOn(P.accent)};font-size:12.5px;font-weight:800">Learn more</div>
      <div style="position:absolute;right:-30px;bottom:-30px;width:130px;height:130px;border-radius:50%;background:${P.accent};opacity:.28"></div>
    </div>
    <div style="margin-top:8px;font-size:11.5px;font-weight:700">Social post</div>`;
    const card = (front) => `<div style="width:330px;height:187px;border-radius:10px;overflow:hidden;position:relative;box-shadow:0 6px 18px rgba(0,0,0,.2);${front ? "background:" + P.light + ";" : "background:" + P.dark + ";color:" + textOn(P.dark) + ";"}">
      ${front
        ? `<div style="position:absolute;inset:0 0 14px 0;display:grid;place-items:center">${logoBox(190, 92)}</div><div style="position:absolute;left:0;right:0;bottom:0;height:14px;display:flex">${state.colors.map((c) => `<div style="flex:1;background:${c.hex}"></div>`).join("")}</div>`
        : `<div style="position:absolute;left:22px;top:20px;right:22px"><div style="${hStyle(24, "")}">Your Name</div><div style="font-size:11.5px;opacity:.75;margin-top:2px">Job title</div></div>
           <div style="position:absolute;left:22px;bottom:20px;display:grid;gap:3px;${aStyle(10.5)}"><span>hello@${esc(slugd)}.com</span><span>+000 000 000 0000</span><span>www.${esc(slugd)}.com</span></div>
           <div style="position:absolute;right:20px;bottom:18px;width:46px;height:46px;border-radius:10px;background:#fff;display:grid;place-items:center;padding:6px">${logoBox(34, 34)}</div>
           <div style="position:absolute;left:0;top:0;width:6px;height:100%;background:${P.accent}"></div>`}
    </div>`;
    const web = `<div style="border-radius:14px;overflow:hidden;border:1px solid rgba(11,16,32,.16);box-shadow:0 8px 22px rgba(0,0,0,.14)">
      <div style="display:flex;align-items:center;justify-content:space-between;height:46px;padding:0 20px;background:#fff;border-bottom:1px solid rgba(11,16,32,.1)"><div>${logoBox(96, 28)}</div><div style="display:flex;gap:18px;font-size:12px;font-weight:700"><span>Home</span><span>Services</span><span>About</span><span style="padding:5px 12px;border-radius:8px;background:${P.primary};color:${textOn(P.primary)}">Contact</span></div></div>
      <div style="padding:30px 30px 32px;background:${P.dark};color:${textOn(P.dark)}">
        <div style="${hStyle(44, "max-width:520px;")}">${esc(state.tagline || "Your headline goes here")}</div>
        <div style="margin:10px 0 18px;max-width:470px;font-size:13.5px;opacity:.82">A short supporting line sits here, set in the body font so it reads easily.</div>
        <div style="display:flex;gap:10px">${btn("Get started", P.accent, textOn(P.accent), P.accent)}${btn("Learn more", "transparent", textOn(P.dark), textOn(P.dark))}</div>
      </div>
    </div>`;
    return shell(5, "Applications", `${heading("Applications", "The brand in use: social, print and web. Sample text only.")}
      <div style="display:flex;gap:22px;align-items:flex-start">
        <div>${post}</div>
        <div style="display:grid;gap:14px"><div>${card(true)}<div style="margin-top:6px;font-size:11.5px;font-weight:700">Business card, front</div></div><div>${card(false)}<div style="margin-top:6px;font-size:11.5px;font-weight:700">Business card, back</div></div></div>
      </div>
      <div class="pg-sec" style="margin-top:20px">Website header</div>
      ${web}`);
  }

  const buildPages = () => { P = palette(); return [page1(), page2(), page3(), page4(), page5()]; };

  /* ---------------------------------------------------------------- preview */
  let rT = 0;
  function renderPreview() {
    const stage = $("baStage");
    stage.innerHTML = buildPages().map((h) => `<div class="ba-pgw"><div class="pg-sc">${h}</div></div>`).join("");
    stage.querySelectorAll(".pg-sc").forEach((el) => { el.style.cssText = "position:absolute;top:0;left:0;transform-origin:0 0;width:" + PW + "px;height:" + PH + "px"; });
    fit();
  }
  function fit() {
    const stage = $("baStage"), s = stage.clientWidth / PW; if (!s) return;
    stage.querySelectorAll(".ba-pgw").forEach((w) => { w.style.height = PH * s + "px"; const i = w.firstElementChild; if (i) i.style.transform = `scale(${s})`; });
  }
  function changed() { clearTimeout(rT); rT = setTimeout(renderPreview, 70); save(); }

  /* ----------------------------------------------------------------- export */
  let pdfLib = null;
  const loadPdfLib = () => pdfLib || (pdfLib = new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve();
    const s = document.createElement("script"); s.src = "/vendor/html2pdf.bundle.min.js"; s.onload = resolve; s.onerror = () => { pdfLib = null; reject(new Error("pdf library")); };
    document.head.appendChild(s);
  }));
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function fontsReady() {
    const jobs = [];
    SLOTS.forEach((s) => { const st = state.fonts[s.id]; if (st.on === false) return; loadFont(st.family); jobs.push(document.fonts.load(`${st.weight} 24px "${st.family}"`).catch(() => {})); });
    jobs.push(document.fonts.load('700 24px "Barlow Condensed"').catch(() => {}));
    await Promise.race([Promise.all(jobs), wait(6000)]);
    await document.fonts.ready; await wait(150);
  }
  async function exportPdf() {
    const btns = [$("baPdf"), $("baPdf2")], msg = $("baMsg"), off = $("baOff"), ov = $("baOverlay");
    btns.forEach((b) => { b.disabled = true; }); say(msg, ""); ov.hidden = false; $("baOvTxt").textContent = "Building your PDF…";
    try {
      await loadPdfLib(); await fontsReady();
      window.scrollTo(0, 0);
      const pages = buildPages(); off.innerHTML = pages.map((h) => `<div class="ba-ex">${h}</div>`).join(""); off.classList.add("on");
      await wait(250);
      const els = [...off.querySelectorAll(".ba-ex")];
      const render = async (scale, el) => html2pdf().set({ margin: 0, image: { type: "jpeg", quality: 0.95 }, html2canvas: { scale, useCORS: true, logging: false, letterRendering: true, scrollX: 0, scrollY: 0, backgroundColor: "#ffffff" }, jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true } }).from(el).toCanvas().get("canvas");
      let scale = 300 / 96, pdf = null;                                // 300 dpi; falls back to 200 dpi on phones that cannot make a canvas that large
      for (let i = 0; i < els.length; i++) {
        $("baOvTxt").textContent = `Building page ${i + 1} of ${els.length}…`;
        let canvas;
        try { canvas = await render(scale, els[i]); if (!canvas || !canvas.width) throw new Error("empty"); }
        catch (e) { if (scale > 2.1) { scale = 2.08; canvas = await render(scale, els[i]); } else throw e; }
        if (!pdf) pdf = await html2pdf().set({ margin: 0, jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true }, image: { type: "jpeg", quality: 0.95 } }).from(canvas, "canvas").toPdf().get("pdf");
        else { pdf.addPage("a4", "portrait"); pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", 0, 0, 210, 297, undefined, "FAST"); }
        canvas.width = canvas.height = 0;
      }
      const total = pdf.getNumberOfPages(); for (let p = total; p > els.length; p--) pdf.deletePage(p);
      pdf.setProperties({ title: (state.name || "Brand") + " Brand Guidelines", subject: "Brand guidelines", creator: "dev.emmystack01.com" });
      pdf.save((slug(state.name) || "brand") + "-brand-guidelines.pdf");
      say(msg, "PDF saved (" + Math.round(scale * 96) + " dpi).", "ok");
    } catch (e) {
      console.error(e); say(msg, "Could not build the PDF. Try again, or use a laptop for very large logos.", "err");
    } finally {
      off.classList.remove("on"); off.innerHTML = ""; ov.hidden = true; btns.forEach((b) => { b.disabled = false; });
      setTimeout(() => { if (!msg.classList.contains("err")) say(msg, ""); }, 5000);
    }
  }

  /* ------------------------------------------------------------------- init */
  function syncSimple() {
    $("baName").value = state.name; $("baTag").value = state.tagline;
    $("baLh").value = state.lh; $("baLs").value = state.ls; sliderLabels();
  }
  const sliderLabels = () => { $("baLhV").textContent = (+state.lh).toFixed(2).replace(/0$/, ""); $("baLsV").textContent = (+state.ls).toFixed(3).replace(/0+$/, "").replace(/\.$/, "") + "em"; };

  async function init() {
    load(); syncSimple(); buildColors(); buildFonts(); colorEvents(); await applyLogo();
    $("baName").addEventListener("input", (e) => { state.name = e.target.value.slice(0, 40); changed(); });
    $("baTag").addEventListener("input", (e) => { state.tagline = e.target.value.slice(0, 80); changed(); });
    $("baLh").addEventListener("input", (e) => { state.lh = +e.target.value; sliderLabels(); changed(); });
    $("baLs").addEventListener("input", (e) => { state.ls = +e.target.value; sliderLabels(); changed(); });
    const drop = $("baDrop"), file = $("baFile");
    drop.addEventListener("click", () => file.click());
    drop.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); file.click(); } });
    file.addEventListener("change", () => { takeFile(file.files[0]); file.value = ""; });
    ["dragenter", "dragover"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.add("over"); }));
    ["dragleave", "drop"].forEach((t) => drop.addEventListener(t, (e) => { e.preventDefault(); drop.classList.remove("over"); }));
    drop.addEventListener("drop", (e) => takeFile(e.dataTransfer && e.dataTransfer.files[0]));
    $("baLogoRm").addEventListener("click", async () => { state.logo = null; await applyLogo(); changed(); });
    $("baReset").addEventListener("click", async () => {
      if (!confirm("Reset everything back to the starting brand? Your logo will be removed.")) return;
      state = DEFAULT(); syncSimple(); buildColors(); buildFonts(); await applyLogo(); renderPreview(); save();
    });
    $("baPdf").addEventListener("click", exportPdf); $("baPdf2").addEventListener("click", exportPdf);
    window.addEventListener("resize", fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe($("baStage"));
    renderPreview();
    if (document.fonts) document.fonts.addEventListener("loadingdone", () => {});   // pages restyle by themselves when a font arrives
  }
  Admin.onReady(init);
})();
