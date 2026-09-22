/* =========================================================
   ZILLION BUSINESS — Outdoor
   data-points.js — 49 billboard points, extracted from
   "MÍDIA KIT OUTDOOR.pdf" (verified road/location text + format
   badges). Cluster assignment follows only the mappings explicitly
   supplied by the client — unmapped points keep clusterId: null
   even when their text resembles a cluster name (see README).

   Schema mirrors a future outdoor_points DB table 1:1 so this file
   can be swapped for a real API response without touching any page.
   ========================================================= */
window.ZB = window.ZB || {};
window.ZB.Outdoor = window.ZB.Outdoor || {};

// helper used only while building this file — not shipped as an API
function P(n, slug, clusterId, road, locationDescription, fmt) {
  return {
    pointNumber: n,
    slug: slug,
    clusterId: clusterId,
    road: road,
    locationDescription: locationDescription,
    city: "Porto Seguro",
    state: "BA",
    widthM: fmt.w,
    heightM: fmt.h,
    faces: fmt.f,
    illuminated: fmt.i,
    panelType: fmt.p,
    strategicTags: [],
    image: "/public/media/outdoor/ponto-" + String(n).padStart(2, "0") + ".webp",
    isActive: true
  };
}

// format groups verified per Media Kit catalog page badge
var SIMPLES        = { w: 9,  h: 3, f: 1, i: false, p: "simples" }; // pontos 01–28
var DUPLO_18        = { w: 18, h: 3, f: 1, i: false, p: "duplo" };   // pontos 29–32
var DUPLO_18_LUZ     = { w: 18, h: 3, f: 1, i: true,  p: "duplo" };   // pontos 33–34
var DUPLO_2FACE_LUZ   = { w: 9,  h: 3, f: 2, i: true,  p: "duplo" };   // pontos 35–38
var DUPLO_LUZ          = { w: 9,  h: 3, f: 1, i: true,  p: "duplo" };   // pontos 39–42
var DUPLO             = { w: 9,  h: 3, f: 1, i: false, p: "duplo" };   // pontos 43–49

ZB.Outdoor.POINTS = [
  P(1,  "01-trevo-arraial-trancoso-acesso",     null,                       "Arraial X Trancoso",       "Trevo de acesso", SIMPLES),
  P(2,  "02-atacadao-mineirao",                 "atacadao-mineirao",        "BR 367",                   "Ao lado do Atacadão Mineirão", SIMPLES),
  P(3,  "03-ifba",                              "ifba",                     "Av. Adno Musser",          "Ao lado do IFBA", SIMPLES),
  P(4,  "04-trevo-arraial-trancoso",            "trevo-arraial-trancoso",   "Trevo Arraial x Trancoso",  "Eixo de conexão regional", SIMPLES),
  P(5,  "05-trevo-coca-cola",                   "trevo-coca-cola",          "Av. Adno Musser",          "Em frente ao Trevo Coca-Cola", SIMPLES),
  P(6,  "06-atacadao-mix-mateus",               "atacadao-mix-mateus",      "Av. do Trabalhador",       "Sentido Atacadão Mix Mateus", SIMPLES),
  P(7,  "07-bairro-baianao-ladeira",            null,                       "Bairro Baianão",            "Ladeira principal", SIMPLES),
  P(8,  "08-atacadao-mix-mateus",               "atacadao-mix-mateus",      "Av. do Trabalhador",       "Ao lado do Mix Mateus, sentido Centro", SIMPLES),
  P(9,  "09-atacadao-mineirao",                 "atacadao-mineirao",        "BR 367",                   "Ao lado do Atacadão Mineirão", SIMPLES),
  P(10, "10-av-adno-musser-trevo-coca-cola",     null,                       "Av. Adno Musser",          "Em frente ao Trevo Coca-Cola", SIMPLES),
  P(11, "11-trevo-coca-cola",                   "trevo-coca-cola",          "Av. Adno Musser",          "Chegada da cidade, ao lado do posto dos taxistas", SIMPLES),
  P(12, "12-trevo-trancoso-caraiva",            "trevo-trancoso-caraiva",   "BA 001",                    "Chegada de Trancoso, próximo ao trevo Caraíva", SIMPLES),
  P(13, "13-bairro-baianao-cambolo",            null,                       "Bairro Baianão",            "Ladeira e entrada do bairro Cambolo", SIMPLES),
  P(14, "14-ifba",                              "ifba",                     "Av. Adno Musser",          "Ao lado do IFBA, entrada da cidade", SIMPLES),
  P(15, "15-atacadao-mix-mateus",               "atacadao-mix-mateus",      "Av. do Trabalhador",       "Sentido Mix Mateus e Centro", SIMPLES),
  P(16, "16-av-trabalhador-baianao-orla",        null,                       "Av. do Trabalhador",       "Baianão, sentido Orla e Centro", SIMPLES),
  P(17, "17-trevo-arraial-trancoso-club-med",    null,                       "Trevo Arraial x Trancoso",  "Acesso ao Club Med", SIMPLES),
  P(18, "18-trevo-arraial-trancoso",            "trevo-arraial-trancoso",   "BA 001",                    "Trevo Arraial x Trancoso", SIMPLES),
  P(19, "19-ba-001-trevo-trancoso",             null,                       "BA 001",                    "Próximo ao Trevo de Trancoso", SIMPLES),
  P(20, "20-atacadao-mix-mateus",               "atacadao-mix-mateus",      "Av. do Trabalhador",       "Sentido Centro e Mix Mateus", SIMPLES),
  P(21, "21-trevo-arraial-trancoso",            "trevo-arraial-trancoso",   "Trevo BA 001",              "Arraial x Trancoso", SIMPLES),
  P(22, "22-av-trabalhador-trevo",              null,                       "Av. do Trabalhador",       "Trevo, visibilidade nos dois sentidos", SIMPLES),
  P(23, "23-trevo-trancoso-caraiva",            "trevo-trancoso-caraiva",   "BA 001",                    "Próximo ao trevo Trancoso x Caraíva", SIMPLES),
  P(24, "24-atacadao-mineirao",                 "atacadao-mineirao",        "Av. Adno Musser",          "Ao lado do Atacadão Mineirão", SIMPLES),
  P(25, "25-atacadao-mix-mateus",               "atacadao-mix-mateus",      "Av. do Trabalhador",       "Em frente ao Atacadão Mix Mateus", SIMPLES),
  P(26, "26-atacadao-mineirao",                 "atacadao-mineirao",        "Av. Adno Musser",          "Em frente ao Atacadão Mineirão", SIMPLES),
  P(27, "27-trevo-arraial-trancoso",            "trevo-arraial-trancoso",   "BA 001",                    "Trevo Arraial x Trancoso", SIMPLES),
  P(28, "28-trevo-arraial-trancoso-drogasil",   "trevo-arraial-trancoso",   "Av. do Trabalhador",       "Em frente à Drogasil", SIMPLES),
  P(29, "29-atacadao-mineirao",                 "atacadao-mineirao",        "Av. Adno Musser",          "Ao lado do Atacadão Mineirão", DUPLO_18),
  P(30, "30-atacadao-mix-mateus",               "atacadao-mix-mateus",      "Av. do Trabalhador",       "Ao lado do Atacadão Mix Mateus", DUPLO_18),
  P(31, "31-trevo-arraial-trancoso",            "trevo-arraial-trancoso",   "BR 367",                   "Trevo Arraial x Trancoso e Centro de Porto Seguro", DUPLO_18),
  P(32, "32-br-367-anel-viario",                null,                       "BR 367",                   "Próximo ao trevo do Anel Viário", DUPLO_18),
  P(33, "33-br-367-posto-taxistas",             null,                       "BR 367",                   "Ao lado do posto dos taxistas", DUPLO_18_LUZ),
  P(34, "34-atacadao-mineirao",                 "atacadao-mineirao",        "Av. Adno Musser",          "Em frente ao Atacadão Mineirão", DUPLO_18_LUZ),
  P(35, "35-portal-da-cidade",                  "portal-da-cidade",         "BR 367",                   "Portal da cidade", DUPLO_2FACE_LUZ),
  P(36, "36-portal-da-cidade",                  "portal-da-cidade",         "BR 367",                   "Ao lado do Portal da Cidade", DUPLO_2FACE_LUZ),
  P(37, "37-portal-da-cidade",                  "portal-da-cidade",         "BR 367",                   "Ao lado do Portal da Cidade", DUPLO_2FACE_LUZ),
  P(38, "38-garagem-cvc",                       null,                       "Garagem CVC",               "Em frente à garagem", DUPLO_2FACE_LUZ),
  P(39, "39-br-367-portal-cidade",              null,                       "BR 367",                   "Próximo ao Portal da Cidade", DUPLO_LUZ),
  P(40, "40-br-367-garagem-brasileiro",         null,                       "BR 367",                   "Ao lado da garagem da Brasileiro, chegada da cidade", DUPLO_LUZ),
  P(41, "41-atacadao-mineirao",                 "atacadao-mineirao",        "BR 367",                   "Em frente ao Atacadão Mineirão", DUPLO_LUZ),
  P(42, "42-atacadao-mineirao",                 "atacadao-mineirao",        "Av. Adno Musser",          "Chegada da cidade, em frente ao Atacadão Mineirão", DUPLO_LUZ),
  P(43, "43-trevo-trancoso-caraiva",            "trevo-trancoso-caraiva",   "BA 001",                    "Trevo Trancoso x Caraíva", DUPLO),
  P(44, "44-anel-viario-mundai",                "anel-viario-mundai",       "Anel Viário",               "Trevo Mundaí, sentido Orla e Cabrália", DUPLO),
  P(45, "45-av-adno-musser-correios",           null,                       "Av. Adno Musser",          "Entrada da cidade, próximo aos Correios; dupla face", DUPLO),
  P(46, "46-bairro-cambolo-entrada",            null,                       "Bairro Cambolo",            "Entrada do bairro", DUPLO),
  P(47, "47-atacadao-mineirao",                 "atacadao-mineirao",        "Av. Adno Musser",          "Em frente ao Atacadão Mineirão", DUPLO),
  P(48, "48-ifba",                              "ifba",                     "Av. Adno Musser",          "Antes do IFBA", DUPLO),
  P(49, "49-ladeira-dos-bairros",               null,                       "Ladeira dos Bairros",       "Sapoti, Mirante, Fontana e Mira Porto; acesso à Av. do Trabalhador", DUPLO)
];

// Point 45's own description explicitly says "dupla face" — overrides the
// page-level badge (which says 1 face) for this point specifically.
ZB.Outdoor.POINTS.find(function (p) { return p.pointNumber === 45; }).faces = 2;
