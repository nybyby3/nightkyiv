import { colors, radius } from "../styles/theme.js";

// Animated placeholder for content that's still loading. Used in place of
// "Loading…" text so the layout doesn't jump when data arrives.

export function SkeletonCard() {
  return (
    <div style={{
      background: colors.surface, border: `1px solid ${colors.border}`,
      borderRadius: radius.lg, padding: 14,
      display:"flex", flexDirection:"column", gap: 10,
    }}>
      <Bar w="40%" h={12}/>
      <Bar w="80%" h={18}/>
      <Bar w="95%" h={11}/>
      <Bar w="60%" h={11}/>
    </div>
  );
}

export function SkeletonList({ count = 5 }) {
  return (
    <div style={{ display:"flex", flexDirection:"column", gap: 10 }}>
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i}/>)}
    </div>
  );
}

function Bar({ w, h }) {
  return (
    <div className="nk-shimmer" style={{
      width: w, height: h, borderRadius: 6,
      background: `linear-gradient(90deg, ${colors.surface2} 0%, ${colors.border} 50%, ${colors.surface2} 100%)`,
      backgroundSize: "200% 100%",
      animation: "nk-shimmer 1.2s ease-in-out infinite",
    }}/>
  );
}
