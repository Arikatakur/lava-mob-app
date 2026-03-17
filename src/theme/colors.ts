/**
 * Lava Cafe — Centralized Color System
 * All colors derived from the Lava Cafe brand palette.
 * Do NOT hardcode colors in components — use this file.
 */

export const Colors = {
  // Backgrounds
  backgroundPrimary: '#F7F3EE',
  backgroundSecondary: '#EFE7DD',

  // Surfaces
  surface: '#FFFDFC',
  surfaceCard: '#FFFDFC',

  // Brand Browns
  primaryBrown: '#6F4E37',
  darkEspresso: '#3B2A22',
  softMocha: '#9C7A5B',

  // Warm Tones
  warmBeige: '#DCC3A5',
  accentCaramel: '#C68A52',
  mutedGold: '#BFA17A',

  // Text
  textPrimary: '#2F241E',
  textSecondary: '#6E5A4B',
  textMuted: '#9C7A5B',
  textInverse: '#FFFDFC',

  // Border & Divider
  border: '#E6D8C8',
  divider: '#E6D8C8',

  // Semantic
  success: '#4F7A57',
  error: '#B85C4B',
  warning: '#C68A52',
  info: '#4E8D7C',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',

  // Overlays
  overlayDark: 'rgba(47, 36, 30, 0.6)',
  overlayLight: 'rgba(247, 243, 238, 0.85)',

  // Skeleton
  skeletonBase: '#EFE7DD',
  skeletonHighlight: '#F7F3EE',
} as const;

export type ColorKey = keyof typeof Colors;
