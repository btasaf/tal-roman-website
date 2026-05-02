'use client'

import { m } from 'framer-motion'
import { getImageUrl } from '@/lib/image-utils'
import { fadeInLeft, fadeInRight } from '@/lib/animations'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionBackground from '@/components/ui/SectionBackground'
// ─── CONFIG ──────────────────────────────────────────────────────────────────

const IMAGE = {
  width: 400,          // px — controls how wide the oval is; height follows the image naturally
  // COPY ONE OF THESE EXACTLY (with the quotes):
  // '50%'   → oval
  // '0px'   → sharp square corners
  // '12px'  → slightly rounded corners
  // '40px'  → very rounded corners
  borderRadius: '50%',
  borderColor: 'rgba(212, 175, 55, 0)', // border around image (gold tint)
  borderWidth: 2,      // px

  // Where to anchor the photo inside the frame:
  // 'top' | 'center' | 'bottom' | 'left' | 'right'
  position: 'top' as 'top' | 'center' | 'bottom' | 'left' | 'right',

  // Zoom — 1 = normal fit, 1.2 = 20% zoomed in, 0.9 = slightly zoomed out
  zoom: 1,
}

const TEXT = {
  bioSize: 'text-lg',        // text-sm | text-base | text-lg | text-xl | text-2xl
  bioColor: 'text-sand',     // text-sand | text-white | text-gold
  quoteSize: 'text-base',    // text-sm | text-base | text-lg | text-xl
  quoteColor: 'text-white/80', // text-white/80 | text-sand | text-gold
  titleSize: 'text-3xl md:text-4xl', // headline size
  titleColor: 'text-gold',   // text-gold | text-white | text-sand
  alignment: 'text-center',   // text-right | text-center | text-left
}

// ─────────────────────────────────────────────────────────────────────────────

interface AboutSectionProps {
  aboutImage: object | null
  aboutBio: string
  aboutQuote: string
  bgImage?: object | null
}

export default function AboutSection({ aboutImage, aboutBio, aboutQuote, bgImage }: AboutSectionProps) {
  const imageUrl = getImageUrl(aboutImage, 'about') ?? '/wix-assets/images/tal-photos/IMG_4913_2048px_.JPG'

  return (
    <section className="py-20 bg-dusk text-white relative overflow-hidden">
      <SectionBackground image={bgImage} opacity={100} />
      <BokehBackground />


      <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <m.div className="flex justify-center" {...fadeInLeft}>
          <div className="relative inline-block">
            <div
              className="overflow-hidden shadow-2xl"
              style={{ borderRadius: IMAGE.borderRadius, width: IMAGE.width }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="טל רומן"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                  transform: `scale(${IMAGE.zoom})`,
                  transformOrigin: IMAGE.position,
                }}
              />
            </div>
            <div
              className="absolute pointer-events-none"
              style={{
                inset: '-6px',
                borderRadius: IMAGE.borderRadius,
                border: `${IMAGE.borderWidth}px solid ${IMAGE.borderColor}`,
              }}
            />
          </div>
        </m.div>

        <m.div {...fadeInRight} className={TEXT.alignment}>
          <h2 className={`${TEXT.titleSize} font-bold mb-6 ${TEXT.titleColor}`}>טל רומן</h2>
          {aboutBio && (
            <p className={`${TEXT.bioColor} leading-relaxed mb-8 ${TEXT.bioSize} whitespace-pre-line`}>
              {aboutBio}
            </p>
          )}
          {aboutQuote && (
            <blockquote className="border-r-4 border-gold/50 pr-4">
              <p className={`${TEXT.quoteColor} italic leading-relaxed ${TEXT.quoteSize}`}>
                "{aboutQuote}"
              </p>
            </blockquote>
          )}
        </m.div>
      </div>
    </section>
  )
}
