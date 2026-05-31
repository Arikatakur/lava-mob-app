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
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  localizedName: string;
  onPress: () => void;
  onAddToCart: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  style?: ViewStyle;
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

export function ProductCard({
  product,
  localizedName,
  onPress,
  onAddToCart,
  isFavorite = false,
  onToggleFavorite,
  style,
}: ProductCardProps) {
  return (
    <TouchableOpacity style={[styles.card, style]} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        {product.image_url ? (
          <Image
            source={{ uri: product.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <MaterialIcons name="local-cafe" size={40} color={Colors.softMocha} />
          </View>
        )}

        <View style={styles.badgeRow}>
          {product.is_new && <Badge label="New" variant="new" />}
          {product.tags?.includes('bestseller') && (
            <Badge label="⭐" variant="bestseller" style={{ marginLeft: 4 }} />
          )}
        </View>

        {onToggleFavorite && (
          <TouchableOpacity style={styles.favoriteBtn} onPress={onToggleFavorite}>
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
        <Text style={styles.name} numberOfLines={1}>
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

        <View style={styles.footer}>
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
    width: 165,
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    ...Shadows.sm,
  },
  imageContainer: {
    width: '100%',
    height: 145,
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
  },
  favoriteGlow: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    backgroundColor: Colors.glassmorphism,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    padding: Spacing[3],
    gap: Spacing[1.5],
  },
  name: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[1],
  },
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
