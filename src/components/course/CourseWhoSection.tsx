'use client'

import { m } from 'framer-motion'
import SectionDivider from '@/components/ui/SectionDivider'

interface Props {
  items: string[]
}

export default function CourseWhoSection({ items }: Props) {
  if (items.length === 0) return null

  return (
    <section className="py-28 bg-cream overflow-hidden">
      <div className="max-w-3xl mx-auto px-6">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-5">למי זה מתאים?</h2>
          <SectionDivider />
        </m.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="group flex gap-4 items-start bg-white hover:bg-gold/5 border border-gold/15 hover:border-gold/35 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Check icon */}
              <div className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-gold/10 group-hover:bg-gold/20 border border-gold/25 flex items-center justify-center transition-all duration-300">
                <svg className="w-3.5 h-3.5 text-gold" fill="none" viewBox="0 0 14 14" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2 7l3.5 3.5L12 3" />
                </svg>
              </div>
              <p className="text-charcoal group-hover:text-ink leading-relaxed text-right text-base transition-colors duration-300">
                {item}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
