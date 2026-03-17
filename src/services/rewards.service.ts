import { supabase } from './supabase';
import type { Reward, PointTransaction, RewardRedemption } from '../types';

export const rewardsService = {
  async getRewards(): Promise<Reward[]> {
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');
    if (error) throw error;
    return data as Reward[];
  },

  async getPointTransactions(userId: string): Promise<PointTransaction[]> {
    const { data, error } = await supabase
      .from('point_transactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
    if (error) throw error;
    return data as PointTransaction[];
  },

  async redeemReward(
    userId: string,
    rewardId: string,
    pointsRequired: number,
  ): Promise<RewardRedemption> {
    // Insert redemption record
    const { data: redemption, error: redeemError } = await supabase
      .from('reward_redemptions')
      .insert({ user_id: userId, reward_id: rewardId, points_spent: pointsRequired })
      .select('*')
      .single();
    if (redeemError) throw redeemError;

    // Deduct points from profile
    const { error: pointsError } = await supabase.rpc('deduct_points', {
      p_user_id: userId,
      p_points: pointsRequired,
    });
    if (pointsError) {
      // Fallback: manual update
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ points: supabase.rpc('points', {}) })
        .eq('id', userId);
      if (updateError) console.warn('Points deduction fallback failed');
    }

    // Log transaction
    const { error: txError } = await supabase
      .from('point_transactions')
      .insert({
        user_id: userId,
        points: -pointsRequired,
        type: 'redeemed',
        description_en: 'Reward redeemed',
        description_he: 'הטבה מומשה',
        reward_id: rewardId,
      });
    if (txError) console.warn('Transaction log failed:', txError);

    return redemption as RewardRedemption;
  },

  async getRedemptions(userId: string): Promise<RewardRedemption[]> {
    const { data, error } = await supabase
      .from('reward_redemptions')
      .select('*, reward:rewards(*)')
      .eq('user_id', userId)
      .is('used_at', null)
      .order('redeemed_at', { ascending: false });
    if (error) throw error;
    return data as RewardRedemption[];
  },

  async addWelcomeBonus(userId: string): Promise<void> {
    const { error } = await supabase.from('point_transactions').insert({
      user_id: userId,
      points: 50,
      type: 'bonus',
      description_en: 'Welcome bonus — thanks for joining Lava Cafe!',
      description_he: 'בונוס הצטרפות — תודה שהצטרפת ללבה קפה!',
    });
    if (error) throw error;
    await supabase
      .from('profiles')
      .update({ points: 50 })
      .eq('id', userId)
      .eq('points', 0);
  },
};
