// ABOUTME: JSON API endpoint that returns all notes as serializable metadata.
// ABOUTME: Used by the client-side notes filter to search across all notes.

import type { APIRoute } from 'astro'

import { getSortedFilteredNotes, mapNotesToMetadata } from '@/utils/notes'

export const GET: APIRoute = async () => {
  const notes = await getSortedFilteredNotes()
  const metadata = mapNotesToMetadata(notes)

  return new Response(JSON.stringify(metadata), {
    headers: { 'Content-Type': 'application/json' }
  })
}
