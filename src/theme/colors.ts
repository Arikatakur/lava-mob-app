/**
 * Lava Cafe — Centralized Color System
 * Green brand identity — fresh, premium, and natural.
 * Do NOT hardcode colors in components — use this file.
 */

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────
  backgroundPrimary: '#F8F6F1',      // warm cream canvas
  backgroundSecondary: '#E8F0E4',    // light sage tint

  // ── Surfaces ─────────────────────────────────────────────
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',

  // ── Brand Greens ─────────────────────────────────────────
  primaryBrown: '#5E7F57',           // primary Lava green (key kept for compatibility)
  darkEspresso: '#3F5F3B',           // deep green
  softMocha: '#A9BEA1',              // soft sage

  // ── Warm Accents ─────────────────────────────────────────
  warmBeige: '#C8D8C3',              // muted sage-warm
  accentCaramel: '#C9A66B',          // gold accent
  mutedGold: '#B89A5E',              // muted gold

  // ── Text ─────────────────────────────────────────────────
  textPrimary: '#243121',            // deep forest text
  textSecondary: '#5E6B57',          // mid-tone green-grey
  textMuted: '#7A8F63',              // muted olive
  textInverse: '#FFFFFF',

  // ── Border & Divider ─────────────────────────────────────
  border: '#D9E4D3',
  divider: '#D9E4D3',

  // ── Semantic ─────────────────────────────────────────────
  success: '#4D7C4A',
  error: '#B85C4B',
  warning: '#C9A66B',
  info: '#4E8D7C',

  // ── Utility ──────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ── Overlays ─────────────────────────────────────────────
  overlayDark: 'rgba(36, 49, 33, 0.62)',
  overlayLight: 'rgba(232, 240, 228, 0.88)',

  // ── Skeleton ─────────────────────────────────────────────
  skeletonBase: '#E0EBD9',
  skeletonHighlight: '#F0F5EC',
} as const;

export type ColorKey = keyof typeof Colors;
