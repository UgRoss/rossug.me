import { getCollection } from 'astro:content'

export async function GET() {
  const allNotes = await getCollection('notes')
  const sortedNotesMetadata = allNotes
    .filter((note) => !note.id.startsWith('_'))
    .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
    .map((note) => ({
      category: note.data.category,
      excerpt: note.data.excerpt,
      id: note.id,
      pubDate: note.data.pubDate.toISOString(),
      title: note.data.title
    }))

  return new Response(JSON.stringify(sortedNotesMetadata), {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
