import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { ProductCard } from '../../src/components/product/ProductCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { useCartStore } from '../../src/store/useCartStore';
import { favoritesService } from '../../src/services/favorites.service';
import { Colors, FontFamily, FontSize, Spacing } from '../../src/theme';
import type { Product } from '../../src/types';

export default function Favorites() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { favoriteIds, toggle } = useFavoritesStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    favoritesService.getFavoriteProducts(user.id)
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user, favoriteIds]);

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t.favorites.title}</Text>
      </View>

      {products.length === 0 && !loading ? (
        <EmptyState
          icon="favorite-border"
          title={t.favorites.empty}
          subtitle={t.favorites.emptySubtitle}
          actionLabel="Browse Menu"
          onAction={() => router.push('/(tabs)/menu')}
        />
      ) : (
        <FlatList
          data={products}
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
                isFavorite={true}
                onToggleFavorite={() => toggle(item.id)}
              />
            </View>
          )}
        />
      )}
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[3],
  },
  title: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.textPrimary,
  },
  rtlText: { textAlign: 'right' },
  grid: {
    paddingHorizontal: Spacing[4],
    paddingBottom: Spacing[10],
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  cardWrapper: {
    width: '48%',
  },
});
