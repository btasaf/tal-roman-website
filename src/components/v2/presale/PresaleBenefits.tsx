'use client'

import { m } from 'framer-motion'
import type { PresalePage } from '@/lib/types'
import { GrainOverlay } from '../backgrounds'
import { SectionTitle, enterSpring } from '../motion-kit'
import { inView } from './motion'
import { Icon } from './ui'

// What's inside the full course: the benefits from Sanity as four quiet cards. They rise in a gentle
// stagger, each icon disc blooming a beat after its card (scale + opacity).
export default function PresaleBenefits({ benefits, courseTitle }: { benefits: NonNullable<PresalePage['benefits']>; courseTitle?: string }) {
  const list = benefits.filter((b) => b.title)
  if (!list.length) return null

  return (
    <section className="relative bg-cream px-5 md:px-8 pt-24 md:pt-32 pb-20 md:pb-28">
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto">
        <SectionTitle kicker={courseTitle} title="מה מחכה לך בקורס המלא" accent="בקורס המלא" />

        <ul className={`mt-14 md:mt-20 grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 ${list.length >= 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {list.map((b, i) => (
            <m.li
              key={i}
              className="relative overflow-hidden rounded-[28px] bg-white/70 ring-1 ring-[#3d2814]/[0.06] px-4 py-6 sm:px-6 sm:py-8 md:px-7 md:py-9 text-right shadow-[0_30px_60px_-40px_rgba(61,40,20,0.45)]"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ ...enterSpring, delay: i * 0.09 }}
            >
              <span aria-hidden className="absolute -top-16 -left-16 w-40 h-40 rounded-full bg-[radial-gradient(circle,rgba(230,192,96,0.22)_0%,transparent_70%)]" />
              <m.span
                className="relative flex w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand/10 text-brand-dark items-center justify-center"
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={inView}
                transition={{ ...enterSpring, visualDuration: 0.6, delay: 0.2 + i * 0.09 }}
              >
                <Icon name={b.icon} className="w-7 h-7" />
              </m.span>
              <h3 className="relative mt-5 sm:mt-6 font-sans font-black text-xl sm:text-2xl md:text-[1.7rem] leading-tight text-[#2d1a0e]">{b.title}</h3>
              {b.description && <p className="relative mt-2 text-[0.95rem] sm:text-base md:text-lg text-[#5e5955] leading-relaxed whitespace-pre-line">{b.description}</p>}
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
