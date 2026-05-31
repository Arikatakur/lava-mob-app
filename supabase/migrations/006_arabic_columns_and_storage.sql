-- ================================================================
-- Lava Cafe — Add Arabic localization columns + products storage
-- Migration: 006_arabic_columns_and_storage.sql
-- ================================================================

-- Add Arabic language columns to localized tables
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS description_ar text;

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS name_ar text;

ALTER TABLE public.product_options
  ADD COLUMN IF NOT EXISTS name_ar text;

ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS alt_ar text;

ALTER TABLE public.banners
  ADD COLUMN IF NOT EXISTS title_ar text,
  ADD COLUMN IF NOT EXISTS subtitle_ar text;

ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS product_name_ar text;

ALTER TABLE public.rewards
  ADD COLUMN IF NOT EXISTS name_ar text,
  ADD COLUMN IF NOT EXISTS description_ar text;

-- Public 'products' storage bucket for product imagery (10 MB max, common image MIMEs)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  10485760,
  ARRAY['image/png','image/jpeg','image/webp','image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public read for objects in the products bucket
DROP POLICY IF EXISTS "Public read for products bucket" ON storage.objects;
CREATE POLICY "Public read for products bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');
