'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

interface FeaturedPromoProps {
  title: string
  body: string
  ctaText: string
  url: string
  promoImage: object | null
}

export default function FeaturedPromo({ title, body, ctaText, url, promoImage }: FeaturedPromoProps) {
  const imageUrl = promoImage ? urlFor(promoImage).width(600).height(450).url() : null

  return (
    <section className="py-20 bg-[#fff2d4]">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Image / mockup side */}
        <m.div
          className="flex justify-center"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {imageUrl ? (
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={imageUrl}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 480px"
              />
            </div>
          ) : (
            <div className="w-full max-w-md aspect-[4/3] rounded-2xl bg-[#e6c060]/20 border-2 border-[#e6c060]/30 flex items-center justify-center">
              <span className="text-[#cd2c2c] text-4xl font-bold text-center px-8">TALK ME INTO IT</span>
            </div>
          )}
        </m.div>

        {/* Text side */}
        <m.div
          className="text-right"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#303030] mb-6 leading-snug">
            {title}
          </h2>
          <p className="text-[#4f4f4f] text-lg leading-relaxed mb-8 whitespace-pre-line">
            {body}
          </p>
          <a
            href={url || '#'}
            className="inline-block bg-[#cd2c2c] text-white font-semibold px-8 py-4 rounded-full text-lg hover:bg-[#a82424] transition-colors shadow-md"
          >
            {ctaText || 'לפרטים נוספים'}
          </a>
        </m.div>
      </div>
    </section>
  )
}
