import { create } from 'zustand';

interface FavoritesState {
  favoriteIds: Set<string>;
  toggle: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setAll: (ids: string[]) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),

  toggle: (productId) => {
    set((state) => {
      const next = new Set(state.favoriteIds);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return { favoriteIds: next };
    });
  },

  isFavorite: (productId) => get().favoriteIds.has(productId),

  setAll: (ids) => set({ favoriteIds: new Set(ids) }),
}));
