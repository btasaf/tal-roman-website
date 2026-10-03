'use client'

import { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { LogoMarquee } from '../media-logos'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { GRADE, plainTitle } from './course-data'
import type { CourseView } from './course-view'
import CourseCta from './CourseCta'
import { AccentTitle, Amount, Kicker } from './ui'

const rise = (reduce: boolean, delay: number, y = 18) => ({
  initial: reduce ? (false as const) : { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// Hero: the offer in one calm screen. Copy on the right (title, promise, price, the purchase button),
// the course photo in an arch on the left (under the copy on phones).
// On load: the title wipes up, the copy follows, the arch opens like a curtain rising.
// On scroll: the copy lifts away a little faster than the photo, which settles slightly.
export default function CourseHero({ course }: { course: CourseView }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * -80))
  const textOpacity = useTransform(() => (reduce ? 1 : Math.max(0, 1 - scrollYProgress.get() * 1.5)))
  const photoY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * 60))
  const photoScale = useTransform(() => (reduce ? 1 : 1 + scrollYProgress.get() * 0.08))

  const longTitle = plainTitle(course.title).length > 24
  const next = course.learn.length ? { href: '#learn', label: 'מה בתוכנית?' } : { href: '#offer', label: 'מחיר ופרטים' }

  return (
    <section ref={ref} className="relative lg:min-h-svh bg-cream overflow-hidden flex flex-col">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div className="relative flex-1 w-full max-w-6xl mx-auto px-5 md:px-8 pt-24 md:pt-28 pb-10 grid grid-cols-1 md:grid-cols-[1.15fr_0.85fr] gap-12 md:gap-10 lg:gap-16 items-center">
        {/* Copy */}
        <m.div className="text-right min-w-0" style={{ y: textY, opacity: textOpacity }}>
          <m.nav {...rise(reduce, 0.02, 8)} aria-label="פירורי לחם" className="flex flex-wrap items-center gap-3">
            <Link
              href="/v2/courses"
              className="group inline-flex items-center gap-1.5 py-2.5 -my-2.5 text-sm font-bold text-[#3d2814]/75 hover:text-brand-dark rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 px-1"
            >
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
              כל הקורסים
            </Link>
            {course.typeTag && <Kicker>{course.typeTag}</Kicker>}
          </m.nav>

          <m.h1
            className={`mt-6 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-balance ${
              longTitle ? 'text-[2.6rem] leading-[1.04] sm:text-6xl lg:text-[3.6rem] xl:text-[4.2rem]' : 'text-[3.1rem] leading-[1.02] sm:text-6xl lg:text-[5.2rem]'
            }`}
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 30 }}
            animate={{ clipPath: 'inset(-10% -4% -14% -4%)', y: 0 }}
            transition={{ ...enterSpring, delay: 0.12 }}
          >
            <AccentTitle title={course.title} />
          </m.h1>

          {course.lines.length > 0 && (
            <m.div {...rise(reduce, 0.24)} className="mt-6 space-y-2 max-w-xl">
              {course.lines.map((l, i) => (
                <p key={i} className={`text-pretty ${i === 0 ? 'text-xl md:text-2xl font-bold text-[#3d2814] leading-snug' : 'text-lg text-[#3d2814]/80 leading-relaxed'}`}>
                  {l}
                </p>
              ))}
            </m.div>
          )}

          {course.chips.length > 0 && (
            <m.ul {...rise(reduce, 0.3)} className="mt-6 flex flex-wrap gap-2 max-w-xl">
              {course.chips.map((c) => (
                <li key={c} className="inline-flex items-center gap-2 rounded-full bg-white/75 ring-1 ring-brand/15 px-3.5 py-1.5 text-sm font-bold text-[#3d2814]">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand" />
                  {c}
                </li>
              ))}
            </m.ul>
          )}

          <m.div {...rise(reduce, 0.4)} data-hide-dock className="mt-9 flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-x-6 gap-y-5">
            {course.lead.now && (
              <p className="flex items-baseline gap-2.5 text-[#2d1a0e] shrink-0">
                {course.lead.from && <span className="text-base font-bold text-[#3d2814]/75">החל מ־</span>}
                <Amount value={course.lead.now} className="font-sans font-black text-5xl leading-none tracking-[-0.02em]" />
                {course.lead.was && (
                  <span className="text-base font-bold text-[#5e5955]">
                    במקום{' '}
                    <s className="decoration-brand-dark decoration-2">
                      <Amount value={course.lead.was} />
                    </s>
                  </span>
                )}
              </p>
            )}
            <CourseCta href={course.ctaUrl} label={course.ctaLabel} slug={course.slug} placement="hero" className="w-full sm:w-auto sm:max-w-[36rem]" />
          </m.div>
          <m.div {...rise(reduce, 0.48)} className="mt-4">
            <a
              href={next.href}
              className="inline-block font-bold text-brand-dark underline-offset-[6px] decoration-brand/40 decoration-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 rounded-full px-1 py-2"
            >
              {next.label}
            </a>
          </m.div>
        </m.div>

        {/* Photo in an arch */}
        {course.image && (
          <m.div className="relative mx-auto w-full max-w-[400px] md:max-w-none" style={{ y: photoY }}>
            <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.35),transparent)]" />
            <m.div
              className="relative aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-t-[999px] rounded-b-[36px] bg-[#3d2814] shadow-[0_40px_90px_-40px_rgba(61,40,20,0.55)] ring-1 ring-white/60"
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
                    src={course.image.src}
                    alt={plainTitle(course.title)}
                    fill
                    priority
                    sizes="(min-width: 1024px) 440px, (min-width: 768px) 40vw, 90vw"
                    className={`object-cover ${GRADE}`}
                    style={{ objectPosition: course.image.focus }}
                  />
                </m.div>
              </m.div>
              <div aria-hidden className="absolute inset-0 bg-[#c97870]/12 mix-blend-multiply" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#2d1a0e]/40 to-transparent" />
            </m.div>
          </m.div>
        )}
      </div>

      {/* Credibility strip */}
      <m.div {...rise(reduce, 0.8, 10)} className="relative w-[440px] max-w-[84vw] mx-auto text-center pt-8 pb-10 md:pb-12">
        <p className="text-sm text-[#3d2814]/75 mb-2">כפי שהופיעה ב</p>
        <LogoMarquee tone="dark" logoClassName="h-7 md:h-8" duration={26} />
      </m.div>
    </section>
  )
}
