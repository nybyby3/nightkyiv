import { colors, radius, font, catColor } from "../styles/theme.js";

// Strip 🏆 / 🌟 / ⭐ prefixes from venue names so the card title stays clean
// (the flagship badge already carries that signal visually).
function cleanName(n) {
  return (n || "")
    .replace(/^🌳\s*/, "")
    .replace(/^🏆\s*/, "")
    .replace(/⭐+/g, "")
    .replace(/🏆/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function priceLabel(p, lang) {
  if (!p) return null;
  if (p.tier) return "$".repeat(p.tier);
  if (p.min === 0 && p.max === 0) return lang === "uk" ? "Безкоштовно" : "Free";
  if (p.min === p.max) return `${p.min} грн`;
  return `${p.min}–${p.max} грн`;
}

export default function VenueCard({ venue, lang, dict, onClick, distance }) {
  const c = catColor[venue.category] || colors.primary;
  const name = cleanName(venue.name);
  const price = priceLabel(venue.price, lang);

  return (
    <button
      onClick={onClick}
      style={{
        textAlign:"left", width:"100%", background: colors.surface,
        border: `1px solid ${venue.flagship ? c + "55" : colors.border}`,
        borderRadius: radius.lg, padding: 14, cursor:"pointer",
        display:"flex", flexDirection:"column", gap:8,
        color: colors.text, fontFamily: font.body,
        transition:"transform 0.15s, border-color 0.15s",
      }}
    >
      {/* Top row: category badge + flagship + rating */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:8, flexWrap:"wrap" }}>
        <div style={{ display:"flex", alignItems:"center", gap:6 }}>
          {venue.flagship && (
            <span style={{
              background:`linear-gradient(135deg,${c},${c}aa)`, color:"#fff",
              fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:8,
              letterSpacing:0.3, textTransform:"uppercase",
            }}>🏆 {dict.explore.flagship}</span>
          )}
        </div>
        {venue.rating != null && (
          <div style={{ fontSize:12, color: c, fontWeight:700, display:"flex", alignItems:"center", gap:3 }}>
            ★ {venue.rating.toFixed(1)}
            {venue.reviews != null && <span style={{ color: colors.textMute, fontWeight:500, fontSize:11 }}>({venue.reviews})</span>}
          </div>
        )}
      </div>

      {/* Title */}
      <div style={{ fontFamily: font.display, fontWeight:700, fontSize:16, lineHeight:1.25 }}>{name}</div>

      {/* Format / type */}
      {venue.format && (
        <div style={{ fontSize:12, color: colors.textDim, lineHeight:1.4 }}>
          {venue.format.slice(0, 110)}{venue.format.length > 110 ? "…" : ""}
        </div>
      )}

      {/* Address + district */}
      {venue.address && (
        <div style={{ display:"flex", alignItems:"flex-start", gap:6, fontSize:12, color: colors.textDim }}>
          <span style={{ color: c, flexShrink:0 }}>📍</span>
          <span>
            {venue.district && <span style={{ color: colors.text, marginRight:4 }}>{venue.district}.</span>}
            {venue.address}
          </span>
        </div>
      )}

      {/* Footer chips */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:2 }}>
        {price && <Chip>{price}</Chip>}
        {venue.hours && <Chip>🕒 {venue.hours.split("\n")[0].slice(0, 28)}</Chip>}
        {distance != null && <Chip color={c}>📏 {distance.toFixed(1)} km</Chip>}
      </div>
    </button>
  );
}

function Chip({ children, color }) {
  return (
    <span style={{
      fontSize:11, color: color || colors.textDim,
      background: colors.surface2, border: `1px solid ${colors.border}`,
      padding:"3px 9px", borderRadius:999, fontWeight:500,
    }}>{children}</span>
  );
}
