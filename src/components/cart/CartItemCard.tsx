import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { QuantityStepper } from '../ui/QuantityStepper';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../theme';
import type { Product, SelectedOption } from '../../types';

interface CartItemCardProps {
  id: string;
  product: Product;
  localizedName: string;
  quantity: number;
  unitPrice: number;
  options: SelectedOption[];
  language: 'he' | 'en';
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}

export function CartItemCard({
  product,
  localizedName,
  quantity,
  unitPrice,
  options,
  language,
  onIncrement,
  onDecrement,
  onRemove,
}: CartItemCardProps) {
  const optionLabel = (o: SelectedOption) =>
    language === 'he' ? o.name_he : o.name_en;

  return (
    <View style={styles.card}>
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
            <MaterialIcons name="local-cafe" size={28} color={Colors.softMocha} />
          </View>
        )}
      </View>

      {/* Details */}
      <View style={styles.details}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={2}>
            {localizedName}
          </Text>
          <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
            <MaterialIcons name="close" size={18} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {options.length > 0 && (
          <Text style={styles.options} numberOfLines={1}>
            {options.map(optionLabel).join(' · ')}
          </Text>
        )}

        <View style={styles.bottomRow}>
          <Text style={styles.price}>₪{(unitPrice * quantity).toFixed(0)}</Text>
          <QuantityStepper
            value={quantity}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            size="sm"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[3],
    marginBottom: Spacing[3],
    ...Shadows.sm,
  },
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: Radius.md,
    overflow: 'hidden',
    marginRight: Spacing[3],
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
  details: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[1],
  },
  name: {
    flex: 1,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    lineHeight: 20,
    marginRight: Spacing[2],
  },
  removeBtn: {
    padding: 2,
  },
  options: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing[2],
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primaryBrown,
  },
});
