// ABOUTME: Utility functions for working with the books content collection.
// ABOUTME: Provides filtering by status and a serializable book shape for UI components.

import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

export interface BookData {
  author: string
  coverUrl: string
  id: string
  rating: BookRating
  status: BookStatus
  summary: string
  title: string
}

export type BookEntry = CollectionEntry<'books'>
export type BookRating = BookEntry['data']['rating']
export type BookStatus = BookEntry['data']['status']

interface BooksByStatus {
  finished: BookEntry[]
  reading: BookEntry[]
  wishlist: BookEntry[]
}

export async function getBooksForReadingPage(): Promise<{
  allBooks: BookEntry[]
  currentlyReading: BookEntry[]
  finishedBooks: BookEntry[]
}> {
  const allBooks = await getFilteredBooks()
  const { finished, reading } = groupBooksByStatus(allBooks)

  return {
    allBooks,
    currentlyReading: reading,
    finishedBooks: finished
  }
}

export async function getFilteredBooks(): Promise<BookEntry[]> {
  const books = await getCollection('books')
  return books.filter((book) => !book.id.startsWith('_'))
}

export function groupBooksByStatus(books: BookEntry[]): BooksByStatus {
  return books.reduce<BooksByStatus>(
    (acc, book) => {
      acc[book.data.status].push(book)
      return acc
    },
    {
      finished: [],
      reading: [],
      wishlist: []
    }
  )
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
