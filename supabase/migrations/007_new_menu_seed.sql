-- ================================================================
-- Lava Cafe — New Menu Seed (replaces demo data)
-- Migration: 007_new_menu_seed.sql
-- ================================================================

BEGIN;

-- ----------------------------------------------------------------
-- Clear demo data in FK-safe order
-- ----------------------------------------------------------------
UPDATE public.order_items SET product_id = NULL WHERE product_id IS NOT NULL;
DELETE FROM public.favorites;
DELETE FROM public.cart_items;
DELETE FROM public.product_options;
DELETE FROM public.product_images;
DELETE FROM public.banners;
DELETE FROM public.products;
DELETE FROM public.categories;

-- ----------------------------------------------------------------
-- Categories: Sweets / Snacks / Drinks
-- ----------------------------------------------------------------
INSERT INTO public.categories (name_ar, name_en, name_he, slug, icon_name, sort_order) VALUES
  ('حلويات',       'Sweets', 'מתוקים', 'sweets', 'cake',         1),
  ('وجبات خفيفة',  'Snacks', 'חטיפים', 'snacks', 'lunch-dining', 2),
  ('مشروبات',      'Drinks', 'משקאות', 'drinks', 'local-bar',    3);

-- ----------------------------------------------------------------
-- Products
-- ----------------------------------------------------------------
WITH cats AS (
  SELECT id, slug FROM public.categories
)
INSERT INTO public.products
  (category_id, name_ar, name_en, name_he, description_ar, description_en, description_he,
   price, image_url, is_featured, is_new, sort_order, tags)
VALUES
  -- SWEETS
  ((SELECT id FROM cats WHERE slug = 'sweets'),
   'بافل', 'Waffle', 'וופל',
   'وافل طازج مع شوكولاتة ومارشميلو.',
   'Fresh waffle topped with chocolate and marshmallows.',
   'וופל טרי עם שוקולד ומרשמלו.',
   20.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/buffle.png',
   TRUE, FALSE, 1, ARRAY['sweet','dessert']),

  ((SELECT id FROM cats WHERE slug = 'sweets'),
   'فشافيش', 'Fashafish (12 pcs)', 'פשפיש (12 יח'')',
   'فشافيش بشكل سمكة مع آيس كريم وشوكولاتة — ١٢ حبة.',
   'Fish-shaped pastry filled with ice cream and chocolate — 12 pieces.',
   'מאפה בצורת דג עם גלידה ושוקולד — 12 יחידות.',
   20.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/fish-buffle.png',
   TRUE, TRUE, 2, ARRAY['sweet','dessert','new']),

  ((SELECT id FROM cats WHERE slug = 'sweets'),
   'تياكي', 'Tyaki', 'טיאקי',
   'كرات وافل صغيرة بالشوكولاتة والمكسرات.',
   'Mini waffle balls with chocolate sauce and crushed nuts.',
   'כדורי וופל קטנים עם רוטב שוקולד ואגוזים.',
   20.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/small-buffle-balls.png',
   TRUE, FALSE, 3, ARRAY['sweet','dessert']),

  ((SELECT id FROM cats WHERE slug = 'sweets'),
   'تشوروس', 'Churros (5 pcs)', 'צ''ורוס (5 יח'')',
   'تشوروس مقرمش مع ٣ صلصات — ٥ حبات.',
   'Crispy churros served with 3 dipping sauces — 5 pieces.',
   'צ''ורוס פריך עם 3 רטבים — 5 יחידות.',
   20.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/1.png',
   FALSE, FALSE, 4, ARRAY['sweet']),

  ((SELECT id FROM cats WHERE slug = 'sweets'),
   'موس فواكه الترند', 'Trend Fruit Platter', 'מגש פירות הטרנד',
   'مزيج فراولة، كيوي وموز مع صلصة شوكولاتة.',
   'Mixed strawberries, kiwi and bananas drizzled with chocolate sauce.',
   'תות, קיווי ובננה עם רוטב שוקולד.',
   30.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/fruitplatter.png',
   TRUE, TRUE, 5, ARRAY['fruit','healthy','new','signature']),

  -- SNACKS
  ((SELECT id FROM cats WHERE slug = 'snacks'),
   'تيرس كبابي', 'Corn Cup', 'כוס תירס',
   'تيرس كبابي بنكهات مميزة — يتوفر بحجم صغير وكبير.',
   'Spiced corn cup — available in Small and Large.',
   'תירס מתובל בכוס — בקטן ובגדול.',
   5.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/corncup.png',
   FALSE, FALSE, 6, ARRAY['savory','snack']),

  ((SELECT id FROM cats WHERE slug = 'snacks'),
   'سيخ بطاطا', 'Potato Skewer', 'שיפוד תפו"א',
   'بطاطا حلزونية على عود مع صلصة.',
   'Spiral-cut potato on a skewer with sauce.',
   'תפוח אדמה ספירלי על שיפוד עם רוטב.',
   10.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/rolled-chips.png',
   FALSE, FALSE, 7, ARRAY['savory','snack']),

  -- DRINKS
  ((SELECT id FROM cats WHERE slug = 'drinks'),
   'موخيتو', 'Mojito', 'מוחיטו',
   'موخيتو منعش بالليمون والنعنع.',
   'Refreshing mojito with lemon and mint.',
   'מוחיטו מרענן עם לימון ונענע.',
   15.00,
   'https://soabxcsamwucmctbhtyd.supabase.co/storage/v1/object/public/products/mokhito.png',
   TRUE, FALSE, 8, ARRAY['cold','refreshing']);

-- ----------------------------------------------------------------
-- Size variants for تيرس كبابي  (Small = base 5, Large = +5 → 10)
-- ----------------------------------------------------------------
INSERT INTO public.product_options
  (product_id, option_type, name_ar, name_en, name_he, price_delta, is_default, sort_order)
SELECT
  p.id, 'size', x.name_ar, x.name_en, x.name_he, x.price_delta, x.is_default, x.sort_order
FROM public.products p
CROSS JOIN (VALUES
  ('صغير', 'Small', 'קטן',  0.00, TRUE,  1),
  ('كبير', 'Large', 'גדול', 5.00, FALSE, 2)
) AS x(name_ar, name_en, name_he, price_delta, is_default, sort_order)
WHERE p.name_ar = 'تيرس كبابي';

COMMIT;
