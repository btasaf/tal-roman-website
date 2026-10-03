'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { CourseView } from './course-view'
import { SectionTitle, inView } from './motion'

const TINTS = ['#fffaf0', '#fff4e4', '#ffeedd', '#fde7d6', '#fbe0cf', '#f8d9c8', '#fff4e4']

// What you'll learn: numbered cards in two staggered columns. The second column drifts a little slower than
// the first while the section scrolls by (a CSS variable driven by scroll, transform only), so the grid
// breathes instead of sitting flat; cards rise in one after another.
export default function CourseLearn({ course }: { course: CourseView }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLOListElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const shift = useTransform(() => (reduce ? '0px' : `${((0.5 - scrollYProgress.get()) * 90).toFixed(1)}px`))

  if (!course.learn.length) return null

  return (
    <section id="learn" className="relative px-5 md:px-8 pt-20 md:pt-32 pb-20 md:pb-36 scroll-mt-4">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div className="relative max-w-6xl mx-auto">
        <SectionTitle kicker="מה בתוכנית" title="מה נלמד יחד?" accent="יחד?" />

        <m.ol
          ref={ref}
          className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 md:pb-12"
          style={{ ['--shift' as string]: shift }}
        >
          {course.learn.map((item, i) => (
            <m.li
              key={i}
              className={`relative rounded-[32px] ring-1 ring-brand/12 p-7 md:p-9 text-right shadow-[0_24px_60px_-34px_rgba(61,40,20,0.45)] ${
                i % 2 === 1 ? 'md:[translate:0_var(--shift)]' : ''
              }`}
              style={{ background: TINTS[i % TINTS.length] }}
              initial={reduce ? false : { opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={inView}
              transition={{ ...enterSpring, visualDuration: 0.9, delay: (i % 2) * 0.1 }}
            >
              <span aria-hidden className="block font-garamond font-bold text-brand text-5xl md:text-6xl leading-[0.85] tabular-nums">
                {String(i + 1).padStart(2, '0')}
              </span>
              {item.title && <h3 className="mt-5 font-sans font-black text-xl md:text-2xl text-[#2d1a0e] leading-snug text-pretty">{item.title}</h3>}
              <p className={`${item.title ? 'mt-2' : 'mt-5'} text-lg md:text-xl leading-relaxed text-[#3d2814] whitespace-pre-line text-pretty`}>{item.body}</p>
            </m.li>
          ))}
        </m.ol>
      </div>
    </section>
  )
}
