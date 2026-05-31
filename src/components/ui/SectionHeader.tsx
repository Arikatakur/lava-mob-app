import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, FontFamily, FontSize, Spacing } from '../../theme';

interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
  isRTL?: boolean;
}

export function SectionHeader({ title, actionLabel, onAction, isRTL = false }: SectionHeaderProps) {
  return (
    <View style={[styles.container, isRTL && styles.rtl]}>
      <Text style={[styles.title, isRTL && styles.rtlText]}>{title}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction}>
          <Text style={styles.action}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  rtlText: { textAlign: 'right' },
  action: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.accentCaramel,
  },
});
