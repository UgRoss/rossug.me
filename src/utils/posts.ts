import type { CollectionEntry } from 'astro:content'

import { getCollection } from 'astro:content'

import { byPubDateDesc, isPublished } from '@/utils/collections'

/**
 * Get all posts, filtering out posts whose filenames start with _
 */
export async function getFilteredPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts')
  return posts.filter(isPublished)
}

/**
 * Get all posts sorted by publication date, filtering out posts whose filenames start with _
 */
export async function getSortedFilteredPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getFilteredPosts()
  return posts.toSorted(byPubDateDesc)
}
