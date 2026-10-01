const LOCALES: Record<string, string> = {
  en: 'en-US',
  fr: 'fr-FR',
};

export function formatDate(date: Date, lang: string = 'fr'): string {
  const locale = LOCALES[lang] || 'fr-FR';
  return new Intl.DateTimeFormat(locale, {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(date);
}
