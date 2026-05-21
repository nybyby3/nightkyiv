import { useEffect, useMemo, useState } from "react";
import { colors, radius, font, catColor } from "../styles/theme.js";
import { loadVenues, loadCategories } from "../utils/data.js";
import VenueCard from "../components/VenueCard.jsx";
import VenueSheet from "../components/VenueSheet.jsx";

const PAGE = 30;

export default function ExploreView({ lang, dict, initial }) {
  const [venues, setVenues] = useState(null);
  const [cats, setCats]     = useState(null);
  const [query, setQuery]   = useState("");
  const [cat, setCat]       = useState(initial?.category || "all");
  const [district, setDistrict] = useState("all");
  const [sort, setSort]     = useState("flag");
  const [page, setPage]     = useState(1);
  const [selected, setSelected] = useState(null);

  useEffect(() => { loadVenues().then(setVenues); }, []);
  useEffect(() => { loadCategories().then(c => setCats(c.venues)); }, []);
  useEffect(() => { setPage(1); }, [query, cat, district, sort]);

  // Reset filter if Discover hands off a new bucket.
  useEffect(() => {
    if (initial?.category) setCat(initial.category);
  }, [initial?.category]);

  const districts = useMemo(() => {
    if (!venues) return [];
    const set = new Set(venues.map(v => v.district).filter(Boolean));
    return Array.from(set).sort();
  }, [venues]);

  const filtered = useMemo(() => {
    if (!venues) return [];
    const q = query.trim().toLowerCase();
    let out = venues.filter(v => {
      if (cat !== "all" && v.category !== cat) return false;
      if (district !== "all" && v.district !== district) return false;
      if (q && !((v.name||"").toLowerCase().includes(q) ||
                 (v.format||"").toLowerCase().includes(q) ||
                 (v.address||"").toLowerCase().includes(q))) return false;
      return true;
    });
    if (sort === "flag")   out.sort((a,b) => Number(b.flagship) - Number(a.flagship) || (b.rating||0)-(a.rating||0));
    if (sort === "rating") out.sort((a,b) => (b.rating||0) - (a.rating||0));
    if (sort === "name")   out.sort((a,b) => (a.name||"").localeCompare(b.name||"", "uk"));
    return out;
  }, [venues, query, cat, district, sort]);

  const visible = filtered.slice(0, page * PAGE);

  if (!venues || !cats) return <Loading lang={lang}/>;

  return (
    <div style={{ padding: "0 18px 24px", fontFamily: font.body, color: colors.text }}>
      <div style={{ paddingTop: 6 }}>
        <h1 style={{ fontFamily: font.display, fontSize: 26, fontWeight: 800, margin: "4px 0 4px" }}>
          {dict.explore.title}
        </h1>
        <p style={{ color: colors.textDim, fontSize: 13, margin: 0 }}>{dict.explore.sub}</p>
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginTop: 16 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: colors.textDim }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={dict.explore.search}
          style={{
            width:"100%", boxSizing:"border-box", padding: "12px 12px 12px 38px",
            borderRadius: radius.md, border: `1px solid ${colors.border}`,
            background: colors.surface, color: colors.text, fontSize: 14,
            fontFamily: font.body, outline: "none",
          }}
        />
      </div>

      {/* Category pills */}
      <div style={{ display:"flex", gap:6, overflowX:"auto", marginTop:14, paddingBottom:6, scrollbarWidth:"none" }}>
        <Pill active={cat==="all"} onClick={()=>setCat("all")}>{lang==="uk"?"Усі":"All"} · {venues.length}</Pill>
        {cats.map(c => (
          <Pill key={c.id} active={cat===c.id} accent={catColor[c.id]} onClick={()=>setCat(cat===c.id?"all":c.id)}>
            {c.ic} {lang==="uk"?c.uk:c.en}
          </Pill>
        ))}
      </div>

      {/* District + Sort */}
      <div style={{ display:"flex", gap:8, marginTop:10, flexWrap:"wrap" }}>
        <Select value={district} onChange={setDistrict} label={dict.explore.filterDistrict}>
          <option value="all">{lang==="uk"?"Усі райони":"All districts"}</option>
          {districts.map(d => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select value={sort} onChange={setSort} label={dict.explore.sortBy}>
          <option value="flag">{dict.explore.sortFlag}</option>
          <option value="rating">{dict.explore.sortRating}</option>
          <option value="name">{dict.explore.sortName}</option>
        </Select>
      </div>

      <div style={{ color: colors.textDim, fontSize: 12, margin: "14px 0 10px" }}>
        {filtered.length.toLocaleString()} {lang==="uk"?"місць":"places"}
      </div>

      {/* List */}
      {visible.length === 0
        ? <div style={{ padding:"40px 0", textAlign:"center", color: colors.textDim }}>{dict.explore.noResults}</div>
        : <div style={{ display:"flex", flexDirection:"column", gap: 10 }}>
            {visible.map(v => (
              <VenueCard key={v.id} venue={v} lang={lang} dict={dict} onClick={()=>setSelected(v)}/>
            ))}
          </div>
      }

      {visible.length < filtered.length && (
        <button onClick={()=>setPage(p=>p+1)} style={{
          marginTop:16, width:"100%", padding:"12px 16px", borderRadius:14,
          background: colors.surface2, border:`1px solid ${colors.border}`,
          color: colors.text, fontFamily: font.body, fontWeight:600, fontSize:13, cursor:"pointer",
        }}>
          {lang==="uk"?"Показати ще":"Show more"} ({filtered.length - visible.length})
        </button>
      )}

      <VenueSheet venue={selected} lang={lang} dict={dict} onClose={()=>setSelected(null)}/>
    </div>
  );
}

function Pill({ active, accent, onClick, children }) {
  const c = accent || colors.primary;
  return (
    <button onClick={onClick} style={{
      padding:"7px 14px", borderRadius:999, whiteSpace:"nowrap",
      background: active ? c + "22" : colors.surface2,
      border: `1px solid ${active ? c + "66" : colors.border}`,
      color: active ? c : colors.text, fontFamily: font.body,
      fontSize: 12, fontWeight: 600, cursor:"pointer", flexShrink:0,
    }}>{children}</button>
  );
}

function Select({ value, onChange, label, children }) {
  return (
    <label style={{ position:"relative", flex:"1 1 140px" }}>
      <span style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", color: colors.textMute, fontSize:11, pointerEvents:"none" }}>{label}:</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          width:"100%", paddingLeft: `calc(${label.length}ch + 24px)`, padding:"10px 12px",
          borderRadius: 12, border: `1px solid ${colors.border}`,
          background: colors.surface, color: colors.text, fontSize: 13,
          fontFamily: font.body, outline:"none", appearance:"none",
          paddingRight: 28,
        }}
      >{children}</select>
    </label>
  );
}

function Loading({ lang }) {
  return (
    <div style={{ padding:"60px 20px", textAlign:"center", color: colors.textDim }}>
      <div style={{ fontSize: 28, marginBottom: 10, animation:"pulse 1.4s infinite" }}>✨</div>
      {lang === "uk" ? "Завантаження..." : "Loading..."}
    </div>
  );
}
