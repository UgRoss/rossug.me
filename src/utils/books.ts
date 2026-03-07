// ABOUTME: Utility functions for working with the books content collection.
// ABOUTME: Provides filtering by status and a serializable book shape for UI components.

import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

export interface BookData {
  author: string
  coverUrl: string
  id: string
  rating: number
  status: string
  summary: string
  title: string
}

export type BookEntry = CollectionEntry<'books'>

export async function getBooksByStatus(status: string): Promise<BookEntry[]> {
  const books = await getFilteredBooks()
  return books.filter((book) => book.data.status === status)
}

export async function getFilteredBooks(): Promise<BookEntry[]> {
  const books = await getCollection('books')
  return books.filter((book) => !book.id.startsWith('_'))
}

export function mapBookToData(book: BookEntry): BookData {
  return {
    author: book.data.author,
    coverUrl: book.data.coverUrl,
    id: book.id,
    rating: book.data.rating,
    status: book.data.status,
    summary: book.data.summary,
    title: book.data.title
  }
}
