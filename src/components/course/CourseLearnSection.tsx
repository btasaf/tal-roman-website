'use client'

import { m } from 'framer-motion'
import SectionDivider from '@/components/ui/SectionDivider'
import LiquidBackground from '@/components/ui/LiquidBackground'

interface Props {
  items: string[]
}

export default function CourseLearnSection({ items }: Props) {
  if (items.length === 0) return null

  return (
    <section className="py-28 text-white overflow-hidden relative">
      <LiquidBackground />
      <div className="relative max-w-5xl mx-auto px-6">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gold mb-5">מה נלמד יחד?</h2>
          <SectionDivider />
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="group relative bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-gold/30 rounded-2xl p-6 flex gap-5 items-start transition-all duration-300"
            >
              {/* Number */}
              <div className="shrink-0 flex flex-col items-center">
                <span className="text-3xl font-extrabold text-gold/20 group-hover:text-gold/40 leading-none transition-colors duration-300 font-garamond">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              {/* Divider line */}
              <div className="shrink-0 w-px self-stretch bg-gold/10 group-hover:bg-gold/25 transition-colors duration-300" />
              {/* Text */}
              <p className="text-sand/80 group-hover:text-sand leading-relaxed text-right text-base transition-colors duration-300 pt-0.5">
                {item}
              </p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
