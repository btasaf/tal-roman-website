'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion'
import type { Testimonial } from '@/lib/types'
import { GrainOverlay } from '../backgrounds'
import { SectionTitle } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { halftone } from './about-content'

// A few words from people she has worked with: a pinned deck. Each scroll step brings the next card up over the
// last, which settles back a little (scale + lift), so the stack keeps its history. A blush wash builds in as the
// section pins and clears again before it leaves, so it meets the cream on both sides with no edge.
const STEP_VH = 70
const BLUSH = '#f7dccb'

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smooth = (v: number) => v * v * (3 - 2 * v)

export default function AboutVoices({ voices }: { voices: Testimonial[] }) {
  const reduce = useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const n = voices.length
  const heightVh = Math.max(1, n - 1) * STEP_VH + 160

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  // Deck position: 0 = first card alone ... n-1 = last card on top. Holds a little at both ends.
  const range = heightVh - 100
  const deck = useTransform(() => {
    const vh = scrollYProgress.get() * range
    return clamp01((vh - 20) / ((n - 1) * STEP_VH)) * (n - 1)
  })
  // Blush wash: only while pinned (in just after it pins, out just before it unpins), so the sticky edges never show
  const { scrollYProgress: around } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const wash = useTransform(() => {
    const total = heightVh + 100 // vh from 'start end' to 'end start'
    const vh = around.get() * total
    const inP = smooth(clamp01((vh - 100) / 60))
    const outP = smooth(clamp01((total - vh - 100) / 60))
    return Math.min(inP, outP)
  })

  if (!n) return null

  return (
    <section ref={sectionRef} aria-labelledby="voices-title" className="relative bg-cream" style={{ height: `${heightVh}svh` }}>
      <div className="sticky top-0 h-svh overflow-hidden">
        <m.div aria-hidden className="absolute inset-0" style={{ background: `linear-gradient(to bottom, ${BLUSH}, #fbe6cf)`, opacity: wash }} />
        <GrainOverlay />
        {/* Giant halftone quotation mark */}
        <p
          aria-hidden
          className="absolute -left-[6vw] -top-[0.12em] font-garamond font-bold leading-none select-none pointer-events-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[80vw] md:text-[52vw] lg:text-[34vw]"
          style={halftone('rgba(168,90,84,0.38)', 'rgba(168,90,84,0.12)', 'rgba(201,120,112,0.03)')}
        >
          ”
        </p>

        <div className="relative h-full flex flex-col items-center justify-center px-6 pt-[84px] pb-10 md:py-16">
          <div id="voices-title">
            <SectionTitle kicker="המלצות" title="כמה מילים שכתבתם לי" accent="שכתבתם לי" className="[&_h2]:text-[2.1rem] md:[&_h2]:text-5xl lg:[&_h2]:text-6xl" />
          </div>

          <div className="relative mt-10 md:mt-14 w-full max-w-[560px] h-[370px] md:h-[330px]">
            {voices.map((t, i) => (
              <Card key={i} t={t} index={i} deck={deck} reduce={reduce} />
            ))}
          </div>

          <div className="mt-10 md:mt-14 flex flex-col items-center gap-5">
            <Dots count={n} deck={deck} />
            <Link
              data-hide-dock
              href="/v2/recommendations"
              className="inline-flex items-center gap-3 border-2 border-brand text-brand-dark font-bold px-7 py-3 rounded-full hover:bg-brand hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
            >
              לכל ההמלצות
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

function Card({ t, index, deck, reduce }: { t: Testimonial; index: number; deck: MotionValue<number>; reduce: boolean }) {
  // arrive: 0 -> 1 as this card comes up (the first card is already there); depth: how many cards sit on top
  const arrive = useTransform(() => (index === 0 ? 1 : clamp01(deck.get() - (index - 1))))
  const depth = useTransform(() => Math.min(3, Math.max(0, deck.get() - index)))
  const y = useTransform(() => {
    if (reduce) return '0px'
    const a = smooth(arrive.get())
    const lift = -12 * depth.get()
    return `calc(${(1 - a) * 115}svh + ${lift}px)`
  })
  const scale = useTransform(() => (reduce ? 1 : 1 - 0.05 * depth.get()))
  // Reduced motion: cards cross-fade in place instead of travelling
  const opacity = useTransform(() => (reduce ? clamp01(1 - Math.abs(deck.get() - index) * 2) : 1))
  const shade = useTransform(() => 0.1 * Math.min(1, depth.get()))

  return (
    <m.figure
      className="absolute inset-x-0 top-0 h-full origin-top"
      style={{ y, scale, opacity, zIndex: index }}
    >
      <div className="relative h-full bg-white rounded-[32px] p-7 md:p-9 shadow-[0_24px_60px_-24px_rgba(168,90,84,0.35)] ring-1 ring-brand/10 text-right flex flex-col overflow-hidden">
        <span aria-hidden className="font-garamond text-7xl leading-[0.5] text-brand/45 h-8">”</span>
        <div className="flex-1 flex items-center min-h-0">
          <blockquote className="text-[#3d2814] text-lg md:text-[1.35rem] font-medium leading-relaxed line-clamp-7 md:line-clamp-4">{t.body}</blockquote>
        </div>
        <figcaption className="mt-5 pt-4 border-t border-brand/10 flex items-center gap-3">
          <span aria-hidden className="w-11 h-11 rounded-full bg-brand/15 text-brand-dark font-garamond font-extrabold text-xl flex items-center justify-center shrink-0">
            {t.name?.trim().charAt(0)}
          </span>
          <span className="min-w-0">
            <span className="block font-bold text-[#2d1a0e] truncate">{t.name}</span>
            {t.courseTitle && <span className="block text-sm text-[#6f5546] truncate">{t.courseTitle}</span>}
          </span>
        </figcaption>
        {/* Settles into the shade as newer cards cover it */}
        <m.div aria-hidden className="absolute inset-0 bg-[#c97870] pointer-events-none" style={{ opacity: shade }} />
      </div>
    </m.figure>
  )
}

function Dots({ count, deck }: { count: number; deck: MotionValue<number> }) {
  return (
    <div aria-hidden className="flex items-center gap-2">
      {Array.from({ length: count }, (_, i) => (
        <Dot key={i} index={i} deck={deck} />
      ))}
    </div>
  )
}

function Dot({ index, deck }: { index: number; deck: MotionValue<number> }) {
  // Active dot widens (scaleX, transform only) and brightens
  const near = useTransform(() => 1 - Math.min(1, Math.abs(deck.get() - index)))
  const scaleX = useTransform(() => 1 + 2.5 * near.get())
  const opacity = useTransform(() => 0.3 + 0.7 * near.get())
  return (
    <span className="w-7 flex justify-center">
      <m.span className="block w-2 h-2 rounded-full bg-brand" style={{ scaleX, opacity }} />
    </span>
  )
}
