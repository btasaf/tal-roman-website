'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { FadeUp, SectionTitle } from '../coaching/motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon } from './form-ui'
import { EXPLORE, STEPS } from './contact-content'

const drawSpring = { type: 'spring', bounce: 0, visualDuration: 1.4 } as const

// What happens after writing (three calm steps on a warm-brown band, a thread drawing between them),
// then a few doors into the rest of the site.
export default function ContactSteps() {
  const reduce = useHydratedReducedMotion()

  return (
    <>
      <section className="relative bg-[#3d2814] text-cream px-5 md:px-8 py-20 md:py-28 overflow-hidden rounded-[40px] md:rounded-[56px] mx-2 md:mx-4">
        <GrainOverlay opacity={0.18} blend="soft-light" />
        <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] max-w-[160vw] h-[500px] rounded-full bg-[radial-gradient(closest-side,rgba(201,120,112,0.28),transparent)]" />

        <div className="relative max-w-5xl mx-auto">
          <SectionTitle kicker="מה קורה אחרי" title="מהרגע שכתבתם" accent="שכתבתם" tone="dark" />

          <ol className="relative mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* The thread (desktop: across, phones: down the side) */}
            <m.span
              aria-hidden
              className="hidden md:block absolute top-7 right-[16.66%] left-[16.66%] h-px bg-gradient-to-l from-gold/70 via-gold/40 to-gold/70 origin-right"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ ...drawSpring, delay: 0.2 }}
            />
            <m.span
              aria-hidden
              className="md:hidden absolute top-7 bottom-7 right-7 w-px bg-gradient-to-b from-gold/70 via-gold/40 to-gold/70 origin-top"
              initial={reduce ? false : { scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true, margin: '0px 0px -20% 0px' }}
              transition={{ ...drawSpring, delay: 0.2 }}
            />
            {STEPS.map((s, i) => (
              <li key={s.title} className="relative">
                <FadeUp y={20} delay={0.15 + i * 0.18} className="flex md:flex-col items-start md:items-center gap-5 md:gap-6 text-right md:text-center">
                  <span className="relative w-14 h-14 rounded-full bg-[#3d2814] ring-1 ring-gold/50 flex items-center justify-center shrink-0 font-garamond font-bold text-2xl text-gold">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-sans font-black tracking-[-0.01em] text-2xl md:text-[1.7rem] text-cream">{s.title}</span>
                    <span className="mt-2 block text-lg text-cream/75 leading-relaxed text-pretty">{s.body}</span>
                  </span>
                </FadeUp>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative px-5 md:px-8 pt-20 md:pt-28 pb-24 md:pb-32">
        <div className="relative max-w-6xl mx-auto">
          <SectionTitle kicker="אולי חיפשת" title="עוד מקומות לפגוש אותי" accent="לפגוש אותי" />
          <div className="mt-12 md:mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {EXPLORE.map((e, i) => (
              <FadeUp key={e.href} y={24} delay={i * 0.08} className="flex">
                <Link
                  href={e.href}
                  className="group flex w-full flex-col justify-between gap-8 rounded-[28px] bg-white/70 hover:bg-white ring-1 ring-brand/10 hover:ring-brand/25 p-6 md:p-7 text-right transition-[background-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(168,90,84,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  <span>
                    <span className="block font-sans font-black tracking-[-0.01em] text-2xl text-[#2d1a0e]">{e.title}</span>
                    <span className="mt-2 block text-[#5a4538] leading-relaxed">{e.body}</span>
                  </span>
                  <span className="inline-flex w-11 h-11 rounded-full bg-brand/10 text-brand-dark items-center justify-center transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                  </span>
                </Link>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
