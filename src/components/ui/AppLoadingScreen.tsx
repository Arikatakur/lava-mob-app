/**
 * AppLoadingScreen — Sukar Helo branded intro splash (v2)
 *
 * Visual: warm cream background · dark-chocolate rounded badge
 *         · cream words with staggered entry · ambient glow ring
 *         · light tagline beneath badge
 *
 * Animation sequence
 * ─────────────────────────────────────────────────────────────────
 *  1. Badge:    opacity 0→1 + spring scale 0→1  (natural overshoot)
 *  2. Settle:   short pause while spring settles          (~100 ms)
 *  3. SUKAR:    slides up + fades in inside badge         (~180 ms)
 *  4. HELO:     follows with 80 ms stagger                (~180 ms)
 *  5. Ring+Tag: glow ring scales in · tagline fades in    (~280 ms)
 *  6. Pulse:    ring breathes softly (loop, 800 ms/cycle)
 *  7. Hold:     badge rests                               (~500 ms)
 *  8. Exit:     screen fades · badge scales to 0.94       (~440 ms)
 *  → onFinish() is called
 *
 * Total perceived time: ~1.8 s
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import { Colors } from '../../theme';

// ── Constants ─────────────────────────────────────────────────────
const { width } = Dimensions.get('window');

const BADGE_WIDTH  = Math.min(width * 0.7, 280);
const BADGE_HEIGHT = 80;

const RING_WIDTH  = BADGE_WIDTH  + 36;
const RING_HEIGHT = BADGE_HEIGHT + 36;
const RING_RADIUS = 28;

// ── Types ─────────────────────────────────────────────────────────
interface AppLoadingScreenProps {
  onFinish: () => void;
}

// ── Component ─────────────────────────────────────────────────────
export function AppLoadingScreen({ onFinish }: AppLoadingScreenProps) {

  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Badge
  const badgeOpacity = useRef(new Animated.Value(0)).current;
  const badgeScale   = useRef(new Animated.Value(0.1)).current;

  // Words — start invisible inside the badge
  const sukarOpacity    = useRef(new Animated.Value(0)).current;
  const sukarTranslateY = useRef(new Animated.Value(7)).current;
  const heloOpacity     = useRef(new Animated.Value(0)).current;
  const heloTranslateY  = useRef(new Animated.Value(7)).current;

  // Glow ring
  const ringOpacity    = useRef(new Animated.Value(0)).current;
  const ringScale      = useRef(new Animated.Value(0.82)).current;
  const ringPulseScale = useRef(new Animated.Value(1)).current;

  // Tagline
  const tagOpacity = useRef(new Animated.Value(0)).current;

  // ── Animation ─────────────────────────────────────────────────
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(ringPulseScale, {
          toValue: 1.045,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(ringPulseScale, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );

    const pulseTimer = setTimeout(() => pulse.start(), 820);

    const animation = Animated.sequence([
      // 1. Badge materialises
      Animated.parallel([
        Animated.timing(badgeOpacity, {
          toValue: 1,
          duration: 260,
          useNativeDriver: true,
        }),
        Animated.spring(badgeScale, {
          toValue: 1,
          tension: 85,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),

      // 2. Pause while spring settles
      Animated.delay(100),

      // 3. "SUKAR" slides up
      Animated.parallel([
        Animated.timing(sukarOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(sukarTranslateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 4. "HELO" follows with stagger
      Animated.delay(80),
      Animated.parallel([
        Animated.timing(heloOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(heloTranslateY, {
          toValue: 0,
          duration: 180,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),

      // 5. Ring + tagline appear
      Animated.parallel([
        Animated.timing(ringOpacity, {
          toValue: 0.38,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.spring(ringScale, {
          toValue: 1,
          tension: 60,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(tagOpacity, {
          toValue: 0.55,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),

      // 6. Hold (ring pulses during this window)
      Animated.delay(500),

      // 7. Weighted exit
      Animated.parallel([
        Animated.timing(screenOpacity, {
          toValue: 0,
          duration: 440,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(badgeScale, {
          toValue: 0.94,
          duration: 440,
          easing: Easing.in(Easing.quad),
          useNativeDriver: true,
        }),
      ]),
    ]);

    animation.start(({ finished }) => {
      if (finished) {
        pulse.stop();
        onFinish();
      }
    });

    return () => {
      clearTimeout(pulseTimer);
      pulse.stop();
      animation.stop();
    };
  }, []);

  // ── Render ────────────────────────────────────────────────────
  return (
    <Animated.View
      style={[styles.screen, { opacity: screenOpacity }]}
      pointerEvents="none"
    >
      {/* Glow ring — behind the badge */}
      <Animated.View
        style={[
          styles.ring,
          {
            opacity: ringOpacity,
            transform: [
              { scale: Animated.multiply(ringScale, ringPulseScale) },
            ],
          },
        ]}
      />

      {/* Dark-chocolate badge */}
      <Animated.View
        style={[
          styles.badge,
          {
            opacity:   badgeOpacity,
            transform: [{ scale: badgeScale }],
          },
        ]}
      >
        <View style={styles.wordRow}>
          <Animated.Text
            style={[
              styles.word,
              {
                opacity:   sukarOpacity,
                transform: [{ translateY: sukarTranslateY }],
              },
            ]}
            allowFontScaling={false}
          >
            SUKAR
          </Animated.Text>

          <Animated.Text
            style={[styles.wordGap, { opacity: sukarOpacity }]}
            allowFontScaling={false}
          >
            {' '}
          </Animated.Text>

          <Animated.Text
            style={[
              styles.word,
              {
                opacity:   heloOpacity,
                transform: [{ translateY: heloTranslateY }],
              },
            ]}
            allowFontScaling={false}
          >
            HELO
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.Text
        style={[styles.tagline, { opacity: tagOpacity }]}
        allowFontScaling={false}
      >
        sweet moments, shared
      </Animated.Text>
    </Animated.View>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.backgroundPrimary,
    alignItems:      'center',
    justifyContent:  'center',
    zIndex:          9999,
    ...Platform.select({ android: { elevation: 99 } }),
  },

  ring: {
    position:        'absolute',
    width:           RING_WIDTH,
    height:          RING_HEIGHT,
    borderRadius:    RING_RADIUS,
    borderWidth:     1,
    borderColor:     Colors.darkEspresso,
    backgroundColor: 'transparent',
  },

  badge: {
    width:           BADGE_WIDTH,
    height:          BADGE_HEIGHT,
    borderRadius:    20,
    backgroundColor: Colors.darkEspresso,
    alignItems:      'center',
    justifyContent:  'center',
    ...Platform.select({
      ios: {
        shadowColor:   '#1A0A00',
        shadowOffset:  { width: 0, height: 10 },
        shadowOpacity: 0.22,
        shadowRadius:  22,
      },
      android: { elevation: 14 },
    }),
  },

  wordRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
  },

  word: {
    fontFamily:         'Poppins_700Bold',
    fontSize:           22,
    lineHeight:         28,
    color:              Colors.backgroundPrimary,
    includeFontPadding: false,
    textAlignVertical:  'center',
  },

  wordGap: {
    fontFamily:         'Poppins_700Bold',
    fontSize:           22,
    color:              Colors.backgroundPrimary,
    includeFontPadding: false,
  },

  tagline: {
    marginTop:     14,
    fontFamily:    'Poppins_400Regular',
    fontSize:      10,
    letterSpacing: 3,
    color:         Colors.darkEspresso,
    textTransform: 'uppercase',
  },
});