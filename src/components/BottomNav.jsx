import { colors, font, layout } from "../styles/theme.js";

const ITEMS = [
  { id: "discover", ic: "✨", k: "discover" },
  { id: "explore",  ic: "🧭", k: "explore"  },
  { id: "map",      ic: "🗺️", k: "map"      },
  { id: "cinema",   ic: "🎬", k: "cinema"   },
  { id: "cook",     ic: "🍳", k: "cook"     },
];

export default function BottomNav({ page, setPage, dict }) {
  return (
    <nav style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: layout.maxWidth,
      background: "rgba(10,8,20,0.88)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderTop: `1px solid ${colors.border}`,
      display: "flex", justifyContent: "space-around",
      padding: `10px 4px calc(${layout.safeBottom} + 12px)`,
      zIndex: 30,
    }}>
      {ITEMS.map(n => {
        const active = page === n.id;
        return (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              background: "none", border: "none",
              color: active ? colors.primary : colors.textMute,
              display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              cursor: "pointer", fontSize: 10.5,
              fontFamily: font.body, fontWeight: 600,
              padding: "4px 8px", minWidth: 56,
              position: "relative", transition: "color 0.18s",
            }}
          >
            {active && <div style={{
              position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
              width:32, height:3, borderRadius:2, background: colors.primary,
            }}/>}
            <span style={{ fontSize: 20, lineHeight: 1, filter: active ? "none" : "grayscale(0.4) opacity(0.85)" }}>{n.ic}</span>
            {dict.nav[n.k]}
          </button>
        );
      })}
    </nav>
  );
}
