'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { CourseView } from './course-view'
import CourseCta from './CourseCta'
import { inView } from './motion'
import { Icon, PriceRow, type IconName } from './ui'

// Price and details: one dark, warm card on the cream. It grows into place as it scrolls up (scale + a soft
// rise, scroll-linked); inside, the price lands first, then location and guarantee slide in one by one.
export default function CourseOffer({ course }: { course: CourseView }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 35%'] })
  const scale = useTransform(() => (reduce ? 1 : 0.92 + 0.08 * scrollYProgress.get()))
  const y = useTransform(() => (reduce ? 0 : (1 - scrollYProgress.get()) * 60))

  const { priceLines, location, cancellationPolicy, ctaText } = course
  if (!priceLines.length && !location && !ctaText) return null

  const details: { icon: IconName; text: string }[] = []
  if (location) details.push({ icon: 'pin', text: location })
  if (cancellationPolicy) details.push({ icon: 'shield', text: cancellationPolicy })

  return (
    <section id="offer" className="relative px-4 md:px-8 py-12 md:py-20 scroll-mt-4">
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

        <div className="relative grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-10 lg:gap-16 px-6 py-12 sm:px-12 md:px-16 md:py-16 lg:py-20 items-center">
          <div className="text-right">
            <h2 className="font-sans font-black tracking-[-0.01em] text-4xl md:text-5xl lg:text-6xl leading-[1.1]">
              מחיר <span className="font-garamond font-bold text-gold">ופרטים</span>
            </h2>
            {priceLines.length > 0 && (
              <div className="mt-8 space-y-7">
                {priceLines.map((line, i) => (
                  <m.div
                    key={i}
                    initial={reduce ? false : { opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={inView}
                    transition={{ ...enterSpring, delay: 0.1 + i * 0.08 }}
                  >
                    <PriceRow line={line} tone="dark" size={priceLines.length > 1 ? 'md' : 'lg'} />
                  </m.div>
                ))}
              </div>
            )}
            {ctaText && <p className="mt-8 text-xl md:text-2xl font-bold text-cream/90 leading-snug text-pretty">{ctaText}</p>}
          </div>

          <div className="text-right">
            {details.length > 0 && (
              <ul className="space-y-3">
                {details.map((d, i) => (
                  <m.li
                    key={d.icon}
                    className="flex items-start gap-4 rounded-2xl bg-cream/[0.06] ring-1 ring-cream/10 px-5 py-4"
                    initial={reduce ? false : { opacity: 0, x: -24 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={inView}
                    transition={{ ...enterSpring, delay: 0.15 + i * 0.1 }}
                  >
                    <span className="shrink-0 w-11 h-11 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                      <Icon name={d.icon} className="w-6 h-6" />
                    </span>
                    <DetailText text={d.text} />
                  </m.li>
                ))}
              </ul>
            )}
            <div className="mt-8">
              <CourseCta href={course.ctaUrl} label={course.ctaLabel} slug={course.slug} placement="offer" tone="gold" className="w-full" />
            </div>
          </div>
        </div>
      </m.div>
    </section>
  )
}

// A detail from Sanity: a short first line ending in "!" (e.g. "100% אחריות!") reads as its title
function DetailText({ text }: { text: string }) {
  const nl = text.search(/\n|(?<=!)\s/)
  const head = nl > 0 ? text.slice(0, nl).trim() : ''
  const isTitle = head.length > 0 && head.length <= 24 && head.endsWith('!')
  const rest = isTitle ? text.slice(nl).trim() : text
  return (
    <div className="pt-1.5 min-w-0">
      {isTitle && <p className="font-black text-lg md:text-xl text-gold leading-snug">{head}</p>}
      <p className={`${isTitle ? 'mt-1.5' : ''} text-base md:text-lg text-cream/85 leading-relaxed whitespace-pre-line text-pretty`}>{rest.replace(/\n{2,}/g, '\n')}</p>
    </div>
  )
}
