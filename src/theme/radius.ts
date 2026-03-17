/**
 * Lava Cafe — Border Radius System
 * Extracted from Figma: 2, 8, 12, 14, 20, 22, 100px
 */

export const Radius = {
  xs: 2,
  sm: 8,
  md: 12,
  lg: 14,
  xl: 20,
  '2xl': 22,
  full: 100,
} as const;

export type RadiusKey = keyof typeof Radius;
