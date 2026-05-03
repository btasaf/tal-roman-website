'use client'
import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'

interface Step {
  number: string
  title: string
  body: string
}

interface Props {
  steps: Step[]
  heading?: string
  subheading?: string
}

// Apple-style: section stays pinned while content transitions through steps on scroll
export default function StickySteps({ steps, heading, subheading }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] })

  return (
    // Height = 100vh per step so each step gets a full scroll unit
    <div ref={ref} style={{ height: `${steps.length * 100}vh` }}>
      <div className="sticky top-0 h-screen bg-night text-white overflow-hidden flex items-center">
        <div className="max-w-5xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left: big step number that morphs */}
          <div className="relative h-64 flex items-center justify-center">
            {steps.map((step, i) => {
              const start = i / steps.length
              const end = (i + 1) / steps.length
              const opacity = useTransform(scrollYProgress, [start, start + 0.1, end - 0.1, end], [0, 1, 1, 0])
              const y = useTransform(scrollYProgress, [start, start + 0.1], [60, 0])

              return (
                <m.div key={i} className="absolute text-center" style={{ opacity, y }}>
                  <p className="text-[9rem] font-extrabold text-gold/10 leading-none font-garamond select-none">
                    {step.number}
                  </p>
                </m.div>
              )
            })}
          </div>

          {/* Right: text content that transitions */}
          <div className="relative h-64">
            {heading && (
              <p className="text-gold/50 text-xs font-bold uppercase tracking-[0.25em] mb-4">{subheading}</p>
            )}
            {steps.map((step, i) => {
              const start = i / steps.length
              const end = (i + 1) / steps.length
              const opacity = useTransform(scrollYProgress, [start, start + 0.12, end - 0.12, end], [0, 1, 1, 0])
              const y = useTransform(scrollYProgress, [start, start + 0.12], [40, 0])

              return (
                <m.div key={i} className="absolute inset-0 flex flex-col justify-center text-right" style={{ opacity, y }}>
                  <h3 className="text-3xl md:text-4xl font-extrabold text-gold mb-4">{step.title}</h3>
                  <p className="text-sand/80 text-lg leading-relaxed">{step.body}</p>
                </m.div>
              )
            })}
          </div>
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {steps.map((_, i) => {
            const start = i / steps.length
            const end = (i + 1) / steps.length
            const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0.3, 1, 1, 0.3])
            return <m.div key={i} className="w-1.5 h-1.5 rounded-full bg-gold" style={{ opacity }} />
          })}
        </div>
      </div>
    </div>
  )
}
