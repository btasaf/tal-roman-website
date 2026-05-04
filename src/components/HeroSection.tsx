'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'
import CTAButton from '@/components/ui/CTAButton'
import SectionBackground from '@/components/ui/SectionBackground'
import RevealText from '@/components/ui/RevealText'
import MagneticButton from '@/components/ui/MagneticButton'

// ─────────────────────────────────────────────
//  HERO CONFIG  ← שנה כאן את המראה של הבאנר
// ─────────────────────────────────────────────
const CONFIG = {
  // יישור הטקסט: 'center' = מרכז  |  'right' = ימין
  textAlign: 'center' as 'center' | 'right',

  // גודל כותרת משנה (הטקסט הקטן מתחת לכותרת הראשית)
  subtitleSize: 'text-2xl md:text-3xl',

  // גודל טקסט גוף (הטקסט הארוך מתחת לכותרות)
  bodySize: 'text-2xl md:text-3xl',

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

  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] })
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  return (
    <section ref={sectionRef} className="relative overflow-hidden min-h-[88vh] flex items-center bg-gradient-to-b from-[#f5e8c0] to-[#fdf6ec]">
      {/* Parallax bg layer */}
      <m.div className="absolute inset-0" style={{ y: bgY }}>
        <SectionBackground image={bgImage} />
      </m.div>
      {/* Bokeh particle layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%]  left-[15%]  w-72  h-72  bg-gold/18 rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[10%] w-96  h-96  bg-gold/12 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] w-80  h-80  bg-brand/10 rounded-full blur-3xl" />
        <div className="absolute top-[55%] left-[5%]  w-56  h-56  bg-gold/8  rounded-full blur-2xl" />
        <div className="absolute top-[15%] right-[35%] w-48  h-48  bg-sienna/15 rounded-full blur-2xl" />
        <div className="absolute bottom-[25%] right-[25%] w-64 h-64  bg-gold/6  rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-3 md:px-8 pt-4 pb-12 w-full grid grid-cols-1 md:grid-cols-[560px_1fr] gap-12 items-center">

        {/* Portrait — wipe reveal */}
        <m.div
          className="flex justify-center md:justify-start"
          initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <div className="relative w-[320px] h-[400px] md:w-[530px] md:h-[660px]">
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

        {/* Text — word-by-word reveal */}
        <m.div className={alignClass[CONFIG.textAlign]} style={{ opacity }}>
          <RevealText
            text={headline}
            as="h1"
            className="text-6xl md:text-7xl font-extrabold text-[#2d1a0e] leading-tight mb-8 tracking-tight font-garamond block"
            delay={0.1}
          />

          {bodyText && (
            <m.p
              className={`text-[#3d2814] ${CONFIG.bodySize} leading-relaxed mb-3`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {bodyText}
            </m.p>
          )}

          {subheadline && (
            <m.p
              className="text-[#8a7060] text-base italic mb-14 block"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
            >
              {subheadline}
            </m.p>
          )}

          <m.div
            className={buttonJustify[CONFIG.buttonAlign]}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.75 }}
          >
            <CTAButton onClick={scrollToGifts} className={`${CONFIG.buttonFont} ${CONFIG.buttonPadding} shadow-lg shadow-brand/30`}>
              {ctaText ?? 'לקבלת מתנות חינמיות'}
            </CTAButton>
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
