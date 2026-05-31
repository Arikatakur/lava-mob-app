import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontFamily, FontSize, LetterSpacing, Radius, Spacing } from '../../theme';

type BadgeVariant = 'new' | 'bestseller' | 'hot' | 'sale' | 'gold';

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

const variantColors: Record<BadgeVariant, { bg: string; text: string }> = {
  new: { bg: Colors.info, text: Colors.white },
  bestseller: { bg: Colors.accentCaramel, text: Colors.white },
  hot: { bg: Colors.error, text: Colors.white },
  sale: { bg: Colors.success, text: Colors.white },
  gold: { bg: Colors.mutedGold, text: Colors.darkEspresso },
};

export function Badge({ label, variant = 'new', style }: BadgeProps) {
  const { bg, text } = variantColors[variant];
  return (
    <View style={[styles.badge, { backgroundColor: bg }, style]}>
      <Text style={[styles.label, { color: text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: Radius.full,
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: LetterSpacing.wide,
  },
});
