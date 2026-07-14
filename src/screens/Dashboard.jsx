import { STATUS, ICONS, BLOCKS, FILTER_DEFS } from "../data";
import { TODAY, fmt } from "../App";

export default function Dashboard({ ctx }) {
  const { s, set, nav, openOffer, useTemplate } = ctx;

  const startBlank = () => {
    set({ composition: [], expanded: null, currentOfferId: null, currentStatus: "brouillon" });
    nav("builder");
  };

  const enCours = s.offers.filter((o) => ["brouillon", "envoyee", "consultee"].includes(o.status));
  const decidees = s.offers.filter((o) => ["signee", "refusee", "expiree"].includes(o.status));
  const signees = s.offers.filter((o) => o.status === "signee");
  const metrics = [
    { label: "Offres en cours", value: String(enCours.length), sub: "brouillon, envoyée, consultée" },
    {
      label: "Montant en pipeline",
      value: fmt(enCours.reduce((t, o) => t + o.amount, 0)),
      sub: "HT — hors offres signées",
    },
    {
      label: "Taux de signature",
      value: decidees.length ? Math.round((signees.length / decidees.length) * 100) + " %" : "—",
      sub: "sur les offres décidées",
    },
  ];

  const q = s.search.toLowerCase();
  const offers = s.offers
    .filter((o) => s.filter === "all" || o.status === s.filter)
    .filter((o) => !q || o.client.toLowerCase().includes(q) || o.project.toLowerCase().includes(q));

  return (
    <main style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "48px 32px 96px" }}>
      <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: "40px" }}>
        <div>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "#7A7A7A",
              marginBottom: "12px",
            }}
          >
            {TODAY}
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "40px", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            Bonjour Frédéric.
          </h1>
        </div>
        <button
          className="btn-dark"
          onClick={() => set({ newOfferOpen: true })}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "13px 22px",
            background: "#353535",
            color: "#fff",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 500,
            transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          Nouvelle offre
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 2v10M2 7h10" />
          </svg>
        </button>
      </div>

      {/* Métriques */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "56px" }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: "12px", padding: "24px 28px" }}>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#A8A8A8",
                marginBottom: "14px",
              }}
            >
              {m.label}
            </div>
            <div style={{ fontSize: "34px", fontWeight: 600, letterSpacing: "-0.02em", lineHeight: 1 }}>{m.value}</div>
            <div style={{ fontSize: "12px", color: "#7A7A7A", marginTop: "8px" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Offres récentes */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ fontWeight: 600, fontSize: "22px", letterSpacing: "-0.01em", margin: 0 }}>Offres récentes</h2>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            value={s.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Rechercher…"
            style={{
              border: "1px solid #D4D4D0",
              borderRadius: "999px",
              padding: "8px 16px",
              fontSize: "13px",
              fontFamily: "inherit",
              background: "#fff",
              width: "200px",
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {FILTER_DEFS.map(([key, filterLabel]) => (
          <button
            key={key}
            className="btn-outline-plain"
            onClick={() => set({ filter: key })}
            style={{
              padding: "6px 14px",
              borderRadius: "999px",
              fontSize: "12px",
              fontWeight: 500,
              fontFamily: "'JetBrains Mono', monospace",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
              border: s.filter === key ? "1px solid #353535" : "1px solid #E8E8E5",
              background: s.filter === key ? "#353535" : "#fff",
              color: s.filter === key ? "#fff" : "#7A7A7A",
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {filterLabel}
          </button>
        ))}
      </div>
      <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: "12px", overflow: "hidden", marginBottom: "64px" }}>
        {offers.map((o, i) => {
          const st = STATUS[o.status];
          return (
            <div
              key={o.id ?? i}
              className="offer-row"
              onClick={() => openOffer(o)}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1.6fr 120px 110px 130px",
                gap: "20px",
                alignItems: "center",
                padding: "18px 28px",
                borderBottom: "1px solid #F4F4F2",
                cursor: "pointer",
                transition: "background 200ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <div>
                <div style={{ fontSize: "14px", fontWeight: 600 }}>{o.client}</div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "#A8A8A8",
                    marginTop: "3px",
                  }}
                >
                  {o.secteur}
                </div>
              </div>
              <div style={{ fontSize: "13px", color: "#7A7A7A" }}>{o.project}</div>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "#7A7A7A" }}>{o.date}</div>
              <div style={{ fontSize: "14px", fontWeight: 600, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{fmt(o.amount)} HT</div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    padding: "5px 12px",
                    borderRadius: "999px",
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    background: st.bg,
                    color: st.fg,
                  }}
                >
                  {st.label}
                </span>
              </div>
            </div>
          );
        })}
        {offers.length === 0 && (
          <div style={{ padding: "40px", textAlign: "center", fontSize: "13px", color: "#A8A8A8" }}>Aucune offre ne correspond.</div>
        )}
      </div>

      {/* Mes templates */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <h2 style={{ fontWeight: 600, fontSize: "22px", letterSpacing: "-0.01em", margin: 0 }}>Mes templates</h2>
        <button
          className="link-muted"
          onClick={() => nav("templates")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", fontWeight: 500, color: "#7A7A7A", transition: "color 200ms" }}
        >
          Tout gérer <span>→</span>
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        {s.templates.map((t) => (
          <div
            key={t.id ?? t.name}
            className="template-card"
            onClick={() => useTemplate(t)}
            style={{
              background: "#fff",
              border: "1px solid #E8E8E5",
              borderRadius: "12px",
              padding: "22px",
              cursor: "pointer",
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "rgb(30,159,175)",
                marginBottom: "12px",
              }}
            >
              {t.ids.length} blocs
            </div>
            <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "14px" }}>{t.name}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {t.ids.map((id) => (
                <span
                  key={id}
                  title={BLOCKS[id].name}
                  style={{
                    width: "26px",
                    height: "26px",
                    border: "1px solid #E8E8E5",
                    borderRadius: "6px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#7A7A7A",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[id]} />
                  </svg>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal Nouvelle offre */}
      {s.newOfferOpen && (
        <div
          onClick={() => set({ newOfferOpen: false })}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(53,53,53,0.35)",
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "32px",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ background: "#fff", borderRadius: "12px", border: "1px solid #E8E8E5", width: "560px", maxWidth: "100%", padding: "32px" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px" }}>
              <div>
                <div
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#A8A8A8",
                    marginBottom: "8px",
                  }}
                >
                  Nouvelle offre
                </div>
                <h3 style={{ fontWeight: 600, fontSize: "20px", letterSpacing: "-0.01em", margin: 0 }}>Comment démarrer ?</h3>
              </div>
              <button className="modal-close" onClick={() => set({ newOfferOpen: false })} style={{ color: "#A8A8A8", fontSize: "18px", lineHeight: 1 }}>
                ✕
              </button>
            </div>
            <button
              className="btn-outline"
              onClick={startBlank}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                textAlign: "left",
                border: "1px solid #D4D4D0",
                borderRadius: "8px",
                padding: "18px 20px",
                marginBottom: "20px",
                transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <span
                style={{
                  width: "36px",
                  height: "36px",
                  border: "1px solid #E8E8E5",
                  borderRadius: "8px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#353535",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 2v10M2 7h10" />
                </svg>
              </span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontSize: "14px", fontWeight: 600 }}>Partir de zéro</span>
                <span style={{ display: "block", fontSize: "12px", color: "#7A7A7A", marginTop: "2px" }}>
                  Composition vide, ajoutez les blocs un à un
                </span>
              </span>
              <span style={{ color: "#A8A8A8" }}>→</span>
            </button>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "#A8A8A8",
                marginBottom: "12px",
              }}
            >
              Ou partir d'un template
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {s.templates.map((t) => (
                <button
                  key={t.id ?? t.name}
                  className="btn-outline"
                  onClick={() => useTemplate(t)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    textAlign: "left",
                    border: "1px solid #E8E8E5",
                    borderRadius: "8px",
                    padding: "12px 16px",
                    transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                >
                  <span style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>{t.name}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#A8A8A8",
                    }}
                  >
                    {t.ids.length} blocs
                  </span>
                  <span style={{ color: "#A8A8A8" }}>→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
