import { supabase } from './supabase';
import type { Product } from '../types';

export const favoritesService = {
  async getFavoriteIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('product_id')
      .eq('user_id', userId);
    if (error) throw error;
    return data.map((f) => f.product_id);
  },

  async getFavoriteProducts(userId: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select('product:products(*, category:categories(*))')
      .eq('user_id', userId);
    if (error) throw error;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (data as any[]).map((f) => f.product) as Product[];
  },

  async addFavorite(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, product_id: productId });
    if (error) throw error;
  },

  async removeFavorite(userId: string, productId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('product_id', productId);
    if (error) throw error;
  },
};
