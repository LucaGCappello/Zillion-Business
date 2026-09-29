/* =========================================================
   ZILLION BUSINESS — Outdoor
   campaign-builder.js — /outdoor/planejar-campanha/ 6-step
   configurator. Client-side total is for instant feedback only;
   the Netlify Function recalculates authoritatively on submit.
   ========================================================= */
(function () {
  "use strict";
  window.ZB = window.ZB || {};
  window.ZB.Outdoor = window.ZB.Outdoor || {};

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.from((c || document).querySelectorAll(s)); };

  var STEPS = ["pontos", "periodo", "arte", "data", "contato", "resumo"];
  var state = { step: 0, duration: 15, needsCreative: null, desiredDate: "", contact: {} };

  function clusterName(clusterId) {
    var c = (ZB.Outdoor.CLUSTERS || []).find(function (c) { return c.id === clusterId; });
    return c ? c.name : null;
  }

  function getUtmParams() {
    var qs = new URLSearchParams(window.location.search);
    return {
      utmSource: qs.get("utm_source"), utmMedium: qs.get("utm_medium"),
      utmCampaign: qs.get("utm_campaign"), utmContent: qs.get("utm_content"),
      utmTerm: qs.get("utm_term")
    };
  }

  function persistUtm() {
    var utm = getUtmParams();
    if (Object.values(utm).some(Boolean)) {
      try { sessionStorage.setItem("zb_outdoor_utm", JSON.stringify(utm)); } catch (e) {}
    }
  }
  function getStoredUtm() {
    try { return JSON.parse(sessionStorage.getItem("zb_outdoor_utm") || "{}"); } catch (e) { return {}; }
  }

  function renderRail() {
    var rail = $("#odRail");
    if (!rail) return;
    rail.innerHTML = STEPS.map(function (s, i) {
      var cls = "rs" + (i === state.step ? " active" : i < state.step ? " done" : "");
      var labels = { pontos: "Pontos", periodo: "Período", arte: "Arte", data: "Data", contato: "Contato", resumo: "Resumo" };
      return '<div class="' + cls + '">' + (i + 1) + ". " + labels[s] + "</div>";
    }).join("");
  }

  function renderPontos() {
    var points = ZB.Outdoor.Cart.getPoints();
    var wrap = $("#odStepPontos .od-selected-list");
    if (!wrap) return;
    if (points.length === 0) {
      wrap.innerHTML = '<p style="color:var(--muted);font-size:.9rem">Nenhum ponto selecionado ainda.</p>';
    } else {
      wrap.innerHTML = points.map(function (p) {
        var label = clusterName(p.clusterId) || p.road;
        return '<div class="od-selected-item"><span>Ponto ' + String(p.pointNumber).padStart(2, "0") + " — " + label +
          '</span><span class="x" data-remove-point="' + p.pointNumber + '">✕</span></div>';
      }).join("");
    }
    var next = $("#odStepPontos [data-next]");
    if (next) next.disabled = points.length === 0;
  }

  function renderResumo() {
    var points = ZB.Outdoor.Cart.getPoints();
    var totals = ZB.Outdoor.calculateTotal(points.length, state.duration, state.needsCreative);
    var box = $("#odResumoBox");
    if (!box) return;
    var rows = "";
    rows += '<div class="od-summary-row"><span>' + points.length + " ponto(s)</span><span>" + state.duration + " dias</span></div>";
    rows += '<div class="od-summary-row"><span>Mídia (' + points.length + ' × R$' + ZB.Outdoor.PRICING.pricePerDuration[state.duration] + ')</span><span>R$' + totals.mediaTotal.toLocaleString("pt-BR") + "</span></div>";
    if (state.needsCreative) {
      rows += '<div class="od-summary-row"><span>Criação da arte</span><span>R$' + totals.creativeTotal.toLocaleString("pt-BR") + "</span></div>";
    }
    rows += '<div class="od-summary-row total"><span>Total estimado</span><span>R$' + totals.estimatedTotal.toLocaleString("pt-BR") + "</span></div>";
    box.innerHTML = rows;
  }

  function showStep(i) {
    state.step = i;
    STEPS.forEach(function (s, idx) {
      var el = $("#odStep" + capitalize(s));
      if (el) el.classList.toggle("active", idx === i);
    });
    renderRail();
    if (STEPS[i] === "pontos") renderPontos();
    if (STEPS[i] === "resumo") renderResumo();
    window.dataLayer && window.dataLayer.push({ event: "view_campaign_step", step: STEPS[i] });
    var card = $(".od-builder-card.active") || $(".od-builder-step.active");
    if (card) card.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  function validateContact() {
    var name = $("#odName") ? $("#odName").value.trim() : "";
    var whatsapp = $("#odWhatsapp") ? $("#odWhatsapp").value.trim() : "";
    var email = $("#odEmail") ? $("#odEmail").value.trim() : "";
    var consent = $("#odConsent") ? $("#odConsent").checked : false;
    var err = $("#odContactErr");
    if (!name || (!whatsapp && !email) || !consent) {
      if (err) err.style.display = "block";
      return false;
    }
    if (err) err.style.display = "none";
    state.contact = {
      name: name, whatsapp: whatsapp, email: email,
      company: $("#odCompany") ? $("#odCompany").value.trim() : "",
      objective: $("#odObjective") ? $("#odObjective").value.trim() : "",
      segment: $("#odSegment") ? $("#odSegment").value.trim() : "",
      notes: $("#odNotes") ? $("#odNotes").value.trim() : ""
    };
    return true;
  }

  function submit() {
    var cartPoints = ZB.Outdoor.Cart.getPoints();
    var totals = ZB.Outdoor.calculateTotal(cartPoints.length, state.duration, state.needsCreative);
    var msg = ZB.Outdoor.buildWhatsAppMessage({
      points: cartPoints, durationDays: state.duration, needsCreative: state.needsCreative,
      estimatedTotal: totals.estimatedTotal, desiredDate: state.desiredDate, contact: state.contact
    });
    var waUrl = ZB.Outdoor.buildWhatsAppUrl(msg);

    // Open WhatsApp synchronously (first thing, before any async work) so
    // browsers don't treat it as a blocked popup.
    window.open(waUrl, "_blank", "noopener");
    window.dataLayer && window.dataLayer.push({ event: "submit_outdoor_campaign", value: totals.estimatedTotal });

    $("#odBuilderForm").style.display = "none";
    var success = $("#odSuccess");
    if (success) {
      success.style.display = "block";
      var wa = $("#odSuccessWhatsapp");
      if (wa) wa.href = waUrl;
    }

    // Best-effort background log to the Netlify Function (and, once
    // configured, OUTDOOR_CRM_WEBHOOK_URL) — never blocks or gates the
    // WhatsApp action above, since that must always work on its own.
    var utm = getStoredUtm();
    fetch("/.netlify/functions/outdoor-lead", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        points: cartPoints.map(function (p) { return p.pointNumber; }),
        durationDays: state.duration,
        needsCreative: !!state.needsCreative,
        requestedStartDate: state.desiredDate,
        contact: state.contact,
        website: $("#odWebsite") ? $("#odWebsite").value : "", // honeypot
        utmSource: utm.utmSource, utmMedium: utm.utmMedium, utmCampaign: utm.utmCampaign,
        utmContent: utm.utmContent, utmTerm: utm.utmTerm,
        landingPage: sessionStorage.getItem("zb_outdoor_landing") || window.location.href,
        referrer: document.referrer
      })
    }).catch(function () { /* silent — WhatsApp already handled the handoff */ });

    ZB.Outdoor.Cart.clear();
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!$("#odBuilderForm")) return;
    if (!sessionStorage.getItem("zb_outdoor_landing")) {
      try { sessionStorage.setItem("zb_outdoor_landing", window.location.href); } catch (e) {}
    }
    persistUtm();
    var periodoParam = parseInt(new URLSearchParams(window.location.search).get("periodo"), 10);
    if (periodoParam === 15 || periodoParam === 30) {
      state.duration = periodoParam;
      $$("[data-duration-choice]").forEach(function (b) {
        b.classList.toggle("selected", parseInt(b.getAttribute("data-duration-choice"), 10) === periodoParam);
      });
    }
    showStep(0);

    document.addEventListener("click", function (e) {
      if (e.target.closest("[data-next]")) {
        var step = STEPS[state.step];
        if (step === "contato" && !validateContact()) return;
        if (state.step < STEPS.length - 1) showStep(state.step + 1);
      }
      if (e.target.closest("[data-prev]")) {
        if (state.step > 0) showStep(state.step - 1);
      }
      var rm = e.target.closest("[data-remove-point]");
      if (rm) {
        ZB.Outdoor.Cart.remove(parseInt(rm.getAttribute("data-remove-point"), 10));
        renderPontos();
      }
      var durBtn = e.target.closest("[data-duration-choice]");
      if (durBtn) {
        state.duration = parseInt(durBtn.getAttribute("data-duration-choice"), 10);
        $$("[data-duration-choice]").forEach(function (b) { b.classList.remove("selected"); });
        durBtn.classList.add("selected");
        window.dataLayer && window.dataLayer.push({ event: "select_campaign_duration", duration: state.duration });
      }
      var artBtn = e.target.closest("[data-creative-choice]");
      if (artBtn) {
        state.needsCreative = artBtn.getAttribute("data-creative-choice") === "true";
        $$("[data-creative-choice]").forEach(function (b) { b.classList.remove("selected"); });
        artBtn.classList.add("selected");
        window.dataLayer && window.dataLayer.push({ event: "select_creative_option", needs_creative: state.needsCreative });
      }
      if (e.target.closest("#odSubmitBtn")) { e.preventDefault(); submit(); }
    });

    var dateInput = $("#odDesiredDate");
    if (dateInput) dateInput.addEventListener("change", function () { state.desiredDate = dateInput.value; });

    document.addEventListener("zb:outdoor-cart-change", function () {
      if (STEPS[state.step] === "pontos") renderPontos();
    });
  });
})();
