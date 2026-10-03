'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { urlFor } from '@/sanity/client'
import type { Testimonial } from '@/lib/types'
import { FadeUp } from './motion-kit'

const MAX_CARDS = 14

// Outcome / emotion words: quotes that talk about change and connection lead the rows
const KEYWORDS = ['אורגזמה', 'חיבור', 'תשוקה', 'זוגיות', 'שינוי', 'חיים', 'הצלחה', 'תודה', 'ממליצה']

function score(t: Testimonial) {
  const body = t.body
  let s = 0
  for (const k of KEYWORDS) if (body.includes(k)) s += 3
  s += Math.min(body.length, 600) / 100 // longer, fuller stories (capped)
  if (t.image) s += 1.5 // the original-message flip is available
  return s
}

function pickTestimonials(testimonials: Testimonial[]) {
  const seen = new Set<string>()
  return testimonials
    .filter((t) => {
      // Has text, and isn't a duplicate entry of a quote already picked
      const key = t.body?.trim().replace(/\s+/g, ' ')
      if (!key || seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((t, i) => ({ t, s: score(t), i }))
    .sort((a, b) => b.s - a.s || a.i - b.i)
    .slice(0, MAX_CARDS)
    .map(({ t }) => t)
}

export default function Recommendations({ testimonials }: { testimonials: Testimonial[] }) {
  const sectionRef = useRef<HTMLElement>(null)

  // Rows drift slightly against each other with scroll, on top of their own loop
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const progress = useTransform(() => scrollYProgress.get())
  const rowAX = useTransform(progress, [0, 1], ['-4vw', '4vw'])
  const rowBX = useTransform(progress, [0, 1], ['4vw', '-4vw'])

  const reduceMotion = useReducedMotion()

  // Seam out (parallax hand-off): as About rises over it, this section drifts slower and dims
  const { scrollYProgress: exitRaw } = useScroll({ target: sectionRef, offset: ['end end', 'end start'] })
  const exit = useTransform(() => exitRaw.get())
  const exitY = useTransform(exit, [0, 1], ['0vh', '40vh'])
  const exitDim = useTransform(exit, [0, 0.9], [1, 0.35])

  // One card at a time can be flipped to show the original message; any click outside it (or Esc) flips it back
  const [flipped, setFlipped] = useState<string | null>(null)
  useEffect(() => {
    if (!flipped) return
    const onPointer = (e: PointerEvent) => {
      if (!(e.target as Element).closest(`[data-card="${flipped}"]`)) setFlipped(null)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFlipped(null)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [flipped])

  if (!testimonials?.length) return null

  const list = pickTestimonials(testimonials)
  // Alternate between rows so both open with the strongest quotes
  const rowA = list.filter((_, i) => i % 2 === 0)
  const rowB = list.length > 1 ? list.filter((_, i) => i % 2 === 1) : rowA
  const hasFlip = list.some((t) => t.image)

  return (
    <div className="relative">
    <m.section
      ref={sectionRef}
      // Transparent: rendered inside the story section, on its pinned background (one continuous space)
      className="relative pt-20 md:pt-6 pb-28 overflow-x-clip"
      style={reduceMotion ? undefined : { y: exitY, opacity: exitDim }}
    >
      {/* Giant title (like the reference): edge-to-edge rose halftone, fixed in place above the cards.
          Colour fades gently top -> bottom (no hard mask, so the letters stay whole). */}
      <p
        aria-hidden
        className="relative text-center font-sans font-black leading-[0.9] tracking-[-0.02em] select-none pointer-events-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[22vw] md:text-[12vw]"
        style={{
          // Fine halftone over a soft solid fill, both deepening toward the top
          backgroundImage:
            'radial-gradient(circle, rgba(168,90,84,0.45) 0.9px, transparent 1.3px), linear-gradient(to bottom, rgba(168,90,84,0.16), rgba(201,120,112,0.06))',
          backgroundSize: '3.5px 3.5px, 100% 100%',
        }}
      >
        המלצות
      </p>

      <h2 className="sr-only">כמה מילים שכתבתם לי</h2>

      {hasFlip && (
        <FadeUp delay={0.3} y={8} className="relative flex justify-center px-6 mt-4 md:mt-6 mb-6">
          <p className="inline-flex items-center gap-2 text-[13px] md:text-base font-bold text-brand-dark text-center [&_svg]:w-4 [&_svg]:h-4 md:[&_svg]:w-5 md:[&_svg]:h-5 [&_svg]:shrink-0">
            <EyeIcon />
            לחצו על העין לצפייה בהודעה המקורית
          </p>
        </FadeUp>
      )}

      <div className="relative space-y-3">
        <MarqueeRow id="a" items={rowA} x={rowAX} duration={90} flipped={flipped} onFlip={setFlipped} />
        <MarqueeRow id="b" items={rowB} x={rowBX} duration={100} reverse flipped={flipped} onFlip={setFlipped} />
      </div>

      <FadeUp className="text-center mt-14" delay={0.1}>
        <Link
          data-hide-dock
          data-track="testimonials_view_all_click"
          href="/v2/recommendations"
          className="inline-flex items-center gap-3 border-2 border-brand text-brand-dark font-bold px-8 py-3.5 rounded-full hover:bg-brand hover:text-white transition-colors"
        >
          לכל ההמלצות
        </Link>
      </FadeUp>
    </m.section>
    </div>
  )
}

interface RowProps {
  id: string
  items: Testimonial[]
  x: MotionValue<string>
  duration: number
  reverse?: boolean
  flipped: string | null
  onFlip: (key: string | null) => void
}

function MarqueeRow({ id, items, x, duration, reverse, flipped, onFlip }: RowProps) {
  // Hold the row still while one of its cards is flipped
  const paused = flipped?.startsWith(`${id}-`) ?? false

  return (
    <m.div style={{ x }}>
      <div
        data-swipe className="marquee overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
        data-paused={paused || undefined}
        style={{ ['--marquee-duration' as string]: `${duration}s`, ['--marquee-direction' as string]: reverse ? 'reverse' : 'normal' }}
      >
        <div className="marquee-track flex w-max items-center">
          {/* Two identical halves so the loop is seamless; the copy is hidden from assistive tech */}
          {[0, 1].map((copy) =>
            items.map((t, i) => {
              const key = `${id}-${copy}-${i}`
              return (
                <div key={key} className="ps-6" aria-hidden={copy === 1 || undefined}>
                  <TestimonialCard t={t} cardKey={key} isFlipped={flipped === key} onFlip={onFlip} focusable={copy === 0} />
                </div>
              )
            })
          )}
        </div>
      </div>
    </m.div>
  )
}

interface CardProps {
  t: Testimonial
  cardKey: string
  isFlipped: boolean
  onFlip: (key: string | null) => void
  focusable: boolean
}

function TestimonialCard({ t, cardKey, isFlipped, onFlip, focusable }: CardProps) {
  const reduce = useReducedMotion()
  const imgUrl = t.image ? urlFor(t.image as object).width(720).url() : null

  return (
    <div data-card={cardKey} className="h-full [perspective:1200px] transition-transform duration-300 hover:-translate-y-1">
      <m.div
        className="relative h-full [transform-style:preserve-3d]"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.6 }}
      >
        {/* Front: the quote */}
        <article className="relative w-[300px] md:w-[340px] min-h-[240px] bg-white/90 rounded-[28px] p-6 shadow-[0_10px_40px_-12px_rgba(168,90,84,0.25)] ring-1 ring-brand/10 text-right flex flex-col [backface-visibility:hidden]">
          <div className="flex items-start justify-between">
            <span aria-hidden className="font-garamond text-6xl leading-[0.6] text-brand/40 h-6">”</span>
            {imgUrl && (
              <button
                type="button"
                onClick={() => onFlip(cardKey)}
                data-track="testimonial_flip"
                data-track-name={t.name}
                tabIndex={focusable ? undefined : -1}
                aria-label={`הצגת ההודעה המקורית של ${t.name}`}
                aria-pressed={isFlipped}
                className="-mt-1 -ml-1 w-10 h-10 rounded-full flex items-center justify-center text-brand-dark/85 hover:text-brand-dark hover:bg-brand/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 transition-colors"
              >
                <EyeIcon />
              </button>
            )}
          </div>

          <p className="mt-4 text-[#3d2814] text-[15px] leading-relaxed line-clamp-5 flex-1">{t.body}</p>

          <div className="mt-5 pt-4 border-t border-brand/10 flex items-center gap-3">
            <div aria-hidden className="w-11 h-11 rounded-full bg-brand/15 text-brand-dark font-garamond font-extrabold text-xl flex items-center justify-center shrink-0">
              {t.name?.trim().charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-[#2d1a0e] truncate">{t.name}</p>
              {t.courseTitle && <p className="text-sm text-[#6f5546] truncate">{t.courseTitle}</p>}
            </div>
          </div>
        </article>

        {/* Back: the original message screenshot */}
        {imgUrl && (
          <div
            className="absolute inset-0 rounded-[28px] bg-white p-3 shadow-[0_10px_40px_-12px_rgba(168,90,84,0.25)] ring-1 ring-brand/10 [backface-visibility:hidden] [transform:rotateY(180deg)]"
            aria-hidden={!isFlipped}
          >
            <div className="relative w-full h-full rounded-[20px] overflow-hidden bg-cream/40">
              <Image src={imgUrl} alt={`ההודעה המקורית של ${t.name}`} fill sizes="340px" className="object-contain" />
            </div>
            <button
              type="button"
              onClick={() => onFlip(null)}
              tabIndex={isFlipped && focusable ? undefined : -1}
              aria-label="חזרה לציטוט"
              className="absolute top-5 left-5 w-10 h-10 rounded-full bg-white/90 shadow flex items-center justify-center text-brand-dark hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </m.div>
    </div>
  )
}

function EyeIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
