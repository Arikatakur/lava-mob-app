import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../theme';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
}

export function CategoryChip({ label, isSelected, onPress }: CategoryChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, isSelected && styles.chipSelected]}
    >
      <Text style={[styles.label, isSelected && styles.labelSelected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginHorizontal: Spacing[1],
    ...Shadows.xs,
  },
  chipSelected: {
    backgroundColor: Colors.primaryBrown,
    borderColor: Colors.primaryBrown,
    ...Shadows.sm,
  },
  label: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
    letterSpacing: 0.2,
  },
});
