import { create } from 'zustand';
import type { Language, OrderMode } from '../types';

interface AppState {
  // ── Language / RTL ──────────────────────────────────────────────
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;

  // ── Order mode (session only — resets every app launch) ─────────
  /** The mode chosen by the user in this session, or null if not yet chosen. */
  orderMode: OrderMode | null;
  /**
   * True once the user has confirmed a mode for this session.
   * Starts as false on every app launch (in-memory only, not persisted).
   * index.tsx gates on this to show the mode-picker before the main tabs.
   */
  orderModeSelected: boolean;
  setOrderMode: (mode: OrderMode) => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Language
  language: 'he',
  isRTL: true,
  setLanguage: (lang) => set({ language: lang, isRTL: lang === 'he' }),

  // Order mode — always starts as null / not-selected each launch
  orderMode: null,
  orderModeSelected: false,
  setOrderMode: (mode) => set({ orderMode: mode, orderModeSelected: true }),
}));
