'use client'

import { m } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import SectionDivider from '@/components/ui/SectionDivider'

interface Props {
  fullDetails?: string
  description?: { _type: string; _key: string; [key: string]: unknown }[]
  ctaUrl?: string
  ctaButtonLabel?: string
}

function BuyButton({ href, label }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-gold hover:bg-gold/80 text-night font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-gold/20 transition-all hover:scale-105"
    >
      {label || 'לרכישה עכשיו'}
    </a>
  )
}

export default function CourseDetailsSection({ fullDetails, description, ctaUrl, ctaButtonLabel }: Props) {
  if (!fullDetails && !description) return null

  const paragraphs = fullDetails
    ? fullDetails.split('\n').filter(p => p.trim())
    : []

  return (
    <section className="py-28 bg-cream overflow-hidden">
      <div className="max-w-2xl mx-auto px-6">
        <m.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sienna text-xs font-bold uppercase tracking-[0.25em] mb-3">על הקורס</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-5">פרטים נוספים</h2>
          <SectionDivider />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-right"
        >
          {paragraphs.length > 0 && (
            <div className="space-y-5">
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  className={`text-charcoal leading-loose text-lg ${i === 0 ? 'text-xl text-ink font-medium' : ''}`}
                >
                  {para}
                </p>
              ))}
            </div>
          )}

          {description && (
            <div className="prose prose-lg max-w-none text-charcoal [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink [&_p]:leading-loose [&_ul]:text-right [&_li]:text-right mt-6">
              <PortableText value={description} />
            </div>
          )}

          {ctaUrl && (
            <div className="mt-12 text-center">
              <BuyButton href={ctaUrl} label={ctaButtonLabel} />
            </div>
          )}
        </m.div>
      </div>
    </section>
  )
}
