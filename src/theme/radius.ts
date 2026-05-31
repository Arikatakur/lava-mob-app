/**
 * Lava Cafe — Border Radius System
 * Extracted from Figma: 2, 8, 12, 14, 20, 22, 100px
 */

export const Radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  full: 100,
} as const;

export type RadiusKey = keyof typeof Radius;
