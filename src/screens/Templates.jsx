import { ICONS, BLOCKS } from "../data";

export default function Templates({ ctx }) {
  const { s, set, nav, useTemplate, duplicateTemplate, removeTemplate } = ctx;

  const startBlank = () => {
    set({ composition: [], expanded: null, currentOfferId: null, currentStatus: "brouillon" });
    nav("builder");
  };

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
            Compositions réutilisables
          </div>
          <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "40px", letterSpacing: "-0.03em", lineHeight: 1.05, margin: 0 }}>
            Mes templates.
          </h1>
        </div>
        <button
          className="btn-outline"
          onClick={startBlank}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            padding: "13px 22px",
            border: "1px solid #D4D4D0",
            borderRadius: "999px",
            fontSize: "14px",
            fontWeight: 500,
            background: "#fff",
            transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          Créer un template vide
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M7 2v10M2 7h10" />
          </svg>
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {s.templates.map((t) => (
          <div
            key={t.id ?? t.name}
            style={{
              background: "#fff",
              border: "1px solid #E8E8E5",
              borderRadius: "12px",
              padding: "24px 28px",
              display: "grid",
              gridTemplateColumns: "1.2fr 2fr auto",
              gap: "32px",
              alignItems: "center",
            }}
          >
            <div>
              <div style={{ fontSize: "16px", fontWeight: 600, marginBottom: "6px" }}>{t.name}</div>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#A8A8A8",
                }}
              >
                {t.ids.length} blocs · modifié {t.modified} · utilisé {t.used} fois
              </div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {t.ids.map((id) => (
                <span
                  key={id}
                  title={BLOCKS[id].name}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    padding: "5px 10px",
                    border: "1px solid #E8E8E5",
                    borderRadius: "999px",
                    fontSize: "11px",
                    color: "#7A7A7A",
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={ICONS[id]} />
                  </svg>
                  {BLOCKS[id].name}
                </span>
              ))}
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className="template-row-btn"
                onClick={() => useTemplate(t)}
                style={{ padding: "8px 16px", border: "1px solid #D4D4D0", borderRadius: "999px", fontSize: "12px", fontWeight: 500, transition: "all 200ms" }}
              >
                Modifier
              </button>
              <button
                className="template-row-btn"
                onClick={() => duplicateTemplate(t)}
                style={{ padding: "8px 16px", border: "1px solid #D4D4D0", borderRadius: "999px", fontSize: "12px", fontWeight: 500, transition: "all 200ms" }}
              >
                Dupliquer
              </button>
              <button
                className="template-delete-btn"
                onClick={() => removeTemplate(t)}
                style={{
                  padding: "8px 16px",
                  border: "1px solid #E8E8E5",
                  borderRadius: "999px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#A8A8A8",
                  transition: "all 200ms",
                }}
              >
                Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
