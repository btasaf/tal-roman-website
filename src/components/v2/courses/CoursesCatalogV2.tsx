'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AnimatePresence, LayoutGroup, LazyMotion, domMax, m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { LogoMarquee } from '../media-logos'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { CATEGORY_LABELS, GRADE, TYPE_TAGS, splitShortDescription } from './course-data'
import type { CourseImage } from './course-images'
import { FadeUp, inView } from './motion'
import { AccentTitle, Amount, ArrowIcon, Kicker } from './ui'

export type CatalogItem = {
  slug: string
  title: string
  type?: string
  shortDescription?: string
  price: { now?: string; was?: string; from: boolean }
  image: CourseImage
}

const GRAY = 'linear-gradient(to bottom, #5e5955, #48443f)'
const ALL = 'all'

// v2 course catalogue: a calm hero, then an editorial list (one course per row, alternating sides),
// filterable by the same categories the live page groups by, then a "not sure?" close.
export default function CoursesCatalogV2({ courses, initialType }: { courses: CatalogItem[]; initialType?: string }) {
  return (
    <div className="relative overflow-x-clip bg-cream">
      <CatalogHero courses={courses} />
      <CatalogList courses={courses} initialType={initialType} />
      <CatalogClose />
      {/* Cream continues under the footer's rounded shoulders */}
      <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none" />
    </div>
  )
}

const rise = (reduce: boolean, delay: number, y = 18) => ({
  initial: reduce ? (false as const) : { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// ─── Hero ────────────────────────────────────────────────────────────────────
// Big centred title; on wide screens two course photos float at the edges like prints pinned to a wall,
// drifting apart slightly as you scroll (transform only).
function CatalogHero({ courses }: { courses: CatalogItem[] }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const leftY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * 140))
  const rightY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * -80))
  const textY = useTransform(() => (reduce ? 0 : scrollYProgress.get() * -60))
  const textOpacity = useTransform(() => (reduce ? 1 : Math.max(0, 1 - scrollYProgress.get() * 1.4)))

  const prints = courses.filter((c) => c.image).slice(0, 2)

  return (
    <section ref={ref} className="relative overflow-hidden pt-28 md:pt-36 pb-12 md:pb-16">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_60%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      {prints[0]?.image && (
        <m.div aria-hidden className="hidden lg:block absolute top-[22%] left-[4%] xl:left-[7%] w-[170px] xl:w-[200px]" style={{ y: leftY }}>
          <m.div
            className="relative aspect-[4/5] rounded-[28px] overflow-hidden -rotate-6 shadow-[0_30px_60px_-28px_rgba(61,40,20,0.6)] ring-4 ring-white/70"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...enterSpring, visualDuration: 1.1, delay: 0.35 }}
          >
            <Image src={prints[0].image.src} alt="" fill loading="eager" sizes="200px" className={`object-cover ${GRADE}`} style={{ objectPosition: prints[0].image.focus }} />
            <div className="absolute inset-0 bg-[#c97870]/15 mix-blend-multiply" />
          </m.div>
        </m.div>
      )}
      {prints[1]?.image && (
        <m.div aria-hidden className="hidden lg:block absolute top-[40%] right-[4%] xl:right-[7%] w-[150px] xl:w-[175px]" style={{ y: rightY }}>
          <m.div
            className="relative aspect-[4/5] rounded-t-[999px] rounded-b-[28px] overflow-hidden rotate-[5deg] shadow-[0_30px_60px_-28px_rgba(61,40,20,0.6)] ring-4 ring-white/70"
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...enterSpring, visualDuration: 1.1, delay: 0.5 }}
          >
            <Image src={prints[1].image.src} alt="" fill loading="eager" sizes="180px" className={`object-cover ${GRADE}`} style={{ objectPosition: prints[1].image.focus }} />
            <div className="absolute inset-0 bg-[#c97870]/15 mix-blend-multiply" />
          </m.div>
        </m.div>
      )}

      <m.div className="relative max-w-3xl mx-auto px-5 text-center" style={{ y: textY, opacity: textOpacity }}>
        <m.div {...rise(reduce, 0.05, 10)}>
          <Kicker>קורסים וסדנאות</Kicker>
        </m.div>
        <m.h1
          className="mt-6 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[3.6rem] leading-[1] sm:text-7xl lg:text-[7rem]"
          initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 30 }}
          animate={{ clipPath: 'inset(-10% -4% -14% -4%)', y: 0 }}
          transition={{ ...enterSpring, delay: 0.12 }}
        >
          הקורסים <span className="font-garamond font-bold text-brand">שלי</span>
        </m.h1>
        <m.p {...rise(reduce, 0.26)} className="mt-7 text-xl md:text-2xl text-[#3d2814]/85 leading-relaxed max-w-xl mx-auto text-pretty">
          כל תוכנית נבנתה מתוך ניסיון אמיתי עם אנשים אמיתיים. בחרו מה מדבר אליכם.
        </m.p>
      </m.div>

      <m.div {...rise(reduce, 0.5, 10)} className="relative w-[440px] max-w-[84vw] mx-auto text-center mt-14 md:mt-20">
        <p className="text-sm text-[#3d2814]/75 mb-2">כפי שהופיעה ב</p>
        <LogoMarquee tone="dark" logoClassName="h-7 md:h-8" duration={26} />
      </m.div>
    </section>
  )
}

// ─── List ────────────────────────────────────────────────────────────────────

function CatalogList({ courses, initialType }: { courses: CatalogItem[]; initialType?: string }) {
  const reduce = useHydratedReducedMotion()
  // A link like /v2/courses?type=workshop opens on that tab (if such courses exist)
  const [filter, setFilter] = useState(() =>
    initialType && CATEGORY_LABELS[initialType] && courses.some((c) => c.type === initialType) ? initialType : ALL,
  )

  const categories = Object.keys(CATEGORY_LABELS).filter((k) => courses.some((c) => c.type === k))
  const hasOther = courses.some((c) => !c.type || !CATEGORY_LABELS[c.type])
  const tabs = [
    { key: ALL, label: 'הכל', count: courses.length },
    ...categories.map((k) => ({ key: k, label: CATEGORY_LABELS[k], count: courses.filter((c) => c.type === k).length })),
    ...(hasOther ? [{ key: 'other', label: 'עוד', count: courses.filter((c) => !c.type || !CATEGORY_LABELS[c.type]).length }] : []),
  ]
  const shown = filter === ALL ? courses : courses.filter((c) => (filter === 'other' ? !c.type || !CATEGORY_LABELS[c.type] : c.type === filter))

  if (!courses.length) {
    return <p className="relative text-center text-[#3d2814]/75 text-lg py-24">קורסים בקרוב...</p>
  }

  return (
    <section aria-label="כל הקורסים" className="relative px-5 md:px-8 pt-4 pb-20 md:pb-28">
      <GrainOverlay />

      {tabs.length > 2 && (
        <FadeUp y={14} className="relative flex justify-center mb-14 md:mb-20">
          <LazyMotion features={domMax}>
            <LayoutGroup id="course-filter">
              <div role="group" aria-label="סינון לפי סוג" className="inline-flex flex-wrap justify-center gap-0.5 sm:gap-1 rounded-full bg-white/60 p-1 sm:p-1.5 ring-1 ring-brand/10 shadow-[0_10px_30px_-20px_rgba(168,90,84,0.5)] backdrop-blur-sm">
                {tabs.map((t) => {
                  const active = filter === t.key
                  return (
                    <button
                      key={t.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setFilter(t.key)}
                      data-track="course_filter_click"
                      data-track-type={t.key}
                      className={`relative rounded-full px-3 sm:px-5 py-2.5 text-sm sm:text-base font-bold transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50 ${active ? 'text-white' : 'text-[#3d2814] hover:text-brand-dark'}`}
                    >
                      {active && (
                        <m.span
                          layoutId="course-filter-pill"
                          className="absolute inset-0 rounded-full bg-brand shadow-lg shadow-brand/30"
                          transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.4 }}
                        />
                      )}
                      <span className="relative">
                        {t.label}
                        <span className={`ms-1.5 text-xs tabular-nums ${active ? 'text-white/80' : 'text-[#3d2814]/60'}`}>{t.count}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </LayoutGroup>
          </LazyMotion>
        </FadeUp>
      )}

      <AnimatePresence mode="wait" initial={false}>
        <m.ol
          key={filter}
          className="relative max-w-6xl mx-auto space-y-24 md:space-y-36"
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: reduce ? 0 : -12, transition: { duration: reduce ? 0 : 0.2 } }}
          transition={enterSpring}
        >
          {shown.map((c, i) => (
            <CourseRow key={c.slug} course={c} index={courses.indexOf(c)} flip={i % 2 === 1} />
          ))}
        </m.ol>
      </AnimatePresence>
    </section>
  )
}

// One course: a framed photo that opens like a window as it enters (clip-path), with a slow parallax inside it;
// beside it the index, the title, the promise and the price. Sides alternate on wide screens.
function CourseRow({ course, index, flip }: { course: CatalogItem; index: number; flip: boolean }) {
  const reduce = useHydratedReducedMotion()
  const frameRef = useRef<HTMLAnchorElement>(null)
  const { scrollYProgress } = useScroll({ target: frameRef, offset: ['start end', 'end start'] })
  const imgY = useTransform(() => (reduce ? '0%' : `${(scrollYProgress.get() - 0.5) * -12}%`))

  const href = `/v2/courses/${course.slug}`
  const tag = course.type ? TYPE_TAGS[course.type] ?? course.type : null
  const { lines, chips } = splitShortDescription(course.shortDescription)
  const num = String(index + 1).padStart(2, '0')
  const headingId = `course-${course.slug}`

  return (
    <li data-track="course_card_click" data-track-slug={course.slug} data-track-position={index + 1} className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">
      {/* Photo */}
      <div className={`relative md:col-span-5 ${flip ? 'md:order-2' : ''}`}>
        <m.div
          initial={reduce ? false : { clipPath: 'inset(9% 7% 9% 7% round 44px)', opacity: 0.6 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 36px)', opacity: 1 }}
          viewport={inView}
          transition={{ type: 'spring', bounce: 0, visualDuration: 1.1 }}
        >
          <Link
            ref={frameRef}
            href={href}
            tabIndex={-1}
            aria-hidden
            className="group relative block aspect-[4/3] md:aspect-[4/5] rounded-[36px] overflow-hidden bg-[#3d2814] shadow-[0_40px_80px_-40px_rgba(61,40,20,0.6)]"
          >
            {course.image ? (
              <m.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: imgY }}>
                <div className="absolute inset-0 scale-[1.04] transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100">
                  <Image
                    src={course.image.src}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 480px, (min-width: 768px) 40vw, 92vw"
                    priority={index === 0}
                    className={`object-cover ${GRADE} transition-[filter] duration-700 group-hover:[filter:none]`}
                    style={{ objectPosition: course.image.focus }}
                  />
                </div>
              </m.div>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(230,192,96,0.45),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(201,120,112,0.5),transparent_60%)]" />
            )}
            {/* One warm tone over every photo, deeper toward the bottom */}
            <div className="absolute inset-0 bg-[#c97870]/12 mix-blend-multiply transition-opacity duration-700 group-hover:opacity-0" />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2d1a0e]/50 to-transparent" />
            {tag && (
              <span className="absolute bottom-5 right-5 rounded-full bg-cream/90 backdrop-blur px-3.5 py-1.5 text-sm font-bold text-[#2d1a0e]">{tag}</span>
            )}
          </Link>
        </m.div>
      </div>

      {/* Copy */}
      <div className={`relative md:col-span-7 text-right ${flip ? 'md:order-1' : ''}`}>
        <FadeUp y={18}>
          <span aria-hidden className="block font-garamond font-bold text-6xl md:text-7xl leading-none text-transparent [-webkit-text-stroke:1.5px_#c97870] tabular-nums">
            {num}
          </span>
        </FadeUp>
        <FadeUp y={24} delay={0.06}>
          <h2 id={headingId} className="mt-4 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[2.1rem] leading-[1.08] sm:text-5xl lg:text-[3.4rem] text-balance">
            <Link href={href} className="rounded-lg hover:text-[#3d2814] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50">
              <AccentTitle title={course.title} />
            </Link>
          </h2>
        </FadeUp>
        {lines.length > 0 && (
          <FadeUp y={18} delay={0.12}>
            <div className="mt-5 space-y-1.5 max-w-xl">
              {lines.map((l, i) => (
                <p key={i} className={`text-pretty leading-relaxed ${i === 0 ? 'text-lg md:text-xl text-[#3d2814]' : 'text-base md:text-lg text-[#3d2814]/75'}`}>
                  {l}
                </p>
              ))}
            </div>
          </FadeUp>
        )}
        {chips.length > 0 && (
          <FadeUp y={14} delay={0.16}>
            <ul className="mt-5 flex flex-wrap gap-2 max-w-xl">
              {chips.map((c) => (
                <li key={c} className="rounded-full bg-white/70 ring-1 ring-brand/15 px-3.5 py-1.5 text-sm font-bold text-[#3d2814]">
                  {c}
                </li>
              ))}
            </ul>
          </FadeUp>
        )}
        <FadeUp y={14} delay={0.2}>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-5">
            {course.price.now && (
              <p className="flex items-baseline gap-2.5 text-[#2d1a0e]">
                {course.price.from && <span className="text-base font-bold text-[#3d2814]/75">החל מ־</span>}
                <Amount value={course.price.now} className="font-sans font-black text-4xl md:text-[2.75rem] leading-none tracking-[-0.02em]" />
                {course.price.was && (
                  <span className="text-base font-bold text-[#5e5955]">
                    במקום{' '}
                    <s className="decoration-brand-dark decoration-2">
                      <Amount value={course.price.was} />
                    </s>
                  </span>
                )}
              </p>
            )}
            <Link
              href={href}
              className="group inline-flex items-center gap-3 rounded-full bg-[#2d1a0e] text-cream font-bold text-base md:text-lg px-7 py-3.5 shadow-[0_18px_40px_-18px_rgba(45,26,14,0.8)] transition-[background-color,scale] duration-300 hover:bg-brand-dark hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
            >
              פרטים נוספים
              <span className="sr-only"> על {course.title.replace(/\*/g, '')}</span>
              <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </div>
        </FadeUp>
      </div>
    </li>
  )
}

// ─── Close ───────────────────────────────────────────────────────────────────
// For whoever hasn't found their match: write to me and I'll help choose (main), or the short quiz (secondary). Warm gray panel that opens
// from an inset rounded card to nearly full width as it scrolls in (clip-path only).
function CatalogClose() {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const clipPath = useTransform(() => {
    if (reduce) return 'inset(0px 0px 0px 0px round 40px)'
    const p = Math.min(1, Math.max(0, scrollYProgress.get()))
    const e = p * p * (3 - 2 * p)
    const side = (1 - e) * 6
    return `inset(0px ${side.toFixed(2)}vw 0px ${side.toFixed(2)}vw round ${(40 - e * 8).toFixed(1)}px)`
  })

  return (
    <section ref={ref} className="relative px-4 md:px-8 pb-24 md:pb-32">
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto">
        <m.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: GRAY, clipPath }}>
          <AuroraBackground palette="gray" />
          <GrainOverlay opacity={0.2} blend="soft-light" />
        </m.div>
        <div className="relative px-6 py-16 sm:px-12 md:py-20 text-center text-cream">
          <FadeUp y={18}>
            <h2 className="font-sans font-black tracking-[-0.01em] text-4xl md:text-6xl leading-[1.1] text-balance">
              לא בטוחים מה <span className="font-garamond font-bold text-gold">מתאים לכם?</span>
            </h2>
          </FadeUp>
          <FadeUp y={14} delay={0.08}>
            <ul className="mt-7 flex flex-wrap justify-center gap-x-6 gap-y-2 text-base md:text-lg font-bold text-cream/80">
              {['כתבו לי כמה מילים', 'אעזור לבחור', 'בלי התחייבות'].map((t) => (
                <li key={t} className="inline-flex items-center gap-2">
                  <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-gold" />
                  {t}
                </li>
              ))}
            </ul>
          </FadeUp>
          <FadeUp y={14} delay={0.16}>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                data-hide-dock
                data-track="courses_help_click"
                data-track-target="contact"
                href="/v2/contact"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-gold text-[#2d1a0e] font-bold text-lg px-8 py-4 shadow-xl shadow-black/25 transition-[background-color,scale] duration-300 hover:bg-cream hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40 w-full sm:w-auto"
              >
                כתבו לי ואעזור לבחור
                <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
              </Link>
              <Link
                href="/v2/quiz"
                data-track="quiz_cta_click"
                data-track-placement="courses_closing"
                className="inline-flex flex-col items-center justify-center rounded-full ring-2 ring-cream/40 text-cream font-bold px-8 py-2.5 leading-tight transition-colors hover:bg-cream hover:text-[#2d1a0e] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-cream/60 w-full sm:w-auto"
              >
                <span className="text-lg">מה מתאים לי?</span>
                <span className="text-sm font-medium opacity-80">3 שאלות קצרות והדרכה במתנה</span>
              </Link>
            </div>
            <p className="mt-6 text-sm text-cream/70">
              מחפשים ליווי צמוד?{' '}
              <Link href="/v2/personal-coaching" data-track="courses_help_click" data-track-target="coaching" className="font-bold text-cream underline decoration-gold/60 underline-offset-4 hover:decoration-gold transition-colors">
                ליווי אישי
              </Link>
            </p>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
