// src/shared/utils/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { Language } from '../types/types';

// Import translation files
import translationEN from '../constants/locales/en.json';
import translationAR from '../constants/locales/ar.json';

const resources = {
  en: {
    translation: translationEN,
  },
  ar: {
    translation: translationAR,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already safes from XSS
    },
    react: {
      useSuspense: true,
    },
  });

// Helper function to change language and handle RTL
export const changeLanguage = (language: Language) => {
  i18n.changeLanguage(language);
  
  // Update HTML dir attribute for RTL support
  document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  
  // Store language preference
  localStorage.setItem('language', language);
};

// Function to initialize language from stored preference
export const initLanguage = () => {
  const storedLanguage = localStorage.getItem('language') as Language | null;
  
  if (storedLanguage) {
    changeLanguage(storedLanguage);
  }
};

export default i18n;