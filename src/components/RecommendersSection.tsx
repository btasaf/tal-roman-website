'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import { m } from 'framer-motion'
import Link from 'next/link'
import { fadeInUp } from '@/lib/animations'
import SectionBackground from '@/components/ui/SectionBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import RecommenderCard from '@/components/RecommenderCard'
import type { Testimonial } from '@/lib/types'

const SCROLL_BY = 340

export default function RecommendersSection({ testimonials, bgImage, dark }: { testimonials: Testimonial[]; bgImage?: object | null; dark?: boolean }) {
  const bg = dark ? 'bg-night' : 'bg-cream'
  const fadeColor = dark ? 'from-night' : 'from-cream'
  const titleColor = dark ? 'text-gold' : 'text-ink'
  const scrollRef = useRef<HTMLDivElement>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)

  const updateButtons = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    // RTL scroll: scrollLeft is 0 at the right edge (start), goes negative toward left
    setAtStart(el.scrollLeft >= -2)
    setAtEnd(el.scrollLeft <= -(el.scrollWidth - el.clientWidth) + 2)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    updateButtons()
    el.addEventListener('scroll', updateButtons, { passive: true })
    return () => el.removeEventListener('scroll', updateButtons)
  }, [updateButtons, testimonials])

  if (!testimonials?.length) return null

  return (
    <section className={`py-24 ${bg} relative overflow-hidden`}>
      <SectionBackground image={bgImage} />
      <div className="relative max-w-[100vw] mx-auto">

        <m.div className="text-center mb-14 px-6" {...fadeInUp}>
          <h2 className={`text-3xl md:text-4xl font-extrabold ${titleColor} mb-3`}>המלצות</h2>
          <SectionDivider />
        </m.div>

        <div className="relative px-10">
          {/* Right arrow — scroll toward RTL start (first cards) */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: SCROLL_BY, behavior: 'smooth' })}
            aria-label="הקודם"
            className={`absolute right-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gold/40 shadow-md flex items-center justify-center hover:bg-gold/10 transition-all duration-200 ${atStart ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>

          {/* Left arrow — scroll toward more cards */}
          <button
            onClick={() => scrollRef.current?.scrollBy({ left: -SCROLL_BY, behavior: 'smooth' })}
            aria-label="הבא"
            className={`absolute left-1 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white border border-gold/40 shadow-md flex items-center justify-center hover:bg-gold/10 transition-all duration-200 ${atEnd ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          {/* Fade edges */}
          <div className={`absolute right-10 top-0 bottom-4 w-16 bg-gradient-to-l ${fadeColor} to-transparent z-10 pointer-events-none`} />
          <div className={`absolute left-10 top-0 bottom-4 w-16 bg-gradient-to-r ${fadeColor} to-transparent z-10 pointer-events-none`} />

          <div
            ref={scrollRef}
            className="flex flex-row gap-6 overflow-x-auto no-scrollbar pb-4"
          >
            {testimonials.map((t, i) => (
              <div key={i} className="flex-none w-72 md:w-80">
                <RecommenderCard t={t} index={i} />
              </div>
            ))}
          </div>
        </div>

        <m.div
          className="text-center mt-10 px-6"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Link
            href="/recommendations"
            className="inline-block border-2 border-brand text-brand font-semibold px-8 py-4 rounded-full hover:bg-brand hover:text-white transition-colors"
          >
            לכל ההמלצות
          </Link>
        </m.div>
      </div>
    </section>
  )
}
