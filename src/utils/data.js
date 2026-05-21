// Lazy loaders for the three big JSON blobs.
// Each is cached after first call so views can re-use without re-parsing.

let venuesP = null, recipesP = null, categoriesP = null, coordsP = null;

export function loadVenues() {
  if (!venuesP) venuesP = import("../data/venues.json").then(m => m.default);
  return venuesP;
}
export function loadRecipes() {
  if (!recipesP) recipesP = import("../data/recipes.json").then(m => m.default);
  return recipesP;
}
export function loadCategories() {
  if (!categoriesP) categoriesP = import("../data/categories.json").then(m => m.default);
  return categoriesP;
}
// coords.json is optional — it's produced by scripts/geocode.mjs. If it's not
// present we silently degrade to district-anchor placement on the map.
export function loadCoords() {
  if (!coordsP) coordsP = import("../data/coords.json").then(m => m.default).catch(() => ({}));
  return coordsP;
}

// Haversine distance in km between two [lat,lng] pairs.
export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const la1 = (a[0] * Math.PI) / 180, la2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat/2)**2 + Math.cos(la1)*Math.cos(la2)*Math.sin(dLng/2)**2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// Coordinates for popular Kyiv landmarks — used as a fallback when an address
// has not yet been geocoded by the OSM script. Lets the map work day one.
// (Lat, Lng pairs from public sources.)
export const ANCHOR_COORDS = {
  "Печерський":    [50.4259, 30.5494],
  "Шевченківський":[50.4501, 30.5234],
  "Подільський":   [50.4664, 30.5183],
  "Голосіївський": [50.3899, 30.4855],
  "Дарницький":    [50.4116, 30.6422],
  "Деснянський":   [50.5119, 30.6051],
  "Дніпровський":  [50.4549, 30.6116],
  "Оболонський":   [50.5197, 30.4985],
  "Святошинський": [50.4598, 30.3678],
  "Солом'янський": [50.4254, 30.4486],
};

// Best-effort coordinate lookup: explicit coords -> geocoded coords from
// coords.json -> district anchor + jitter -> Kyiv centre.
export function getCoords(venue, coordsByAddress = {}) {
  if (venue.lat && venue.lng) return [venue.lat, venue.lng];
  const direct = coordsByAddress[venue.address];
  if (direct) return direct;
  const anchor = ANCHOR_COORDS[venue.district];
  if (anchor) {
    // Stable jitter (~150m) by hashing the venue id to avoid stacked markers.
    const seed = (venue.id || venue.name || "").split("").reduce((a,c)=>a+c.charCodeAt(0), 0);
    const jx = ((seed * 9301 + 49297) % 233280) / 233280 - 0.5;
    const jy = ((seed * 1597 + 51749) % 233280) / 233280 - 0.5;
    return [anchor[0] + jy * 0.018, anchor[1] + jx * 0.024];
  }
  return [50.4501, 30.5234]; // Maidan
}
