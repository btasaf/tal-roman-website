'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { LogoMarquee } from '../media-logos'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { HERO, PHOTO } from './coaching-content'
import { CtaLink, DetailIcon, Kicker } from './ui'

const rise = (reduce: boolean, delay: number, y = 18) => ({
  initial: reduce ? (false as const) : { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// Hero: the offer in one calm screen. Text on the right, Tal in an arch on the left (below the text on phones).
// On load: the title wipes up, the copy follows, the arch opens like a curtain rising.
// On scroll: the copy lifts away a little faster than the photo, which settles slightly (depth, not spectacle).
export default function CoachingHero() {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * -90))
  const textOpacity = useTransform(() => (reduce ? 1 : Math.max(0, 1 - scrollYProgress.get() * 1.6)))
  const photoY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * 70))
  const photoScale = useTransform(() => (reduce ? 1 : 1 + scrollYProgress.get() * 0.08))

  const titleParts = HERO.title.split('אישי')

  return (
    <section ref={ref} className="relative min-h-svh bg-cream overflow-hidden flex flex-col">
      {/* Colour fields fade out toward the bottom, so the hero melts into the letter below */}
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div className="relative flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-24 md:pt-28 pb-10 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] lg:grid-cols-[1.08fr_0.92fr] gap-12 md:gap-10 lg:gap-16 items-center">
        {/* Copy */}
        <m.div className="text-right" style={{ y: textY, opacity: textOpacity }}>
          <m.div {...rise(reduce, 0.05, 10)}>
            <Kicker>{HERO.kicker}</Kicker>
          </m.div>

          <m.h1
            className="mt-5 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[3.25rem] leading-[1.02] sm:text-6xl lg:text-[5.4rem]"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 30 }}
            animate={{ clipPath: 'inset(0 0 -12% 0)', y: 0 }}
            transition={{ ...enterSpring, delay: 0.12 }}
          >
            {titleParts[0]}
            <span className="font-garamond font-bold text-brand">אישי</span>
            {titleParts[1]}
          </m.h1>

          <m.p
            {...rise(reduce, 0.24)}
            className="mt-6 text-xl md:text-2xl font-bold text-[#3d2814] leading-snug max-w-xl text-pretty"
          >
            {HERO.subtitle}
          </m.p>
          <m.p
            {...rise(reduce, 0.32)}
            className="mt-4 text-lg text-[#3d2814]/80 leading-relaxed max-w-xl text-pretty"
          >
            {HERO.invite}
          </m.p>

          <m.div
            {...rise(reduce, 0.42)}
            className="mt-9 flex flex-col sm:flex-row sm:items-center md:flex-col md:items-start lg:flex-row lg:items-center gap-4 sm:gap-6 md:gap-4 lg:gap-6"
          >
            <CtaLink className="w-full sm:w-auto" />
            <a
              href="#for-whom"
              className="self-center sm:self-auto whitespace-nowrap font-bold text-brand-dark underline-offset-[6px] decoration-brand/40 decoration-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-full px-2 py-2"
            >
              למי זה מתאים?
            </a>
          </m.div>
        </m.div>

        {/* Photo in an arch */}
        <m.div className="relative mx-auto w-full max-w-[420px] md:max-w-none" style={{ y: photoY }}>
          {/* Soft halo behind the arch */}
          <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.35),transparent)]" />
          <m.div
            className="relative aspect-[4/5] md:aspect-[3/4] lg:aspect-[5/6] overflow-hidden rounded-t-[999px] rounded-b-[36px] shadow-[0_40px_90px_-40px_rgba(61,40,20,0.55)] ring-1 ring-white/60"
            initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ type: 'spring', bounce: 0, visualDuration: 1.1, delay: 0.15 }}
          >
            <m.div
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.18 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0, visualDuration: 1.6, delay: 0.15 }}
            >
              <m.div className="absolute inset-0" style={{ scale: photoScale }}>
                <Image
                  src={PHOTO.hero}
                  alt="טל רומן"
                  fill
                  priority
                  sizes="(min-width: 1024px) 480px, 90vw"
                  className="object-cover object-[30%_center]"
                />
              </m.div>
            </m.div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2d1a0e]/35 to-transparent" />
          </m.div>

          {/* Two quiet facts riding on the frame */}
          <m.div
            {...rise(reduce, 0.7, 14)}
            className="absolute -bottom-5 right-4 left-4 sm:left-auto sm:-right-6 flex flex-col gap-2 items-start sm:items-end"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur px-4 py-2.5 text-sm font-bold text-[#2d1a0e] shadow-[0_14px_34px_-16px_rgba(61,40,20,0.5)]">
              <span className="text-brand-dark"><DetailIcon name="pin" className="w-4 h-4" /></span>
              קליניקה בדרום תל אביב או בזום
            </span>
            <span className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur px-4 py-2.5 text-sm font-bold text-[#2d1a0e] shadow-[0_14px_34px_-16px_rgba(61,40,20,0.5)]">
              <span className="text-brand-dark"><DetailIcon name="lock" className="w-4 h-4" /></span>
              פרטיות מלאה
            </span>
          </m.div>
        </m.div>
      </div>

      {/* Credibility strip */}
      <m.div
        {...rise(reduce, 0.8, 10)}
        className="relative w-[440px] max-w-[84vw] mx-auto text-center pt-10 pb-10 md:pb-12"
      >
        <p className="text-sm text-[#3d2814]/75 mb-2">כפי שהופיעה ב</p>
        <LogoMarquee tone="dark" logoClassName="h-7 md:h-8" duration={26} />
      </m.div>
    </section>
  )
}
