'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'
import { fadeInLeft, fadeInRight } from '@/lib/animations'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionBackground from '@/components/ui/SectionBackground'

interface AboutSectionProps {
  aboutImage: object | null
  aboutBio: string
  aboutQuote: string
  bgImage?: object | null
}

const OVAL_RADIUS = '50%'

export default function AboutSection({ aboutImage, aboutBio, aboutQuote, bgImage }: AboutSectionProps) {
  const imageUrl = getImageUrl(aboutImage, 'about') ?? '/wix-assets/images/tal-photos/IMG_4913_2048px_.JPG'

  return (
    <section className="py-20 bg-dusk text-white relative overflow-hidden">
      <SectionBackground image={bgImage} />
      <BokehBackground />

      <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <m.div className="flex justify-center" {...fadeInLeft}>
          <div className="relative" style={{ width: 360, height: 460 }}>
            <div
              className="absolute border-2 border-gold/30"
              style={{ inset: '-6px', borderRadius: OVAL_RADIUS }}
            />
            <div
              className="relative w-full h-full overflow-hidden shadow-2xl"
              style={{ borderRadius: OVAL_RADIUS }}
            >
              <Image
                src={imageUrl}
                alt="טל רומן"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 360px, 460px"
              />
            </div>
          </div>
        </m.div>

        <m.div {...fadeInRight} className="text-right">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gold">טל רומן</h2>
          {aboutBio && (
            <p className="text-sand leading-relaxed mb-8 text-lg whitespace-pre-line">
              {aboutBio}
            </p>
          )}
          {aboutQuote && (
            <blockquote className="border-r-4 border-gold/50 pr-4">
              <p className="text-white/80 italic leading-relaxed text-base">
                "{aboutQuote}"
              </p>
            </blockquote>
          )}
        </m.div>
      </div>
    </section>
  )
}
