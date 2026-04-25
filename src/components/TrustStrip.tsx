'use client'

import { m } from 'framer-motion'

const items = [
  { icon: '💛', label: 'גישה חמה ואישית' },
  { icon: '🎓', label: 'מוסמכת ומנוסה' },
  { icon: '🔒', label: 'דיסקרטיות מלאה' },
  { icon: '📱', label: 'זמינה בוואטסאפ' },
]

export default function TrustStrip() {
  return (
    <section className="bg-white border-y border-gold/20 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {items.map((item, i) => (
            <m.div
              key={i}
              className="flex items-center gap-2 text-charcoal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 + 0.3, duration: 0.4 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="font-medium text-sm md:text-base">{item.label}</span>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  )
}
