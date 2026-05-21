// Tiny localStorage wrapper that is safe on iOS PWA / Capacitor.

const PREFIX = "nk:";

export function get(key, fallback = null) {
  try {
    const v = localStorage.getItem(PREFIX + key);
    return v == null ? fallback : JSON.parse(v);
  } catch { return fallback; }
}

export function set(key, value) {
  try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch {}
}

export function remove(key) {
  try { localStorage.removeItem(PREFIX + key); } catch {}
}
