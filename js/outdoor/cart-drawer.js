/* =========================================================
   ZILLION BUSINESS — Outdoor
   cart-drawer.js — floating "N pontos selecionados" button +
   drawer, injected on every /outdoor/* page. Include after
   cart.js, data-clusters.js, data-pricing.js.
   ========================================================= */
(function () {
  "use strict";
  window.ZB = window.ZB || {};

  function clusterName(clusterId) {
    var c = (ZB.Outdoor.CLUSTERS || []).find(function (c) { return c.id === clusterId; });
    return c ? c.name : null;
  }

  function build() {
    var fab = document.createElement("button");
    fab.className = "od-cart-fab";
    fab.id = "odCartFab";
    fab.innerHTML = '🛗<span data-outdoor-cart-label>0 pontos selecionados</span>';
    fab.setAttribute("aria-label", "Sua campanha");

    var drawer = document.createElement("div");
    drawer.className = "od-cart-drawer";
    drawer.id = "odCartDrawer";
    drawer.innerHTML =
      '<h3 style="font-size:1rem;margin-bottom:10px">Sua campanha</h3>' +
      '<div id="odCartDrawerList" style="display:flex;flex-direction:column;gap:8px;max-height:220px;overflow-y:auto"></div>' +
      '<div id="odCartDrawerPrice" style="margin-top:12px;font-size:.85rem;color:var(--muted)"></div>' +
      '<a href="/outdoor/planejar-campanha/" class="btn btn-primary" style="width:100%;margin-top:14px">Continuar campanha</a>';

    document.body.appendChild(fab);
    document.body.appendChild(drawer);

    fab.addEventListener("click", function () {
      drawer.classList.toggle("open");
      if (drawer.classList.contains("open")) renderDrawer();
    });
  }

  function renderDrawer() {
    var points = ZB.Outdoor.Cart.getPoints();
    var fab = document.getElementById("odCartFab");
    var list = document.getElementById("odCartDrawerList");
    var price = document.getElementById("odCartDrawerPrice");
    if (fab) fab.classList.toggle("show", points.length > 0);
    if (!list) return;
    if (points.length === 0) {
      list.innerHTML = '<p style="color:var(--muted);font-size:.85rem">Nenhum ponto selecionado.</p>';
      if (price) price.textContent = "";
      return;
    }
    list.innerHTML = points.map(function (p) {
      var label = clusterName(p.clusterId) || p.road;
      return '<div class="od-selected-item"><span>Ponto ' + String(p.pointNumber).padStart(2, "0") + " — " + label + '</span></div>';
    }).join("");
    if (price && ZB.Outdoor.PRICING) {
      var total = points.length * ZB.Outdoor.PRICING.pricePerDuration[15];
      price.textContent = "A partir de R$" + total.toLocaleString("pt-BR") + " / 15 dias";
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!ZB.Outdoor || !ZB.Outdoor.Cart) return;
    build();
    renderDrawer();
    document.addEventListener("zb:outdoor-cart-change", renderDrawer);
  });
})();
