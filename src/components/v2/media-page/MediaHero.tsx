'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { m, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion'
import BackgroundReel from '../BackgroundReel'
import { GrainOverlay } from '../backgrounds'
import { MEDIA_LOGOS } from '../media-logos'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { Kicker, Rise } from '../recommendations-page/motion'
import { INK, PAPER_BG, Paper, Photo } from './Clipping'
import type { MediaItem, MediaKind } from './media-data'

// Hero on the homepage media section's warm gray: the reel plays faint and grayscale behind, thin vertical rules
// drift, and a few clippings lie around the title (large screens), each sliding away at its own pace on scroll.
// The counts per type double as the chapter index.
const VIDEO_POSTER = '/videos/authority-reel-poster.jpg'

const SCATTER = [
  { cls: 'left-[3%] top-[18%] w-[210px]', r: -7, drift: -160 },
  { cls: 'left-[3%] bottom-[5%] w-[170px]', r: 5, drift: -60 },
  { cls: 'right-[4%] bottom-[12%] w-[200px]', r: 6, drift: -120 },
]

export interface ChapterLink {
  kind: MediaKind
  label: string
  count: number
}

export default function MediaHero({ reelUrl, scatter, chapters }: { reelUrl: string; scatter: MediaItem[]; chapters: ChapterLink[] }) {
  const reduce = useHydratedReducedMotion()
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])

  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const linesX = useTransform(() => (reduceMv.get() ? '0vw' : `${scrollYProgress.get() * -10}vw`))
  const contentY = useTransform(() => (reduceMv.get() ? 0 : scrollYProgress.get() * 90))
  const contentOpacity = useTransform(() => (reduceMv.get() ? 1 : 1 - Math.max(0, scrollYProgress.get() - 0.35) * 1.6))

  return (
    <section ref={ref} aria-labelledby="media-title" className="relative overflow-hidden bg-gradient-to-b from-[#5e5955] to-[#48443f] text-cream">
      <div aria-hidden className="absolute inset-0 opacity-90">
        <BackgroundReel url={reelUrl} poster={VIDEO_POSTER} />
      </div>
      <GrainOverlay opacity={0.16} blend="soft-light" />
      {/* Drifting vertical rules */}
      <m.div aria-hidden className="absolute inset-y-0 -inset-x-[12vw] pointer-events-none" style={{ x: linesX }}>
        {[8, 22, 36, 50, 64, 78, 92].map((p) => (
          <span key={p} className="absolute top-0 bottom-0 w-px bg-white/[0.05]" style={{ left: `${p}%` }} />
        ))}
      </m.div>

      {/* Clippings lying around the title (decorative: each story is listed below) */}
      <div aria-hidden className="hidden lg:block absolute inset-0 pointer-events-none">
        {scatter.slice(0, SCATTER.length).map((item, i) => (
          <ScatterCard key={item.id} item={item} i={i} progress={scrollYProgress} reduce={reduce} reduceMv={reduceMv} />
        ))}
      </div>

      <m.div className="relative max-w-4xl mx-auto px-6 pt-32 md:pt-40 pb-20 md:pb-28 min-h-[92svh] flex flex-col items-center justify-center text-center" style={{ y: contentY, opacity: contentOpacity }}>
        <Rise delay={0.05}>
          <Kicker tone="dark">ראיונות · כתבות · הופעות</Kicker>
        </Rise>
        <m.h1
          id="media-title"
          className="mt-6 font-sans font-black tracking-[-0.02em] leading-[0.95] text-[5rem] sm:text-[7.5rem] md:text-[10rem] text-cream"
          initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 40 }}
          animate={{ clipPath: 'inset(0 0 -12% 0)', y: 0 }}
          transition={reduce ? { duration: 0 } : { ...enterSpring, visualDuration: 1, delay: 0.12 }}
        >
          בתקשורת
        </m.h1>
        <Rise delay={0.3}>
          <p className="mt-6 font-garamond font-bold text-gold text-2xl md:text-3xl">מה אמרו עליי ב-ynet, מאקו, וואלה ועוד</p>
        </Rise>

        {/* Counts per type: links to the chapters */}
        <Rise delay={0.42} className="mt-10 w-full max-w-xl">
          <nav aria-label="לפי סוג" className="grid grid-cols-3 border-y border-cream/15">
            {chapters.map((c, i) => (
              <a
                key={c.kind}
                href={`#${c.kind}`}
                data-track="media_kind_nav"
                data-track-kind={c.kind}
                className={`group py-4 flex flex-col items-center gap-0.5 hover:bg-cream/[0.06] transition-colors focus-visible:outline-none focus-visible:bg-cream/10 ${i > 0 ? 'border-r border-cream/15' : ''}`}
              >
                <span className="font-garamond font-bold text-4xl md:text-5xl leading-none text-cream">{c.count}</span>
                <span className="text-sm md:text-base font-bold text-cream/80 group-hover:text-gold transition-colors">{c.label}</span>
              </a>
            ))}
          </nav>
        </Rise>

        {/* Outlet logos (cream monochrome) */}
        <ul aria-label="ערוצי תקשורת" className="mt-12 flex flex-wrap items-center justify-center gap-x-7 sm:gap-x-10 gap-y-6">
          {MEDIA_LOGOS.map((l, i) => (
            <m.li
              key={l.src}
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.55 + i * 0.08 }}
            >
              <Image src={l.src} alt={l.alt} width={l.w} height={112} className="h-6 sm:h-7 md:h-8 w-auto opacity-80" />
            </m.li>
          ))}
        </ul>
      </m.div>
    </section>
  )
}

function ScatterCard({ item, i, progress, reduce, reduceMv }: { item: MediaItem; i: number; progress: MotionValue<number>; reduce: boolean; reduceMv: MotionValue<boolean> }) {
  const s = SCATTER[i]
  const y = useTransform(() => (reduceMv.get() ? 0 : progress.get() * s.drift * 3))
  return (
    <m.div
      className={`absolute ${s.cls}`}
      initial={reduce ? false : { opacity: 0, y: 60, rotate: s.r * 2 }}
      animate={{ opacity: 1, y: 0, rotate: s.r }}
      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 1.2, delay: 0.5 + i * 0.15 }}
    >
      <m.div style={{ y }} className="relative rounded-[3px] shadow-[0_24px_50px_-16px_rgba(20,12,6,0.7)] overflow-hidden">
        <div className="relative px-3.5 pt-3 pb-3.5 text-right" style={{ background: PAPER_BG, color: INK }}>
          <Paper />
          <div className="relative">
            <p className="font-frank font-bold text-[15px] leading-none pb-1.5 border-b-[3px] border-double border-[#2d1a0e]/70 truncate">
              <bdi dir="auto">{item.outlet}</bdi>
            </p>
            <Photo item={item} className="mt-2 aspect-[4/3]" sizes="210px" />
            <p className="mt-2 font-frank font-bold text-[14px] leading-tight line-clamp-2">{item.title}</p>
          </div>
        </div>
      </m.div>
    </m.div>
  )
}
