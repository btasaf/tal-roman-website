'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { LogoMarquee } from '../media-logos'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { Kicker } from '../coaching/ui'
import { GiftCover, GiftCta, INSIDE_ID } from './gift-ui'

const rise = (reduce: boolean, delay: number, y = 18) => ({
  initial: reduce ? (false as const) : { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// The gift in one calm screen: the promise on the right, the guide's "cover" on the left (below on phones).
// On load the headline wipes up and the cover unclips from the bottom; on scroll the copy lifts away a touch faster.
export default function GiftHero({
  title,
  kicker,
  overline,
  headline,
  imageUrl,
}: {
  title: string
  kicker?: string
  overline?: string
  headline: string
  imageUrl: string | null
}) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * -80))
  const coverY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * 60))

  return (
    <section ref={ref} className="relative lg:min-h-svh bg-cream overflow-hidden flex flex-col">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <AuroraBackground palette="cream" />
        <GrainOverlay />
      </div>

      <div className="relative flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-24 md:pt-28 pb-8 grid grid-cols-1 lg:grid-cols-[0.98fr_1.02fr] gap-12 lg:gap-14 xl:gap-16 items-center">
        <m.div className="text-right" style={{ y: textY }}>
          {kicker && (
            <m.div {...rise(reduce, 0.05, 10)}>
              <Kicker>{kicker}</Kicker>
            </m.div>
          )}
          {overline && (
            <m.p {...rise(reduce, 0.1, 12)} className="mt-6 text-lg md:text-xl font-bold text-brand-dark">
              {overline}
            </m.p>
          )}
          <m.h1
            className="mt-3 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.6rem] text-balance"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 30 }}
            animate={{ clipPath: 'inset(0 0 -14% 0)', y: 0 }}
            transition={{ ...enterSpring, delay: 0.16 }}
          >
            {headline}
          </m.h1>

          <m.div
            {...rise(reduce, 0.34)}
            data-hide-dock
            className="mt-9 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6"
          >
            <GiftCta className="w-full sm:w-auto" />
            <a
              href={`#${INSIDE_ID}`}
              className="self-center sm:self-auto whitespace-nowrap font-bold text-brand-dark underline-offset-[6px] decoration-brand/40 decoration-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-full px-2 py-2"
            >
              מה בהדרכה?
            </a>
          </m.div>
          <m.p {...rise(reduce, 0.42)} className="mt-5 text-[15px] text-[#5a4538] text-center sm:text-right">
            בלי עלות. רק שם ומייל.
          </m.p>
        </m.div>

        <m.div className="relative w-full max-w-[560px] mx-auto lg:max-w-none" style={{ y: coverY }}>
          <div aria-hidden className="absolute -inset-12 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.36),transparent)]" />
          <m.div
            className="relative"
            initial={reduce ? false : { clipPath: 'inset(100% 0 0 0 round 44px)', y: 24 }}
            animate={{ clipPath: 'inset(0% 0 0 0 round 44px)', y: 0 }}
            transition={{ type: 'spring', bounce: 0, visualDuration: 1.1, delay: 0.2 }}
          >
            <GiftCover src={imageUrl} title={title} badge="במתנה" priority />
          </m.div>
        </m.div>
      </div>

      <m.div {...rise(reduce, 0.7, 10)} className="relative w-[440px] max-w-[84vw] mx-auto text-center pt-8 pb-10 md:pb-12">
        <p className="text-sm text-[#3d2814]/75 mb-2">כפי שהופיעה ב</p>
        <LogoMarquee tone="dark" logoClassName="h-7 md:h-8" duration={26} />
      </m.div>
    </section>
  )
}
