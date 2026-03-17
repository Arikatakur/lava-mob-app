import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Badge } from '../ui/Badge';
import { Colors, FontFamily, FontSize, Radius, Shadows, Spacing } from '../../theme';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  localizedName: string;
  onPress: () => void;
  onAddToCart: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

export function ProductCard({
  product,
  localizedName,
  onPress,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
}: ProductCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      {/* Image */}
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="local-cafe" size={36} color={Colors.warmBeige} />
          </View>
        )}

        {/* Badges */}
        <View style={styles.badgeRow}>
          {product.is_new && <Badge label="New" variant="new" />}
          {product.tags?.includes('bestseller') && (
            <Badge label="⭐" variant="bestseller" style={{ marginLeft: 4 }} />
          )}
        </View>

        {/* Favorite */}
        {onToggleFavorite && (
          <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite}>
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={20}
              color={isFavorite ? Colors.error : Colors.white}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {localizedName}
        </Text>
        <View style={styles.footer}>
          <Text style={styles.price}>₪{product.price.toFixed(0)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart}>
            <MaterialIcons name="add" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    marginRight: Spacing[3],
    ...Shadows.md,
  },
  imageContainer: {
    width: '100%',
    height: 130,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    position: 'absolute',
    top: Spacing[2],
    left: Spacing[2],
    flexDirection: 'row',
  },
  favoriteBtn: {
    position: 'absolute',
    top: Spacing[2],
    right: Spacing[2],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: Spacing[3],
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primaryBrown,
  },
  addButton: {
    width: 28,
    height: 28,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
