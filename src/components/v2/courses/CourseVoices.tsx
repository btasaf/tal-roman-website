'use client'

import Link from 'next/link'
import type { Testimonial } from '@/lib/types'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { FadeUp, SectionTitle } from './motion'

// Testimonials written about this course. Many: one slow, transform-only marquee row (the shared .marquee
// CSS loop: pauses on hover/focus, swipeable, static and scrollable for reduced motion). A few: a calm grid.
export default function CourseVoices({ testimonials }: { testimonials: Testimonial[] }) {
  const list = testimonials.filter((t) => t.body?.trim())
  if (!list.length) return null
  const marquee = list.length > 3

  return (
    <section className="relative pt-20 md:pt-28 pb-16 md:pb-20 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <AuroraBackground palette="blush" />
      </div>
      <GrainOverlay />

      <div className="relative px-5 md:px-8">
        <SectionTitle kicker="מהלב שלהם" title="כמה מילים שכתבתם לי" accent="שכתבתם לי" />
      </div>

      {marquee ? (
        <FadeUp y={30} delay={0.1} className="relative mt-14 md:mt-16">
          <div
            data-swipe
            className="marquee overflow-hidden py-4 [mask-image:linear-gradient(to_right,transparent,black_7%,black_93%,transparent)]"
            style={{ ['--marquee-duration' as string]: `${Math.max(60, list.length * 9)}s` }}
          >
            <div className="marquee-track flex w-max items-stretch">
              {[0, 1].map((copy) =>
                list.map((t, i) => (
                  <div key={`${copy}-${i}`} className="ps-5 md:ps-6 flex" aria-hidden={copy === 1 || undefined}>
                    <VoiceCard t={t} focusable={copy === 0} className="w-[290px] md:w-[360px]" />
                  </div>
                ))
              )}
            </div>
          </div>
        </FadeUp>
      ) : (
        <div
          className={`relative mt-14 mx-auto px-5 md:px-8 grid grid-cols-1 gap-4 md:gap-5 ${
            list.length === 1 ? 'max-w-xl' : list.length === 2 ? 'max-w-4xl md:grid-cols-2' : 'max-w-6xl md:grid-cols-3'
          }`}
        >
          {list.map((t, i) => (
            <FadeUp key={i} y={30} delay={i * 0.08} className="flex">
              <VoiceCard t={t} focusable className="w-full" />
            </FadeUp>
          ))}
        </div>
      )}

      <FadeUp className="relative text-center mt-12 px-5" delay={0.1}>
        <Link
          href="/v2/recommendations"
          className="inline-flex items-center gap-3 ring-2 ring-brand text-brand-dark font-bold px-8 py-3.5 rounded-full hover:bg-brand hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          לכל ההמלצות
        </Link>
      </FadeUp>
    </section>
  )
}

function VoiceCard({ t, focusable, className }: { t: Testimonial; focusable: boolean; className: string }) {
  return (
    <article
      data-card
      tabIndex={focusable ? 0 : -1}
      className={`${className} flex flex-col rounded-[28px] bg-white/90 ring-1 ring-brand/10 p-6 md:p-7 text-right shadow-[0_14px_44px_-18px_rgba(168,90,84,0.35)] transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50`}
    >
      <span aria-hidden className="font-garamond text-6xl leading-[0.6] text-brand/40 h-6">”</span>
      <p className="mt-4 text-[#3d2814] text-base md:text-lg leading-relaxed line-clamp-6 flex-1 whitespace-pre-line">{t.body}</p>
      <div className="mt-5 pt-4 border-t border-brand/10 flex items-center gap-3">
        <div aria-hidden className="w-11 h-11 rounded-full bg-brand/15 text-brand-dark font-garamond font-extrabold text-xl flex items-center justify-center shrink-0">
          {t.name?.trim().charAt(0)}
        </div>
        <div className="min-w-0">
          <p className="font-bold text-[#2d1a0e] truncate">{t.name}</p>
          {t.courseTitle && <p className="text-sm text-[#6f5546] truncate">{t.courseTitle}</p>}
        </div>
      </div>
    </article>
  )
}
