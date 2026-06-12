// ABOUTME: Shared helpers for content collections used by posts, notes, and books utilities.
// ABOUTME: Centralizes the draft filter (filenames prefixed with _) and date sorting.

interface DatedEntry {
  data: { pubDate: Date }
}

interface IdentifiableEntry {
  id: string
}

/**
 * Entries whose filenames start with _ are drafts and excluded from the site
 */
export const isPublished = (entry: IdentifiableEntry): boolean => !entry.id.startsWith('_')

/**
 * Comparator for sorting entries by publication date, newest first
 */
export const byPubDateDesc = (a: DatedEntry, b: DatedEntry): number =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
