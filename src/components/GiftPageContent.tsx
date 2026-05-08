'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { getImageUrl } from '@/lib/image-utils'
import GiftForm from '@/components/GiftForm'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import type { Gift } from '@/lib/types'
import { useOriginRipple } from '@/hooks/useOriginRipple'

const bodyComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-charcoal text-lg leading-relaxed mb-5 text-center">{children}</p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-ink">{children}</strong>,
    em:     ({ children }) => <em className="italic text-sienna">{children}</em>,
  },
}

function CheckIcon() {
  return (
    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
    </svg>
  )
}

export default function GiftPageContent({ gift, slug }: { gift: Gift; slug: string }) {
  const { rippleHandlers, ripple } = useOriginRipple()
  const imageUrl = getImageUrl(gift.image ?? null, 'section')
  console.log("gift",gift );
  function scrollToCta() {
    document.getElementById('gift-cta')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center bg-dusk overflow-hidden">
        {imageUrl && (
          <>
            <div className="absolute inset-0">
              <Image src={imageUrl} alt={gift.title} fill className="object-cover object-center" priority />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-dusk/70 via-dusk/60 to-dusk/90" />
          </>
        )}
        <BokehBackground />

        <div className="relative max-w-4xl mx-auto px-6 py-24 text-center w-full">
          {gift.subtitle && (
            <m.span
              className="inline-block text-gold/80 text-xs font-bold uppercase tracking-widest border border-gold/30 rounded-full px-4 py-1.5 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {gift.subtitle}
            </m.span>
          )}

          {gift.heroSubheadline && (
            <m.p
              className="text-sand text-xl md:text-2xl mb-5"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {gift.heroSubheadline}
            </m.p>
          )}

          <m.h1
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-10 tracking-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {gift.heroHeadline ?? gift.title}
          </m.h1>

          <m.div
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <button
              onClick={scrollToCta}
              className="relative overflow-hidden bg-brand text-white font-bold px-10 py-4 rounded-full text-lg shadow-xl shadow-brand/30"
              {...rippleHandlers}
            >
              <span className="relative">קבל עכשיו — בחינם ↓</span>
              {ripple}
            </button>
          </m.div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-cream to-transparent" />
      </section>

      {/* ── Main body ────────────────────────────────────────── */}
      {gift.mainBody && gift.mainBody.length > 0 && (
        <section className="py-20 bg-cream">
          <div className="max-w-2xl mx-auto px-6">
            <m.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-extrabold text-ink mb-4">{gift.title}</h2>
              <SectionDivider />
            </m.div>

            <m.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <PortableText value={gift.mainBody} components={bodyComponents} />
            </m.div>

            {gift.secondaryText && (
              <m.div
                className="mt-10 p-6 bg-gold/15 rounded-2xl border-r-4 border-gold text-right"
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <p className="text-sienna font-semibold text-lg leading-relaxed whitespace-pre-line">
                  {gift.secondaryText}
                </p>
              </m.div>
            )}
          </div>
        </section>
      )}

      {/* ── What you'll get ──────────────────────────────────── */}
      {gift.listItems && gift.listItems.length > 0 && (
        <section className="py-20 bg-dusk relative overflow-hidden">
          <BokehBackground />
          <div className="relative max-w-2xl mx-auto px-6">
            <m.div
              className="text-center mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                בהדרכה הזו תקבל:
              </h2>
              <SectionDivider />
            </m.div>

            <div className="space-y-3">
              {gift.listItems.map((item, i) => (
                <m.div
                  key={i}
                  className="flex items-start gap-4 bg-white/5 hover:bg-white/8 rounded-xl px-5 py-4 border border-gold/15 hover:border-gold/35 transition-all"
                  initial={{ opacity: 0, x: 24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                >
                  <CheckIcon />
                  <p className="text-sand leading-relaxed text-right">{item}</p>
                </m.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA / Form ───────────────────────────────────────── */}
      <section id="gift-cta" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/wix-assets/images/background/gettyimages-1459343241-640x640.jpg"
            alt=""
            fill
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-night/60" />
        </div>
        <div className="relative max-w-xl mx-auto px-6">
          <m.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-extrabold text-gold mb-3">
              קבל עכשיו את ההדרכה — בחינם
            </h2>
            <p className="text-sand text-lg">השאר פרטים ואשלח לך ישירות</p>
            <div className="w-16 h-1 bg-gold/50 mx-auto mt-4 rounded-full" />
          </m.div>

          <GiftForm
            tag={gift.crmTags}
            status={gift.crmStatus}
            enrollToSchool={gift.enrollToSchool}
            slug={slug}
          />
        </div>
      </section>
    </>
  )
}
