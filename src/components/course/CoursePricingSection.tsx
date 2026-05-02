'use client'

import { m } from 'framer-motion'
import SectionDivider from '@/components/ui/SectionDivider'

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
    <section className="py-28 bg-dusk overflow-hidden">
      <div className="max-w-lg mx-auto px-6">
        <m.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-gold/50 text-xs font-bold uppercase tracking-[0.25em] mb-3">השקעה</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gold mb-5">מחיר ופרטים</h2>
          <SectionDivider />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white/5 border border-gold/20 rounded-3xl overflow-hidden"
        >
          {/* Price header */}
          {price && (
            <div className="relative bg-gradient-to-br from-gold/15 to-gold/5 border-b border-gold/15 p-10 text-center overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--color-gold)/8%_0%,_transparent_70%)]" />
              <p className="relative text-6xl font-extrabold text-gold mb-2 font-garamond">{price}</p>
              <p className="relative text-sand/50 text-sm tracking-wide">תשלום חד פעמי · גישה מלאה</p>
            </div>
          )}

          {/* Details */}
          {details.length > 0 && (
            <div className="px-8 py-6 space-y-4 border-b border-white/5">
              {details.map((d, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-xl shrink-0 mt-0.5">{d.icon}</span>
                  <p className="text-sand/80 text-base leading-relaxed text-right">{d.text}</p>
                </div>
              ))}
            </div>
          )}

          {/* CTA text */}
          {ctaText && (
            <div className="px-8 pt-6 pb-2">
              <p className="text-sand/60 text-sm leading-relaxed text-center italic">{ctaText}</p>
            </div>
          )}

          {/* Button */}
          <div className="px-8 py-6">
            {ctaUrl ? <BuyButton href={ctaUrl} label={ctaButtonLabel} /> : <ContactButton />}
          </div>
        </m.div>
      </div>
    </section>
  )
}
