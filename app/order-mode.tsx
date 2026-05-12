/**
 * OrderModeScreen — refined premium version
 *
 * Visual improvements over previous version
 * ──────────────────────────────────────────
 *  Layout    — tighter vertical rhythm, CTA sits close to cards
 *  Depth     — three ambient glow circles create warmth without gradients
 *  Cards     — taller, richer selected state (gold border + elevated shadow)
 *  Selection — spring-pulse scale when a card is tapped
 *  CTA       — flat/muted disabled vs. floating active (strong shadow)
 *  Typography — subline one step larger for readability
 *
 * Animation sequence (unchanged timing, tighter values)
 * ──────────────────────────────────────────────────────
 *  Brand mark  – fade + slide-up, delay   0 ms
 *  Headline    – fade + slide-up, delay  60 ms
 *  Card 1      – fade + slide-up, delay 130 ms
 *  Card 2      – fade + slide-up, delay 210 ms
 *  Card 3      – fade + slide-up, delay 290 ms
 *  Button      – fade + slide-up, delay 350 ms
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
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

const { width } = Dimensions.get('window');

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

// ── Entrance hook ─────────────────────────────────────────────────
function useEntrance(delay: number) {
  const opacity    = useRef(new Animated.Value(0)).current;
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
  const pressScale     = useRef(new Animated.Value(1)).current;
  const selectionPulse = useRef(new Animated.Value(1)).current;

  const onPressIn  = () =>
    Animated.spring(pressScale, { toValue: 0.965, useNativeDriver: true, speed: 60, bounciness: 0 }).start();
  const onPressOut = () =>
    Animated.spring(pressScale, { toValue: 1,     useNativeDriver: true, speed: 50 }).start();

  useEffect(() => {
    if (selected) {
      Animated.sequence([
        Animated.spring(selectionPulse, {
          toValue: 1.030,
          useNativeDriver: true,
          speed: 90,
          bounciness: 6,
        }),
        Animated.spring(selectionPulse, {
          toValue: 1,
          useNativeDriver: true,
          speed: 55,
          bounciness: 2,
        }),
      ]).start();
    }
  }, [selected]);

  return (
    // Layer 1: entrance animation (opacity + slide)
    <Animated.View style={{ opacity, transform: [{ translateY }, { scale: selectionPulse }] }}>
      {/* Layer 2: press feedback */}
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
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
          {/* Warm glow overlay when selected */}
          {selected && <View style={styles.cardGlow} pointerEvents="none" />}

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
            <Text style={[styles.cardTitle, isRTL && styles.rtlText, selected && styles.cardTitleSelected]}>
              {label}
            </Text>
            <Text style={[styles.cardSub, isRTL && styles.rtlText]}>{sub}</Text>
          </View>

          {/* Selection indicator */}
          <View style={styles.checkZone}>
            {selected ? (
              <View style={styles.checkFill}>
                <MaterialIcons name="check" size={13} color={Colors.backgroundPrimary} />
              </View>
            ) : (
              <View style={styles.checkEmpty} />
            )}
          </View>
        </Pressable>
      </Animated.View>
    </Animated.View>
  );
}

// ── Screen ────────────────────────────────────────────────────────
export default function OrderModeScreen() {
  const { setOrderMode } = useAppStore();
  const { t, isRTL }     = useTranslation();

  const [selected, setSelected] = useState<OrderMode | null>(null);

  useEffect(() => {
    AsyncStorage.getItem(LAST_MODE_KEY)
      .then((val) => { if (val) setSelected(val as OrderMode); })
      .catch(() => {});
  }, []);

  const brand    = useEntrance(0);
  const headline = useEntrance(60);
  const cards    = [useEntrance(130), useEntrance(210), useEntrance(290)];
  const btn      = useEntrance(350);

  const handleContinue = () => {
    if (!selected) return;
    AsyncStorage.setItem(LAST_MODE_KEY, selected).catch(() => {});
    setOrderMode(selected);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.screen}>

      {/* ── Ambient depth glows ──────────────────────────────── */}
      <View style={styles.glowTopRight} pointerEvents="none" />
      <View style={styles.glowBottomLeft} pointerEvents="none" />
      <View style={styles.glowCenter} pointerEvents="none" />

      {/* ── Brand mark ──────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.brandRow,
          { opacity: brand.opacity, transform: [{ translateY: brand.translateY }] },
        ]}
      >
        <View style={styles.brandBadge}>
          <Text style={styles.brandLetter} allowFontScaling={false}>S</Text>
        </View>
        <Text style={styles.brandName} allowFontScaling={false}>SUKAR HELO</Text>
      </Animated.View>

      {/* ── Headline ────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.headlineBlock,
          { opacity: headline.opacity, transform: [{ translateY: headline.translateY }] },
        ]}
      >
        <Text style={[styles.headline, isRTL && styles.rtlText]}>
          {t.orderMode.headline}
        </Text>
        <Text style={[styles.subline, isRTL && styles.rtlText]}>
          {t.orderMode.subline}
        </Text>
      </Animated.View>

      {/* ── Mode cards ──────────────────────────────────────── */}
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

      {/* ── Continue button ─────────────────────────────────── */}
      <Animated.View
        style={[
          styles.btnWrapper,
          { opacity: btn.opacity, transform: [{ translateY: btn.translateY }] },
        ]}
      >
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
            style={{ marginStart: 8 }}
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
    paddingTop: Spacing[5],
    paddingBottom: Spacing[7],
  },

  // ── Ambient depth ──────────────────────────────────────────
  glowTopRight: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: Colors.accentCaramel,
    opacity: 0.055,
    top: -60,
    right: -70,
  },
  glowBottomLeft: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: Colors.primaryBrown,
    opacity: 0.065,
    bottom: 20,
    left: -60,
  },
  glowCenter: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.softMocha,
    opacity: 0.04,
    top: '38%',
    alignSelf: 'center',
  },

  // ── Brand mark ─────────────────────────────────────────────
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[6],
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
      ios: {
        shadowColor: '#1A0A00',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
      },
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

  // ── Headline ───────────────────────────────────────────────
  headlineBlock: {
    marginBottom: Spacing[5],
  },
  headline: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['4xl'],
    lineHeight: FontSize['4xl'] * 1.25,
    color: Colors.textPrimary,
    marginBottom: Spacing[2] + 2,
  },
  subline: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: FontSize.base * 1.6,
    opacity: 0.88,
  },
  rtlText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },

  // ── Cards ──────────────────────────────────────────────────
  cardsBlock: {
    gap: Spacing[3],
    marginBottom: Spacing[4],
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: Spacing[5],
    paddingHorizontal: Spacing[4],
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#2C1A0E',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: { elevation: 2 },
    }),
  },
  cardRTL: {
    flexDirection: 'row-reverse',
  },
  cardSelected: {
    borderColor: Colors.accentCaramel,
    borderWidth: 2,
    backgroundColor: Colors.backgroundSecondary,
    ...Platform.select({
      ios: {
        shadowColor: '#2C1A0E',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 18,
      },
      android: { elevation: 6 },
    }),
  },
  cardGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.accentCaramel,
    opacity: 0.04,
    borderRadius: Radius.xl,
  },

  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: Spacing[3],
  },
  iconBadgeSelected: {
    backgroundColor: Colors.darkEspresso,
    ...Platform.select({
      ios: {
        shadowColor: '#1A0A00',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },

  cardText: { flex: 1 },
  cardTextRTL: {
    alignItems: 'flex-end',
    marginEnd: Spacing[3],
    marginStart: 0,
  },
  cardTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: 3,
  },
  cardTitleSelected: {
    color: Colors.darkEspresso,
  },
  cardSub: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
    lineHeight: FontSize.sm * 1.55,
  },

  checkZone: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: Spacing[2],
  },
  checkFill: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.darkEspresso,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1A0A00',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: { elevation: 3 },
    }),
  },
  checkEmpty: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },

  // ── CTA button ─────────────────────────────────────────────
  btnWrapper: {},
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4] + 4,
    ...Platform.select({
      ios: {
        shadowColor: '#1A0A00',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.32,
        shadowRadius: 22,
      },
      android: { elevation: 10 },
    }),
  },
  btnDisabled: {
    backgroundColor: Colors.warmBeige,
    ...Platform.select({
      ios:     { shadowOpacity: 0 },
      android: { elevation: 0 },
    }),
  },
  btnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.backgroundPrimary,
    letterSpacing: 0.2,
  },
  btnTextDisabled: {
    color: Colors.textMuted,
  },
});
