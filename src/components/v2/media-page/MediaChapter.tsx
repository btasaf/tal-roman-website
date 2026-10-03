'use client'

import { useEffect, useRef } from 'react'
import { m, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { FadeUp, SectionTitle, halftone } from '../recommendations-page/motion'
import Clipping, { Paper } from './Clipping'
import type { MediaItem, MediaKind } from './media-data'

// One chapter of the press room (on screen / in print / on air): a big numeral and title, a giant halftone word
// sliding sideways with the scroll, then the clippings laid out in a loose grid, each at its own small angle.
export type ChapterTone = 'gray' | 'paper' | 'brown'

const BG: Record<ChapterTone, string> = {
  gray: 'bg-gradient-to-b from-[#48443f] to-[#3f3b37]',
  paper: 'bg-[#efe5d3]',
  brown: 'bg-gradient-to-b from-[#2d1a0e] to-[#3d2814]',
}

const ROTATIONS = [-1.6, 1.2, -0.8, 1.8, -1.2, 0.9]

interface Props {
  kind: MediaKind
  number: string
  title: string
  accent?: string
  word: string // the giant background word
  items: MediaItem[]
  tone: ChapterTone
}

export default function MediaChapter({ kind, number, title, accent, word, items, tone }: Props) {
  const reduce = useHydratedReducedMotion()
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])
  const dark = tone !== 'paper'

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const wordX = useTransform(() => (reduceMv.get() ? '0%' : `${(scrollYProgress.get() - 0.5) * 24}%`))

  if (!items.length) return null

  return (
    <section id={kind} ref={ref} aria-labelledby={`${kind}-title`} className={`relative overflow-hidden scroll-mt-4 ${BG[tone]}`}>
      {tone === 'paper' ? <Paper edge={false} /> : <GrainOverlay opacity={0.16} blend="soft-light" />}

      <m.p
        aria-hidden
        className="absolute top-10 md:top-6 inset-x-0 text-center font-sans font-black leading-none tracking-[-0.02em] whitespace-nowrap select-none pointer-events-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[34vw] md:text-[22vw]"
        style={{ ...(dark ? halftone(0.32, '230,192,96') : halftone(0.4)), x: wordX }}
      >
        {word}
      </m.p>

      <div className="relative max-w-6xl mx-auto px-5 sm:px-6 pt-24 md:pt-36 pb-24 md:pb-32">
        <FadeUp y={12} className="flex justify-center">
          <span className={`font-garamond font-bold text-xl tracking-[0.2em] ${dark ? 'text-gold' : 'text-[#a85a54]'}`}>{number}</span>
        </FadeUp>
        <div className="mt-3">
          <SectionTitle id={`${kind}-title`} title={title} accent={accent} tone={dark ? 'dark' : 'light'} />
        </div>
        <FadeUp delay={0.12} y={10} className="mt-4 flex justify-center">
          <p className={`text-base md:text-lg font-medium ${dark ? 'text-cream/80' : 'text-[#5e5955]'}`}>
            {kind === 'podcast' ? 'אפשר להאזין כאן, או בפלטפורמה המקורית' : 'כל כרטיס נפתח באתר המקורי'}
          </p>
        </FadeUp>

        <div className="mt-14 md:mt-20 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-7 lg:gap-x-9 gap-y-10 lg:gap-y-14 items-start">
          {items.map((it, i) => (
            <div key={it.id} className={i % 3 === 1 ? 'lg:mt-10' : ''}>
              <Clipping item={it} rotate={ROTATIONS[i % ROTATIONS.length]} delay={(i % 3) * 0.08} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
