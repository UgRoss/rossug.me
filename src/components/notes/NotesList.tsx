import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Search } from 'lucide-react'
import React, { useEffect, useMemo, useState } from 'react'

import NoteCard from './NoteCard'

interface Note {
  category: string
  excerpt?: string
  id: string
  pubDate: string
  title: string
}

interface NotesListProps {
  categories: string[]
  notes?: Note[]
}

export default function NotesList({ categories, notes: initialNotes }: NotesListProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes || [])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(!!initialNotes)

  const fetchNotes = async () => {
    if (hasFetched || isLoading) return
    setIsLoading(true)
    try {
      const response = await fetch('/notes/index.json')
      const data = await response.json()
      setNotes(data)
      setHasFetched(true)
    } catch (error) {
      console.error('Failed to fetch notes:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize from URL params
  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get('category')
    const searchParam = params.get('search')

    if (categoryParam && (categoryParam === 'all' || categories.includes(categoryParam))) {
      setSelectedCategory(categoryParam)
      fetchNotes()
    }
    if (searchParam) {
      setSearchQuery(searchParam)
      fetchNotes()
    }
  }, [categories])

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

  // Show/hide server side container based on if we are searching
  useEffect(() => {
    if (!mounted) return

    const container = document.getElementById('notes-container')
    const pagination = document.querySelector('.pagination-container')

    if (container) {
      if (isSearching) {
        container.classList.add('hidden')
      } else {
        container.classList.remove('hidden')
      }
    }

    if (pagination) {
      if (isSearching) {
        pagination.classList.add('hidden')
      } else {
        pagination.classList.remove('hidden')
      }
    }
  }, [isSearching, mounted])

  // Handle category tag clicks from NoteCard (both Astro and React versions)
  useEffect(() => {
    const handleCategoryClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches('[data-category-filter]')) {
        e.preventDefault()
        e.stopPropagation()
        const category = target.getAttribute('data-category-filter')
        if (category) {
          setSelectedCategory(category)
          fetchNotes()
          const filtersElement = document.getElementById('notes-filters')
          if (filtersElement) {
            filtersElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    }

    document.addEventListener('click', handleCategoryClick, true)
    return () => document.removeEventListener('click', handleCategoryClick, true)
  }, [])

  const handleReset = () => {
    setSelectedCategory('all')
    setSearchQuery('')
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="mb-8 space-y-3" id="notes-filters">
      {/* Filter Controls */}
      <div className="flex flex-col gap-3 sm:flex-row">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            aria-label="Search notes by title"
            className="w-full rounded-lg border border-neutral-200 bg-white py-2 pr-4 pl-10 text-sm text-neutral-900 placeholder-neutral-400 focus:ring-2 focus:ring-neutral-300 focus:outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:ring-neutral-600"
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={fetchNotes}
            placeholder="Search notes..."
            type="text"
            value={searchQuery}
          />
        </div>

        {/* Category Select */}
        <Select.Root
          onOpenChange={(open) => open && fetchNotes()}
          onValueChange={(val) => {
            setSelectedCategory(val)
            fetchNotes()
          }}
          value={selectedCategory}
        >
          <Select.Trigger
            aria-label="Filter notes by category"
            className="inline-flex items-center justify-between gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 hover:bg-neutral-50 focus:ring-2 focus:ring-neutral-300 focus:outline-none sm:min-w-[140px] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus:ring-neutral-600"
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="h-3.5 w-3.5" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="z-50 overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
              <Select.Viewport className="p-1">
                <Select.Item
                  className="relative flex cursor-pointer items-center rounded px-8 py-2 text-sm text-neutral-900 outline-none hover:bg-neutral-100 focus:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                  value="all"
                >
                  <Select.ItemText>All Categories</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2">
                    <Check className="h-4 w-4" />
                  </Select.ItemIndicator>
                </Select.Item>

                {categories.map((category) => (
                  <Select.Item
                    className="relative flex cursor-pointer items-center rounded px-8 py-2 text-sm text-neutral-900 outline-none hover:bg-neutral-100 focus:bg-neutral-100 dark:text-neutral-100 dark:hover:bg-neutral-800 dark:focus:bg-neutral-800"
                    key={category}
                    value={category}
                  >
                    <Select.ItemText>{category}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2">
                      <Check className="h-4 w-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Clear Filters Button */}
      {isSearching && (
        <div className="flex justify-end">
          <button
            className="text-xs text-neutral-500 underline transition-colors hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-100"
            onClick={handleReset}
            type="button"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Results count or Paginated Mode Hint */}
      <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        {isLoading && (
          <div className="h-3 w-3 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-600 dark:border-neutral-600 dark:border-t-neutral-400" />
        )}
        <p>
          {isSearching ? (
            <>
              {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'} found
              {selectedCategory !== 'all' && ` in ${selectedCategory}`}
              {searchQuery && ` matching "${searchQuery}"`}
            </>
          ) : (
            `Showing most recent notes`
          )}
        </p>
      </div>

      {/* Search Results List */}
      {isSearching && (
        <div className="mt-8 grid gap-6 border-t border-neutral-100 pt-8 dark:border-neutral-800">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => <NoteCard key={note.id} {...note} />)
          ) : (
            <p className="py-12 text-center text-neutral-500">
              {isLoading ? 'Searching notes...' : 'No notes found matching your criteria.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
