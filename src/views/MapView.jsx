import { useEffect, useMemo, useRef, useState } from "react";
import { colors, radius, font, catColor } from "../styles/theme.js";
import { loadVenues, loadCategories, loadCoords, getCoords, distanceKm } from "../utils/data.js";
import VenueSheet from "../components/VenueSheet.jsx";

const KYIV = [50.4501, 30.5234];

// Darken/lighten a hex colour by `percent` (negative darkens). Used to make
// the marker pins look slightly 3D.
function shade(hex, percent) {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0,2), 16);
  const g = parseInt(h.slice(2,4), 16);
  const b = parseInt(h.slice(4,6), 16);
  const t = percent / 100;
  const clamp = x => Math.max(0, Math.min(255, Math.round(x + (t > 0 ? (255 - x) * t : x * t))));
  return "#" + [clamp(r), clamp(g), clamp(b)].map(x => x.toString(16).padStart(2,"0")).join("");
}

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
      // CartoDB Voyager — bright, colourful, free, with pastel street colours
      // and clean labels. Matches the "city-explorer" aesthetic of CityPulse.
      window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png", {
        maxZoom: 19, subdomains: "abcd",
        attribution: '&copy; OpenStreetMap, &copy; CARTO',
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

    // Use markercluster if available (loaded from CDN). Falls back to a plain
    // layer group if for some reason it didn't load — still works.
    const group = window.L.markerClusterGroup
      ? window.L.markerClusterGroup({
          showCoverageOnHover: false,
          spiderfyOnMaxZoom: true,
          maxClusterRadius: 50,
          iconCreateFunction: (cluster) => {
            const count = cluster.getChildCount();
            const size = count < 10 ? 36 : count < 50 ? 44 : 54;
            return window.L.divIcon({
              className: "nk-cluster",
              html: `<div style="
                width:${size}px;height:${size}px;border-radius:50%;
                background: linear-gradient(135deg, ${colors.primary}, ${colors.accent});
                border: 3px solid #fff;
                box-shadow: 0 4px 14px rgba(0,0,0,0.3), 0 0 0 4px rgba(162,89,255,0.15);
                display:flex;align-items:center;justify-content:center;
                color:#fff;font-weight:700;font-size:${count < 100 ? 14 : 12}px;
                font-family:system-ui;
              ">${count}</div>`,
              iconSize: [size, size], iconAnchor: [size/2, size/2],
            });
          },
        })
      : window.L.layerGroup();
    group.addTo(m);
    layerRef.current = group;

    // Per-category emoji — matches categories.json.
    const catIcons = {
      sport:"🏋️", nature:"🌳", culture:"🎭", nightlife:"🌙",
      food:"🍽️", entertainment:"🎲", dance:"💃", hobby:"🎨",
    };
    const markers = [];
    visible.forEach(v => {
      const [lat, lng] = getCoords(v, coords);
      const col = catColor[v.category] || colors.primary;
      const isSel = selected?.id === v.id;
      const flag = v.flagship;
      const size = isSel ? 44 : flag ? 38 : 32;
      const emoji = catIcons[v.category] || "📍";
      // Bright pin: filled circle with thick white ring + soft drop shadow.
      // Flagships get a gold ring + tiny 🏆 corner badge.
      const html = `
        <div style="
          position:relative;width:${size}px;height:${size + 6}px;cursor:pointer;
          filter: drop-shadow(0 3px 5px rgba(0,0,0,0.32));
        ">
          <div style="
            position:absolute; left:0; top:0;
            width:${size}px; height:${size}px;
            border-radius:50%;
            background: radial-gradient(circle at 30% 30%, ${shade(col,15)} 0%, ${col} 65%, ${shade(col,-15)} 100%);
            border: 3px solid ${flag ? "#ffd24a" : "#fff"};
            display:flex; align-items:center; justify-content:center;
            font-size:${isSel?22:flag?19:16}px; line-height:1;
            ${isSel ? `box-shadow: 0 0 0 4px ${col}66;` : ""}
            ${flag ? `box-shadow: 0 0 0 2px #fff, 0 0 0 4px #ffd24a88;` : ""}
          ">${emoji}</div>
          ${flag ? `
          <div style="
            position:absolute; right:-3px; top:-3px;
            width:16px; height:16px; border-radius:50%;
            background:#ffd24a; border:2px solid #fff;
            display:flex; align-items:center; justify-content:center;
            font-size:9px; line-height:1;
          ">🏆</div>` : ""}
          <div style="
            position:absolute; left:50%; top:${size - 1}px;
            width:0; height:0;
            border-left: 6px solid transparent;
            border-right: 6px solid transparent;
            border-top: 8px solid ${flag ? "#ffd24a" : "#fff"};
            transform:translateX(-50%);
          "></div>
        </div>`;
      const icon = window.L.divIcon({
        className: "nk-marker",
        html,
        iconSize: [size, size + 6], iconAnchor: [size/2, size + 6],
      });
      const mk = window.L.marker([lat, lng], { icon });
      mk.on("click", () => {
        setSelected(v); setSheet(v);
        m.flyTo([lat, lng], Math.max(m.getZoom(), 15), { duration: 0.45 });
      });
      markers.push(mk);
    });
    if (group.addLayers) group.addLayers(markers);
    else markers.forEach(mk => mk.addTo(group));
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

      {/* Top filter bar */}
      <div style={{
        position:"absolute", top: 12, left: 12, right: 12, zIndex: 5,
        display:"flex", flexDirection:"column", gap: 8,
      }}>
        {/* Stats pill — total visible */}
        <div style={{ display:"flex", alignItems:"center", gap: 8 }}>
          <div style={{
            background:"#fff", color:"#2a2840",
            padding:"7px 14px", borderRadius: 999, fontSize: 12, fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.08)",
            display:"flex", alignItems:"center", gap: 6,
          }}>
            <span style={{ width:8, height:8, borderRadius:"50%", background: colors.primary }}/>
            {visible.length} {lang==="uk"?"місць":"places"}
          </div>
          <Chip onClick={() => setOnlyFlag(!onlyFlag)} active={onlyFlag} accent={"#ffd24a"}>
            🏆 {lang==="uk"?"Флагмани":"Flagships"}
          </Chip>
        </div>

        {/* Category chips — scroll horizontally on mobile */}
        <div style={{
          display:"flex", gap: 6, overflowX:"auto", paddingBottom: 4,
          scrollbarWidth:"none", marginLeft: -4, paddingLeft: 4, paddingRight: 4,
        }}>
          <Chip onClick={() => setActiveCats(null)} active={!activeCats}>
            {lang==="uk"?"Усі":"All"}
          </Chip>
          {cats && cats.map(c => {
            const isActive = activeCats?.has(c.id) || false;
            return (
              <Chip key={c.id} accent={catColor[c.id]} active={isActive} onClick={() => {
                setActiveCats(prev => {
                  const set = new Set(prev || []);
                  if (set.has(c.id)) set.delete(c.id); else set.add(c.id);
                  return set.size === 0 ? null : set;
                });
              }}>
                {c.ic} {lang==="uk"?c.uk:c.en}
              </Chip>
            );
          })}
        </div>
      </div>

      {/* Bottom-right: locate */}
      <button onClick={locate} style={{
        position:"absolute", right:12, bottom: 140, zIndex: 5,
        width:48, height:48, borderRadius:24, border:"none",
        background:"#fff",
        color: colors.primary, fontSize: 22, cursor:"pointer",
        boxShadow: "0 4px 16px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)",
        display:"flex", alignItems:"center", justifyContent:"center",
        transition:"transform 0.15s",
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
            <button key={v.id} onClick={() => {
              const [lat, lng] = getCoords(v, coords);
              setSelected(v); setSheet(v);
              if (mapRef.current) mapRef.current.flyTo([lat, lng], 15, { duration: 0.5 });
            }} style={{
              flex:"0 0 230px", textAlign:"left", padding:"12px 14px",
              borderRadius: 16, background: "#fff",
              border:"none",
              boxShadow: "0 4px 18px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1)",
              color: "#1a1a2e", fontFamily: font.body, cursor:"pointer",
              display:"flex", flexDirection:"column", gap:4,
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <span style={{
                  width:24, height:24, borderRadius:"50%", background: col,
                  display:"inline-flex", alignItems:"center", justifyContent:"center",
                  fontSize:13, color:"#fff",
                }}>{v.flagship ? "🏆" : ""}</span>
                <span style={{ fontSize: 10.5, color: col, fontWeight:700, letterSpacing:0.3, textTransform:"uppercase" }}>
                  {lang==="uk"?cats.find(c=>c.id===v.category)?.uk:cats.find(c=>c.id===v.category)?.en}
                </span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 13.5, lineHeight:1.3, color:"#1a1a2e" }}>{v.name.slice(0, 50)}{v.name.length>50?"…":""}</div>
              <div style={{ fontSize: 11, color:"#6b6782" }}>
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
        .nk-marker > div:hover > div:first-child { transform: translate(-50%,-50%) scale(1.12) !important; }
        .leaflet-control-zoom {
          margin: 0 12px 16px 0 !important;
          border-radius: 14px !important;
          overflow: hidden;
          box-shadow: 0 4px 16px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.1);
          border: none !important;
        }
        .leaflet-control-zoom a {
          background:#fff !important;
          color:#2a2840 !important;
          border:none !important;
          border-bottom: 1px solid rgba(0,0,0,0.06) !important;
          font-weight: 600;
          font-size: 18px;
        }
        .leaflet-control-zoom a:hover { background:#f5f3fa !important; }
        .leaflet-container { background:#f1efe8 !important; }
        .leaflet-tile { filter: saturate(1.05) brightness(1.02); }
      `}</style>
    </div>
  );
}

function Chip({ children, active, onClick, accent }) {
  const c = accent || colors.primary;
  return (
    <button onClick={onClick} style={{
      padding:"7px 13px", borderRadius:999, whiteSpace:"nowrap",
      background: active ? c : "#fff",
      border: `1.5px solid ${active ? c : "rgba(0,0,0,0.06)"}`,
      color: active ? "#fff" : "#2a2840", fontFamily: font.body,
      fontSize: 11.5, fontWeight: 700, cursor:"pointer", flexShrink:0,
      boxShadow: active
        ? `0 4px 14px ${c}55, 0 1px 2px rgba(0,0,0,0.1)`
        : "0 2px 8px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)",
      transition: "all 0.15s",
    }}>{children}</button>
  );
}
