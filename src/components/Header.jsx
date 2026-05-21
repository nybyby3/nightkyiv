import { colors, font, layout } from "../styles/theme.js";

export default function Header({ lang, setLang, dict, onLogoClick }) {
  return (
    <header style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: `calc(${layout.safeTop} + 14px) 18px 12px`,
      position: "sticky", top: 0, zIndex: 20,
      background: "rgba(10,8,20,0.72)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: `1px solid ${colors.border}`,
    }}>
      <button
        onClick={onLogoClick}
        style={{ display:"flex", alignItems:"center", gap:10, background:"none", border:"none", padding:0, cursor:"pointer" }}
      >
        <div style={{
          width:36, height:36, borderRadius:10,
          background: colors.primaryGrad,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontFamily: font.display, fontWeight: 800, fontSize: 16, color: "#fff",
          boxShadow: "0 4px 16px rgba(162,89,255,0.35)",
        }}>N</div>
        <span style={{
          fontFamily: font.display, fontWeight: 700, fontSize: 19,
          letterSpacing: -0.5, color: colors.text,
        }}>{dict.brand}</span>
      </button>

      <button
        onClick={() => setLang(lang === "en" ? "uk" : "en")}
        style={{
          background: colors.surface2, border: `1px solid ${colors.border}`,
          borderRadius: 20, padding: "6px 14px",
          color: colors.text, fontSize: 12, fontWeight: 600,
          cursor: "pointer", fontFamily: font.body,
        }}
      >🌐 {dict.langLabel}</button>
    </header>
  );
}
