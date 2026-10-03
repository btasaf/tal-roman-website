'use client'

import { m } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { FadeUp, SectionTitle } from '../coaching/motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { GiftCta, INSIDE_ID } from './gift-ui'

// What's inside: the Sanity list on a warm-brown band. Title sticks on desktop while the points
// arrive one by one, each with a gold number that unclips from the side.
export default function GiftInside({ items }: { items: string[] }) {
  const reduce = useHydratedReducedMotion()
  if (!items.length) return null

  return (
    <section id={INSIDE_ID} className="relative mx-2 md:mx-4 rounded-[40px] md:rounded-[56px] bg-[#3d2814] text-cream overflow-hidden scroll-mt-4">
      <GrainOverlay opacity={0.18} blend="soft-light" />
      <div aria-hidden className="absolute -top-48 -right-40 w-[700px] max-w-[150vw] h-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(201,120,112,0.3),transparent)]" />
      <div aria-hidden className="absolute -bottom-56 -left-40 w-[700px] max-w-[150vw] h-[600px] rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.16),transparent)]" />

      <div className="relative max-w-6xl mx-auto px-5 md:px-10 py-20 md:py-28 grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-20 items-start">
        <div className="lg:sticky lg:top-28 text-right">
          <SectionTitle kicker="מה בפנים" title="מה תקבלו בהדרכה" accent="בהדרכה" tone="dark" align="start" />
          <FadeUp y={14} delay={0.2} className="mt-10 hidden lg:block">
            <div data-hide-dock>
              <GiftCta tone="gold" />
            </div>
          </FadeUp>
        </div>

        <ol className="space-y-4">
          {items.map((item, i) => (
            <li key={i}>
              <FadeUp y={22} delay={Math.min(i, 4) * 0.07} className="flex items-start gap-5 md:gap-6 rounded-[28px] bg-cream/[0.06] ring-1 ring-cream/10 p-5 md:p-7">
                <m.span
                  aria-hidden
                  className="font-garamond font-bold text-4xl md:text-5xl leading-none text-gold w-12 md:w-14 shrink-0 text-center pt-1"
                  initial={reduce ? false : { clipPath: 'inset(0 0 0 100%)' }}
                  whileInView={{ clipPath: 'inset(0 0 0 0%)' }}
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  transition={{ ...enterSpring, delay: 0.15 + Math.min(i, 4) * 0.07 }}
                >
                  {String(i + 1).padStart(2, '0')}
                </m.span>
                <p className="text-lg md:text-xl leading-relaxed text-cream/90 text-pretty">{item}</p>
              </FadeUp>
            </li>
          ))}
        </ol>

        <FadeUp y={14} className="lg:hidden text-center">
          <div data-hide-dock className="inline-block">
            <GiftCta tone="gold" />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
