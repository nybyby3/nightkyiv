import { useEffect, useMemo, useState } from "react";
import { colors, radius, font } from "../styles/theme.js";
import { loadRecipes, loadCategories } from "../utils/data.js";
import { SkeletonList } from "../components/Skeleton.jsx";

export default function CookView({ lang, dict }) {
  const [recipes, setRecipes] = useState(null);
  const [subs, setSubs]       = useState(null);
  const [sub, setSub]         = useState("all");
  const [query, setQuery]     = useState("");
  const [open, setOpen]       = useState(null);

  useEffect(() => { loadRecipes().then(setRecipes); }, []);
  useEffect(() => { loadCategories().then(c => setSubs(c.recipes)); }, []);

  const filtered = useMemo(() => {
    if (!recipes) return [];
    const q = query.trim().toLowerCase();
    return recipes.filter(r => {
      if (sub !== "all" && r.subcategory !== sub) return false;
      if (q && !((r.name||"").toLowerCase().includes(q) || (r.country||"").toLowerCase().includes(q))) return false;
      return true;
    });
  }, [recipes, sub, query]);

  if (!recipes || !subs) return (
    <div style={{ padding:"0 18px 24px" }}>
      <div style={{ paddingTop: 14, marginBottom: 12 }}>
        <div style={{ height: 24, width: "55%", background: colors.surface2, borderRadius: 6, marginBottom: 8 }}/>
        <div style={{ height: 12, width: "75%", background: colors.surface2, borderRadius: 6 }}/>
      </div>
      <SkeletonList count={4}/>
    </div>
  );

  return (
    <div style={{ padding:"0 18px 24px", color: colors.text, fontFamily: font.body }}>
      <div style={{ paddingTop: 6 }}>
        <h1 style={{ fontFamily: font.display, fontSize:26, fontWeight:800, margin:"4px 0 4px" }}>{dict.cook.title}</h1>
        <p style={{ fontSize:13, color: colors.textDim, margin:0 }}>{dict.cook.sub}</p>
      </div>

      <div style={{ position:"relative", marginTop: 14 }}>
        <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", color: colors.textDim }}>🔍</span>
        <input
          value={query} onChange={e => setQuery(e.target.value)}
          placeholder={lang==="uk"?"Шукати рецепт або кухню...":"Search recipe or cuisine..."}
          style={{
            width:"100%", boxSizing:"border-box", padding:"12px 12px 12px 38px",
            borderRadius: radius.md, border:`1px solid ${colors.border}`,
            background: colors.surface, color: colors.text, fontSize: 14, outline:"none",
          }}
        />
      </div>

      <div style={{ display:"flex", gap:6, overflowX:"auto", marginTop: 12, paddingBottom: 6, scrollbarWidth:"none" }}>
        <Pill active={sub==="all"} onClick={()=>setSub("all")}>{lang==="uk"?"Усі":"All"} · {recipes.length}</Pill>
        {subs.map(s => {
          const count = recipes.filter(r => r.subcategory === s.id).length;
          return <Pill key={s.id} active={sub===s.id} onClick={()=>setSub(s.id===sub?"all":s.id)}>{s.ic} {lang==="uk"?s.uk:s.en} · {count}</Pill>;
        })}
      </div>

      <div style={{ color: colors.textDim, fontSize:12, margin:"14px 0 10px" }}>
        {filtered.length} {lang==="uk"?"рецептів":"recipes"}
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {filtered.slice(0, 100).map(r => (
          <RecipeCard key={r.id} r={r} lang={lang} dict={dict} onOpen={() => setOpen(r)} />
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign:"center", color: colors.textDim, padding:"30px 0" }}>
            {lang==="uk"?"Нічого не знайшли":"Nothing found"}
          </div>
        )}
      </div>

      {open && <RecipeSheet r={open} lang={lang} dict={dict} onClose={() => setOpen(null)} />}
    </div>
  );
}

function difficultyColor(d) {
  const s = (d||"").toLowerCase();
  if (s.startsWith("лёг") || s.startsWith("лег") || s.startsWith("easy")) return colors.success;
  if (s.startsWith("сред") || s.startsWith("сер") || s.startsWith("med"))  return colors.warn;
  if (s.startsWith("слож") || s.startsWith("склад") || s.startsWith("hard")) return colors.danger;
  return colors.textDim;
}

function RecipeCard({ r, onOpen }) {
  return (
    <button onClick={onOpen} style={{
      textAlign:"left", padding:14, borderRadius: radius.lg,
      background: colors.surface, border:`1px solid ${colors.border}`,
      color: colors.text, fontFamily: font.body, cursor:"pointer",
      display:"flex", flexDirection:"column", gap:6,
    }}>
      <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
        {r.country && <span style={{ fontSize:11, color: colors.textDim }}>{r.country}</span>}
        {r.difficulty && <span style={{
          fontSize:10, fontWeight:700, color: difficultyColor(r.difficulty),
          padding:"2px 8px", borderRadius: 6,
          background: difficultyColor(r.difficulty) + "22",
        }}>{r.difficulty}</span>}
        {r.time && <span style={{ fontSize:11, color: colors.textDim }}>⏱ {r.time}</span>}
        {r.servings && <span style={{ fontSize:11, color: colors.textDim }}>👥 {r.servings}</span>}
      </div>
      <div style={{ fontFamily: font.display, fontWeight:700, fontSize: 16, lineHeight:1.25 }}>{r.name}</div>
      {r.category && <div style={{ fontSize: 12, color: colors.textDim }}>{r.category}</div>}
    </button>
  );
}

function RecipeSheet({ r, lang, dict, onClose }) {
  return (
    <div onClick={onClose} style={{
      position:"fixed", inset:0, background:"rgba(5,3,10,0.7)",
      backdropFilter:"blur(6px)", zIndex:100,
      display:"flex", alignItems:"flex-end", justifyContent:"center",
    }}>
      <div onClick={e=>e.stopPropagation()} style={{
        width:"100%", maxWidth:480, maxHeight:"88vh", overflowY:"auto",
        background: colors.bg, color: colors.text,
        borderTopLeftRadius: radius.xl, borderTopRightRadius: radius.xl,
        border: `1px solid ${colors.border}`, padding:"14px 18px 32px",
      }}>
        <div style={{ width:40, height:4, borderRadius:2, background: colors.border, margin:"0 auto 14px" }}/>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:12 }}>
          <div>
            <div style={{ fontSize: 11, color: colors.textDim }}>{[r.country, r.category].filter(Boolean).join(" · ")}</div>
            <h2 style={{ fontFamily: font.display, fontSize: 22, fontWeight:800, margin:"4px 0", lineHeight:1.2 }}>{r.name}</h2>
            <div style={{ display:"flex", gap:8, marginTop:4, flexWrap:"wrap" }}>
              {r.difficulty && <span style={{ fontSize:11, fontWeight:700, color: difficultyColor(r.difficulty),padding:"3px 8px",borderRadius:6, background: difficultyColor(r.difficulty)+"22"}}>{r.difficulty}</span>}
              {r.time && <span style={{ fontSize:11, color: colors.textDim }}>⏱ {r.time}</span>}
              {r.servings && <span style={{ fontSize:11, color: colors.textDim }}>👥 {r.servings}</span>}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: colors.surface2, border:`1px solid ${colors.border}`,
            color: colors.text, width:32, height:32, borderRadius:16, cursor:"pointer", fontSize:16, fontWeight:600,
          }}>×</button>
        </div>

        {r.ingredients && <Sec title={dict.cook.ingredients}>{r.ingredients}</Sec>}
        {r.equipment   && <Sec title={dict.cook.equipment}>{r.equipment}</Sec>}
        {r.steps       && <Sec title={dict.cook.steps}>{r.steps}</Sec>}
        {r.tips        && <Sec title={dict.cook.tips}>{r.tips}</Sec>}
      </div>
    </div>
  );
}

function Sec({ title, children }) {
  return (
    <div style={{ marginTop: 18 }}>
      <div style={{ fontSize:11, color: colors.textMute, fontWeight:700, letterSpacing:0.6, textTransform:"uppercase", marginBottom:6 }}>{title}</div>
      <pre style={{ whiteSpace:"pre-wrap", fontFamily:"inherit", margin:0, fontSize:13.5, lineHeight:1.6, color: colors.text }}>{children}</pre>
    </div>
  );
}

function Pill({ active, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding:"7px 14px", borderRadius:999, whiteSpace:"nowrap",
      background: active ? colors.primary + "22" : colors.surface2,
      border: `1px solid ${active ? colors.borderHi : colors.border}`,
      color: active ? colors.primary : colors.text,
      fontFamily: font.body, fontSize: 12, fontWeight: 600, cursor:"pointer", flexShrink:0,
    }}>{children}</button>
  );
}
