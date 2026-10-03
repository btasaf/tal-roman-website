'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { m } from 'framer-motion'
import { notFoundSignal } from '@/lib/not-found-signal'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { Kicker } from '../coaching/ui'
import { ArrowIcon } from '../contact-page/form-ui'
import { halftone } from '../about/about-content'

// Same as not-found.tsx's metadata title (a client module can't export plain values to a server one)
const TITLE = 'הדף לא נמצא — טל רומן'

const DOORS = [
  { href: '/v2', title: 'דף הבית', body: 'להתחיל מההתחלה, בנחת' },
  { href: '/v2/quiz', title: 'השאלון', body: 'כמה שאלות קצרות, וכיוון ברור להמשך' },
  { href: '/v2/articles', title: 'מאמרים', body: 'תשובות לשאלות שאנשים שואלים בשקט' },
  { href: '/v2/contact', title: 'צרו קשר', body: 'חיפשתם משהו מסוים? כתבו לי ואעזור למצוא' },
] as const

const rise = (reduce: boolean, delay: number, y = 18) => ({
  initial: reduce ? (false as const) : { opacity: 0, y },
  animate: { opacity: 1, y: 0 },
  transition: { ...enterSpring, delay },
})

// v2 404: a giant halftone "404", one warm line, and four doors back into the site
export default function NotFoundV2() {
  const reduce = useHydratedReducedMotion()

  // Same analytics signal as the root not-found page (usePageView reports the view as a 404).
  // notFound() thrown by a page makes Next send an error shell and render this on the client, where the head
  // falls back to the root default title; restore the one from not-found.tsx's metadata (the HTML already has it).
  useEffect(() => {
    notFoundSignal.set(window.location.href)
    document.title = TITLE
    return () => notFoundSignal.clear()
  }, [])

  return (
    <div className="relative overflow-x-clip bg-cream">
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
          <AuroraBackground palette="cream" />
          <GrainOverlay />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 md:px-8 pt-24 md:pt-28 pb-20 md:pb-28 text-center">
          <m.p
            aria-hidden
            dir="ltr"
            className="font-sans font-black leading-[0.85] tracking-[-0.04em] select-none text-transparent bg-clip-text [-webkit-background-clip:text] text-[44vw] sm:text-[36vw] lg:text-[20rem]"
            style={halftone('rgba(168,90,84,0.55)', 'rgba(168,90,84,0.2)', 'rgba(201,120,112,0.05)', 4)}
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ ...enterSpring, visualDuration: 1.1 }}
          >
            404
          </m.p>

          <m.div {...rise(reduce, 0.15, 10)} className="-mt-2 md:-mt-6">
            <Kicker>הדף לא נמצא</Kicker>
          </m.div>
          <m.h1
            {...rise(reduce, 0.22, 24)}
            className="mt-5 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl text-balance"
          >
            נראה שהגעתם <span className="font-garamond font-bold text-brand">למקום אחר</span>
          </m.h1>
          <m.p {...rise(reduce, 0.32)} className="mt-6 mx-auto max-w-xl text-lg md:text-xl text-[#5a4538] leading-relaxed text-pretty">
            הדף שחיפשתם לא כאן. קורה לכולנו לחפש במקום הלא נכון, ואין בזה שום דבר מביך.
            הנה כמה מקומות טובים להמשיך מהם:
          </m.p>

          <ul className="mt-12 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 text-right">
            {DOORS.map((d, i) => (
              <m.li key={d.href} {...rise(reduce, 0.42 + i * 0.06, 22)} className="flex">
                <Link
                  href={d.href}
                  data-track="not_found_suggestion_click"
                  data-track-target={d.href.replace(/^\/v2/, '') || '/'}
                  data-track-position={i + 1}
                  className="group flex w-full items-center sm:items-stretch sm:flex-col justify-between gap-5 sm:gap-8 rounded-[28px] bg-white/70 hover:bg-white ring-1 ring-brand/10 hover:ring-brand/25 p-5 sm:p-6 md:p-7 transition-[background-color,box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-28px_rgba(168,90,84,0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  <span>
                    <span className="block font-sans font-black tracking-[-0.01em] text-2xl text-[#2d1a0e]">{d.title}</span>
                    <span className="mt-2 block text-[#5a4538] leading-relaxed">{d.body}</span>
                  </span>
                  <span className="inline-flex shrink-0 w-11 h-11 rounded-full bg-brand/10 text-brand-dark items-center justify-center transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-0.5" />
                  </span>
                </Link>
              </m.li>
            ))}
          </ul>
        </div>
      </section>
      {/* Cream continues under the footer's rounded shoulders */}
      <div aria-hidden className="absolute top-full inset-x-0 h-12 bg-cream pointer-events-none" />
    </div>
  )
}
