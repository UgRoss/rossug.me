import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

import { byPubDateDesc, isPublished } from '@/utils/collections'

/**
 * Serializable note metadata shape shared with the notes JSON API and client components
 */
export interface NoteMetadata {
  category: string
  excerpt?: string
  id: string
  pubDate: string
  title: string
}

/**
 * Get all notes, filtering out notes whose filenames start with _
 */
export async function getFilteredNotes(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getCollection('notes')
  return notes.filter(isPublished)
}

/**
 * Get all notes sorted by publication date (newest first), filtering out drafts
 */
export async function getSortedFilteredNotes(): Promise<CollectionEntry<'notes'>[]> {
  const notes = await getFilteredNotes()
  return notes.toSorted(byPubDateDesc)
}

/**
 * Extract unique categories from a list of notes, sorted alphabetically
 */
export function getUniqueNotesCategories(notes: CollectionEntry<'notes'>[]): string[] {
  return [...new Set(notes.map((note) => note.data.category))].toSorted()
}

/**
 * Transform notes to a serializable metadata format for JSON API
 */
export function mapNotesToMetadata(notes: CollectionEntry<'notes'>[]): NoteMetadata[] {
  return notes.map((note) => ({
    category: note.data.category,
    excerpt: note.data.excerpt,
    id: note.id,
    pubDate: note.data.pubDate.toISOString(),
    title: note.data.title
  }))
}
