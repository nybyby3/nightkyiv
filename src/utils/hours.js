// Best-effort "is this place open right now" — parses the messy Ukrainian
// hours strings in the dataset. Examples it has to deal with:
//
//   "Пн–Нд: 07:00–21:00"
//   "Пн–Пт 16-23\nСр-Нд 18-23"
//   "Щодня 10:00-22:00"
//   "Daily"
//   "24/7"
//   "Нд-Чт 18-2\nПт-Сб 18-4"
//   "Reservation"
//
// Returns null if we can't parse it confidently.

const DAY_MAP = {
  "пн":0, "вт":1, "ср":2, "чт":3, "пт":4, "сб":5, "нд":6,
  "пн.":0,"вт.":1,"ср.":2,"чт.":3,"пт.":4,"сб.":5,"нд.":6,
  "mon":0,"tue":1,"wed":2,"thu":3,"fri":4,"sat":5,"sun":6,
};

function dayIdx(s) { return DAY_MAP[s.toLowerCase().replace(/[.\s]/g, "")]; }

function parseTimeRange(str) {
  // Match "07:00-21:00" or "16-23" or "07:00–21:00"
  const m = str.match(/(\d{1,2})(?::(\d{2}))?\s*[-–—]\s*(\d{1,2})(?::(\d{2}))?/);
  if (!m) return null;
  const sh = +m[1], sm = m[2] ? +m[2] : 0;
  const eh = +m[3], em = m[4] ? +m[4] : 0;
  return [sh*60 + sm, eh*60 + em];
}

function parseDayRange(token) {
  // "Пн–Нд", "Пт-Сб", "Пн", "Daily"
  const t = token.toLowerCase().replace(/[.\s]/g, "");
  if (t === "daily" || t === "щодня" || t === "everyday") return [0,1,2,3,4,5,6];
  const m = t.match(/([а-яa-z]+)[-–—]?([а-яa-z]+)?/i);
  if (!m) return null;
  const a = dayIdx(m[1]);
  if (a == null) return null;
  if (!m[2]) return [a];
  const b = dayIdx(m[2]); if (b == null) return null;
  const days = [];
  for (let i = a; i !== b; i = (i+1) % 7) days.push(i);
  days.push(b);
  return days;
}

export function isOpenNow(hours, now = new Date()) {
  if (!hours) return null;
  const h = hours.trim();
  if (/24\s*\/\s*7/.test(h)) return true;

  const today = (now.getDay() + 6) % 7; // make Monday=0
  const minutesNow = now.getHours()*60 + now.getMinutes();

  const lines = h.split(/\n|;/).map(s => s.trim()).filter(Boolean);
  let saw = false;
  for (const line of lines) {
    const sep = line.match(/^([^0-9:]+?)\s*[: ]\s*(.+)$/) || line.match(/^([^0-9:]+)$/);
    if (!sep) continue;
    const daysPart = sep[1];
    const timesPart = sep[2] || "";
    const range = parseTimeRange(timesPart);
    if (!range) continue;
    const days = parseDayRange(daysPart);
    if (!days) continue;
    saw = true;
    if (!days.includes(today)) continue;
    let [s, e] = range;
    // Overnight (e.g., 18-2 means 18:00–02:00 next day).
    if (e < s) e += 24*60;
    const m = minutesNow + (minutesNow < s && e > 24*60 ? 24*60 : 0);
    if (m >= s && m <= e) return true;
  }
  return saw ? false : null;
}
