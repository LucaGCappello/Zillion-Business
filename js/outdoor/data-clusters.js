/* =========================================================
   ZILLION BUSINESS — Outdoor
   data-clusters.js — 8 location clusters (client-supplied, authoritative)
   ========================================================= */
window.ZB = window.ZB || {};
window.ZB.Outdoor = window.ZB.Outdoor || {};

ZB.Outdoor.CLUSTERS = [
  {
    id: "atacadao-mineirao",
    name: "Atacadão Mineirão",
    road: "BR-367 / Entrada da Cidade",
    city: "Porto Seguro",
    state: "BA",
    latitude: -16.436512,
    longitude: -39.094054,
    googleMapsUrl: "https://www.google.com/maps?q=-16.436512,-39.094054",
    hasVerifiedCoordinates: true,
    strategicTags: ["Fluxo de entrada", "Comércio local", "Varejo"]
  },
  {
    id: "ifba",
    name: "IFBA - Instituto Federal da Bahia",
    road: "Av. Adno Musser",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=IFBA+Porto+Seguro",
    hasVerifiedCoordinates: false,
    strategicTags: ["Estudantes", "Público local"]
  },
  {
    id: "atacadao-mix-mateus",
    name: "Atacadão Mix Mateus",
    road: "Av. do Trabalhador - Baianão",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Mix+Mateus+Porto+Seguro",
    hasVerifiedCoordinates: false,
    strategicTags: ["Comércio local", "Varejo", "Fluxo comercial"]
  },
  {
    id: "portal-da-cidade",
    name: "Portal da Cidade",
    road: "BR-367",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Portal+da+Cidade+Porto+Seguro",
    hasVerifiedCoordinates: false,
    strategicTags: ["Turismo", "Fluxo de entrada", "Branding"]
  },
  {
    id: "trevo-arraial-trancoso",
    name: "Trevo Arraial D'Ajuda x Trancoso",
    road: "BA-001",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trevo+Arraial+d'Ajuda+Trancoso",
    hasVerifiedCoordinates: false,
    strategicTags: ["Turismo", "Público seguindo para Arraial e Trancoso"]
  },
  {
    id: "trevo-trancoso-caraiva",
    name: "Trevo Trancoso x Caraíva",
    road: "BA-001",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trevo+Trancoso+Caraiva",
    hasVerifiedCoordinates: false,
    strategicTags: ["Turismo", "Eventos"]
  },
  {
    id: "trevo-coca-cola",
    name: "Trevo da Coca-Cola",
    road: "Av. Adno Musser",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trevo+Coca+Cola+Porto+Seguro",
    hasVerifiedCoordinates: false,
    strategicTags: ["Fluxo de entrada", "Comércio local"]
  },
  {
    id: "anel-viario-mundai",
    name: "Anel Viário / Trevo Mundaí",
    road: "Anel Viário",
    city: "Porto Seguro",
    state: "BA",
    latitude: null,
    longitude: null,
    googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Trevo+Mundai+Anel+Viario+Porto+Seguro",
    hasVerifiedCoordinates: false,
    strategicTags: ["Fluxo comercial", "Acesso regional"]
  }
];
