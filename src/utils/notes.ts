import { type CollectionEntry, getCollection } from 'astro:content'

/**
 * Get all notes, filtering out notes whose filenames start with _
 */
export async function getFilteredNotes(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getCollection('notes')
  return notes.filter((note) => !note.id.startsWith('_'))
}

/**
 * Extract unique categories from notes, sorted alphabetically
 */
export async function getNotesCategories(): Promise<string[]> {
  const notes = await getFilteredNotes()
  return [...new Set(notes.map((note) => note.data.category))].sort()
}

/**
 * Get all notes sorted by publication date (newest first), filtering out drafts
 */
export async function getSortedFilteredNotes(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getFilteredNotes()
  return notes.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

/**
 * Transform notes to a serializable metadata format for JSON API
 */
export function mapNotesToMetadata(notes: CollectionEntry<'notes'>[]) {
  return notes.map((note) => ({
    category: note.data.category,
    excerpt: note.data.excerpt,
    id: note.id,
    pubDate: note.data.pubDate.toISOString(),
    title: note.data.title
  }))
}
