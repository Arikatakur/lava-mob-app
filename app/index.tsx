import { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../src/store/useAuthStore';
import { Colors } from '../src/theme';

/**
 * Root entry point — redirects based on auth state.
 */
export default function Index() {
  const { user, isLoading, isGuest } = useAuthStore();

  useEffect(() => {
    if (isLoading) return;

    if (user || isGuest) {
      router.replace('/(tabs)/home');
    } else {
      router.replace('/onboarding');
    }
  }, [user, isLoading, isGuest]);

  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
});
