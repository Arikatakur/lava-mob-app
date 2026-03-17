import { useAppStore } from '../store/useAppStore';
import { translations } from '../locales';

export function useTranslation() {
  const { language, isRTL } = useAppStore();
  const t = translations[language];
  return { t, language, isRTL };
}
