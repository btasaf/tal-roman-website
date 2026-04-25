'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

interface AboutSectionProps {
  aboutImage: object | null
  aboutBio: string
  aboutQuote: string
}

const OVAL_RADIUS = '50%'

export default function AboutSection({ aboutImage, aboutBio, aboutQuote }: AboutSectionProps) {
  const imageUrl = aboutImage
    ? urlFor(aboutImage).width(500).height(640).url()
    : '/wix-assets/images/tal-photos/IMG_4913_2048px_.JPG'

  return (
    <section className="py-20 bg-[#1a0f08] text-white relative overflow-hidden">
      {/* bokeh blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#e6c060]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-[#cd2c2c]/15 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Portrait — egg shape */}
        <m.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative" style={{ width: 288, height: 360 }}>
            {/* Gold border — oval */}
            <div
              className="absolute border-2 border-[#e6c060]/30"
              style={{
                inset: '-6px',
                borderRadius: OVAL_RADIUS,
              }}
            />
            {/* Image */}
            <div
              className="relative w-full h-full overflow-hidden shadow-2xl"
              style={{ borderRadius: OVAL_RADIUS }}
            >
              <Image
                src={imageUrl}
                alt="טל רומן"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 288px, 360px"
              />
            </div>
          </div>
        </m.div>

        {/* Text */}
        <m.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-right"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-[#e6c060]">טל רומן</h2>
          {aboutBio && (
            <p className="text-[#d4b896] leading-relaxed mb-8 text-lg whitespace-pre-line">
              {aboutBio}
            </p>
          )}
          {aboutQuote && (
            <blockquote className="border-r-4 border-[#e6c060]/50 pr-4">
              <p className="text-[#e8d5bf]/80 italic leading-relaxed text-base">
                "{aboutQuote}"
              </p>
            </blockquote>
          )}
        </m.div>
      </div>
    </section>
  )
}
