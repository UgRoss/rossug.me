import type { HTMLAttributes, KeyboardEvent } from 'react'

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  category?: string
  interactive?: boolean
  label: string
}

export const Tag = ({
  category,
  className,
  interactive = true,
  label,
  onClick,
  ...props
}: TagProps) => {
  const handleKeyDown = (e: KeyboardEvent<HTMLSpanElement>) => {
    if (interactive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      e.currentTarget.click()
    }
  }

  return (
    <span
      className={`tag ${interactive ? 'tag-interactive' : ''} ${className || ''}`}
      data-category-filter={category}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {label}
    </span>
  )
}

export default Tag
