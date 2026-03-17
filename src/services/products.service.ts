import { supabase } from './supabase';
import type { Product, Category, Banner } from '../types';

export const productsService = {
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data as Category[];
  },

  async getProducts(categorySlug?: string): Promise<Product[]> {
    let query = supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .order('sort_order');

    if (categorySlug && categorySlug !== 'all') {
      const { data: cat } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();
      if (cat) {
        query = query.eq('category_id', cat.id);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return data as Product[];
  },

  async getFeaturedProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .eq('is_featured', true)
      .order('sort_order')
      .limit(10);
    if (error) throw error;
    return data as Product[];
  },

  async getNewProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .eq('is_new', true)
      .order('sort_order')
      .limit(6);
    if (error) throw error;
    return data as Product[];
  },

  async getProductById(id: string): Promise<Product | null> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*), options:product_options(*)')
      .eq('id', id)
      .single();
    if (error) return null;
    return data as Product;
  },

  async searchProducts(query: string): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products')
      .select('*, category:categories(*)')
      .eq('is_available', true)
      .or(`name_en.ilike.%${query}%,name_he.ilike.%${query}%,description_en.ilike.%${query}%`)
      .limit(20);
    if (error) throw error;
    return data as Product[];
  },

  async getBanners(): Promise<Banner[]> {
    const { data, error } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data as Banner[];
  },
};
