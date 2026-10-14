/* Document Engine: White-Label License and Project Agreement as A4 documents.
   - Pages are laid out by measuring real A4 sheets, so what you see is what prints.
   - Everything typed in the form is escaped before it goes into the document.
   - "Print" gives a PDF with real, selectable text. "Download PDF" saves a PDF file in one tap (image based). */
(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const MM = 96 / 25.4;                       // CSS pixels per millimetre
  const WHITE_LABEL_FEE = "$100";             // flat fee quoted in the project agreement's white-label clause

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------------------------------------------------------- templates */
  const templates = {
    whiteLabel: {
      title: "Professional White-Label License",
      file: "White_Label_License",
      content: () => `
        <h3>1. Grant of License &amp; IP Transfer</h3>
        <p>Subject to full payment of the License Fee, the Developer grants the Licensee a perpetual, worldwide, irrevocable, and exclusive <strong>Professional Brand License</strong>.</p>
        <p><strong>Intellectual Property (IP) Transfer:</strong> Full technical and legal ownership of the software's source code is transferred to the Licensee. The Developer waives all future claims to the code's IP, transforming the software from a managed service into a proprietary company asset.</p>
        <p><strong>Unlimited Modification:</strong> The Licensee holds unrestricted rights to fork, alter, edit, copy, or resell the code as part of their business assets.</p>
        <h3>2. White-Label &amp; Sovereignty Rights</h3>
        <p>This license establishes total digital sovereignty for the Licensee through a formal <strong>Handover Protocol</strong>:</p>
        <ul>
          <li><strong>Zero-Attribution Interface:</strong> The Licensee is granted the specific right to completely remove the "Built by Emmy STACK01" signature, metadata, and developer credits from the website footer and documentation to present a 100% proprietary brand experience.</li>
          <li><strong>Infrastructure Sovereignty:</strong> Administrative control of the project repository (GitHub/ZIP containing Astro, HTML5, or GSAP files), hosting environments (Vercel/Netlify), domain DNS credentials, and integrated third-party APIs (e.g., Paystack, Google Search Console) shall be fully transferred to the Licensee's accounts.</li>
        </ul>
        <h3>3. Master Release Package Delivery</h3>
        <p>Upon execution, the Developer will deliver the <strong>Master Release Package</strong>, which includes:</p>
        <ul>
          <li><strong>The Digital DNA:</strong> Clean, zero-attribution source code and the original UI/UX Asset Vault.</li>
          <li><strong>IP Certificate:</strong> A formal PDF document confirming full title deed and ownership transfer.</li>
          <li><strong>System Documentation:</strong> The structural blueprint, modification guide, and deployment manual for independent scaling.</li>
        </ul>
        <h3>4. No Warranty &amp; Limitation of Liability</h3>
        <p>The software is provided <strong>"as is"</strong> without warranty of any kind, express or implied. Following the successful transfer of the code repository and administrative credentials, the Developer is entirely released from any ongoing maintenance, hosting liabilities, or claims arising from the Licensee's independent modifications and deployment.</p>`,
    },
    projectAgreement: {
      title: "Project Development Agreement",
      file: "Project_Agreement",
      content: (f, v) => {
        let n = 1, html = "", items = "";
        if (f.creative)   items += `<li><strong>Creative Assets:</strong> Custom Brand Identity kit (Color Palette, Typography, Favicon set, Open Graph tags) and complete UI/UX Website Design mock-ups.</li>`;
        if (f.technical)  items += `<li><strong>Technical Architecture:</strong> Custom-coded core development (HTML5/CSS3/ES6+ JavaScript or Astro ecosystem) featuring fluid GSAP animations, technical On-Page SEO optimization, and standard indexing assets (robots.txt, sitemap.xml).</li>`;
        if (f.deployment) items += `<li><strong>Deployment Operations:</strong> Production hosting setup via Git-backed infrastructure (GitHub repository / Vercel orchestration) and custom domain routing configuration.</li>`;
        if (f.search)     items += `<li><strong>Search Verification:</strong> Official site registration and indexing submission via Google Search Console.</li>`;

        html += `
          <h3>${n}. Scope of Work</h3>
          <p>Emmy STACK01 will execute and deliver the following specific project modules:</p>
          <ul>${items || "<li><em>No modules selected. Reference custom addendum notes.</em></li>"}</ul>`;

        if (f.clause2) html += `
          <h3>${++n}. Financial &amp; Milestone Terms</h3>
          <p>All financial transactions are calculated and executed exclusively in USD ($). The total project fee is fixed at ${esc(v.fee)}, split across two clear project milestones:</p>
          <ul>
            <li><strong>Milestone 1 — 35% Project Initiation Fee:</strong> Due upon Client approval of the initial UI/UX Design wireframes and layout blueprints. Engineering of the custom code base will commence immediately upon receipt of this payment.</li>
            <li><strong>Milestone 2 — 65% Final Balance:</strong> Due upon final verification of the fully operational application hosted and live on the production repository, prior to final asset access handover.</li>
          </ul>`;

        if (f.clause3) html += `
          <h3>${++n}. Domain Infrastructure &amp; Costs</h3>
          <p><strong>Developer Engineering:</strong> Technical DNS configuration, nameserver routing protocols, and record mapping (A, CNAME, TXT) are included entirely free of charge.</p>
          <p><strong>Client Responsibility:</strong> The Client retains sole financial responsibility for purchasing their target domain asset from a DNS registrar (e.g., Namecheap.com) and sustaining its ongoing annual subscription renewals.</p>`;

        html += `
          <h3>${++n}. Code Ownership &amp; Future Upgrades</h3>
          <p><strong>Default Operational Transfer:</strong> Upon successful clearance of Milestone 2, the Client is granted full operational access to the website properties. By default, the underlying source code ecosystem, core "Digital DNA" engineering files, and structural maintenance framework remain managed within the Emmy STACK01 development network.</p>
          <p><strong>Continuous Maintenance:</strong> For post-launch text alterations, copy changes, layout expansions, or priority ecosystem scaling, the Client can opt into a structured Monthly Growth Retainer (MGR) plan.</p>`;

        if (f.clause5) html += `
          <h3>${++n}. Developer Attribution &amp; White Label Upgrades</h3>
          <p><strong>Standard Attribution:</strong> Emmy STACK01 reserves the right to maintain a clean, high-performance attribution tag within the application's footer layer (e.g., "Built by Emmy STACK01").</p>
          <p><strong>White Label Brand License Option:</strong> The Client can completely detach their project from the Emmy STACK01 infrastructure by purchasing a White Label Brand License for a flat fee of ${esc(WHITE_LABEL_FEE)}. Acquiring the License grants the Client: 100% full Intellectual Property (IP) and source code ownership, complete removal of all developer attribution tags, and total freedom to host, fork, modify, or redistribute the software on independent servers or private infrastructure.</p>`;

        if (f.clause6) html += `
          <h3>${++n}. Termination &amp; Kill Fee Clauses</h3>
          <p>If the Client chooses to terminate this project after design blueprints are finalized and Milestone 1 has been settled, Emmy STACK01 will halt all further code production. Emmy STACK01 retains the initial 35% milestone balance as a non-refundable "Kill Fee" to directly cover the specialized design labor already performed.</p>`;
        return html;
      },
    },
  };

  /* ------------------------------------------------------------------- state */
  const els = {
    client: $("inClient"), project: $("inProject"), date: $("inDate"), fee: $("inFee"), qrNote: $("inQRnote"), qr: $("inQR"),
    wrap: $("downloadWrapper"), scaler: $("scaler"), stage: $("stage"), count: $("pageCount"), status: $("deStatus"),
    controls: $("agreementControls"), overlay: $("deOverlay"), printBtn: $("printBtn"), pdfBtn: $("pdfBtn"),
  };
  const checks = ["Creative", "Technical", "Deployment", "Search", "Clause2", "Clause3", "Clause5", "Clause6"];
  const flagOf = (id) => { const c = $("toggle" + id); return !!(c && c.checked); };
  const mode = () => (document.querySelector('input[name="tpl"]:checked') || {}).value || "whiteLabel";

  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  const prettyDate = (v) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "";
  };
  const say = (text, kind) => { els.status.textContent = text || ""; els.status.className = "de-status" + (kind ? " " + kind : ""); };

  /* ------------------------------------------------------------------ layout */
  let pageTotal = 0;

  function layout() {
    const m = mode(), tmpl = templates[m];
    els.controls.hidden = m !== "projectAgreement";

    const flags = { creative: flagOf("Creative"), technical: flagOf("Technical"), deployment: flagOf("Deployment"), search: flagOf("Search"), clause2: flagOf("Clause2"), clause3: flagOf("Clause3"), clause5: flagOf("Clause5"), clause6: flagOf("Clause6") };
    const v = {
      client: els.client.value.trim() || "[Client Name]", project: els.project.value.trim() || "[Project Name]",
      date: prettyDate(els.date.value) || "[Effective Date]", fee: els.fee.value.trim() || "[Fee Amount]",
      note: els.qrNote.value.trim(), qr: els.qr.value.trim(),
    };
    const qrOk = /^https?:\/\/\S+$/i.test(v.qr);
    if (v.qr && !qrOk) say("QR link must start with http:// or https://. The QR code is left out.", "err"); else if (els.status.classList.contains("err") && /QR link/.test(els.status.textContent)) say("");

    const clientLabel = m === "projectAgreement" ? "Client:" : "Licensee:";
    const feeLabel = m === "projectAgreement" ? "Project Fee:" : "License Fee:";
    const showFee = m === "whiteLabel" || flags.clause2;

    const host = document.createElement("div");   // off-screen host, same CSS and width as the real thing
    host.setAttribute("aria-hidden", "true");
    host.style.cssText = "position:absolute;left:-10000px;top:0;visibility:hidden;pointer-events:none;";
    document.body.appendChild(host);

    const subHeader = `<header class="doc-header sub"><div class="doc-logo-emmy">Emmy <span>STACK01</span></div><div class="doc-client-logo">${esc(v.client)}</div></header>`;
    const firstHeader = `
      <header class="doc-header"><div class="doc-logo-emmy">Emmy <span>STACK01</span></div><div class="doc-client-logo">${esc(v.client)}</div></header>
      <h1 class="doc-title">${esc(tmpl.title)}</h1>
      <table class="doc-meta-table">
        <tr><td>Software:</td><td>${esc(v.project)}</td></tr>
        <tr><td>Developer:</td><td>Emmy STACK01</td></tr>
        <tr><td>${clientLabel}</td><td>${esc(v.client)}</td></tr>
        <tr><td>Effective Date:</td><td>${esc(v.date)}</td></tr>
        ${showFee ? `<tr><td>${feeLabel}</td><td>${esc(v.fee)}</td></tr>` : ""}
      </table>`;

    const sheets = []; let cur = null;
    const newSheet = (first) => {
      const sheet = document.createElement("article");
      sheet.className = "paper-sheet";
      sheet.innerHTML = (first ? firstHeader : subHeader) + '<div class="doc-body"></div>';
      host.appendChild(sheet);
      cur = { sheet, body: sheet.querySelector(".doc-body"), ul: null };
      sheets.push(cur);
    };
    // Fits when the last thing on the page ends above the bottom margin.
    const fits = () => {
      const limit = cur.sheet.getBoundingClientRect().bottom - 20 * MM + 1;
      const last = cur.sheet.lastElementChild;
      return !last || last.getBoundingClientRect().bottom <= limit;
    };
    const attach = (units) => {
      units.forEach((u) => {
        if (u.li) { if (!cur.ul) { cur.ul = document.createElement("ul"); cur.body.appendChild(cur.ul); } cur.ul.appendChild(u.el); }
        else { cur.ul = null; cur.body.appendChild(u.el); }
      });
    };
    // Adds a group of elements that must stay together; starts a new page if they do not fit.
    const put = (units) => {
      const snap = { n: cur.body.children.length, ul: cur.ul, lis: cur.ul ? cur.ul.children.length : 0 };
      attach(units);
      if (fits()) return;
      while (cur.body.children.length > snap.n) cur.body.lastElementChild.remove();
      if (snap.ul) while (snap.ul.children.length > snap.lis) snap.ul.lastElementChild.remove();
      cur.ul = snap.ul;
      if (cur.body.children.length === 0) { attach(units); return; }   // already alone on a page: accept
      newSheet(false); attach(units);
    };

    newSheet(true);
    const parsed = new DOMParser().parseFromString(`<div>${tmpl.content(flags, v)}</div>`, "text/html").querySelector("div");
    let heading = null;
    Array.from(parsed.children).forEach((node) => {
      const tag = node.tagName.toLowerCase();
      if (tag === "h3") { if (heading) put([{ el: heading }]); heading = node; return; }
      if (tag === "ul") {
        Array.from(node.children).forEach((li, k) => {
          const item = document.createElement("li");
          item.innerHTML = `<span>${li.innerHTML}</span>`;
          put((k === 0 && heading ? [{ el: heading }] : []).concat({ el: item, li: true }));
          if (k === 0) heading = null;
        });
        cur.ul = null;
        return;
      }
      put((heading ? [{ el: heading }] : []).concat({ el: node })); heading = null;
    });
    if (heading) put([{ el: heading }]);

    // Signature and footer go on the last page, or on a page of their own if there is no room.
    const sig = document.createElement("div");
    sig.innerHTML = `
      <div class="signature-grid">
        <div><div class="sig-block-label">Developer</div><div class="sig-line">Emmy STACK01 — Authorized Representative<em>Date: ________________________________</em></div></div>
        <div><div class="sig-block-label">Recipient</div><div class="sig-line">${esc(v.client)} — Authorized Representative<em>Date: ________________________________</em></div></div>
      </div>
      <footer class="doc-footer"><div class="doc-footer-note">${esc(v.note)}</div><div class="qr-container"${qrOk ? "" : ' style="display:none"'}></div></footer>`;
    const addSig = () => Array.from(sig.children).forEach((c) => cur.sheet.appendChild(c.cloneNode(true)));
    const dropSig = () => { cur.sheet.querySelector(".signature-grid")?.remove(); cur.sheet.querySelector(".doc-footer")?.remove(); };
    addSig();
    if (!fits()) { dropSig(); newSheet(false); addSig(); }

    if (qrOk && window.QRCode) {
      const box = cur.sheet.querySelector(".qr-container");
      try { new QRCode(box, { text: v.qr, width: 66, height: 66, colorDark: "#0d2b6e", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H }); } catch (e) { box.style.display = "none"; }
    } else if (qrOk) { cur.sheet.querySelector(".qr-container").style.display = "none"; }

    pageTotal = sheets.length;
    sheets.forEach((s, i) => { const st = document.createElement("div"); st.className = "page-stamp"; st.textContent = `${i + 1} / ${pageTotal}`; s.sheet.appendChild(st); });
    els.wrap.replaceChildren(...sheets.map((s) => s.sheet));
    host.remove();
    els.count.textContent = pageTotal;
    fitScale();
  }

  /* Shrinks the preview to fit narrow screens (screen only; print and export use real size). */
  function fitScale() {
    const box = els.stage.parentElement, cs = getComputedStyle(box);
    const avail = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    const full = 210 * MM, s = Math.min(1, Math.max(0.2, avail / full));
    els.scaler.style.transform = s < 1 ? `scale(${s})` : "";
    els.stage.style.width = full * s + "px";
    els.stage.style.height = els.scaler.offsetHeight * s + "px";
  }

  /* ------------------------------------------------------------------ export */
  const baseName = () => {
    const client = (els.client.value.trim() || "Client").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "Client";
    return `${templates[mode()].file}_${client}`;
  };

  els.printBtn.addEventListener("click", () => {
    const old = document.title; document.title = baseName();
    const restore = () => { document.title = old; window.removeEventListener("afterprint", restore); };
    window.addEventListener("afterprint", restore);
    say("In the print window, choose “Save as PDF” as the destination.");
    window.print();
  });

  let pdfLib = null;
  const loadPdfLib = () => pdfLib || (pdfLib = new Promise((resolve, reject) => {
    if (window.html2pdf) return resolve();
    const s = document.createElement("script"); s.src = "/vendor/html2pdf.bundle.min.js"; s.onload = resolve; s.onerror = () => { pdfLib = null; reject(new Error("pdf library")); };
    document.head.appendChild(s);
  }));

  els.pdfBtn.addEventListener("click", async () => {
    els.overlay.hidden = false; els.pdfBtn.disabled = true; els.printBtn.disabled = true; say("");
    try {
      await loadPdfLib();
      document.body.classList.add("exporting");
      els.scaler.style.transform = ""; els.stage.style.height = "auto"; els.stage.style.width = "210mm";
      await new Promise((r) => setTimeout(r, 120));
      await html2pdf().set({
        margin: 0, filename: baseName() + ".pdf",
        image: { type: "jpeg", quality: 0.99 },
        html2canvas: { scale: 2, useCORS: true, logging: false, letterRendering: true, scrollX: 0, scrollY: 0, windowWidth: 794, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait", compress: true },
        pagebreak: { mode: ["css", "legacy"] },
      }).from(els.wrap).save();
      say("PDF saved.", "ok");
    } catch (e) {
      console.error(e); say("Export failed. Try Print and choose Save as PDF.", "err");
    } finally {
      document.body.classList.remove("exporting");
      els.overlay.hidden = true; els.pdfBtn.disabled = false; els.printBtn.disabled = false;
      fitScale();
      setTimeout(() => { if (!els.status.classList.contains("err")) say(""); }, 4000);
    }
  });

  /* -------------------------------------------------------------------- init */
  let timer = 0;
  const schedule = () => { clearTimeout(timer); timer = setTimeout(layout, 120); };

  Admin.onReady(() => {
    if (!els.date.value) els.date.value = iso(new Date());
    [els.client, els.project, els.date, els.fee, els.qrNote, els.qr].forEach((e) => e.addEventListener("input", schedule));
    document.querySelectorAll('input[name="tpl"]').forEach((r) => r.addEventListener("change", layout));
    checks.forEach((id) => { const c = $("toggle" + id); if (c) c.addEventListener("change", layout); });
    window.addEventListener("resize", fitScale);
    if (window.ResizeObserver) new ResizeObserver(fitScale).observe(els.stage.parentElement);
    layout();
    if (document.fonts) { document.fonts.ready.then(layout); document.fonts.addEventListener("loadingdone", schedule); }
  });
})();
