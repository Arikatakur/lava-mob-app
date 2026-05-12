/**
 * AppLoadingScreen — Sukar Helo branded intro splash.
 *
 * Visual: warm cream background · dark-chocolate circular badge · cream "S"
 *
 * Animation sequence
 * ─────────────────────────────────────────────────────────────────
 *  1. Badge:    opacity 0→1 + spring scale 0→1  (slight natural overshoot)
 *  2. Hold:     short pause to let the badge settle            (~300 ms)
 *  3. Wordmark: "SUKAR HELO" fades in + rises 8px→0           (~420 ms)
 *  4. Hold:     give the user a moment to read                 (~700 ms)
 *  5. Exit:     entire screen fades out                        (~480 ms)
 *  → onFinish() is called — layout removes this overlay
 *
 * Total perceived time: ~2.0 s  (intentional, not sluggish)
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
} from 'react-native';
import { Colors } from '../../theme';

// ── Constants ─────────────────────────────────────────────────────
const { width } = Dimensions.get('window');

/** Badge diameter — ~28% of screen width, capped at 118 px */
const BADGE = Math.min(width * 0.28, 118);

// ── Types ─────────────────────────────────────────────────────────
interface AppLoadingScreenProps {
  onFinish: () => void;
}

// ── Component ─────────────────────────────────────────────────────
export function AppLoadingScreen({ onFinish }: AppLoadingScreenProps) {
  const screenOpacity = useRef(new Animated.Value(1)).current;

  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale   = useRef(new Animated.Value(0.1)).current;

  const wordOpacity    = useRef(new Animated.Value(0)).current;
  const wordTranslateY = useRef(new Animated.Value(8)).current;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          tension: 85,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(300),

      Animated.parallel([
        Animated.timing(wordOpacity, {
          toValue: 1,
          duration: 420,
          useNativeDriver: true,
        }),
        Animated.timing(wordTranslateY, {
          toValue: 0,
          duration: 420,
          useNativeDriver: true,
        }),
      ]),

      Animated.delay(700),

      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: 480,
        useNativeDriver: true,
      }),
    ]);

    animation.start(({ finished }) => {
      if (finished) onFinish();
    });

    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[styles.screen, { opacity: screenOpacity }]}
      pointerEvents="none"
    >
      {/* ── Dark chocolate circular badge ──────────────────────── */}
      <Animated.View
        style={[
          styles.badge,
          {
            opacity:   badgeOpacity,
            transform: [{ scale: badgeScale }],
          },
        ]}
      >
        <Text style={styles.letter} allowFontScaling={false}>
          S
        </Text>
      </Animated.View>

      {/* ── "SUKAR HELO" wordmark ──────────────────────────────── */}
      <Animated.Text
        style={[
          styles.wordmark,
          {
            opacity:   wordOpacity,
            transform: [{ translateY: wordTranslateY }],
          },
        ]}
        allowFontScaling={false}
      >
        SUKAR HELO
      </Animated.Text>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundPrimary,   // warm cream #FDF8F0
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    ...Platform.select({ android: { elevation: 99 } }),
  },

  badge: {
    width:        BADGE,
    height:       BADGE,
    borderRadius: BADGE / 2,
    backgroundColor: Colors.darkEspresso,         // dark chocolate #3D1C02
    alignItems:    'center',
    justifyContent: 'center',

    ...Platform.select({
      ios: {
        shadowColor:   '#1A0A00',
        shadowOffset:  { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius:  22,
      },
      android: {
        elevation: 14,
      },
    }),
  },

  letter: {
    fontFamily: 'Poppins_700Bold',
    fontSize:   BADGE * 0.52,
    lineHeight: BADGE * 0.52 * 1.15,
    color:      Colors.backgroundPrimary,         // cream — matches screen bg
    includeFontPadding: false,
    textAlignVertical:  'center',
  },

  wordmark: {
    marginTop:     BADGE * 0.32,
    fontFamily:    'Poppins_600SemiBold',
    fontSize:      11,
    letterSpacing: 5,
    color:         Colors.darkEspresso,
    opacity:       0,                             // overridden by animation
  },
});
