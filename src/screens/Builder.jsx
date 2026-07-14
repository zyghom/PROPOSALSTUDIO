import { LIB, ICONS, BLOCKS, CATALOG, SECTEURS } from "../data";
import { OFFER_NAME, fmt } from "../App";

function segStyle(active) {
  return {
    padding: "7px 16px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 500,
    background: active ? "#353535" : "transparent",
    color: active ? "#fff" : "#7A7A7A",
    transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
  };
}

const monoLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: "10px",
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "#7A7A7A",
};

export default function Builder({ ctx }) {
  const { s, set, nav, showToast, calcDays, moduleDays, totalHT } = ctx;

  return (
    <main style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", padding: "32px 32px 140px" }}>
      {/* Barre d'actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
        <button
          className="link-muted"
          onClick={() => nav("dashboard")}
          style={{ display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#7A7A7A", transition: "color 200ms" }}
        >
          ← Dashboard
        </button>
        <div style={{ width: "1px", height: "20px", background: "#E8E8E5" }} />
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>{OFFER_NAME}</div>
          <div style={{ ...monoLabel, fontSize: "10px", marginTop: "2px" }}>Brouillon · modifié à l'instant</div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: "10px" }}>
          <button
            className="btn-outline"
            onClick={() => showToast("Composition sauvegardée comme template")}
            style={{
              padding: "10px 18px",
              border: "1px solid #D4D4D0",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Sauvegarder comme template
          </button>
          <button
            className="btn-outline"
            onClick={() => showToast("Offre sauvegardée")}
            style={{
              padding: "10px 18px",
              border: "1px solid #D4D4D0",
              borderRadius: "999px",
              fontSize: "13px",
              fontWeight: 500,
              transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            Sauvegarder
          </button>
          <button
            className="btn-dark"
            onClick={() => nav("preview")}
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
            Aperçu <span>→</span>
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
        {/* Colonne gauche : bibliothèque */}
        <aside
          style={{
            background: "#fff",
            border: "1px solid #E8E8E5",
            borderRadius: "12px",
            padding: "20px",
            position: "sticky",
            top: "88px",
            maxHeight: "calc(100vh - 120px)",
            overflowY: "auto",
          }}
        >
          <div style={{ ...monoLabel, marginBottom: "4px" }}>Bibliothèque</div>
          <div style={{ fontSize: "13px", color: "#7A7A7A", marginBottom: "20px" }}>Cliquez pour ajouter à la composition.</div>
          {LIB.map((cat) => (
            <div key={cat.name} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgb(30,159,175)",
                  paddingBottom: "8px",
                  borderBottom: "1px solid #F4F4F2",
                  marginBottom: "6px",
                }}
              >
                {cat.name}
              </div>
              {cat.ids.map((id) => {
                const added = s.composition.includes(id);
                return (
                  <button
                    key={id}
                    className="lib-block"
                    disabled={added}
                    onClick={() => {
                      if (added) return;
                      set({ composition: [...s.composition, id], expanded: id });
                    }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      textAlign: "left",
                      padding: "10px",
                      borderRadius: "8px",
                      border: "1px solid transparent",
                      opacity: added ? 0.45 : 1,
                      cursor: added ? "default" : "pointer",
                      transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    <span
                      style={{
                        width: "30px",
                        height: "30px",
                        border: "1px solid #E8E8E5",
                        borderRadius: "6px",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#353535",
                        flexShrink: 0,
                        background: "#fff",
                      }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d={ICONS[id]} />
                      </svg>
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ display: "block", fontSize: "13px", fontWeight: 500 }}>{BLOCKS[id].name}</span>
                      <span style={{ display: "block", fontSize: "11px", color: "#A8A8A8", lineHeight: 1.4, marginTop: "1px" }}>{BLOCKS[id].desc}</span>
                    </span>
                    <span style={{ color: "#A8A8A8", fontSize: "14px", flexShrink: 0 }}>{added ? "✓" : "+"}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Colonne droite : composition */}
        <section style={{ display: "flex", flexDirection: "column", gap: "10px", minHeight: "400px" }}>
          {s.composition.length === 0 && (
            <div style={{ border: "1px dashed #D4D4D0", borderRadius: "12px", padding: "64px 32px", textAlign: "center" }}>
              <div style={{ fontSize: "14px", fontWeight: 500, marginBottom: "6px" }}>Composition vide</div>
              <div style={{ fontSize: "13px", color: "#A8A8A8" }}>Ajoutez des blocs depuis la bibliothèque à gauche.</div>
            </div>
          )}

          {s.composition.map((id, i) => (
            <CompositionBlock key={id} id={id} index={i} ctx={ctx} />
          ))}

          {/* Récapitulatif flottant */}
          <div
            style={{
              position: "sticky",
              bottom: "20px",
              marginTop: "12px",
              background: "#353535",
              color: "#fff",
              borderRadius: "999px",
              padding: "14px 26px",
              display: "flex",
              alignItems: "center",
              gap: "24px",
              width: "fit-content",
              alignSelf: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {s.composition.length} blocs
            </span>
            <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.2)" }} />
            <span style={{ fontSize: "14px", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmt(totalHT())} HT</span>
            <span style={{ width: "1px", height: "16px", background: "rgba(255,255,255,0.2)" }} />
            <button
              className="link-muted"
              onClick={() => nav("preview")}
              style={{ color: "rgb(70,190,205)", fontSize: "13px", fontWeight: 500, display: "inline-flex", gap: "6px", alignItems: "center" }}
            >
              Aperçu →
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function CompositionBlock({ id, index, ctx }) {
  const { s, set, calcDays } = ctx;
  const expanded = s.expanded === id;
  const isGarde = expanded && id === "garde";
  const isDevis = expanded && id === "devis";
  const isCalc = expanded && id === "calculateur";
  const isGeneric = expanded && !isGarde && !isDevis && !isCalc;

  let meta = "";
  if (id === "devis") meta = ctx.fmt(ctx.totalHT()) + " HT";
  if (id === "calculateur") meta = s.profils + " profils · " + String(calcDays()).replace(".", ",") + " j";
  if (id === "garde") meta = s.garde.entreprise;

  const onToggle = () => set({ expanded: expanded ? null : id });
  const onRemove = (e) => {
    e.stopPropagation();
    set({ composition: s.composition.filter((x) => x !== id) });
  };
  const onUp = (e) => {
    e.stopPropagation();
    if (index === 0) return;
    const c = [...s.composition];
    [c[index - 1], c[index]] = [c[index], c[index - 1]];
    set({ composition: c });
  };
  const onDown = (e) => {
    e.stopPropagation();
    if (index === s.composition.length - 1) return;
    const c = [...s.composition];
    [c[index + 1], c[index]] = [c[index], c[index + 1]];
    set({ composition: c });
  };

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        border: expanded ? "1px solid #D4D4D0" : "1px solid #E8E8E5",
        transition: "border-color 200ms cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 16px", cursor: "pointer" }} onClick={onToggle}>
        <span style={{ color: "#D4D4D0", fontSize: "13px", letterSpacing: "2px", cursor: "grab", userSelect: "none" }}>⋮⋮</span>
        <span
          style={{
            width: "28px",
            height: "28px",
            border: "1px solid #E8E8E5",
            borderRadius: "6px",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#353535",
            flexShrink: 0,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d={ICONS[id]} />
          </svg>
        </span>
        <span style={{ fontSize: "14px", fontWeight: 600, flex: 1 }}>{BLOCKS[id].name}</span>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "10px",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#A8A8A8",
          }}
        >
          {meta}
        </span>
        <span style={{ display: "inline-flex", gap: "2px", marginLeft: "8px" }}>
          <button
            className="icon-btn"
            onClick={onUp}
            title="Monter"
            style={{ width: "26px", height: "26px", borderRadius: "6px", color: "#A8A8A8", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            ↑
          </button>
          <button
            className="icon-btn"
            onClick={onDown}
            title="Descendre"
            style={{ width: "26px", height: "26px", borderRadius: "6px", color: "#A8A8A8", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            ↓
          </button>
          <button
            className="icon-btn-danger"
            onClick={onRemove}
            title="Supprimer"
            style={{ width: "26px", height: "26px", borderRadius: "6px", color: "#A8A8A8", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
          >
            ✕
          </button>
        </span>
        <span
          style={{
            color: "#A8A8A8",
            fontSize: "12px",
            marginLeft: "4px",
            transform: expanded ? "rotate(180deg)" : "none",
            transition: "transform 200ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          ▾
        </span>
      </div>

      {isGarde && <GardeBlock ctx={ctx} />}
      {isCalc && <CalcBlock ctx={ctx} />}
      {isDevis && <DevisBlock ctx={ctx} />}
      {isGeneric && <GenericBlock id={id} ctx={ctx} />}
    </div>
  );
}

function GardeBlock({ ctx }) {
  const { s, set } = ctx;
  const g = s.garde;
  const setGarde = (patch) => set({ garde: { ...g, ...patch } });
  const fields = [
    { label: "Nom de l'entreprise", key: "entreprise", placeholder: "Fonderie Delcourt" },
    { label: "Contact principal", key: "contact", placeholder: "Prénom Nom" },
    { label: "Fonction", key: "fonction", placeholder: "Directrice des Opérations" },
    { label: "Email", key: "email", placeholder: "contact@entreprise.fr" },
    { label: "Téléphone", key: "tel", placeholder: "04 00 00 00 00" },
  ];
  return (
    <div style={{ borderTop: "1px solid #F4F4F2", padding: "24px 20px 24px 56px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {fields.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={monoLabel}>{f.label}</label>
            <input
              value={g[f.key]}
              onChange={(e) => setGarde({ [f.key]: e.target.value })}
              placeholder={f.placeholder}
              style={{
                border: "1px solid #D4D4D0",
                borderRadius: "8px",
                padding: "10px 12px",
                fontSize: "14px",
                fontFamily: "inherit",
                background: "#fff",
                transition: "all 200ms cubic-bezier(0.22,1,0.36,1)",
              }}
            />
          </div>
        ))}
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={monoLabel}>Secteur</label>
          <select
            value={g.secteur}
            onChange={(e) => setGarde({ secteur: e.target.value })}
            style={{ border: "1px solid #D4D4D0", borderRadius: "8px", padding: "10px 12px", fontSize: "14px", fontFamily: "inherit", background: "#fff", color: "#353535" }}
          >
            {SECTEURS.map((sect) => (
              <option key={sect} value={sect}>
                {sect}
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={monoLabel}>Logo client — optionnel</label>
          <div
            className="file-drop"
            style={{
              border: "1px dashed #D4D4D0",
              borderRadius: "8px",
              padding: "10px 12px",
              fontSize: "13px",
              color: "#A8A8A8",
              textAlign: "center",
              cursor: "pointer",
              transition: "all 200ms",
            }}
          >
            Déposer un fichier ou cliquer
          </div>
        </div>
      </div>
    </div>
  );
}

function CalcBlock({ ctx }) {
  const { s, set, calcDays } = ctx;
  return (
    <div style={{ borderTop: "1px solid #F4F4F2", padding: "24px 20px 24px 56px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={monoLabel}>Profils métiers</label>
          <input
            type="number"
            min={1}
            max={12}
            value={s.profils}
            onChange={(e) => set({ profils: Math.max(1, parseInt(e.target.value) || 1) })}
            style={{ border: "1px solid #D4D4D0", borderRadius: "8px", padding: "10px 12px", fontSize: "15px", fontWeight: 600, fontFamily: "inherit", width: "90px", background: "#fff" }}
          />
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: "12px", color: "#7A7A7A", letterSpacing: "0.02em", paddingTop: "18px" }}>
          × 3 entretiens min. par profil × 3h &nbsp;=&nbsp;{" "}
          <span style={{ color: "rgb(20,120,135)", fontWeight: 500 }}>{String(calcDays()).replace(".", ",")} jours</span>
        </div>
      </div>
      <div
        style={{
          marginTop: "16px",
          background: "rgb(240,250,252)",
          border: "1px solid rgb(225,245,248)",
          borderRadius: "8px",
          padding: "12px 16px",
          fontSize: "13px",
          color: "rgb(20,120,135)",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 17l6-6 4 4 8-8M15 7h6v6" />
        </svg>
        Alimente automatiquement le module « Entretiens utilisateurs » du devis.
      </div>
    </div>
  );
}

function DevisBlock({ ctx }) {
  const { s, set, moduleDays, totalHT, fmt: fmtCtx } = ctx;

  return (
    <div style={{ borderTop: "1px solid #F4F4F2", padding: "24px 20px 24px 56px" }}>
      <div style={{ display: "inline-flex", border: "1px solid #D4D4D0", borderRadius: "999px", padding: "3px", marginBottom: "20px" }}>
        <button onClick={() => set({ devisMode: "forfait" })} style={segStyle(s.devisMode === "forfait")}>
          Mode forfaitaire
        </button>
        <button onClick={() => set({ devisMode: "detaille" })} style={segStyle(s.devisMode === "detaille")}>
          Mode détaillé
        </button>
      </div>

      {s.devisMode === "forfait" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxWidth: "280px" }}>
          <label style={monoLabel}>Montant forfaitaire HT</label>
          <input
            type="number"
            value={s.forfait}
            onChange={(e) => set({ forfait: parseFloat(e.target.value) || 0 })}
            style={{ border: "1px solid #D4D4D0", borderRadius: "8px", padding: "10px 12px", fontSize: "15px", fontWeight: 600, fontFamily: "inherit", background: "#fff" }}
          />
        </div>
      )}

      {s.devisMode === "detaille" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {CATALOG.map((c) => {
            const open = !!s.openCats[c.name];
            const nChecked = c.modules.filter((m) => s.checked[m.id]).length;
            return (
              <div key={c.name} style={{ border: "1px solid #E8E8E5", borderRadius: "8px", overflow: "hidden" }}>
                <button
                  onClick={() => set({ openCats: { ...s.openCats, [c.name]: !open } })}
                  style={{ width: "100%", display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", textAlign: "left", background: "#FAFAF9" }}
                >
                  <span
                    style={{
                      color: "#A8A8A8",
                      fontSize: "11px",
                      transform: open ? "rotate(90deg)" : "none",
                      transition: "transform 200ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    ▸
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: 600, flex: 1 }}>{c.name}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "#A8A8A8",
                    }}
                  >
                    {nChecked} / {c.modules.length} modules
                  </span>
                </button>
                {open && (
                  <div style={{ borderTop: "1px solid #F4F4F2" }}>
                    {c.modules.map((m) => {
                      const checked = !!s.checked[m.id];
                      const d = moduleDays(m);
                      const t = s.tjms[m.id] ?? 900;
                      return (
                        <div key={m.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: "1px solid #F4F4F2" }}>
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => set({ checked: { ...s.checked, [m.id]: !checked } })}
                            style={{ width: "15px", height: "15px", accentColor: "rgb(30,159,175)", cursor: "pointer" }}
                          />
                          <span style={{ fontSize: "13px", flex: 1 }}>{m.name}</span>
                          {checked && (
                            <>
                              {m.auto ? (
                                <span
                                  style={{
                                    fontFamily: "'JetBrains Mono', monospace",
                                    fontSize: "10px",
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    color: "rgb(20,120,135)",
                                    background: "rgb(240,250,252)",
                                    borderRadius: "999px",
                                    padding: "3px 8px",
                                  }}
                                >
                                  auto · {d} j
                                </span>
                              ) : (
                                <>
                                  <input
                                    type="number"
                                    min={0.5}
                                    step={0.5}
                                    value={d}
                                    onChange={(e) => set({ days: { ...s.days, [m.id]: parseFloat(e.target.value) || 0 } })}
                                    title="Jours"
                                    style={{
                                      border: "1px solid #D4D4D0",
                                      borderRadius: "6px",
                                      padding: "5px 8px",
                                      fontSize: "12px",
                                      fontFamily: "inherit",
                                      width: "58px",
                                      background: "#fff",
                                      textAlign: "right",
                                    }}
                                  />
                                  <span style={{ fontSize: "11px", color: "#A8A8A8" }}>j</span>
                                </>
                              )}
                              <input
                                type="number"
                                min={0}
                                step={50}
                                value={t}
                                onChange={(e) => set({ tjms: { ...s.tjms, [m.id]: parseFloat(e.target.value) || 0 } })}
                                title="TJM"
                                style={{
                                  border: "1px solid #D4D4D0",
                                  borderRadius: "6px",
                                  padding: "5px 8px",
                                  fontSize: "12px",
                                  fontFamily: "inherit",
                                  width: "70px",
                                  background: "#fff",
                                  textAlign: "right",
                                }}
                              />
                              <span style={{ fontSize: "11px", color: "#A8A8A8" }}>€/j</span>
                              <span style={{ fontSize: "13px", fontWeight: 600, fontVariantNumeric: "tabular-nums", width: "80px", textAlign: "right" }}>
                                {fmtCtx(d * t)}
                              </span>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px", paddingTop: "14px", borderTop: "1px solid #E8E8E5" }}>
        <div style={{ fontSize: "14px", color: "#7A7A7A" }}>
          Total HT en temps réel &nbsp;{" "}
          <span style={{ fontSize: "18px", fontWeight: 600, color: "#353535", fontVariantNumeric: "tabular-nums" }}>{fmtCtx(totalHT())}</span>
        </div>
      </div>
    </div>
  );
}

function GenericBlock({ id, ctx }) {
  const { s, set } = ctx;
  return (
    <div style={{ borderTop: "1px solid #F4F4F2", padding: "20px 20px 20px 56px" }}>
      <textarea
        rows={4}
        value={s.contents[id] || ""}
        onChange={(e) => set({ contents: { ...s.contents, [id]: e.target.value } })}
        placeholder="Contenu du bloc — texte libre…"
        style={{
          width: "100%",
          border: "1px solid #D4D4D0",
          borderRadius: "8px",
          padding: "12px",
          fontSize: "14px",
          fontFamily: "inherit",
          lineHeight: 1.5,
          background: "#fff",
          resize: "vertical",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}
