// ================================================================
// Lava Cafe — Core TypeScript Types
// ================================================================

export type Language = 'he' | 'en';

/** How the customer intends to receive their order this session. */
export type OrderMode = 'delivery' | 'pickup' | 'dine_in';

export interface Category {
  id: string;
  name_en: string;
  name_he: string;
  slug: string;
  icon_name?: string;
  image_url?: string;
  sort_order: number;
  is_active: boolean;
}

export interface ProductOption {
  id: string;
  product_id: string;
  option_type: 'size' | 'milk' | 'temperature' | 'extra';
  name_en: string;
  name_he: string;
  price_delta: number;
  is_default: boolean;
  sort_order: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  name_en: string;
  name_he: string;
  description_en?: string;
  description_he?: string;
  price: number;
  image_url?: string;
  is_featured: boolean;
  is_available: boolean;
  is_new: boolean;
  calories?: number;
  prep_time_min?: number;
  sort_order: number;
  tags?: string[];
  category?: Category;
  options?: ProductOption[];
}

export interface SelectedOption {
  option_id: string;
  option_type: string;
  name_en: string;
  name_he: string;
  price_delta: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  selected_options: SelectedOption[];
  notes?: string;
  product?: Product;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled';

export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';

export interface Order {
  id: string;
  user_id?: string;
  order_number: string;
  status: OrderStatus;
  payment_status: PaymentStatus;
  subtotal: number;
  discount: number;
  total_price: number;
  notes?: string;
  pickup_time?: string;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id?: string;
  product_name_en: string;
  product_name_he: string;
  quantity: number;
  unit_price: number;
  selected_options: SelectedOption[];
  subtotal: number;
}

export interface Banner {
  id: string;
  title_en: string;
  title_he: string;
  subtitle_en?: string;
  subtitle_he?: string;
  image_url?: string;
  action_type: 'product' | 'category' | 'url';
  action_ref?: string;
  is_active: boolean;
  sort_order: number;
}

export interface Profile {
  id: string;
  full_name?: string;
  phone?: string;
  avatar_url?: string;
  preferred_lang: Language;
  is_gold_member: boolean;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

// ================================================================
// REWARDS & LOYALTY
// ================================================================

export type RewardTier = 'bronze' | 'silver' | 'gold';

export interface TierConfig {
  name: string;
  name_he: string;
  min_points: number;
  max_points: number | null;
  color: string;
  multiplier: number;
}

export interface Reward {
  id: string;
  name_en: string;
  name_he: string;
  description_en?: string;
  description_he?: string;
  points_required: number;
  reward_type: 'free_item' | 'discount' | 'upgrade';
  reward_value?: string;
  image_url?: string;
  is_active: boolean;
  sort_order: number;
}

export interface PointTransaction {
  id: string;
  user_id: string;
  points: number;
  type: 'earned' | 'redeemed' | 'bonus' | 'expired';
  description_en: string;
  description_he: string;
  order_id?: string;
  reward_id?: string;
  created_at: string;
}

export interface RewardRedemption {
  id: string;
  user_id: string;
  reward_id: string;
  points_spent: number;
  redeemed_at: string;
  used_at?: string;
  order_id?: string;
  code: string;
  reward?: Reward;
}

// UI-only types
export interface LocalizedText {
  en: string;
  he: string;
}
