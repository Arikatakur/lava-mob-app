import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../../src/theme';

export default function OrderSuccess() {
  const { t } = useTranslation();
  const { profile } = useAuthStore();
  const { orderId, orderNumber, pointsEarned } = useLocalSearchParams<{
    orderId: string;
    orderNumber: string;
    pointsEarned: string;
  }>();

  const pts = pointsEarned ? parseInt(pointsEarned, 10) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {/* Success Icon */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <MaterialIcons name="check" size={52} color={Colors.success} />
          </View>
          <View style={styles.coffeeDot1} />
          <View style={styles.coffeeDot2} />
          <View style={styles.coffeeDot3} />
        </View>

        {/* Text */}
        <Text style={styles.title}>{t.orderSuccess.title}</Text>
        <Text style={styles.subtitle}>{t.orderSuccess.subtitle}</Text>

        {/* Order Number */}
        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>{t.orderSuccess.orderNumber}</Text>
          <Text style={styles.orderNumber}>{orderNumber}</Text>
        </View>

        {/* Points earned — shown for signed-in users */}
        {pts !== null && pts > 0 && (
          <View style={styles.pointsCard}>
            <MaterialIcons name="star" size={22} color={Colors.accentCaramel} />
            <View style={styles.pointsCardText}>
              <Text style={styles.pointsEarnedLabel}>{t.orderSuccess.pointsEarned}</Text>
              <Text style={styles.pointsEarnedValue}>+{pts} pts</Text>
            </View>
            {profile?.points !== undefined && (
              <View style={styles.balanceSection}>
                <Text style={styles.balanceLabel}>{t.orderSuccess.newBalance}</Text>
                <Text style={styles.balanceValue}>{profile.points} pts</Text>
              </View>
            )}
          </View>
        )}

        {/* Estimated Time */}
        <View style={styles.timeCard}>
          <MaterialIcons name="schedule" size={20} color={Colors.accentCaramel} />
          <Text style={styles.timeText}>~10-15 min</Text>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            label={t.orderSuccess.backHome}
            onPress={() => router.navigate('/(tabs)/home')}
            fullWidth
            size="lg"
          />
          {orderId && (
            <Button
              label={t.orderSuccess.trackOrder}
              onPress={() => router.replace(`/orders/${orderId}` as never)}
              variant="secondary"
              fullWidth
              size="lg"
              style={{ marginTop: Spacing[3] }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[8],
    position: 'relative',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.success + '30',
  },
  coffeeDot1: {
    position: 'absolute',
    top: 5,
    right: -5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.accentCaramel,
  },
  coffeeDot2: {
    position: 'absolute',
    bottom: 10,
    left: -8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.mutedGold,
  },
  coffeeDot3: {
    position: 'absolute',
    top: 20,
    left: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warmBeige,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing[8],
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[8],
    paddingVertical: Spacing[4],
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing[4],
    width: '100%',
  },
  orderLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[1],
  },
  orderNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.primaryBrown,
    letterSpacing: 1,
  },
  pointsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accentCaramel + '15',
    borderRadius: Radius.lg,
    padding: Spacing[4],
    width: '100%',
    gap: Spacing[3],
    marginBottom: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.accentCaramel + '40',
  },
  pointsCardText: { flex: 1 },
  pointsEarnedLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
  },
  pointsEarnedValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.accentCaramel,
  },
  balanceSection: { alignItems: 'flex-end' },
  balanceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  balanceValue: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.primaryBrown,
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    marginBottom: Spacing[8],
  },
  timeText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.accentCaramel,
  },
  actions: {
    width: '100%',
  },
});
