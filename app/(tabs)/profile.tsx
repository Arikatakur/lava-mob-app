import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { Button } from '../../src/components/ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useAppStore } from '../../src/store/useAppStore';
import { authService } from '../../src/services/auth.service';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';

function getTier(points: number) {
  if (points >= 1000) return 'gold';
  if (points >= 500) return 'silver';
  return 'bronze';
}

function getTierColor(points: number) {
  if (points >= 1000) return Colors.accentCaramel;
  if (points >= 500) return Colors.softMocha;
  return Colors.mutedGold;
}

function getTierLabel(points: number, t: ReturnType<typeof useTranslation>['t']) {
  if (points >= 1000) return t.profile.goldMember;
  if (points >= 500) return t.profile.silverMember;
  return t.profile.bronzeMember;
}

interface MenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
  value?: string;
  rightElement?: React.ReactNode;
  isRTL?: boolean;
}

function MenuItem({ icon, label, onPress, value, rightElement, isRTL }: MenuItemProps) {
  return (
    <TouchableOpacity
      style={[styles.menuItem, isRTL && styles.rtl]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.menuItemLeft, isRTL && styles.rtl]}>
        <View style={styles.menuIcon}>
          <MaterialIcons name={icon} size={20} color={Colors.primaryBrown} />
        </View>
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      {rightElement ?? (
        <View style={[styles.menuItemRight, isRTL && styles.rtl]}>
          {value && <Text style={styles.menuValue}>{value}</Text>}
          <MaterialIcons
            name={isRTL ? 'chevron-left' : 'chevron-right'}
            size={20}
            color={Colors.textMuted}
          />
        </View>
      )}
    </TouchableOpacity>
  );
}

export default function Profile() {
  const { t, isRTL } = useTranslation();
  const { user, profile, reset } = useAuthStore();
  const { language, setLanguage } = useAppStore();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      t.auth.logout,
      t.auth.logoutConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.auth.logout,
          style: 'destructive',
          onPress: async () => {
            setLoggingOut(true);
            try {
              await authService.signOut();
              reset();
              router.replace('/onboarding');
            } catch {
              setLoggingOut(false);
            }
          },
        },
      ],
    );
  };

  const toggleLanguage = () => {
    setLanguage(language === 'he' ? 'en' : 'he');
  };

  const displayName = profile?.full_name ?? user?.email ?? 'Guest';
  const isGuest = !user;
  const points = profile?.points ?? 0;
  const tierColor = getTierColor(points);
  const tierLabel = getTierLabel(points, t);

  const tierMin = points >= 1000 ? 1000 : points >= 500 ? 500 : 0;
  const nextTierPts = points >= 1000 ? null : points >= 500 ? 1000 : 500;
  const progress = nextTierPts
    ? Math.min(((points - tierMin) / (nextTierPts - tierMin)) * 100, 100)
    : 100;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={styles.displayName}>{displayName}</Text>

          {!isGuest && (
            <View style={[styles.tierBadge, { backgroundColor: tierColor + '20' }]}>
              <MaterialIcons name="star" size={14} color={tierColor} />
              <Text style={[styles.tierBadgeText, { color: tierColor }]}>{tierLabel}</Text>
            </View>
          )}

          {!isGuest && (
            <View style={styles.pointsSection}>
              <Text style={styles.pointsCount}>{points.toLocaleString()}</Text>
              <Text style={styles.pointsLabel}>{t.profile.points}</Text>
              {nextTierPts && (
                <View style={styles.progressWrap}>
                  <View style={styles.progressBar}>
                    <View style={[styles.progressFill, {
                      width: `${progress}%` as `${number}%`,
                      backgroundColor: tierColor,
                    }]} />
                  </View>
                  <Text style={styles.progressLabel}>
                    {nextTierPts - points} pts to {points >= 500 ? 'Gold' : 'Silver'}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Loyalty section */}
        {!isGuest && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>Loyalty</Text>
            <View style={styles.menuCard}>
              <MenuItem
                icon="card-giftcard"
                label={t.profile.rewards}
                onPress={() => // eslint-disable-next-line @typescript-eslint/no-explicit-any
              router.push('/rewards' as any)}
                isRTL={isRTL}
              />
              <MenuItem
                icon="qr-code-scanner"
                label={t.profile.scanCard}
                onPress={() => // eslint-disable-next-line @typescript-eslint/no-explicit-any
              router.push('/scan' as any)}
                isRTL={isRTL}
              />
            </View>
          </View>
        )}

        {/* Account section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t.profile.account}
          </Text>
          <View style={styles.menuCard}>
            {!isGuest && (
              <MenuItem
                icon="receipt-long"
                label={t.profile.orders}
                onPress={() => router.push('/orders')}
                isRTL={isRTL}
              />
            )}
            <MenuItem
              icon="favorite"
              label={t.profile.favorites}
              onPress={() => router.push('/(tabs)/favorites')}
              isRTL={isRTL}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t.settings.title}
          </Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="language"
              label={t.settings.language}
              isRTL={isRTL}
              rightElement={
                <View style={[styles.langToggle, isRTL && styles.rtl]}>
                  <Text style={styles.langText}>
                    {language === 'he' ? 'עב' : 'EN'}
                  </Text>
                  <Switch
                    value={language === 'en'}
                    onValueChange={toggleLanguage}
                    trackColor={{ false: Colors.primaryBrown, true: Colors.accentCaramel }}
                    thumbColor={Colors.white}
                  />
                </View>
              }
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.menuCard}>
            <MenuItem icon="help-outline" label={t.profile.support} isRTL={isRTL} />
            <MenuItem icon="info-outline" label={t.profile.about} isRTL={isRTL} />
          </View>
        </View>

        {/* Auth Action */}
        <View style={styles.authSection}>
          {isGuest ? (
            <Button
              label={`${t.auth.signIn} / ${t.auth.signUp}`}
              onPress={() => router.push('/(auth)/login')}
              fullWidth
              size="lg"
            />
          ) : (
            <Button
              label={t.auth.logout}
              onPress={handleLogout}
              variant="secondary"
              fullWidth
              loading={loggingOut}
            />
          )}
        </View>

        <View style={styles.versionRow}>
          <Text style={styles.versionText}>Lava Cafe v1.0.0</Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  profileCard: {
    alignItems: 'center',
    paddingTop: Spacing[8],
    paddingBottom: Spacing[5],
    paddingHorizontal: Spacing[5],
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[4],
  },
  avatarText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.accentCaramel,
  },
  displayName: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  tierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    gap: 4,
    marginBottom: Spacing[3],
  },
  tierBadgeText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: 0.5,
  },
  pointsSection: { alignItems: 'center', width: '100%' },
  pointsCount: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.primaryBrown,
  },
  pointsLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing[3],
  },
  progressWrap: { alignItems: 'center', width: '60%', gap: Spacing[1] },
  progressBar: {
    height: 6,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 3,
    overflow: 'hidden',
    width: '100%',
  },
  progressFill: { height: '100%', borderRadius: 3 },
  progressLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  section: { paddingHorizontal: Spacing[5], marginBottom: Spacing[4] },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.8,
    marginBottom: Spacing[2],
    textTransform: 'uppercase',
  },
  rtlText: { textAlign: 'right' },
  menuCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.xs,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[4],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  menuValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  rtl: { flexDirection: 'row-reverse' },
  langToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
  },
  langText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  authSection: { paddingHorizontal: Spacing[5], marginBottom: Spacing[4] },
  versionRow: { alignItems: 'center', paddingBottom: Spacing[8] },
  versionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
});
