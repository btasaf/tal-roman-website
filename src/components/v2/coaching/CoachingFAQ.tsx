'use client'

import { useId, useState } from 'react'
import { AnimatePresence, LayoutGroup, LazyMotion, MotionConfig, domMax, m } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { FadeUp, SectionTitle } from './motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { FAQ } from './coaching-content'

const layoutSpring = { type: 'spring', bounce: 0, visualDuration: 0.45 } as const

// FAQ: one answer open at a time. Cards resize with layout animation (transform-based, size-corrected
// for their content), the answer fades and unclips in, and the cards below glide to their new place.
export default function CoachingFAQ() {
  const reduce = useHydratedReducedMotion()
  const [open, setOpen] = useState<number | null>(0)
  const baseId = useId()

  return (
    <section className="relative px-5 md:px-8 pt-20 md:pt-28 pb-16 md:pb-24">
      <GrainOverlay />
      <div className="relative max-w-3xl mx-auto">
        <SectionTitle kicker="אולי עולה לך" title="שאלות ותשובות" accent="ותשובות" />

        <FadeUp y={24} delay={0.1} className="mt-12 md:mt-16">
          <LazyMotion features={domMax}>
            <MotionConfig transition={reduce ? { duration: 0 } : layoutSpring}>
              <LayoutGroup>
                <ul className="space-y-3">
                  {FAQ.map((item, i) => {
                    const isOpen = open === i
                    const qId = `${baseId}-q${i}`
                    const aId = `${baseId}-a${i}`
                    return (
                      <m.li
                        key={item.q}
                        layout
                        style={{ borderRadius: 24 }}
                        className={`overflow-hidden ring-1 transition-colors duration-300 ${
                          isOpen ? 'bg-white ring-brand/25 shadow-[0_24px_60px_-32px_rgba(168,90,84,0.55)]' : 'bg-white/55 ring-brand/10 hover:bg-white/80'
                        }`}
                      >
                        <m.h3 layout="position">
                          <button
                            id={qId}
                            type="button"
                            aria-expanded={isOpen}
                            aria-controls={isOpen ? aId : undefined}
                            onClick={() => setOpen(isOpen ? null : i)}
                            data-track="faq_open"
                            data-track-open-only
                            data-track-index={i + 1}
                            className="w-full flex items-center justify-between gap-4 text-right px-6 py-5 md:px-7 md:py-6 font-bold text-lg md:text-xl text-[#2d1a0e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand/50 rounded-[24px]"
                          >
                            <span className="text-pretty">{item.q}</span>
                            <span
                              aria-hidden
                              className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-[background-color,color,rotate] duration-300 ${
                                isOpen ? 'bg-brand text-white rotate-45' : 'bg-brand/10 text-brand-dark'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                              </svg>
                            </span>
                          </button>
                        </m.h3>
                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <m.div
                              key="a"
                              id={aId}
                              role="region"
                              aria-labelledby={qId}
                              layout="position"
                              initial={{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                              exit={{ opacity: 0, transition: { duration: reduce ? 0 : 0.15 } }}
                            >
                              <p className="px-6 md:px-7 pb-6 md:pb-7 -mt-1 text-[#3d2814]/85 text-base md:text-lg leading-relaxed text-pretty">{item.a}</p>
                            </m.div>
                          )}
                        </AnimatePresence>
                      </m.li>
                    )
                  })}
                </ul>
              </LayoutGroup>
            </MotionConfig>
          </LazyMotion>
        </FadeUp>
      </div>
    </section>
  )
}
