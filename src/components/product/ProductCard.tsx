import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
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
  style?: ViewStyle;
  /** Explicit pixel width — used by horizontal carousels.
   *  Omit to fill the parent (used by the menu grid). */
  width?: number;
}

function StarRow({ rating }: { rating?: number }) {
  const r = rating ?? 0;
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (r >= i) {
      stars.push(<MaterialIcons key={i} name="star" size={12} color={Colors.rating} />);
    } else if (r >= i - 0.5) {
      stars.push(<MaterialIcons key={i} name="star-half" size={12} color={Colors.rating} />);
    } else {
      stars.push(<MaterialIcons key={i} name="star-outline" size={12} color={Colors.border} />);
    }
  }
  return <View style={{ flexDirection: 'row', gap: 1 }}>{stars}</View>;
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
  style,
  width,
}: ProductCardProps) {
  const { isRTL } = useTranslation();
  const imageSize = width && width > 0 ? width : DEFAULT_IMAGE_SIZE;

  return (
    <TouchableOpacity
      style={[styles.card, width !== undefined ? { width } : styles.cardFlex, style]}
      onPress={onPress}
      activeOpacity={0.9}
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
            <MaterialIcons name="local-cafe" size={40} color={Colors.softMocha} />
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
            <View style={styles.favoriteGlow}>
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={18}
                color={isFavorite ? Colors.error : Colors.white}
              />
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.name, isRTL && styles.nameRTL]} numberOfLines={2}>
          {localizedName}
        </Text>

        <View style={styles.ratingRow}>
          <StarRow rating={product.rating} />
          <Text style={styles.ratingText}>{product.rating?.toFixed(1) ?? ''}</Text>
          {product.prep_time_min ? (
            <View style={styles.prepBadge}>
              <MaterialIcons name="access-time" size={10} color={Colors.textMuted} />
              <Text style={styles.prepText}>{product.prep_time_min} د</Text>
            </View>
          ) : null}
        </View>

        <View style={[styles.footer, isRTL && styles.footerRTL]}>
          <Text style={styles.price}>₪{product.price.toFixed(0)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart} activeOpacity={0.8}>
            <MaterialIcons name="add" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  cardFlex: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
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
    borderRadius: Radius.full,
    backgroundColor: Colors.glassmorphism,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  favoriteGlow: {
  favoriteBtnLTR: { right: Spacing[2] },
  favoriteBtnRTL: { left: Spacing[2] },
  content: {
    padding: Spacing[3],
    gap: Spacing[1.5],
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing[2],
    lineHeight: 18,
    minHeight: 36,
  },
  nameRTL: { textAlign: 'right' },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
    height: 18,
  },
  ratingText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.rating,
    marginLeft: 2,
  },
  prepBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: Colors.backgroundSecondary,
    paddingHorizontal: Spacing[1.5],
    paddingVertical: Spacing[0.5],
    borderRadius: Radius.sm,
  },
  prepText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
  },
  nameRTL: { textAlign: 'right' },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[1],
  },
  footerRTL: { flexDirection: 'row-reverse' },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.primaryBrown,
  },
  addButton: {
    width: 34,
    height: 34,
    borderRadius: Radius.full,
    backgroundColor: Colors.primaryBrown,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.float,
  },
});
