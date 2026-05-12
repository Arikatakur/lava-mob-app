/**
 * Welcome screen — Sukar Helo branded entry point.
 *
 * Replaces the multi-slide carousel with a single premium screen:
 *   logo + brand name + subtitle → Sign In / Continue as Guest
 *
 * Animation sequence
 * ──────────────────
 *  Background glow  – immediate
 *  Logo             – spring scale 0.8→1 + fade,  delay   0 ms
 *  Brand + subtitle – slide-up + fade,             delay 180 ms
 *  Buttons          – slide-up + fade,             delay 340 ms
 */

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from '../src/hooks/useTranslation';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../src/theme';
import { useAuthStore } from '../src/store/useAuthStore';

const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.62, 260);

function useEntrance(delay: number) {
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(18)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 520,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 460,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return { opacity, translateY };
}

export default function Welcome() {
  const { t, isRTL } = useTranslation();
  const { setGuest }  = useAuthStore();

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale   = useRef(new Animated.Value(0.82)).current;
  const brand       = useEntrance(180);
  const buttons     = useEntrance(340);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 480,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 60,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignIn = () => router.push('/(auth)/login');
  const handleGuest  = () => {
    setGuest(true);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safe}>

      {/* ── Ambient background glows ─────────────────────────── */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* ── Logo ─────────────────────────────────────────────── */}
      <View style={styles.logoSection}>
        <Animated.View
          style={{
            opacity:   logoOpacity,
            transform: [{ scale: logoScale }],
          }}
        >
          <Image
            source={require('../assets/sukar-helo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </View>

      {/* ── Brand name + subtitle ────────────────────────────── */}
      <Animated.View
        style={[
          styles.brandSection,
          { opacity: brand.opacity, transform: [{ translateY: brand.translateY }] },
        ]}
      >
        <Text style={styles.brandName} allowFontScaling={false}>SUKAR HELO</Text>
        <Text style={[styles.subtitle, isRTL && styles.rtlText]}>
          {t.onboarding.welcomeSubtitle}
        </Text>
      </Animated.View>

      {/* ── Spacer ───────────────────────────────────────────── */}
      <View style={styles.spacer} />

      {/* ── Buttons ──────────────────────────────────────────── */}
      <Animated.View
        style={[
          styles.actions,
          { opacity: buttons.opacity, transform: [{ translateY: buttons.translateY }] },
        ]}
      >
        {/* Primary: Sign In */}
        <TouchableOpacity
          style={styles.signInBtn}
          onPress={handleSignIn}
          activeOpacity={0.84}
        >
          <Text style={styles.signInText}>{t.auth.signIn}</Text>
        </TouchableOpacity>

        {/* Secondary: Continue as Guest */}
        <TouchableOpacity
          style={styles.guestBtn}
          onPress={handleGuest}
          activeOpacity={0.65}
        >
          <Text style={styles.guestText}>{t.auth.guest}</Text>
        </TouchableOpacity>
      </Animated.View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[8],
  },

  // Ambient glow circles
  glowTop: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: Colors.accentCaramel,
    opacity: 0.06,
    top: -80,
    right: -60,
  },
  glowBottom: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: Colors.primaryBrown,
    opacity: 0.07,
    bottom: 60,
    left: -70,
  },

  // Logo
  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: LOGO_SIZE + 40,
  },
  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    ...Platform.select({
      ios: {
        shadowColor: Colors.darkEspresso,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.12,
        shadowRadius: 24,
      },
    }),
  },

  // Brand
  brandSection: {
    alignItems: 'center',
    paddingBottom: Spacing[2],
  },
  brandName: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    letterSpacing: 5,
    color: Colors.darkEspresso,
    marginBottom: Spacing[3],
  },
  subtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: FontSize.base * 1.65,
    paddingHorizontal: Spacing[4],
  },
  rtlText: {
    textAlign: 'center',
    writingDirection: 'rtl',
  },

  spacer: { flex: 0.5 },

  // Buttons
  actions: {
    gap: Spacing[3],
  },
  signInBtn: {
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    paddingVertical: Spacing[4] + 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#1A0A00',
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.22,
        shadowRadius: 16,
      },
      android: { elevation: 7 },
    }),
  },
  signInText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.backgroundPrimary,
    letterSpacing: 0.3,
  },
  guestBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[3] + 2,
    borderRadius: Radius.xl,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  guestText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});
