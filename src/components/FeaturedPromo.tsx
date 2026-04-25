'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'
import { fadeInLeft, fadeInRight } from '@/lib/animations'
import CTAButton from '@/components/ui/CTAButton'

interface FeaturedPromoProps {
  title: string
  body: string
  ctaText: string
  url: string
  promoImage: object | null
}

export default function FeaturedPromo({ title, body, ctaText, url, promoImage }: FeaturedPromoProps) {
  const imageUrl = getImageUrl(promoImage, 'promo')

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <m.div className="flex justify-center" {...fadeInLeft}>
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
            <div className="w-full max-w-md aspect-[4/3] rounded-2xl bg-gold/20 border-2 border-gold/30 flex items-center justify-center">
              <span className="text-brand text-4xl font-bold text-center px-8">TALK ME INTO IT</span>
            </div>
          )}
        </m.div>

        <m.div className="text-right" {...fadeInRight}>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-6 leading-snug">
            {title}
          </h2>
          <p className="text-charcoal text-lg leading-relaxed mb-8 whitespace-pre-line">
            {body}
          </p>
          <CTAButton href={url || '#'} className="text-lg shadow-md inline-block">
            {ctaText || 'לפרטים נוספים'}
          </CTAButton>
        </m.div>
      </div>
    </section>
  )
}
