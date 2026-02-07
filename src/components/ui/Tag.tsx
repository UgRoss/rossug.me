import React from 'react'

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  category?: string
  interactive?: boolean
  label: string
}

export const Tag = ({ category, className, interactive = true, label, ...props }: TagProps) => {
  const baseStyles =
    'relative z-10 inline-block rounded-md bg-neutral-100 px-2.5 py-1 text-[10px] font-bold tracking-widest text-neutral-600 uppercase transition-colors dark:bg-neutral-800 dark:text-neutral-400'
  const interactiveStyles = interactive
    ? 'cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-700'
    : ''

  return (
    <span
      className={`${baseStyles} ${interactiveStyles} ${className || ''}`}
      data-category-filter={category}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      {...props}
    >
      {label}
    </span>
  )
}

export default Tag
