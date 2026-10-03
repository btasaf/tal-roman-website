'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { plainTitle } from './course-data'
import type { CourseView } from './course-view'
import CourseCta from './CourseCta'
import { FadeUp } from './motion'

// The closing strip: the course's own call (or the live page's fallback line) set large, and the button again.
// The words rise into place as the strip scrolls up (scroll-linked, transform + opacity).
export default function CourseClose({ course }: { course: CourseView }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const y = useTransform(() => (reduce ? 0 : (1 - scrollYProgress.get()) * 50))
  const opacity = useTransform(() => (reduce ? 1 : 0.2 + 0.8 * scrollYProgress.get()))

  const line = course.ctaText || `הצטרפ/י ל${plainTitle(course.title)} וצא/י לדרך.`

  return (
    <section ref={ref} className="relative px-5 md:px-8 pt-24 md:pt-36 pb-28 md:pb-40 overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_35%)]">
        <AuroraBackground palette="blush" />
      </div>
      <GrainOverlay />

      <div className="relative max-w-3xl mx-auto text-center">
        <FadeUp y={16}>
          <div className="mx-auto relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-white shadow-[0_20px_40px_-20px_rgba(61,40,20,0.6)]">
            <Image src="/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg" alt="טל רומן" fill sizes="96px" className="object-cover object-top" />
          </div>
        </FadeUp>
        <m.p
          className="mt-8 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[2rem] sm:text-5xl lg:text-6xl leading-[1.15] text-balance"
          style={{ y, opacity }}
        >
          {line}
        </m.p>
        <FadeUp y={18} delay={0.1} className="mt-10 flex justify-center">
          <div data-hide-dock className="w-full sm:w-auto">
            <CourseCta href={course.ctaUrl} label={course.ctaLabel} slug={course.slug} placement="closing" className="w-full sm:w-auto sm:max-w-[36rem]" />
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
