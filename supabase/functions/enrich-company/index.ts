// ProposalStudio — Fonction Edge « enrich-company »
//
// Reçoit { url } (le site web d'un prospect), récupère le contenu de la page,
// et demande à Google Gemini d'en extraire les informations de la société
// sous forme structurée, pour pré-remplir la page de garde d'une offre.
//
// La clé API Gemini est lue depuis le secret GEMINI_API_KEY (jamais exposée
// au navigateur). Voir README.md pour l'obtenir (gratuit) et déployer.

const GEMINI_MODEL = "gemini-2.5-flash";

const SECTEURS = [
  "Métallurgie",
  "Énergie",
  "Chimie",
  "Agroalimentaire",
  "Machines & équipements",
  "Logistique industrielle",
  "Autre",
];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

// Nettoie le HTML pour ne garder que du texte lisible.
function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function normalizeUrl(raw: string): string {
  const u = raw.trim();
  if (!/^https?:\/\//i.test(u)) return "https://" + u;
  return u;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) {
    return json({ error: "GEMINI_API_KEY non configurée sur le serveur." }, 500);
  }

  let url: string;
  try {
    const body = await req.json();
    url = normalizeUrl(String(body.url ?? ""));
    if (!body.url) return json({ error: "URL manquante." }, 400);
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }

  // 1. Récupérer le contenu du site
  let pageText = "";
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ProposalStudio/1.0)" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) return json({ error: `Site injoignable (HTTP ${res.status}).` }, 422);
    const html = await res.text();
    pageText = htmlToText(html).slice(0, 15000);
    if (pageText.length < 40) return json({ error: "Contenu du site insuffisant pour l'analyse." }, 422);
  } catch {
    return json({ error: "Impossible de récupérer le site (URL invalide ou site indisponible)." }, 422);
  }

  // 2. Extraction structurée par Gemini
  const prompt =
    "Tu analyses le contenu du site web d'une entreprise pour aider un consultant " +
    "à préparer une proposition commerciale. À partir du texte ci-dessous, extrais les " +
    "informations demandées. Réponds uniquement avec les champs du schéma. Si une " +
    "information est absente, renvoie une chaîne vide. Le résumé doit faire 1 à 2 phrases " +
    "en français décrivant l'activité de l'entreprise.\n\n" +
    "URL : " + url + "\n\nContenu du site :\n" + pageText;

  const schema = {
    type: "OBJECT",
    properties: {
      entreprise: { type: "STRING", description: "Nom de l'entreprise" },
      secteur: { type: "STRING", enum: SECTEURS, description: "Secteur le plus proche" },
      ville: { type: "STRING", description: "Ville / localisation principale" },
      contact: { type: "STRING", description: "Nom d'un contact/dirigeant si mentionné" },
      fonction: { type: "STRING", description: "Fonction du contact si mentionnée" },
      email: { type: "STRING", description: "Adresse e-mail de contact" },
      telephone: { type: "STRING", description: "Numéro de téléphone" },
      description: { type: "STRING", description: "Résumé de l'activité, 1-2 phrases" },
    },
    required: ["entreprise", "secteur", "description"],
  };

  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=` +
    encodeURIComponent(apiKey);

  let data: Record<string, unknown>;
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2,
        },
      }),
      signal: AbortSignal.timeout(30000),
    });
    if (!res.ok) {
      const detail = await res.text();
      console.error("Gemini error:", res.status, detail);
      return json({ error: `Erreur du service IA (HTTP ${res.status}).` }, 502);
    }
    const payload = await res.json();
    const textOut = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!textOut) return json({ error: "Réponse IA vide." }, 502);
    data = JSON.parse(textOut);
  } catch (e) {
    console.error("Gemini call failed:", e);
    return json({ error: "L'analyse IA a échoué." }, 502);
  }

  return json({
    entreprise: data.entreprise ?? "",
    secteur: SECTEURS.includes(String(data.secteur)) ? data.secteur : "Autre",
    ville: data.ville ?? "",
    contact: data.contact ?? "",
    fonction: data.fonction ?? "",
    email: data.email ?? "",
    telephone: data.telephone ?? "",
    description: data.description ?? "",
    sourceUrl: url,
  });
});
