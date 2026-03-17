import { supabase } from './supabase';
import type { Order, OrderItem } from '../types';

interface CreateOrderPayload {
  user_id: string;
  subtotal: number;
  discount: number;
  total_price: number;
  notes?: string;
  payment_method?: string;
  items: Array<{
    product_id: string;
    product_name_en: string;
    product_name_he: string;
    quantity: number;
    unit_price: number;
    selected_options: unknown[];
    subtotal: number;
  }>;
}

export const ordersService = {
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const { items, ...orderData } = payload;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert(orderData)
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = items.map((item) => ({
      ...item,
      order_id: order.id,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) throw itemsError;

    return order as Order;
  },

  async getUserOrders(userId: string): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data as Order[];
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    const { data, error } = await supabase
      .from('orders')
      .select('*, items:order_items(*)')
      .eq('id', orderId)
      .single();
    if (error) return null;
    return data as Order;
  },
};
