/**
 * Sukar Helo — Gradient System
 * Warm chocolate-inspired gradient definitions.
 * Use with expo-linear-gradient or as reference for background layers.
 */

export const Gradients = {
  // ── Brand Gradients ───────────────────────────────────────
  darkChocolate: {
    colors: ['#3D1C02', '#6B3318'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  milkChocolate: {
    colors: ['#7B4A2D', '#A0623C'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  caramelGold: {
    colors: ['#D4A843', '#B8874A'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },
  warmCream: {
    colors: ['#FDF8F0', '#F5ECD7'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  // ── Hero / Banner Gradients ───────────────────────────────
  heroChocolate: {
    colors: ['#3D1C02', '#7B4A2D', '#C8A882'],
    start: { x: 0, y: 1 },
    end: { x: 1, y: 0 },
  },
  heroCream: {
    colors: ['rgba(253,248,240,0)', 'rgba(253,248,240,0.85)', '#FDF8F0'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },

  // ── Card Gradients ────────────────────────────────────────
  cardOverlay: {
    colors: ['rgba(44,26,14,0)', 'rgba(44,26,14,0.72)'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
  loyaltyCard: {
    colors: ['#3D1C02', '#5C2A0A'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // ── Subtle Background Gradient ────────────────────────────
  pageBackground: {
    colors: ['#FDF8F0', '#F5ECD7'],
    start: { x: 0, y: 0 },
    end: { x: 0, y: 1 },
  },
} as const;

export type GradientKey = keyof typeof Gradients;
