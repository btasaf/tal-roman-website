'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { CourseView } from './course-view'
import { SectionTitle } from './motion'
import { Icon } from './ui'

const GRAY = 'linear-gradient(to bottom, #5e5955, #48443f)'

// Who it's for, on the warm gray. The gray arrives as an inset rounded panel that opens to full bleed as it
// scrolls in and gathers back as it leaves (clip-path only), so it meets the cream with soft shoulders.
// Each line wipes in from the right (where Hebrew starts reading).
export default function CourseFit({ course }: { course: CourseView }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const clipPath = useTransform(() => {
    if (reduce) return 'inset(0px 0px 0px 0px round 40px)'
    const p = scrollYProgress.get()
    const open = p < 0.3 ? p / 0.3 : p > 0.75 ? 1 - (p - 0.75) / 0.25 : 1
    const e = open * open * (3 - 2 * open)
    const side = (1 - e) * 5
    const radius = 12 + (1 - e) * 36
    return `inset(0px ${side.toFixed(2)}vw 0px ${side.toFixed(2)}vw round ${radius.toFixed(1)}px)`
  })

  if (!course.who.length) return null

  return (
    <section ref={ref} className="relative px-5 md:px-8 py-24 md:py-36 text-cream">
      <GrainOverlay />
      <m.div aria-hidden className="absolute inset-0 overflow-hidden" style={{ background: GRAY, clipPath }}>
        <AuroraBackground palette="gray" />
        <GrainOverlay opacity={0.2} blend="soft-light" />
      </m.div>

      <div className="relative max-w-5xl mx-auto">
        <SectionTitle tone="dark" kicker="האם זה בשבילך?" title="למי זה מתאים?" accent="מתאים?" />

        <ul className="mt-14 md:mt-20">
          {course.who.map((text, i) => (
            <m.li
              key={i}
              className="relative grid grid-cols-[auto_minmax(0,1fr)] items-start gap-5 md:gap-8 py-7 md:py-9 text-right"
              initial={reduce ? false : { clipPath: 'inset(-10% -4% -10% 104%)', opacity: 0.4 }}
              whileInView={{ clipPath: 'inset(-10% -4% -10% -4%)', opacity: 1 }}
              viewport={{ once: true, margin: '0px 0px -12% 0px' }}
              transition={{ ...enterSpring, visualDuration: 1, delay: 0.05 }}
            >
              <span aria-hidden className="mt-1 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gold/15 ring-1 ring-gold/30 text-gold flex items-center justify-center">
                <Icon name="check" className="w-5 h-5 md:w-6 md:h-6" />
              </span>
              <p className="text-xl md:text-[1.75rem] leading-snug md:leading-snug font-bold text-cream whitespace-pre-line text-pretty">{text}</p>
              {i < course.who.length - 1 && (
                <span aria-hidden className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-l from-cream/25 via-cream/15 to-transparent" />
              )}
            </m.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
