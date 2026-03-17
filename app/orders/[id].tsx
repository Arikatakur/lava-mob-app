import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/layout/Header';
import { useTranslation } from '../../src/hooks/useTranslation';
import { ordersService } from '../../src/services/orders.service';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';
import type { Order, OrderStatus } from '../../src/types';

const STATUS_STEPS: OrderStatus[] = [
  'pending', 'confirmed', 'preparing', 'ready', 'completed',
];

const STATUS_ICONS: Record<OrderStatus, keyof typeof MaterialIcons.glyphMap> = {
  pending: 'hourglass-empty',
  confirmed: 'check-circle-outline',
  preparing: 'coffee-maker',
  ready: 'local-cafe',
  completed: 'check-circle',
  cancelled: 'cancel',
};

export default function OrderDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t, language, isRTL } = useTranslation();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    ordersService.getOrderById(id)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const getStatusLabel = (status: OrderStatus) => {
    const labels = t.orders.status as Record<string, string>;
    return labels[status] ?? status;
  };

  const currentStep = order ? STATUS_STEPS.indexOf(order.status) : 0;

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={t.orderSuccess.trackOrder} showBack isRTL={isRTL} />

      {order && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {/* Order Number */}
          <View style={styles.orderHeader}>
            <Text style={styles.orderNumber}>{order.order_number}</Text>
            <Text style={styles.orderDate}>
              {new Date(order.created_at).toLocaleDateString(language === 'he' ? 'he-IL' : 'en-US')}
            </Text>
          </View>

          {/* Status Tracker */}
          {order.status !== 'cancelled' && (
            <View style={styles.section}>
              <View style={styles.tracker}>
                {STATUS_STEPS.map((step, i) => {
                  const isDone = i <= currentStep;
                  const isCurrent = i === currentStep;
                  return (
                    <View key={step} style={styles.trackerStep}>
                      <View style={[
                        styles.stepCircle,
                        isDone && styles.stepCircleDone,
                        isCurrent && styles.stepCircleCurrent,
                      ]}>
                        <MaterialIcons
                          name={STATUS_ICONS[step]}
                          size={18}
                          color={isDone ? Colors.white : Colors.textMuted}
                        />
                      </View>
                      <Text style={[
                        styles.stepLabel,
                        isDone && styles.stepLabelDone,
                      ]} numberOfLines={1}>
                        {getStatusLabel(step)}
                      </Text>
                      {i < STATUS_STEPS.length - 1 && (
                        <View style={[styles.stepLine, isDone && styles.stepLineDone]} />
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Items */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isRTL && styles.rtlText]}>Items</Text>
            <View style={styles.card}>
              {(order.items ?? []).map((item) => (
                <View key={item.id} style={[styles.itemRow, isRTL && styles.rtl]}>
                  <View style={[styles.itemLeft, isRTL && styles.rtl]}>
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyText}>{item.quantity}</Text>
                    </View>
                    <Text style={styles.itemName} numberOfLines={1}>
                      {language === 'he' ? item.product_name_he : item.product_name_en}
                    </Text>
                  </View>
                  <Text style={styles.itemPrice}>₪{item.subtotal.toFixed(0)}</Text>
                </View>
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>{t.cart.total}</Text>
                <Text style={styles.totalValue}>₪{order.total_price.toFixed(0)}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  scroll: {
    padding: Spacing[5],
  },
  orderHeader: {
    alignItems: 'center',
    paddingVertical: Spacing[6],
  },
  orderNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize['3xl'],
    color: Colors.primaryBrown,
    letterSpacing: 1,
  },
  orderDate: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing[1],
  },
  section: {
    marginBottom: Spacing[5],
  },
  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing[3],
  },
  rtlText: { textAlign: 'right' },
  tracker: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.xs,
  },
  trackerStep: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[1.5],
  },
  stepCircleDone: {
    backgroundColor: Colors.primaryBrown,
  },
  stepCircleCurrent: {
    backgroundColor: Colors.accentCaramel,
  },
  stepLabel: {
    fontFamily: FontFamily.regular,
    fontSize: 10,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  stepLabelDone: {
    color: Colors.primaryBrown,
    fontFamily: FontFamily.medium,
  },
  stepLine: {
    position: 'absolute',
    top: 18,
    right: -'50%' as unknown as number,
    width: '100%',
    height: 2,
    backgroundColor: Colors.border,
    zIndex: -1,
  },
  stepLineDone: {
    backgroundColor: Colors.primaryBrown,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing[4],
    ...Shadows.xs,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing[2.5],
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  rtl: { flexDirection: 'row-reverse' },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[2],
    flex: 1,
  },
  qtyBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
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
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: Spacing[3],
    marginTop: Spacing[1],
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
});
