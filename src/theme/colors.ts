/**
 * Sukar Helo — Centralized Color System
 * Rich chocolate & dessert aesthetic — warm, premium, and indulgent.
 * Do NOT hardcode colors in components — use this file.
 */

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────
  backgroundPrimary: '#FDF8F0',      // warm cream canvas
  backgroundSecondary: '#F5ECD7',    // soft caramel tint

  // ── Surfaces ─────────────────────────────────────────────
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',

  // ── Brand Chocolates ─────────────────────────────────────
  primaryBrown: '#7B4A2D',           // rich milk chocolate (primary brand)
  darkEspresso: '#3D1C02',           // dark chocolate / espresso
  softMocha: '#C8A882',              // warm mocha / latte

  // ── Warm Accents ─────────────────────────────────────────
  warmBeige: '#E8D5B5',              // warm biscuit beige
  accentCaramel: '#D4A843',          // gold caramel accent
  mutedGold: '#B8874A',              // warm bronze gold

  // ── Text ─────────────────────────────────────────────────
  textPrimary: '#2C1A0E',            // deep chocolate text
  textSecondary: '#6B4C2A',          // medium chocolate brown
  textMuted: '#9B7B5A',              // warm mocha muted
  textInverse: '#FFFFFF',

  // ── Border & Divider ─────────────────────────────────────
  border: '#E8D5B5',
  divider: '#EBD9BC',

  // ── Semantic ─────────────────────────────────────────────
  success: '#4D7C4A',
  error: '#B85C4B',
  warning: '#D4A843',
  info: '#7B9DBF',

  // ── Utility ──────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ── Overlays ─────────────────────────────────────────────
  overlayDark: 'rgba(44, 26, 14, 0.65)',
  overlayLight: 'rgba(253, 248, 240, 0.90)',

  // ── Skeleton ─────────────────────────────────────────────
  skeletonBase: '#ECD9BC',
  skeletonHighlight: '#F5ECD7',
} as const;

export type ColorKey = keyof typeof Colors;
