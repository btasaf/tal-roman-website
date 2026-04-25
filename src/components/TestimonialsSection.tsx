'use client'

import { m } from 'framer-motion'
import { fadeInUp } from '@/lib/animations'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import type { Testimonial } from '@/lib/types'

export default function TestimonialsSection({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials?.length) return null

  return (
    <section className="py-24 bg-night relative overflow-hidden">
      <BokehBackground />

      <div className="relative max-w-6xl mx-auto px-6">
        <m.div className="text-center mb-14" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3">המלצות</h2>
          <SectionDivider />
          <p className="text-tan mt-4 text-lg">מה אומרים לקוחות קודמים</p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <m.div
              key={i}
              className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-gold/15 text-right hover:border-gold/35 transition-colors"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              <div className="flex gap-1 mb-4 justify-end">
                {[...Array(t.rating ?? 5)].map((_, s) => (
                  <span key={s} className="text-gold text-sm">★</span>
                ))}
              </div>
              <p className="text-white/85 leading-relaxed mb-5 text-sm">"{t.body}"</p>
              <div className="border-t border-gold/15 pt-4">
                <span className="font-bold text-gold">{t.name}</span>
                {t.courseTitle && (
                  <span className="text-white/50 text-sm block mt-0.5">{t.courseTitle}</span>
                )}
              </div>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
