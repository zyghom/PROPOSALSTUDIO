export const ICONS = {
  garde: "M6 3h12a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM9 8h6M9 12h4",
  devis: "M4 6h16M4 10h16M4 14h16M4 18h10",
  conditions: "M5 7h14M5 12h14M5 17h8",
  signature: "M4 17c3-6 5-6 6-2s2 4 4-1 3-3 6 0",
  profil: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20c1.5-4 5-5 8-5s6.5 1 8 5",
  references: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  temoignages: "M4 5h16v10H8l-4 4z",
  equipe: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 20c1-3.5 3.5-5 6-5s5 1.5 6 5M15 5a3 3 0 0 1 0 6M17 15c2 .8 3.2 2.4 4 5",
  contexte: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15 9l-2 4-4 2 2-4z",
  problematique: "M9 9a3 3 0 1 1 4.6 2.5c-1 .7-1.6 1.2-1.6 2.5M12 17v.5M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z",
  objectifs: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  contraintes: "M6 11h12v9H6zM9 11V7a3 3 0 0 1 6 0v4",
  approche: "M12 3l9 5-9 5-9-5zM3 13l9 5 9-5",
  planning: "M5 5h14v15H5zM5 9h14M9 3v4M15 3v4",
  prestations: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  calculateur: "M6 3h12v18H6zM9 7h6M9 12h.01M12 12h.01M15 12h.01M9 16h.01M12 16h.01M15 16h.01",
  options: "M4 7h16M4 12h16M4 17h16M9 5v4M15 10v4M7 15v4",
  risques: "M12 9v4M12 16v.5M10.3 4.2L2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4.2a2 2 0 0 0-3.4 0z",
  benefices: "M3 17l6-6 4 4 8-8M15 7h6v6",
};

export const BLOCKS = {
  garde: { name: "Page de garde", desc: "Client, contact, projet, date" },
  devis: { name: "Devis récapitulatif", desc: "Prestations, jours, TJM, totaux" },
  conditions: { name: "Conditions commerciales", desc: "Paiement, validité, propriété" },
  signature: { name: "Signature", desc: "Deux colonnes prestataire / client" },
  profil: { name: "Profil consultant", desc: "Photo, bio, expertises" },
  references: { name: "Références & cas clients", desc: "Missions comparables" },
  temoignages: { name: "Témoignages clients", desc: "Citations vérifiées" },
  equipe: { name: "Équipe projet", desc: "Intervenants et rôles" },
  contexte: { name: "Contexte", desc: "Situation actuelle du client" },
  problematique: { name: "Problématique", desc: "Le problème à résoudre" },
  objectifs: { name: "Objectifs de la mission", desc: "Résultats attendus" },
  contraintes: { name: "Contraintes identifiées", desc: "Délais, budget, technique" },
  approche: { name: "Approche & phases", desc: "Méthodologie en étapes" },
  planning: { name: "Planning / timeline", desc: "Jalons et durées" },
  prestations: { name: "Détail des prestations", desc: "Description des livrables" },
  calculateur: { name: "Calculateur d'entretiens", desc: "Profils × 3 entretiens × 3h" },
  options: { name: "Options / scénarios", desc: "2-3 formules comparatives" },
  risques: { name: "Risques de ne rien faire", desc: "Coût de l'inaction" },
  benefices: { name: "Bénéfices attendus & ROI", desc: "Valeur créée, retour" },
};

export const LIB = [
  { name: "Blocs essentiels", ids: ["garde", "devis", "conditions", "signature"] },
  { name: "Blocs présentation", ids: ["profil", "references", "temoignages", "equipe"] },
  { name: "Blocs projet", ids: ["contexte", "problematique", "objectifs", "contraintes"] },
  { name: "Blocs méthodologie", ids: ["approche", "planning", "prestations", "calculateur"] },
  { name: "Blocs stratégiques", ids: ["options", "risques", "benefices"] },
];

export const SECTEURS = [
  "Métallurgie",
  "Énergie",
  "Chimie",
  "Agroalimentaire",
  "Machines & équipements",
  "Logistique industrielle",
  "Autre",
];

export const CATALOG = [
  {
    name: "UX Research",
    modules: [
      { id: "entretiens", name: "Entretiens utilisateurs", days: 5, auto: true },
      { id: "observation", name: "Observation terrain / shadowing", days: 4 },
      { id: "heuristique", name: "Audit heuristique", days: 3 },
      { id: "tests", name: "Tests utilisateurs modérés", days: 4 },
    ],
  },
  {
    name: "Product Discovery",
    modules: [
      { id: "cadrage", name: "Ateliers de cadrage", days: 2 },
      { id: "parcours", name: "Cartographie des parcours", days: 3 },
      { id: "synthese", name: "Synthèse & opportunités", days: 3 },
    ],
  },
  {
    name: "Product Design",
    modules: [
      { id: "wireframes", name: "Wireframes & flows", days: 5 },
      { id: "ui", name: "UI hi-fi", days: 6 },
      { id: "ds", name: "Design system", days: 8 },
    ],
  },
  {
    name: "IA & Product Design",
    modules: [
      { id: "protoia", name: "Prototypage assisté par IA", days: 4 },
      { id: "auditia", name: "Audit d'opportunités IA", days: 3 },
      { id: "poc", name: "POC assistant métier", days: 6 },
    ],
  },
  {
    name: "Stratégie & Transformation",
    modules: [
      { id: "coaching", name: "Coaching équipe produit", days: 4 },
      { id: "roadmap", name: "Roadmap UX", days: 2 },
    ],
  },
];

export const TEMPLATES = [
  {
    name: "Mission audit UX",
    ids: ["garde", "contexte", "objectifs", "approche", "devis", "conditions", "signature"],
    modified: "il y a 3 j",
    used: 12,
  },
  {
    name: "Discovery complète",
    ids: [
      "garde",
      "profil",
      "contexte",
      "problematique",
      "objectifs",
      "calculateur",
      "approche",
      "devis",
      "conditions",
      "signature",
    ],
    modified: "il y a 1 sem",
    used: 8,
  },
  {
    name: "Accompagnement IA",
    ids: ["garde", "profil", "contexte", "benefices", "approche", "devis", "conditions", "signature"],
    modified: "il y a 2 sem",
    used: 5,
  },
  {
    name: "Mission sur-mesure",
    ids: ["garde", "devis", "conditions", "signature"],
    modified: "il y a 1 mois",
    used: 3,
  },
];

export const OFFERS = [
  {
    client: "Fonderie Delcourt",
    secteur: "Métallurgie",
    project: "Refonte de la supervision d'atelier — audit UX & discovery",
    date: "08 · 07 · 26",
    amount: 15750,
    status: "envoyee",
  },
  {
    client: "Mécanique Roussel",
    secteur: "Machines & équipements",
    project: "Discovery application de maintenance préventive",
    date: "02 · 07 · 26",
    amount: 22400,
    status: "consultee",
  },
  {
    client: "Papeteries du Rhône",
    secteur: "Process industriel",
    project: "Audit UX du portail fournisseurs",
    date: "28 · 06 · 26",
    amount: 9900,
    status: "brouillon",
  },
  {
    client: "Robinetterie Chambon",
    secteur: "Métallurgie",
    project: "Accompagnement IA — assistant de gamme",
    date: "15 · 06 · 26",
    amount: 28800,
    status: "signee",
  },
  {
    client: "Textiles Berthelot",
    secteur: "Textile technique",
    project: "Refonte de l'outil de planification",
    date: "04 · 06 · 26",
    amount: 18200,
    status: "refusee",
  },
  {
    client: "Aciers Chastagnier",
    secteur: "Sidérurgie",
    project: "Discovery portail qualité",
    date: "12 · 05 · 26",
    amount: 12600,
    status: "expiree",
  },
];

export const STATUS = {
  brouillon: { label: "Brouillon", bg: "#F4F4F2", fg: "#7A7A7A" },
  envoyee: { label: "Envoyée", bg: "rgb(240,250,252)", fg: "rgb(20,120,135)" },
  consultee: { label: "Consultée", bg: "#FDF3E7", fg: "#C2410C" },
  signee: { label: "Signée", bg: "#EAF7EE", fg: "#16A34A" },
  refusee: { label: "Refusée", bg: "#FDECEC", fg: "#DC2626" },
  expiree: { label: "Expirée", bg: "#F4F4F2", fg: "#A8A8A8" },
};

export const FILTER_DEFS = [
  ["all", "Toutes"],
  ["brouillon", "Brouillon"],
  ["envoyee", "Envoyée"],
  ["consultee", "Consultée"],
  ["signee", "Signée"],
  ["refusee", "Refusée"],
  ["expiree", "Expirée"],
];

export const TJM_DEFAULT = 650;
