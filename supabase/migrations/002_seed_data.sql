-- ================================================================
-- Lava Cafe — Seed Data
-- Migration: 002_seed_data.sql
-- All IDs are valid UUID format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
-- ================================================================

-- ================================================================
-- CATEGORIES
-- Format: caf00001-cafe-cafe-cafe-<12hex>
-- ================================================================
INSERT INTO public.categories (id, name_en, name_he, slug, icon_name, sort_order) VALUES
  ('caf00001-cafe-cafe-cafe-000000000001', 'Coffee',      'קפה',        'coffee',      'cafe',         1),
  ('caf00001-cafe-cafe-cafe-000000000002', 'Iced Drinks',  'שתייה קרה',  'iced-drinks', 'local-bar',    2),
  ('caf00001-cafe-cafe-cafe-000000000003', 'Cakes',        'עוגות',      'cakes',       'cake',         3),
  ('caf00001-cafe-cafe-cafe-000000000004', 'Desserts',     'קינוחים',    'desserts',    'icecream',     4),
  ('caf00001-cafe-cafe-cafe-000000000005', 'Pastries',     'מאפים',      'pastries',    'bakery-dining',5),
  ('caf00001-cafe-cafe-cafe-000000000006', 'Snacks',       'נשנושים',    'snacks',      'lunch-dining', 6);

-- ================================================================
-- PRODUCTS — Coffee
-- Format: caf00002-cafe-cafe-cafe-<12hex>
-- ================================================================
INSERT INTO public.products (id, category_id, name_en, name_he, description_en, description_he, price, is_featured, is_new, calories, prep_time_min, tags) VALUES
  ('caf00002-cafe-cafe-cafe-000000000001',
   'caf00001-cafe-cafe-cafe-000000000001',
   'Signature Espresso', 'אספרסו מיוחד',
   'Our double-shot espresso, crafted from premium single-origin beans with rich crema.',
   'אספרסו כפול מפולים באיכות גבוהה עם קרמה עשירה.',
   14.00, TRUE, FALSE, 5, 3, ARRAY['hot','bestseller']),

  ('caf00002-cafe-cafe-cafe-000000000002',
   'caf00001-cafe-cafe-cafe-000000000001',
   'Lava Cappuccino', 'קפוצ''ינו לבה',
   'Velvety steamed milk poured over a double espresso, topped with silky foam.',
   'חלב מוקצף על אספרסו כפול עם קצף משי.',
   22.00, TRUE, FALSE, 120, 4, ARRAY['hot','creamy']),

  ('caf00002-cafe-cafe-cafe-000000000003',
   'caf00001-cafe-cafe-cafe-000000000001',
   'Flat White', 'פלט וייט',
   'Microfoam milk over ristretto — bold, smooth, and perfectly balanced.',
   'חלב מיקרופום על ריסטרטו — עז, חלק ומאוזן.',
   22.00, FALSE, FALSE, 130, 4, ARRAY['hot']),

  ('caf00002-cafe-cafe-cafe-000000000004',
   'caf00001-cafe-cafe-cafe-000000000001',
   'Caramel Latte', 'לאטה קרמל',
   'Espresso, steamed milk and our house caramel drizzle in one warm cup.',
   'אספרסו, חלב ורוטב קרמל ביתי בכוס חמה אחת.',
   26.00, TRUE, FALSE, 190, 5, ARRAY['hot','sweet','bestseller']),

  ('caf00002-cafe-cafe-cafe-000000000005',
   'caf00001-cafe-cafe-cafe-000000000001',
   'Cortado', 'קורטאדו',
   'Equal parts espresso and warm milk — intense yet smooth.',
   'אספרסו וחלב חם בחלקים שווים — עז אך חלק.',
   18.00, FALSE, FALSE, 60, 3, ARRAY['hot']);

-- ================================================================
-- PRODUCTS — Iced Drinks
-- ================================================================
INSERT INTO public.products (id, category_id, name_en, name_he, description_en, description_he, price, is_featured, is_new, calories, prep_time_min, tags) VALUES
  ('caf00002-cafe-cafe-cafe-000000000006',
   'caf00001-cafe-cafe-cafe-000000000002',
   'Iced Espresso', 'אספרסו קר',
   'Double shot poured over ice — pure espresso, perfectly chilled.',
   'שתי מנות אספרסו על קרח — טהור ומקורר.',
   18.00, FALSE, FALSE, 10, 3, ARRAY['cold','strong']),

  ('caf00002-cafe-cafe-cafe-000000000007',
   'caf00001-cafe-cafe-cafe-000000000002',
   'Iced Lava Latte', 'לאטה לבה קר',
   'Cold-brewed espresso with chilled milk and a caramel swirl, shaken over ice.',
   'אספרסו קר עם חלב מקורר וסיבוב קרמל, מעורבב עם קרח.',
   26.00, TRUE, FALSE, 180, 5, ARRAY['cold','sweet','bestseller']),

  ('caf00002-cafe-cafe-cafe-000000000008',
   'caf00001-cafe-cafe-cafe-000000000002',
   'Iced Matcha Latte', 'לאטה מאצ''ה קר',
   'Premium ceremonial matcha whisked with cold oat milk over ice.',
   'מאצ''ה ממשי עם חלב שיבולת שועל קר על קרח.',
   28.00, TRUE, TRUE, 160, 5, ARRAY['cold','healthy','new']),

  ('caf00002-cafe-cafe-cafe-000000000009',
   'caf00001-cafe-cafe-cafe-000000000002',
   'Iced Mocha', 'מוקה קר',
   'Espresso, dark chocolate sauce and chilled milk over ice.',
   'אספרסו, רוטב שוקולד מריר וחלב קר על קרח.',
   26.00, FALSE, FALSE, 210, 5, ARRAY['cold','chocolate']),

  ('caf00002-cafe-cafe-cafe-00000000000a',
   'caf00001-cafe-cafe-cafe-000000000002',
   'Lemon Mint Cooler', 'קולר לימון נענע',
   'Freshly squeezed lemon with mint, sparkling water and honey syrup.',
   'לימון סחוט טרי עם נענע, מים מוגזים וסירופ דבש.',
   22.00, FALSE, FALSE, 90, 3, ARRAY['cold','refreshing','no-coffee']);

-- ================================================================
-- PRODUCTS — Cakes
-- ================================================================
INSERT INTO public.products (id, category_id, name_en, name_he, description_en, description_he, price, is_featured, is_new, calories, prep_time_min, tags) VALUES
  ('caf00002-cafe-cafe-cafe-00000000000b',
   'caf00001-cafe-cafe-cafe-000000000003',
   'Dark Chocolate Cake', 'עוגת שוקולד מריר',
   'Rich layers of dark chocolate sponge with ganache and cocoa cream.',
   'שכבות עשירות של ביסקוויט שוקולד מריר עם גנאש וקרם קקאו.',
   42.00, TRUE, FALSE, 420, 2, ARRAY['chocolate','bestseller']),

  ('caf00002-cafe-cafe-cafe-00000000000c',
   'caf00001-cafe-cafe-cafe-000000000003',
   'Salted Caramel Cake', 'עוגת קרמל מלוח',
   'Moist vanilla sponge layered with salted caramel buttercream and caramel drizzle.',
   'ביסקוויט וניל לח עם קרם חמאה קרמל מלוח וציפוי קרמל.',
   46.00, TRUE, FALSE, 390, 2, ARRAY['caramel','signature']),

  ('caf00002-cafe-cafe-cafe-00000000000d',
   'caf00001-cafe-cafe-cafe-000000000003',
   'Red Velvet', 'רד וולבט',
   'Classic red velvet with smooth cream cheese frosting.',
   'רד וולבט קלאסי עם ציפוי גבינה שמנת חלק.',
   40.00, FALSE, FALSE, 370, 2, ARRAY['classic']);

-- ================================================================
-- PRODUCTS — Desserts
-- ================================================================
INSERT INTO public.products (id, category_id, name_en, name_he, description_en, description_he, price, is_featured, is_new, calories, prep_time_min, tags) VALUES
  ('caf00002-cafe-cafe-cafe-00000000000e',
   'caf00001-cafe-cafe-cafe-000000000004',
   'Tiramisu', 'טירמיסו',
   'Classic Italian tiramisu with espresso-soaked ladyfingers and mascarpone cream.',
   'טירמיסו איטלקי קלאסי עם אצבעות ספוגות אספרסו וקרם מסקרפונה.',
   38.00, TRUE, FALSE, 310, 2, ARRAY['classic','coffee-based']),

  ('caf00002-cafe-cafe-cafe-00000000000f',
   'caf00001-cafe-cafe-cafe-000000000004',
   'Vanilla Panna Cotta', 'פנקוטה וניל',
   'Silky panna cotta with fresh berry coulis and candied nuts.',
   'פנקוטה משי עם קולי פירות יער ואגוזים מסוכרים.',
   32.00, FALSE, FALSE, 220, 2, ARRAY['light','elegant']),

  ('caf00002-cafe-cafe-cafe-000000000010',
   'caf00001-cafe-cafe-cafe-000000000004',
   'Warm Brownie', 'בראוני חם',
   'Gooey dark chocolate brownie served warm with vanilla ice cream.',
   'בראוני שוקולד מריר רך, מוגש חם עם גלידת וניל.',
   36.00, TRUE, FALSE, 480, 8, ARRAY['hot','chocolate','bestseller']);

-- ================================================================
-- PRODUCTS — Pastries
-- ================================================================
INSERT INTO public.products (id, category_id, name_en, name_he, description_en, description_he, price, is_featured, is_new, calories, prep_time_min, tags) VALUES
  ('caf00002-cafe-cafe-cafe-000000000011',
   'caf00001-cafe-cafe-cafe-000000000005',
   'Butter Croissant', 'קרואסון חמאה',
   'Freshly baked, flaky butter croissant — golden and layered.',
   'קרואסון חמאה פריך ושכבתי, טרי מהתנור.',
   16.00, FALSE, FALSE, 240, 5, ARRAY['fresh','classic']),

  ('caf00002-cafe-cafe-cafe-000000000012',
   'caf00001-cafe-cafe-cafe-000000000005',
   'Pain au Chocolat', 'פיין אה שוקולה',
   'Buttery croissant dough wrapped around dark chocolate batons.',
   'בצק קרואסון חמאה עם מוט שוקולד מריר בפנים.',
   18.00, TRUE, FALSE, 280, 5, ARRAY['chocolate','fresh']),

  ('caf00002-cafe-cafe-cafe-000000000013',
   'caf00001-cafe-cafe-cafe-000000000005',
   'Cinnamon Roll', 'רול קינמון',
   'Soft spiral roll with cinnamon sugar, baked fresh and glazed.',
   'רול ספיראלי רך עם סוכר קינמון, אפוי טרי ומוזגג.',
   22.00, TRUE, TRUE, 310, 8, ARRAY['sweet','fresh','new']),

  ('caf00002-cafe-cafe-cafe-000000000014',
   'caf00001-cafe-cafe-cafe-000000000005',
   'Blueberry Muffin', 'מאפין אוכמניות',
   'Moist muffin bursting with fresh blueberries and lemon zest.',
   'מאפין לח עם אוכמניות טריות וגרידת לימון.',
   16.00, FALSE, FALSE, 290, 5, ARRAY['fruity','fresh']);

-- ================================================================
-- PRODUCTS — Snacks
-- ================================================================
INSERT INTO public.products (id, category_id, name_en, name_he, description_en, description_he, price, is_featured, is_new, calories, prep_time_min, tags) VALUES
  ('caf00002-cafe-cafe-cafe-000000000015',
   'caf00001-cafe-cafe-cafe-000000000006',
   'Avocado Toast', 'טוסט אבוקדו',
   'Sourdough toast with smashed avocado, cherry tomatoes and everything bagel seasoning.',
   'טוסט שאור עם אבוקדו כתוש, עגבניות שרי ותבלין בייגל.',
   48.00, FALSE, FALSE, 310, 8, ARRAY['savory','healthy']),

  ('caf00002-cafe-cafe-cafe-000000000016',
   'caf00001-cafe-cafe-cafe-000000000006',
   'Granola Bowl', 'קערת גרנולה',
   'House granola with Greek yogurt, seasonal fruit and honey.',
   'גרנולה ביתית עם יוגורט יווני, פירות עונתיים ודבש.',
   38.00, FALSE, FALSE, 280, 3, ARRAY['healthy','light']),

  ('caf00002-cafe-cafe-cafe-000000000017',
   'caf00001-cafe-cafe-cafe-000000000006',
   'Chocolate Chip Cookie', 'עוגיית שוקולד צ''יפס',
   'Thick, chewy cookie loaded with dark and milk chocolate chips.',
   'עוגייה עבה ורכה עם שבבי שוקולד מריר וחלב.',
   14.00, FALSE, FALSE, 190, 2, ARRAY['sweet','classic']);

-- ================================================================
-- PRODUCT OPTIONS (Sizes & Milk for Coffee)
-- ================================================================
INSERT INTO public.product_options (product_id, option_type, name_en, name_he, price_delta, is_default, sort_order) VALUES
  -- Sizes for Lava Cappuccino
  ('caf00002-cafe-cafe-cafe-000000000002', 'size', 'Small (S)',  'קטן (S)',  -2.00, FALSE, 1),
  ('caf00002-cafe-cafe-cafe-000000000002', 'size', 'Medium (M)', 'בינוני (M)', 0.00, TRUE,  2),
  ('caf00002-cafe-cafe-cafe-000000000002', 'size', 'Large (L)',  'גדול (L)',  3.00, FALSE, 3),
  -- Milk options for Lava Cappuccino
  ('caf00002-cafe-cafe-cafe-000000000002', 'milk', 'Whole Milk',  'חלב מלא',            0.00, TRUE,  1),
  ('caf00002-cafe-cafe-cafe-000000000002', 'milk', 'Oat Milk',    'חלב שיבולת שועל',    3.00, FALSE, 2),
  ('caf00002-cafe-cafe-cafe-000000000002', 'milk', 'Almond Milk', 'חלב שקדים',          3.00, FALSE, 3),
  ('caf00002-cafe-cafe-cafe-000000000002', 'milk', 'Soy Milk',    'חלב סויה',           2.00, FALSE, 4),
  -- Sizes for Caramel Latte
  ('caf00002-cafe-cafe-cafe-000000000004', 'size', 'Small (S)',  'קטן (S)',  -2.00, FALSE, 1),
  ('caf00002-cafe-cafe-cafe-000000000004', 'size', 'Medium (M)', 'בינוני (M)', 0.00, TRUE,  2),
  ('caf00002-cafe-cafe-cafe-000000000004', 'size', 'Large (L)',  'גדול (L)',  3.00, FALSE, 3),
  -- Extras for Caramel Latte
  ('caf00002-cafe-cafe-cafe-000000000004', 'extra', 'Extra Shot', 'שוט נוסף',   4.00, FALSE, 1),
  ('caf00002-cafe-cafe-cafe-000000000004', 'extra', 'Extra Syrup','סירופ נוסף', 2.00, FALSE, 2),
  -- Sizes for Iced Lava Latte
  ('caf00002-cafe-cafe-cafe-000000000007', 'size', 'Small (S)',  'קטן (S)',  -2.00, FALSE, 1),
  ('caf00002-cafe-cafe-cafe-000000000007', 'size', 'Medium (M)', 'בינוני (M)', 0.00, TRUE,  2),
  ('caf00002-cafe-cafe-cafe-000000000007', 'size', 'Large (L)',  'גדול (L)',  3.00, FALSE, 3),
  -- Milk for Iced Matcha Latte
  ('caf00002-cafe-cafe-cafe-000000000008', 'milk', 'Oat Milk',   'חלב שיבולת שועל', 0.00, TRUE,  1),
  ('caf00002-cafe-cafe-cafe-000000000008', 'milk', 'Almond Milk','חלב שקדים',       0.00, FALSE, 2),
  ('caf00002-cafe-cafe-cafe-000000000008', 'milk', 'Whole Milk', 'חלב מלא',         0.00, FALSE, 3);

-- ================================================================
-- BANNERS
-- ================================================================
INSERT INTO public.banners (title_en, title_he, subtitle_en, subtitle_he, image_url, action_type, action_ref, sort_order) VALUES
  ('Morning Ritual', 'טקס הבוקר',
   'Start your day with our signature espresso', 'התחל את יומך עם האספרסו שלנו',
   'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
   'category', 'coffee', 1),
  ('New Arrivals', 'חדש אצלנו',
   'Try our iced matcha latte', 'נסה את הלאטה מאצ''ה הקר החדש שלנו',
   'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=800&q=80',
   'product', 'caf00002-cafe-cafe-cafe-000000000008', 2),
  ('Sweet Treats', 'מתיקויות',
   'Indulge in our fresh pastries', 'פנק את עצמך במאפים הטריים שלנו',
   'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&q=80',
   'category', 'pastries', 3);

-- ================================================================
-- PRODUCT IMAGE URLS (inline with product inserts above,
-- updating here for clarity as a separate pass)
-- ================================================================
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000001';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000002';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000003';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1561882468-9110e03e0f78?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000004';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1598908314732-07113901949e?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000005';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1594639768846-7d5e12b1cbee?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000006';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000007';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000008';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1572490122747-3e9b0ede2ad4?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000009';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-00000000000a';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-00000000000b';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-00000000000c';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1551879400-111a9087cd86?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-00000000000d';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-00000000000e';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-00000000000f';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000010';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000011';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000012';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000013';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000014';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1603046891744-1f0f9cd7e33c?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000015';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1542691457-cbe4df041eb2?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000016';
UPDATE public.products SET image_url = 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=600&q=80' WHERE id = 'caf00002-cafe-cafe-cafe-000000000017';

-- ================================================================
-- APP CONFIG
-- ================================================================
INSERT INTO public.app_config (key, value) VALUES
  ('cafe_hours', '{"sun":"07:00-22:00","mon":"07:00-22:00","tue":"07:00-22:00","wed":"07:00-22:00","thu":"07:00-23:00","fri":"07:00-23:00","sat":"08:00-22:00"}'),
  ('cafe_info',  '{"name":"Lava Cafe","phone":"+972-XX-XXX-XXXX","address":"Tel Aviv, Israel","instagram":"@lavacafe"}'),
  ('minimum_order', '{"amount":45,"currency":"ILS"}');
