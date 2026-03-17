import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/layout/Header';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';

function getTier(points: number) {
  if (points >= 1000) return 'Gold';
  if (points >= 500) return 'Silver';
  return 'Bronze';
}

function getTierColor(points: number) {
  if (points >= 1000) return Colors.accentCaramel;
  if (points >= 500) return Colors.softMocha;
  return Colors.mutedGold;
}

/** Simple visual QR code placeholder — 5×5 grid of squares */
function QRPlaceholder({ value }: { value: string }) {
  const seed = value.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const cells = Array.from({ length: 25 }, (_, i) => ((seed * (i + 7)) % 3 !== 0));

  return (
    <View style={qrStyles.grid}>
      {/* Corner markers */}
      <View style={[qrStyles.corner, qrStyles.topLeft]} />
      <View style={[qrStyles.corner, qrStyles.topRight]} />
      <View style={[qrStyles.corner, qrStyles.bottomLeft]} />
      {cells.map((filled, i) => (
        <View key={i} style={[qrStyles.cell, filled && qrStyles.cellFilled]} />
      ))}
    </View>
  );
}

const qrStyles = StyleSheet.create({
  grid: {
    width: 180,
    height: 180,
    flexDirection: 'row',
    flexWrap: 'wrap',
    position: 'relative',
    padding: 12,
    gap: 3,
  },
  cell: {
    width: 26,
    height: 26,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  cellFilled: { backgroundColor: Colors.darkEspresso },
  corner: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 6,
    borderWidth: 4,
    borderColor: Colors.darkEspresso,
  },
  topLeft: { top: 8, left: 8 },
  topRight: { top: 8, right: 8 },
  bottomLeft: { bottom: 8, left: 8 },
});

export default function ScanScreen() {
  const { t, isRTL } = useTranslation();
  const { user, profile } = useAuthStore();

  const points = profile?.points ?? 0;
  const tier = getTier(points);
  const tierColor = getTierColor(points);
  const memberId = user?.id?.slice(0, 8).toUpperCase() ?? 'GUEST';

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title={t.scan.title} showBack isRTL={isRTL} />
        <View style={styles.guestContainer}>
          <MaterialIcons name="qr-code" size={64} color={Colors.softMocha} />
          <Text style={styles.guestTitle}>{t.scan.title}</Text>
          <Text style={styles.guestSubtitle}>{t.scan.subtitle}</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signInBtnText}>{t.auth.signIn}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={t.scan.title} showBack isRTL={isRTL} />

      <View style={styles.container}>
        {/* Loyalty Card */}
        <View style={styles.card}>
          {/* Card header */}
          <View style={[styles.cardHeader, isRTL && styles.rtl]}>
            <View>
              <Text style={styles.cafeName}>Lava Cafe</Text>
              <Text style={styles.cardTitle}>{t.scan.myCard}</Text>
            </View>
            <View style={[styles.tierPill, { backgroundColor: tierColor + '30' }]}>
              <MaterialIcons name="star" size={14} color={tierColor} />
              <Text style={[styles.tierText, { color: tierColor }]}>{tier}</Text>
            </View>
          </View>

          {/* QR Code */}
          <View style={styles.qrContainer}>
            <QRPlaceholder value={user.id} />
          </View>

          {/* Card footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>{t.scan.memberId}</Text>
              <Text style={styles.footerValue}>{memberId}</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>{t.scan.points}</Text>
              <Text style={styles.footerValue}>{points.toLocaleString()}</Text>
            </View>
            <View style={styles.footerDivider} />
            <View style={styles.footerItem}>
              <Text style={styles.footerLabel}>{t.scan.tierLabel}</Text>
              <Text style={[styles.footerValue, { color: tierColor }]}>{tier}</Text>
            </View>
          </View>
        </View>

        {/* Tip */}
        <View style={styles.tipBox}>
          <MaterialIcons name="info-outline" size={18} color={Colors.primaryBrown} />
          <Text style={styles.tipText}>{t.scan.scanTip}</Text>
        </View>

        {/* View Rewards Button */}
        <TouchableOpacity
          style={styles.rewardsBtn}
          onPress={() => // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push('/rewards' as any)}
          activeOpacity={0.8}
        >
          <MaterialIcons name="card-giftcard" size={20} color={Colors.white} />
          <Text style={styles.rewardsBtnText}>{t.rewards.availableRewards}</Text>
          <MaterialIcons name={isRTL ? 'chevron-left' : 'chevron-right'} size={20} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Spacing[6],
    paddingHorizontal: Spacing[5],
    gap: Spacing[5],
  },

  // Loyalty Card
  card: {
    width: '100%',
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: Spacing[5],
    paddingBottom: Spacing[3],
  },
  rtl: { flexDirection: 'row-reverse' },
  cafeName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.white,
  },
  cardTitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.warmBeige,
    marginTop: 2,
  },
  tierPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
  },
  tierText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
  },
  qrContainer: {
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing[5],
    borderRadius: Radius.lg,
    paddingVertical: Spacing[3],
  },
  cardFooter: {
    flexDirection: 'row',
    padding: Spacing[5],
    paddingTop: Spacing[4],
  },
  footerItem: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  footerDivider: {
    width: 1,
    backgroundColor: Colors.primaryBrown,
    opacity: 0.4,
  },
  footerLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.warmBeige,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  footerValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.white,
  },

  // Tip
  tipBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.accentCaramel + '15',
    padding: Spacing[3],
    borderRadius: Radius.md,
    width: '100%',
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentCaramel,
  },
  tipText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // Rewards button
  rewardsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryBrown,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[3],
    gap: Spacing[2],
    width: '100%',
    justifyContent: 'center',
  },
  rewardsBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
    flex: 1,
    textAlign: 'center',
  },

  // Guest state
  guestContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
    gap: Spacing[4],
  },
  guestTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  guestSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  signInBtn: {
    backgroundColor: Colors.primaryBrown,
    paddingHorizontal: Spacing[8],
    paddingVertical: Spacing[3],
    borderRadius: Radius.full,
    marginTop: Spacing[2],
  },
  signInBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
});
