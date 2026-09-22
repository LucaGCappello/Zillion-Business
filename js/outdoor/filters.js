/* =========================================================
   ZILLION BUSINESS — Outdoor
   filters.js — /outdoor/pontos/ explorer: search, filters,
   URL query params, list rendering, mobile map/list toggle.
   Include after data-points.js, data-clusters.js, cart.js.
   ========================================================= */
(function () {
  "use strict";
  window.ZB = window.ZB || {};
  window.ZB.Outdoor = window.ZB.Outdoor || {};

  var $ = function (s) { return document.querySelector(s); };

  function clusterById(id) {
    return (ZB.Outdoor.CLUSTERS || []).find(function (c) { return c.id === id; });
  }

  function getParams() {
    var qs = new URLSearchParams(window.location.search);
    return {
      q: qs.get("q") || "",
      cluster: qs.get("cluster") || "",
      formato: qs.get("formato") || "",
      iluminado: qs.get("iluminado") || ""
    };
  }

  function setParams(params) {
    var qs = new URLSearchParams();
    if (params.q) qs.set("q", params.q);
    if (params.cluster) qs.set("cluster", params.cluster);
    if (params.formato) qs.set("formato", params.formato);
    if (params.iluminado) qs.set("iluminado", params.iluminado);
    var url = window.location.pathname + (qs.toString() ? "?" + qs.toString() : "");
    window.history.replaceState(null, "", url);
  }

  function matches(point, params) {
    if (params.cluster && point.clusterId !== params.cluster) return false;
    if (params.formato && point.panelType !== params.formato) return false;
    if (params.iluminado === "sim" && !point.illuminated) return false;
    if (params.q) {
      var hay = [
        "ponto " + point.pointNumber, point.road, point.locationDescription,
        clusterById(point.clusterId) ? clusterById(point.clusterId).name : ""
      ].join(" ").toLowerCase();
      if (hay.indexOf(params.q.toLowerCase()) === -1) return false;
    }
    return true;
  }

  function cardHtml(point) {
    var cluster = clusterById(point.clusterId);
    var label = cluster ? cluster.name : point.road;
    var badges = "";
    badges += '<span class="od-badge">' + point.widthM + '×' + point.heightM + 'm</span>';
    badges += '<span class="od-badge">' + (point.faces === 2 ? '2 faces' : '1 face') + '</span>';
    if (point.illuminated) badges += '<span class="od-badge lit">Iluminado</span>';
    var num = String(point.pointNumber).padStart(2, "0");
    return (
      '<article class="od-point-card">' +
        '<a href="/outdoor/pontos/' + point.slug + '"><img src="' + point.image + '" alt="Outdoor ponto ' + num + ' na ' + point.road + ' em Porto Seguro, Bahia" loading="lazy"></a>' +
        '<div class="od-point-body">' +
          '<span class="od-point-num">PONTO ' + num + '</span>' +
          '<h3><a href="/outdoor/pontos/' + point.slug + '">' + label + '</a></h3>' +
          '<div class="od-point-road">' + point.road + ' · ' + point.locationDescription + '</div>' +
          '<div class="od-badge-row">' + badges + '</div>' +
          '<div class="od-point-actions">' +
            '<a href="/outdoor/pontos/' + point.slug + '" class="btn btn-ghost btn-sm">Ver ponto</a>' +
            '<button class="btn btn-primary btn-sm" data-outdoor-add="' + point.pointNumber + '">Adicionar à campanha</button>' +
          '</div>' +
        '</div>' +
      '</article>'
    );
  }

  function render() {
    var params = getParams();
    var list = (ZB.Outdoor.POINTS || []).filter(function (p) { return matches(p, params); });
    var container = $("#odPointList");
    var empty = $("#odEmptyState");
    if (!container) return list;

    if (list.length === 0) {
      container.innerHTML = "";
      if (empty) empty.style.display = "block";
    } else {
      if (empty) empty.style.display = "none";
      container.innerHTML = list.map(cardHtml).join("");
    }
    if (ZB.Outdoor.Cart) ZB.Outdoor.Cart.refresh();
    if (window.ZB.Outdoor.Map && ZB.Outdoor.Map.setPoints) ZB.Outdoor.Map.setPoints(list);
    if (window.dataLayer) window.dataLayer.push({ event: "filter_outdoor_points", filters: params });
    return list;
  }

  function populateClusterSelect() {
    var sel = $("#odClusterFilter");
    if (!sel) return;
    (ZB.Outdoor.CLUSTERS || []).forEach(function (c) {
      var opt = document.createElement("option");
      opt.value = c.id; opt.textContent = c.name;
      sel.appendChild(opt);
    });
  }

  function bind() {
    var params = getParams();
    if ($("#odSearch")) $("#odSearch").value = params.q;
    if ($("#odClusterFilter")) $("#odClusterFilter").value = params.cluster;
    if ($("#odFormatFilter")) $("#odFormatFilter").value = params.formato;
    if ($("#odLightFilter")) $("#odLightFilter").checked = params.iluminado === "sim";

    function onChange() {
      setParams({
        q: $("#odSearch") ? $("#odSearch").value.trim() : "",
        cluster: $("#odClusterFilter") ? $("#odClusterFilter").value : "",
        formato: $("#odFormatFilter") ? $("#odFormatFilter").value : "",
        iluminado: $("#odLightFilter") && $("#odLightFilter").checked ? "sim" : ""
      });
      render();
    }

    if ($("#odSearch")) {
      $("#odSearch").addEventListener("input", function () {
        window.dataLayer && window.dataLayer.push({ event: "search_outdoor_points" });
        onChange();
      });
    }
    [$("#odClusterFilter"), $("#odFormatFilter"), $("#odLightFilter")].forEach(function (el) {
      if (el) el.addEventListener("change", onChange);
    });
    if ($("#odClearFilters")) {
      $("#odClearFilters").addEventListener("click", function () {
        setParams({}); bind(); render();
      });
    }

    // mobile map/list toggle
    var mapBtn = $("#odMobileMapBtn"), listBtn = $("#odMobileListBtn");
    var mapCol = $(".od-map-col"), listCol = $(".od-list-col");
    if (mapBtn && listBtn && mapCol && listCol) {
      mapBtn.addEventListener("click", function () {
        mapCol.classList.add("show"); listCol.classList.add("hide");
        mapBtn.classList.add("active"); listBtn.classList.remove("active");
        window.dataLayer && window.dataLayer.push({ event: "open_outdoor_map" });
        if (window.ZB.Outdoor.Map && ZB.Outdoor.Map.invalidateSize) ZB.Outdoor.Map.invalidateSize();
      });
      listBtn.addEventListener("click", function () {
        mapCol.classList.remove("show"); listCol.classList.remove("hide");
        listBtn.classList.add("active"); mapBtn.classList.remove("active");
      });
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    if (!$("#odPointList")) return;
    populateClusterSelect();
    bind();
    render();
  });

  ZB.Outdoor.rerenderExplorer = render;
})();
