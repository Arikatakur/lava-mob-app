import { create } from 'zustand';
import { rewardsService } from '../services/rewards.service';
import type { Reward, PointTransaction, RewardRedemption } from '../types';

interface RewardsState {
  rewards: Reward[];
  transactions: PointTransaction[];
  redemptions: RewardRedemption[];
  loading: boolean;
  error: string | null;

  fetchRewards: () => Promise<void>;
  fetchTransactions: (userId: string) => Promise<void>;
  fetchRedemptions: (userId: string) => Promise<void>;
  redeemReward: (userId: string, reward: Reward) => Promise<RewardRedemption>;
  reset: () => void;
}

export const useRewardsStore = create<RewardsState>((set, get) => ({
  rewards: [],
  transactions: [],
  redemptions: [],
  loading: false,
  error: null,

  fetchRewards: async () => {
    set({ loading: true, error: null });
    try {
      const rewards = await rewardsService.getRewards();
      set({ rewards, loading: false });
    } catch (e) {
      set({ loading: false, error: 'Failed to load rewards' });
    }
  },

  fetchTransactions: async (userId: string) => {
    try {
      const transactions = await rewardsService.getPointTransactions(userId);
      set({ transactions });
    } catch {
      // non-blocking
    }
  },

  fetchRedemptions: async (userId: string) => {
    try {
      const redemptions = await rewardsService.getRedemptions(userId);
      set({ redemptions });
    } catch {
      // non-blocking
    }
  },

  redeemReward: async (userId: string, reward: Reward) => {
    const redemption = await rewardsService.redeemReward(userId, reward.id, reward.points_required);
    // Refresh local data
    const [transactions, redemptions] = await Promise.all([
      rewardsService.getPointTransactions(userId),
      rewardsService.getRedemptions(userId),
    ]);
    set({ transactions, redemptions });
    return redemption;
  },

  reset: () => set({ rewards: [], transactions: [], redemptions: [], loading: false, error: null }),
}));
