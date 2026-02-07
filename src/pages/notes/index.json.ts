import { getSortedFilteredNotes, mapNotesToMetadata } from '@/utils/notes'

export async function GET() {
  const notes = await getSortedFilteredNotes()
  const metadata = mapNotesToMetadata(notes)

  return new Response(JSON.stringify(metadata), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
