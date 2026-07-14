import { useEffect, useRef, useState } from "react";
import TopBar from "./components/TopBar";
import Toast from "./components/Toast";
import Dashboard from "./screens/Dashboard";
import Builder from "./screens/Builder";
import Preview from "./screens/Preview";
import Client from "./screens/Client";
import Templates from "./screens/Templates";
import { CATALOG, TJM_DEFAULT, OFFERS, TEMPLATES } from "./data";
import { isSupabaseConfigured } from "./lib/supabase";
import * as db from "./lib/db";

export const TODAY = "Dimanche 13 juillet 2026";
export const OFFER_NAME = "Fonderie Delcourt — Refonte supervision d'atelier";

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
    return {
      ref: "PR-2026-041",
      date: "13 · 07 · 2026",
      validite: "30 jours",
      clientCompany: g.entreprise || "—",
      clientSecteur: g.secteur,
      clientContact: g.contact || "—",
      clientFonction: g.fonction || "—",
      title: "Refonte de la supervision d'atelier — audit UX & discovery.",
      lede: "Comprendre le travail réel des opérateurs et des chefs d'atelier, objectiver les irritants de la supervision actuelle, et poser les fondations d'un outil qui se fait oublier.",
      tags: ["UX Research", "Discovery", "Industrie", "AI Prototyping"],
      refs: "12 ans d'expérience · 50+ missions · industrie, énergie, terrain",
      contexte:
        "Fonderie Delcourt pilote trois lignes de production avec un outil de supervision développé en interne il y a neuf ans. Les équipes contournent l'outil — doubles saisies, fichiers parallèles, appels radio — et la direction manque de visibilité fiable sur les arrêts de ligne. Une refonte est envisagée, mais le périmètre réel du besoin n'a jamais été objectivé par une recherche terrain.",
      problematique:
        "Sur des métiers complexes, le design ne s'invente pas à l'écran. Que doit devenir la supervision pour servir le travail réel — et non l'inverse ?",
      objectifs: [
        { num: "01", text: "Cartographier le travail réel des 4 profils métiers concernés par la supervision." },
        { num: "02", text: "Objectiver et prioriser les irritants de l'outil actuel, chiffrés en temps perdu." },
        { num: "03", text: "Livrer une vision cible et une roadmap actionnable pour la refonte." },
      ],
      phases: [
        {
          num: "P1",
          name: "Cadrage",
          desc: "Ateliers avec les parties prenantes, alignement sur le périmètre et les hypothèses.",
          duration: "1 sem",
        },
        {
          num: "P2",
          name: "Recherche terrain",
          desc: "Entretiens par profil métier, observation en poste, shadowing des équipes de nuit.",
          duration: "3 sem",
        },
        {
          num: "P3",
          name: "Synthèse & opportunités",
          desc: "Personas, cartographie des parcours, priorisation des opportunités.",
          duration: "2 sem",
        },
        { num: "P4", name: "Restitution & roadmap", desc: "Restitution aux équipes, vision cible, roadmap de refonte.", duration: "1 sem" },
      ],
      rows,
      totalHT: fmt(ht),
      tva: fmt(tva),
      ttc: fmt(ht + tva),
      conditions: [
        { label: "Validité", text: "Cette proposition est valable 30 jours à compter de sa date d'émission." },
        { label: "Paiement", text: "40 % à la signature, 60 % à la restitution finale. Virement à 30 jours." },
        { label: "Propriété", text: "Les livrables sont la propriété du client après paiement intégral." },
        { label: "Confidentialité", text: "L'ensemble des données recueillies sur le terrain reste strictement confidentiel." },
      ],
      signed,
      unsigned: !signed,
      signedName: s.sigName || s.garde.contact,
      signedAt: s.signedAt,
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
