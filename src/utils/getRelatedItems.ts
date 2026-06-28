import type { CollectionEntry } from 'astro:content';

export type RelatedItem = (CollectionEntry<'projects'> | CollectionEntry<'blog'>) & { type: 'project' | 'blog' };

/**
 * Returns up to `limit` projects + blog posts that share the given tag ID or label,
 * sorted newest first, filtered to the given language.
 */
export function getRelatedItems(
  tagId: string,
  tagLabel: string,
  lang: string,
  allProjects: CollectionEntry<'projects'>[],
  allBlog: CollectionEntry<'blog'>[],
  limit = 3,
): RelatedItem[] {
  const matchTag = (tagArr: string[]) =>
    tagArr.some(
      (t) =>
        t.toLowerCase() === tagId.toLowerCase() ||
        t.toLowerCase() === tagLabel.toLowerCase(),
    );

  const pMatches = allProjects
    .filter((p) => p.id.startsWith(`${lang}/`) && matchTag(p.data.tags || []))
    .map((p) => ({ ...p, type: 'project' as const }));

  const bMatches = allBlog
    .filter((b) => b.id.startsWith(`${lang}/`) && matchTag(b.data.tags || []))
    .map((b) => ({ ...b, type: 'blog' as const }));

  return [...pMatches, ...bMatches]
    .sort((a, b) => {
      const dateA = a.type === 'project' ? new Date(a.data.year, 0) : a.data.publishDate;
      const dateB = b.type === 'project' ? new Date(b.data.year, 0) : b.data.publishDate;
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
}
