'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

interface HeroSectionProps {
  headline: string
  subheadline: string
  bodyText: string
  heroImage: object | null
  whatsapp?: string
  ctaText?: string
}

function scrollToGifts() {
  const el = document.getElementById('gifts')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export default function HeroSection({ headline, subheadline, bodyText, heroImage, ctaText }: HeroSectionProps) {
  const imageUrl = heroImage
    ? urlFor(heroImage).width(700).height(900).url()
    : '/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg'

  return (
    <section className="relative overflow-hidden min-h-[92vh] flex items-center">
      {/* Bokeh particle layer */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[8%]  left-[15%]  w-72  h-72  bg-[#e6c060]/18 rounded-full blur-3xl" />
        <div className="absolute top-[30%] right-[10%] w-96  h-96  bg-[#e6c060]/12 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] left-[30%] w-80  h-80  bg-[#cd2c2c]/10 rounded-full blur-3xl" />
        <div className="absolute top-[55%] left-[5%]  w-56  h-56  bg-[#e6c060]/8  rounded-full blur-2xl" />
        <div className="absolute top-[15%] right-[35%] w-48  h-48  bg-[#b07830]/15 rounded-full blur-2xl" />
        <div className="absolute bottom-[25%] right-[25%] w-64 h-64  bg-[#e6c060]/6  rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-[420px_1fr] gap-12 items-center">

        {/* Portrait — large, portrait-oriented */}
        <m.div
          className="flex justify-center md:justify-start"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <div className="relative w-72 h-[360px] md:w-[380px] md:h-[480px]">
            <Image
              src={imageUrl}
              alt="טל רומן"
              fill
              className="object-cover object-top rounded-3xl shadow-2xl"
              priority
              sizes="(max-width: 768px) 288px, 380px"
            />
            {/* Gold frame */}
            <div className="absolute inset-0 rounded-3xl border-2 border-[#e6c060]/35 scale-[1.03]" />
            <div className="absolute inset-0 rounded-3xl border border-[#e6c060]/12 scale-[1.07]" />
          </div>
        </m.div>

        {/* Text — RIGHT */}
        <div className="text-right">
          <m.h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-5 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            {headline}
          </m.h1>

          {subheadline && (
            <m.p
              className="text-xl md:text-2xl text-[#e6c060] font-medium mb-4"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {subheadline}
            </m.p>
          )}

          {bodyText && (
            <m.p
              className="text-[#d4b896] text-lg leading-relaxed mb-10 max-w-lg mr-0 ml-auto md:ml-0"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45 }}
            >
              {bodyText}
            </m.p>
          )}

          <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <button
              onClick={scrollToGifts}
              className="bg-[#cd2c2c] text-white font-bold px-9 py-4 rounded-full text-lg hover:bg-[#a82424] transition-colors shadow-lg shadow-[#cd2c2c]/30 cursor-pointer"
            >
              {ctaText ?? 'לקבלת מתנות חינמיות'}
            </button>
          </m.div>
        </div>
      </div>
    </section>
  )
}
