'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'

const quotes = [
  {
    lines: ['שוכבים באותה מיטה.', 'מרגישים בנפרד.'],
    emphasis: 'מרגישים'
  },
  {
    lines: ['רוצים לדבר על זה.', 'הגרון נסגר.'],
    emphasis: 'נסגר'
  },
  {
    lines: ['יש הכל.', 'אבל משהו כואב בפנים.'],
    emphasis: 'כואב'
  }
]

export default function PainSection() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  return (
    <section
      ref={sectionRef}
      className="relative bg-night overflow-hidden"
    >
      {/* Each quote gets its own viewport */}
      {quotes.map((quote, qi) => (
        <div key={qi} className="relative min-h-screen flex items-center justify-center py-20">
          {/* Background texture */}
          <m.div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{ y: prefersReducedMotion ? 0 : bgY }}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 50% 50%, rgba(201, 120, 112, 0.3) 0%, transparent 50%)`,
              }}
            />
          </m.div>

          {/* Giant background word */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <m.span
              className="text-[30vw] font-black text-white/[0.02] leading-none"
              initial={{ opacity: 0, scale: 1.2 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {quote.emphasis}
            </m.span>
          </div>

          {/* Quote content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            {/* Large quote mark */}
            <m.div
              className="text-[120px] md:text-[180px] text-gold/20 font-serif leading-none mb-[-40px] md:mb-[-60px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              ״
            </m.div>

            {/* Quote lines */}
            {quote.lines.map((line, li) => (
              <m.p
                key={li}
                className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-cream leading-[1.1] tracking-tight"
                initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
                whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.8,
                  delay: li * 0.2,
                  ease: [0.16, 1, 0.3, 1]
                }}
              >
                {line}
              </m.p>
            ))}

            {/* Decorative line */}
            <m.div
              className="mt-12 mx-auto w-24 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent"
              initial={{ opacity: 0, scaleX: 0 }}
              whileInView={{ opacity: 1, scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            />
          </div>
        </div>
      ))}

      {/* Final message */}
      <div className="relative min-h-[50vh] flex items-center justify-center py-20">
        <m.div
          className="text-center px-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-2xl md:text-4xl text-sand/80 font-medium mb-8">
            את לא לבד.
          </p>
          <p className="text-3xl md:text-5xl lg:text-6xl font-black text-cream">
            ויש דרך <span className="text-brand">אחרת.</span>
          </p>
        </m.div>
      </div>
    </section>
  )
}
