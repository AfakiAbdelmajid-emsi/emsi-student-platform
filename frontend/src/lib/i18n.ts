import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/common.json';
import fr from '@/locales/fr/common.json';

// Get the stored language from localStorage or default to 'en'
const getStoredLanguage = () => {
  if (typeof window === 'undefined') return 'en';
  return localStorage.getItem('lang') || 'en';
};

// Initialize i18next only on the client side
if (typeof window !== 'undefined' && !i18next.isInitialized) {
  i18next
    .use(initReactI18next)
    .init({
      resources: {
        en: { common: en },
        fr: { common: fr },
      },
      lng: getStoredLanguage(),
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      react: {
        useSuspense: false, // This is important for Next.js
      },
    });
}

// Export a function to change language that also updates localStorage
export const changeLanguage = (lang: string) => {
  if (typeof window === 'undefined') return;
  
  i18next.changeLanguage(lang);
  localStorage.setItem('lang', lang);
};

export default i18next; 