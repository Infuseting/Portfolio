import { ui, defaultLang } from './ui';
export { defaultLang };

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as keyof typeof ui;
  return defaultLang;
}

export function useTranslations(lang: string | keyof typeof ui = defaultLang) {
  const validLang = (lang && lang in ui ? lang : defaultLang) as keyof typeof ui;
  return function t(key: keyof typeof ui[typeof defaultLang]) {
    return ui[validLang][key] ?? ui[defaultLang][key];
  };
}

export function getAltLang(lang: string) {
  return lang === 'fr' ? 'en' : 'fr';
}
