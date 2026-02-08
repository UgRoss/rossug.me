import { useCallback, useEffect, useRef, useState } from 'react'

export interface Note {
  category: string
  excerpt?: string
  id: string
  pubDate: string
  title: string
}

export function useAllNotes(initialNotes: Note[] = []) {
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [isLoading, setIsLoading] = useState(false)
  const [hasFetched, setHasFetched] = useState(!!initialNotes && initialNotes.length > 0)
  const [error, setError] = useState<null | string>(null)

  // Use a ref to keep track of current state for the stable fetchNotes function
  const stateRef = useRef({ hasFetched, isLoading })

  useEffect(() => {
    stateRef.current = { hasFetched, isLoading }
  }, [isLoading, hasFetched])

  const fetchNotes = useCallback(async () => {
    // Already fetching or data already loaded
    if (stateRef.current.isLoading || stateRef.current.hasFetched) return

    stateRef.current.isLoading = true
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/notes/index.json')
      if (!response.ok) {
        throw new Error(`Failed to load notes (${response.status})`)
      }
      const data = await response.json()
      setNotes(data)
      setHasFetched(true)
      stateRef.current.hasFetched = true
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load notes'
      console.error('Failed to fetch notes:', err)
      setError(message)
    } finally {
      setIsLoading(false)
      stateRef.current.isLoading = false
    }
  }, [])

  const refetch = useCallback(() => {
    setHasFetched(false)
    stateRef.current.hasFetched = false
    fetchNotes()
  }, [fetchNotes])

  return {
    error,
    fetchNotes,
    hasFetched,
    isLoading,
    notes,
    refetch
  }
}
