'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { PRICING } from './coaching-content'
import { CtaLink, DetailIcon } from './ui'

// Location and cost: one dark, warm card on the cream. It grows into place as it scrolls up
// (scale + a soft rise, scroll-linked), and its details settle in one after another.
export default function CoachingPricing() {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] })
  const scale = useTransform(() => (reduce ? 1 : 0.92 + 0.08 * scrollYProgress.get()))
  const y = useTransform(() => (reduce ? 0 : (1 - scrollYProgress.get()) * 60))

  return (
    <section className="relative px-4 md:px-8 py-12 md:py-20">
      <GrainOverlay />
      <m.div
        ref={ref}
        data-hide-dock
        className="relative max-w-6xl mx-auto overflow-hidden rounded-[36px] md:rounded-[48px] text-cream shadow-[0_50px_100px_-50px_rgba(45,26,14,0.8)]"
        style={{ background: 'linear-gradient(150deg, #3d2814 0%, #2d1a0e 60%, #24150b 100%)', scale, y }}
      >
        <span aria-hidden className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-[radial-gradient(circle,rgba(230,192,96,0.28)_0%,transparent_68%)]" />
        <span aria-hidden className="absolute -bottom-40 -right-24 w-[460px] h-[460px] rounded-full bg-[radial-gradient(circle,rgba(201,120,112,0.3)_0%,transparent_68%)]" />
        <GrainOverlay opacity={0.18} blend="soft-light" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 px-7 py-12 sm:px-12 md:px-16 md:py-16 lg:py-20 items-center">
          <div className="text-right">
            <h2 className="font-sans font-black tracking-[-0.01em] text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              מיקום <span className="font-garamond font-bold text-gold">ועלויות</span>
            </h2>
            <m.p
              className="mt-8 flex items-baseline gap-3"
              initial={reduce ? false : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '0px 0px -10% 0px' }}
              transition={{ ...enterSpring, delay: 0.1 }}
            >
              <span className="font-sans font-black text-gold text-7xl md:text-8xl leading-none tabular-nums" dir="ltr">
                ₪{PRICING.price}
              </span>
            </m.p>
            <p className="mt-3 text-lg md:text-xl text-cream/80">{PRICING.unit}</p>
          </div>

          <div className="text-right">
            <ul className="space-y-3">
              {PRICING.details.map((d, i) => (
                <m.li
                  key={d.icon}
                  className="flex items-center gap-4 rounded-2xl bg-cream/[0.06] ring-1 ring-cream/10 px-5 py-4"
                  initial={reduce ? false : { opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ ...enterSpring, delay: 0.15 + i * 0.1 }}
                >
                  <span className="shrink-0 w-11 h-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                    <DetailIcon name={d.icon} />
                  </span>
                  <span className="text-base md:text-lg text-cream/90 leading-snug">{d.text}</span>
                </m.li>
              ))}
            </ul>
            <div className="mt-8">
              <CtaLink tone="gold" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </m.div>
    </section>
  )
}
