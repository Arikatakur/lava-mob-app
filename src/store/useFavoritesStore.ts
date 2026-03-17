import { create } from 'zustand';
import { favoritesService } from '../services/favorites.service';
import { useAuthStore } from './useAuthStore';

interface FavoritesState {
  favoriteIds: Set<string>;
  toggle: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setAll: (ids: string[]) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favoriteIds: new Set(),

  toggle: (productId) => {
    const { user } = useAuthStore.getState();

    // Optimistic update
    let adding = false;
    set((state) => {
      const next = new Set(state.favoriteIds);
      if (next.has(productId)) {
        next.delete(productId);
        adding = false;
      } else {
        next.add(productId);
        adding = true;
      }
      return { favoriteIds: next };
    });

    // Persist to DB — revert on failure
    if (user) {
      const apiCall = adding
        ? favoritesService.addFavorite(user.id, productId)
        : favoritesService.removeFavorite(user.id, productId);

      apiCall.catch(() => {
        set((state) => {
          const next = new Set(state.favoriteIds);
          if (adding) next.delete(productId);
          else next.add(productId);
          return { favoriteIds: next };
        });
      });
    }
  },

  isFavorite: (productId) => get().favoriteIds.has(productId),

  setAll: (ids) => set({ favoriteIds: new Set(ids) }),
}));
