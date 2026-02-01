import * as Dialog from '@radix-ui/react-dialog'
import { slugify } from 'astro-toolkit/utils'
import { Sparkles, Star, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import type { Book } from '@/data/books'

interface BookChangeEvent extends CustomEvent {
  detail: {
    slug: null | string
  }
}

interface BookModalProps {
  allBooks: Book[]
}

export default function BookModal({ allBooks }: BookModalProps) {
  const [renderBook, setRenderBook] = useState<Book | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleUrlChange = (e?: BookChangeEvent | PopStateEvent) => {
      // If event provides slug, use it directly (faster than URL parsing)
      let bookSlug: null | string | undefined

      if (e && 'detail' in e) {
        bookSlug = e.detail.slug
      }

      if (!bookSlug) {
        const params = new URLSearchParams(window.location.search)
        bookSlug = params.get('book')
      }

      if (bookSlug) {
        const book = allBooks.find((b) => slugify(b.title) === bookSlug)
        if (book) {
          setRenderBook(book)
          setIsOpen(true)
        } else {
          setIsOpen(false)
        }
      } else {
        setIsOpen(false)
      }
    }

    handleUrlChange()
    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('book-change', handleUrlChange as EventListener)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('book-change', handleUrlChange as EventListener)
    }
  }, [allBooks])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (!open) {
      // Small delay to allow exit animation to begin before removing content
      // Radix handles the timing internally but we want to sync the URL
      const url = new URL(window.location.href)
      url.searchParams.delete('book')
      window.history.pushState({}, '', url.toString())
      window.dispatchEvent(new CustomEvent('book-change', { detail: { slug: null } }))

      // Clear book data after animation
      setTimeout(() => setRenderBook(null), 300)
    }
  }

  // Prevent hydration mismatch
  if (typeof window === 'undefined') return null

  return (
    <Dialog.Root onOpenChange={handleOpenChange} open={isOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-9999 bg-neutral-900/40 backdrop-blur-sm" />
        <Dialog.Content className="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] fixed top-[50%] left-[50%] z-9999 max-h-[85vh] w-full max-w-5xl translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-3xl bg-white shadow-2xl duration-200 outline-none sm:min-h-[450px] dark:bg-neutral-900">
          {renderBook && (
            <>
              <button
                aria-label="Close"
                className="absolute top-6 right-6 z-110 rounded-full bg-white/80 p-2 shadow-sm backdrop-blur-md transition-colors hover:bg-neutral-100 dark:bg-neutral-800/80 dark:hover:bg-neutral-800"
                onClick={() => handleOpenChange(false)}
              >
                <X className="text-neutral-400 dark:text-neutral-300" size={20} />
              </button>

              <div className="flex h-full w-full flex-col overflow-y-auto sm:flex-row sm:overflow-y-hidden">
                <div className="flex w-full shrink-0 flex-col items-center gap-6 border-r border-neutral-100 bg-neutral-50 p-8 text-center sm:w-1/3 sm:items-start sm:text-left dark:border-neutral-700 dark:bg-neutral-800">
                  <div className="h-60 w-40 shrink-0 overflow-hidden rounded-xl shadow-2xl">
                    <img
                      alt={renderBook.title}
                      className="h-full w-full object-cover"
                      src={renderBook.coverUrl}
                    />
                  </div>
                  <div className="w-full space-y-2">
                    <Dialog.Title className="text-xl leading-tight font-bold">
                      {renderBook.title}
                    </Dialog.Title>
                    <p className="text-neutral-500">{renderBook.author}</p>
                    {renderBook.rating && renderBook.rating > 0 ? (
                      <div className="flex justify-center gap-1 pt-2 sm:justify-start">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            className={
                              i < renderBook.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-neutral-200'
                            }
                            key={i}
                            size={14}
                          />
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <button
                    aria-label="Generate key takeaways with Gemini (Coming soon)"
                    className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:bg-neutral-800 disabled:opacity-50"
                    disabled
                  >
                    <Sparkles size={14} />
                    Gemini Key Takeaway
                  </button>
                </div>

                <div className="w-full space-y-8 p-8 sm:w-2/3 sm:overflow-y-auto sm:p-10">
                  <section className="space-y-4">
                    <h3 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                      Summary
                    </h3>
                    <p className="border-l-2 border-neutral-100 pl-4 leading-relaxed text-neutral-600 italic">
                      {renderBook.summary}
                    </p>
                  </section>

                  {renderBook.notes && renderBook.notes.length > 0 && (
                    <section className="space-y-4">
                      <h3 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                        My Notes
                      </h3>
                      <ul className="space-y-3">
                        {renderBook.notes.map((note, i) => (
                          <li className="flex gap-3 text-sm text-neutral-600" key={i}>
                            <span className="text-neutral-300">•</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {renderBook.highlights && renderBook.highlights.length > 0 && (
                    <section className="space-y-4">
                      <h3 className="text-xs font-semibold tracking-widest text-neutral-400 uppercase">
                        Highlights
                      </h3>
                      <div className="space-y-6">
                        {renderBook.highlights.map((h, i) => (
                          <blockquote
                            className="rounded-xl border-l-4 border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed font-medium text-neutral-600"
                            key={i}
                          >
                            &ldquo;{h}&rdquo;
                          </blockquote>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              </div>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
