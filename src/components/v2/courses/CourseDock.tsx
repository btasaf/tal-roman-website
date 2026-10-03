'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { CourseView } from './course-view'
import CourseCta from './CourseCta'
import { Amount } from './ui'

// A slim price + button bar docked at the bottom once the visitor has scrolled past the hero, while no other
// call to action (marked data-hide-dock) and no footer is on screen. Slides up from below; stays clear of the
// fixed menu button at the top.
export default function CourseDock({ course }: { course: CourseView }) {
  const reduce = useHydratedReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-hide-dock], footer')
    const onScreen = new Set<Element>()
    let started = false
    const update = () => setShow(started && onScreen.size === 0)
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target)
        else onScreen.delete(e.target)
      }
      update()
    })
    targets.forEach((t) => io.observe(t))
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.6
      if (next !== started) {
        started = next
        update()
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] flex justify-center pointer-events-none">
      <AnimatePresence>
        {show && (
          <m.div
            key="dock"
            className="pointer-events-auto w-full sm:w-auto sm:min-w-[520px] max-w-[640px]"
            initial={{ opacity: 0, y: reduce ? 0 : 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 48 }}
            transition={enterSpring}
          >
            <div className="flex items-center justify-between gap-4 rounded-full bg-[#2d1a0e]/95 backdrop-blur-md ps-5 sm:ps-6 pe-1.5 py-1.5 shadow-[0_24px_50px_-20px_rgba(45,26,14,0.8)] ring-1 ring-cream/10">
              {course.lead.now ? (
                <p className="flex items-baseline gap-2 text-cream min-w-0">
                  {course.lead.from && <span className="text-xs sm:text-sm font-bold text-cream/70">החל מ־</span>}
                  <Amount value={course.lead.now} className="font-sans font-black text-2xl leading-none text-gold" />
                  {course.lead.was && (
                    <s className="text-sm font-bold text-cream/55 decoration-brand decoration-2">
                      <Amount value={course.lead.was} />
                    </s>
                  )}
                </p>
              ) : (
                <span />
              )}
              <CourseCta href={course.ctaUrl} label={course.ctaLabel} slug={course.slug} placement="dock" tone="gold" size="sm" shortLabel={course.ctaUrl ? 'להצטרפות' : 'לפרטים'} className="sm:max-w-[28rem]" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
