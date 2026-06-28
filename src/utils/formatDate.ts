export function formatDate(date: Date, lang: string = 'fr'): string {
  const locale = lang === 'en' ? 'en-US' : 'fr-FR';
  return new Intl.DateTimeFormat(locale, {
    year:  'numeric',
    month: 'long',
    day:   'numeric',
  }).format(date);
}
