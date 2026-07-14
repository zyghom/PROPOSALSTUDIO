import ProposalDoc from "../components/ProposalDoc";

export default function Preview({ ctx }) {
  const { s, nav, showToast, getDoc, sendToClient } = ctx;

  return (
    <main style={{ width: "100%", padding: "32px 32px 96px", background: "#F4F4F2", flex: 1 }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
          <button
            className="btn-outline-plain"
            onClick={() => nav("builder")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              border: "1px solid #D4D4D0",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
              background: "#fff",
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            ← Modifier
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "15px", fontWeight: 600 }}>{s.offerName}</div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#A8A8A8",
                marginTop: "2px",
              }}
            >
              Aperçu du document · {s.composition.length} blocs
            </div>
          </div>
          <button
            className="btn-outline-plain"
            onClick={() => showToast("Offre sauvegardée")}
            style={{
              padding: "10px 18px",
              border: "1px solid #D4D4D0",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
              background: "#fff",
              transition: "all 200ms",
            }}
          >
            Dupliquer
          </button>
          <button
            className="btn-outline-plain"
            onClick={() => showToast("Export PDF — démo")}
            style={{
              padding: "10px 18px",
              border: "1px solid #D4D4D0",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
              background: "#fff",
              transition: "all 200ms",
            }}
          >
            Exporter PDF
          </button>
          <button
            className="btn-dark"
            onClick={sendToClient}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 20px",
              background: "#353535",
              color: "#fff",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Envoyer au client <span>→</span>
          </button>
        </div>
        <ProposalDoc doc={getDoc(false)} />
      </div>
    </main>
  );
}
