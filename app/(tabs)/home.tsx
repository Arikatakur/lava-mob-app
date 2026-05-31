import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { SectionHeader } from '../../src/components/ui/SectionHeader';
import { ProductCard } from '../../src/components/product/ProductCard';
import { PromoBanner } from '../../src/components/product/PromoBanner';
import { ProductCardSkeleton, BannerSkeleton } from '../../src/components/ui/SkeletonLoader';
import { CategoryChip } from '../../src/components/product/CategoryChip';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useFeaturedProducts, useCategories, useBanners, useProducts } from '../../src/hooks/useProducts';
import { useCartStore } from '../../src/store/useCartStore';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows, Layout } from '../../src/theme';
import type { Product } from '../../src/types';

const CARD_GAP = Layout.cardGap;            // 12
const SCREEN_PAD = Layout.screenPaddingHorizontal; // 16
const CAROUSEL_PEEK = 40;                   // px of third card visible — intentional, not awkward

function getTierLabel(points: number, t: ReturnType<typeof useTranslation>['t']) {
  if (points >= 1000) return t.rewards.gold;
  if (points >= 500) return t.rewards.silver;
  return t.rewards.bronze;
}

function getTierColor(points: number) {
  if (points >= 1000) return Colors.accentCaramel;
  if (points >= 500) return Colors.softMocha;
  return Colors.mutedGold;
}

function LoyaltyCard({ points, isRTL, t }: {
  points: number;
  isRTL: boolean;
  t: ReturnType<typeof useTranslation>['t'];
}) {
  const tier = getTierLabel(points, t);
  const tierColor = getTierColor(points);
  const tierMin = points >= 1000 ? 1000 : points >= 500 ? 500 : 0;
  const tierMax = points >= 1000 ? 1000 : points >= 500 ? 1000 : 500;
  const progress = Math.min(((points - tierMin) / (tierMax - tierMin)) * 100, 100);
  const nextLabel = points >= 1000 ? null : points >= 500 ? t.rewards.gold : t.rewards.silver;
  const nextPts = points >= 1000 ? null : points >= 500 ? 1000 : 500;

  return (
    <TouchableOpacity
      style={styles.loyaltyCard}
      onPress={() => // eslint-disable-next-line @typescript-eslint/no-explicit-any
      router.push('/rewards' as any)}
      activeOpacity={0.85}
    >
      <View style={styles.loyaltyBgCircle1} />
      <View style={styles.loyaltyBgCircle2} />
      <View style={[styles.loyaltyContent, isRTL && styles.rtl]}>
        <View style={styles.loyaltyLeft}>
          <View style={[styles.loyaltyTierBadge, { backgroundColor: tierColor + '25' }]}>
            <MaterialIcons name="star" size={12} color={tierColor} />
            <Text style={[styles.loyaltyTierText, { color: tierColor }]}>{tier}</Text>
          </View>
          <Text style={[styles.loyaltyPoints, isRTL && styles.alignRight]}>
            {points.toLocaleString()}
          </Text>
          <Text style={[styles.loyaltyPointsLabel, isRTL && styles.alignRight]}>
            {t.home.yourPoints}
          </Text>
          {nextLabel && nextPts && (
            <View style={styles.loyaltyProgressWrap}>
              <View style={styles.loyaltyProgressBar}>
                <View style={[styles.loyaltyProgressFill, {
                  width: `${progress}%` as `${number}%`,
                  backgroundColor: tierColor,
                }]} />
              </View>
              <Text style={[styles.loyaltyProgressLabel, isRTL && styles.alignRight]}>
                {nextPts - points} {t.profile.ptsTo} {nextLabel}
              </Text>
            </View>
          )}
        </View>
        <View style={styles.loyaltyRight}>
          <View style={styles.loyaltyQrIcon}>
            <MaterialIcons name="qr-code" size={32} color={Colors.white} />
          </View>
          <Text style={styles.loyaltyScanHint}>{t.home.viewRewards}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function Home() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { profile, user } = useAuthStore();
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const { width: screenW } = useWindowDimensions();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Carousel card width: 2 full cards + small peek of the third — intentional, never squished
  const carouselCardWidth = Math.floor((screenW - SCREEN_PAD * 2 - CARD_GAP - CAROUSEL_PEEK) / 2);

  const { banners, loading: bannersLoading } = useBanners();
  const { categories } = useCategories();
  const { products: featured, loading: featuredLoading } = useFeaturedProducts();
  const { products: menuProducts, loading: menuLoading } = useProducts(selectedCategory !== 'all' ? selectedCategory : undefined);

  const firstName = profile?.full_name?.split(' ')[0];
  const greeting = firstName
    ? `${t.home.greeting} ${firstName}!`
    : `${t.home.greeting} 🍫`;

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, []);
  };

  const allCategories = [
    { id: 'all', name_en: t.common.all, name_he: t.common.all, name_ar: t.common.all, slug: 'all', sort_order: 0, is_active: true },
    ...categories,
  ];

  const renderCarouselCard = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      localizedName={localize(item, 'name')}
      onPress={() => router.push(`/product/${item.id}`)}
      onAddToCart={() => handleAddToCart(item)}
      isFavorite={isFavorite(item.id)}
      onToggleFavorite={() => toggle(item.id)}
      width={carouselCardWidth}
    />
  );

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => setRefreshing(false)}
            tintColor={Colors.primaryBrown}
          />
        }
      >
        {/* Top Bar */}
        <View style={[styles.topBar, isRTL && styles.rtl]}>
          <View style={styles.topBarText}>
            <Text style={[styles.greeting, isRTL && styles.alignRight]} numberOfLines={1}>
              {greeting}
            </Text>
            <Text style={[styles.subGreeting, isRTL && styles.alignRight]} numberOfLines={1}>
              {t.home.whatToday}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.searchBtn}
            onPress={() => router.push('/(tabs)/menu')}
          >
            <MaterialIcons name="search" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Loyalty Card — signed-in users only */}
        {user && profile && (
          <View style={styles.loyaltySection}>
            <LoyaltyCard points={profile.points ?? 0} isRTL={isRTL} t={t} />
          </View>
        )}

        {/* Banners */}
        {bannersLoading ? (
          <BannerSkeleton />
        ) : banners.length > 0 ? (
          <FlatList
            data={banners}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(b) => b.id}
            contentContainerStyle={styles.bannersContainer}
            renderItem={({ item }) => (
              <PromoBanner
                banner={item}
                title={localize(item, 'title')}
                subtitle={localize(item, 'subtitle')}
                onPress={() => {
                  if (item.action_type === 'product' && item.action_ref) {
                    router.push(`/product/${item.action_ref}`);
                  }
                }}
              />
            )}
          />
        ) : (
          <View style={styles.heroBanner}>
            <View style={styles.heroContent}>
              <Text style={styles.heroTag}>🍫 {t.home.heroDessert ?? t.home.heroCoffee}</Text>
              <Text style={styles.heroTitle}>{t.home.heroCrafted}</Text>
              <TouchableOpacity
                style={styles.heroBtn}
                onPress={() => router.push('/(tabs)/menu')}
              >
                <Text style={styles.heroBtnText}>{t.home.heroOrder}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Categories */}
        <View style={styles.sectionGap}>
          <SectionHeader title={t.home.categories} isRTL={isRTL} />
          <FlatList
            data={allCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.categoriesList}
            ItemSeparatorComponent={() => <View style={{ width: Spacing[2] }} />}
            renderItem={({ item }) => (
              <CategoryChip
                label={localize(item, 'name')}
                isSelected={selectedCategory === item.slug}
                onPress={() => setSelectedCategory(item.slug)}
              />
            )}
          />
        </View>

        {/* Featured */}
        <View style={styles.sectionGap}>
          <SectionHeader
            title={t.home.featured}
            actionLabel={t.common.seeAll}
            onAction={() => router.push('/(tabs)/menu')}
            isRTL={isRTL}
          />
          {featuredLoading ? (
            <FlatList
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => String(i)}
              contentContainerStyle={styles.productsList}
              ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
              renderItem={() => <ProductCardSkeleton width={carouselCardWidth} />}
            />
          ) : (
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id}
              contentContainerStyle={styles.productsList}
              ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                renderItem={renderCarouselCard}
            />
          )}
        </View>

        {/* Menu by category */}
        <View style={[styles.sectionGap, styles.bottomPad]}>
          <SectionHeader
            title={selectedCategory === 'all' ? t.home.popular : localize(allCategories.find(c => c.slug === selectedCategory) ?? allCategories[0], 'name')}
            isRTL={isRTL}
          />
          {menuLoading ? (
            <FlatList
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => String(i)}
              contentContainerStyle={styles.productsList}
              ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
              renderItem={() => <ProductCardSkeleton width={carouselCardWidth} />}
            />
          ) : (
            <FlatList
              data={menuProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id}
              contentContainerStyle={styles.productsList}
              ItemSeparatorComponent={() => <View style={{ width: CARD_GAP }} />}
                renderItem={renderCarouselCard}
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SCREEN_PAD,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
    gap: Spacing[3],
  },
  topBarText: { flex: 1 },
  rtl: { flexDirection: 'row-reverse' },
  alignRight: { textAlign: 'right' },
  greeting: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
  },
  subGreeting: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  searchBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  loyaltySection: {
    paddingHorizontal: SCREEN_PAD,
    marginBottom: Spacing[2],
  },
  loyaltyCard: {
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.xl,
    padding: Spacing[4],
    overflow: 'hidden',
    ...Shadows.md,
  },
  loyaltyBgCircle1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: Colors.primaryBrown,
    opacity: 0.2,
    top: -50,
    right: -30,
  },
  loyaltyBgCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.accentCaramel,
    opacity: 0.1,
    bottom: -20,
    left: 40,
  },
  loyaltyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  loyaltyLeft: { flex: 1, gap: 2 },
  loyaltyTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
    marginBottom: Spacing[1],
  },
  loyaltyTierText: { fontFamily: FontFamily.semiBold, fontSize: 10, letterSpacing: 0.5 },
  loyaltyPoints: {
    fontFamily: FontFamily.bold,
    fontSize: 30,
    color: Colors.white,
    lineHeight: 34,
  },
  loyaltyPointsLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.warmBeige,
    marginBottom: Spacing[2],
  },
  loyaltyProgressWrap: { gap: 3 },
  loyaltyProgressBar: {
    height: 4,
    backgroundColor: Colors.primaryBrown,
    borderRadius: 2,
    overflow: 'hidden',
    width: 130,
  },
  loyaltyProgressFill: { height: '100%', borderRadius: 2 },
  loyaltyProgressLabel: { fontFamily: FontFamily.regular, fontSize: 10, color: Colors.warmBeige },
  loyaltyRight: { alignItems: 'center', gap: Spacing[2] },
  loyaltyQrIcon: {
    width: 58,
    height: 58,
    borderRadius: Radius.lg,
    backgroundColor: Colors.primaryBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loyaltyScanHint: {
    fontFamily: FontFamily.medium,
    fontSize: 10,
    color: Colors.warmBeige,
    textAlign: 'center',
    maxWidth: 60,
  },
  bannersContainer: {
    paddingHorizontal: SCREEN_PAD,
    paddingBottom: Spacing[4],
  },
  heroBanner: {
    marginHorizontal: SCREEN_PAD,
    height: 180,
    borderRadius: Radius.xl,
    backgroundColor: Colors.darkEspresso,
    overflow: 'hidden',
    marginBottom: Spacing[4],
    justifyContent: 'flex-end',
  },
  heroContent: { padding: Spacing[5] },
  heroTag: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.accentCaramel,
    letterSpacing: 1,
    marginBottom: Spacing[2],
  },
  heroTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.white,
    lineHeight: 36,
    marginBottom: Spacing[4],
  },
  heroBtn: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.accentCaramel,
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
  },
  heroBtnText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.white,
  },
  sectionGap: { marginTop: Spacing[6] },
  categoriesList: { paddingHorizontal: SCREEN_PAD },
  productsList: { paddingHorizontal: SCREEN_PAD },
  bottomPad: { marginBottom: Spacing[8] },
});
