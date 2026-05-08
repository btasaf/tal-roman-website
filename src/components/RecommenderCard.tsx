'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'
import type { Testimonial } from '@/lib/types'

interface RecommenderCardProps {
  t: Testimonial
  index?: number
  dark?: boolean
  mobile?: boolean
}

export default function RecommenderCard({ t, index = 0, dark = false, mobile = false }: RecommenderCardProps) {
  const imgUrl = t.image ? urlFor(t.image as object).width(600).height(600).url() : null

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
      {/* תמונה — מתאים לקונטיינר */}
      <div className={`relative w-full flex-shrink-0 ${dark ? 'bg-white/5' : 'bg-gold/5'}`}>
        {imgUrl ? (
          <Image
            src={imgUrl}
            alt={t.name}
            width={600}
            height={600}
            className="w-full h-auto object-contain"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center ${dark ? 'bg-white/5' : 'bg-gold/10'}`}>
            <span className={`text-8xl leading-none font-serif ${dark ? 'text-gold/20' : 'text-gold/25'}`}>"</span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      </div>

      {/* טקסט — קטן יותר, לא קובע גובה */}
      <div className="flex flex-col flex-1 p-4 text-right">
        <p className={`leading-relaxed overflow-hidden flex-1 ${dark ? 'text-white/80' : 'text-charcoal'}`}
          style={{
            fontSize: 'clamp(10px, 1.5vw, 13px)',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {t.body}
        </p>

        <div className={`flex items-center justify-start gap-2 mt-3 pt-2 border-t shrink-0 ${dark ? 'border-gold/15' : 'border-gold/20'}`}>
          <div className="text-right">
            <p className={`font-bold ${dark ? 'text-gold' : 'text-ink'}`} style={{ fontSize: 'clamp(10px, 1.5vw, 13px)' }}>{t.name}</p>
            {t.courseTitle && (
              <p className={`mt-0.5 ${dark ? 'text-white/40' : 'text-mist'}`} style={{ fontSize: 'clamp(9px, 1.2vw, 11px)' }}>{t.courseTitle}</p>
            )}
          </div>
          <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
        </div>
      </div>
    </m.div>
  )
}
