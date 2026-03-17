-- ================================================================
-- Lava Cafe — Fix order_items RLS + Add payment_method
-- Migration: 004_fix_order_items_rls.sql
-- ================================================================

-- The original schema was missing an INSERT policy for order_items.
-- Users could create orders but inserting the items was blocked.
CREATE POLICY "Users can insert own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

-- Add payment_method to orders
-- 'cash' | 'credit_card' | 'apple_pay'
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS payment_method TEXT NOT NULL DEFAULT 'cash';
