import type { CollectionEntry } from 'astro:content';

export type RelatedItem = CollectionEntry<'projects'> & { type: 'project' };

/**
 * Returns up to `limit` projects that share the given tag ID or label,
 * sorted newest first, filtered to the given language.
 */
export function getRelatedItems(
  tagId: string,
  tagLabel: string,
  lang: string,
  allProjects: CollectionEntry<'projects'>[],
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

  return pMatches
    .sort((a, b) => {
      const dateA = new Date(a.data.year, 0);
      const dateB = new Date(b.data.year, 0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, limit);
}
