'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { AuroraBackground, FlowLines, GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { springCalm } from './gift-copy'

const GRAY = 'linear-gradient(to bottom, #5e5955, #48443f)'

// "A taste of a whole world": the taste line, then the world itself written out in big type
// that inks in word by word as it scrolls through the screen.
export default function WorldSection({ tasteLine, resultLine }: { tasteLine: string; resultLine: string }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const words = resultLine.split(' ')

  return (
    // Bottom padding leaves room for the next section's angled edge
    <section className="relative px-5 pt-16 pb-[22vh] text-cream sm:px-8 md:pt-20 md:pb-[26vh]" style={{ background: GRAY }}>
      <SoftDome color="#5e5955" height="16vh" />
      {/* The dome meets the section edge-to-edge; this sliver hides the sub-pixel hairline between them */}
      <div aria-hidden className="absolute inset-x-0 -top-[3px] h-[6px] bg-[#5e5955]" />
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <AuroraBackground palette="gray" />
      </div>
      <FlowLines color="#e6c060" opacity={0.22} duration={90} />
      {/* grain fades in below the wave so the solid edge and the section read as one surface */}
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
        <GrainOverlay opacity={0.2} blend="soft-light" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <m.h2
          className="mx-auto max-w-2xl text-balance text-lg font-bold leading-relaxed text-gold md:text-2xl"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={springCalm}
        >
          <span aria-hidden className="mb-2 block text-2xl leading-none">✦</span>
          {tasteLine}
        </m.h2>

        <p
          ref={ref}
          className="mx-auto mt-8 max-w-4xl text-balance font-sans text-[30px] font-black leading-[1.22] tracking-[-0.01em] sm:text-4xl md:mt-10 md:text-5xl lg:text-6xl lg:leading-[1.18]"
        >
          {reduce ? (
            <AccentedText words={words} />
          ) : (
            <>
              <span className="sr-only">{resultLine}</span>
              <span aria-hidden>
                {words.map((w, i) => (
                  <InkWord key={i} word={w} index={i} count={words.length} progress={scrollYProgress} accent={i === 0} />
                ))}
              </span>
            </>
          )}
        </p>
      </div>
    </section>
  )
}

function AccentedText({ words }: { words: string[] }) {
  return (
    <>
      <span className="font-garamond font-bold text-gold">{words[0]}</span> {words.slice(1).join(' ')}
    </>
  )
}

// Soft dome edge that flattens as the section rises (path morph on scroll). Same shape as the shared
// WaveCap, but reads reduced motion via the hydration-safe hook so the SSR path always matches.
function SoftDome({ color, height }: { color: string; height: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useHydratedReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const d = useTransform(() => {
    const crest = reduce ? 40 : 4 + 56 * Math.min(1, Math.max(0, scrollYProgress.get()))
    return `M0,120 L0,100 C360,${crest} 1080,${crest} 1440,100 L1440,120 Z`
  })
  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute bottom-full left-0 right-0" style={{ height }}>
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 1440 120" preserveAspectRatio="none">
        <m.path d={d} fill={color} />
      </svg>
    </div>
  )
}

// One word: dim until its slice of the scroll range, then full cream (the first word gets the serif gold accent)
function InkWord({ word, index, count, progress, accent }: { word: string; index: number; count: number; progress: MotionValue<number>; accent: boolean }) {
  const start = (index / count) * 0.85
  const end = start + 0.15 + 0.85 / count
  const opacity = useTransform(() => {
    const t = (progress.get() - start) / (end - start)
    return 0.16 + 0.84 * Math.min(1, Math.max(0, t))
  })
  return (
    <>
      <m.span className={`inline-block ${accent ? 'font-garamond font-bold text-gold' : ''}`} style={{ opacity }}>
        {word}
      </m.span>{' '}
    </>
  )
}
