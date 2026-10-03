'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/client'
import type { Testimonial } from '@/lib/types'

interface Props {
  testimonials: Testimonial[]
}

export default function TestimonialsV2({ testimonials }: Props) {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // Horizontal movement tied to scroll
  const x = useTransform(scrollYProgress, [0, 1], ['5%', '-25%'])
  const bgTextX = useTransform(scrollYProgress, [0, 1], ['10%', '-20%'])

  if (!testimonials?.length) return null

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-40 bg-night overflow-hidden"
    >
      {/* Giant scrolling background text */}
      <m.div
        className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap pointer-events-none select-none"
        style={{ x: prefersReducedMotion ? 0 : bgTextX }}
      >
        <span className="text-[18vw] font-black text-white/[0.02] leading-none tracking-tight">
          SIGNATURE MOMENTS • סיפורי הצלחה • SIGNATURE MOMENTS
        </span>
      </m.div>

      {/* Yard line markers */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around pointer-events-none">
        {[10, 20, 30, 40, 50].map((num) => (
          <span key={num} className="text-[12vw] font-black text-white/[0.02] leading-none">
            {num}
          </span>
        ))}
      </div>

      {/* Section header */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 md:mb-24">
        <m.h2
          className="text-5xl md:text-7xl lg:text-8xl font-black text-cream text-right"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          סיפורי הצלחה
        </m.h2>
        <m.p
          className="text-xl text-sand/50 text-right mt-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          מה אומרים אנשים שעברו את הדרך
        </m.p>
      </div>

      {/* Horizontal scrolling cards - trading card style */}
      <m.div
        className="relative z-10 flex gap-6 md:gap-10 px-6"
        style={{ x: prefersReducedMotion ? 0 : x }}
      >
        {testimonials.slice(0, 8).map((t, i) => (
          <m.div
            key={i}
            className="flex-none"
            initial={{ opacity: 0, y: 80, rotateY: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateY: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Trading card with golden glow */}
            <div
              className="relative w-[280px] md:w-[320px] group"
              style={{ transform: `rotate(${i % 2 === 0 ? -3 : 3}deg)` }}
            >
              {/* Golden glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-gold via-brand to-gold rounded-2xl opacity-60 blur-sm group-hover:opacity-100 group-hover:blur-md transition-all duration-300" />

              {/* Card content */}
              <div className="relative bg-gradient-to-br from-night via-dusk to-night rounded-2xl p-6 border border-gold/30 transform group-hover:scale-[1.02] group-hover:rotate-0 transition-all duration-300">
                {/* Top decorative */}
                <div className="flex justify-between items-start mb-4">
                  <span className="text-gold/40 text-4xl font-serif">״</span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold/30 to-brand/30 flex items-center justify-center">
                    <span className="text-xs font-bold text-gold">{i + 1}</span>
                  </div>
                </div>

                {/* Quote */}
                <p className="text-cream/90 text-base leading-relaxed mb-6 text-right min-h-[120px]">
                  {t.body.length > 150 ? t.body.slice(0, 150) + '...' : t.body}
                </p>

                {/* Divider */}
                <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent mb-4" />

                {/* Author */}
                <div className="flex items-center gap-3 justify-end">
                  <div className="text-right">
                    <p className="font-bold text-cream text-sm">{t.name}</p>
                    {t.courseTitle && (
                      <p className="text-xs text-sand/50">{t.courseTitle}</p>
                    )}
                  </div>
                  {t.image ? (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gold/50">
                      <Image
                        src={urlFor(t.image).width(100).height(100).url()}
                        alt={t.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold/30 to-brand/30 flex items-center justify-center ring-2 ring-gold/50">
                      <span className="text-lg">✦</span>
                    </div>
                  )}
                </div>

                {/* Bottom decorative line */}
                <div className="absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-gold/0 via-gold/50 to-gold/0 rounded-full" />
              </div>
            </div>
          </m.div>
        ))}
      </m.div>

      {/* View all link */}
      <m.div
        className="relative z-10 text-center mt-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Link
          href="/v2/recommendations"
          className="inline-flex items-center gap-2 text-gold hover:text-cream transition-colors text-lg"
        >
          <span>לכל ההמלצות</span>
          <svg className="w-5 h-5 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </m.div>
    </section>
  )
}
