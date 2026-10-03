'use client'

import { useRef, type RefObject } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { UI, springCalm } from './gift-copy'

const PORTRAIT = '/wix-assets/images/tal-photos/IMG_4930_2048px.jpg'
const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

// A short personal note from Tal (the "bridge" lines), read line by line as it scrolls past.
export default function LetterSection({ bridge, thankYouRef }: { bridge: string[]; thankYouRef: RefObject<HTMLDivElement | null> }) {
  const [opening, ...rest] = bridge
  const closing = rest.length > 1 ? rest[rest.length - 1] : null
  const body = closing ? rest.slice(0, -1) : rest

  return (
    // Bottom padding leaves room for the next section's wave edge
    <section className="relative bg-cream px-5 pb-[22vh] sm:px-8 md:pb-[26vh]">
      <GrainOverlay />
      <Thread />

      <div className="relative mx-auto mt-6 grid max-w-6xl grid-cols-1 items-start gap-12 md:mt-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
        {/* Text column (start / right side) */}
        <div ref={thankYouRef} className="text-right">
          <m.h2
            className="text-balance font-sans text-[30px] font-black leading-[1.15] tracking-[-0.01em] text-[#2d1a0e] sm:text-4xl md:text-5xl"
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 24 }}
            whileInView={{ clipPath: 'inset(0 0 -12% 0)', y: 0 }}
            viewport={viewport}
            transition={springCalm}
          >
            {opening}
          </m.h2>

          <div className="mt-8 space-y-6 md:mt-10 md:space-y-7">
            {body.map((line, i) => (
              <ReadLine key={i} text={line} />
            ))}
          </div>

          {closing && (
            <m.p
              className="mt-10 text-balance font-garamond text-[30px] font-bold leading-[1.25] text-brand-dark sm:text-4xl md:mt-14 md:text-5xl"
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={springCalm}
            >
              {closing}
            </m.p>
          )}

          {/* Signature */}
          <m.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...springCalm, delay: 0.15 }}
          >
            <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-white shadow-[0_10px_24px_-10px_rgba(61,40,20,0.5)] lg:hidden">
              <Image src={PORTRAIT} alt="" fill sizes="56px" className="object-cover object-[22%_30%]" />
            </span>
            <span aria-hidden className="hidden h-px w-14 bg-gradient-to-l from-brand/60 to-transparent lg:block" />
            <span className="font-garamond text-4xl font-bold leading-none text-[#2d1a0e]">{UI.signature}</span>
          </m.div>
        </div>

        <Portrait />
      </div>
    </section>
  )
}

// A thin gold thread drawn down from the gift into the letter as you scroll
function Thread() {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.95', 'end 0.55'] })
  const scaleY = useTransform(() => Math.min(1, Math.max(0, scrollYProgress.get())))
  const starOpacity = useTransform(() => Math.min(1, Math.max(0, (scrollYProgress.get() - 0.75) * 4)))

  return (
    <div ref={ref} aria-hidden className="relative mx-auto flex h-28 w-6 flex-col items-center md:h-36">
      <m.span
        className="block w-px flex-1 origin-top bg-gradient-to-b from-gold/0 via-gold/70 to-gold"
        style={{ scaleY: reduce ? 1 : scaleY }}
      />
      <m.span className="mt-2 text-lg leading-none text-gold" style={{ opacity: reduce ? 1 : starOpacity }}>
        ✦
      </m.span>
    </div>
  )
}

// Each paragraph comes into full ink as it reaches the reading line
function ReadLine({ text }: { text: string }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.92', 'start 0.6'] })
  const opacity = useTransform(() => 0.22 + 0.78 * Math.min(1, Math.max(0, scrollYProgress.get())))
  const y = useTransform(() => (1 - Math.min(1, Math.max(0, scrollYProgress.get()))) * 18)

  return (
    <m.p
      ref={ref}
      className="max-w-[34ch] text-xl leading-[1.7] text-[#3d2814] md:text-[26px] md:leading-[1.65]"
      style={reduce ? { opacity: 1, y: 0 } : { opacity, y }}
    >
      {text}
    </m.p>
  )
}

// Desktop: an arched portrait that wipes up into view, the photo drifting gently inside its frame
function Portrait() {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const innerY = useTransform(() => `${-6 + scrollYProgress.get() * 12}%`)

  return (
    <div className="hidden lg:block lg:sticky lg:top-28">
      <div ref={ref} className="relative mx-auto w-full max-w-[400px]">
        {/* soft halo behind the arch */}
        <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.35),transparent)]" />
        <m.div
          className="relative aspect-[4/5] overflow-hidden rounded-t-full rounded-b-[32px] shadow-[0_40px_80px_-40px_rgba(61,40,20,0.6)]"
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          viewport={viewport}
          transition={{ ...springCalm, visualDuration: 1.2 }}
        >
          <m.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: reduce ? 0 : innerY }}>
            <Image src={PORTRAIT} alt={UI.portraitAlt} fill sizes="400px" className="object-cover object-[22%_40%]" />
          </m.div>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#2d1a0e]/25 via-transparent to-transparent" />
        </m.div>
        {/* thin gold arch outline, offset like a passe-partout */}
        <div aria-hidden className="pointer-events-none absolute -inset-3 rounded-t-full rounded-b-[40px] border border-gold/50" />
      </div>
    </div>
  )
}
