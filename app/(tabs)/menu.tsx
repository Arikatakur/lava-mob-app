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
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows, Layout } from '../../src/theme';
import type { Product } from '../../src/types';

const SCREEN_PAD = Layout.screenPaddingHorizontal;
const CARD_GAP = Layout.cardGap;

export default function Menu() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const { width: screenW } = useWindowDimensions();

  const { category, focus } = useLocalSearchParams<{ category?: string; focus?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(category ?? 'all');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searching, setSearching] = useState(false);
  const searchRef = useRef<TextInput>(null);
  const queryRef = useRef('');

  const { categories } = useCategories();
  const { products, loading } = useProducts(selectedCategory !== 'all' ? selectedCategory : undefined);

  const gridCardWidth = Math.floor((screenW - SCREEN_PAD * 2 - CARD_GAP) / 2);

  const allCategories = [
    { id: 'all', name_en: t.common.all, name_he: t.common.all, name_ar: t.common.all, slug: 'all', sort_order: 0, is_active: true },
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
          <Text style={styles.title}>
            {isSearching ? t.search.title : t.menu.title}
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
        ItemSeparatorComponent={() => <View style={{ width: Spacing[2] }} />}
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
          renderItem={() => <ProductCardSkeleton width={gridCardWidth} />}
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
            <ProductCard
              product={item}
              localizedName={localize(item, 'name')}
              onPress={() => router.push(`/product/${item.id}`)}
              onAddToCart={() => addItem(item, 1, [])}
              isFavorite={isFavorite(item.id)}
              onToggleFavorite={() => toggle(item.id)}
              width={gridCardWidth}
            />
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
    paddingHorizontal: Spacing[5],
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
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginHorizontal: Spacing[5],
    paddingHorizontal: Spacing[4],
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
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[3],
    textAlign: 'right',
  },
  categoriesRow: {
    flexGrow: 0,
    marginBottom: Spacing[2],
  },
  categoriesList: {
    paddingHorizontal: Spacing[5],
    gap: Spacing[4],
    paddingRight: Spacing[5],
  },
  grid: {
    paddingHorizontal: Spacing[5],
    paddingBottom: Spacing[24],
    gap: Spacing[3],
  },
  row: {
    justifyContent: 'space-between',
  },
  productsContainer: {
    flex: 1,
  },
});
