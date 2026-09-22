/* =========================================================
   ZILLION BUSINESS — Outdoor
   cart.js — campaign point selection, persisted in localStorage
   and shared across every /outdoor/* page. Include on every
   Outdoor page after data-points.js.
   ========================================================= */
(function () {
  "use strict";
  window.ZB = window.ZB || {};
  window.ZB.Outdoor = window.ZB.Outdoor || {};

  var STORAGE_KEY = "zb_outdoor_cart";

  function read() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      var list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }

  function write(list) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch (e) {}
    document.dispatchEvent(new CustomEvent("zb:outdoor-cart-change", { detail: { points: list } }));
    renderBadges();
  }

  var Cart = {
    getPointNumbers: function () { return read(); },

    getPoints: function () {
      var nums = read();
      var all = (ZB.Outdoor.POINTS || []);
      return nums
        .map(function (n) { return all.find(function (p) { return p.pointNumber === n; }); })
        .filter(Boolean);
    },

    has: function (pointNumber) { return read().indexOf(pointNumber) !== -1; },

    add: function (pointNumber) {
      var list = read();
      if (list.indexOf(pointNumber) === -1) { list.push(pointNumber); write(list); }
      if (window.dataLayer) window.dataLayer.push({ event: "add_outdoor_to_campaign", point_number: pointNumber });
    },

    remove: function (pointNumber) {
      var list = read().filter(function (n) { return n !== pointNumber; });
      write(list);
      if (window.dataLayer) window.dataLayer.push({ event: "remove_outdoor_from_campaign", point_number: pointNumber });
    },

    toggle: function (pointNumber) {
      if (Cart.has(pointNumber)) Cart.remove(pointNumber); else Cart.add(pointNumber);
    },

    clear: function () { write([]); },

    count: function () { return read().length; },

    refresh: function () { renderBadges(); }
  };

  ZB.Outdoor.Cart = Cart;

  /* ---------- shared "N pontos selecionados" badge ---------- */
  function renderBadges() {
    var count = Cart.count();
    document.querySelectorAll("[data-outdoor-cart-count]").forEach(function (el) {
      el.textContent = count;
    });
    document.querySelectorAll("[data-outdoor-cart-badge]").forEach(function (el) {
      el.style.display = count > 0 ? "" : "none";
    });
    document.querySelectorAll("[data-outdoor-cart-label]").forEach(function (el) {
      el.textContent = count === 1 ? "1 ponto selecionado" : count + " pontos selecionados";
    });
    document.querySelectorAll("button[data-outdoor-add]").forEach(function (btn) {
      var n = parseInt(btn.getAttribute("data-outdoor-add"), 10);
      var active = Cart.has(n);
      btn.classList.toggle("is-selected", active);
      btn.textContent = active ? "Remover da campanha" : "Adicionar à campanha";
    });
  }

  document.addEventListener("DOMContentLoaded", renderBadges);

  // Delegated so dynamically-rendered cards (explorer filters, map popups)
  // work without re-binding listeners.
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("button[data-outdoor-add]");
    if (!btn) return;
    var n = parseInt(btn.getAttribute("data-outdoor-add"), 10);
    Cart.toggle(n);
  });
})();
