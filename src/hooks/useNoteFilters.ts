import { useCallback, useEffect, useMemo, useState } from 'react'

import type { Note } from './useAllNotes'

interface UseNoteFiltersProps {
  categories: string[]
  notes: Note[]
  onFilterChange?: () => void
}

export function useNoteFilters({ categories, notes, onFilterChange }: UseNoteFiltersProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Initialize from URL params
  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get('category')
    const searchParam = params.get('search')

    let hasInitialFilters = false

    if (categoryParam && (categoryParam === 'all' || categories.includes(categoryParam))) {
      setSelectedCategory(categoryParam)
      hasInitialFilters = true
    }
    if (searchParam) {
      setSearchQuery(searchParam)
      hasInitialFilters = true
    }

    if (hasInitialFilters && onFilterChange) {
      onFilterChange()
    }
    // Only run on mount
  }, [])

  // Update URL when filters change
  useEffect(() => {
    if (!mounted) return

    const params = new URLSearchParams()
    if (selectedCategory !== 'all') {
      params.set('category', selectedCategory)
    }
    if (searchQuery) {
      params.set('search', searchQuery)
    }

    const newUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname

    window.history.replaceState({}, '', newUrl)
  }, [selectedCategory, searchQuery, mounted])

  const isSearching = selectedCategory !== 'all' || searchQuery !== ''

  // Filter notes based on category and search
  const filteredNotes = useMemo(() => {
    if (!isSearching) return []
    return notes.filter((note) => {
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
      const matchesSearch =
        searchQuery === '' || note.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [notes, selectedCategory, searchQuery, isSearching])

  const resetFilters = useCallback(() => {
    setSelectedCategory('all')
    setSearchQuery('')
  }, [])

  const setCategory = useCallback(
    (category: string) => {
      setSelectedCategory(category)
      onFilterChange?.()
    },
    [onFilterChange]
  )

  const setSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query) onFilterChange?.()
    },
    [onFilterChange]
  )

  return {
    filteredNotes,
    isSearching,
    mounted,
    resetFilters,
    searchQuery,
    selectedCategory,
    setCategory,
    setSearch
  }
}
