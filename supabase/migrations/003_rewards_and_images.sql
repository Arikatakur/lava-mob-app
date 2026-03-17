-- ================================================================
-- Lava Cafe — Rewards System
-- Migration: 003_rewards_and_images.sql
-- NOTE: Product images are now in 002_seed_data.sql
-- ================================================================

-- ================================================================
-- REWARDS CATALOG
-- ================================================================
CREATE TABLE IF NOT EXISTS public.rewards (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name_en         TEXT NOT NULL,
  name_he         TEXT NOT NULL,
  description_en  TEXT,
  description_he  TEXT,
  points_required INTEGER NOT NULL CHECK (points_required > 0),
  reward_type     TEXT NOT NULL DEFAULT 'free_item', -- 'free_item', 'discount', 'upgrade'
  reward_value    TEXT,  -- product_id for free_item, discount% for discount
  image_url       TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  sort_order      INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active rewards are publicly readable"
  ON public.rewards FOR SELECT
  USING (is_active = TRUE);

-- ================================================================
-- POINT TRANSACTIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.point_transactions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  points          INTEGER NOT NULL,  -- positive = earned, negative = spent
  type            TEXT NOT NULL DEFAULT 'earned', -- 'earned', 'redeemed', 'bonus', 'expired'
  description_en  TEXT NOT NULL,
  description_he  TEXT NOT NULL,
  order_id        UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  reward_id       UUID REFERENCES public.rewards(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.point_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON public.point_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.point_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_point_transactions_user  ON public.point_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_point_transactions_order ON public.point_transactions(order_id);

-- ================================================================
-- REWARD REDEMPTIONS
-- ================================================================
CREATE TABLE IF NOT EXISTS public.reward_redemptions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reward_id    UUID NOT NULL REFERENCES public.rewards(id) ON DELETE CASCADE,
  points_spent INTEGER NOT NULL,
  redeemed_at  TIMESTAMPTZ DEFAULT NOW(),
  used_at      TIMESTAMPTZ,
  order_id     UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  code         TEXT UNIQUE NOT NULL DEFAULT 'LV-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 8))
);

ALTER TABLE public.reward_redemptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own redemptions"
  ON public.reward_redemptions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ================================================================
-- AWARD POINTS ON ORDER PLACEMENT (1 pt per ₪1)
-- ================================================================
CREATE OR REPLACE FUNCTION public.award_order_points()
RETURNS TRIGGER AS $$
DECLARE
  pts INTEGER;
BEGIN
  pts := FLOOR(NEW.total_price)::INTEGER;
  IF pts > 0 AND NEW.user_id IS NOT NULL THEN
    INSERT INTO public.point_transactions (user_id, points, type, description_en, description_he, order_id)
    VALUES (
      NEW.user_id,
      pts,
      'earned',
      'Points earned for order ' || NEW.order_number,
      'נקודות שנצברו עבור הזמנה ' || NEW.order_number,
      NEW.id
    );
    UPDATE public.profiles
    SET points = points + pts
    WHERE id = NEW.user_id;
    -- Auto-upgrade to gold member at 500 points
    UPDATE public.profiles
    SET is_gold_member = TRUE
    WHERE id = NEW.user_id AND points >= 500;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_order_placed_award_points
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.award_order_points();

-- ================================================================
-- REWARDS CATALOG SEED DATA
-- ================================================================
INSERT INTO public.rewards (name_en, name_he, description_en, description_he, points_required, reward_type, reward_value, image_url, sort_order) VALUES
  ('Free Espresso',
   'אספרסו חינם',
   'Redeem for a free Signature Espresso on your next visit',
   'קבל אספרסו מיוחד חינם בביקור הבא שלך',
   100, 'free_item', 'caf00002-cafe-cafe-cafe-000000000001',
   'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=400&q=80', 1),

  ('Free Pastry',
   'מאפה חינם',
   'Choose any pastry from our fresh-baked selection',
   'בחר כל מאפה מהמבחר האפוי הטרי שלנו',
   200, 'free_item', NULL,
   'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=80', 2),

  ('10% Off Your Order',
   '10% הנחה על ההזמנה',
   'Get 10% discount on your next order',
   'קבל 10% הנחה על ההזמנה הבאה שלך',
   150, 'discount', '10',
   'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&q=80', 3),

  ('Free Specialty Drink',
   'שתייה מיוחדת חינם',
   'Enjoy any drink from our specialty menu at no charge',
   'פנק את עצמך בכל שתייה מהתפריט המיוחד שלנו בחינם',
   350, 'free_item', NULL,
   'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&q=80', 4),

  ('Free Slice of Cake',
   'פרוסת עוגה חינם',
   'Treat yourself to any slice of cake from our display',
   'פנק את עצמך עם כל פרוסת עוגה מהתצוגה שלנו',
   400, 'free_item', NULL,
   'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=80', 5),

  ('20% Off Entire Order',
   '20% הנחה על כל ההזמנה',
   'Our premium reward — 20% off everything in your cart',
   'ההטבה הפרמיום שלנו — 20% הנחה על כל מה שבסל',
   500, 'discount', '20',
   'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?w=400&q=80', 6);

-- ================================================================
-- APP CONFIG — Rewards settings
-- ================================================================
INSERT INTO public.app_config (key, value) VALUES
  ('rewards_config', '{
    "tiers": [
      {"name": "Bronze", "name_he": "ברונזה", "min_points": 0,    "max_points": 499,  "color": "#CD7F32", "multiplier": 1},
      {"name": "Silver", "name_he": "כסף",    "min_points": 500,  "max_points": 999,  "color": "#C0C0C0", "multiplier": 1.25},
      {"name": "Gold",   "name_he": "זהב",    "min_points": 1000, "max_points": null, "color": "#C68A52", "multiplier": 1.5}
    ],
    "points_per_shekel": 1,
    "welcome_bonus": 50
  }')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
