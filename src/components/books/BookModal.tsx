import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Sparkles, X, Star } from 'lucide-react'
import type { Book } from '@/data/books'
import { slugify } from '@/data/books'

interface BookModalProps {
  allBooks: Book[]
}

export default function BookModal({ allBooks }: BookModalProps) {
  const [renderBook, setRenderBook] = useState<Book | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    setMounted(true)
  }, [])

  // -- Effects --
  useEffect(() => {
    const closeModal = () => {
      setIsVisible(false)
      document.body.style.overflow = ''
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        setRenderBook(null)
      }, 300) // Duration matches CSS
    }

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
          if (timeoutRef.current) clearTimeout(timeoutRef.current)
          setRenderBook(book)
          // Small delay to ensure render happens before class change for transition
          setTimeout(() => setIsVisible(true), 10)
          document.body.style.overflow = 'hidden' // Block scroll
        } else {
          // Book not found? Close.
          closeModal()
        }
      } else {
        closeModal()
      }
    }

    handleUrlChange()
    window.addEventListener('popstate', handleUrlChange)
    window.addEventListener('book-change', handleUrlChange)

    return () => {
      window.removeEventListener('popstate', handleUrlChange)
      window.removeEventListener('book-change', handleUrlChange)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [allBooks])

  const closeBook = () => {
    // Just update URL. The effect will handle the animation.
    const url = new URL(window.location.href)
    url.searchParams.delete('book')
    window.history.pushState({}, '', url.toString())
    // Manually trigger handler since pushState doesn't fire popstate
    window.dispatchEvent(new CustomEvent('book-change', { detail: { slug: null } }))
  }

  if (!mounted) return null

  return createPortal(
    <>
      {renderBook && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-6 sm:p-12"
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <div
            onClick={closeBook}
            className={`absolute inset-0 bg-neutral-900/40 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Modal Content */}
          <div
            className={`relative w-full max-w-3xl max-h-[85vh] bg-white rounded-3xl shadow-2xl flex flex-col pointer-events-auto overflow-hidden
                transition-all duration-300 ease-out transform
                ${isVisible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-4'}
            `}
          >
            <button
              onClick={closeBook}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-neutral-100 transition-colors z-[110] bg-white/80 backdrop-blur-md shadow-sm"
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
                  <h2 className="text-xl font-bold leading-tight">{renderBook.title}</h2>
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
          </div>
        </div>
      )}
    </>,
    document.body
  )
}
