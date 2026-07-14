import portraitFred from "../assets/portrait-fred.png";

const label = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "11px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#A8A8A8",
};

export default function ProposalDoc({ doc }) {
  return (
    <div
      style={{
        maxWidth: "860px",
        margin: "0 auto",
        background: "#FFFFFF",
        border: "1px solid #E8E8E5",
        borderRadius: "12px",
        overflow: "hidden",
        color: "#353535",
      }}
    >
      {/* Page de garde */}
      <div style={{ padding: "72px 72px 64px", borderBottom: "1px solid #E8E8E5", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "96px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#7A7A7A" }}>
            Proposition commerciale · {doc.ref}
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "#7A7A7A" }}>
            {doc.date}
          </div>
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", letterSpacing: "0.08em", textTransform: "uppercase", color: "rgb(30,159,175)", marginBottom: "20px" }}>
          {doc.clientCompany} — {doc.clientSecteur}
        </div>
        <h1 style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600, fontSize: "44px", lineHeight: 1.05, letterSpacing: "-0.03em", margin: "0 0 28px", maxWidth: "640px" }}>
          {doc.title}
        </h1>
        <p style={{ fontSize: "18px", lineHeight: 1.55, color: "#7A7A7A", maxWidth: "560px", margin: "0 0 72px" }}>{doc.lede}</p>
        <div style={{ display: "flex", gap: "64px", borderTop: "1px solid #E8E8E5", paddingTop: "24px" }}>
          <div>
            <div style={{ ...label, marginBottom: "6px" }}>Préparé par</div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>Frédéric Rossi</div>
            <div style={{ fontSize: "13px", color: "#7A7A7A" }}>UX Research &amp; AI Product Design — Lyon</div>
          </div>
          <div>
            <div style={{ ...label, marginBottom: "6px" }}>À l'attention de</div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>{doc.clientContact}</div>
            <div style={{ fontSize: "13px", color: "#7A7A7A" }}>
              {doc.clientFonction} — {doc.clientCompany}
            </div>
          </div>
          <div style={{ marginLeft: "auto" }}>
            <div style={{ ...label, marginBottom: "6px" }}>Validité</div>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>{doc.validite}</div>
          </div>
        </div>
      </div>

      {/* Profil consultant */}
      <Section index="01" title="Consultant">
        <div style={{ display: "flex", gap: "24px", alignItems: "flex-start", marginBottom: "24px" }}>
          <img
            src={portraitFred}
            alt="Frédéric Rossi"
            style={{ width: "72px", height: "72px", borderRadius: "8px", objectFit: "cover", border: "1px solid #E8E8E5" }}
          />
          <div>
            <h2 style={{ fontWeight: 600, fontSize: "22px", letterSpacing: "-0.01em", margin: "0 0 4px" }}>Frédéric Rossi</h2>
            <div style={{ fontSize: "14px", color: "#7A7A7A" }}>Senior UX Researcher · Product Designer · AI Builder</div>
          </div>
        </div>
        <p style={{ fontSize: "15px", lineHeight: 1.6, color: "#353535", margin: "0 0 20px", maxWidth: "520px" }}>
          Je conçois des applications métiers complexes pour des utilisateurs experts — industrie, énergie, terrain.
          Posture de coach UX, ancrage discovery, prototypage assisté par IA pour accélérer la décision produit.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px" }}>
          {doc.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: "4px 10px",
                border: "1px solid #E8E8E5",
                borderRadius: "999px",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "#353535",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
        <div style={{ fontSize: "13px", color: "#7A7A7A" }}>Références : {doc.refs}</div>
      </Section>

      {/* Contexte */}
      <Section index="02" title="Contexte">
        <p style={{ fontSize: "15px", lineHeight: 1.65, margin: 0, maxWidth: "540px" }}>{doc.contexte}</p>
      </Section>

      {/* Problématique */}
      <Section index="03" title="Problématique">
        <p
          style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontStyle: "italic",
            fontSize: "21px",
            lineHeight: 1.45,
            color: "#353535",
            margin: 0,
            maxWidth: "540px",
          }}
        >
          « {doc.problematique} »
        </p>
      </Section>

      {/* Objectifs */}
      <Section index="04" title="Objectifs">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {doc.objectifs.map((obj) => (
            <div
              key={obj.num}
              style={{ display: "flex", gap: "16px", padding: "14px 0", borderBottom: "1px solid #F4F4F2", alignItems: "baseline" }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "11px", color: "rgb(30,159,175)" }}>{obj.num}</span>
              <span style={{ fontSize: "15px", lineHeight: 1.5 }}>{obj.text}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Approche & phases */}
      <Section index="05" title="Approche & phases">
        <div style={{ display: "flex", flexDirection: "column" }}>
          {doc.phases.map((ph) => (
            <div
              key={ph.num}
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr auto",
                gap: "20px",
                padding: "18px 0",
                borderBottom: "1px solid #F4F4F2",
                alignItems: "baseline",
              }}
            >
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "rgb(30,159,175)" }}>{ph.num}</span>
              <div>
                <div style={{ fontSize: "15px", fontWeight: 600, marginBottom: "3px" }}>{ph.name}</div>
                <div style={{ fontSize: "13px", color: "#7A7A7A", lineHeight: 1.5 }}>{ph.desc}</div>
              </div>
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  color: "#7A7A7A",
                  whiteSpace: "nowrap",
                }}
              >
                {ph.duration}
              </span>
            </div>
          ))}
        </div>
      </Section>

      {/* Devis récapitulatif */}
      <Section index="06" title="Devis récapitulatif">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr 60px 70px 100px",
            gap: "12px",
            padding: "0 0 10px",
            borderBottom: "1px solid #D4D4D0",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#A8A8A8",
          }}
        >
          <span>Catégorie</span>
          <span>Prestation</span>
          <span style={{ textAlign: "right" }}>Jours</span>
          <span style={{ textAlign: "right" }}>TJM</span>
          <span style={{ textAlign: "right" }}>Montant</span>
        </div>
        {doc.rows.map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 60px 70px 100px",
              gap: "12px",
              padding: "12px 0",
              borderBottom: "1px solid #F4F4F2",
              fontSize: "13px",
              alignItems: "baseline",
            }}
          >
            <span style={{ color: "#7A7A7A", fontSize: "12px" }}>{row.cat}</span>
            <span>{row.name}</span>
            <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{row.days}</span>
            <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums" }}>{row.tjm}</span>
            <span style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{row.amount}</span>
          </div>
        ))}
        <div style={{ marginTop: "20px", marginLeft: "auto", width: "280px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7A7A" }}>
            <span>Total HT</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{doc.totalHT}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#7A7A7A" }}>
            <span>TVA 20 %</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{doc.tva}</span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "15px",
              fontWeight: 600,
              borderTop: "1px solid #D4D4D0",
              paddingTop: "10px",
            }}
          >
            <span>Total TTC</span>
            <span style={{ fontVariantNumeric: "tabular-nums" }}>{doc.ttc}</span>
          </div>
        </div>
      </Section>

      {/* Conditions commerciales */}
      <Section index="07" title="Conditions commerciales">
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          {doc.conditions.map((cond) => (
            <div key={cond.label} style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "20px", fontSize: "13px", lineHeight: 1.55 }}>
              <span style={{ fontWeight: 600 }}>{cond.label}</span>
              <span style={{ color: "#7A7A7A" }}>{cond.text}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* Signature */}
      <div style={{ padding: "56px 72px 72px", display: "grid", gridTemplateColumns: "180px 1fr", gap: "48px" }}>
        <div style={label}>08 — Signature</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ border: "1px solid #E8E8E5", borderRadius: "8px", padding: "20px" }}>
            <div style={{ ...label, marginBottom: "12px" }}>Le prestataire</div>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>Frédéric Rossi</div>
            <div style={{ fontSize: "12px", color: "#7A7A7A", marginBottom: "20px" }}>EI — Lyon · SIRET 912 448 306 00021</div>
            <div
              style={{
                fontFamily: "'Newsreader', Georgia, serif",
                fontStyle: "italic",
                fontSize: "26px",
                color: "#353535",
                borderBottom: "1px solid #E8E8E5",
                paddingBottom: "8px",
              }}
            >
              Frédéric Rossi
            </div>
            <div style={{ fontSize: "11px", color: "#A8A8A8", marginTop: "8px" }}>Signé le {doc.date}</div>
          </div>
          <div style={{ border: "1px solid #E8E8E5", borderRadius: "8px", padding: "20px", background: "#FAFAF9" }}>
            <div style={{ ...label, marginBottom: "12px" }}>Le client</div>
            <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "2px" }}>{doc.clientContact}</div>
            <div style={{ fontSize: "12px", color: "#7A7A7A", marginBottom: "20px" }}>
              {doc.clientFonction} — {doc.clientCompany}
            </div>
            {doc.signed ? (
              <>
                <div
                  style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "26px",
                    color: "#353535",
                    borderBottom: "1px solid #E8E8E5",
                    paddingBottom: "8px",
                  }}
                >
                  {doc.signedName}
                </div>
                <div style={{ fontSize: "11px", color: "#A8A8A8", marginTop: "8px" }}>Signé le {doc.signedAt}</div>
              </>
            ) : (
              <>
                <div
                  style={{
                    fontFamily: "'Newsreader', Georgia, serif",
                    fontStyle: "italic",
                    fontSize: "26px",
                    color: "#D4D4D0",
                    borderBottom: "1px solid #E8E8E5",
                    paddingBottom: "8px",
                  }}
                >
                  —
                </div>
                <div style={{ fontSize: "11px", color: "#A8A8A8", marginTop: "8px" }}>En attente de signature</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ index, title, children }) {
  return (
    <div style={{ padding: "56px 72px", borderBottom: "1px solid #E8E8E5", display: "grid", gridTemplateColumns: "180px 1fr", gap: "48px" }}>
      <div style={label}>
        {index} — {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
