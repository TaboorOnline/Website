// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import arabic from './locales/ar.json';
import english from './locales/en.json';

const resources = {
  ar: {
    translation: arabic,
  },
  en: {
    translation: english,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ar',
    debug: import.meta.env.DEV,
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

// الدالة المساعدة لتغيير اتجاه الصفحة بناءً على اللغة
export const changeLanguage = (lng: string) => {
  i18n.changeLanguage(lng);
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
};

// الحصول على الاتجاه الحالي
export const getDirection = () => {
  return i18n.language === 'ar' ? 'rtl' : 'ltr';
};

// التحقق من ما إذا كانت اللغة الحالية هي العربية
export const isRTL = () => {
  return i18n.language === 'ar';
};

// الحصول على اللغة الحالية
export const getCurrentLanguage = () => {
  return i18n.language;
};

// ضبط اللغة الافتراضية عند بدء التطبيق
export const setupLanguage = () => {
  // استخدام اللغة المحفوظة في localStorage إذا كانت موجودة
  const savedLanguage = localStorage.getItem('language');
  if (savedLanguage && ['ar', 'en'].includes(savedLanguage)) {
    changeLanguage(savedLanguage);
  } else {
    // استخدام العربية كلغة افتراضية
    changeLanguage('ar');
  }
};