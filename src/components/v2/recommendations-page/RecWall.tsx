'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { AnimatePresence, m } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon, FadeUp, SectionTitle } from './motion'
import RecCard, { EyeIcon } from './RecCard'
import type { RecFilter, RecItem } from './rec-data'

// The wall of voices: course filter chips (the active pill glides between them), then a masonry of cards.
// Switching filter crossfades the wall; the count is announced politely for screen readers.
interface Props {
  items: RecItem[]
  filters: RecFilter[]
  active: string
  onFilter: (key: string) => void
  onOpen: (id: string) => void
}

export default function RecWall({ items, filters, active, onFilter, onOpen }: Props) {
  const reduce = useHydratedReducedMotion()
  const topRef = useRef<HTMLDivElement>(null)
  const current = filters.find((f) => f.key === active) ?? filters[0]

  const choose = (key: string) => {
    if (key === active) return
    onFilter(key)
    // Keep the start of the (shorter) wall in view
    const top = topRef.current?.getBoundingClientRect().top ?? 0
    if (top < 0) topRef.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <section id="wall" aria-labelledby="wall-title" className="relative bg-cream scroll-mt-4">
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 md:pt-32 pb-24 md:pb-32">
        <SectionTitle id="wall-title" kicker={`${filters[0]?.count ?? items.length} הודעות`} title="כל ההמלצות" accent="ההמלצות" />
        <FadeUp delay={0.15} y={10} className="mt-5 flex justify-center">
          <p className="inline-flex items-center gap-2 text-[15px] md:text-base font-bold text-brand-dark text-center">
            <EyeIcon className="w-5 h-5 shrink-0" />
            לחצו על ההודעה הקטנה כדי לראות את המקור
          </p>
        </FadeUp>

        {/* Filter chips: sticky on larger screens (centered, clear of the menu button at the top right) */}
        <div ref={topRef} className="scroll-mt-6 md:sticky md:top-5 z-20 mt-10 md:mt-12 flex justify-center">
          <div
            role="group"
            aria-label="סינון לפי סדנה או קורס"
            className="max-w-full md:max-w-[calc(100%-9rem)] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden rounded-full bg-white/80 backdrop-blur-md p-1.5 shadow-[0_10px_30px_-14px_rgba(61,40,20,0.35)] ring-1 ring-[#2d1a0e]/[0.06]"
          >
            <div className="flex w-max items-center gap-1">
              {filters.map((f) => {
                const on = f.key === active
                return (
                  <button
                    key={f.key || 'all'}
                    type="button"
                    onClick={() => choose(f.key)}
                    data-track="rec_filter_click"
                    data-track-filter={f.key || 'all'}
                    aria-pressed={on}
                    className={`relative whitespace-nowrap rounded-full px-4 py-2.5 text-[15px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/60 ${on ? 'text-cream' : 'text-[#5e5955] hover:text-[#2d1a0e]'}`}
                  >
                    {on && (
                      <m.span
                        layoutId="rec-chip"
                        aria-hidden
                        className="absolute inset-0 rounded-full bg-[#2d1a0e]"
                        transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.45 }}
                      />
                    )}
                    <span className="relative">
                      {f.label}
                      <span className={`ms-1.5 text-[13px] font-medium ${on ? 'text-gold' : 'text-[#8a7d72]'}`}>{f.count}</span>
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <p aria-live="polite" className="sr-only">
          {current.key ? `מוצגות ${current.count} המלצות על ${current.label}` : `מוצגות כל ${current.count} ההמלצות`}
        </p>

        {/* A path onward from the chosen course */}
        <div className="min-h-[3.25rem] mt-5 flex justify-center">
          <AnimatePresence mode="wait" initial={false}>
            {current.href && (
              <m.div
                key={current.key}
                initial={reduce ? false : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -6, transition: { duration: 0.15 } }}
                transition={{ type: 'spring', bounce: 0, visualDuration: 0.35 }}
              >
                <Link href={current.href} data-track="rec_course_link_click" data-track-filter={current.key} className="group inline-flex items-center gap-2 py-3 text-brand-dark font-bold underline decoration-brand/30 underline-offset-[6px] hover:decoration-brand transition-colors">
                  {current.linkLabel}
                  <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </Link>
              </m.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <m.div
            key={active || 'all'}
            className="mt-2 columns-1 sm:columns-2 lg:columns-3 gap-5"
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 10, transition: { duration: 0.18 } }}
            transition={{ type: 'spring', bounce: 0, visualDuration: 0.5 }}
          >
            {items.map((it, i) => (
              <RecCard key={it.id} item={it} index={i} onOpen={onOpen} />
            ))}
          </m.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
