import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../src/components/ui/Button';
import { useTranslation } from '../src/hooks/useTranslation';
import { Colors, FontFamily, FontSize, Radius, Spacing } from '../src/theme';
import { useAuthStore } from '../src/store/useAuthStore';

const { width, height } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'slide1',
    icon: 'local-cafe' as const,
    bgColor: Colors.darkEspresso,
    accentColor: Colors.accentCaramel,
  },
  {
    key: 'slide2',
    icon: 'shopping-bag' as const,
    bgColor: Colors.primaryBrown,
    accentColor: Colors.mutedGold,
  },
  {
    key: 'slide3',
    icon: 'star' as const,
    bgColor: Colors.softMocha,
    accentColor: Colors.warmBeige,
  },
];

export default function Onboarding() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const { setGuest } = useAuthStore();

  const slideData = SLIDES.map((s, i) => ({
    ...s,
    title: i === 0 ? t.onboarding.slide1Title : i === 1 ? t.onboarding.slide2Title : t.onboarding.slide3Title,
    subtitle: i === 0 ? t.onboarding.slide1Subtitle : i === 1 ? t.onboarding.slide2Subtitle : t.onboarding.slide3Subtitle,
  }));

  const isLast = activeIndex === SLIDES.length - 1;

  const handleNext = () => {
    if (isLast) {
      router.push('/(auth)/login');
    } else {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    }
  };

  const handleGuest = () => {
    setGuest(true);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        ref={flatListRef}
        data={slideData}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bgColor }]}>
            <View style={[styles.iconCircle, { backgroundColor: item.accentColor + '30' }]}>
              <MaterialIcons name={item.icon} size={80} color={item.accentColor} />
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideSubtitle}>{item.subtitle}</Text>
          </View>
        )}
      />

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              activeIndex === i ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <Button
          label={isLast ? t.onboarding.getStarted : t.common.next}
          onPress={handleNext}
          fullWidth
          size="lg"
        />
        <TouchableOpacity onPress={handleGuest} style={styles.guestBtn}>
          <Text style={styles.guestText}>{t.auth.guest}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.darkEspresso,
  },
  slide: {
    width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing[8],
  },
  iconCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[10],
  },
  slideTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    textAlign: 'center',
    marginBottom: Spacing[4],
    lineHeight: 36,
  },
  slideSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: 'rgba(255,255,255,0.75)',
    textAlign: 'center',
    lineHeight: 24,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: Spacing[5],
    backgroundColor: Colors.darkEspresso,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: Colors.accentCaramel,
    width: 24,
  },
  dotInactive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  actions: {
    backgroundColor: Colors.backgroundPrimary,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    gap: Spacing[3],
  },
  guestBtn: {
    alignItems: 'center',
    paddingVertical: Spacing[3],
  },
  guestText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
});
