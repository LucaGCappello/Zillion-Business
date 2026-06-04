/* =========================================================
   ZILLION BUSINESS — Landing
   lead.js  (Nexus em modo qualificação de leads + formulário)
   ========================================================= */
(function () {
  "use strict";

  /* ============ NEXUS LEAD-QUALIFIER CHAT ============ */
  const root = document.getElementById("nexusChat");
  if (root) runChat();

  function runChat() {
    const fab = document.getElementById("nexusFab");
    const fabLabel = document.getElementById("nexusFabLabel");
    const panel = document.getElementById("nexusPanel");
    const closeBtn = document.getElementById("nexusClose");
    const body = document.getElementById("nexusBody");
    const quick = document.getElementById("nexusQuick");
    const input = document.getElementById("nexusInput");
    const sendBtn = document.getElementById("nexusSend");
    const titleEl = document.getElementById("nexusTitle");
    const subEl = document.getElementById("nexusSub");

    const D = () => ZB.I18N[ZB.lang].lead;
    let started = false, stepIdx = -1, finished = false, awaitName = false;
    const answers = {};

    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
    const interp = (s) => s.replace(/\{(\w+)\}/g, (_, k) => answers[k] || "");

    function syncLabels() {
      const d = D();
      if (fabLabel) fabLabel.textContent = d.fab;
      if (titleEl) titleEl.textContent = d.title;
      if (subEl) subEl.textContent = d.subtitle;
      if (input) input.placeholder = d.placeholder;
    }

    function avatar() {
      return '<span class="nx-av"><svg viewBox="0 0 100 100" fill="none" stroke-width="11" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M83 27 L57 66" stroke="#9aa0b4"/><path d="M20 73 L48 27 L76 73" stroke="#fff"/></svg></span>';
    }
    const scroll = () => { body.scrollTop = body.scrollHeight; };

    function addUser(t) {
      const m = document.createElement("div"); m.className = "nx-msg user";
      m.innerHTML = '<div class="nx-bubble">' + esc(t) + "</div>"; body.appendChild(m); scroll();
    }
    function addBot(t, cta) {
      const m = document.createElement("div"); m.className = "nx-msg bot";
      let h = avatar() + '<div class="nx-bubble">' + esc(t);
      if (cta) h += '<a class="nx-cta" href="' + cta.href + '"' + (cta.href.charAt(0) === "#" ? ' data-anchor="1"' : "") + ">" +
        esc(cta.label) + ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></a>';
      h += "</div>"; m.innerHTML = h; body.appendChild(m);
      const link = m.querySelector(".nx-cta[data-anchor]");
      if (link) link.addEventListener("click", closePanel);
      scroll();
    }
    function typing() {
      const m = document.createElement("div"); m.className = "nx-msg bot";
      m.innerHTML = avatar() + '<div class="nx-bubble"><span class="nx-dots"><i></i><i></i><i></i></span></div>';
      body.appendChild(m); scroll(); return m;
    }
    function botThen(text, cta, after) {
      const t = typing();
      setTimeout(() => { t.remove(); addBot(text, cta); if (after) after(); }, 600 + Math.random() * 400);
    }
    function chips(list, fn) {
      quick.innerHTML = "";
      list.forEach((label, i) => {
        const b = document.createElement("button"); b.className = "nexus-chip"; b.textContent = label;
        b.addEventListener("click", () => fn(label, i)); quick.appendChild(b);
      });
    }
    const clearChips = () => { quick.innerHTML = ""; };

    /* ---- flow ---- */
    function showGreeting() {
      botThen(D().greeting, null, () => chips(D().start, onStart));
    }
    function onStart(label, i) {
      clearChips(); addUser(label);
      if (i === 0) askStep(0);
      else botThen(D().human, D().human_cta);
    }
    function askStep(i) {
      const steps = D().steps;
      if (i >= steps.length) return finish();
      stepIdx = i;
      const s = steps[i];
      botThen(interp(s.q), null, () => {
        if (s.opts) chips(s.opts, (label) => answer(label));
        else { clearChips(); awaitName = true; }
      });
    }
    function answer(val) {
      const steps = D().steps; const s = steps[stepIdx];
      if (s.key === "contact" && !/^([^@\s]+@[^@\s]+\.[^@\s]+|[+\d][\d\s().-]{6,})$/.test(val.trim())) {
        addUser(val); botThen(D().invalid_contact); return;
      }
      answers[s.key] = val.trim();
      addUser(val); clearChips(); awaitName = false;
      askStep(stepIdx + 1);
    }
    function finish() {
      finished = true; clearChips();
      const d = D();
      botThen(interp(d.summary), null, () => {
        addBot(interp(d.summary_line));
        setTimeout(() => addBot(interp(d.closing), d.done_cta), 500);
      });
      // pre-fill the landing form if present
      const set = (id, v) => { const el = document.getElementById(id); if (el && v) el.value = v; };
      set("lfName", answers.name);
      if (answers.contact && answers.contact.indexOf("@") !== -1) set("lfEmail", answers.contact);
      else set("lfPhone", answers.contact);
    }

    function sendText() {
      const v = (input.value || "").trim(); if (!v) return;
      input.value = "";
      if (finished) { return; }
      if (!started) { openPanel(); return; }
      if (stepIdx === -1) { clearChips(); addUser(v); askStep(0); return; } // typed instead of tapping start
      answer(v);
    }

    function openPanel() {
      panel.classList.add("open"); fab.classList.add("hidden");
      if (!started) { started = true; showGreeting(); }
      setTimeout(() => input && input.focus(), 300);
    }
    function closePanel() { panel.classList.remove("open"); fab.classList.remove("hidden"); }

    fab.addEventListener("click", openPanel);
    closeBtn.addEventListener("click", closePanel);
    sendBtn.addEventListener("click", sendText);
    input.addEventListener("keydown", e => { if (e.key === "Enter") sendText(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && panel.classList.contains("open")) closePanel(); });
    document.querySelectorAll("[data-open-chat]").forEach(b =>
      b.addEventListener("click", e => { e.preventDefault(); openPanel(); }));
    window.addEventListener("zb:langchange", syncLabels);
    syncLabels();
  }

  /* ============ LANDING LEAD FORMS ============ */
  function wireForm(btnId, okId, fields) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const name = (document.getElementById(fields.name) || {}).value || "";
      const email = (document.getElementById(fields.email) || {}).value || "";
      const phone = (document.getElementById(fields.phone) || {}).value || "";
      const contactOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) || /^[+\d][\d\s().-]{6,}$/.test(phone.trim());
      const ok = document.getElementById(okId);
      if (name.trim().length < 2 || !contactOk) {
        ok.textContent = ZB.t("lf_err"); ok.className = "lf-msg err show"; return;
      }
      ok.textContent = ZB.t("lf_ok"); ok.className = "lf-msg ok show";
      [fields.name, fields.email, fields.phone, fields.segment].forEach(id => { const el = document.getElementById(id); if (el) el.value = ""; });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    wireForm("lfBtn", "lfMsg", { name:"lfName", email:"lfEmail", phone:"lfPhone", segment:"lfSegment" });
    window.addEventListener("zb:langchange", () => {
      const ok = document.getElementById("lfMsg");
      if (ok && ok.classList.contains("show")) ok.textContent = ZB.t(ok.classList.contains("err") ? "lf_err" : "lf_ok");
    });
  });
})();
