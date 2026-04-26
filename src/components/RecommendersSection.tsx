'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { fadeInUp } from '@/lib/animations'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import SectionBackground from '@/components/ui/SectionBackground'
import RecommenderCard from '@/components/RecommenderCard'
import type { Testimonial } from '@/lib/types'

const PAGE_SIZE = 3

export default function RecommendersSection({ testimonials, bgImage }: { testimonials: Testimonial[]; bgImage?: object | null }) {
  const [visible, setVisible] = useState(PAGE_SIZE)

  if (!testimonials?.length) return null

  const shown = testimonials.slice(0, visible)
  const hasMore = visible < testimonials.length

  return (
    <section className="py-24 bg-cream relative overflow-hidden">
      <SectionBackground image={bgImage} />
      <BokehBackground />

      <div className="relative max-w-6xl mx-auto px-6">
        <m.div className="text-center mb-14" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-extrabold text-ink mb-3">המלצות</h2>
          <SectionDivider />
          <p className="text-charcoal mt-4 text-lg">מה אומרים עלי</p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence initial={false}>
            {shown.map((t, i) => (
              <RecommenderCard key={i} t={t} index={i} />
            ))}
          </AnimatePresence>
        </div>

        <m.div
          className="text-center mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          {hasMore && (
            <button
              onClick={() => setVisible(v => v + PAGE_SIZE)}
              className="inline-block border-2 border-gold text-gold font-semibold px-8 py-4 rounded-full hover:bg-gold hover:text-night transition-colors"
            >
              הצג עוד המלצות
            </button>
          )}
          <Link
            href="/recommendations"
            className="inline-block border-2 border-brand text-brand font-semibold px-8 py-4 rounded-full hover:bg-brand hover:text-white transition-colors"
          >
            לכל ההמלצות
          </Link>
        </m.div>
      </div>
    </section>
  )
}
