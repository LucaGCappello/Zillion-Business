/* =========================================================
   ZILLION BUSINESS — Outdoor
   map.js — Leaflet + OpenStreetMap, loaded dynamically so the
   rest of the site never pays for it. Only plots clusters with
   VERIFIED coordinates (today: Atacadão Mineirão only) — never
   invents a pin from a Google Maps search link.
   ========================================================= */
(function () {
  "use strict";
  window.ZB = window.ZB || {};
  window.ZB.Outdoor = window.ZB.Outdoor || {};

  var PORTO_SEGURO_CENTER = [-16.4487, -39.0639];
  var leafletLoading = null;

  function loadLeaflet() {
    if (window.L) return Promise.resolve();
    if (leafletLoading) return leafletLoading;
    leafletLoading = new Promise(function (resolve, reject) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css";
      document.head.appendChild(css);

      var script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return leafletLoading;
  }

  function pointsByVerifiedCluster(points) {
    var byCluster = {};
    points.forEach(function (p) {
      if (!p.clusterId) return;
      var cluster = (ZB.Outdoor.CLUSTERS || []).find(function (c) { return c.id === p.clusterId; });
      if (!cluster || !cluster.hasVerifiedCoordinates) return;
      byCluster[cluster.id] = byCluster[cluster.id] || { cluster: cluster, points: [] };
      byCluster[cluster.id].points.push(p);
    });
    return Object.keys(byCluster).map(function (k) { return byCluster[k]; });
  }

  var Map = {
    map: null,
    markersLayer: null,

    init: function (containerId) {
      var el = document.getElementById(containerId);
      if (!el) return Promise.resolve();
      return loadLeaflet().then(function () {
        Map.map = L.map(containerId, { scrollWheelZoom: false }).setView(PORTO_SEGURO_CENTER, 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
          maxZoom: 18
        }).addTo(Map.map);
        Map.markersLayer = L.layerGroup().addTo(Map.map);
        Map.setPoints(ZB.Outdoor.POINTS || []);
      });
    },

    setPoints: function (points) {
      if (!Map.map || !window.L) return;
      Map.markersLayer.clearLayers();
      var groups = pointsByVerifiedCluster(points);
      groups.forEach(function (g) {
        var marker = L.marker([g.cluster.latitude, g.cluster.longitude]).addTo(Map.markersLayer);
        var listItems = g.points.map(function (p) {
          return '<div>Ponto ' + String(p.pointNumber).padStart(2, "0") + '</div>';
        }).join("");
        marker.bindPopup(
          '<div class="od-map-popup"><h4>' + g.cluster.name + '</h4>' +
          '<div>' + g.points.length + ' ponto(s) neste local</div>' +
          listItems +
          '<a href="/outdoor/pontos/?cluster=' + g.cluster.id + '">Ver pontos →</a></div>'
        );
      });
      if (groups.length === 0) return;
      if (groups.length === 1) {
        Map.map.setView([groups[0].cluster.latitude, groups[0].cluster.longitude], 13);
      }
    },

    invalidateSize: function () {
      if (Map.map) setTimeout(function () { Map.map.invalidateSize(); }, 80);
    }
  };

  ZB.Outdoor.Map = Map;
})();
