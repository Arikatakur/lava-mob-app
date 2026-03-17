import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors, FontFamily, FontSize, Spacing } from '../../theme';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  isRTL?: boolean;
  backgroundColor?: string;
}

export function Header({
  title,
  showBack = false,
  rightAction,
  isRTL = false,
  backgroundColor = Colors.backgroundPrimary,
}: HeaderProps) {
  return (
    <View style={[styles.header, { backgroundColor }, isRTL && styles.rtl]}>
      {showBack ? (
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <MaterialIcons
            name={isRTL ? 'chevron-right' : 'chevron-left'}
            size={28}
            color={Colors.textPrimary}
          />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}

      {title && (
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      )}

      <View style={styles.rightSlot}>
        {rightAction ?? <View style={styles.placeholder} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[2],
  },
  rtl: {
    flexDirection: 'row-reverse',
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  rightSlot: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    width: 44,
  },
});
