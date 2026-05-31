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
import { useTranslation } from '../../hooks/useTranslation';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  localizedName: string;
  onPress: () => void;
  onAddToCart: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  /** Explicit pixel width — used by horizontal carousels.
   *  Omit to fill the parent (used by the menu grid). */
  width?: number;
}

// Square images keep card heights identical regardless of source ratio.
// We size the image area with explicit pixel width AND height — `aspectRatio: 1`
// and `width/height: '100%'` both fail in production: RN Web's Image (background-image
// wrapper) doesn't track an aspect-ratio'd parent height, and iOS native Image
// with percentage dimensions occasionally renders blank when the parent's pixel
// width is computed from `width: '100%'` of a flex child.
const DEFAULT_IMAGE_SIZE = 160;

export function ProductCard({
  product,
  localizedName,
  onPress,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
  width,
}: ProductCardProps) {
  const { isRTL } = useTranslation();
  const imageSize = width && width > 0 ? width : DEFAULT_IMAGE_SIZE;

  return (
    <TouchableOpacity
      style={[styles.card, width !== undefined ? { width } : styles.cardFlex]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.imageContainer, { width: imageSize, height: imageSize }]}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={{ width: imageSize, height: imageSize }}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.imagePlaceholder, { width: imageSize, height: imageSize }]}>
            <MaterialIcons name="local-cafe" size={36} color={Colors.softMocha} />
          </View>
        )}

        <View style={[styles.badgeRow, isRTL ? styles.badgeRowRTL : styles.badgeRowLTR]}>
          {product.is_new && <Badge label="New" variant="new" />}
          {product.tags?.includes('bestseller') && (
            <Badge label="⭐" variant="bestseller" style={{ marginLeft: 4 }} />
          )}
        </View>

        {onToggleFavorite && (
          <TouchableOpacity
            style={[styles.favoriteBtn, isRTL ? styles.favoriteBtnRTL : styles.favoriteBtnLTR]}
            onPress={onToggleFavorite}
          >
            <MaterialIcons
              name={isFavorite ? 'favorite' : 'favorite-border'}
              size={20}
              color={isFavorite ? Colors.error : Colors.white}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text
          style={[styles.name, isRTL && styles.nameRTL]}
          numberOfLines={2}
        >
          {localizedName}
        </Text>
        <View style={[styles.footer, isRTL && styles.footerRTL]}>
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
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardFlex: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    backgroundColor: Colors.backgroundSecondary,
  },
  imagePlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeRow: {
    position: 'absolute',
    top: Spacing[2],
    flexDirection: 'row',
  },
  badgeRowLTR: { left: Spacing[2] },
  badgeRowRTL: { right: Spacing[2] },
  favoriteBtn: {
    position: 'absolute',
    top: Spacing[2],
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.overlayDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  favoriteBtnLTR: { right: Spacing[2] },
  favoriteBtnRTL: { left: Spacing[2] },
  content: {
    padding: Spacing[3],
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textPrimary,
    marginBottom: Spacing[2],
    lineHeight: 18,
    minHeight: 36, // reserve room for 2 lines so every card has equal height
  },
  nameRTL: { textAlign: 'right' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerRTL: { flexDirection: 'row-reverse' },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primaryBrown,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
