'use client'

import { m } from 'framer-motion'
import { PortableText } from '@portabletext/react'
import SectionDivider from '@/components/ui/SectionDivider'
import CTAButton from '@/components/ui/CTAButton'
import { useCrmTracking } from '@/hooks/useCrmTracking'

interface Props {
  fullDetails?: string
  description?: { _type: string; _key: string; [key: string]: unknown }[]
  ctaUrl?: string
  ctaButtonLabel?: string
  slug?: string
}

function BuyButton({ href, label, slug }: { href: string; label?: string; slug?: string }) {
  const { track } = useCrmTracking()
  return (
    <span onClick={() => { if (slug) track(`click_buy_course/${slug}`) }}>
      <CTAButton href={href} target="_blank" rel="noopener noreferrer" variant="gold" className="rounded-full text-lg shadow-lg shadow-gold/20 px-10 py-4">
        {label || 'לרכישה עכשיו'}
      </CTAButton>
    </span>
  )
}

export default function CourseDetailsSection({ fullDetails, description, ctaUrl, ctaButtonLabel, slug }: Props) {
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
          <h2 className="text-4xl md:text-5xl font-extrabold text-ink mb-5">פרטים נוספים</h2>
          <SectionDivider />
        </m.div>

        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center"
        >
          {paragraphs.length > 0 && (
            <div className="space-y-6">
              {paragraphs.map((para, i) => {
                const isLast = i === paragraphs.length - 1
                const isFirst = i === 0
                if (isFirst) return (
                  <p key={i} className="text-3xl text-ink font-semibold leading-loose text-center">
                    {para}
                  </p>
                )
                if (isLast) return (
                  <div key={i} className="text-center">
                    <p className="text-ink text-xl leading-loose font-semibold inline-block border-b-4 border-sienna/50 pb-2">
                      {para}
                    </p>
                  </div>
                )
                return (
                  <p key={i} className="text-charcoal text-xl leading-loose text-center">
                    {para}
                  </p>
                )
              })}
            </div>
          )}

          {description && (
            <div className="prose prose-lg max-w-none text-charcoal [&_h2]:text-ink [&_h3]:text-ink [&_strong]:text-ink [&_p]:leading-loose [&_ul]:text-right [&_li]:text-right mt-6">
              <PortableText value={description} />
            </div>
          )}

          {ctaUrl && (
            <div className="mt-12 text-center">
              <BuyButton href={ctaUrl} label={ctaButtonLabel} slug={slug} />
            </div>
          )}
        </m.div>
      </div>
    </section>
  )
}
