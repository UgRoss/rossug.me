import React, { useState, useMemo, useEffect } from 'react'
import * as Select from '@radix-ui/react-select'
import { ChevronDown, Check, Search } from 'lucide-react'

interface Note {
  id: string
  title: string
  pubDate: Date
  category: string
  excerpt?: string
}

interface NotesListProps {
  notes: Note[]
  categories: string[]
}

export default function NotesList({ notes, categories }: NotesListProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [mounted, setMounted] = useState(false)

  // Initialize from URL params
  useEffect(() => {
    setMounted(true)
    const params = new URLSearchParams(window.location.search)
    const categoryParam = params.get('category')
    const searchParam = params.get('search')
    
    if (categoryParam && (categoryParam === 'all' || categories.includes(categoryParam))) {
      setSelectedCategory(categoryParam)
    }
    if (searchParam) {
      setSearchQuery(searchParam)
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

  // Filter notes based on category and search
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory
      const matchesSearch = searchQuery === '' || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [notes, selectedCategory, searchQuery])

  // Show/hide note cards based on filters
  useEffect(() => {
    if (!mounted) return
    
    const container = document.getElementById('notes-container')
    if (!container) return

    const cards = container.querySelectorAll('[data-note-card]')
    cards.forEach((card) => {
      const noteId = card.getAttribute('data-note-id')
      const isVisible = filteredNotes.some((note) => note.id === noteId)
      
      if (card instanceof HTMLElement) {
        if (isVisible) {
          card.classList.remove('hidden')
        } else {
          card.classList.add('hidden')
        }
      }
    })
  }, [filteredNotes, mounted])

  // Handle category tag clicks from NoteCard
  useEffect(() => {
    const handleCategoryClick = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.matches('[data-category-filter]')) {
        const category = target.getAttribute('data-category-filter')
        if (category) {
          setSelectedCategory(category)
          // Scroll to filters
          const filtersElement = document.getElementById('notes-filters')
          if (filtersElement) {
            filtersElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }
    }

    document.addEventListener('click', handleCategoryClick)
    return () => document.removeEventListener('click', handleCategoryClick)
  }, [])

  const handleReset = () => {
    setSelectedCategory('all')
    setSearchQuery('')
  }

  if (!mounted) {
    return null
  }

  return (
    <div id="notes-filters" className="mb-8 space-y-3">
      {/* Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search notes by title"
            className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600"
          />
        </div>

        {/* Category Select */}
        <Select.Root value={selectedCategory} onValueChange={setSelectedCategory}>
          <Select.Trigger 
            aria-label="Filter notes by category"
            className="inline-flex items-center justify-between gap-2 px-3 py-2 text-sm border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-50 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-600 sm:min-w-[140px]"
          >
            <Select.Value />
            <Select.Icon>
              <ChevronDown className="w-3.5 h-3.5" />
            </Select.Icon>
          </Select.Trigger>

          <Select.Portal>
            <Select.Content className="overflow-hidden bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-50">
              <Select.Viewport className="p-1">
                <Select.Item
                  value="all"
                  className="relative flex items-center px-8 py-2 text-sm text-neutral-900 dark:text-neutral-100 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-neutral-100 dark:focus:bg-neutral-800 outline-none"
                >
                  <Select.ItemText>All Categories</Select.ItemText>
                  <Select.ItemIndicator className="absolute left-2">
                    <Check className="w-4 h-4" />
                  </Select.ItemIndicator>
                </Select.Item>

                {categories.map((category) => (
                  <Select.Item
                    key={category}
                    value={category}
                    className="relative flex items-center px-8 py-2 text-sm text-neutral-900 dark:text-neutral-100 rounded cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:bg-neutral-100 dark:focus:bg-neutral-800 outline-none"
                  >
                    <Select.ItemText>{category}</Select.ItemText>
                    <Select.ItemIndicator className="absolute left-2">
                      <Check className="w-4 h-4" />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      {/* Clear Filters Button - Moved below to prevent container resizing */}
      {(selectedCategory !== 'all' || searchQuery !== '') && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-neutral-500 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 underline transition-colors"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Results count */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
        {selectedCategory !== 'all' && ` in ${selectedCategory}`}
        {searchQuery && ` matching "${searchQuery}"`}
      </p>
    </div>
  )
}
