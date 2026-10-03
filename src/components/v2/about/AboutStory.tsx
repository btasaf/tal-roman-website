'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { m, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { PHOTO, STORY_HIGHLIGHTS } from './about-content'
import { ROOM } from './AboutHero'

// Her story, continuing in the dark room the manifesto opened.
// Desktop/tablet: a pinned photo on the left; paragraphs pass on the right at reading pace and the one in the
// middle of the screen lights up. Each new paragraph wipes a new photo up over the last.
// Phones: a simple column, photos between the paragraphs (clip reveal).
// Seam out: the content drifts down and dims while the cream sheet below rises over it (background stays put).
const BOTTOM = '#3d2814'

export default function AboutStory({ paragraphs }: { paragraphs: string[] }) {
  const reduce = useHydratedReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const [active, setActive] = useState(0)

  const { scrollYProgress: exitRaw } = useScroll({ target: sectionRef, offset: ['end end', 'end start'] })
  const exitY = useTransform(() => (reduce ? '0vh' : `${exitRaw.get() * 30}vh`))
  const exitOpacity = useTransform(() => (reduce ? 1 : 1 - 0.75 * exitRaw.get()))

  if (!paragraphs.length) return null
  const photos = paragraphs.map((_, i) => PHOTO.story[i % PHOTO.story.length])

  return (
    <section
      ref={sectionRef}
      aria-label="הסיפור שלי"
      className="relative text-cream overflow-x-clip"
      style={{ background: `linear-gradient(to bottom, ${ROOM} 0%, ${ROOM} 12%, #2d1a0e 55%, ${BOTTOM} 100%)` }}
    >
      <GrainOverlay opacity={0.18} blend="soft-light" />
      <m.div className="relative" style={{ y: exitY, opacity: exitOpacity }}>
        {/* ── Tablet & desktop ── */}
        <div className="hidden md:grid relative max-w-6xl mx-auto px-10 grid-cols-[1.1fr_0.9fr] gap-14 lg:gap-24 pt-[10svh] pb-[34svh]">
          <div>
            {paragraphs.map((p, i) => (
              <Paragraph key={i} index={i} text={p} reduce={reduce} onActive={setActive} />
            ))}
          </div>

          <div className="relative">
            <div className="sticky top-0 h-svh flex flex-col items-start justify-center">
              <div className="relative w-full max-w-[400px] aspect-[4/5] rounded-[40px] overflow-hidden bg-[#1a0c06] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.7)]">
                {photos.map((src, i) => (
                  <m.div
                    key={i}
                    className="absolute inset-0"
                    initial={false}
                    animate={{ clipPath: i <= active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.9 }}
                    style={{ zIndex: i }}
                  >
                    <m.div
                      className="absolute inset-0"
                      initial={false}
                      animate={{ scale: i === active ? 1 : 1.08 }}
                      transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 1.4 }}
                    >
                      <Image src={src} alt="" fill sizes="(max-width: 1024px) 40vw, 400px" className="object-cover object-[50%_25%]" />
                    </m.div>
                  </m.div>
                ))}
                {/* Inner rim so the frame edge reads softly on the dark */}
                <div aria-hidden className="absolute inset-0 z-[20] rounded-[40px] ring-1 ring-inset ring-cream/10 pointer-events-none" />
              </div>

              {/* Progress: 01 / 05 and a thin bar */}
              <div aria-hidden className="mt-6 w-full max-w-[400px] flex items-center gap-4 text-cream/70 text-sm font-bold tabular-nums">
                <span className="text-gold">{String(active + 1).padStart(2, '0')}</span>
                <span className="relative flex-1 h-px bg-cream/15 overflow-hidden">
                  <m.span
                    className="absolute inset-y-0 right-0 w-full bg-gold origin-right"
                    initial={false}
                    animate={{ scaleX: (active + 1) / paragraphs.length }}
                    transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.6 }}
                  />
                </span>
                <span>{String(paragraphs.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Phones ── */}
        <div className="md:hidden relative px-6 pt-16 pb-36 space-y-14">
          {paragraphs.map((p, i) => (
            <div key={i} className="space-y-14">
              <MobileParagraph text={p} reduce={reduce} />
              {i % 2 === 0 && i < paragraphs.length - 1 && <MobilePhoto src={photos[i]} reduce={reduce} flip={i % 4 === 2} />}
            </div>
          ))}
        </div>
      </m.div>
    </section>
  )
}

// Text with the key phrases in gold (each phrase highlighted once, only if it's in the CMS text)
function Highlighted({ text }: { text: string }) {
  const parts: { t: string; hl: boolean }[] = [{ t: text, hl: false }]
  for (const phrase of STORY_HIGHLIGHTS) {
    const idx = parts.findIndex((p) => !p.hl && p.t.includes(phrase))
    if (idx === -1) continue
    const [before, ...rest] = parts[idx].t.split(phrase)
    parts.splice(idx, 1, { t: before, hl: false }, { t: phrase, hl: true }, { t: rest.join(phrase), hl: false })
  }
  return (
    <>
      {parts.map((p, i) =>
        p.hl ? (
          <span key={i} className="text-gold [box-decoration-break:clone] [-webkit-box-decoration-break:clone] bg-[linear-gradient(transparent_70%,rgba(230,192,96,0.22)_70%)]">
            {p.t}
          </span>
        ) : (
          <span key={i}>{p.t}</span>
        )
      )}
    </>
  )
}

// Desktop paragraph: lit while it's in the middle band of the screen (opacity only, nothing moves while reading)
function Paragraph({ text, index, reduce, onActive }: { text: string; index: number; reduce: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const p = useTransform(() => scrollYProgress.get())
  const opacity = useTransform(p, [0.18, 0.4, 0.6, 0.82], [0.18, 1, 1, 0.18])
  useMotionValueEvent(p, 'change', (x) => {
    if (x > 0.3 && x < 0.7) onActive(index)
  })

  return (
    <div ref={ref} className="min-h-[72svh] flex items-center">
      <m.p
        className="font-sans font-medium text-[1.6rem] lg:text-[2rem] leading-[1.55] text-cream"
        style={reduce ? undefined : { opacity }}
      >
        <Highlighted text={text} />
      </m.p>
    </div>
  )
}

const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

function MobileParagraph({ text, reduce }: { text: string; reduce: boolean }) {
  return (
    <m.p
      className="font-sans font-medium text-[1.3rem] leading-[1.6] text-cream"
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={enterSpring}
    >
      <Highlighted text={text} />
    </m.p>
  )
}

function MobilePhoto({ src, reduce, flip }: { src: string; reduce: boolean; flip: boolean }) {
  return (
    <m.div
      className={`relative w-[72%] aspect-[4/5] rounded-[32px] overflow-hidden bg-[#1a0c06] ${flip ? 'mr-auto' : 'ml-auto'}`}
      initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0% round 32px)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 32px)' }}
      viewport={viewport}
      transition={{ ...enterSpring, visualDuration: 1.1 }}
    >
      <Image src={src} alt="" fill sizes="72vw" className="object-cover object-[50%_25%]" />
    </m.div>
  )
}
