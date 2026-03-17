import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/layout/Header';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useRewardsStore } from '../../src/store/useRewardsStore';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';
import type { Reward, PointTransaction } from '../../src/types';

const TIER_THRESHOLDS = { bronze: 0, silver: 500, gold: 1000 };

function getTier(points: number): 'bronze' | 'silver' | 'gold' {
  if (points >= TIER_THRESHOLDS.gold) return 'gold';
  if (points >= TIER_THRESHOLDS.silver) return 'silver';
  return 'bronze';
}

function getTierColor(tier: 'bronze' | 'silver' | 'gold'): string {
  if (tier === 'gold') return Colors.accentCaramel;
  if (tier === 'silver') return '#A8A8A8';
  return '#CD7F32';
}

function getNextTierPoints(points: number): { next: number; label: string } | null {
  if (points < TIER_THRESHOLDS.silver) return { next: TIER_THRESHOLDS.silver, label: 'Silver' };
  if (points < TIER_THRESHOLDS.gold) return { next: TIER_THRESHOLDS.gold, label: 'Gold' };
  return null;
}

function PointsHeaderCard({
  points,
  isRTL,
  t,
  onScan,
}: {
  points: number;
  isRTL: boolean;
  t: ReturnType<typeof useTranslation>['t'];
  onScan: () => void;
}) {
  const tier = getTier(points);
  const tierColor = getTierColor(tier);
  const nextTier = getNextTierPoints(points);
  const progress = nextTier
    ? Math.min(
        ((points - TIER_THRESHOLDS[tier]) /
          (nextTier.next - TIER_THRESHOLDS[tier])) *
          100,
        100,
      )
    : 100;

  return (
    <View style={styles.pointsCard}>
      <View style={styles.pointsCardBg} />
      <View style={[styles.pointsCardContent, isRTL && styles.rtl]}>
        <View>
          <Text style={styles.pointsLabel}>{t.rewards.myPoints}</Text>
          <Text style={styles.pointsNumber}>{points.toLocaleString()}</Text>
          <View style={[styles.tierBadge, { backgroundColor: tierColor + '30' }]}>
            <MaterialIcons name="star" size={13} color={tierColor} />
            <Text style={[styles.tierText, { color: tierColor }]}>
              {t.rewards[tier]}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={onScan}>
          <MaterialIcons name="qr-code-scanner" size={28} color={Colors.white} />
          <Text style={styles.scanBtnText}>{t.scan.title}</Text>
        </TouchableOpacity>
      </View>

      {nextTier && (
        <View style={styles.progressSection}>
          <View style={[styles.progressLabelRow, isRTL && styles.rtl]}>
            <Text style={styles.progressLabel}>{t.rewards.tierProgress}</Text>
            <Text style={styles.progressNextLabel}>
              {nextTier.next - points} {t.rewards.pointsToNext} {nextTier.label}
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` as `${number}%`, backgroundColor: tierColor }]} />
          </View>
        </View>
      )}

      {tier === 'gold' && (
        <View style={styles.goldBenefitRow}>
          <MaterialIcons name="stars" size={14} color={Colors.accentCaramel} />
          <Text style={styles.goldBenefitText}>{t.rewards.goldBenefit}</Text>
        </View>
      )}
    </View>
  );
}

function RewardCard({
  reward,
  userPoints,
  onRedeem,
  isRTL,
  t,
  localize,
}: {
  reward: Reward;
  userPoints: number;
  onRedeem: (reward: Reward) => void;
  isRTL: boolean;
  t: ReturnType<typeof useTranslation>['t'];
  localize: (obj: Record<string, unknown>, field: string) => string;
}) {
  const canRedeem = userPoints >= reward.points_required;

  return (
    <View style={[styles.rewardCard, !canRedeem && styles.rewardCardDimmed]}>
      {reward.image_url ? (
        <Image source={{ uri: reward.image_url }} style={styles.rewardImage} />
      ) : (
        <View style={[styles.rewardImage, styles.rewardImagePlaceholder]}>
          <MaterialIcons name="card-giftcard" size={32} color={Colors.accentCaramel} />
        </View>
      )}
      <View style={styles.rewardInfo}>
        <Text style={styles.rewardName} numberOfLines={2}>
          {localize(reward as unknown as Record<string, unknown>, 'name')}
        </Text>
        <Text style={styles.rewardDesc} numberOfLines={2}>
          {localize(reward as unknown as Record<string, unknown>, 'description')}
        </Text>
        <View style={[styles.rewardFooter, isRTL && styles.rtl]}>
          <View style={styles.pointsPill}>
            <MaterialIcons name="star" size={12} color={Colors.accentCaramel} />
            <Text style={styles.pointsPillText}>{reward.points_required} pts</Text>
          </View>
          <TouchableOpacity
            style={[styles.redeemBtn, !canRedeem && styles.redeemBtnDisabled]}
            onPress={() => canRedeem && onRedeem(reward)}
            activeOpacity={canRedeem ? 0.7 : 1}
          >
            <Text style={[styles.redeemBtnText, !canRedeem && styles.redeemBtnTextDisabled]}>
              {canRedeem ? t.rewards.redeem : t.rewards.notEnoughPoints}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function TransactionRow({
  tx,
  language,
  t,
}: {
  tx: PointTransaction;
  language: 'he' | 'en';
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const isPositive = tx.points > 0;
  const desc = language === 'he' ? tx.description_he : tx.description_en;
  const date = new Date(tx.created_at).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <View style={styles.txRow}>
      <View style={[styles.txIcon, { backgroundColor: isPositive ? Colors.success + '20' : Colors.error + '20' }]}>
        <MaterialIcons
          name={isPositive ? 'add-circle' : 'remove-circle'}
          size={20}
          color={isPositive ? Colors.success : Colors.error}
        />
      </View>
      <View style={styles.txInfo}>
        <Text style={styles.txDesc} numberOfLines={1}>{desc}</Text>
        <Text style={styles.txDate}>{date}</Text>
      </View>
      <Text style={[styles.txPoints, { color: isPositive ? Colors.success : Colors.error }]}>
        {isPositive ? '+' : ''}{tx.points}
      </Text>
    </View>
  );
}

function RedemptionModal({
  visible,
  reward,
  onClose,
  language,
  localize,
  t,
}: {
  visible: boolean;
  reward: Reward | null;
  onClose: () => void;
  language: 'he' | 'en';
  localize: (obj: Record<string, unknown>, field: string) => string;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  if (!reward) return null;
  const code = 'LV-' + Math.random().toString(36).substr(2, 8).toUpperCase();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          <View style={styles.modalSuccess}>
            <MaterialIcons name="check-circle" size={52} color={Colors.success} />
          </View>
          <Text style={styles.modalTitle}>{t.rewards.redeemSuccess}</Text>
          <Text style={styles.modalSubtitle}>
            {localize(reward as unknown as Record<string, unknown>, 'name')}
          </Text>
          <Text style={styles.modalTip}>{t.rewards.redeemSuccessMsg}</Text>
          <View style={styles.codeBox}>
            <Text style={styles.codeLabel}>{t.rewards.redeemCode}</Text>
            <Text style={styles.codeValue}>{code}</Text>
          </View>
          <TouchableOpacity style={styles.modalBtn} onPress={onClose}>
            <Text style={styles.modalBtnText}>{t.common.done}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function RewardsScreen() {
  const { t, language, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { user, profile } = useAuthStore();
  const { rewards, transactions, loading, fetchRewards, fetchTransactions, redeemReward } = useRewardsStore();
  const [redeeming, setRedeeming] = useState(false);
  const [redeemedReward, setRedeemedReward] = useState<Reward | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState<'rewards' | 'history'>('rewards');

  const points = profile?.points ?? 0;

  useEffect(() => {
    fetchRewards();
    if (user) fetchTransactions(user.id);
  }, [user]);

  const handleRedeem = (reward: Reward) => {
    Alert.alert(
      t.rewards.redeem,
      `${localize(reward as unknown as Record<string, unknown>, 'name')} — ${reward.points_required} pts`,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.rewards.redeem,
          onPress: async () => {
            if (!user) { router.push('/(auth)/login'); return; }
            setRedeeming(true);
            try {
              await redeemReward(user.id, reward);
              setRedeemedReward(reward);
              setModalVisible(true);
              if (user) fetchTransactions(user.id);
            } catch (e) {
              Alert.alert(t.common.error, String(e));
            } finally {
              setRedeeming(false);
            }
          },
        },
      ],
    );
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title={t.rewards.title} showBack isRTL={isRTL} />
        <View style={styles.guestContainer}>
          <MaterialIcons name="card-giftcard" size={64} color={Colors.warmBeige} />
          <Text style={styles.guestTitle}>{t.rewards.title}</Text>
          <Text style={styles.guestSubtitle}>{t.rewards.earnInfo}</Text>
          <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.signInBtnText}>{t.auth.signIn}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={t.rewards.title} showBack isRTL={isRTL} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Points Card */}
        <View style={styles.cardPad}>
          <PointsHeaderCard
            points={points}
            isRTL={isRTL}
            t={t}
            onScan={() => // eslint-disable-next-line @typescript-eslint/no-explicit-any
        router.push('/scan' as any)}
          />
        </View>

        {/* Earn Info Banner */}
        <View style={styles.earnBanner}>
          <MaterialIcons name="info-outline" size={16} color={Colors.primaryBrown} />
          <Text style={styles.earnBannerText}>{t.rewards.earnInfo}</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'rewards' && styles.tabActive]}
            onPress={() => setActiveTab('rewards')}
          >
            <Text style={[styles.tabText, activeTab === 'rewards' && styles.tabTextActive]}>
              {t.rewards.availableRewards}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'history' && styles.tabActive]}
            onPress={() => setActiveTab('history')}
          >
            <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
              {t.rewards.history}
            </Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'rewards' ? (
          <View style={styles.rewardsList}>
            {loading ? (
              <ActivityIndicator color={Colors.primaryBrown} style={{ marginTop: Spacing[8] }} />
            ) : rewards.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="card-giftcard" size={48} color={Colors.warmBeige} />
                <Text style={styles.emptyText}>{t.rewards.noRewards}</Text>
              </View>
            ) : (
              rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  userPoints={points}
                  onRedeem={handleRedeem}
                  isRTL={isRTL}
                  t={t}
                  localize={localize as (obj: Record<string, unknown>, field: string) => string}
                />
              ))
            )}
          </View>
        ) : (
          <View style={styles.historyList}>
            {transactions.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialIcons name="history" size={48} color={Colors.warmBeige} />
                <Text style={styles.emptyText}>{t.rewards.noHistory}</Text>
                <Text style={styles.emptySubText}>{t.rewards.noHistorySubtitle}</Text>
              </View>
            ) : (
              transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} language={language} t={t} />
              ))
            )}
          </View>
        )}

        <View style={{ height: Spacing[8] }} />
      </ScrollView>

      {redeeming && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.primaryBrown} />
        </View>
      )}

      <RedemptionModal
        visible={modalVisible}
        reward={redeemedReward}
        onClose={() => setModalVisible(false)}
        language={language}
        localize={localize as (obj: Record<string, unknown>, field: string) => string}
        t={t}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.backgroundPrimary },
  cardPad: { paddingHorizontal: Spacing[5], paddingTop: Spacing[4] },

  // Points Card
  pointsCard: {
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    padding: Spacing[5],
    overflow: 'hidden',
  },
  pointsCardBg: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryBrown,
    opacity: 0.15,
    top: -60,
    right: -40,
  },
  pointsCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[5],
  },
  rtl: { flexDirection: 'row-reverse' },
  pointsLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.warmBeige,
    marginBottom: Spacing[1],
  },
  pointsNumber: {
    fontFamily: FontFamily.bold,
    fontSize: 42,
    color: Colors.white,
    lineHeight: 48,
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[3],
    paddingVertical: 3,
    borderRadius: Radius.full,
    marginTop: Spacing[2],
  },
  tierText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },
  scanBtn: {
    alignItems: 'center',
    backgroundColor: Colors.primaryBrown,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    gap: 4,
  },
  scanBtnText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  progressSection: { marginBottom: Spacing[3] },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[2],
  },
  progressLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.warmBeige,
  },
  progressNextLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.accentCaramel,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.primaryBrown,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  goldBenefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: Spacing[2],
  },
  goldBenefitText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.accentCaramel,
    flex: 1,
  },

  // Earn banner
  earnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    backgroundColor: Colors.accentCaramel + '15',
    marginHorizontal: Spacing[5],
    marginTop: Spacing[4],
    padding: Spacing[3],
    borderRadius: Radius.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.accentCaramel,
  },
  earnBannerText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },

  // Tabs
  tabsRow: {
    flexDirection: 'row',
    marginHorizontal: Spacing[5],
    marginTop: Spacing[5],
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.lg,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Spacing[2.5],
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabActive: {
    backgroundColor: Colors.surface,
    ...Shadows.xs,
  },
  tabText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primaryBrown,
  },

  // Rewards list
  rewardsList: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    gap: Spacing[3],
  },
  rewardCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.xs,
    marginBottom: Spacing[3],
  },
  rewardCardDimmed: { opacity: 0.65 },
  rewardImage: {
    width: 100,
    height: 110,
  },
  rewardImagePlaceholder: {
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rewardInfo: {
    flex: 1,
    padding: Spacing[3],
    justifyContent: 'space-between',
  },
  rewardName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  rewardDesc: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    flex: 1,
  },
  rewardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[2],
    gap: Spacing[2],
  },
  pointsPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.accentCaramel + '20',
    paddingHorizontal: Spacing[2],
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  pointsPillText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.accentCaramel,
  },
  redeemBtn: {
    backgroundColor: Colors.primaryBrown,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1.5],
    borderRadius: Radius.full,
  },
  redeemBtnDisabled: { backgroundColor: Colors.backgroundSecondary },
  redeemBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  redeemBtnTextDisabled: { color: Colors.textMuted },

  // History
  historyList: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: Spacing[3],
  },
  txIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txInfo: { flex: 1 },
  txDesc: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
  },
  txDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 2,
  },
  txPoints: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing[10],
    gap: Spacing[3],
  },
  emptyText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  emptySubText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
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

  // Loading overlay
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing[6],
    alignItems: 'center',
    gap: Spacing[3],
  },
  modalSuccess: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  modalTip: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  codeBox: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: Radius.md,
    padding: Spacing[4],
    alignItems: 'center',
    width: '100%',
    gap: Spacing[1],
  },
  codeLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  codeValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.primaryBrown,
    letterSpacing: 3,
  },
  modalBtn: {
    backgroundColor: Colors.primaryBrown,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[10],
    paddingVertical: Spacing[3],
    marginTop: Spacing[2],
  },
  modalBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.white,
  },
});
