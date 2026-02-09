import { Tag } from '@/components/ui/Tag'
import { timeAgo } from '@/utils/date'

interface NoteListItemProps {
  category: string
  excerpt?: string
  id: string
  isLast?: boolean
  pubDate: string // Date string for serialization
  title: string
}

export default function NoteListItem({ category, id, pubDate, title }: NoteListItemProps) {
  const date = new Date(pubDate)
  const timeAgoText = timeAgo(date)

  return (
    <div className="group -mx-3 flex items-baseline justify-between gap-4 rounded-lg px-3 py-3 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
      <a className="flex min-w-0 flex-1 items-baseline" href={`/notes/${id}`}>
        <span className="truncate text-base font-medium text-neutral-900 transition-colors group-hover:text-blue-600 dark:text-neutral-100 dark:group-hover:text-blue-400">
          {title}
        </span>

        <time className="sr-only" dateTime={date.toISOString()}>
          {timeAgoText}
        </time>
      </a>

      <div className="shrink-0">
        <Tag category={category} label={category} />
      </div>
    </div>
  )
}
