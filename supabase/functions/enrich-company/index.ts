// ProposalStudio — Fonction Edge « enrich-company »
//
// Reçoit { url } (le site web d'un prospect) et renvoie les informations de la
// société sous forme structurée, pour pré-remplir la page de garde d'une offre.
//
// Deux stratégies, dans l'ordre :
//   1. On demande à Google Gemini d'aller lire la page lui-même (outil
//      « url_context ») — robuste face aux sites protégés par un anti-bot.
//   2. Repli : on récupère la page nous-mêmes et on la donne à Gemini.
//
// La clé API Gemini est lue depuis le secret GEMINI_API_KEY (jamais exposée
// au navigateur). Voir README.md pour l'obtenir (gratuit) et déployer.

// Modèles Gemini essayés dans l'ordre (le premier qui répond gagne).
// Surchargeable via le secret GEMINI_MODEL (liste séparée par des virgules).
const GEMINI_MODELS = (Deno.env.get("GEMINI_MODEL") || "gemini-3.5-flash,gemini-3.1-flash-lite,gemini-flash-latest")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

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
  return /^https?:\/\//i.test(u) ? u : "https://" + u;
}

// Extrait un objet JSON du texte renvoyé par le modèle (tolère les ```json).
function parseJsonLoose(text: string): Record<string, unknown> | null {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start, end + 1));
  } catch {
    return null;
  }
}

const FIELD_INSTRUCTIONS =
  "Réponds UNIQUEMENT avec un objet JSON valide (aucun texte avant ou après, " +
  "pas de balises markdown) avec exactement ces clés :\n" +
  "- entreprise : nom de l'entreprise\n" +
  "- secteur : le secteur le plus proche parmi [" + SECTEURS.join(", ") + "]\n" +
  "- ville : ville ou localisation principale\n" +
  "- contact : nom d'un dirigeant ou contact si mentionné, sinon \"\"\n" +
  "- fonction : sa fonction si mentionnée, sinon \"\"\n" +
  "- email : e-mail de contact, sinon \"\"\n" +
  "- telephone : numéro de téléphone, sinon \"\"\n" +
  "- description : résumé de l'activité en 1 à 2 phrases en français\n" +
  "Si une information est absente, mets une chaîne vide.";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Un seul appel, pour un modèle donné.
async function callGeminiModel(apiKey: string, model: string, prompt: string, useUrlContext: boolean) {
  const endpoint =
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=` +
    encodeURIComponent(apiKey);

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2 },
  };
  if (useUrlContext) body.tools = [{ url_context: {} }];

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(40000),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error(`Gemini HTTP ${res.status} [${model}]`, detail);
    const err = new Error(`Erreur du service IA (HTTP ${res.status}).`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  const payload = await res.json();
  const textOut = payload?.candidates?.[0]?.content?.parts
    ?.map((p: { text?: string }) => p.text ?? "")
    .join("") ?? "";
  const parsed = parseJsonLoose(textOut);
  if (!parsed) throw new Error("Réponse IA illisible.");
  return parsed;
}

// Essaie chaque modèle, avec plusieurs tentatives en cas de surcharge (503/429).
async function callGemini(apiKey: string, prompt: string, useUrlContext: boolean) {
  let lastErr: unknown;
  let overloaded = false;
  for (const model of GEMINI_MODELS) {
    const backoffs = [900, 2000, 3500]; // attentes progressives entre tentatives
    for (let attempt = 0; attempt <= backoffs.length; attempt++) {
      try {
        return await callGeminiModel(apiKey, model, prompt, useUrlContext);
      } catch (e) {
        lastErr = e;
        const status = (e as Error & { status?: number })?.status;
        if (status === 503 || status === 429) {
          overloaded = true;
          if (attempt < backoffs.length) {
            await sleep(backoffs[attempt]);
            continue; // nouvel essai du même modèle
          }
          break; // ce modèle est saturé → modèle suivant
        }
        break; // autre erreur (modèle indisponible…) → modèle suivant
      }
    }
  }
  const err = lastErr instanceof Error ? lastErr : new Error("Appel IA impossible.");
  (err as Error & { overloaded?: boolean }).overloaded = overloaded;
  throw err;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Méthode non autorisée" }, 405);

  const apiKey = Deno.env.get("GEMINI_API_KEY");
  if (!apiKey) return json({ error: "GEMINI_API_KEY non configurée sur le serveur." }, 500);

  let url: string;
  try {
    const body = await req.json();
    if (!body.url) return json({ error: "URL manquante." }, 400);
    url = normalizeUrl(String(body.url));
  } catch {
    return json({ error: "Requête invalide." }, 400);
  }

  let data: Record<string, unknown> | null = null;
  const diag: string[] = [];
  let overloaded = false;

  // Stratégie 1 — Gemini lit la page lui-même (robuste face aux anti-bots)
  try {
    data = await callGemini(
      apiKey,
      `Analyse le site web de l'entreprise à l'URL : ${url}\n\n${FIELD_INSTRUCTIONS}`,
      true,
    );
    if (!data?.entreprise) diag.push("url_context: réponse sans nom d'entreprise");
  } catch (e) {
    if ((e as Error & { overloaded?: boolean })?.overloaded) overloaded = true;
    diag.push("url_context: " + (e instanceof Error ? e.message : String(e)));
    console.error("url_context a échoué :", e);
  }

  // Stratégie 2 — repli : on récupère la page nous-mêmes
  if (!data || !data.entreprise) {
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0 Safari/537.36",
          "Accept": "text/html,application/xhtml+xml",
          "Accept-Language": "fr-FR,fr;q=0.9,en;q=0.8",
        },
        redirect: "follow",
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) {
        diag.push(`fetch direct: HTTP ${res.status}`);
      } else {
        const text = htmlToText(await res.text()).slice(0, 15000);
        if (text.length < 40) {
          diag.push("fetch direct: contenu texte insuffisant");
        } else {
          data = await callGemini(
            apiKey,
            `Voici le contenu du site ${url}. ${FIELD_INSTRUCTIONS}\n\nContenu :\n${text}`,
            false,
          );
          if (!data?.entreprise) diag.push("fetch direct: réponse sans nom d'entreprise");
        }
      }
    } catch (e) {
      if ((e as Error & { overloaded?: boolean })?.overloaded) overloaded = true;
      diag.push("fetch direct: " + (e instanceof Error ? e.message : String(e)));
      console.error("Repli fetch a échoué :", e);
    }
  }

  if (!data || !data.entreprise) {
    if (overloaded) {
      return json(
        {
          error: "Le service d'IA est momentanément saturé (forte demande). Réessayez dans quelques instants.",
          detail: diag.join(" | "),
        },
        503,
      );
    }
    return json(
      {
        error: "Impossible d'analyser ce site (contenu inaccessible ou protégé). Essayez une autre URL.",
        detail: diag.join(" | "),
      },
      422,
    );
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
