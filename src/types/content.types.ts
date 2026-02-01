import type { CollectionEntry } from 'astro:content'

// PostList component props interface
export interface PostListProps {
  posts: CollectionEntry<'posts'>[]
}

// Reading time interface
export interface ReadingTime {
  minutes: number
  text: string
  time: number
  words: number
}

// TOC item interface
export interface TOCItem {
  id: string
  index: number
  level: number
  text: string
}
