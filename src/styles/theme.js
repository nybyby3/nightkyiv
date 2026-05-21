// Design tokens for NightKyiv.
// Keep colors/spacing here so the whole app stays consistent.

export const colors = {
  bg:        "#0a0814",            // app background
  bgGrad:    "linear-gradient(170deg,#0a0814 0%,#15122a 45%,#1a1333 100%)",
  surface:   "rgba(255,255,255,0.04)",
  surface2:  "rgba(255,255,255,0.07)",
  border:    "rgba(255,255,255,0.08)",
  borderHi:  "rgba(162,89,255,0.35)",
  text:      "#e8e6f0",
  textDim:   "#8b86a3",
  textMute:  "#5a576d",
  primary:   "#a259ff",
  primary2:  "#6c3ecf",
  primaryGrad: "linear-gradient(135deg,#a259ff,#6c3ecf)",
  accent:    "#ff6bca",
  cyan:      "#4fc3f7",
  cinema:    "#f7b731",
  success:   "#3ecf8e",
  warn:      "#ff9f43",
  danger:    "#ff6b6b",
};

// Per-category colors — match categories.json ids
export const catColor = {
  sport:         "#4fc3f7",
  nature:        "#3ecf8e",
  culture:       "#a259ff",
  nightlife:     "#ff6bca",
  food:          "#ff6b6b",
  entertainment: "#ff9f43",
  dance:         "#36d1c4",
  hobby:         "#f7b731",
  cinema:        "#f7b731",
};

export const radius = {
  sm: 8, md: 12, lg: 16, xl: 22, pill: 999,
};

export const font = {
  display: "'Outfit',-apple-system,BlinkMacSystemFont,sans-serif",
  body:    "'DM Sans',-apple-system,BlinkMacSystemFont,sans-serif",
};

// Mobile-app-feeling container: bottom nav floats, safe areas respected.
export const layout = {
  maxWidth: 480,
  navHeight: 70,
  headerHeight: 56,
  safeBottom: "env(safe-area-inset-bottom)",
  safeTop:    "env(safe-area-inset-top)",
};

// Common style blocks
export const card = {
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: radius.lg,
  padding: 16,
};

export const cardHi = {
  ...card,
  background: "rgba(162,89,255,0.06)",
  border: `1px solid ${colors.borderHi}`,
};

export const btn = {
  primary: {
    background: colors.primaryGrad,
    color: "#fff",
    border: "none",
    borderRadius: radius.md,
    padding: "12px 20px",
    fontFamily: font.body,
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
    boxShadow: "0 4px 16px rgba(162,89,255,0.35)",
  },
  ghost: {
    background: colors.surface2,
    color: colors.text,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: "12px 20px",
    fontFamily: font.body,
    fontWeight: 500,
    fontSize: 14,
    cursor: "pointer",
  },
};
