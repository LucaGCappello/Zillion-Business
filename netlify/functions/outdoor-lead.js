/* =========================================================
   ZILLION BUSINESS — Outdoor
   netlify/functions/outdoor-lead.js

   Validates a campaign submission, recalculates the total
   server-side from the pricing constants below (never trusts
   the total the browser sent), and forwards the lead to
   OUTDOOR_CRM_WEBHOOK_URL if configured. No database — this
   function is the only server-side piece of the Outdoor MVP.
   ========================================================= */

// Mirrors js/outdoor/data-pricing.js — keep both in sync.
const PRICING = {
  pricePerDuration: { 15: 850, 30: 1250 },
  creativeDesignPrice: 150
};

const VALID_DURATIONS = Object.keys(PRICING.pricePerDuration).map(Number);

function isNonEmptyString(v) {
  return typeof v === "string" && v.trim().length > 0;
}

function calculateTotal(pointCount, durationDays, needsCreative) {
  const pricePerBillboard = PRICING.pricePerDuration[durationDays];
  const mediaTotal = pointCount * pricePerBillboard;
  const creativeTotal = needsCreative ? PRICING.creativeDesignPrice : 0;
  return { mediaTotal, creativeTotal, estimatedTotal: mediaTotal + creativeTotal };
}

function makeReference() {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return "OUT-" + Date.now().toString(36).toUpperCase() + "-" + rand;
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: JSON.stringify({ ok: false, error: "Method not allowed" }) };
  }

  let data;
  try {
    data = JSON.parse(event.body || "{}");
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, error: "Invalid JSON" }) };
  }

  // ---- honeypot (silently "succeed" without doing anything) ----
  if (isNonEmptyString(data.website)) {
    return { statusCode: 200, body: JSON.stringify({ ok: true, reference: makeReference() }) };
  }

  // ---- validation ----
  const points = Array.isArray(data.points) ? data.points.filter((p) => Number.isInteger(p) && p >= 1 && p <= 49) : [];
  const durationDays = Number(data.durationDays);
  const needsCreative = Boolean(data.needsCreative);
  const contact = data.contact || {};

  const errors = [];
  if (points.length === 0) errors.push("Selecione ao menos um ponto.");
  if (!VALID_DURATIONS.includes(durationDays)) errors.push("Período inválido.");
  if (!isNonEmptyString(contact.name)) errors.push("Nome é obrigatório.");
  if (!isNonEmptyString(contact.whatsapp) && !isNonEmptyString(contact.email)) {
    errors.push("Informe WhatsApp ou e-mail.");
  }

  if (errors.length) {
    return { statusCode: 400, body: JSON.stringify({ ok: false, errors }) };
  }

  // ---- authoritative server-side price recalculation ----
  const totals = calculateTotal(points.length, durationDays, needsCreative);
  const reference = makeReference();

  const lead = {
    reference,
    points,
    durationDays,
    needsCreative,
    mediaTotal: totals.mediaTotal,
    creativeTotal: totals.creativeTotal,
    estimatedTotal: totals.estimatedTotal,
    requestedStartDate: isNonEmptyString(data.requestedStartDate) ? data.requestedStartDate : null,
    contact: {
      name: contact.name,
      company: isNonEmptyString(contact.company) ? contact.company : null,
      whatsapp: isNonEmptyString(contact.whatsapp) ? contact.whatsapp : null,
      email: isNonEmptyString(contact.email) ? contact.email : null,
      objective: isNonEmptyString(contact.objective) ? contact.objective : null,
      segment: isNonEmptyString(contact.segment) ? contact.segment : null,
      notes: isNonEmptyString(contact.notes) ? contact.notes : null
    },
    attribution: {
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmContent: data.utmContent || null,
      utmTerm: data.utmTerm || null,
      landingPage: data.landingPage || null,
      referrer: data.referrer || null
    },
    createdAt: new Date().toISOString()
  };

  // ---- forward to CRM/n8n webhook (URL stays server-side only) ----
  const webhookUrl = process.env.OUTDOOR_CRM_WEBHOOK_URL;
  if (isNonEmptyString(webhookUrl)) {
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
    } catch (e) {
      // Forwarding failure must not block the user from getting a reference,
      // but we do want it visible in Netlify function logs.
      console.error("outdoor-lead: webhook forward failed", e);
    }
  } else {
    console.warn("outdoor-lead: OUTDOOR_CRM_WEBHOOK_URL not configured — lead was not persisted anywhere.");
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      ok: true,
      reference,
      estimatedTotal: totals.estimatedTotal,
      mediaTotal: totals.mediaTotal,
      creativeTotal: totals.creativeTotal
    })
  };
};
