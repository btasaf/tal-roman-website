'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import type { PresalePage } from '@/lib/types'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { BuyButton, Icon, Price, splitHighlight } from './ui'

const TAL_PHOTO = '/wix-assets/images/tal-photos/IMG_4934_2048px.jpg'

const rise = (delay: number, y = 18) => ({
  initial: { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// Hero: Tal's personal note after the training, then the offer itself (course name, special price, the
// purchase button and the trust line) in one calm screen. Tal sits in an arch beside it (below on phones).
// On load: the note settles, the title wipes up, the highlighted word gets a hand-drawn stroke, the arch
// opens like a curtain rising. On scroll: the copy lifts away slightly faster than the photo (quiet depth).
export default function PresaleHero({ page, href }: { page: PresalePage; href: string }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * -70))
  const photoY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * 60))
  const photoScale = useTransform(() => (reduce ? 1 : 1 + scrollYProgress.get() * 0.08))

  const [before, highlight, after] = splitHighlight(page.courseTitle ?? '', page.courseTitleHighlight)
  const chips = (page.benefits ?? []).filter((b) => b.title).slice(0, 2)

  return (
    <section ref={ref} className="relative bg-cream overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div className="relative w-full max-w-6xl mx-auto px-5 md:px-8 pt-24 md:pt-28 lg:pt-24 pb-20 md:pb-24 lg:min-h-svh grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] lg:grid-cols-[1.15fr_0.85fr] gap-14 md:gap-8 lg:gap-14 items-center">
        {/* Copy */}
        <m.div className="text-right" style={{ y: textY }}>
          {/* Tal's note after the training */}
          {(page.introTitle || page.introSubtitle) && (
            <m.div {...rise(0.05, 12)} className="max-w-xl">
              <div>
                {page.introTitle && <p className="text-xl md:text-2xl font-black text-[#2d1a0e] leading-snug">{page.introTitle}</p>}
                {page.introSubtitle && (
                  <p className="mt-1.5 text-base md:text-lg text-[#48443f] leading-relaxed whitespace-pre-line text-pretty">{page.introSubtitle}</p>
                )}
              </div>
            </m.div>
          )}

          {page.courseEyebrow && (
            <m.p {...rise(0.16, 12)} className="mt-9 md:mt-10 text-base md:text-lg font-bold text-brand-dark">
              {page.courseEyebrow}
            </m.p>
          )}

          {page.courseTitle && (
            <m.h1
              className="mt-3 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[2.75rem] leading-[1.04] sm:text-6xl md:text-[3.4rem] lg:text-[4.6rem] xl:text-[5.2rem] text-balance"
              initial={{ clipPath: 'inset(0 0 100% 0)', y: 30 }}
              animate={{ clipPath: 'inset(0 0 -20% 0)', y: 0 }}
              transition={{ ...enterSpring, delay: 0.24 }}
            >
              {before}
              {highlight && (
                <span className="relative inline-block font-garamond font-bold text-brand">
                  {highlight}
                  {/* Hand-drawn stroke under the word, drawn in from the right */}
                  <m.svg
                    aria-hidden
                    className="absolute -bottom-[0.08em] right-0 w-full h-[0.22em] text-gold"
                    viewBox="0 0 200 20"
                    preserveAspectRatio="none"
                    initial={{ clipPath: 'inset(0 0 0 100%)' }}
                    animate={{ clipPath: 'inset(0 0 0 0%)' }}
                    transition={{ type: 'spring', bounce: 0, visualDuration: 0.9, delay: 0.85 }}
                  >
                    <path d="M4 13 C 50 5, 110 4, 196 10" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  </m.svg>
                </span>
              )}
              {after}
            </m.h1>
          )}

          {page.courseSpecialText && (
            <m.p {...rise(0.36)} className="mt-7 text-lg md:text-xl font-bold text-[#3d2814] leading-snug max-w-xl text-pretty">
              {page.courseSpecialText}
            </m.p>
          )}

          {/* Price + purchase */}
          <m.div {...rise(0.46)} data-hide-dock className="mt-6 flex flex-col sm:flex-row md:flex-col lg:flex-row sm:items-center md:items-start lg:items-center gap-5 sm:gap-8 md:gap-5 lg:gap-8">
            <Price now={page.priceNew} was={page.priceOld} />
            {page.ctaButtonText && <BuyButton href={href} label={page.ctaButtonText} placement="hero" className="w-full sm:w-auto" />}
          </m.div>

          {page.trustBadges && page.trustBadges.length > 0 && (
            <m.ul {...rise(0.56, 10)} className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm md:text-base font-bold text-[#48443f]">
              {page.trustBadges.map((b, i) => (
                <li key={i} className="inline-flex items-center gap-2">
                  <Icon name={b.icon} fallback="lock" className="w-5 h-5 text-brand-dark" />
                  {b.text}
                </li>
              ))}
            </m.ul>
          )}
        </m.div>

        {/* Tal in an arch */}
        <m.div className="relative mx-auto w-full max-w-[290px] sm:max-w-[380px] md:max-w-none" style={{ y: photoY }}>
          <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.35),transparent)]" />
          <m.div
            className="relative aspect-[4/5] md:aspect-[3/5] lg:aspect-[5/6] overflow-hidden rounded-t-[999px] rounded-b-[36px] shadow-[0_40px_90px_-40px_rgba(61,40,20,0.55)] ring-1 ring-white/60"
            initial={{ clipPath: 'inset(100% 0 0 0)' }}
            animate={{ clipPath: 'inset(0% 0 0 0)' }}
            transition={{ type: 'spring', bounce: 0, visualDuration: 1.1, delay: 0.15 }}
          >
            <m.div className="absolute inset-0" initial={{ scale: 1.16 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0, visualDuration: 1.6, delay: 0.15 }}>
              <m.div className="absolute inset-0" style={{ scale: photoScale }}>
                <Image src={TAL_PHOTO} alt="טל רומן" fill priority sizes="(min-width: 1024px) 440px, 90vw" className="object-cover object-[30%_center]" />
              </m.div>
            </m.div>
            <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2d1a0e]/35 to-transparent" />
          </m.div>

          {/* Two of the course's own benefits riding on the frame */}
          {chips.length > 0 && (
            <m.ul {...rise(0.75, 14)} className="absolute -bottom-5 right-4 left-4 sm:left-auto sm:-right-6 flex flex-col gap-2 items-start sm:items-end">
              {chips.map((c, i) => (
                <li
                  key={i}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white/90 backdrop-blur px-4 py-2.5 text-sm font-bold text-[#2d1a0e] shadow-[0_14px_34px_-16px_rgba(61,40,20,0.5)]"
                >
                  <Icon name={c.icon} className="w-4 h-4 text-brand-dark" />
                  {c.title}
                </li>
              ))}
            </m.ul>
          )}
        </m.div>
      </div>
    </section>
  )
}
