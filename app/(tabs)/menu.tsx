import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { ProductCard } from '../../src/components/product/ProductCard';
import { CategoryChip } from '../../src/components/product/CategoryChip';
import { ProductCardSkeleton } from '../../src/components/ui/SkeletonLoader';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useCategories, useProducts } from '../../src/hooks/useProducts';
import { productsService } from '../../src/services/products.service';
import { useCartStore } from '../../src/store/useCartStore';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';
import type { Product } from '../../src/types';

export default function Menu() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();

  const { category, focus } = useLocalSearchParams<{ category?: string; focus?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category ?? 'all');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<TextInput>(null);
  const queryRef = useRef('');

  const { categories } = useCategories();
  const { products, loading } = useProducts(selectedCategory !== 'all' ? selectedCategory : undefined);

  const { width: screenWidth } = useWindowDimensions();
  const CARD_GAP = Spacing[3]; // 12
  const GRID_PADDING = Spacing[5]; // 20
  const cardWidth = useMemo(
    () => (screenWidth - GRID_PADDING * 2 - CARD_GAP) / 2,
    [screenWidth],
  );
  const allCategories = [
    { id: 'all', name_en: 'All', name_he: 'הכל', slug: 'all', sort_order: 0, is_active: true },
    ...categories,
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  useEffect(() => {
    if (category) setSelectedCategory(category);
  }, [category]);

  useEffect(() => {
    if (focus === '1' && searchRef.current) {
      searchRef.current.focus();
    }
  }, [focus]);

  useEffect(() => {
    queryRef.current = searchQuery;
    setSearching(true);

    if (!searchQuery.trim()) {
      setSearchResults(null);
      setSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await productsService.searchProducts(searchQuery.trim());
        if (queryRef.current === searchQuery) {
          setSearchResults(results);
        }
      } catch {
        if (queryRef.current === searchQuery) {
          setSearchResults([]);
        }
      } finally {
        if (queryRef.current === searchQuery) {
          setSearching(false);
        }
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayedProducts = searchResults ?? products;
  const isSearching = searchQuery.length > 0;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.topBar}>
        <View style={styles.headerRight}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>
            {isSearching ? t.search.title : 'القائمة'}
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, isRTL && styles.rtl]}>
        <TouchableOpacity onPress={() => searchRef.current?.focus()}>
          <MaterialIcons name="search" size={20} color={Colors.textMuted} />
        </TouchableOpacity>
        <TextInput
          ref={searchRef}
          style={[styles.searchInput, isRTL && styles.rtlInput]}
          placeholder={t.home.searchPlaceholder}
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          textAlign={isRTL ? 'right' : 'left'}
          autoFocus={focus === '1'}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <MaterialIcons name="close" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories */}
      <Text style={styles.sectionLabel}>الفئات</Text>
      <FlatList
        data={allCategories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(c) => c.id}
        contentContainerStyle={styles.categoriesList}
        style={styles.categoriesRow}
        renderItem={({ item }) => (
          <CategoryChip
            label={localize(item, 'name')}
            isSelected={selectedCategory === item.slug}
            onPress={() => {
              setSelectedCategory(item.slug);
              if (searchQuery) handleSearch('');
            }}
          />
        )}
      />

      {/* Promo Banner */}
      <View style={styles.promoBanner}>
        <View style={styles.promoContent}>
          <Text style={styles.promoEmoji}>🧁</Text>
          <View>
            <Text style={styles.promoTitle}>تشكيلة جديدة</Text>
            <Text style={styles.promoSubtitle}>جربي كب كيك الفانيليا</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.promoBtn} activeOpacity={0.8}>
          <Text style={styles.promoBtnText}>استكشاف</Text>
        </TouchableOpacity>
      </View>

      {/* Products Grid */}
      <View style={styles.productsContainer}>
      {searching ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(i) => String(i)}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={() => <ProductCardSkeleton />}
        />
      ) : loading && !isSearching ? (
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          numColumns={2}
          keyExtractor={(i) => String(i)}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={() => <ProductCardSkeleton />}
        />
      ) : displayedProducts.length === 0 ? (
        <EmptyState
          icon="search-off"
          title={t.search.noResults}
          subtitle={t.search.noResultsSubtitle}
        />
      ) : (
        <FlatList
          data={displayedProducts}
          numColumns={2}
          keyExtractor={(p) => p.id}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <ProductCard
                product={item}
                localizedName={localize(item, 'name')}
                onPress={() => router.push(`/product/${item.id}`)}
                onAddToCart={() => addItem(item, 1, [])}
                isFavorite={isFavorite(item.id)}
                onToggleFavorite={() => toggle(item.id)}
                style={{ width: cardWidth }}
              />
            </View>
          )}
        />
      )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  headerRight: {
    flex: 1,
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.primaryBrown,
    textAlign: 'right',
  },
  rtlText: { textAlign: 'right' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing[6],
    paddingHorizontal: Spacing[5],
    height: 52,
    borderRadius: 26,
    gap: Spacing[3],
    marginBottom: Spacing[5],
    ...Shadows.md,
  },
  rtl: { flexDirection: 'row-reverse' },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
  },
  rtlInput: { textAlign: 'right' },
  sectionLabel: {
    fontSize: 15,
    color: Colors.textMuted,
    fontFamily: FontFamily.regular,
    paddingHorizontal: Spacing[6],
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  categoriesRow: {
    flexGrow: 0,
    marginBottom: Spacing[2],
  },
  categoriesList: {
    paddingHorizontal: Spacing[6],
    gap: Spacing[4],
    paddingRight: Spacing[6],
  },
  promoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primaryBrown,
    marginHorizontal: Spacing[6],
    marginTop: Spacing[4],
    marginBottom: Spacing[5],
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
  grid: {
    paddingHorizontal: Spacing[6],
    paddingBottom: Spacing[24],
    gap: Spacing[3],
  },
  row: {
    justifyContent: 'space-between',
  },
  cardWrapper: {
    alignItems: 'center',
  },
  productsContainer: {
    flex: 1,
  },
});
