'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { FadeUp, SectionTitle } from './motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { LEARN } from './coaching-content'

const TINTS = ['#fffaf0', '#fff4e4', '#ffeedd', '#fde7d6', '#fbe0cf', '#f8d9c8']

// What we'll learn: six cards that stack as you scroll. Each one pins a little lower than the last,
// and the cards underneath ease back (scale only) as the next one lands on them.
export default function CoachingLearn() {
  const listRef = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 30%', 'end end'] })

  return (
    <section className="relative px-5 md:px-8 pt-24 md:pt-36 pb-16 md:pb-24">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_70%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-12 lg:gap-20">
        <div className="text-right lg:sticky lg:top-28 lg:self-start">
          <SectionTitle kicker="מה מקבלים מהתהליך" title="מה נלמד יחד?" accent="יחד?" align="start" />
          <FadeUp delay={0.15} y={14}>
            <p className="mt-6 text-lg md:text-xl text-[#3d2814]/80 leading-relaxed max-w-md text-pretty">
              שינוי שמתחיל במיניות ובאינטימיות, ומתרחב אל כל החיים.
            </p>
          </FadeUp>
        </div>

        <ol ref={listRef} className="relative">
          {LEARN.map((text, i) => (
            <LearnCard key={i} index={i} total={LEARN.length} text={text} progress={scrollYProgress} />
          ))}
        </ol>
      </div>
    </section>
  )
}

function LearnCard({ index, total, text, progress }: { index: number; total: number; text: string; progress: MotionValue<number> }) {
  const reduce = useHydratedReducedMotion()
  const last = index === total - 1
  // Eases back once the following cards start landing on it
  const scale = useTransform(() => {
    if (reduce || last) return 1
    const start = (index + 1) / total
    const t = Math.min(1, Math.max(0, (progress.get() - start) / (1 - start)))
    return 1 - t * (total - index) * 0.012
  })

  return (
    <li
      className={`sticky ${last ? '' : 'pb-[20svh] lg:pb-[26svh]'}`}
      style={{ top: `calc(18svh + ${index * 14}px)` }}
    >
      <m.div
        className="relative rounded-[32px] ring-1 ring-brand/15 p-7 md:p-10 text-right shadow-[0_24px_60px_-30px_rgba(61,40,20,0.45)] origin-top"
        style={{ background: TINTS[index % TINTS.length], scale }}
        initial={reduce ? false : { opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '0px 0px -8% 0px' }}
        transition={{ type: 'spring', bounce: 0, visualDuration: 0.8 }}
      >
        <div className="flex items-start gap-5 md:gap-7">
          <span aria-hidden className="shrink-0 font-garamond font-bold text-brand text-5xl md:text-6xl leading-[0.85] tabular-nums">
            {index + 1}
          </span>
          <p className="text-lg md:text-2xl leading-relaxed text-[#2d1a0e] font-medium text-pretty">{text}</p>
        </div>
      </m.div>
    </li>
  )
}
