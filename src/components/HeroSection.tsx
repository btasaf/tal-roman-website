'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'
import CTAButton from '@/components/ui/CTAButton'
import SectionBackground from '@/components/ui/SectionBackground'

// ─────────────────────────────────────────────
//  HERO CONFIG  ← שנה כאן את המראה של הבאנר
// ─────────────────────────────────────────────
const CONFIG = {
  // יישור הטקסט: 'center' = מרכז  |  'right' = ימין
  textAlign: 'center' as 'center' | 'right',

  // גודל כותרת משנה (הטקסט הקטן מתחת לכותרת הראשית)
  subtitleSize: 'text-4xl md:text-5xl lg:text-6xl',

  // גודל טקסט גוף (הטקסט הארוך מתחת לכותרות)
  bodySize: 'text-3xl md:text-4xl lg:text-2xl',

  // יישור הכפתור: 'center' = מרכז  |  'right' = ימין  |  'left' = שמאל
  buttonAlign: 'center' as 'center' | 'right' | 'left',

  // גודל הכפתור — padding פנימי
  buttonPadding: 'px-14 py-2',

  // גודל פונט הכפתור
  buttonFont: 'text-2xl',
}
// ─────────────────────────────────────────────

const alignClass = {
  center: 'text-center',
  right: 'text-right',
  left: 'text-left',
}

const buttonJustify = {
  center: 'flex justify-center',
  right: 'flex justify-end',
  left: 'flex justify-start',
}

interface HeroSectionProps {
  headline: string
  subheadline: string
  bodyText: string
  heroImage: object | null
  bgImage?: object | null
  whatsapp?: string
  ctaText?: string
}

function scrollToGifts() {
  const el = document.getElementById('gifts')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection({ headline, subheadline, bodyText, heroImage, bgImage, ctaText }: HeroSectionProps) {
  const imageUrl = getImageUrl(heroImage, 'hero') ?? '/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg'

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center bg-cream">
      <SectionBackground image={bgImage} />
      {/* Bokeh particle layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%]  left-[15%]  w-72  h-72  bg-gold/18 rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[10%] w-96  h-96  bg-gold/12 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] w-80  h-80  bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute top-[55%] left-[5%]  w-56  h-56  bg-gold/8  rounded-full blur-2xl" />
        <div className="absolute top-[15%] right-[35%] w-48  h-48  bg-sienna/15 rounded-full blur-2xl" />
        <div className="absolute bottom-[25%] right-[25%] w-64 h-64  bg-gold/6  rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 md:px-4 py-16 w-full grid grid-cols-1 md:grid-cols-[480px_1fr] gap-16 items-center">

        {/* Portrait */}
        <m.div
          className="flex justify-center md:justify-start"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="relative w-[320px] h-[400px] md:w-[460px] md:h-[580px]">
            <Image
              src={imageUrl}
              alt="טל רומן"
              fill
              className="object-cover object-top rounded-[50%] shadow-2xl"
              priority
              sizes="(max-width: 768px) 320px, 460px"
            />
            <div className="absolute inset-0 rounded-[50%] border-2 border-gold/35 scale-[1.03]" />
            <div className="absolute inset-0 rounded-[50%] border border-gold/12 scale-[1.07]" />
          </div>
        </m.div>

        {/* Text */}
        <div className={alignClass[CONFIG.textAlign]}>
          <m.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-dusk leading-tight mb-8 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {headline}
          </m.h1>

          {subheadline && (
            <m.p
              className={`${CONFIG.subtitleSize} text-sienna font-medium mb-8`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {subheadline}
            </m.p>
          )}

          {bodyText && (
            <m.p
              className={`text-[#4f3a2a] ${CONFIG.bodySize} leading-relaxed mb-16 max-w-lg mx-auto`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              {bodyText}
            </m.p>
          )}

          <m.div
            className={buttonJustify[CONFIG.buttonAlign]}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <CTAButton onClick={scrollToGifts} className={`${CONFIG.buttonFont} ${CONFIG.buttonPadding} shadow-lg shadow-brand/30`}>
              {ctaText ?? 'לקבלת מתנות חינמיות'}
            </CTAButton>
          </m.div>
        </div>
      </div>
    </section>
  )
}
