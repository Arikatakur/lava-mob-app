import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Header } from '../../src/components/layout/Header';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { Skeleton } from '../../src/components/ui/SkeletonLoader';
import { useTranslation } from '../../src/hooks/useTranslation';
import { ordersService } from '../../src/services/orders.service';
import { useAuthStore } from '../../src/store/useAuthStore';
import { Colors, FontFamily, FontSize, Radius, Spacing, Shadows } from '../../src/theme';
import type { Order, OrderStatus } from '../../src/types';

const STATUS_COLORS: Record<OrderStatus, string> = {
  pending: Colors.textMuted,
  confirmed: Colors.info,
  preparing: Colors.accentCaramel,
  ready: Colors.success,
  completed: Colors.primaryBrown,
  cancelled: Colors.error,
};

export default function Orders() {
  const { t, language, isRTL } = useTranslation();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    ordersService.getUserOrders(user.id)
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  const getStatusLabel = (status: OrderStatus) => {
    const labels = t.orders.status as Record<string, string>;
    return labels[status] ?? status;
  };

  return (
    <SafeAreaView style={styles.safe}>
      <Header title={t.orders.title} showBack isRTL={isRTL} />

      {loading ? (
        <View style={styles.skeletons}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={100} borderRadius={14} style={styles.skeleton} />
          ))}
        </View>
      ) : orders.length === 0 ? (
        <EmptyState
          icon="receipt-long"
          title={t.orders.empty}
          subtitle={t.orders.emptySubtitle}
          actionLabel="Browse Menu"
          onAction={() => router.push('/(tabs)/menu')}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(o) => o.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.orderCard}
              onPress={() => router.push(`/orders/${item.id}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.cardTop, isRTL && styles.rtl]}>
                <Text style={styles.orderNumber}>{item.order_number}</Text>
                <View style={[styles.statusBadge, { borderColor: STATUS_COLORS[item.status] }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
              </View>

              <View style={[styles.cardMeta, isRTL && styles.rtl]}>
                <Text style={styles.dateText}>
                  {new Date(item.created_at).toLocaleDateString(
                    language === 'he' ? 'he-IL' : 'en-US',
                  )}
                </Text>
                <Text style={styles.priceText}>₪{item.total_price.toFixed(0)}</Text>
              </View>

              <View style={[styles.cardBottom, isRTL && styles.rtl]}>
                <Text style={styles.itemCount}>
                  {item.items?.length ?? 0} items
                </Text>
                <MaterialIcons
                  name={isRTL ? 'chevron-left' : 'chevron-right'}
                  size={20}
                  color={Colors.textMuted}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.backgroundPrimary,
  },
  skeletons: {
    padding: Spacing[5],
    gap: Spacing[3],
  },
  skeleton: {
    marginBottom: Spacing[3],
  },
  list: {
    padding: Spacing[5],
    paddingBottom: Spacing[10],
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing[4],
    marginBottom: Spacing[3],
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[2],
  },
  rtl: { flexDirection: 'row-reverse' },
  orderNumber: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.base,
    color: Colors.primaryBrown,
    letterSpacing: 0.5,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing[3],
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing[3],
  },
  dateText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  priceText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing[2],
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  itemCount: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
