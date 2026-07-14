import logoFred from "../assets/logo-fred.svg";
import portraitFred from "../assets/portrait-fred.png";

function navStyle(active) {
  return {
    padding: "7px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: 500,
    color: active ? "#353535" : "#7A7A7A",
    background: active ? "#FFFFFF" : "transparent",
    border: active ? "1px solid #E8E8E5" : "1px solid transparent",
    boxShadow: active ? "0 1px 2px rgba(0,0,0,0.04)" : "none",
    transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
  };
}

export default function TopBar({ screen, onNav }) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "saturate(180%) blur(14px)",
        WebkitBackdropFilter: "saturate(180%) blur(14px)",
        borderBottom: "1px solid #E8E8E5",
      }}
    >
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 32px", height: "64px", display: "flex", alignItems: "center", gap: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }} onClick={() => onNav("dashboard")}>
          <img src={logoFred} alt="FR" style={{ height: "22px" }} />
          <span style={{ fontWeight: 600, fontSize: "15px", letterSpacing: "-0.01em" }}>ProposalStudio</span>
        </div>
        <nav style={{ display: "flex", gap: "4px", marginLeft: "8px" }}>
          <button className="nav-btn" onClick={() => onNav("dashboard")} style={navStyle(screen === "dashboard")}>
            Dashboard
          </button>
          <button className="nav-btn" onClick={() => onNav("builder")} style={navStyle(screen === "builder" || screen === "preview")}>
            Constructeur
          </button>
          <button className="nav-btn" onClick={() => onNav("templates")} style={navStyle(screen === "templates")}>
            Templates
          </button>
        </nav>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "16px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#7A7A7A",
            }}
          >
            <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#16A34A", boxShadow: "0 0 0 3px rgba(22,163,74,0.15)" }} />
            Disponible
          </span>
          <img
            src={portraitFred}
            alt="Frédéric Rossi"
            style={{ width: "32px", height: "32px", borderRadius: "50%", objectFit: "cover", border: "1px solid #E8E8E5" }}
          />
        </div>
      </div>
    </header>
  );
}
