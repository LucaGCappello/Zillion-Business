# Zillion Business

Static HTML/CSS/vanilla-JS site (no framework, no build step), deployed on Netlify.

```
index.html, blog.html, artigo.html, bolsa.html, landing.html, login.html, termos.html,
politica-privacidade.html, politica-cookies.html   — main site pages
css/, js/, public/                                  — shared styles/scripts/assets
outdoor/                                            — Outdoor / Mídia Exterior vertical (see below)
netlify/functions/                                  — the site's only server-side code
```

Run locally with any static server (e.g. `npx serve .` or VS Code Live Server) and, for the
Outdoor lead function, the [Netlify CLI](https://docs.netlify.com/cli/get-started/): `netlify dev`.

## Environment variables

See `.env.example`. Only `OUTDOOR_CRM_WEBHOOK_URL` (set in the Netlify dashboard, never
committed) is actually read at runtime, by `netlify/functions/outdoor-lead.js`.

## Outdoor / Mídia Exterior

A new vertical inside the existing site: `/outdoor/`, `/outdoor/pontos/` (explorer + map),
`/outdoor/pontos/:slug` (individual billboard, served via a Netlify redirect to
`outdoor/pontos/ponto-template.html`), `/outdoor/planejar-campanha/` (6-step campaign
builder), and three regional SEO pages under `/outdoor/regioes/`.

**Architecture**: no database. The 49 billboard points, 8 location clusters, and pricing
rules live in plain JS data files under `js/outdoor/`. The only backend logic is
`netlify/functions/outdoor-lead.js`, which recalculates the campaign total server-side
(never trusts the browser) and forwards leads to `OUTDOOR_CRM_WEBHOOK_URL`.

### Editing billboard data (no admin UI)

There is no admin panel. To add, edit, or deactivate a point/cluster/price:

1. Points — edit `js/outdoor/data-points.js`. Each entry is a `P(number, slug, clusterId, road, locationDescription, format)` call. Set `isActive: false` (after generating the object — currently every point defaults to `true`; if you need to deactivate one, add `.isActive = false` the same way point 45's `faces` override is done at the bottom of the file) to hide a point without deleting it.
2. Clusters — edit `js/outdoor/data-clusters.js`. Only add real `latitude`/`longitude` if you have them verified — otherwise leave `null` and set `hasVerifiedCoordinates: false`; the map will never plot a guessed pin.
3. Pricing — edit `js/outdoor/data-pricing.js` **and** the mirrored constants at the top of `netlify/functions/outdoor-lead.js` (they must match — the function is the authoritative source at submit time).
4. Photos — replace `public/media/outdoor/ponto-NN.webp` (same filename convention: two-digit point number). `public/media/outdoor/placeholder.webp` is the fallback for a point with no photo yet.
5. Redeploy. That's the entire "admin" workflow for this MVP.

### Known limitations

- **No real-time availability/booking.** Every point shows "Sujeita à disponibilidade" — the site cannot confirm a date range is actually free. Adding this later means introducing a real database (the data files' field names already mirror a future DB schema, so this is additive, not a rewrite).
- **Lead persistence depends on `OUTDOOR_CRM_WEBHOOK_URL`.** Unset = leads aren't stored anywhere except what the visitor sends themselves via the WhatsApp button.
- **Two points (10, 19)** have location text matching a cluster name but are intentionally left unmapped — their text didn't appear in the client-supplied cluster point lists. Worth a manual confirmation.
- Point detail page `<title>`/meta description are set client-side (no server-side rendering available in a static site), which is a minor SEO tradeoff versus a real per-page file.
- Billboard photos were cropped programmatically from `MÍDIA KIT OUTDOOR.pdf`'s catalog pages; a few have a faint stray border artifact from a neighboring card. Fine for launch; worth a manual re-crop pass later if pixel-perfect photos matter.

### Analytics

No GA4 (or any analytics) exists on the site today. Outdoor pages push events to
`window.dataLayer` (`view_outdoor_landing`, `add_outdoor_to_campaign`,
`submit_outdoor_campaign`, etc.) in the standard GA4 shape — wiring in a real GA4
snippet later will pick these up with no code changes.
