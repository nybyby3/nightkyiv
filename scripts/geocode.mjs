// Geocoder for NightKyiv venues using OpenStreetMap Nominatim.
// Reads src/data/venues.json, queries Nominatim 1 address/second (per their
// usage policy), and writes src/data/coords.json keyed by full address.
//
//   node scripts/geocode.mjs           # do every venue (long)
//   node scripts/geocode.mjs --flagship # only the ~250 flagships (fast)
//
// Safe to interrupt — already-geocoded addresses are skipped on next run.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..");
const VENUES_PATH = join(ROOT, "src/data/venues.json");
const COORDS_PATH = join(ROOT, "src/data/coords.json");
const ONLY_FLAGSHIP = process.argv.includes("--flagship");

const venues = JSON.parse(readFileSync(VENUES_PATH, "utf-8"));
const coords = existsSync(COORDS_PATH)
  ? JSON.parse(readFileSync(COORDS_PATH, "utf-8"))
  : {};

const targets = venues.filter(v => {
  if (ONLY_FLAGSHIP && !v.flagship) return false;
  if (!v.address) return false;
  if (coords[v.address]) return false;
  return true;
});

console.log(`To geocode: ${targets.length} addresses (already done: ${Object.keys(coords).length})`);

const sleep = ms => new Promise(r => setTimeout(r, ms));

let ok = 0, miss = 0;
for (let i = 0; i < targets.length; i++) {
  const v = targets[i];
  const q = `${v.address}, ${v.district || ""}, Київ, Україна`.replace(/,\s*,/g, ",");
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "NightKyiv/2.0 (geocoder, contact via app)" },
    });
    const j = await res.json();
    if (Array.isArray(j) && j[0]) {
      coords[v.address] = [parseFloat(j[0].lat), parseFloat(j[0].lon)];
      ok++;
    } else {
      coords[v.address] = null;
      miss++;
    }
  } catch (e) {
    console.warn("err", q, e.message);
  }
  if (i % 20 === 0) {
    writeFileSync(COORDS_PATH, JSON.stringify(coords, null, 0));
    console.log(`  ${i+1}/${targets.length}  ✓${ok} ✗${miss}`);
  }
  await sleep(1100);  // Nominatim policy: max 1 req/s
}

writeFileSync(COORDS_PATH, JSON.stringify(coords, null, 0));
console.log(`Done. Found ${ok}, missed ${miss}. coords.json updated.`);
