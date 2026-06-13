// ABOUTME: Client-side notes list with search and category filter pills.
// ABOUTME: Fetches all notes from the JSON API when user interacts with filters.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import type { NoteMetadata } from '@/utils/notes'

import { formatRelativeListDate } from '@/utils/date'
import { notePath } from '@/utils/paths'

interface NotesListProps {
  categories: string[]
  notes: NoteMetadata[]
}

export default function NotesList({ categories, notes: initialNotes }: NotesListProps) {
  const [allNotes, setAllNotes] = useState<NoteMetadata[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const fetchingRef = useRef(false)
  const initializedRef = useRef(false)

  const isFiltering = searchQuery !== '' || selectedCategory !== null

  // Fetch all notes from API (needed when filtering across pages)
  const fetchAllNotes = useCallback(async () => {
    if (fetchingRef.current || hasFetched) return
    fetchingRef.current = true

    try {
      const res = await fetch('/notes/index.json')
      if (!res.ok) throw new Error(`Failed to load notes (${res.status})`)
      const data: NoteMetadata[] = await res.json()
      setAllNotes(data)
      setHasFetched(true)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      fetchingRef.current = false
    }
  }, [hasFetched])

  // Initialize from URL params once after hydration: the query string is only
  // readable in the browser, so the prerendered HTML can't include it and the
  // synchronous setState (one extra render before paint) is intentional.
  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    const params = new URLSearchParams(window.location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')

    // eslint-disable-next-line react-hooks/set-state-in-effect -- URL state is browser-only, see above
    if (searchParam) setSearchQuery(searchParam)
    if (categoryParam && categories.includes(categoryParam)) setSelectedCategory(categoryParam)
    if (searchParam || categoryParam) fetchAllNotes()
  }, [categories, fetchAllNotes])

  // Sync filter state to URL query string
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)

    const qs = params.toString()
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [searchQuery, selectedCategory])

  // Hide/show pagination when filtering
  useEffect(() => {
    const pagination = document.getElementById('notes-pagination')
    if (isFiltering) {
      pagination?.classList.add('hidden')
    } else {
      pagination?.classList.remove('hidden')
    }
  }, [isFiltering])

  const displayNotes = useMemo(() => {
    const source = hasFetched ? allNotes : initialNotes

    if (!isFiltering) return initialNotes

    return source.filter((note) => {
      const matchesCategory = !selectedCategory || note.category === selectedCategory
      const matchesSearch =
        !searchQuery || note.title.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [allNotes, hasFetched, initialNotes, isFiltering, searchQuery, selectedCategory])

  const handleSearchChange = (value: string): void => {
    setSearchQuery(value)
    fetchAllNotes()
  }

  const handleCategoryToggle = (category: string): void => {
    setSelectedCategory((prev) => (prev === category ? null : category))
    fetchAllNotes()
  }

  return (
    <div className="space-y-8">
      {/* Search & filter controls */}
      <div className="space-y-4">
        <div className="relative">
          <input
            aria-label="Search notes"
            className="h-10 w-full rounded-lg border border-(--border) bg-(--code-bg) pr-9 pl-3 text-(--text-primary) outline-none placeholder:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border) focus-visible:outline-solid"
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search notes…"
            type="text"
            value={searchQuery}
          />
          {searchQuery !== '' && (
            <button
              aria-label="Clear search"
              className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-sm text-secondary transition-colors hover:text-(--text-primary)"
              onClick={() => setSearchQuery('')}
              type="button"
            >
              ✕
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            aria-pressed={selectedCategory === null}
            className={`tag tag-interactive ${selectedCategory === null ? 'tag-selected' : ''}`}
            onClick={() => setSelectedCategory(null)}
            type="button"
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              aria-pressed={selectedCategory === cat}
              className={`tag tag-interactive ${selectedCategory === cat ? 'tag-selected' : ''}`}
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Notes list */}
      <ul className="my-5 flex list-none flex-col p-0">
        {displayNotes.length === 0 ? (
          <li className="list-none py-4 text-sm text-secondary">No notes found.</li>
        ) : (
          displayNotes.map((note) => <NoteItem key={note.id} note={note} />)
        )}
      </ul>
    </div>
  )
}

function NoteItem({ note }: { note: NoteMetadata }) {
  return (
    <li className="group list-none">
      <a
        className="-mx-2 flex items-center justify-between gap-6 rounded-sm px-2 py-1.5 no-underline transition-colors hover:bg-(--selection) focus-visible:bg-(--selection)"
        href={notePath(note.id)}
        title={note.title}
      >
        <span className="block min-w-0 truncate font-medium">{note.title}</span>
        {/* Relative date is computed at build time; drift until the next deploy is
            acceptable, so hydration mismatches are intentionally suppressed. */}
        <time
          className="shrink-0 text-sm whitespace-nowrap text-secondary"
          dateTime={note.pubDate}
          suppressHydrationWarning
        >
          {formatRelativeListDate(note.pubDate)}
        </time>
      </a>
    </li>
  )
}
