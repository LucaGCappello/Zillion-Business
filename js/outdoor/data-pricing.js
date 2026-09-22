/* =========================================================
   ZILLION BUSINESS — Outdoor
   data-pricing.js — single source of truth for pricing rules.
   Mirrored server-side in netlify/functions/outdoor-lead.js —
   if you change a value here, change it there too.
   ========================================================= */
window.ZB = window.ZB || {};
window.ZB.Outdoor = window.ZB.Outdoor || {};

ZB.Outdoor.PRICING = {
  currency: "BRL",
  pricePerDuration: {
    15: 850,
    30: 1250
  },
  creativeDesignPrice: 150,
  installationLeadBusinessDays: 5
};

/**
 * Authoritative price calculation — client-side mirror of the Netlify
 * Function. Used only for instant UI feedback; the real total is always
 * recalculated server-side at submit time and the client value is ignored.
 */
ZB.Outdoor.calculateTotal = function (pointCount, durationDays, needsCreative) {
  var pricing = ZB.Outdoor.PRICING;
  var pricePerBillboard = pricing.pricePerDuration[durationDays];
  if (!pricePerBillboard) throw new Error("Invalid duration: " + durationDays);
  var mediaTotal = pointCount * pricePerBillboard;
  var creativeTotal = needsCreative ? pricing.creativeDesignPrice : 0;
  return {
    mediaTotal: mediaTotal,
    creativeTotal: creativeTotal,
    estimatedTotal: mediaTotal + creativeTotal
  };
};
