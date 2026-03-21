import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { supabase } from '../src/services/supabase';
import { useAuthStore } from '../src/store/useAuthStore';
import { useAppStore } from '../src/store/useAppStore';
import { useFavoritesStore } from '../src/store/useFavoritesStore';
import { favoritesService } from '../src/services/favorites.service';
import { Colors } from '../src/theme';
import { AppLoadingScreen } from '../src/components/ui/AppLoadingScreen';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setUser, setLoading } = useAuthStore();
  const { isRTL } = useAppStore();
  const { setAll } = useFavoritesStore();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  /** true while our custom branded splash is animating */
  const [splashVisible, setSplashVisible] = useState(true);

  useEffect(() => {
    if (fontsLoaded) {
      // Hide the native splash immediately — our custom one takes over.
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) {
          favoritesService.getFavoriteIds(session.user.id)
            .then(setAll)
            .catch(() => {});
        } else {
          setAll([]);
        }
      },
    );
    return () => subscription.unsubscribe();
  }, []);

  // Keep native splash visible until fonts are ready
  if (!fontsLoaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar
          style="dark"
          backgroundColor={Colors.backgroundPrimary}
        />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="onboarding" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="product/[id]"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="checkout/index"
            options={{
              presentation: 'card',
              animation: 'slide_from_bottom',
            }}
          />
          <Stack.Screen
            name="checkout/success"
            options={{
              presentation: 'card',
              animation: 'fade',
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="orders/index"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="orders/[id]"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="rewards/index"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
          <Stack.Screen
            name="scan/index"
            options={{
              presentation: 'card',
              animation: 'slide_from_right',
            }}
          />
        </Stack>

        {/* Premium branded splash — overlays all content, self-removes on finish */}
        {splashVisible && (
          <AppLoadingScreen onFinish={() => setSplashVisible(false)} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
