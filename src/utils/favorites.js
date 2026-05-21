// Persistent "saved places" list — survives reloads via localStorage.
// All consumers subscribe to changes so the heart icon updates instantly
// anywhere in the app when toggled.

import { get, set } from "./storage.js";

const KEY = "favorites";
const listeners = new Set();

let cache = null;
function read() {
  if (cache == null) cache = new Set(get(KEY, []));
  return cache;
}

export function getFavorites() { return Array.from(read()); }
export function isFavorite(id) { return read().has(id); }

export function toggleFavorite(id) {
  const s = read();
  if (s.has(id)) s.delete(id); else s.add(id);
  set(KEY, Array.from(s));
  listeners.forEach(fn => fn(Array.from(s)));
  return s.has(id);
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Convenience React hook.
import { useEffect, useState } from "react";
export function useFavorites() {
  const [ids, setIds] = useState(() => getFavorites());
  useEffect(() => subscribe(setIds), []);
  return ids;
}
