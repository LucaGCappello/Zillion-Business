/* =========================================================
   ZILLION BUSINESS — Site principal
   main.js
   ========================================================= */
(function () {
  "use strict";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- THEME ---------- */
  const themeBtn = $("#themeBtn");
  const themeIcon = $("#themeIcon");
  const SUN = '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/>';
  const MOON = '<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>';

  let theme = "dark";
  try { const s = localStorage.getItem("zb_site_theme"); if (s) theme = s; } catch (e) {}

  function applyTheme(t) {
    theme = t;
    document.documentElement.setAttribute("data-theme", t);
    if (themeIcon) themeIcon.innerHTML = t === "dark" ? SUN : MOON;
    try { localStorage.setItem("zb_site_theme", t); } catch (e) {}
  }
  applyTheme(theme);
  if (themeBtn) themeBtn.addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark"));

  /* ---------- HEADER SCROLL STATE ---------- */
  const header = $("#header");
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 24);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

/* ---------- PILLARS EXPANDABLE ---------- */
(function() {
  let activePillar = null;

  function getPillars() {
    return (window.ZB && ZB.I18N[ZB.lang] && ZB.I18N[ZB.lang].pillars_data) || [];
  }

  function closePillar() {
    activePillar = null;
    const detail = document.getElementById('pillarDetail');
    if (detail) detail.style.display = 'none';
    document.querySelectorAll('.pill[data-pillar]').forEach(b => b.classList.remove('active'));
  }

  function renderDetail(i) {
    const p = getPillars()[i];
    if (!p) return;
    const inner = document.getElementById('pillarDetailInner');
    if (!inner) return;
    inner.innerHTML = `
      <h4>${p.n} · ${p.label}</h4>
      <p>${p.desc}</p>
      <ul class="pillar-detail-bullets">${p.bullets.map(b => `<li>${b}</li>`).join('')}</ul>
      <div class="pillar-tags">${p.tags.map(t => `<span>${t}</span>`).join('')}</div>`;
    const detail = document.getElementById('pillarDetail');
    if (detail) {
      detail.style.display = 'block';
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  document.querySelectorAll('.pill[data-pillar]').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = +btn.dataset.pillar;
      if (activePillar === i) { closePillar(); return; }
      document.querySelectorAll('.pill[data-pillar]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePillar = i;
      renderDetail(i);
    });
  });

  // Atualiza conteúdo ao mudar idioma sem fechar o painel
  window.addEventListener('zb:langchange', () => {
    if (activePillar !== null) renderDetail(activePillar);
  });
})();

let activePillar = null;
document.querySelectorAll('.pill[data-pillar]').forEach(btn => {
  btn.addEventListener('click', () => {
    const i = +btn.dataset.pillar;
    const detail = document.getElementById('pillarDetail');
    const inner  = document.getElementById('pillarDetailInner');
    if (activePillar === i) {
      activePillar = null; detail.style.display = 'none';
      btn.classList.remove('active'); return;
    }
    document.querySelectorAll('.pill').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activePillar = i;
    const p = PILLARS[i];
    inner.innerHTML = `
      <h4>${p.n} · ${p.label}</h4>
      <p>${p.desc}</p>
      <ul class="pillar-detail-bullets">${p.bullets.map(b=>`<li>${b}</li>`).join('')}</ul>
      <div class="pillar-tags">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div>`;
    detail.style.display = 'block';
    detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

  /* ---------- MOBILE NAV ---------- */
  const menuToggle = $("#menuToggle");
  const mobileNav = $("#mobileNav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => mobileNav.classList.toggle("open"));
    $$("a", mobileNav).forEach(a => a.addEventListener("click", () => mobileNav.classList.remove("open")));
  }

  /* ---------- COUNT-UP ---------- */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = "1";
    const target = parseFloat(el.dataset.count);
    const pre = el.dataset.prefix || "";
    const suf = el.dataset.suffix || "";
    const dur = 1500, t0 = performance.now();
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      const val = Math.round(target * ease);
      const loc = (window.ZB && ZB.LOCALES[ZB.lang]) || "pt-PT";
      el.textContent = pre + val.toLocaleString(loc) + suf;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$("[data-count]", e.target).forEach(countUp);
      if (e.target.dataset && e.target.dataset.count) countUp(e.target);
      io.unobserve(e.target);
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -40px 0px" });

  $$(".reveal").forEach(el => io.observe(el));
  $$("[data-count]").forEach(el => { if (!el.closest(".reveal")) io.observe(el); });

  /* ---------- LOG (typed reveal) ---------- */
  const logBody = $("#logBody");
  if (logBody) {
    const events = (window.ZB && ZB.I18N[ZB.lang] && ZB.I18N[ZB.lang].log) || [
      ["00:01", 'Instância criada', 'Zillion_Principal'],
      ["00:09", 'QR Code lido', 'Equipe comercial'],
      ["00:23", 'Fluxo em execução', 'Nexus_LeadStart'],
      ["00:41", 'Lead encaminhado', 'CRM & WhatsApp'],
      ["01:07", 'Métricas atualizadas', 'Dashboard executivo'],
    ];
    let played = false;
    const playLog = () => {
      if (played) return;
      played = true;
      events.forEach((ev, i) => {
        const line = document.createElement("div");
        line.className = "log-line";
        line.innerHTML = `<span class="ts">${ev[0]}</span><span>${ev[1]} <b>${ev[2]}</b></span>`;
        logBody.appendChild(line);
        setTimeout(() => line.classList.add("in"), 350 + i * 600);
      });
      // trailing cursor
      setTimeout(() => {
        const c = document.createElement("div");
        c.className = "log-line in";
        c.innerHTML = `<span class="ts">&gt;</span><span><span class="log-cursor"></span></span>`;
        logBody.appendChild(c);
      }, 350 + events.length * 600);
    };
    const logIo = new IntersectionObserver((es) => {
      es.forEach(e => { if (e.isIntersecting) { playLog(); logIo.disconnect(); } });
    }, { threshold: 0.4 });
    logIo.observe(logBody);
  }

  /* ---------- BUILD DECORATIVE BARS / WAVE ---------- */
  const dashFoot = $("#dashFoot");
  if (dashFoot) {
    [42, 56, 48, 68, 60, 80, 72, 92].forEach((h, i) => {
      const b = document.createElement("i");
      b.style.height = h + "%";
      b.style.animationDelay = (i * 0.07) + "s";
      dashFoot.appendChild(b);
    });
  }
  const wave = $("#wave");
  if (wave) {
    for (let i = 0; i < 11; i++) {
      const b = document.createElement("i");
      b.style.animationDelay = (i * 0.09) + "s";
      wave.appendChild(b);
    }
  }

  /* ---------- YEAR ---------- */
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
})();
