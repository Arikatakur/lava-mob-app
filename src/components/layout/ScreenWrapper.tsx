import React from 'react';
import { View, StyleSheet, ViewStyle, StatusBar, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../../theme';

interface ScreenWrapperProps {
  children: React.ReactNode;
  style?: ViewStyle;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  backgroundColor?: string;
}

export function ScreenWrapper({
  children,
  style,
  edges = ['top', 'left', 'right'],
  backgroundColor = Colors.backgroundPrimary,
}: ScreenWrapperProps) {
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor }]} edges={edges}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={backgroundColor}
        translucent={false}
      />
      <View style={[styles.content, style]}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 90,
  },
});
