import { useEffect, useMemo, useState } from "react";
import { colors, radius, font, catColor } from "../styles/theme.js";
import { loadVenues, loadCategories } from "../utils/data.js";
import VenueCard from "../components/VenueCard.jsx";
import VenueSheet from "../components/VenueSheet.jsx";

// Hand-picked mapping of moods -> categories. Drives the filter logic
// once the user has picked a vibe.
const MOOD_TO_CATS = {
  active: ["sport", "entertainment", "dance"],
  chill:  ["nature", "culture", "food", "hobby"],
  social: ["nightlife", "food", "entertainment", "dance"],
  solo:   ["culture", "nature", "hobby"],
};

export default function DiscoverView({ lang, dict, onOpenExplore }) {
  const [venues, setVenues] = useState(null);
  const [cats, setCats]     = useState(null);
  const [mood, setMood]     = useState(null);   // mood id
  const [cat, setCat]       = useState(null);   // top-level category id
  const [sub, setSub]       = useState(null);   // subcategory id
  const [selected, setSelected] = useState(null); // venue for sheet

  useEffect(() => { loadVenues().then(setVenues); }, []);
  useEffect(() => { loadCategories().then(c => setCats(c.venues)); }, []);

  const visibleCats = useMemo(() => {
    if (!cats) return [];
    if (!mood) return cats;
    return cats.filter(c => MOOD_TO_CATS[mood].includes(c.id));
  }, [cats, mood]);

  const subs = useMemo(() => {
    if (!cat || !cats) return [];
    return cats.find(c => c.id === cat)?.subs || [];
  }, [cat, cats]);

  const results = useMemo(() => {
    if (!venues || !cat) return [];
    return venues
      .filter(v => v.category === cat && (!sub || v.subcategory === sub))
      .sort((a,b) => Number(b.flagship) - Number(a.flagship) || (b.rating||0) - (a.rating||0))
      .slice(0, 60);
  }, [venues, cat, sub]);

  function reset() { setMood(null); setCat(null); setSub(null); }

  return (
    <div style={{ padding: "0 18px 24px", fontFamily: font.body, color: colors.text }}>
      <Hero lang={lang} dict={dict} totalVenues={venues?.length || 0} />

      {/* Breadcrumb (back / reset) */}
      {(mood || cat || sub) && (
        <div style={{ display:"flex", gap:10, marginTop:14, flexWrap:"wrap" }}>
          <button onClick={() => { if (sub) setSub(null); else if (cat) setCat(null); else setMood(null); }}
            style={chipBtn(false)}>{dict.discover.back}</button>
          <button onClick={reset} style={chipBtn(false)}>↺ {dict.discover.reset}</button>
        </div>
      )}

      {/* Step 1 — mood */}
      {!mood && (
        <Step title={dict.discover.stepMood}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {dict.discover.moods.map(m => (
              <MoodCard key={m.id} m={m} onClick={() => setMood(m.id)} />
            ))}
          </div>
        </Step>
      )}

      {/* Step 2 — top category */}
      {mood && !cat && (
        <Step title={dict.discover.stepCat}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            {visibleCats.map(c => (
              <CategoryCard key={c.id} c={c} lang={lang} onClick={() => setCat(c.id)} />
            ))}
          </div>
        </Step>
      )}

      {/* Step 3 — subcategory chips + results */}
      {cat && (
        <Step title={dict.discover.stepSub}>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:14, scrollbarWidth:"none" }}>
            <button onClick={() => setSub(null)} style={chipBtn(sub === null, catColor[cat])}>
              {lang === "uk" ? "Усі" : "All"} · {results.length}
            </button>
            {subs.map(s => {
              const count = venues?.filter(v => v.category === cat && v.subcategory === s.id).length || 0;
              return (
                <button key={s.id} onClick={() => setSub(s.id === sub ? null : s.id)}
                  style={chipBtn(sub === s.id, catColor[cat])}>
                  {s.ic} {lang === "uk" ? s.uk : s.en} · {count}
                </button>
              );
            })}
          </div>

          <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
            {results.length === 0 && (
              <div style={{ color: colors.textDim, padding: "30px 0", textAlign:"center" }}>
                {lang === "uk" ? "Тут ще нічого немає" : "Nothing here yet"}
              </div>
            )}
            {results.map(v => (
              <VenueCard key={v.id} venue={v} lang={lang} dict={dict} onClick={() => setSelected(v)} />
            ))}
          </div>

          {results.length >= 60 && (
            <button
              onClick={() => onOpenExplore({ category: cat, subcategory: sub })}
              style={{
                marginTop:14, width:"100%", padding:"12px 16px", borderRadius:14,
                background: colors.surface2, border:`1px solid ${colors.border}`,
                color: colors.text, fontFamily: font.body, fontWeight:600, fontSize:13,
                cursor:"pointer",
              }}
            >{dict.discover.seeAll} →</button>
          )}
        </Step>
      )}

      <VenueSheet venue={selected} lang={lang} dict={dict} onClose={() => setSelected(null)} />
    </div>
  );
}

/* — sub components — */

function Hero({ lang, dict, totalVenues }) {
  return (
    <div style={{ paddingTop: 6 }}>
      <div style={{ color: colors.textDim, fontSize: 14, marginBottom: 2 }}>{dict.greeting()},</div>
      <h1 style={{
        fontFamily: font.display, fontWeight: 800, fontSize: 32, lineHeight: 1.05,
        margin: "2px 0 6px", letterSpacing: -0.5,
        background: "linear-gradient(135deg,#fff 0%,#c4b5fd 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {dict.discover.heroTitle}
      </h1>
      <p style={{ color: colors.textDim, fontSize: 13, margin: 0 }}>
        {dict.discover.heroSub(totalVenues)}
      </p>
    </div>
  );
}

function Step({ title, children }) {
  return (
    <div style={{ marginTop: 22 }}>
      <h2 style={{ fontFamily: font.display, fontSize: 18, fontWeight: 700, margin: "0 0 12px" }}>{title}</h2>
      {children}
    </div>
  );
}

function MoodCard({ m, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: colors.surface2, border: `1px solid ${colors.border}`,
      borderRadius: radius.lg, padding: "16px 14px", textAlign: "left",
      color: colors.text, fontFamily: font.body, cursor: "pointer",
      display: "flex", flexDirection: "column", gap: 6, minHeight: 110,
      transition: "transform 0.15s, border-color 0.15s",
    }}>
      <div style={{ fontSize: 26 }}>{m.ic}</div>
      <div style={{ fontWeight: 700, fontSize: 15 }}>{m.label}</div>
      <div style={{ fontSize: 12, color: colors.textDim }}>{m.sub}</div>
    </button>
  );
}

function CategoryCard({ c, lang, onClick }) {
  const col = catColor[c.id] || colors.primary;
  return (
    <button onClick={onClick} style={{
      background: `linear-gradient(155deg, ${col}22, ${col}08)`,
      border: `1px solid ${col}33`, borderRadius: radius.lg,
      padding: "16px 14px", textAlign: "left", color: colors.text,
      fontFamily: font.body, cursor: "pointer", minHeight: 110,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div style={{ fontSize: 30 }}>{c.ic}</div>
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{lang === "uk" ? c.uk : c.en}</div>
        <div style={{ fontSize: 11, color: col, fontWeight: 600, marginTop: 4 }}>
          {c.subs.length} {lang === "uk" ? "напрямків" : "subcategories"}
        </div>
      </div>
    </button>
  );
}

function chipBtn(active, accent) {
  const c = accent || colors.primary;
  return {
    padding: "7px 14px", borderRadius: 999, whiteSpace: "nowrap",
    background: active ? c + "22" : colors.surface2,
    border: `1px solid ${active ? c + "66" : colors.border}`,
    color: active ? c : colors.text, fontFamily: font.body,
    fontSize: 12, fontWeight: 600, cursor: "pointer", flexShrink: 0,
  };
}
