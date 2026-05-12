import { he } from './he';
import { en } from './en';
import { ar } from './ar';
import type { Language } from '../types';

export const translations = { he, en, ar } as const;

export type TranslationKey = typeof ar;

export function t(lang: Language, key: string): string {
  const keys = key.split('.');
  let val: unknown = translations[lang];
  for (const k of keys) {
    if (val && typeof val === 'object') {
      val = (val as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof val === 'string' ? val : key;
}
