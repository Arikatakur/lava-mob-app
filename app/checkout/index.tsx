import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/layout/Header';
import { Button } from '../../src/components/ui/Button';
import { useTranslation } from '../../src/hooks/useTranslation';
import { useLocalizedText } from '../../src/hooks/useLocalizedText';
import { useCartStore } from '../../src/store/useCartStore';
import { useAuthStore } from '../../src/store/useAuthStore';
import { ordersService } from '../../src/services/orders.service';
import { authService } from '../../src/services/auth.service';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';

type PaymentMethod = 'native_pay' | 'credit_card' | 'cash';

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
  return digits;
}

// Platform-aware native pay label
const NATIVE_PAY_LABEL = Platform.OS === 'ios' ? 'Apple Pay' : 'Google Pay';
const NATIVE_PAY_ICON: keyof typeof MaterialIcons.glyphMap =
  Platform.OS === 'ios' ? 'phone-iphone' : 'android';

export default function Checkout() {
  const { t, isRTL } = useTranslation();
  const { localize } = useLocalizedText();
  const { items, getTotal, clearCart } = useCartStore();
  const { user, setProfile } = useAuthStore();

  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const total = getTotal();

  const placeOrder = async () => {
    if (!user) {
      router.push('/(auth)/login');
      return;
    }
    setLoading(true);
    try {
      const orderItems = items.map((item) => ({
        product_id: item.product.id,
        product_name_en: item.product.name_en,
        product_name_he: item.product.name_he,
        quantity: item.quantity,
        unit_price: item.unit_price,
        selected_options: item.selected_options,
        subtotal: item.unit_price * item.quantity,
      }));

      const order = await ordersService.createOrder({
        user_id: user.id,
        subtotal: total,
        discount: 0,
        total_price: total,
        notes: notes.trim() || undefined,
        payment_method: paymentMethod,
        items: orderItems,
      });

      clearCart();

      // Refresh profile so points balance updates in the UI
      const updatedProfile = await authService.getProfile(user.id);
      if (updatedProfile) setProfile(updatedProfile);

      const pointsEarned = Math.floor(total);
      router.replace(
        `/checkout/success?orderId=${order.id}&orderNumber=${order.order_number}&pointsEarned=${pointsEarned}` as never,
      );
    } catch (e) {
      console.error('Order failed:', e);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === 'native_pay') {
      // Simulate native payment sheet confirmation
      const Alert = require('react-native').Alert;
      Alert.alert(
        NATIVE_PAY_LABEL,
        `Confirm payment of ₪${total.toFixed(0)}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Pay', onPress: placeOrder },
        ],
      );
    } else {
      placeOrder();
    }
  };

  const paymentOptions: { key: PaymentMethod; icon: keyof typeof MaterialIcons.glyphMap; label: string }[] = [
    { key: 'native_pay', icon: NATIVE_PAY_ICON, label: NATIVE_PAY_LABEL },
    { key: 'credit_card', icon: 'credit-card', label: t.checkout.creditCard },
    { key: 'cash', icon: 'payments', label: t.checkout.cash },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={t.checkout.title} showBack isRTL={isRTL} />

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t.checkout.orderSummary}
          </Text>
          <View style={styles.card}>
            {items.map((item) => (
              <View key={item.id} style={[styles.orderItem, isRTL && styles.rtl]}>
                <View style={[styles.orderItemLeft, isRTL && styles.rtl]}>
                  <View style={styles.qtyBadge}>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                  </View>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {localize(item.product, 'name')}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>
                  ₪{(item.unit_price * item.quantity).toFixed(0)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t.checkout.payment}
          </Text>
          <View style={styles.card}>
            {paymentOptions.map((opt, idx) => {
              const selected = paymentMethod === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    styles.paymentOption,
                    isRTL && styles.rtl,
                    selected && styles.paymentOptionSelected,
                    idx < paymentOptions.length - 1 && styles.paymentOptionBorder,
                  ]}
                  onPress={() => setPaymentMethod(opt.key)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.paymentLeft, isRTL && styles.rtl]}>
                    <View style={[
                      styles.paymentIconWrap,
                      selected && { backgroundColor: Colors.primaryBrown + '18' },
                    ]}>
                      <MaterialIcons
                        name={opt.icon}
                        size={20}
                        color={selected ? Colors.primaryBrown : Colors.textSecondary}
                      />
                    </View>
                    <Text style={[
                      styles.paymentLabel,
                      selected && { color: Colors.primaryBrown, fontFamily: FontFamily.semiBold },
                    ]}>
                      {opt.label}
                    </Text>
                  </View>
                  <View style={[
                    styles.paymentRadio,
                    selected && styles.paymentRadioSelected,
                  ]}>
                    {selected && <View style={styles.paymentRadioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Credit Card Form */}
          {paymentMethod === 'credit_card' && (
            <View style={[styles.cardForm, isRTL && styles.rtlCardForm]}>
              <View style={styles.cardInputWrap}>
                <Text style={[styles.cardLabel, isRTL && styles.rtlText]}>{t.checkout.cardNumber}</Text>
                <TextInput
                  style={[styles.cardInput, isRTL && styles.rtlInput]}
                  value={cardNumber}
                  onChangeText={(v) => setCardNumber(formatCardNumber(v))}
                  placeholder={t.checkout.cardNumberPlaceholder}
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="number-pad"
                  maxLength={19}
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              <View style={styles.cardInputWrap}>
                <Text style={[styles.cardLabel, isRTL && styles.rtlText]}>{t.checkout.cardName}</Text>
                <TextInput
                  style={[styles.cardInput, isRTL && styles.rtlInput]}
                  value={cardName}
                  onChangeText={setCardName}
                  placeholder={t.checkout.cardNamePlaceholder}
                  placeholderTextColor={Colors.textMuted}
                  autoCapitalize="words"
                  textAlign={isRTL ? 'right' : 'left'}
                />
              </View>
              <View style={[styles.cardRow, isRTL && styles.rtl]}>
                <View style={[styles.cardInputWrap, { flex: 1 }]}>
                  <Text style={[styles.cardLabel, isRTL && styles.rtlText]}>{t.checkout.expiry}</Text>
                  <TextInput
                    style={[styles.cardInput, isRTL && styles.rtlInput]}
                    value={expiry}
                    onChangeText={(v) => setExpiry(formatExpiry(v))}
                    placeholder={t.checkout.expiryPlaceholder}
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={5}
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                </View>
                <View style={[styles.cardInputWrap, { flex: 1 }]}>
                  <Text style={[styles.cardLabel, isRTL && styles.rtlText]}>{t.checkout.cvv}</Text>
                  <TextInput
                    style={[styles.cardInput, isRTL && styles.rtlInput]}
                    value={cvv}
                    onChangeText={(v) => setCvv(v.replace(/\D/g, '').slice(0, 4))}
                    placeholder="•••"
                    placeholderTextColor={Colors.textMuted}
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                    textAlign={isRTL ? 'right' : 'left'}
                  />
                </View>
              </View>
            </View>
          )}

          {/* Native Pay button (shown when native_pay selected, tapping places the order) */}
          {paymentMethod === 'native_pay' && (
            <TouchableOpacity style={styles.nativePayButton} onPress={handlePlaceOrder} activeOpacity={0.85}>
              <MaterialIcons name={NATIVE_PAY_ICON} size={20} color={Colors.white} />
              <Text style={styles.nativePayText}>{NATIVE_PAY_LABEL}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Notes */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>
            {t.checkout.notes}
          </Text>
          <View style={styles.card}>
            <TextInput
              style={[styles.notesInput, isRTL && styles.rtlInput]}
              placeholder={t.product.notesPlaceholder}
              placeholderTextColor={Colors.textMuted}
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={3}
              textAlign={isRTL ? 'right' : 'left'}
            />
          </View>
        </View>

        {/* Price Breakdown */}
        <View style={styles.section}>
          <View style={styles.card}>
            <View style={[styles.priceRow, isRTL && styles.rtl]}>
              <Text style={styles.priceLabel}>{t.cart.subtotal}</Text>
              <Text style={styles.priceValue}>₪{total.toFixed(0)}</Text>
            </View>
            <View style={[styles.priceRow, isRTL && styles.rtl]}>
              <Text style={styles.priceLabel}>{t.cart.discount}</Text>
              <Text style={[styles.priceValue, { color: Colors.success }]}>₪0</Text>
            </View>
            <View style={styles.divider} />
            <View style={[styles.priceRow, isRTL && styles.rtl]}>
              <Text style={styles.totalLabel}>{t.cart.total}</Text>
              <Text style={styles.totalValue}>₪{total.toFixed(0)}</Text>
            </View>
          </View>
        </View>

        {/* Points preview */}
        {user && (
          <View style={styles.pointsPreview}>
            <MaterialIcons name="star" size={16} color={Colors.accentCaramel} />
            <Text style={styles.pointsPreviewText}>
              {t.checkout.pointsEarn}{' '}
              <Text style={styles.pointsPreviewNum}>+{Math.floor(total)}</Text>{' '}
              {t.checkout.pointsUnit}
            </Text>
          </View>
        )}

        <View style={styles.termsNote}>
          <MaterialIcons name="info-outline" size={14} color={Colors.textMuted} />
          <Text style={styles.termsText}>{t.checkout.termsNote}</Text>
        </View>

        <View style={styles.bottomPad} />
      </ScrollView>

      {/* Place Order — hidden when native pay button is used above */}
      {paymentMethod !== 'native_pay' && (
        <View style={styles.bottomBar}>
          <Button
            label={`${t.checkout.placeOrder} · ₪${total.toFixed(0)}`}
            onPress={handlePlaceOrder}
            loading={loading}
            fullWidth
            size="lg"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  section: {
    paddingHorizontal: Spacing[5],
    marginBottom: Spacing[4],
    marginTop: Spacing[4],
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    marginBottom: Spacing[3],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rtlText: { textAlign: 'right' },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.xs,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    flex: 1,
  },
  rtl: { flexDirection: 'row-reverse' },
  qtyBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.xs,
    color: Colors.white,
  },
  itemName: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  itemPrice: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    marginLeft: Spacing[3],
  },
  // Payment method
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3] + 2,
  },
  paymentOptionSelected: {
    backgroundColor: Colors.primaryBrown + '08',
  },
  paymentOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
  },
  paymentIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioSelected: {
    borderColor: Colors.primaryBrown,
  },
  paymentRadioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primaryBrown,
  },
  // Credit card form
  cardForm: {
    marginTop: Spacing[3],
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    gap: Spacing[3],
    ...Shadows.xs,
  },
  rtlCardForm: {},
  cardRow: {
    flexDirection: 'row',
    gap: Spacing[3],
  },
  cardInputWrap: {
    gap: Spacing[1],
  },
  cardLabel: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    letterSpacing: 0.3,
  },
  cardInput: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingVertical: Spacing[2],
    letterSpacing: 0.5,
  },
  rtlInput: {
    textAlign: 'right',
  },
  // Apple Pay button
  nativePayButton: {
    marginTop: Spacing[3],
    backgroundColor: Colors.darkEspresso,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing[4],
    gap: Spacing[2],
  },
  nativePayText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.lg,
    color: Colors.white,
    letterSpacing: 1,
  },
  // Notes
  notesInput: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    minHeight: 80,
    textAlignVertical: 'top',
    padding: Spacing[4],
  },
  // Price
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
  },
  priceLabel: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  priceValue: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing[4],
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
  // Points
  pointsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    paddingHorizontal: Spacing[5],
    paddingVertical: Spacing[3],
    backgroundColor: Colors.accentCaramel + '12',
    marginHorizontal: Spacing[5],
    borderRadius: Radius.md,
    marginBottom: Spacing[3],
  },
  pointsPreviewText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  pointsPreviewNum: {
    fontFamily: FontFamily.bold,
    color: Colors.accentCaramel,
  },
  termsNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: Spacing[5],
    gap: Spacing[1.5],
    marginBottom: Spacing[4],
  },
  termsText: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  bottomPad: { height: Spacing[4] },
  bottomBar: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[4],
    paddingBottom: Spacing[8],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadows.lg,
  },
});
