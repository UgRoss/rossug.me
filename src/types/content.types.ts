import type { CollectionEntry } from 'astro:content'

// PostList component props interface
export interface PostListProps {
  posts: CollectionEntry<'posts'>[]
}
