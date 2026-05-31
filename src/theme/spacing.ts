/**
 * Lava Cafe — Spacing System
 * Consistent 4-point grid spacing extracted from Figma layout analysis.
 */

export const Spacing = {
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

export type SpacingKey = keyof typeof Spacing;

// Semantic spacing aliases
export const Layout = {
  screenPaddingHorizontal: Spacing[4],  // 16px
  screenPaddingVertical: Spacing[6],    // 24px
  cardPadding: Spacing[4],              // 16px
  sectionGap: Spacing[8],              // 32px
  itemGap: Spacing[3],                  // 12px
  cardGap: Spacing[3],                  // 12px gap between cards (grid + carousel)
  iconSize: Spacing[6],                 // 24px
  avatarSize: Spacing[12],             // 48px
  bottomTabHeight: 72,
  headerHeight: 56,
} as const;
