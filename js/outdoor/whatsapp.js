/* =========================================================
   ZILLION BUSINESS — Outdoor
   whatsapp.js — builds the dynamic campaign message and the
   wa.me deep link. Include after config.js, data-points.js,
   data-clusters.js and cart.js.
   ========================================================= */
(function () {
  "use strict";
  window.ZB = window.ZB || {};
  window.ZB.Outdoor = window.ZB.Outdoor || {};

  function clusterName(clusterId) {
    var c = (ZB.Outdoor.CLUSTERS || []).find(function (c) { return c.id === clusterId; });
    return c ? c.name : null;
  }

  /**
   * Builds the WhatsApp message for a campaign.
   * @param {Object} opts
   * @param {Array}  opts.points        array of point objects (from data-points.js)
   * @param {Number} opts.durationDays  15 or 30
   * @param {Boolean} opts.needsCreative
   * @param {Number} opts.estimatedTotal
   * @param {String} [opts.desiredDate] "DD/MM/AAAA" or empty
   * @param {Object} [opts.contact]     { name, company, whatsapp, email, objective, segment, notes }
   */
  ZB.Outdoor.buildWhatsAppMessage = function (opts) {
    var lines = [];
    lines.push("Olá! Montei uma campanha de Outdoor pelo site da Zillion Business.");
    lines.push("");
    lines.push("Pontos selecionados:");
    opts.points.forEach(function (p) {
      var label = clusterName(p.clusterId) || p.road || p.locationDescription;
      lines.push(String(p.pointNumber).padStart(2, "0") + " — " + label);
    });
    lines.push("");
    lines.push("Período: " + opts.durationDays + " dias");
    lines.push("Arte: " + (opts.needsCreative ? "Quero criação pela Zillion" : "Já tenho minha arte"));
    lines.push("Investimento estimado: R$" + opts.estimatedTotal.toLocaleString("pt-BR"));
    if (opts.desiredDate) lines.push("Data desejada: " + opts.desiredDate);

    var c = opts.contact || {};
    var hasContact = c.name || c.company || c.whatsapp || c.email || c.objective || c.segment || c.notes;
    if (hasContact) {
      lines.push("");
      lines.push("Meus dados:");
      if (c.name) lines.push("Nome: " + c.name);
      if (c.company) lines.push("Empresa: " + c.company);
      if (c.whatsapp) lines.push("WhatsApp: " + c.whatsapp);
      if (c.email) lines.push("E-mail: " + c.email);
      if (c.objective) lines.push("Objetivo da campanha: " + c.objective);
      if (c.segment) lines.push("Segmento da empresa: " + c.segment);
      if (c.notes) lines.push("Observações: " + c.notes);
    }

    lines.push("");
    lines.push("Gostaria de confirmar a disponibilidade dos pontos.");
    return lines.join("\n");
  };

  ZB.Outdoor.buildWhatsAppUrl = function (message) {
    var number = (ZB.Outdoor.CONFIG && ZB.Outdoor.CONFIG.whatsappNumber) || "";
    return "https://wa.me/" + number + "?text=" + encodeURIComponent(message);
  };

  /* Wires any element with [data-outdoor-whatsapp-cart] to open WhatsApp
     with the current cart's contents (duration/creative read from its
     data attributes, falling back to sensible defaults). */
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-outdoor-whatsapp-cart]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var points = ZB.Outdoor.Cart.getPoints();
        if (!points.length) { window.location.href = "/outdoor/pontos/"; return; }
        var duration = parseInt(el.getAttribute("data-duration"), 10) || 15;
        var needsCreative = el.getAttribute("data-needs-creative") === "true";
        var totals = ZB.Outdoor.calculateTotal(points.length, duration, needsCreative);
        var msg = ZB.Outdoor.buildWhatsAppMessage({
          points: points, durationDays: duration, needsCreative: needsCreative,
          estimatedTotal: totals.estimatedTotal
        });
        if (window.dataLayer) window.dataLayer.push({ event: "outdoor_whatsapp_click" });
        window.open(ZB.Outdoor.buildWhatsAppUrl(msg), "_blank", "noopener");
      });
    });
  });
})();
