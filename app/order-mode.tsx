/**
 * OrderModeScreen — shown on every app launch after auth resolves.
 *
 * The user picks Delivery / Pickup / Dine-in before entering the main tabs.
 * Calling setOrderMode() sets orderModeSelected = true in the store so
 * index.tsx routes forward. The selection is NOT persisted across launches,
 * but the last-used mode is saved to AsyncStorage for pre-selection only.
 *
 * Animation
 * ─────────────────────────────────────────────────────────────────
 *  • Header fades + slides in from top  (delay 0)
 *  • Card 1 fades + slides up           (delay 120ms)
 *  • Card 2 fades + slides up           (delay 210ms)
 *  • Card 3 fades + slides up           (delay 300ms)
 *  • Continue button fades in when a mode is selected
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { useTranslation } from '../src/hooks/useTranslation';
import type { OrderMode } from '../src/types';

// ── Constants ─────────────────────────────────────────────────────
const LAST_MODE_KEY = '@lava_last_order_mode';

type ModeConfig = {
  key: OrderMode;
  icon: keyof typeof MaterialIcons.glyphMap;
  labelKey: 'delivery' | 'pickup' | 'dineIn';
  subKey:   'deliverySub' | 'pickupSub' | 'dineInSub';
};

const MODES: ModeConfig[] = [
  { key: 'delivery', icon: 'delivery-dining', labelKey: 'delivery', subKey: 'deliverySub' },
  { key: 'pickup',   icon: 'storefront',      labelKey: 'pickup',   subKey: 'pickupSub'   },
  { key: 'dine_in',  icon: 'restaurant',      labelKey: 'dineIn',   subKey: 'dineInSub'   },
];

// ── Animated entrance helper ──────────────────────────────────────
function useEntrance(delay: number) {
  const opacity   = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(22)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 420,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 380,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, transform: [{ translateY }] };
}

// ── Mode Card ─────────────────────────────────────────────────────
interface CardProps {
  config: ModeConfig;
  selected: boolean;
  onPress: () => void;
  isRTL: boolean;
  label: string;
  sub: string;
  animStyle: object;
}

function ModeCard({ config, selected, onPress, isRTL, label, sub, animStyle }: CardProps) {
  // Subtle scale feedback on press
  const pressScale = useRef(new Animated.Value(1)).current;

  const handlePressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.975, useNativeDriver: true, speed: 50 }).start();
  const handlePressOut = () =>
    Animated.spring(pressScale, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  return (
    <Animated.View style={[animStyle, { transform: [...(animStyle as any).transform, { scale: pressScale }] }]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          isRTL && styles.cardRTL,
          selected && styles.cardSelected,
        ]}
        accessibilityRole="radio"
        accessibilityState={{ selected }}
        accessibilityLabel={label}
      >
        {/* Icon badge */}
        <View style={[styles.iconBadge, selected && styles.iconBadgeSelected]}>
          <MaterialIcons
            name={config.icon}
            size={22}
            color={selected ? Colors.backgroundPrimary : Colors.primaryBrown}
          />
        </View>

        {/* Text */}
        <View style={[styles.cardText, isRTL && styles.cardTextRTL]}>
          <Text style={[styles.cardTitle, isRTL && styles.textRTL]}>{label}</Text>
          <Text style={[styles.cardSub,   isRTL && styles.textRTL]}>{sub}</Text>
        </View>

        {/* Checkmark */}
        <View style={styles.checkZone}>
          {selected && (
            <View style={styles.checkCircle}>
              <MaterialIcons name="check" size={14} color={Colors.backgroundPrimary} />
            </View>
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function OrderModeScreen() {
  const { setOrderMode } = useAppStore();
  const { t, isRTL }     = useTranslation();

  const [selected, setSelected] = useState<OrderMode | null>(null);

  // Load last-used mode for pre-selection
  useEffect(() => {
    AsyncStorage.getItem(LAST_MODE_KEY)
      .then((val) => { if (val) setSelected(val as OrderMode); })
      .catch(() => {});
  }, []);

  // Entrance animations
  const headerAnim = useEntrance(0);
  const card0Anim  = useEntrance(120);
  const card1Anim  = useEntrance(210);
  const card2Anim  = useEntrance(300);
  const btnAnim    = useEntrance(380);

  const cardAnims = [card0Anim, card1Anim, card2Anim];

  const handleContinue = () => {
    if (!selected) return;
    AsyncStorage.setItem(LAST_MODE_KEY, selected).catch(() => {});
    setOrderMode(selected);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={[styles.screen, isRTL && styles.screenRTL]}>
      {/* ── Brand mark ────────────────────────────────────────── */}
      <Animated.View style={[styles.brandRow, headerAnim]}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandLetter} allowFontScaling={false}>L</Text>
        </View>
        <Text style={styles.brandName} allowFontScaling={false}>LAVA CAFE</Text>
      </Animated.View>

      {/* ── Headline ──────────────────────────────────────────── */}
      <Animated.View style={[styles.headlineBlock, headerAnim]}>
        <Text style={[styles.headline, isRTL && styles.textRTL]}>
          {t.orderMode.headline}
        </Text>
        <Text style={[styles.subline, isRTL && styles.textRTL]}>
          {t.orderMode.subline}
        </Text>
      </Animated.View>

      {/* ── Mode cards ────────────────────────────────────────── */}
      <View style={styles.cardsBlock}>
        {MODES.map((mode, i) => (
          <ModeCard
            key={mode.key}
            config={mode}
            selected={selected === mode.key}
            onPress={() => setSelected(mode.key)}
            isRTL={isRTL}
            label={t.orderMode[mode.labelKey]}
            sub={t.orderMode[mode.subKey]}
            animStyle={cardAnims[i]}
          />
        ))}
      </View>

      {/* ── Continue button ───────────────────────────────────── */}
      <Animated.View style={[styles.btnWrapper, btnAnim]}>
        <TouchableOpacity
          style={[styles.btn, !selected && styles.btnDisabled]}
          onPress={handleContinue}
          disabled={!selected}
          activeOpacity={0.82}
        >
          <Text style={[styles.btnText, !selected && styles.btnTextDisabled]}>
            {t.orderMode.continueBtn}
          </Text>
          <MaterialIcons
            name={isRTL ? 'arrow-back' : 'arrow-forward'}
            size={18}
            color={selected ? Colors.backgroundPrimary : Colors.textMuted}
            style={{ marginStart: 6 }}
          />
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: Spacing[5],       // 20px
    paddingTop: Spacing[8],              // 32px — below safe area
    paddingBottom: Spacing[6],           // 24px
  },
  screenRTL: {
    // RTL layout flip is handled per-element via textRTL / cardRTL
  },

  // ── Brand mark ──────────────────────────────────────────────────
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[10],           // 40px
  },
  brandBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 8,
    ...Platform.select({
      ios:     { shadowColor: '#1B2E1A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.16, shadowRadius: 8 },
      android: { elevation: 4 },
    }),
  },
  brandLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 18,
    lineHeight: 22,
    color: Colors.backgroundPrimary,
    includeFontPadding: false,
  },
  brandName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: 4,
    color: Colors.darkEspresso,
  },

  // ── Headline ────────────────────────────────────────────────────
  headlineBlock: {
    marginBottom: Spacing[8],            // 32px
  },
  headline: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],           // ~28px
    lineHeight: FontSize['2xl'] * 1.28,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],            // 8px
  },
  subline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * 1.6,
  },
  textRTL: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  // ── Cards ───────────────────────────────────────────────────────
  cardsBlock: {
    gap: Spacing[3],                     // 12px between cards
    marginBottom: Spacing[8],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,             // 20px
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing[4],         // 16px
    paddingHorizontal: Spacing[4],
    ...Platform.select({
      ios:     { shadowColor: '#1B2E1A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardRTL: {
    flexDirection: 'row-reverse',
  },
  cardSelected: {
    borderColor: Colors.darkEspresso,
    backgroundColor: Colors.backgroundSecondary,  // light sage tint
    ...Platform.select({
      ios:     { shadowOpacity: 0.12, shadowRadius: 12 },
      android: { elevation: 5 },
    }),
  },

  // Icon badge
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: Spacing[3],
  },
  iconBadgeSelected: {
    backgroundColor: Colors.darkEspresso,
  },

  // Card text
  cardText: {
    flex: 1,
  },
  cardTextRTL: {
    alignItems: 'flex-end',
    marginEnd: Spacing[3],
    marginStart: 0,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: FontSize.xs * 1.5,
  },

  // Checkmark zone
  checkZone: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: Spacing[2],
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Continue button ──────────────────────────────────────────────
  btnWrapper: {
    marginTop: 'auto',                   // push to bottom
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4],         // 16px
    ...Platform.select({
      ios:     { shadowColor: '#1B2E1A', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.22, shadowRadius: 14 },
      android: { elevation: 6 },
    }),
  },
  btnDisabled: {
    backgroundColor: Colors.border,
    ...Platform.select({
      ios:     { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },
  btnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.backgroundPrimary,
  },
  btnTextDisabled: {
    color: Colors.textMuted,
  },
});
