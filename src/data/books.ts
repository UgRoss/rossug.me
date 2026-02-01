export interface Book {
  author: string
  coverUrl: string
  highlights?: string[]
  id: string
  notes?: string[]
  // 0 represents "not rated", 1-5 represents the rating
  rating: 0 | 1 | 2 | 3 | 4 | 5
  status: BookStatus
  summary: string
  title: string
}

export type BookStatus = 'finished' | 'reading' | 'wishlist'

export const BOOKS: Book[] = [
  {
    author: 'F. Scott Fitzgerald',
    coverUrl:
      'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&q=80&w=800',
    id: '1',
    notes: ['The green light as a symbol of hope.', "Gatsby's obsession with the past."],
    rating: 0,
    status: 'reading',
    summary:
      'A story of the fabulously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
    title: 'The Great Gatsby'
  },
  {
    author: 'James Clear',
    coverUrl:
      'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&q=80&w=800',
    highlights: [
      'You do not rise to the level of your goals. You fall to the level of your systems.'
    ],
    id: '2',
    notes: ['1% better every day.', 'Systems over goals.'],
    rating: 5,
    status: 'finished',
    summary: 'An easy & proven way to build good habits & break bad ones.',
    title: 'Atomic Habits'
  },
  {
    author: 'Cal Newport',
    coverUrl:
      'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&q=80&w=800',
    highlights: [
      'Deep work is the ability to focus without distraction on a cognitively demanding task.',
      'To build your working life around the experience of flow produced by deep work is a proven path to deep satisfaction.',
      'If you don’t produce, you won’t thrive—no matter how skilled or talented you are.',
      'High-Quality Work Produced = (Time Spent) x (Intensity of Focus)',
      'The Deep Work Hypothesis: The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable in our economy. As a consequence, the few who cultivate this skill, and then make it the core of their working life, will thrive.'
    ],
    id: '3',
    notes: ['The importance of deep work.', 'Quit social media.'],
    rating: 4,
    status: 'finished',
    summary: 'Rules for focused success in a distracted world.',
    title: 'Deep Work'
  },
  {
    author: 'Harper Lee',
    coverUrl:
      'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=800',
    id: '4',
    notes: [],
    rating: 0,
    status: 'reading',
    summary:
      'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
    title: 'To Kill a Mockingbird'
  }
]
