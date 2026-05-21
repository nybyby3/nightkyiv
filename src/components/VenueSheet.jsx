import { colors, radius, font, catColor } from "../styles/theme.js";

// Bottom-sheet style modal for full venue details.
export default function VenueSheet({ venue, lang, dict, onClose }) {
  if (!venue) return null;
  const c = catColor[venue.category] || colors.primary;
  const phones = (venue.phone || "").split("\n").map(s=>s.trim()).filter(Boolean);
  const sites  = (venue.site  || "").split("\n").map(s=>s.trim()).filter(Boolean);
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((venue.address||"")+", Київ")}`;

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, background:"rgba(5,3,10,0.7)",
        backdropFilter:"blur(6px)", WebkitBackdropFilter:"blur(6px)",
        zIndex:100, display:"flex", alignItems:"flex-end", justifyContent:"center",
      }}
    >
      <div
        onClick={e=>e.stopPropagation()}
        style={{
          width:"100%", maxWidth:480, maxHeight:"86vh", overflowY:"auto",
          background: colors.bg, color: colors.text,
          borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
          border: `1px solid ${colors.border}`, padding:"14px 18px 28px",
          fontFamily: font.body,
        }}
      >
        <div style={{
          width:40, height:4, borderRadius:2, background: colors.border,
          margin:"0 auto 14px",
        }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div style={{ minWidth:0 }}>
            {venue.flagship && (
              <span style={{
                background:`linear-gradient(135deg,${c},${c}aa)`, color:"#fff",
                fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:8,
                letterSpacing:0.4, textTransform:"uppercase",
              }}>{dict.venue.flagship}</span>
            )}
            <h2 style={{ fontFamily: font.display, fontSize:22, margin:"8px 0 4px", fontWeight:800, lineHeight:1.2 }}>
              {venue.name}
            </h2>
            {venue.rating != null && (
              <div style={{ fontSize:13, color: c, fontWeight:700 }}>
                ★ {venue.rating.toFixed(1)}
                {venue.reviews != null && <span style={{ color: colors.textMute, fontWeight:500 }}> · {dict.explore.reviews(venue.reviews)}</span>}
              </div>
            )}
          </div>
          <button onClick={onClose} style={{
            background: colors.surface2, border:`1px solid ${colors.border}`,
            color: colors.text, width:32, height:32, borderRadius:16,
            cursor:"pointer", fontSize:16, lineHeight:1, fontWeight:600,
          }}>×</button>
        </div>

        {venue.format && <Section title={dict.venue.notes}>{venue.format}</Section>}
        {venue.address && (
          <Section title="📍">
            <div>{venue.district ? <strong>{venue.district}. </strong> : null}{venue.address}</div>
            <a href={mapsHref} target="_blank" rel="noopener noreferrer" style={linkStyle(c)}>
              {dict.venue.open} →
            </a>
          </Section>
        )}
        {venue.hours && <Section title={"🕒 " + dict.venue.hours}><pre style={preStyle}>{venue.hours}</pre></Section>}
        {phones.length > 0 && (
          <Section title="📞">
            {phones.map((p,i)=> <div key={i}><a href={`tel:${p.replace(/\s+/g,"")}`} style={linkStyle(c)}>{p}</a></div>)}
          </Section>
        )}
        {sites.length > 0 && (
          <Section title="🔗">
            {sites.map((s,i)=> {
              const url = s.startsWith("http") ? s : "https://"+s.replace(/^https?:\/\//,"");
              return <div key={i}><a href={url} target="_blank" rel="noopener noreferrer" style={linkStyle(c)}>{s}</a></div>;
            })}
          </Section>
        )}
        {venue.notes && <Section title="✨">{venue.notes}</Section>}
        {venue.level && <Section title="🎯">{venue.level}</Section>}
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginTop:14 }}>
      <div style={{ fontSize:11, color: colors.textMute, fontWeight:700, marginBottom:6, letterSpacing:0.6, textTransform:"uppercase" }}>{title}</div>
      <div style={{ fontSize:13.5, color: colors.text, lineHeight:1.55, wordBreak:"break-word" }}>{children}</div>
    </div>
  );
}
const linkStyle = c => ({ color: c, textDecoration:"none", fontWeight:600 });
const preStyle = { whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, fontSize:13.5, lineHeight:1.55 };
