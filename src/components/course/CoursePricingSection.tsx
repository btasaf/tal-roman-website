'use client'

import { m } from 'framer-motion'
import SectionDivider from '@/components/ui/SectionDivider'
import LiquidBackground from '@/components/ui/LiquidBackground'

interface Props {
  price?: string
  location?: string
  cancellationPolicy?: string
  ctaText?: string
  ctaUrl?: string
  ctaButtonLabel?: string
}

function BuyButton({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full block text-center bg-gold hover:bg-gold/80 text-night font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-gold/20 transition-all hover:scale-[1.02]"
    >
      {label || 'לרכישה עכשיו'}
    </a>
  )
}

function ContactButton() {
  return (
    <a
      href="#contact"
      className="w-full block text-center bg-gold hover:bg-gold/80 text-night font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-gold/20 transition-all hover:scale-[1.02]"
    >
      אשמח לקבל פרטים נוספים
    </a>
  )
}

export default function CoursePricingSection({ price, location, cancellationPolicy, ctaText, ctaUrl, ctaButtonLabel }: Props) {
  if (!price && !location && !ctaText) return null

  const details = [
    location    && { icon: '📍', text: location },
    cancellationPolicy && { icon: '📋', text: cancellationPolicy },
  ].filter(Boolean) as { icon: string; text: string }[]

  return (
    <section className="py-28 text-white overflow-hidden relative">
      <LiquidBackground />
      <div className="relative max-w-lg mx-auto px-6">
        <m.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gold mb-5">מחיר ופרטים</h2>
          <SectionDivider />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* מחיר — עצמאי */}
          {price && (
            <div className="relative bg-gradient-to-br from-gold/15 to-gold/5 border border-gold/25 rounded-3xl p-10 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-gold)/8%_0%,_transparent_70%)]" />
              <p className="relative text-4xl font-extrabold text-gold font-garamond">{price}</p>
            </div>
          )}

          {/* פרטים — כל פרט בכרטיס נפרד */}
          {details.map((d, i) => (
            <div key={i} className="flex items-start gap-4 bg-white/5 border border-gold/15 rounded-2xl px-6 py-5">
              <span className="text-2xl shrink-0">{d.icon}</span>
              <p className="text-sand/85 text-base leading-relaxed text-right">{d.text}</p>
            </div>
          ))}

          {/* טקסט CTA */}
          {ctaText && (
            <div className="border border-gold/20 rounded-2xl px-6 py-5 text-center">
              <p className="text-sand/70 text-base leading-relaxed italic">{ctaText}</p>
            </div>
          )}

          {/* כפתור */}
          <div className="pt-2">
            {ctaUrl ? <BuyButton href={ctaUrl} label={ctaButtonLabel} /> : <ContactButton />}
          </div>
        </m.div>
      </div>
    </section>
  )
}
