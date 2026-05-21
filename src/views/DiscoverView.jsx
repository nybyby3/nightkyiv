import { useEffect, useMemo, useState } from "react";
import { colors, radius, font, catColor } from "../styles/theme.js";
import { loadVenues, loadCategories } from "../utils/data.js";
import { useFavorites } from "../utils/favorites.js";
import VenueCard from "../components/VenueCard.jsx";
import VenueSheet from "../components/VenueSheet.jsx";
import { SkeletonList } from "../components/Skeleton.jsx";

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
  const [surpriseSeed, setSurpriseSeed] = useState(0);
  const favs = useFavorites();

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

  // Surprise me — pick 3 random flagships from the current mood (or all).
  const surprises = useMemo(() => {
    if (!venues || !surpriseSeed) return [];
    const pool = venues.filter(v =>
      v.flagship && (mood == null || MOOD_TO_CATS[mood].includes(v.category))
    );
    return shuffle(pool, surpriseSeed).slice(0, 3);
  }, [venues, mood, surpriseSeed]);

  const savedVenues = useMemo(() => {
    if (!venues || favs.length === 0) return [];
    const set = new Set(favs);
    return venues.filter(v => set.has(v.id));
  }, [venues, favs]);

  function reset() { setMood(null); setCat(null); setSub(null); setSurpriseSeed(0); }

  return (
    <div style={{ padding: "0 18px 24px", fontFamily: font.body, color: colors.text }}>
      <Hero lang={lang} dict={dict} totalVenues={venues?.length || 0} />

      {/* Saved section — only renders when user has any saved */}
      {!mood && !cat && savedVenues.length > 0 && (
        <Step title={`♥ ${dict.discover.saved}`}>
          <div style={{ display:"flex", gap:10, overflowX:"auto", paddingBottom:6, scrollbarWidth:"none" }}>
            {savedVenues.slice(0, 12).map(v => (
              <div key={v.id} style={{ flex:"0 0 240px" }}>
                <VenueCard venue={v} lang={lang} dict={dict} onClick={() => setSelected(v)}/>
              </div>
            ))}
          </div>
        </Step>
      )}

      {/* Surprise me — surfaces only on the home screen and after mood */}
      {!cat && (
        <div style={{ marginTop: 18 }}>
          <button
            onClick={() => setSurpriseSeed(Date.now())}
            style={{
              width:"100%", padding:"14px 18px", borderRadius: radius.lg,
              background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              border:"none", color:"#fff", fontFamily: font.body,
              fontSize: 14, fontWeight: 700, cursor:"pointer",
              boxShadow:`0 6px 20px ${colors.primary}55`,
            }}
          >{dict.discover.surprise}</button>
        </div>
      )}

      {/* Surprise results */}
      {surprises.length > 0 && (
        <div style={{ marginTop: 14, display:"flex", flexDirection:"column", gap:10 }}>
          {surprises.map(v => (
            <VenueCard key={v.id} venue={v} lang={lang} dict={dict} onClick={() => setSelected(v)}/>
          ))}
        </div>
      )}

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
            {!venues && <SkeletonList count={4}/>}
            {venues && results.length === 0 && (
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
    <div style={{ paddingTop: 6, position:"relative" }}>
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

      {/* Kyiv night silhouette */}
      <div style={{ position:"relative", height: 84, marginTop: 14, opacity: 0.9 }}>
        <svg viewBox="0 0 600 90" preserveAspectRatio="xMidYMax slice" style={{ position:"absolute", inset:0, width:"100%", height:"100%" }}>
          <defs>
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={colors.primary} stopOpacity="0.18"/>
              <stop offset="1" stopColor={colors.primary} stopOpacity="0"/>
            </linearGradient>
            <linearGradient id="city" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={colors.primary}/>
              <stop offset="1" stopColor={colors.primary2}/>
            </linearGradient>
          </defs>
          <rect width="600" height="90" fill="url(#sky)"/>
          {/* Stars */}
          {Array.from({ length: 24 }).map((_, i) => {
            const x = (i * 47) % 600;
            const y = (i * 13) % 40 + 4;
            const r = i % 5 === 0 ? 1.5 : 0.8;
            return <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.45 + (i % 5) * 0.1}/>;
          })}
          {/* Far skyline */}
          <path d="M0,90 L0,70 L30,70 L40,60 L60,60 L70,50 L90,50 L100,68 L130,68 L135,52 L150,52 L155,45 L170,45 L180,60 L200,60 L210,55 L240,55 L250,42 L268,42 L275,55 L310,55 L320,38 L340,38 L350,55 L380,55 L390,48 L420,48 L430,60 L460,60 L470,40 L490,40 L500,55 L520,55 L535,48 L560,48 L575,58 L600,58 L600,90 Z" fill="url(#city)" opacity="0.45"/>
          {/* Near skyline + Lavra dome silhouette */}
          <path d="M0,90 L0,80 L40,80 L55,72 L75,72 L80,65 L100,65 L110,75 L130,75 L135,68 L160,68 L170,78 L195,78 L200,64 L215,64 L225,70 L245,70
                   M260,70 Q272,55 285,70
                   L298,70 L305,62 L325,62 L335,72 L365,72 L370,66 L395,66 L405,76 L440,76 L450,68 L475,68 L488,76 L515,76 L525,70 L555,70 L568,78 L600,78 L600,90 Z" fill="url(#city)" opacity="0.85"/>
          {/* Window lights */}
          {Array.from({ length: 16 }).map((_, i) => {
            const x = (i * 39 + 12) % 600;
            const y = 72 + (i % 3) * 4;
            return <rect key={i} x={x} y={y} width="1.5" height="2" fill="#ffe27a" opacity="0.85"/>;
          })}
        </svg>
      </div>
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

// Deterministic shuffle: same seed -> same order.
function shuffle(arr, seed) {
  const a = arr.slice();
  let s = seed | 0;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
