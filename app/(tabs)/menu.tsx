import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
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
import { Colors, FontFamily, FontSize, Radius, Spacing, Layout } from '../../src/theme';
import type { Product } from '../../src/types';

const SCREEN_PAD = Layout.screenPaddingHorizontal; // 16
const CARD_GAP = Layout.cardGap;                   // 12

export default function Menu() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();
  const { width: screenW } = useWindowDimensions();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState<Product[] | null>(null);
  const [searching, setSearching] = useState(false);

  const { categories } = useCategories();
  const { products, loading } = useProducts(selectedCategory !== 'all' ? selectedCategory : undefined);

  // Compute equal-width grid cells: 2 columns, 16px outer + 12px center gap
  const gridCardWidth = Math.floor((screenW - SCREEN_PAD * 2 - CARD_GAP) / 2);

  const allCategories = [
    { id: 'all', name_en: t.common.all, name_he: t.common.all, name_ar: t.common.all, slug: 'all', sort_order: 0, is_active: true },
    ...categories,
  ];

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults(null);
      return;
    }
    setSearching(true);
    try {
      const results = await productsService.searchProducts(query.trim());
      setSearchResults(results);
    } catch {
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  };

  const displayedProducts = searchResults ?? products;
  const isSearching = searchQuery.length > 0;

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.alignRight]}>
          {isSearching ? t.search.title : t.menu.title}
        </Text>
      </View>

      {/* Search Bar */}
      <View style={[styles.searchBar, isRTL && styles.rtl]}>
        <MaterialIcons name="search" size={20} color={Colors.textSecondary} />
        <TextInput
          style={[styles.searchInput, isRTL && styles.alignRight]}
          placeholder={t.home.searchPlaceholder}
          placeholderTextColor={Colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearch}
          textAlign={isRTL ? 'right' : 'left'}
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <MaterialIcons name="close" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Categories (hidden during search) */}
      {!isSearching && (
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
              onPress={() => setSelectedCategory(item.slug)}
            />
          )}
        />
      )}

      {/* Products Grid */}
      {loading || searching ? (
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
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: SCREEN_PAD,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
  },
  alignRight: { textAlign: 'right' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    marginHorizontal: SCREEN_PAD,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2.5],
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing[2],
    marginBottom: Spacing[4],
  },
  rtl: { flexDirection: 'row-reverse' },
  searchInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  categoriesRow: {
    marginBottom: Spacing[4],
  },
  categoriesList: {
    paddingHorizontal: SCREEN_PAD,
  },
  grid: {
    paddingHorizontal: SCREEN_PAD,
    paddingBottom: Spacing[10],
    gap: CARD_GAP,
  },
  row: {
    gap: CARD_GAP,
  },
});
