import { useAppStore } from '../store/useAppStore';

/**
 * Returns the localized string for a product/category field.
 * Usage: localize(product, 'name') → product.name_he or product.name_en
 */
export function useLocalizedText() {
  const { language } = useAppStore();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function localize(obj: Record<string, any>, field: string): string {
    const localizedKey = `${field}_${language}`;
    const fallbackLang = language === 'he' ? 'en' : language === 'ar' ? 'en' : 'he';
    const fallbackKey = `${field}_${fallbackLang}`;
    const val = obj[localizedKey] ?? obj[fallbackKey];
    return typeof val === 'string' ? val : '';
  }

  return { localize };
}
