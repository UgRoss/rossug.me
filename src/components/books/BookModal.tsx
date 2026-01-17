import React, { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Sparkles, X, Star } from 'lucide-react'
import type { Book } from '@/data/books'
import { slugify } from '@/data/books'

interface BookModalProps {
  allBooks: Book[]
}

export default function BookModal({ allBooks }: BookModalProps) {
  const [renderBook, setRenderBook] = useState<Book | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
  }, [])

  // -- Effects --
  useEffect(() => {
    const handleUrlChange = (e?: any) => {
      // If event provides slug, use it directly (faster than URL parsing)
      let bookSlug = e?.detail?.slug

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
    window.addEventListener('book-change', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('book-change', handleUrlChange)
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
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[9999] bg-neutral-900/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          className="fixed left-[50%] top-[50%] z-[9999] w-full max-w-3xl sm:min-h-[450px] max-h-[85vh] translate-x-[-50%] translate-y-[-50%] rounded-3xl bg-white shadow-2xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-100 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] overflow-hidden outline-none"
          aria-describedby={undefined}
        >
          {renderBook && (
            <>
              <button
                onClick={() => handleOpenChange(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors z-[110] bg-white/80 backdrop-blur-md shadow-sm"
                aria-label="Close"
              >
                <X size={20} className="text-neutral-400" />
              </button>

              <div className="flex flex-col sm:flex-row overflow-y-auto sm:overflow-y-hidden w-full h-full">
                <div className="w-full sm:w-1/3 p-8 bg-neutral-50 flex flex-col items-center sm:items-start text-center sm:text-left gap-6 border-r border-neutral-100 shrink-0">
                  <div className="w-40 h-60 rounded-xl overflow-hidden shadow-2xl shrink-0">
                    <img
                      src={renderBook.coverUrl}
                      alt={renderBook.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-2 w-full">
                    <Dialog.Title className="text-xl font-bold leading-tight">
                      {renderBook.title}
                    </Dialog.Title>
                    <p className="text-neutral-500">{renderBook.author}</p>
                    <div className="flex justify-center sm:justify-start gap-1 pt-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < renderBook.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-neutral-200'
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    disabled
                    className="w-full mt-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all disabled:opacity-50"
                    aria-label="Generate key takeaways with Gemini (Coming soon)"
                  >
                    <Sparkles size={14} />
                    Gemini Key Takeaway
                  </button>
                </div>

                <div className="w-full sm:w-2/3 p-8 sm:p-10 space-y-8 sm:overflow-y-auto">
                  <section className="space-y-4">
                    <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                      Summary
                    </h3>
                    <p className="text-neutral-600 leading-relaxed italic border-l-2 border-neutral-100 pl-4">
                      {renderBook.summary}
                    </p>
                  </section>

                  {renderBook.notes && renderBook.notes.length > 0 && (
                    <section className="space-y-4">
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                        My Notes
                      </h3>
                      <ul className="space-y-3">
                        {renderBook.notes.map((note, i) => (
                          <li key={i} className="text-sm text-neutral-600 flex gap-3">
                            <span className="text-neutral-300">•</span>
                            {note}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )}

                  {renderBook.highlights && renderBook.highlights.length > 0 && (
                    <section className="space-y-4">
                      <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
                        Highlights
                      </h3>
                      <div className="space-y-6">
                        {renderBook.highlights.map((h, i) => (
                          <blockquote
                            key={i}
                            className="text-sm text-neutral-600 font-medium leading-relaxed bg-neutral-50 p-4 rounded-xl border-l-4 border-neutral-200"
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
