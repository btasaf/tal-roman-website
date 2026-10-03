'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import type { PresalePage } from '@/lib/types'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { inView } from './motion'
import { BuyButton, Icon, Price, splitHighlight } from './ui'

// The closing offer: one dark, warm card on the cream. It grows into place as it scrolls up (scale + a soft
// rise, scroll-linked); inside, the price lands first, then the recap of what's included slides in line by line.
export default function PresaleOffer({ page, href, deviceImageUrl }: { page: PresalePage; href: string; deviceImageUrl: string | null }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] })
  const scale = useTransform(() => (reduce ? 1 : 0.92 + 0.08 * scrollYProgress.get()))
  const y = useTransform(() => (reduce ? 0 : (1 - scrollYProgress.get()) * 60))

  const [before, highlight, after] = splitHighlight(page.courseTitle ?? '', page.courseTitleHighlight)
  const included = (page.benefits ?? []).filter((b) => b.title)
  const saving = page.priceNew != null && page.priceOld != null && page.priceOld > page.priceNew ? page.priceOld - page.priceNew : null

  return (
    <section id="offer" className="relative bg-cream px-4 md:px-8 pt-8 md:pt-12 pb-24 md:pb-32">
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

        <div className="relative grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-x-16 gap-y-8 lg:gap-y-8 px-6 py-12 sm:px-12 md:px-16 md:py-16 lg:py-20 items-center">
          <div className="text-right lg:row-span-2 lg:self-center">
            {page.courseSpecialText && <p className="text-lg md:text-xl font-bold text-cream/80 leading-snug text-pretty">{page.courseSpecialText}</p>}
            {page.courseTitle && (
              <h2 className="mt-4 font-sans font-black tracking-[-0.01em] text-4xl md:text-5xl lg:text-6xl leading-[1.08] text-balance">
                {before}
                {highlight && <span className="font-garamond font-bold text-gold">{highlight}</span>}
                {after}
              </h2>
            )}

            <m.div
              className="mt-9 flex items-center gap-5"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ ...enterSpring, delay: 0.1 }}
            >
              {deviceImageUrl && (
                <a href={href} tabIndex={-1} aria-hidden data-track="presale_buy_click" data-track-placement="offer_image" className="hidden sm:block relative shrink-0 w-[72px] h-[72px] rounded-full overflow-hidden ring-2 ring-gold/30 transition-[scale] duration-300 hover:scale-105">
                  <Image src={deviceImageUrl} alt="" fill sizes="80px" className="object-cover" />
                </a>
              )}
              <div>
                <Price now={page.priceNew} was={page.priceOld} tone="dark" size="xl" />
                {saving != null && (
                  <p className="mt-3 inline-flex gap-1.5 rounded-full bg-gold/15 text-gold px-3.5 py-1 text-sm font-bold">
                    חוסכים<span dir="ltr" className="tabular-nums">₪{saving}</span>
                  </p>
                )}
              </div>
            </m.div>
          </div>

          <div className="text-right order-3 lg:order-none lg:col-start-2 lg:row-start-1 lg:self-end">
            {included.length > 0 && (
              <ul className="space-y-3">
                {included.map((b, i) => (
                  <m.li
                    key={i}
                    className="flex items-center gap-4 rounded-2xl bg-cream/[0.06] ring-1 ring-cream/10 px-5 py-4"
                    initial={{ opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={inView}
                    transition={{ ...enterSpring, delay: 0.15 + i * 0.08 }}
                  >
                    <span className="shrink-0 w-11 h-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                      <Icon name={b.icon} className="w-6 h-6" />
                    </span>
                    <span className="text-base md:text-lg leading-snug">
                      <span className="font-bold">{b.title}</span>
                      {b.description && <span className="text-cream/70"> · {b.description.replace(/\s*\n\s*/g, ' ')}</span>}
                    </span>
                  </m.li>
                ))}
              </ul>
            )}
          </div>

          <div className="order-2 lg:order-none lg:col-start-2 lg:row-start-2 lg:self-start">
            {page.ctaButtonText && (
              <div>
                <BuyButton href={href} label={page.ctaButtonText} tone="gold" placement="offer" className="w-full" />
              </div>
            )}

            {page.trustBadges && page.trustBadges.length > 0 && (
              <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2.5 text-sm font-bold text-cream/75">
                {page.trustBadges.map((b, i) => (
                  <li key={i} className="inline-flex items-center gap-2">
                    <Icon name={b.icon} fallback="lock" className="w-4 h-4 text-gold" />
                    {b.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </m.div>
    </section>
  )
}
