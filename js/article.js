/* =========================================================
   ZILLION BUSINESS — Blog (artigo)
   article.js — renderiza um artigo a partir de ?p=slug
   Requer: js/posts.js (window.ZB_POSTS)
   ========================================================= */
(function () {
  "use strict";
  const root = document.getElementById("article");
  if (!root || !window.ZB_POSTS) return;

  const POSTS = window.ZB_POSTS;
  const L = () => (POSTS[0][ZB.lang] ? ZB.lang : "pt");
  const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
  const fmtDate = (iso) => {
    try { return new Intl.DateTimeFormat(ZB.LOCALES[ZB.lang] || "pt-PT", { day:"numeric", month:"long", year:"numeric" }).format(new Date(iso)); }
    catch (e) { return iso; }
  };
  const slug = new URLSearchParams(location.search).get("p");
  const post = slug
    ? POSTS.find(p => p.slug === slug)
    : (POSTS.find(p => p.featured) || POSTS[0]);

  function bodyHtml(arr) {
    return arr.map(line => line.indexOf("## ") === 0
      ? "<h2>" + esc(line.slice(3)) + "</h2>"
      : "<p>" + esc(line) + "</p>").join("");
  }

  function shareLinks() {
    const url = encodeURIComponent(location.href);
    const c = post[L()];
    const txt = encodeURIComponent(c.title);
    return '<div class="art-share"><span class="lbl">' + esc(ZB.t("art_share")) + "</span>" +
      '<a target="_blank" rel="noopener" aria-label="LinkedIn" href="https://www.linkedin.com/sharing/share-offsite/?url=' + url + '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 102.5 6 2.5 2.5 0 004.98 3.5zM3 8.98h4v12H3zM10 8.98h3.8v1.64h.05a4.17 4.17 0 013.75-2.06c4 0 4.75 2.64 4.75 6.07v6.35h-4v-5.63c0-1.34 0-3.07-1.87-3.07s-2.16 1.46-2.16 2.97v5.73H10z"/></svg></a>' +
      '<a target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/?text=351931496255' + txt + "%20" + url + '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.2-.7-2.7-1.1-4.4-3.9-4.5-4.1-.1-.2-1.1-1.5-1.1-2.8s.7-2 .9-2.2c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .5l-.4.5c-.2.2-.3.4-.1.7.2.3.9 1.4 1.9 2 .8.5 1.1.6 1.4.5.2-.1.5-.5.7-.8.2-.2.4-.2.6-.1l1.9.9c.2.1.4.2.5.3.1.3.1.8-.1 1.4z"/></svg></a>' +
      '<a target="_blank" rel="noopener" aria-label="X" href="https://twitter.com/intent/tweet?text=' + txt + "&url=" + url + '"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M18.2 2H21l-6.6 7.5L22 22h-6.4l-5-6.5L4.8 22H2l7-8L2 2h6.5l4.5 6zM17 20h1.5L7 4H5.4z"/></svg></a>' +
      '<button class="copy" id="artCopy" aria-label="Copiar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 012-2h10"/></svg></button></div>';
  }

  function relatedHtml() {
    const rel = POSTS.filter(p => p.slug !== post.slug && p.cat === post.cat).slice(0, 3);
    const pool = rel.length ? rel : POSTS.filter(p => p.slug !== post.slug).slice(0, 3);
    const cards = pool.map(p => {
      const c = p[L()];
      const rImg = p.img || (window.ZB_CAT_IMG && ZB_CAT_IMG[p.cat]) || "";
      const rImgTag = rImg ? '<img class="cover-img" src="' + esc(rImg) + '" alt="" loading="lazy">' : "";
      return '<a class="rel-card" href="artigo.html?p=' + encodeURIComponent(p.slug) + '">' +
        // '<div class="post-cover cat-' + p.cat + '"><span class="cv-cat">' + esc(ZB.t("cat_" + p.cat)) + "</span></div>" +
        '<div class="post-cover cat-' + p.cat + (rImg ? " has-img" : "") + '">' + rImgTag +
        '<span class="cv-cat">' + esc(ZB.t("cat_" + p.cat)) + "</span></div>" +
        '<div class="rel-body"><h4>' + esc(c.title) + "</h4></div></a>";
    }).join("");
    return '<section class="art-related"><h3>' + esc(ZB.t("art_related")) + '</h3><div class="rel-grid">' + cards + "</div></section>";
  }

  function render() {
    if (!post) {
      root.innerHTML = '<div class="wrap art-notfound"><h1>404</h1><p>' + esc(ZB.t("art_notfound")) +
        '</p><a class="btn btn-primary" href="blog.html">' + esc(ZB.t("art_back")) + "</a></div>";
      return;
    }
    const c = post[L()];
    document.title = c.title + " — Zillion Business";
    const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", c.excerpt);
    document.documentElement.lang = ZB.lang;

    const heroImg = post.img || (window.ZB_CAT_IMG && ZB_CAT_IMG[post.cat]) || "";
    const heroStyle = heroImg ? ' style="background-image:url(\'' + heroImg.replace(/'/g, "%27") + '\')"' : "";

    root.innerHTML =
        '<div class="art-hero cat-' + post.cat + (heroImg ? " has-img" : "") + '"' + heroStyle + '><div class="wrap">' +
        '<nav class="breadcrumb"><a href="index.html">' + esc(ZB.t("nav_home")) + '</a><span>/</span>' +
        '<a href="blog.html">' + esc(ZB.t("nav_blog")) + '</a><span>/</span><b>' + esc(ZB.t("cat_" + post.cat)) + "</b></nav>" +
        '<span class="art-cat">' + esc(ZB.t("cat_" + post.cat)) + "</span>" +
        "<h1>" + esc(c.title) + "</h1>" +
        '<div class="art-meta"><span class="au"><span class="au-av"></span>' + esc(ZB.t("author_team")) + "</span>" +
          '<span class="dot"></span><span>' + fmtDate(post.date) + "</span>" +
          '<span class="dot"></span><span>' + post.read + " " + esc(ZB.t("blog_min")) + "</span></div>" +
      "</div></div>" +
      '<div class="wrap art-wrap"><article class="art-body">' +
        '<p class="art-lead">' + esc(c.excerpt) + "</p>" +
        bodyHtml(c.body) +
        shareLinks() +
        '<a class="art-backlink" href="blog.html">\u2190 ' + esc(ZB.t("art_back")) + "</a>" +
      "</article>" + relatedHtml() + "</div>";

    const copy = document.getElementById("artCopy");
    if (copy) copy.addEventListener("click", () => {
      try { navigator.clipboard.writeText(location.href); copy.classList.add("done"); setTimeout(() => copy.classList.remove("done"), 1500); } catch (e) {}
    });
  }

  render();
  window.addEventListener("zb:langchange", render);
})();
