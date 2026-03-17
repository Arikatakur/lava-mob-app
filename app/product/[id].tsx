import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Button } from '../../src/components/ui/Button';
import { Badge } from '../../src/components/ui/Badge';
import { QuantityStepper } from '../../src/components/ui/QuantityStepper';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useProduct } from '../../src/hooks/useProducts';
import { useCartStore } from '../../src/store/useCartStore';
import { useFavoritesStore } from '../../src/store/useFavoritesStore';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';
import type { SelectedOption, ProductOption } from '../../src/types';

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.75;

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { product, loading } = useProduct(id);
  const { addItem } = useCartStore();
  const { isFavorite, toggle } = useFavoritesStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Map<string, ProductOption>>(new Map());
  const [addedToCart, setAddedToCart] = useState(false);

  if (loading || !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingPlaceholder} />
      </SafeAreaView>
    );
  }

  const name = localize(product, 'name');
  const description = localize(product, 'description');
  const favorite = isFavorite(product.id);

  // Group options by type
  const optionGroups = (product.options ?? []).reduce<Record<string, ProductOption[]>>(
    (acc, opt) => {
      (acc[opt.option_type] ??= []).push(opt);
      return acc;
    },
    {},
  );

  const selectOption = (option: ProductOption) => {
    setSelectedOptions((prev) => {
      const next = new Map(prev);
      next.set(option.option_type, option);
      return next;
    });
  };

  const getOptionsDelta = () =>
    Array.from(selectedOptions.values()).reduce((sum, o) => sum + o.price_delta, 0);

  const totalPrice = (product.price + getOptionsDelta()) * quantity;

  const handleAddToCart = () => {
    const options: SelectedOption[] = Array.from(selectedOptions.values()).map((o) => ({
      option_id: o.id,
      option_type: o.option_type,
      name_en: o.name_en,
      name_he: o.name_he,
      price_delta: o.price_delta,
    }));
    addItem(product, quantity, options);
    setAddedToCart(true);
    setTimeout(() => {
      router.back();
    }, 600);
  };

  const optionTypeLabel = (type: string) => {
    const labels: Record<string, { en: string; he: string }> = {
      size: { en: t.product.size, he: 'גודל' },
      milk: { en: t.product.milk, he: 'חלב' },
      extra: { en: t.product.extra, he: 'תוספות' },
      temperature: { en: t.product.temperature, he: 'טמפרטורה' },
    };
    return language === 'he' ? labels[type]?.he ?? type : labels[type]?.en ?? type;
  };

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.imageContainer}>
          {product.image_url ? (
            <Image
              source={{ uri: product.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <MaterialIcons name="local-cafe" size={80} color={Colors.softMocha} />
            </View>
          )}

          {/* Back & Favorite */}
          <View style={[styles.topActions, isRTL && styles.rtl]}>
            <TouchableOpacity style={styles.actionBtn} onPress={() => router.back()}>
              <MaterialIcons
                name={isRTL ? 'chevron-right' : 'chevron-left'}
                size={28}
                color={Colors.textPrimary}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={() => toggle(product.id)}>
              <MaterialIcons
                name={favorite ? 'favorite' : 'favorite-border'}
                size={24}
                color={favorite ? Colors.error : Colors.textPrimary}
              />
            </TouchableOpacity>
          </View>

          {/* Badges */}
          <View style={styles.badgeRow}>
            {product.is_new && <Badge label={t.product.new} variant="new" />}
            {product.tags?.includes('bestseller') && (
              <Badge label={t.product.bestseller} variant="bestseller" style={{ marginLeft: 6 }} />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Name & Price */}
          <View style={[styles.nameRow, isRTL && styles.rtl]}>
            <Text style={[styles.name, isRTL && styles.rtlText]} numberOfLines={2}>
              {name}
            </Text>
            <Text style={styles.price}>₪{product.price.toFixed(0)}</Text>
          </View>

          {/* Meta */}
          {(product.prep_time_min || product.calories) && (
            <View style={[styles.metaRow, isRTL && styles.rtl]}>
              {product.prep_time_min && (
                <View style={[styles.metaItem, isRTL && styles.rtl]}>
                  <MaterialIcons name="schedule" size={16} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>
                    {product.prep_time_min} {t.product.minutes}
                  </Text>
                </View>
              )}
              {product.calories && (
                <View style={[styles.metaItem, isRTL && styles.rtl]}>
                  <MaterialIcons name="local-fire-department" size={16} color={Colors.textSecondary} />
                  <Text style={styles.metaText}>{product.calories} kcal</Text>
                </View>
              )}
            </View>
          )}

          {/* Description */}
          {description && (
            <Text style={[styles.description, isRTL && styles.rtlText]}>
              {description}
            </Text>
          )}

          {/* Options */}
          {Object.entries(optionGroups).map(([type, opts]) => (
            <View key={type} style={styles.optionGroup}>
              <Text style={[styles.optionGroupTitle, isRTL && styles.rtlText]}>
                {optionTypeLabel(type)}
              </Text>
              <View style={[styles.optionRow, isRTL && styles.rtl]}>
                {opts.map((opt) => {
                  const isSelected = selectedOptions.get(type)?.id === opt.id;
                  return (
                    <TouchableOpacity
                      key={opt.id}
                      style={[styles.optionChip, isSelected && styles.optionChipSelected]}
                      onPress={() => selectOption(opt)}
                    >
                      <Text style={[styles.optionLabel, isSelected && styles.optionLabelSelected]}>
                        {language === 'he' ? opt.name_he : opt.name_en}
                        {opt.price_delta !== 0 && (
                          ` (+₪${opt.price_delta})`
                        )}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View style={styles.bottomBar}>
        <View style={[styles.bottomContent, isRTL && styles.rtl]}>
          <View>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalPrice}>₪{totalPrice.toFixed(0)}</Text>
          </View>
          <View style={styles.qtyAndCart}>
            <QuantityStepper
              value={quantity}
              onIncrement={() => setQuantity((q) => q + 1)}
              onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
            />
            <Button
              label={addedToCart ? '✓ Added!' : t.product.addToCart}
              onPress={handleAddToCart}
              size="md"
              style={styles.cartBtn}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  loadingPlaceholder: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  imageContainer: {
    width,
    height: IMAGE_HEIGHT,
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
  },
  topActions: {
    position: 'absolute',
    top: Spacing[5],
    left: Spacing[4],
    right: Spacing[4],
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rtl: { flexDirection: 'row-reverse' },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
  badgeRow: {
    position: 'absolute',
    bottom: Spacing[4],
    left: Spacing[4],
    flexDirection: 'row',
  },
  content: {
    padding: Spacing[5],
    paddingBottom: Spacing[4],
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[3],
    gap: Spacing[4],
  },
  name: {
    flex: 1,
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.textPrimary,
    lineHeight: 30,
  },
  rtlText: { textAlign: 'right' },
  price: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['2xl'],
    color: Colors.primaryBrown,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing[4],
    marginBottom: Spacing[4],
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[1],
  },
  metaText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  description: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: Spacing[5],
  },
  optionGroup: {
    marginBottom: Spacing[5],
  },
  optionGroupTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginBottom: Spacing[3],
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[2],
  },
  optionChip: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  optionChipSelected: {
    backgroundColor: Colors.primaryBrown,
    borderColor: Colors.primaryBrown,
  },
  optionLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  optionLabelSelected: {
    color: Colors.white,
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
    paddingHorizontal: Spacing[5],
    ...Shadows.xl,
  },
  bottomContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  totalPrice: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primaryBrown,
  },
  qtyAndCart: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  cartBtn: {
    minWidth: 140,
  },
});
