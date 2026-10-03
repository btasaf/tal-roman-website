'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'

// The promise (the page's body lines from Sanity) on a warm-gray sheet. The sheet widens into place as it
// arrives (scaleX + soft rounded shoulders, transform only), then the lines light up one by one as you read
// down, scroll-linked (opacity + a small lift). The last line lands in gold.
export default function PresalePromise({ lines }: { lines: string[] }) {
  const reduce = useHydratedReducedMotion()
  const sheetRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress: arrive } = useScroll({ target: sheetRef, offset: ['start end', 'start 30%'] })
  const sheetScale = useTransform(() => (reduce ? 1 : 0.94 + 0.06 * arrive.get()))

  const { scrollYProgress: read } = useScroll({ target: textRef, offset: ['start 85%', 'end 55%'] })

  if (!lines.length) return null

  return (
    <section className="relative bg-cream px-2 md:px-4">
      <GrainOverlay />
      <m.div
        ref={sheetRef}
        className="relative overflow-hidden rounded-[36px] md:rounded-[56px] text-cream"
        style={{ background: 'linear-gradient(170deg, #5e5955 0%, #48443f 100%)', scaleX: sheetScale }}
      >
        <div aria-hidden className="absolute inset-0 opacity-80">
          <AuroraBackground palette="gray" />
        </div>
        <GrainOverlay opacity={0.18} blend="soft-light" />

        <div ref={textRef} className="relative max-w-6xl mx-auto px-6 md:px-12 py-24 md:py-36 text-center">
          <span aria-hidden className="block mx-auto mb-10 md:mb-14 w-12 h-[3px] rounded-full bg-gold/80" />
          <p className="font-sans font-black tracking-[-0.01em] text-[1.75rem] leading-[1.3] sm:text-4xl md:text-[2.3rem] lg:text-[2.6rem] xl:text-[2.8rem] md:leading-[1.35] text-pretty">
            {lines.map((line, i) => (
              <Line key={i} text={line} index={i} count={lines.length} progress={read} reduce={reduce} last={i === lines.length - 1} />
            ))}
          </p>
        </div>
      </m.div>
    </section>
  )
}

function Line({ text, index, count, progress, reduce, last }: { text: string; index: number; count: number; progress: MotionValue<number>; reduce: boolean; last: boolean }) {
  // Each line owns an equal, slightly overlapping slice of the reading progress
  const opacity = useTransform(() => {
    if (reduce) return 1
    const t = (progress.get() * count - index) / 1.2 + 0.15
    return 0.22 + 0.78 * Math.min(1, Math.max(0, t))
  })
  const y = useTransform(() => {
    if (reduce) return 0
    const t = Math.min(1, Math.max(0, (progress.get() * count - index) / 1.2 + 0.15))
    return (1 - t) * 10
  })
  return (
    <m.span className={`block ${last ? 'mt-3 md:mt-5 text-gold font-garamond font-bold' : ''}`} style={{ opacity, y }}>
      {text}
    </m.span>
  )
}
