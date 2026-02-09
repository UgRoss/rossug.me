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
    <li className="index-item">
      <a className="index-link" href={`/notes/${id}`}>
        <span className="index-title">{title}</span>
        <span className="index-leader" />
        <span className="index-meta">
          <Tag category={category} interactive={false} label={category} />
        </span>
        <time className="sr-only" dateTime={date.toISOString()}>
          {timeAgoText}
        </time>
      </a>
    </li>
  )
}
