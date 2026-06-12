// ABOUTME: Shared helpers for content collection entries used by the posts/notes/books utils.
// ABOUTME: Centralizes the draft-filtering and date-sorting rules so they exist in one place.

interface DatedEntry {
  data: { pubDate: Date }
}

/**
 * Entries whose filenames start with _ are drafts and excluded from the site
 */
export const isPublished = (entry: { id: string }): boolean => !entry.id.startsWith('_')

/**
 * Comparator for sorting entries by publication date, newest first
 */
export const byPubDateDesc = (a: DatedEntry, b: DatedEntry): number =>
  b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
