import React from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { ScreenWrapper } from '../../src/components/layout/ScreenWrapper';
import { CartItemCard } from '../../src/components/cart/CartItemCard';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Button } from '../../src/components/ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useCartStore } from '../../src/store/useCartStore';
import { Colors, FontFamily, FontSize, Spacing, Shadows } from '../../src/theme';

export default function Cart() {
  const { t, language, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { items, removeItem, updateQuantity, getTotal } = useCartStore();

  const total = getTotal();

  if (items.length === 0) {
    return (
      <ScreenWrapper>
        <View style={styles.header}>
          <Text style={[styles.title, isRTL && styles.rtlText]}>{t.cart.title}</Text>
        </View>
        <EmptyState
          icon="shopping-bag"
          title={t.cart.empty}
          subtitle={t.cart.emptySubtitle}
          actionLabel={t.cart.browseMenu}
          onAction={() => router.push('/(tabs)/menu')}
        />
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <View style={styles.header}>
        <Text style={[styles.title, isRTL && styles.rtlText]}>{t.cart.title}</Text>
        <Text style={styles.itemCount}>
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItemCard
            id={item.id}
            product={item.product}
            localizedName={localize(item.product, 'name')}
            quantity={item.quantity}
            unitPrice={item.unit_price}
            options={item.selected_options}
            language={language}
            onIncrement={() => updateQuantity(item.id, item.quantity + 1)}
            onDecrement={() => updateQuantity(item.id, item.quantity - 1)}
            onRemove={() => removeItem(item.id)}
          />
        )}
        ListFooterComponent={<View style={styles.listFooter} />}
      />

      {/* Summary */}
      <View style={styles.summary}>
        <View style={[styles.summaryRow, isRTL && styles.rtl]}>
          <Text style={styles.summaryLabel}>{t.cart.subtotal}</Text>
          <Text style={styles.summaryValue}>₪{total.toFixed(0)}</Text>
        </View>
        <View style={[styles.divider]} />
        <View style={[styles.summaryRow, isRTL && styles.rtl]}>
          <Text style={styles.totalLabel}>{t.cart.total}</Text>
          <Text style={styles.totalValue}>₪{total.toFixed(0)}</Text>
        </View>
        <Button
          label={t.cart.checkout}
          onPress={() => router.push('/checkout')}
          fullWidth
          size="lg"
          style={styles.checkoutBtn}
        />
      </View>
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
  itemCount: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  list: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[2],
  },
  listFooter: {
    height: Spacing[4],
  },
  summary: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[5],
    paddingBottom: Spacing[8],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.lg,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  rtl: { flexDirection: 'row-reverse' },
  summaryLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing[3],
  },
  totalLabel: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  totalValue: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xl,
    color: Colors.primaryBrown,
  },
  checkoutBtn: {
    marginTop: Spacing[4],
  },
});
