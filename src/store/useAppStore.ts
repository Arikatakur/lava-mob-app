import { create } from 'zustand';
import type { Language } from '../types';

interface AppState {
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: 'he',
  isRTL: true,

  setLanguage: (lang) => {
    set({ language: lang, isRTL: lang === 'he' });
  },
}));
