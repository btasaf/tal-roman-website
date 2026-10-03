'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function QuizCTA() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [50, 0])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Diagonal split background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-night"
          style={{ clipPath: 'polygon(0 0, 100% 0, 100% 40%, 0 60%)' }}
        />
        <div
          className="absolute inset-0 bg-cream"
          style={{ clipPath: 'polygon(0 60%, 100% 40%, 100% 100%, 0 100%)' }}
        />
      </div>

      {/* Texture on cream */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c97870' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Giant question mark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <span className="text-[50vw] font-black text-brand/[0.03] leading-none">
          ?
        </span>
      </div>

      {/* Content */}
      <m.div
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={prefersReducedMotion ? {} : { scale, y }}
      >
        <m.p
          className="text-xl md:text-2xl text-sand/60 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          הגעת עד לכאן
        </m.p>

        <m.h2
          className="text-5xl md:text-7xl lg:text-9xl font-black leading-[0.9] mb-8"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="text-cream">מוכנים</span>
          <br />
          <span className="text-night">להתחיל?</span>
        </m.h2>

        <m.p
          className="text-lg md:text-xl text-night/70 mb-12 max-w-xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          ענו על 3 שאלות קצרות וקבלו הדרכה מותאמת אישית - בחינם
        </m.p>

        {/* CTA Button */}
        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/v2/quiz"
            className="group relative inline-flex items-center gap-4 bg-brand text-white font-black text-xl md:text-2xl px-14 py-7 rounded-full shadow-2xl shadow-brand/40 hover:shadow-brand/60 hover:scale-105 transition-all duration-300 overflow-hidden"
          >
            {/* Animated shine */}
            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

            <span className="relative">לקבל הדרכה חינם</span>
            <m.svg
              className="relative w-6 h-6 rotate-180"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              animate={{ x: [0, -8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </m.svg>
          </Link>
        </m.div>

        {/* Trust badges */}
        <m.div
          className="mt-12 flex flex-wrap justify-center gap-8 text-night/50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-2">
            <span className="text-brand text-xl">✓</span>
            <span>3 שאלות פשוטות</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand text-xl">✓</span>
            <span>פחות מדקה</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-brand text-xl">✓</span>
            <span>הדרכה מותאמת</span>
          </div>
        </m.div>

        <m.p
          className="mt-6 text-sm text-mist"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          ללא התחייבות • ללא כרטיס אשראי
        </m.p>
      </m.div>
    </section>
  )
}
