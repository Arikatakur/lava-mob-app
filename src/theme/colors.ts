/**
 * Sukar Helo — Centralized Color System
 * Premium dessert shop aesthetic — soft, warm, and luxurious.
 */

export const Colors = {
  // ── Backgrounds ──────────────────────────────────────────
  backgroundPrimary: '#F8F4EE',      // soft cream canvas
  backgroundSecondary: '#EFE6DA',    // warm beige tint

  // ── Surfaces ─────────────────────────────────────────────
  surface: '#FFFFFF',
  surfaceCard: '#FFFFFF',

  // ── Brand Chocolates ─────────────────────────────────────
  primaryBrown: '#8B5A3C',           // chocolate brown (primary brand)
  darkEspresso: '#3D1C02',           // dark chocolate / espresso
  softMocha: '#C8A882',              // warm mocha / latte

  // ── Warm Accents ─────────────────────────────────────────
  softGold: '#D8B26E',               // soft gold accent
  warmBeige: '#EFE6DA',              // warm beige
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
  rating: '#D8B26E',                 // gold for stars

  // ── Utility ──────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // ── Overlays ─────────────────────────────────────────────
  overlayDark: 'rgba(44, 26, 14, 0.65)',
  overlayLight: 'rgba(248, 244, 238, 0.90)',
  glassmorphism: 'rgba(255, 255, 255, 0.20)',

  // ── Skeleton ─────────────────────────────────────────────
  skeletonBase: '#ECD9BC',
  skeletonHighlight: '#F5ECD7',
} as const;

export type ColorKey = keyof typeof Colors;
