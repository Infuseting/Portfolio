import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fr' | 'en';

interface Translations {
  [key: string]: string | Translations;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tArray: (key: string) => string[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Import locale JSONs (kept in src/locales)
import enTranslations from '../locales/en.json';
import frTranslations from '../locales/fr.json';

const translations: Record<Language, Translations> = {
  fr: frTranslations as any,
  en: enTranslations as any,
};

// Function to retrieve a nested translation value (string | array | object) with fallback to English
const getTranslationValue = (lang: Language, key: string): any => {
  const keys = key.split('.');
  let value: any = translations[lang];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English
      value = translations.en;
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2];
        } else {
          return undefined;
        }
      }
      break;
    }
  }

  return value;
};

const getTranslation = (lang: Language, key: string): string => {
  const value = getTranslationValue(lang, key);
  if (typeof value === 'string') return value;
  if (Array.isArray(value)) return value.join(' ');
  return key;
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('preferred-language') : null;
    if (saved === 'fr' || saved === 'en') return saved;
    const browserLang = typeof navigator !== 'undefined' ? navigator.language.toLowerCase() : 'en';
    if (browserLang.startsWith('fr')) return 'fr';
    return 'en';
  });

  useEffect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('preferred-language', language);
    }
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => getTranslation(language, key);

  const tArray = (key: string): string[] => {
    const value = getTranslationValue(language, key);
    if (Array.isArray(value)) return value as string[];
    if (typeof value === 'string') return [value];
    return [];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tArray }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
