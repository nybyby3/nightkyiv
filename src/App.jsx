import { Suspense, lazy, useEffect, useState } from "react";
import { colors, font, layout } from "./styles/theme.js";
import { dict as DICT, LOCALES } from "./utils/i18n.js";
import { get as lsGet, set as lsSet } from "./utils/storage.js";
import Header from "./components/Header.jsx";
import BottomNav from "./components/BottomNav.jsx";

const DiscoverView = lazy(() => import("./views/DiscoverView.jsx"));
const ExploreView  = lazy(() => import("./views/ExploreView.jsx"));
const MapView      = lazy(() => import("./views/MapView.jsx"));
const CinemaView   = lazy(() => import("./views/CinemaView.jsx"));
const CookView     = lazy(() => import("./views/CookView.jsx"));

const PAGES = ["discover", "explore", "map", "cinema", "cook"];

export default function App() {
  const [lang, setLang] = useState(() => lsGet("lang", LOCALES.includes(navigator.language?.slice(0,2)) ? navigator.language.slice(0,2) : "uk"));
  const [page, setPage] = useState(() => {
    const hash = location.hash.replace("#", "");
    return PAGES.includes(hash) ? hash : "discover";
  });
  const [exploreInitial, setExploreInitial] = useState(null);
  const dict = DICT[lang] || DICT.uk;

  // Hash-based routing (works in Capacitor without a server).
  useEffect(() => { location.hash = page; }, [page]);
  useEffect(() => {
    const on = () => {
      const h = location.hash.replace("#", "");
      if (PAGES.includes(h)) setPage(h);
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);

  useEffect(() => { lsSet("lang", lang); }, [lang]);
  useEffect(() => { document.documentElement.lang = lang; }, [lang]);

  // Cross-view navigation helper (Discover -> Explore preserving filter).
  function openExplore(initial) {
    setExploreInitial(initial);
    setPage("explore");
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: colors.bgGrad,
      color: colors.text,
      fontFamily: font.body,
      maxWidth: layout.maxWidth,
      margin: "0 auto",
      position: "relative",
      paddingBottom: `calc(${layout.navHeight}px + ${layout.safeBottom})`,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* Subtle nebula in the top-right */}
      <div style={{
        position:"fixed", top:-140, right:-120, width:340, height:340,
        background:"radial-gradient(circle,rgba(162,89,255,0.16) 0%,transparent 70%)",
        borderRadius:"50%", pointerEvents:"none", zIndex:0, maxWidth: layout.maxWidth,
      }}/>

      <Header lang={lang} setLang={setLang} dict={dict} onLogoClick={() => setPage("discover")}/>

      <main style={{ position:"relative", zIndex:1, minHeight:"calc(100vh - 200px)" }}>
        <Suspense fallback={<Fallback lang={lang}/>}>
          {page === "discover" && <DiscoverView lang={lang} dict={dict} onOpenExplore={openExplore}/>}
          {page === "explore"  && <ExploreView lang={lang} dict={dict} initial={exploreInitial}/>}
          {page === "map"      && <MapView lang={lang} dict={dict}/>}
          {page === "cinema"   && <CinemaView lang={lang} dict={dict}/>}
          {page === "cook"     && <CookView lang={lang} dict={dict}/>}
        </Suspense>
      </main>

      <BottomNav page={page} setPage={setPage} dict={dict}/>

      <style>{`
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-thumb { background: rgba(162,89,255,0.3); border-radius:4px }
        body { overscroll-behavior-y: none }
      `}</style>
    </div>
  );
}

function Fallback({ lang }) {
  return (
    <div style={{ padding:"60px 20px", textAlign:"center", color: colors.textDim }}>
      <div style={{ fontSize: 28, marginBottom: 10, animation:"pulse 1.4s infinite" }}>✨</div>
      {lang === "uk" ? "Завантаження..." : "Loading..."}
    </div>
  );
}
