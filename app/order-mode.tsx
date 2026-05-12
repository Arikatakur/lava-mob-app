/**
 * OrderModeScreen
 *
 * Shown on every app launch, right after auth resolves.
 * The user picks Delivery / Pickup / Dine-in before reaching the main tabs.
 *
 * Calling setOrderMode() flips orderModeSelected → true in the Zustand store
 * (in-memory only), which lets index.tsx forward to /(tabs)/home.
 *
 * The last-chosen mode is persisted to AsyncStorage for pre-selection only —
 * the screen is still always shown on every fresh session.
 *
 * Animation sequence
 * ──────────────────
 *  Brand mark  – fade + slide-up, delay   0 ms
 *  Headline    – fade + slide-up, delay  60 ms
 *  Card 1      – fade + slide-up, delay 140 ms
 *  Card 2      – fade + slide-up, delay 220 ms
 *  Card 3      – fade + slide-up, delay 300 ms
 *  Button      – fade + slide-up, delay 360 ms
 */

import React, { useEffect, useRef, useState } from 'react';
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
import {
  Colors,
  FontFamily,
  FontSize,
  Radius,
  Spacing,
} from '../src/theme';
import { useAppStore } from '../src/store/useAppStore';
import { useTranslation } from '../src/hooks/useTranslation';
import type { OrderMode } from '../src/types';

// ── Persistence key ───────────────────────────────────────────────
const LAST_MODE_KEY = '@sukarhelo_last_order_mode';

// ── Mode config ───────────────────────────────────────────────────
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

// ── Entrance hook — returns raw Animated.Values ───────────────────
// Keeping them separate (not merged into a style object) avoids unsafe
// transform-array concatenation when composing with pressScale below.
function useEntrance(delay: number) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 400,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 360,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, translateY };
}

// ── Mode Card ─────────────────────────────────────────────────────
interface CardProps {
  config:     ModeConfig;
  selected:   boolean;
  onPress:    () => void;
  isRTL:      boolean;
  label:      string;
  sub:        string;
  opacity:    Animated.Value;
  translateY: Animated.Value;
}

function ModeCard({
  config, selected, onPress, isRTL,
  label, sub, opacity, translateY,
}: CardProps) {
  const pressScale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.972, useNativeDriver: true, speed: 50 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  return (
    // Entrance + press transforms live in the same array — no casting needed.
    <Animated.View
      style={{
        opacity,
        transform: [{ translateY }, { scale: pressScale }],
      }}
    >
      <Pressable
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        style={[
          styles.card,
          isRTL    && styles.cardRTL,
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

        {/* Labels */}
        <View style={[styles.cardText, isRTL && styles.cardTextRTL]}>
          <Text style={[styles.cardTitle, isRTL && styles.rtlText]}>{label}</Text>
          <Text style={[styles.cardSub,   isRTL && styles.rtlText]}>{sub}</Text>
        </View>

        {/* Selection indicator */}
        <View style={styles.checkZone}>
          {selected
            ? (
              <View style={styles.checkFill}>
                <MaterialIcons name="check" size={13} color={Colors.backgroundPrimary} />
              </View>
            )
            : <View style={styles.checkEmpty} />
          }
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

  // Pre-select last-used mode (user can still change or just tap Continue)
  useEffect(() => {
    AsyncStorage.getItem(LAST_MODE_KEY)
      .then((val) => { if (val) setSelected(val as OrderMode); })
      .catch(() => {});
  }, []);

  // Staggered entrance animations
  const brand   = useEntrance(0);
  const headline = useEntrance(60);
  const cards   = [useEntrance(140), useEntrance(220), useEntrance(300)];
  const btn     = useEntrance(360);

  const handleContinue = () => {
    if (!selected) return;
    AsyncStorage.setItem(LAST_MODE_KEY, selected).catch(() => {});
    setOrderMode(selected);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.screen}>

      {/* ── Brand mark ──────────────────────────────────────────── */}
      <Animated.View style={[styles.brandRow, { opacity: brand.opacity, transform: [{ translateY: brand.translateY }] }]}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandLetter} allowFontScaling={false}>S</Text>
        </View>
        <Text style={styles.brandName} allowFontScaling={false}>SUKAR HELO</Text>
      </Animated.View>

      {/* ── Headline ────────────────────────────────────────────── */}
      <Animated.View style={[styles.headlineBlock, { opacity: headline.opacity, transform: [{ translateY: headline.translateY }] }]}>
        <Text style={[styles.headline, isRTL && styles.rtlText]}>
          {t.orderMode.headline}
        </Text>
        <Text style={[styles.subline, isRTL && styles.rtlText]}>
          {t.orderMode.subline}
        </Text>
      </Animated.View>

      {/* ── Mode cards ──────────────────────────────────────────── */}
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
            opacity={cards[i].opacity}
            translateY={cards[i].translateY}
          />
        ))}
      </View>

      {/* ── Continue button ─────────────────────────────────────── */}
      <Animated.View style={[styles.btnWrapper, { opacity: btn.opacity, transform: [{ translateY: btn.translateY }] }]}>
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
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[8],
    paddingBottom: Spacing[8],
  },

  // Brand mark
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[10],
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: 9,
    ...Platform.select({
      ios:     { shadowColor: '#1A0A00', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.18, shadowRadius: 10 },
      android: { elevation: 5 },
    }),
  },
  brandLetter: {
    fontFamily: FontFamily.bold,
    fontSize: 19,
    lineHeight: 23,
    color: Colors.backgroundPrimary,
    includeFontPadding: false,
  },
  brandName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    letterSpacing: 4.5,
    color: Colors.darkEspresso,
  },

  // Headline
  headlineBlock: {
    marginBottom: Spacing[7],
  },
  headline: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],     // 28px
    lineHeight: FontSize['4xl'] * 1.25,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
  },
  subline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * 1.65,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  // Cards
  cardsBlock: {
    gap: Spacing[3],
    marginBottom: Spacing[6],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[4],
    ...Platform.select({
      ios:     { shadowColor: '#1A0A00', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.055, shadowRadius: 8 },
      android: { elevation: 2 },
    }),
  },
  cardRTL: {
    flexDirection: 'row-reverse',
  },
  cardSelected: {
    borderColor: Colors.darkEspresso,
    backgroundColor: Colors.backgroundSecondary,
    ...Platform.select({
      ios:     { shadowOpacity: 0.11, shadowRadius: 14 },
      android: { elevation: 5 },
    }),
  },

  iconBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: Spacing[3],
  },
  iconBadgeSelected: {
    backgroundColor: Colors.darkEspresso,
  },

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
    lineHeight: FontSize.xs * 1.55,
  },

  checkZone: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: Spacing[2],
  },
  checkFill: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },

  // Continue button
  btnWrapper: {
    marginTop: 'auto',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4] + 2,
    ...Platform.select({
      ios:     { shadowColor: '#1A0A00', shadowOffset: { width: 0, height: 7 }, shadowOpacity: 0.24, shadowRadius: 16 },
      android: { elevation: 7 },
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
