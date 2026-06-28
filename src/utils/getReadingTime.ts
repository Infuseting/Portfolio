const WORDS_PER_MINUTE = 200;

export function getReadingTime(text: string, lang: string = 'fr'): string {
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / WORDS_PER_MINUTE);
  if (lang === 'en') {
    return minutes <= 1 ? '1 min read' : `${minutes} min read`;
  }
  return minutes <= 1 ? '1 min de lecture' : `${minutes} min de lecture`;
}
