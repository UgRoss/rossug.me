import * as Select from '@radix-ui/react-select'
import { Check, ChevronDown, Search } from 'lucide-react'

import { type Note, useAllNotes } from '../../hooks/useAllNotes'
import { useDelegatedClick } from '../../hooks/useDelegatedClick'
import { useDOMVisibility } from '../../hooks/useDOMVisibility'
import { useNoteFilters } from '../../hooks/useNoteFilters'
import NoteCard from './NoteCard'

interface NotesListProps {
  categories: string[]
  notes?: Note[]
}

export default function NotesList({ categories, notes: initialNotes = [] }: NotesListProps) {
  // Data fetching
  const { error, fetchNotes, isLoading, notes, refetch } = useAllNotes(initialNotes)

  // Filter & URL logic
  const {
    filteredNotes,
    isSearching,
    mounted,
    resetFilters,
    searchQuery,
    selectedCategory,
    setCategory,
    setSearch
  } = useNoteFilters({
    categories,
    notes,
    onFilterChange: fetchNotes
  })

  // Side effects
  useDOMVisibility(isSearching && mounted, ['#notes-container', '.pagination-container'])

  useDelegatedClick('[data-category-filter]', 'data-category-filter', (category) => {
    setCategory(category)
    const filtersElement = document.getElementById('notes-filters')
    if (filtersElement) {
      filtersElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })

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
            onChange={(e) => setSearch(e.target.value)}
            onFocus={fetchNotes}
            placeholder="Search notes..."
            type="text"
            value={searchQuery}
          />
        </div>

        {/* Category Select */}
        <Select.Root
          onOpenChange={(open) => open && fetchNotes()}
          onValueChange={setCategory}
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
            onClick={resetFilters}
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

      {isSearching && (
        <div className="mt-8 grid gap-6 border-t border-neutral-100 pt-8 dark:border-neutral-800">
          {error ? (
            <div className="py-12 text-center">
              <p className="mb-3 text-neutral-500">{error}</p>
              <button
                className="text-sm text-blue-600 underline hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                onClick={refetch}
                type="button"
              >
                Try again
              </button>
            </div>
          ) : filteredNotes.length > 0 ? (
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
