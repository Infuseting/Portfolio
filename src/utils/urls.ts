/**
 * Returns the canonical URL for a blog post in the given language.
 * Strips the lang/ prefix from the content collection id.
 */
export function getBlogPostUrl(lang: string, postId: string): string {
  const slug = postId.replace(`${lang}/`, '');
  return `/${lang}/blog/${slug}`;
}
