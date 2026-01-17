export type BookStatus = 'reading' | 'finished' | 'wishlist'

export interface Book {
  id: string
  title: string
  author: string
  coverUrl: string
  status: BookStatus
  // 0 represents "not rated", 1-5 represents the rating
  rating: 0 | 1 | 2 | 3 | 4 | 5
  summary: string
  notes?: string[]
  highlights?: string[]
}

export const BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverUrl:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    status: 'reading',
    rating: 0,
    summary:
      'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    notes: ['The green light as a symbol of hope.', "Gatsby's obsession with the past."]
  },
  {
    id: '2',
    title: 'Atomic Habits',
    author: 'James Clear',
    coverUrl:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    status: 'finished',
    rating: 5,
    summary: 'An easy & proven way to build good habits & break bad ones.',
    notes: ['1% better every day.', 'Systems over goals.'],
    highlights: [
      'You do not rise to the level of your goals. You fall to the level of your systems.'
    ]
  },
  {
    id: '3',
    title: 'Deep Work',
    author: 'Cal Newport',
    coverUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    status: 'finished',
    rating: 4,
    summary: 'Rules for focused success in a distracted world.',
    notes: ['The importance of deep work.', 'Quit social media.'],
    highlights: [
      'Deep work is the ability to focus without distraction on a cognitively demanding task.',
      'To build your working life around the experience of flow produced by deep work is a proven path to deep satisfaction.',
      'If you don’t produce, you won’t thrive—no matter how skilled or talented you are.',
      'High-Quality Work Produced = (Time Spent) x (Intensity of Focus)',
      'The Deep Work Hypothesis: The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive.'
    ]
  },
  {
    id: '4',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverUrl:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    status: 'reading',
    rating: 0,
    summary:
      'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    notes: []
  }
]

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
}
