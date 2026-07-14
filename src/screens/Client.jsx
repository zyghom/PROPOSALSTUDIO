import ProposalDoc from "../components/ProposalDoc";
import logoFred from "../assets/logo-fred.svg";
import { TODAY, OFFER_NAME } from "../App";

export default function Client({ ctx }) {
  const { s, set, nav, showToast, getDoc } = ctx;
  const signReady = s.accepted && s.sigName.trim().length > 1;

  const onSign = () => {
    if (!signReady) return;
    const now = new Date();
    const stamp =
      now.toLocaleDateString("fr-FR") + " · " + now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    set({ signed: true, signedAt: stamp });
    window.scrollTo(0, 0);
  };

  return (
    <main style={{ width: "100%", background: "#F4F4F2", flex: 1, paddingBottom: "96px" }}>
      {/* En-tête client épuré */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E8E8E5" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "20px 32px", display: "flex", alignItems: "center", gap: "16px" }}>
          <img src={logoFred} alt="FR" style={{ height: "20px" }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Frédéric Rossi — Research &amp; Design</div>
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
              {OFFER_NAME} · {TODAY}
            </div>
          </div>
          {!s.signed && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "rgb(240,250,252)",
                color: "rgb(20,120,135)",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "rgb(30,159,175)" }} />
              En attente de votre signature
            </span>
          )}
          {s.signed && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "6px 14px",
                borderRadius: "999px",
                background: "#EAF7EE",
                color: "#16A34A",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16A34A" }} />
              Signée
            </span>
          )}
          <button
            className="consultant-back"
            onClick={() => nav("preview")}
            title="Retour vue consultant — démo"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#A8A8A8",
              border: "1px solid #E8E8E5",
              borderRadius: "999px",
              padding: "6px 12px",
            }}
          >
            ← Consultant
          </button>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "32px 32px 0" }}>
        <ProposalDoc doc={getDoc(s.signed)} />

        {/* Panneau de signature */}
        <div style={{ maxWidth: "860px", margin: "24px auto 0" }}>
          {!s.signed && (
            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: "12px", padding: "32px" }}>
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
                Signature électronique
              </div>
              <h3 style={{ fontWeight: 600, fontSize: "20px", letterSpacing: "-0.01em", margin: "0 0 24px" }}>Valider la proposition</h3>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "14px", lineHeight: 1.5, cursor: "pointer", marginBottom: "20px" }}>
                <input
                  type="checkbox"
                  checked={s.accepted}
                  onChange={(e) => set({ accepted: e.target.checked })}
                  style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: "rgb(30,159,175)", cursor: "pointer" }}
                />
                <span>J'ai lu et j'accepte les conditions commerciales de cette proposition.</span>
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "20px" }}>
                <label
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    color: "#7A7A7A",
                  }}
                >
                  Votre signature — nom complet
                </label>
                <input
                  value={s.sigName}
                  onChange={(e) => set({ sigName: e.target.value })}
                  placeholder="Claire Vasseur"
                  style={{
                    border: "1px solid #D4D4D0",
                    borderRadius: "8px",
                    padding: "14px 16px",
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "24px",
                    background: "#FAFAF9",
                    color: "#353535",
                  }}
                />
              </div>
              <button
                className={signReady ? "sign-btn enabled" : "sign-btn"}
                onClick={onSign}
                disabled={!signReady}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "13px 24px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 500,
                  background: signReady ? "#353535" : "#E8E8E5",
                  color: signReady ? "#fff" : "#A8A8A8",
                  cursor: signReady ? "pointer" : "not-allowed",
                  transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                Signer et valider <span>→</span>
              </button>
            </div>
          )}
          {s.signed && (
            <div style={{ background: "#fff", border: "1px solid #E8E8E5", borderRadius: "12px", padding: "32px", textAlign: "center" }}>
              <div
                style={{
                  width: "44px",
                  height: "44px",
                  borderRadius: "50%",
                  background: "#EAF7EE",
                  color: "#16A34A",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "16px",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12l5 5L20 7" />
                </svg>
              </div>
              <h3 style={{ fontWeight: 600, fontSize: "20px", letterSpacing: "-0.01em", margin: "0 0 8px" }}>Proposition signée.</h3>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#7A7A7A",
                  marginBottom: "24px",
                }}
              >
                Horodatage · {s.signedAt}
              </div>
              <button
                className="btn-dark"
                onClick={() => showToast("Export PDF — démo")}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "12px 22px",
                  background: "#353535",
                  color: "#fff",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 500,
                  transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
                }}
              >
                Télécharger le PDF signé <span>↓</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
