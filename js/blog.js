/* =========================================================
   ZILLION BUSINESS — Blog (índice)
   blog.js  — filtros, busca, destaque; cards abrem a página do artigo
   Requer: js/posts.js (window.ZB_POSTS)
   ========================================================= */
(function () {
  "use strict";
  if (!document.getElementById("postGrid") || !window.ZB_POSTS) return;

  const POSTS = window.ZB_POSTS;
  const CATS = ["all", "strategy", "growth", "traffic", "sales", "tech", "international", "investment"];
  let activeCat = "all", query = "";

  const grid = document.getElementById("postGrid");
  const featuredWrap = document.getElementById("featuredWrap");
  const catBar = document.getElementById("catBar");
  const searchEl = document.getElementById("blogSearch");
  const emptyEl = document.getElementById("blogEmpty");

  const L = () => (POSTS[0][ZB.lang] ? ZB.lang : "pt");
  const fmtDate = (iso) => {
    try { return new Intl.DateTimeFormat(ZB.LOCALES[ZB.lang] || "pt-PT", { day:"numeric", month:"short", year:"numeric" }).format(new Date(iso)); }
    catch (e) { return iso; }
  };
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const href = (p) => "artigo.html?p=" + encodeURIComponent(p.slug);

  function buildCats() {
    catBar.innerHTML = "";
    CATS.forEach(c => {
      const b = document.createElement("button");
      b.className = "cat-chip" + (c === activeCat ? " active" : "");
      b.textContent = ZB.t("cat_" + c);
      b.addEventListener("click", () => { activeCat = c; buildCats(); render(); });
      catBar.appendChild(b);
    });
  }

function cover(post, idx, big) {
    const img = post.img || (window.ZB_CAT_IMG && ZB_CAT_IMG[post.cat]) || "";
    const imgTag = img ? '<img class="cover-img" src="' + esc(img) + '" alt="" loading="lazy">' : "";
    const fig = (big || img) ? "" : '<span class="cv-fig">' + String(idx + 1).padStart(2, "0") + "</span>";
    return '<div class="post-cover cat-' + post.cat + (big ? " big" : "") + (img ? " has-img" : "") + '">' +
           imgTag + '<span class="cv-cat">' + esc(ZB.t("cat_" + post.cat)) + "</span>" + fig + "</div>";
  }
  function meta(post) {
    return '<div class="post-meta"><span class="au"><span class="au-av"></span>' + esc(ZB.t("author_team")) + "</span>" +
           '<span class="dot"></span><span>' + fmtDate(post.date) + "</span>" +
           '<span class="dot"></span><span>' + post.read + " " + esc(ZB.t("blog_min")) + "</span></div>";
  }

  function postCard(post, idx) {
    const c = post[L()];
    const a = document.createElement("a");
    a.className = "post-card reveal in";
    a.href = href(post);
    a.innerHTML = cover(post, idx, false) +
      '<div class="post-body"><h3>' + esc(c.title) + "</h3>" +
      '<p class="excerpt">' + esc(c.excerpt) + "</p>" + meta(post) +
      '<span class="post-read-link">' + esc(ZB.t("blog_read")) +
      ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>';
    return a;
  }

  function renderFeatured() {
    const post = POSTS.find(p => p.featured);
    if (!post || activeCat !== "all" || query) { featuredWrap.innerHTML = ""; featuredWrap.style.display = "none"; return; }
    featuredWrap.style.display = "";
    const c = post[L()];
    const a = document.createElement("a");
    a.className = "featured-card reveal in";
    a.href = href(post);
    a.innerHTML = cover(post, 0, true) +
      '<div class="featured-body"><span class="feat-badge">★ ' + esc(ZB.t("blog_featured")) + "</span>" +
      "<h2>" + esc(c.title) + "</h2>" +
      '<p class="excerpt">' + esc(c.excerpt) + "</p>" + meta(post) +
      '<span class="post-read-link">' + esc(ZB.t("blog_read")) +
      ' <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 12h14M13 6l6 6-6 6"/></svg></span></div>';
    featuredWrap.innerHTML = "";
    featuredWrap.appendChild(a);
  }

  function visiblePosts() {
    const q = query.trim().toLowerCase();
    return POSTS.filter(p => {
      if (activeCat !== "all" && p.cat !== activeCat) return false;
      if (p.featured && activeCat === "all" && !q) return false;
      if (q) { const c = p[L()]; if ((c.title + " " + c.excerpt).toLowerCase().indexOf(q) === -1) return false; }
      return true;
    });
  }

  function render() {
    renderFeatured();
    const list = visiblePosts();
    grid.innerHTML = "";
    list.forEach(p => grid.appendChild(postCard(p, POSTS.indexOf(p))));
    const featuredShown = POSTS.find(x => x.featured) && activeCat === "all" && !query;
    emptyEl.classList.toggle("show", list.length === 0 && !featuredShown);
  }

  /* newsletter */
  const newsBtn = document.getElementById("newsBtn");
  const newsInput = document.getElementById("newsInput");
  const newsOk = document.getElementById("newsOk");
  if (newsBtn) newsBtn.addEventListener("click", () => {
    const newsConsent = document.getElementById("newsConsent");
    const newsConsentErr = document.getElementById("newsConsentErr");
    if (newsConsent && !newsConsent.checked) {
      if (newsConsentErr) newsConsentErr.style.display = "block";
      return;
    }
    if (newsConsentErr) newsConsentErr.style.display = "none";
    const v = (newsInput.value || "").trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v)) { newsInput.focus(); newsInput.style.borderColor = "var(--accent)"; return; }
    newsInput.value = ""; newsInput.style.borderColor = "";
    if (newsConsent) newsConsent.checked = false;
    newsOk.textContent = ZB.t("news_ok"); newsOk.classList.add("show");
  });

  if (searchEl) searchEl.addEventListener("input", () => { query = searchEl.value; render(); });

  window.addEventListener("zb:langchange", () => {
    buildCats(); render();
    if (searchEl) searchEl.placeholder = ZB.t("blog_search_ph");
    if (newsOk && newsOk.classList.contains("show")) newsOk.textContent = ZB.t("news_ok");
  });

  buildCats();
  render();
})();
