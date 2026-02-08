import { Tag } from '@/components/ui/Tag'
import { timeAgo } from '@/utils/date'

interface NoteCardProps {
  category: string
  excerpt?: string
  id: string
  pubDate: string // Date string for serialization
  title: string
}

export default function NoteCard({ category, excerpt, id, pubDate, title }: NoteCardProps) {
  const date = new Date(pubDate)
  const timeAgoText = timeAgo(date)

  return (
    <a
      className="group block rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-neutral-300 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700"
      href={`/notes/${id}`}
    >
      <article>
        <div className="mb-3 flex items-start justify-between gap-3">
          <Tag category={category} label={category} />
          <time
            className="shrink-0 text-xs text-neutral-500 dark:text-neutral-500"
            dateTime={date.toISOString()}
          >
            {timeAgoText}
          </time>
        </div>

        <div className="mb-2 transition-transform group-hover:translate-x-0.5">
          <h3 className="text-lg leading-snug font-bold text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
            {title}
          </h3>
        </div>

        {excerpt && (
          <p className="line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {excerpt}
          </p>
        )}
      </article>
    </a>
  )
}
