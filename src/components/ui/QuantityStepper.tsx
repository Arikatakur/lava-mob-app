import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from '../../theme';

interface QuantityStepperProps {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  min?: number;
  max?: number;
  size?: 'sm' | 'md';
}

export function QuantityStepper({
  value,
  onIncrement,
  onDecrement,
  min = 1,
  max = 99,
  size = 'md',
}: QuantityStepperProps) {
  const isSmall = size === 'sm';
  const btnSize = isSmall ? 28 : 36;
  const fontSize = isSmall ? FontSize.base : FontSize.lg;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onDecrement}
        disabled={value <= min}
        style={[
          styles.button,
          { width: btnSize, height: btnSize },
          value <= min && styles.buttonDisabled,
        ]}
      >
        <MaterialIcons name="remove" size={isSmall ? 16 : 20} color={Colors.primaryBrown} />
      </TouchableOpacity>

      <Text style={[styles.value, { fontSize, minWidth: isSmall ? 24 : 32 }]}>
        {value}
      </Text>

      <TouchableOpacity
        onPress={onIncrement}
        disabled={value >= max}
        style={[
          styles.button,
          styles.buttonPrimary,
          { width: btnSize, height: btnSize },
          value >= max && styles.buttonDisabled,
        ]}
      >
        <MaterialIcons name="add" size={isSmall ? 16 : 20} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  button: {
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  buttonPrimary: {
    backgroundColor: Colors.primaryBrown,
    borderColor: Colors.primaryBrown,
    ...Shadows.sm,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  value: {
    fontFamily: FontFamily.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
