'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import type { Testimonial } from '@/lib/types'

interface RecommenderCardProps {
  t: Testimonial
  index?: number
  dark?: boolean
}

export default function RecommenderCard({ t, index = 0, dark = false }: RecommenderCardProps) {
  const imgUrl = t.image ? urlFor(t.image as object).width(400).height(520).url() : null

  return (
    <m.div
      className={`rounded-2xl overflow-hidden flex flex-col h-full border transition-all duration-300
        ${dark
          ? 'bg-white/5 border-gold/15 hover:border-gold/40 hover:bg-white/8'
          : 'bg-white border-gold/15 hover:border-gold/40 hover:shadow-lg shadow-sm'
        }`}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
    >
      {/* Image — fixed height, always present */}
      <div className="relative w-full h-52 flex-shrink-0 overflow-hidden bg-gold/10">
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={t.name}
            fill
            className="object-cover object-top"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className={`text-8xl leading-none font-serif ${dark ? 'text-gold/20' : 'text-gold/25'}`}>"</span>
          </div>
        )}
        {/* Gold accent bar at bottom of image */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </div>

      {/* Content — grows to fill card height */}
      <div className="flex flex-col flex-1 p-5 text-right">
        {/* Decorative opening quote */}
        <span className={`text-4xl leading-none font-serif mb-2 block ${dark ? 'text-gold/40' : 'text-gold/50'}`}>"</span>

        {/* Quote text — fixed 4-line clamp so all cards align */}
        <p className={`text-sm leading-relaxed line-clamp-4 flex-1 ${dark ? 'text-white/80' : 'text-charcoal'}`}>
          {t.body}
        </p>

        {/* Footer — always at bottom */}
        <div className={`flex items-center justify-end gap-2 mt-4 pt-3 border-t ${dark ? 'border-gold/15' : 'border-gold/20'}`}>
          <div className="text-right">
            <p className={`font-bold text-sm ${dark ? 'text-gold' : 'text-ink'}`}>{t.name}</p>
            {t.courseTitle && (
              <p className={`text-xs mt-0.5 ${dark ? 'text-white/40' : 'text-mist'}`}>{t.courseTitle}</p>
            )}
          </div>
          <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
        </div>
      </div>
    </m.div>
  )
}
