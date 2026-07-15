import { useEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Toast from "./components/Toast";
import Dashboard from "./screens/Dashboard";
import Builder from "./screens/Builder";
import Preview from "./screens/Preview";
import Client from "./screens/Client";
import Templates from "./screens/Templates";
import { CATALOG, TJM_DEFAULT, OFFERS, TEMPLATES } from "./data";
import { supabase, isSupabaseConfigured } from "./lib/supabase";
import * as db from "./lib/db";

export const TODAY = "Dimanche 13 juillet 2026";
export const OFFER_NAME = "Fonderie Delcourt — Refonte supervision d'atelier";

// Analyse IA du site (fonction Edge Gemini) désactivée par défaut.
// Pour la réactiver : déployer la fonction « enrich-company » puis mettre
// VITE_AI_ENRICH=true dans .env.local.
export const AI_ENRICH_ENABLED = import.meta.env.VITE_AI_ENRICH === "true";

export function fmt(n) {
  return Math.round(n).toLocaleString("fr-FR") + " €";
}

function initialState() {
  const checked = {};
  const days = {};
  const tjms = {};
  CATALOG.forEach((c) =>
    c.modules.forEach((m) => {
      days[m.id] = m.days;
      tjms[m.id] = TJM_DEFAULT;
    })
  );
  ["entretiens", "observation", "heuristique", "cadrage", "synthese"].forEach((id) => (checked[id] = true));

  return {
    screen: "dashboard",
    search: "",
    filter: "all",
    newOfferOpen: false,
    offers: OFFERS,
    templates: TEMPLATES,
    currentOfferId: null,
    currentStatus: "brouillon",
    offerName: OFFER_NAME,
    composition: [
      "garde",
      "profil",
      "contexte",
      "problematique",
      "objectifs",
      "approche",
      "calculateur",
      "devis",
      "conditions",
      "signature",
    ],
    expanded: "garde",
    garde: {
      entreprise: "Fonderie Delcourt",
      secteur: "Métallurgie",
      contact: "Claire Vasseur",
      fonction: "Directrice des Opérations",
      email: "c.vasseur@fonderie-delcourt.fr",
      tel: "04 72 18 64 20",
    },
    contents: {},
    devisMode: "detaille",
    openCats: { "UX Research": true },
    checked,
    days,
    tjms,
    forfait: 16000,
    profils: 4,
    accepted: false,
    sigName: "",
    signed: false,
    signedAt: "",
    enriching: false,
    urlInput: "",
    toast: "",
  };
}

export default function App() {
  const [s, setS] = useState(initialState);
  const toastTimer = useRef(null);

  const set = (patch) => setS((prev) => ({ ...prev, ...(typeof patch === "function" ? patch(prev) : patch) }));

  const calcDays = () => {
    const h = s.profils * 3 * 3;
    return Math.round((h / 7) * 2) / 2;
  };

  const moduleDays = (m) => (m.auto ? calcDays() : s.days[m.id] ?? m.days);

  const totalHT = () => {
    if (s.devisMode === "forfait") return s.forfait || 0;
    let t = 0;
    CATALOG.forEach((c) =>
      c.modules.forEach((m) => {
        if (s.checked[m.id]) t += moduleDays(m) * (s.tjms[m.id] ?? 900);
      })
    );
    return t;
  };

  const showToast = (msg) => {
    set({ toast: msg });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => set({ toast: "" }), 2200);
  };

  const nav = (screen) => {
    set({ screen, newOfferOpen: false });
    window.scrollTo(0, 0);
  };

  // ─── Persistance Supabase ───

  // Chargement initial (sinon l'app reste sur les données de démo)
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    (async () => {
      try {
        const [offers, templates] = await Promise.all([db.fetchOffers(), db.fetchTemplates()]);
        set({ offers, templates });
      } catch (e) {
        console.error("Supabase :", e);
        showToast("Connexion Supabase impossible — mode démo");
      }
    })();
  }, []);

  const buildPayload = () => ({
    composition: s.composition,
    garde: s.garde,
    contents: s.contents,
    devisMode: s.devisMode,
    checked: s.checked,
    days: s.days,
    tjms: s.tjms,
    forfait: s.forfait,
    profils: s.profils,
    signed: s.signed,
    sigName: s.sigName,
    signedAt: s.signedAt,
  });

  const saveOffer = async () => {
    if (!isSupabaseConfigured) {
      showToast("Offre sauvegardée — mode démo (Supabase non configuré)");
      return;
    }
    try {
      const saved = await db.upsertOffer({
        id: s.currentOfferId || undefined,
        client: s.garde.entreprise || "Sans client",
        secteur: s.garde.secteur || "",
        project: s.offerName,
        date: db.todayLabel(),
        amount: totalHT(),
        status: s.currentStatus,
        payload: buildPayload(),
      });
      set((prev) => ({
        currentOfferId: saved.id,
        offers: prev.offers.some((o) => o.id === saved.id)
          ? prev.offers.map((o) => (o.id === saved.id ? saved : o))
          : [saved, ...prev.offers],
      }));
      showToast("Offre sauvegardée");
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur de sauvegarde");
    }
  };

  const enrichFromUrl = async (rawUrl) => {
    const url = (rawUrl || "").trim();
    if (!url) return;

    // Pré-remplissage basique à partir du nom de domaine (IA désactivée
    // ou Supabase non configuré).
    if (!isSupabaseConfigured || !AI_ENRICH_ENABLED) {
      const host = url.replace(/^https?:\/\//i, "").replace(/^www\./i, "").split("/")[0];
      const name = (host.split(".")[0] || "")
        .replace(/[-_]+/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      set((prev) => ({
        garde: { ...prev.garde, entreprise: name },
        composition: prev.composition.length ? prev.composition : ["garde", "contexte", "objectifs", "approche", "devis", "conditions", "signature"],
        currentOfferId: null,
        currentStatus: "brouillon",
        expanded: "garde",
        offerName: name ? `${name} — Nouvelle proposition` : "Nouvelle proposition",
        newOfferOpen: false,
      }));
      nav("builder");
      showToast(name ? `Client « ${name} » pré-rempli` : "Composition créée");
      return;
    }

    set({ enriching: true });
    try {
      const { data, error } = await supabase.functions.invoke("enrich-company", { body: { url } });
      if (error) {
        // Supabase renvoie un message générique ; on récupère le vrai détail
        // renvoyé par la fonction (corps JSON { error: ... }).
        let msg = error.message;
        try {
          const body = await error.context?.json?.();
          if (body?.error) msg = body.error;
        } catch { /* corps non JSON */ }
        throw new Error(msg);
      }
      if (data?.error) throw new Error(data.error);
      set((prev) => ({
        garde: {
          ...prev.garde,
          entreprise: data.entreprise || prev.garde.entreprise,
          secteur: data.secteur || prev.garde.secteur,
          contact: data.contact || "",
          fonction: data.fonction || "",
          email: data.email || "",
          tel: data.telephone || "",
        },
        contents: data.description ? { ...prev.contents, contexte: data.description } : prev.contents,
        composition: prev.composition.length ? prev.composition : ["garde", "contexte", "objectifs", "approche", "devis", "conditions", "signature"],
        currentOfferId: null,
        currentStatus: "brouillon",
        expanded: "garde",
        offerName: data.entreprise ? `${data.entreprise} — Nouvelle proposition` : "Nouvelle proposition",
        newOfferOpen: false,
        enriching: false,
      }));
      nav("builder");
      showToast(`« ${data.entreprise || "Société"} » identifiée`);
    } catch (e) {
      console.error("Enrichissement :", e);
      set({ enriching: false });
      showToast(e.message || "Analyse du site impossible");
    }
  };

  const removeOffer = async (o) => {
    if (!window.confirm(`Supprimer l'offre « ${o.client} » ?\nCette action est définitive.`)) return;
    if (!isSupabaseConfigured || !o.id) {
      set((prev) => ({ offers: prev.offers.filter((x) => x !== o) }));
      showToast("Offre supprimée — mode démo");
      return;
    }
    try {
      await db.deleteOffer(o.id);
      set((prev) => ({
        offers: prev.offers.filter((x) => x.id !== o.id),
        currentOfferId: prev.currentOfferId === o.id ? null : prev.currentOfferId,
      }));
      showToast("Offre supprimée");
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur de suppression");
    }
  };

  const deleteCurrentOffer = async () => {
    const client = s.garde.entreprise || "cette offre";
    if (!window.confirm(`Supprimer l'offre « ${client} » ?\nCette action est définitive.`)) return;
    if (!isSupabaseConfigured || !s.currentOfferId) {
      showToast("Suppression indisponible — offre non enregistrée");
      return;
    }
    try {
      await db.deleteOffer(s.currentOfferId);
      set((prev) => ({
        offers: prev.offers.filter((x) => x.id !== prev.currentOfferId),
        currentOfferId: null,
      }));
      nav("dashboard");
      showToast("Offre supprimée");
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur de suppression");
    }
  };

  const openOffer = (o) => {
    const p = o.payload;
    set({
      currentOfferId: o.id ?? null,
      currentStatus: o.status,
      offerName: `${o.client} — ${o.project}`,
      ...(p
        ? {
            composition: p.composition ?? [],
            garde: p.garde ?? initialState().garde,
            contents: p.contents ?? {},
            devisMode: p.devisMode ?? "detaille",
            checked: p.checked ?? {},
            days: p.days ?? {},
            tjms: p.tjms ?? {},
            forfait: p.forfait ?? 0,
            profils: p.profils ?? 4,
            signed: p.signed ?? false,
            sigName: p.sigName ?? "",
            signedAt: p.signedAt ?? "",
          }
        : {}),
      expanded: null,
    });
    nav("builder");
  };

  const useTemplate = (t) => {
    set({ composition: [...t.ids], expanded: null, currentOfferId: null, currentStatus: "brouillon" });
    nav("builder");
    showToast(`Template « ${t.name} » chargé`);
    if (isSupabaseConfigured && t.id) {
      db.incrementTemplateUsed(t)
        .then(() =>
          set((prev) => ({ templates: prev.templates.map((x) => (x.id === t.id ? { ...x, used: (x.used ?? 0) + 1 } : x)) }))
        )
        .catch((e) => console.error("Supabase :", e));
    }
  };

  const saveAsTemplate = async () => {
    const name = window.prompt("Nom du template :", "Nouveau template");
    if (!name) return;
    if (!isSupabaseConfigured) {
      showToast("Template sauvegardé — mode démo (Supabase non configuré)");
      return;
    }
    try {
      const t = await db.insertTemplate({ name: name.trim(), ids: s.composition });
      set((prev) => ({ templates: [...prev.templates, t] }));
      showToast(`Template « ${t.name} » sauvegardé`);
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur de sauvegarde du template");
    }
  };

  const duplicateTemplate = async (t) => {
    if (!isSupabaseConfigured || !t.id) {
      showToast("Template dupliqué — mode démo");
      return;
    }
    try {
      const copy = await db.insertTemplate({ name: `${t.name} (copie)`, ids: t.ids });
      set((prev) => ({ templates: [...prev.templates, copy] }));
      showToast("Template dupliqué");
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur de duplication");
    }
  };

  const removeTemplate = async (t) => {
    if (!window.confirm(`Supprimer le template « ${t.name} » ?`)) return;
    if (!isSupabaseConfigured || !t.id) {
      showToast("Template supprimé — mode démo");
      return;
    }
    try {
      await db.deleteTemplate(t.id);
      set((prev) => ({ templates: prev.templates.filter((x) => x.id !== t.id) }));
      showToast("Template supprimé");
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur de suppression");
    }
  };

  const sendToClient = async () => {
    nav("client");
    if (!isSupabaseConfigured) {
      showToast("Lien client unique généré — démo");
      return;
    }
    try {
      const status = s.currentStatus === "brouillon" ? "envoyee" : s.currentStatus;
      const saved = await db.upsertOffer({
        id: s.currentOfferId || undefined,
        client: s.garde.entreprise || "Sans client",
        secteur: s.garde.secteur || "",
        project: s.offerName,
        date: db.todayLabel(),
        amount: totalHT(),
        status,
        payload: buildPayload(),
      });
      set((prev) => ({
        currentOfferId: saved.id,
        currentStatus: status,
        offers: prev.offers.some((o) => o.id === saved.id)
          ? prev.offers.map((o) => (o.id === saved.id ? saved : o))
          : [saved, ...prev.offers],
      }));
      showToast("Offre envoyée au client");
    } catch (e) {
      console.error("Supabase :", e);
      showToast("Erreur lors de l'envoi");
    }
  };

  const onSigned = (stamp) => {
    set({ signed: true, signedAt: stamp });
    if (isSupabaseConfigured && s.currentOfferId) {
      db.updateOfferStatus(s.currentOfferId, "signee")
        .then(() => {
          set((prev) => ({
            currentStatus: "signee",
            offers: prev.offers.map((o) => (o.id === prev.currentOfferId ? { ...o, status: "signee" } : o)),
          }));
        })
        .catch((e) => console.error("Supabase :", e));
    }
  };

  const getDoc = (signed) => {
    const g = s.garde;
    const ht = totalHT();
    const tva = ht * 0.2;
    const rows = [];
    if (s.devisMode === "forfait") {
      rows.push({ cat: "Forfait", name: "Mission au forfait", days: "—", tjm: "—", amount: fmt(s.forfait) });
    } else {
      CATALOG.forEach((c) =>
        c.modules.forEach((m) => {
          if (s.checked[m.id]) {
            const d = moduleDays(m);
            const t = s.tjms[m.id] ?? 900;
            rows.push({ cat: c.name, name: m.name, days: String(d).replace(".", ","), tjm: t + " €", amount: fmt(d * t) });
          }
        })
      );
    }

    // Contenu des blocs texte libre saisis dans le constructeur.
    const linesOf = (id) =>
      (s.contents[id] || "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);

    const objectifs = linesOf("objectifs").map((text, i) => ({ num: String(i + 1).padStart(2, "0"), text }));
    const phases = linesOf("approche").map((text, i) => ({ num: "P" + (i + 1), name: text }));
    const conditionLines = linesOf("conditions");
    const conditions = conditionLines.length
      ? conditionLines.map((text) => ({ label: null, text }))
      : [
          { label: "Validité", text: "Cette proposition est valable 30 jours à compter de sa date d'émission." },
          { label: "Paiement", text: "40 % à la signature, 60 % à la restitution finale. Virement à 30 jours." },
          { label: "Propriété", text: "Les livrables sont la propriété du client après paiement intégral." },
          { label: "Confidentialité", text: "Les données recueillies restent strictement confidentielles." },
        ];

    return {
      ref: "PR-2026-041",
      date: "13 · 07 · 2026",
      validite: "30 jours",
      clientCompany: g.entreprise || "—",
      clientSecteur: g.secteur,
      clientContact: g.contact || "—",
      clientFonction: g.fonction || "—",
      title: s.offerName || "Proposition commerciale",
      lede: "",
      tags: ["UX Research", "Discovery", "Industrie", "AI Prototyping"],
      refs: "12 ans d'expérience · 50+ missions · industrie, énergie, terrain",
      contexte: s.contents.contexte || "",
      problematique: s.contents.problematique || "",
      objectifs,
      phases,
      rows,
      totalHT: fmt(ht),
      tva: fmt(tva),
      ttc: fmt(ht + tva),
      conditions,
      signed,
      unsigned: !signed,
      signedName: s.sigName || s.garde.contact,
      signedAt: s.signedAt,
      // Composition réelle de l'offre, pour que l'aperçu suive exactement
      // les blocs choisis (et leur ordre) dans le constructeur.
      composition: s.composition,
      contents: s.contents,
    };
  };

  const ctx = {
    s,
    set,
    fmt,
    calcDays,
    moduleDays,
    totalHT,
    showToast,
    nav,
    getDoc,
    saveOffer,
    openOffer,
    removeOffer,
    deleteCurrentOffer,
    enrichFromUrl,
    useTemplate,
    saveAsTemplate,
    duplicateTemplate,
    removeTemplate,
    sendToClient,
    onSigned,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {s.screen !== "client" && <TopBar screen={s.screen} onNav={nav} />}
      {s.screen === "dashboard" && <Dashboard ctx={ctx} />}
      {s.screen === "builder" && <Builder ctx={ctx} />}
      {s.screen === "preview" && <Preview ctx={ctx} />}
      {s.screen === "client" && <Client ctx={ctx} />}
      {s.screen === "templates" && <Templates ctx={ctx} />}
      <Toast message={s.toast} />
    </div>
  );
}
