'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import SectionDivider from '@/components/ui/SectionDivider'

interface FAQItem {
  question: string
  answer: string
}

interface Props {
  items: FAQItem[]
}

function FAQRow({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors duration-300 ${isOpen ? 'border-gold/40 bg-white/8' : 'border-white/8 bg-white/[0.03]'}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 p-5 text-right cursor-pointer"
        aria-expanded={isOpen}
      >
        <p className={`font-bold text-base transition-colors duration-200 ${isOpen ? 'text-gold' : 'text-sand'}`}>
          {item.question}
        </p>
        <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-300 ${isOpen ? 'border-gold/60 bg-gold/10 rotate-45' : 'border-white/15 bg-white/5'}`}>
          <svg className={`w-3 h-3 transition-colors duration-200 ${isOpen ? 'text-gold' : 'text-sand/60'}`} fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" d="M6 1v10M1 6h10" />
          </svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 border-t border-gold/10">
              <p className="text-sand/75 leading-relaxed text-right text-base pt-4">{item.answer}</p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function CourseFAQSection({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (items.length === 0) return null

  return (
    <section className="py-28 bg-night text-white overflow-hidden">
      <div className="max-w-2xl mx-auto px-6">
        <m.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold/50 text-xs font-bold uppercase tracking-[0.25em] mb-3">שאלות נפוצות</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gold mb-5">שאלות ותשובות</h2>
          <SectionDivider />
        </m.div>

        <div className="space-y-3">
          {items.map((item, i) => (
            <m.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <FAQRow
                item={item}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              />
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
