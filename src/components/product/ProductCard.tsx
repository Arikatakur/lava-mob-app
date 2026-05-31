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

const CARD_IMAGE_RATIO = 0.7;

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
  const cardWidth = width ?? 165;
  const imageHeight = cardWidth * CARD_IMAGE_RATIO;

  return (
    <TouchableOpacity
      style={[styles.card, width !== undefined ? { width: cardWidth } : styles.cardFlex, style]}
      onPress={onPress}
      activeOpacity={0.95}
    >
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="local-cafe" size={36} color={Colors.softMocha} />
          </View>
        )}

        <View style={[styles.badgeRow, isRTL ? styles.badgeRowRTL : styles.badgeRowLTR]}>
          {product.is_new && <Badge label="New" variant="new" />}
        </View>

        {onToggleFavorite && (
          <TouchableOpacity
            style={[styles.favoriteBtn, isRTL ? styles.favoriteBtnRTL : styles.favoriteBtnLTR]}
            onPress={onToggleFavorite}
          >
            <View style={styles.favoriteGlow}>
              <MaterialIcons
                name={isFavorite ? 'favorite' : 'favorite-border'}
                size={16}
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
          {product.rating ? (
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
          ) : null}
        </View>

        <View style={[styles.footer, isRTL && styles.footerRTL]}>
          <Text style={styles.price}>₪{product.price.toFixed(0)}</Text>
          <TouchableOpacity style={styles.addButton} onPress={onAddToCart} activeOpacity={0.85}>
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
    ...Shadows.md,
  },
  cardFlex: {
    flex: 1,
  },
  imageContainer: {
    width: '100%',
    position: 'relative',
    backgroundColor: Colors.backgroundSecondary,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.backgroundSecondary,
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
  },
  favoriteGlow: {
    width: 30,
    height: 30,
    borderRadius: Radius.full,
    backgroundColor: Colors.glassmorphism,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
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
