import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { useAppStore } from '../src/store/useAppStore';
import { Colors } from '../src/theme';

/**
 * Root entry point — redirects based on auth state and session order-mode.
 *
 * Flow:
 *   Not authenticated → /onboarding
 *   Authenticated, no mode chosen yet → /order-mode   ← every app launch
 *   Authenticated + mode chosen → /(tabs)/home
 */
export default function Index() {
  const { user, isLoading, isGuest } = useAuthStore();
  const { orderModeSelected } = useAppStore();

  useEffect(() => {
    if (isLoading) return;

    if (user || isGuest) {
      // Always ask for mode at session start; skip only after chosen this session
      if (orderModeSelected) {
        router.replace('/(tabs)/home');
      } else {
        router.replace('/order-mode');
      }
    } else {
      router.replace('/onboarding');
    }
  }, [user, isLoading, isGuest, orderModeSelected]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
});
