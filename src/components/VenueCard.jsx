import { colors, radius, font, catColor } from "../styles/theme.js";
import { isFavorite, toggleFavorite, useFavorites } from "../utils/favorites.js";
import { isOpenNow } from "../utils/hours.js";

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
  const favs = useFavorites();
  const isFav = favs.includes(venue.id);
  const open = isOpenNow(venue.hours);

  return (
    <div
      onClick={onClick}
      style={{
        position:"relative", textAlign:"left", width:"100%", background: colors.surface,
        border: `1px solid ${venue.flagship ? c + "55" : colors.border}`,
        borderRadius: radius.lg, padding: 14, cursor:"pointer",
        display:"flex", flexDirection:"column", gap:8,
        color: colors.text, fontFamily: font.body,
        transition:"transform 0.15s, border-color 0.15s",
      }}
    >
      {/* Heart toggle (top-right) */}
      <button
        onClick={(e) => { e.stopPropagation(); toggleFavorite(venue.id); }}
        aria-label={isFav ? "Видалити зі збереженого" : "Зберегти"}
        style={{
          position:"absolute", top:10, right:10,
          width:32, height:32, borderRadius:16,
          background: isFav ? c + "33" : "rgba(255,255,255,0.04)",
          border: `1px solid ${isFav ? c + "88" : colors.border}`,
          color: isFav ? c : colors.textDim,
          fontSize: 15, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          transition:"transform 0.15s, background 0.15s",
        }}
      >{isFav ? "♥" : "♡"}</button>

      {/* Top row: badges */}
      <div style={{ display:"flex", alignItems:"center", gap:6, flexWrap:"wrap", paddingRight: 36 }}>
        {venue.flagship && (
          <span style={{
            background:`linear-gradient(135deg,${c},${c}aa)`, color:"#fff",
            fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:8,
            letterSpacing:0.3, textTransform:"uppercase",
          }}>🏆 {dict.explore.flagship}</span>
        )}
        {open === true && (
          <span style={{
            background: "rgba(62,207,142,0.18)", color: colors.success,
            fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:8,
            letterSpacing:0.3, textTransform:"uppercase",
            display:"flex", alignItems:"center", gap:4,
          }}>
            <span style={{ width:6, height:6, borderRadius:"50%", background: colors.success, boxShadow:`0 0 6px ${colors.success}` }}/>
            {lang === "uk" ? "Відкрито" : "Open now"}
          </span>
        )}
        {open === false && (
          <span style={{
            background: "rgba(255,107,107,0.14)", color: colors.danger,
            fontSize:10, fontWeight:700, padding:"3px 8px", borderRadius:8,
            letterSpacing:0.3, textTransform:"uppercase",
          }}>{lang === "uk" ? "Зачинено" : "Closed"}</span>
        )}
        {venue.rating != null && (
          <span style={{ fontSize:12, color: c, fontWeight:700, marginLeft:"auto" }}>
            ★ {venue.rating.toFixed(1)}
            {venue.reviews != null && <span style={{ color: colors.textMute, fontWeight:500, fontSize:11, marginLeft:3 }}>({venue.reviews})</span>}
          </span>
        )}
      </div>

      {/* Title */}
      <div style={{ fontFamily: font.display, fontWeight:700, fontSize:16, lineHeight:1.25, paddingRight: 30 }}>{name}</div>

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
    </div>
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
