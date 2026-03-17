import { create } from 'zustand';
import type { CartItem, Product, SelectedOption } from '../types';

interface LocalCartItem {
  id: string;
  product: Product;
  quantity: number;
  unit_price: number;
  selected_options: SelectedOption[];
  notes?: string;
}

interface CartState {
  items: LocalCartItem[];
  addItem: (product: Product, quantity: number, options: SelectedOption[], notes?: string) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

function calcUnitPrice(product: Product, options: SelectedOption[]): number {
  const optionsDelta = options.reduce((sum, o) => sum + o.price_delta, 0);
  return product.price + optionsDelta;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity, options, notes) => {
    const unit_price = calcUnitPrice(product, options);
    const id = `${product.id}-${Date.now()}`;
    set((state) => ({
      items: [
        ...state.items,
        { id, product, quantity, unit_price, selected_options: options, notes },
      ],
    }));
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((i) => i.id !== itemId),
    }));
  },

  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId ? { ...i, quantity } : i,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () => {
    return get().items.reduce((sum, i) => sum + i.unit_price * i.quantity, 0);
  },

  getItemCount: () => {
    return get().items.reduce((sum, i) => sum + i.quantity, 0);
  },
}));
