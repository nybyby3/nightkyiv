import { useEffect, useMemo, useRef, useState } from "react";
import { colors, radius, font, catColor } from "../styles/theme.js";
import { loadVenues, loadCategories, loadCoords, getCoords, distanceKm } from "../utils/data.js";
import VenueSheet from "../components/VenueSheet.jsx";

const KYIV = [50.4501, 30.5234];

export default function MapView({ lang, dict }) {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);
  const userCircle = useRef(null);

  const [venues, setVenues] = useState(null);
  const [cats, setCats]     = useState(null);
  const [coords, setCoords] = useState({});
  const [activeCats, setActiveCats] = useState(null); // null = all
  const [onlyFlag, setOnlyFlag] = useState(true);     // start with flagships
  const [userLoc, setUserLoc]   = useState(null);
  const [selected, setSelected] = useState(null);
  const [sheet, setSheet]       = useState(null);

  const [ready, setReady] = useState(false); // map instance ready

  useEffect(() => { loadVenues().then(setVenues); }, []);
  useEffect(() => { loadCategories().then(c => setCats(c.venues)); }, []);
  useEffect(() => { loadCoords().then(setCoords); }, []);

  // Initialise Leaflet map. We retry until both window.L and the DOM
  // container are present — the container can appear later if a parent
  // conditionally renders us, and Leaflet from the CDN can arrive late on
  // a cold load.
  useEffect(() => {
    if (mapRef.current) return; // already initialised
    let cancelled = false;
    function tryInit() {
      if (cancelled || mapRef.current) return;
      if (!mapEl.current || !window.L) {
        setTimeout(tryInit, 80);
        return;
      }
      const m = window.L.map(mapEl.current, {
        zoomControl: false, attributionControl: false,
      }).setView(KYIV, 12);
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
      }).addTo(m);
      window.L.control.zoom({ position: "bottomright" }).addTo(m);
      mapRef.current = m;
      setReady(true);
      // Resize fix — sometimes the container's final size isn't known yet.
      setTimeout(() => m.invalidateSize(), 250);
    }
    tryInit();
    return () => { cancelled = true; };
  });

  // Compute markers based on filters.
  const visible = useMemo(() => {
    if (!venues) return [];
    return venues.filter(v => {
      if (onlyFlag && !v.flagship) return false;
      if (activeCats && !activeCats.has(v.category)) return false;
      if (!v.address && !v.district) return false;
      return true;
    });
  }, [venues, onlyFlag, activeCats]);

  // Render markers — depends on `ready` so it waits until the map exists.
  useEffect(() => {
    if (!ready) return;
    const m = mapRef.current; if (!m || !window.L) return;
    if (layerRef.current) m.removeLayer(layerRef.current);
    const group = window.L.layerGroup().addTo(m);
    layerRef.current = group;

    visible.forEach(v => {
      const [lat, lng] = getCoords(v, coords);
      const col = catColor[v.category] || colors.primary;
      const isSel = selected?.id === v.id;
      const size = isSel ? 38 : v.flagship ? 30 : 24;
      const icon = window.L.divIcon({
        className: "nk-marker",
        html: `<div style="width:${size}px;height:${size}px;border-radius:50%;background:${col};display:flex;align-items:center;justify-content:center;font-size:${isSel?18:13}px;border:2px solid ${isSel ? "#fff" : col+"aa"};box-shadow:0 0 0 4px ${col}22,0 2px 8px rgba(0,0,0,0.55);cursor:pointer;transition:all 0.15s">${v.flagship ? "🏆" : ""}</div>`,
        iconSize: [size, size], iconAnchor: [size/2, size/2],
      });
      const mk = window.L.marker([lat, lng], { icon }).addTo(group);
      mk.on("click", () => {
        setSelected(v);
        m.flyTo([lat, lng], Math.max(m.getZoom(), 14), { duration: 0.45 });
      });
    });
  }, [visible, selected, ready, coords]);

  // Geolocation
  function locate() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(p => {
      const here = [p.coords.latitude, p.coords.longitude];
      setUserLoc(here);
      const m = mapRef.current; if (!m || !window.L) return;
      if (userCircle.current) m.removeLayer(userCircle.current);
      userCircle.current = window.L.circle(here, {
        radius: 3000, color: colors.primary, fillColor: colors.primary,
        fillOpacity: 0.08, weight: 1.5,
      }).addTo(m);
      m.flyTo(here, 14, { duration: 0.8 });
    });
  }

  // Closest 12 in sidebar — always returns [{ v, d }] so the consumer can
  // destructure `v` consistently. When the user hasn't shared location yet,
  // `d` is null and we just show the first 12 visible venues.
  const nearest = useMemo(() => {
    if (!visible.length) return [];
    if (!userLoc) return visible.slice(0, 12).map(v => ({ v, d: null }));
    return visible
      .map(v => ({ v, d: distanceKm(userLoc, getCoords(v, coords)) }))
      .sort((a,b) => a.d - b.d)
      .slice(0, 12);
  }, [visible, userLoc, coords]);

  const loading = !venues || !cats;

  return (
    <div style={{ position:"relative", height:"calc(100vh - 56px - 70px - 32px)", minHeight: 420, fontFamily: font.body }}>
      <div ref={mapEl} style={{ position:"absolute", inset:0, background: colors.bg }}/>
      {loading && (
        <div style={{
          position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center",
          background:"rgba(10,8,20,0.7)", backdropFilter:"blur(4px)", zIndex: 10,
          color: colors.textDim, fontSize: 13,
        }}>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontSize: 24, marginBottom: 8, animation:"pulse 1.4s infinite" }}>🗺️</div>
            {lang==="uk"?"Завантаження карти…":"Loading map…"}
          </div>
        </div>
      )}

      {/* Top-left: title chip */}
      <div style={{
        position:"absolute", top: 12, left: 12, right: 12, zIndex: 5,
        display:"flex", gap: 8, flexWrap: "wrap",
      }}>
        <Chip onClick={() => setOnlyFlag(!onlyFlag)} active={onlyFlag}>
          {onlyFlag ? "🏆" : "All"} {onlyFlag ? (lang==="uk"?"Лише флагмани":"Flagships only") : (lang==="uk"?"Усі":"Show all")}
        </Chip>
        {cats && cats.map(c => {
          const on = !activeCats || activeCats.has(c.id);
          return (
            <Chip key={c.id} accent={catColor[c.id]} active={on && !!activeCats} onClick={() => {
              setActiveCats(prev => {
                if (!cats) return prev;
                const set = new Set(prev || cats.map(x => x.id));
                if (set.has(c.id)) set.delete(c.id); else set.add(c.id);
                if (set.size === cats.length) return null;
                return set;
              });
            }}>
              {c.ic} {lang==="uk"?c.uk:c.en}
            </Chip>
          );
        })}
      </div>

      {/* Bottom-right: locate */}
      <button onClick={locate} style={{
        position:"absolute", right:12, bottom: 100, zIndex: 5,
        width:46, height:46, borderRadius:23, border:`1px solid ${colors.borderHi}`,
        background: colors.surface2, backdropFilter:"blur(8px)",
        color: colors.text, fontSize: 20, cursor:"pointer",
        boxShadow: "0 2px 10px rgba(0,0,0,0.5)",
      }} title={dict.map.myLocation}>📍</button>

      {/* Bottom carousel: nearest places */}
      <div style={{
        position:"absolute", left: 0, right: 0, bottom: 12, zIndex: 4,
        padding:"0 10px", display:"flex", gap: 10, overflowX:"auto",
        scrollbarWidth: "none",
      }}>
        {nearest.map(({ v, d }) => {
          const col = catColor[v.category] || colors.primary;
          return (
            <button key={v.id} onClick={() => { setSelected(v); setSheet(v); }} style={{
              flex:"0 0 220px", textAlign:"left", padding:"10px 12px",
              borderRadius: radius.lg, background: "rgba(10,8,20,0.85)",
              backdropFilter:"blur(10px)", border:`1px solid ${col}44`,
              color: colors.text, fontFamily: font.body, cursor:"pointer",
              display:"flex", flexDirection:"column", gap:4,
            }}>
              <div style={{ fontSize: 11, color: col, fontWeight:700 }}>{v.flagship ? "🏆 " : ""}{lang==="uk"?cats.find(c=>c.id===v.category)?.uk:cats.find(c=>c.id===v.category)?.en}</div>
              <div style={{ fontWeight: 700, fontSize: 13, lineHeight:1.3 }}>{v.name.slice(0, 50)}{v.name.length>50?"…":""}</div>
              <div style={{ fontSize: 11, color: colors.textDim }}>
                {v.district ? `${v.district} · ` : ""}
                {d != null ? `${d.toFixed(1)} km` : (v.rating != null ? `★ ${v.rating.toFixed(1)}` : "")}
              </div>
            </button>
          );
        })}
      </div>

      <VenueSheet venue={sheet} lang={lang} dict={dict} onClose={() => setSheet(null)}/>

      <style>{`
        .nk-marker { background:transparent !important; border:none !important; }
        .leaflet-control-zoom a { background:${colors.surface2} !important; color:${colors.text} !important; border-color:${colors.border} !important; backdrop-filter: blur(8px); }
        .leaflet-container { background:${colors.bg} !important; }
      `}</style>
    </div>
  );
}

function Chip({ children, active, onClick, accent }) {
  const c = accent || colors.primary;
  return (
    <button onClick={onClick} style={{
      padding:"6px 12px", borderRadius:999, whiteSpace:"nowrap",
      background: active ? c + "33" : "rgba(10,8,20,0.78)",
      border: `1px solid ${active ? c + "88" : colors.border}`,
      color: active ? "#fff" : colors.textDim, fontFamily: font.body,
      fontSize: 11.5, fontWeight: 600, cursor:"pointer", flexShrink:0,
      backdropFilter:"blur(10px)",
    }}>{children}</button>
  );
}
