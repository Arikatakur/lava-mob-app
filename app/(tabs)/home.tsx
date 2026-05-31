import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Image,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
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
import { Colors, FontFamily, FontSize, Spacing, Radius, Shadows } from '../../src/theme';
import type { Product } from '../../src/types';

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
      onPress={() => router.push('/rewards' as any)}
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
          <Text style={styles.loyaltyPoints}>{points.toLocaleString()}</Text>
          <Text style={styles.loyaltyPointsLabel}>{t.home.yourPoints}</Text>
          {nextLabel && nextPts && (
            <View style={styles.loyaltyProgressWrap}>
              <View style={styles.loyaltyProgressBar}>
                <View style={[styles.loyaltyProgressFill, {
                  width: `${progress}%` as `${number}%`,
                  backgroundColor: tierColor,
                }]} />
              </View>
              <Text style={styles.loyaltyProgressLabel}>
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

function LogoHeader() {
  return (
    <View style={styles.logoCircle}>
      <Image
        source={require('../../assets/sukar-helo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

export default function Home() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { profile, user } = useAuthStore();
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { banners, loading: bannersLoading } = useBanners(refreshKey);
  const { categories } = useCategories(refreshKey);
  const { products: featured, loading: featuredLoading } = useFeaturedProducts(refreshKey);
  const { products: menuProducts, loading: menuLoading } = useProducts(selectedCategory !== 'all' ? selectedCategory : undefined, refreshKey);

  const greetingName = profile?.full_name?.split(' ')[0] ?? '';
  const currentCategory = [...categories].find((c) => c.slug === selectedCategory) ?? { id: 'all', name_en: 'All', name_he: 'הכל', slug: 'all', sort_order: 0, is_active: true };

  useEffect(() => {
    if (!refreshing) return;
    if (!bannersLoading && !featuredLoading && !menuLoading) {
      setRefreshing(false);
    }
  }, [refreshing, bannersLoading, featuredLoading, menuLoading]);

  const handleRefresh = () => {
    setRefreshing(true);
    setRefreshKey((prev) => prev + 1);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product, 1, []);
  };

  const handleCategoryPress = (slug: string) => {
    setSelectedCategory(slug);
  };

  const allCategories = [
    { id: 'all', name_en: 'All', name_he: 'الكل', slug: 'all', sort_order: 0, is_active: true, icon_name: 'grid-view' },
    ...categories,
  ];

  return (
    <ScreenWrapper>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.primaryBrown}
          />
        }
      >
        {/* Header */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.notifBtn}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <MaterialIcons name="notifications-none" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <View style={styles.headerText}>
              <Text style={styles.greeting}>مرحباً</Text>
              <Text style={styles.subGreeting}>ماذا تشتهين اليوم؟</Text>
            </View>
            <LogoHeader />
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => router.push('/(tabs)/menu?focus=1')}
          activeOpacity={0.8}
        >
          <MaterialIcons name="search" size={20} color={Colors.textMuted} />
          <Text style={styles.searchPlaceholder}>ابحثي عن حلوى أو مشروب</Text>
        </TouchableOpacity>

        {/* Loyalty Card */}
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
        ) : null}

        {/* Categories */}
        <View style={styles.sectionGap}>
          <Text style={styles.sectionLabel}>الفئات</Text>
          <FlatList
            data={allCategories}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(c) => c.id}
            contentContainerStyle={styles.categoriesList}
            renderItem={({ item }) => (
              <CategoryChip
                label={localize(item, 'name')}
                isSelected={selectedCategory === item.slug}
                onPress={() => handleCategoryPress(item.slug)}
                iconName={item.icon_name}
              />
            )}
          />
        </View>

        {/* Promo Banner */}
        <View style={styles.promoBanner}>
          <View style={styles.promoContent}>
            <Text style={styles.promoEmoji}>🍫</Text>
            <View>
              <Text style={styles.promoTitle}>خصم 20%</Text>
              <Text style={styles.promoSubtitle}>على جميع الحلويات اليوم</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.promoBtn} onPress={() => router.push('/(tabs)/menu')}>
            <Text style={styles.promoBtnText}>تسوق الآن</Text>
          </TouchableOpacity>
        </View>

        {/* Featured */}
        <View style={styles.sectionGap}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="auto-awesome" size={22} color={Colors.softGold} />
            <Text style={styles.sectionTitle}>المميزة</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          {featuredLoading ? (
            <FlatList
              data={[1, 2, 3]}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(i) => String(i)}
              contentContainerStyle={styles.productsList}
              renderItem={() => <ProductCardSkeleton />}
            />
          ) : (
            <FlatList
              data={featured}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id}
              contentContainerStyle={styles.productsList}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  localizedName={localize(item, 'name')}
                  onPress={() => router.push(`/product/${item.id}`)}
                  onAddToCart={() => handleAddToCart(item)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggle(item.id)}
                />
              )}
            />
          )}
        </View>

        {/* Most Ordered */}
        <View style={styles.mostOrderedWrap}>
          <View style={styles.sectionTitleRow}>
            <MaterialIcons name="emoji-events" size={22} color={Colors.softGold} />
            <Text style={styles.sectionTitle}>الأكثر طلباً</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/menu')}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          {menuLoading ? (
            <View style={styles.gridSkeleton}>
              {[1, 2, 3, 4].map((i) => <ProductCardSkeleton key={i} />)}
            </View>
          ) : menuProducts.length === 0 ? (
            <View style={styles.emptyResults}>
              <Text style={styles.emptyTitle}>{t.search.noResults}</Text>
              <Text style={styles.emptySubtitle}>{t.search.noResultsSubtitle}</Text>
            </View>
          ) : (
            <FlatList
              data={menuProducts}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(p) => p.id}
              contentContainerStyle={styles.productsList}
              renderItem={({ item }) => (
                <ProductCard
                  product={item}
                  localizedName={localize(item, 'name')}
                  onPress={() => router.push(`/product/${item.id}`)}
                  onAddToCart={() => handleAddToCart(item)}
                  isFavorite={isFavorite(item.id)}
                  onToggleFavorite={() => toggle(item.id)}
                />
              )}
            />
          )}
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  flatList: {
    paddingBottom: 200,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: Spacing[4],
  },
  greeting: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primaryBrown,
    fontFamily: FontFamily.semiBold,
    textAlign: 'right',
  },
  subGreeting: {
    fontSize: 15,
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    marginTop: 2,
    textAlign: 'right',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[4],
  },
  headerText: {
    alignItems: 'flex-end',
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  logoCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 23,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing[6],
    paddingHorizontal: Spacing[5],
    height: 54,
    borderRadius: 27,
    gap: Spacing[3],
    ...Shadows.md,
  },
  searchPlaceholder: {
    fontSize: 15,
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    flex: 1,
    textAlign: 'right',
  },
  loyaltySection: {
    paddingHorizontal: Spacing[6],
    marginTop: Spacing[5],
  },
  bannersContainer: {
    paddingHorizontal: Spacing[6],
    marginTop: Spacing[5],
    gap: Spacing[4],
  },
  sectionGap: {
    marginTop: Spacing[7],
  },
  sectionLabel: {
    fontSize: 15,
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  categoriesList: {
    paddingHorizontal: Spacing[6],
    gap: Spacing[4],
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryBrown,
    marginHorizontal: Spacing[6],
    marginTop: Spacing[6],
    paddingVertical: Spacing[4],
    paddingHorizontal: Spacing[5],
    borderRadius: Radius['3xl'],
    ...Shadows.lg,
  },
  promoContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  promoEmoji: {
    fontSize: 32,
  },
  promoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
  },
  promoSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
    fontFamily: FontFamily.regular,
    marginTop: 1,
  },
  promoBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: 20,
  },
  promoBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.white,
    fontFamily: FontFamily.semiBold,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryBrown,
    fontFamily: FontFamily.semiBold,
    flex: 1,
    textAlign: 'right',
  },
  seeAllText: {
    fontSize: 13,
    color: Colors.softGold,
    fontFamily: FontFamily.regular,
  },
  productsList: {
    paddingHorizontal: Spacing[6],
    gap: Spacing[4],
    paddingRight: Spacing[6],
  },
  mostOrderedWrap: {
    marginTop: Spacing[6],
    marginBottom: Spacing[6],
  },
  gridSkeleton: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing[4],
    gap: Spacing[4],
  },
  emptyResults: {
    alignItems: 'center',
    paddingVertical: Spacing[10],
    paddingHorizontal: Spacing[6],
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: FontFamily.semiBold,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    marginTop: Spacing[2],
    textAlign: 'center',
  },
  skeletonItem: {
    backgroundColor: Colors.skeletonBase,
    borderRadius: Radius['2xl'],
  },

  // ── Loyalty Card ─────────────────────────────────────
  loyaltyCard: {
    backgroundColor: Colors.primaryBrown,
    borderRadius: Radius['2xl'],
    padding: Spacing[5],
    position: 'relative',
    overflow: 'hidden',
    ...Shadows.md,
  },
  loyaltyBgCircle1: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  loyaltyBgCircle2: {
    position: 'absolute',
    bottom: -40,
    left: -20,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  loyaltyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rtl: { flexDirection: 'row-reverse' },
  loyaltyLeft: {
    gap: Spacing[1],
  },
  loyaltyTierBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  loyaltyTierText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.xs,
    textTransform: 'uppercase',
  },
  loyaltyPoints: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['5xl'],
    color: Colors.white,
    marginTop: Spacing[1],
  },
  loyaltyPointsLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.7)',
  },
  loyaltyProgressWrap: {
    marginTop: Spacing[2],
    gap: Spacing[1],
  },
  loyaltyProgressBar: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    width: 160,
  },
  loyaltyProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  loyaltyProgressLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },
  loyaltyRight: {
    alignItems: 'center',
    gap: Spacing[1],
  },
  loyaltyQrIcon: {
    width: 56,
    height: 56,
    borderRadius: Radius.lg,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loyaltyScanHint: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: 'rgba(255,255,255,0.6)',
  },
});
