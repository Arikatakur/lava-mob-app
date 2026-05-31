import { useState, useEffect } from 'react';
import { productsService } from '../services/products.service';
import type { Product, Category, Banner } from '../types';

export function useFeaturedProducts(reloadKey?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    productsService.getFeaturedProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [reloadKey]);

  return { products, loading, error };
}

export function useProducts(categorySlug?: string, reloadKey?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    productsService.getProducts(categorySlug)
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [categorySlug, reloadKey]);

  return { products, loading, error };
}

export function useCategories(reloadKey?: number) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsService.getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reloadKey]);

  return { categories, loading };
}

export function useBanners(reloadKey?: number) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    productsService.getBanners()
      .then(setBanners)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [reloadKey]);

  return { banners, loading };
}

export function useProduct(id: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    productsService.getProductById(id)
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  return { product, loading };
}
