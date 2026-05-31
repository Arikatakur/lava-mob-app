import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../theme';

interface CategoryChipProps {
  label: string;
  isSelected: boolean;
  onPress: () => void;
  iconName?: string;
}

export function CategoryChip({ label, isSelected, onPress, iconName }: CategoryChipProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      style={[styles.chip, isSelected && styles.chipSelected]}
    >
      {iconName && (
        <View style={[styles.iconWrap, isSelected && styles.iconWrapSelected]}>
          <MaterialIcons
            name={iconName as keyof typeof MaterialIcons.glyphMap}
            size={16}
            color={isSelected ? Colors.white : Colors.primaryBrown}
          />
        </View>
      )}
      <Text
        style={[styles.label, isSelected && styles.labelSelected]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    height: 40,
    borderRadius: Radius['2xl'],
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing[1.5],
  },
  chipSelected: {
    backgroundColor: Colors.primaryBrown,
    borderColor: Colors.primaryBrown,
  },
  iconWrap: {
    width: 24,
    height: 24,
    borderRadius: Radius.full,
    backgroundColor: Colors.warmBeige,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapSelected: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  label: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  labelSelected: {
    color: Colors.white,
  },
});
