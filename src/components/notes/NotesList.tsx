// ABOUTME: Client-side notes list with search and category filter pills.
// ABOUTME: Fetches all notes from the JSON API when user interacts with filters.

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { formatContentDate } from '@/utils/date'

interface Note {
  category: string
  excerpt?: string
  id: string
  pubDate: string
  title: string
}

interface NotesListProps {
  categories: string[]
  notes: Note[]
}

export default function NotesList({ categories, notes: initialNotes }: NotesListProps) {
  const [allNotes, setAllNotes] = useState<Note[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<null | string>(null)
  const [hasFetched, setHasFetched] = useState(false)
  const fetchingRef = useRef(false)

  const isFiltering = searchQuery !== '' || selectedCategory !== null

  // Initialize from URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const searchParam = params.get('search')
    const categoryParam = params.get('category')

    if (searchParam) setSearchQuery(searchParam)
    if (categoryParam && categories.includes(categoryParam)) setSelectedCategory(categoryParam)
    if (searchParam || categoryParam) fetchAllNotes()
  }, [])

  // Sync filter state to URL query string
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('search', searchQuery)
    if (selectedCategory) params.set('category', selectedCategory)

    const qs = params.toString()
    const newUrl = qs ? `${window.location.pathname}?${qs}` : window.location.pathname
    window.history.replaceState({}, '', newUrl)
  }, [searchQuery, selectedCategory])

  // Fetch all notes from API (needed when filtering across pages)
  const fetchAllNotes = useCallback(async () => {
    if (fetchingRef.current || hasFetched) return
    fetchingRef.current = true

    try {
      const res = await fetch('/notes/index.json')
      if (!res.ok) throw new Error(`Failed to load notes (${res.status})`)
      const data: Note[] = await res.json()
      setAllNotes(data)
      setHasFetched(true)
    } catch (err) {
      console.error('Failed to fetch notes:', err)
    } finally {
      fetchingRef.current = false
    }
  }, [hasFetched])

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

  const handleReset = (): void => {
    setSearchQuery('')
    setSelectedCategory(null)
  }

  return (
    <div className="space-y-8">
      {/* Search & filter controls */}
      <div className="space-y-3">
        <input
          aria-label="Search notes"
          className="w-full rounded-lg border border-(--border) bg-transparent px-3 py-2 text-sm text-(--text-primary) outline-none placeholder:text-muted focus:ring-2 focus:ring-(--border)"
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search notes…"
          type="text"
          value={searchQuery}
        />

        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              className={`tag tag-interactive ${selectedCategory === cat ? 'text-(--text-primary)!' : ''}`}
              key={cat}
              onClick={() => handleCategoryToggle(cat)}
              type="button"
            >
              {cat}
            </button>
          ))}

          {isFiltering && (
            <button
              className="ml-auto cursor-pointer text-xs text-muted transition-colors hover:text-(--text-primary)"
              onClick={handleReset}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Notes list */}
      <ul className="my-5 flex list-none flex-col gap-0.5 p-0">
        {displayNotes.length === 0 ? (
          <li className="list-none py-4 text-sm text-muted">No notes found.</li>
        ) : (
          displayNotes.map((note) => <NoteItem key={note.id} note={note} />)
        )}
      </ul>
    </div>
  )
}

function NoteItem({ note }: { note: Note }) {
  return (
    <li className="group list-none">
      <a
        className="-mx-2 flex items-center justify-between gap-6 rounded-sm px-2 py-1 no-underline transition-colors hover:bg-(--selection) focus-visible:bg-(--selection)"
        href={`/notes/${note.id}`}
        title={note.title}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="block min-w-0 truncate">{note.title}</span>
          <span className="tag hidden cursor-default! sm:inline-flex">{note.category}</span>
        </div>
        <span className="shrink-0 text-sm whitespace-nowrap text-muted">
          <time dateTime={note.pubDate}>{formatContentDate(note.pubDate)}</time>
        </span>
      </a>
    </li>
  )
}
