'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'
import { fadeInUp } from '@/lib/animations'
import SectionDivider from '@/components/ui/SectionDivider'
import SectionBackground from '@/components/ui/SectionBackground'
import type { FreeGift } from '@/lib/types'

interface Props {
  gifts: FreeGift[]
  headline?: string
  subheadline?: string
  bgImage?: object | null
}

export default function FreeGiftsSection({ gifts, headline, subheadline, bgImage }: Props) {
  if (!gifts?.length) return null

  return (
    <section id="gifts" className="relative overflow-hidden py-20 bg-cream">
      <SectionBackground image={bgImage} />
      <div className="relative max-w-6xl mx-auto px-4">
        <m.div className="text-center mb-14" {...fadeInUp}>
          <h2 className="text-3xl md:text-4xl font-bold text-ink mb-3">
            {headline ?? 'קבלו ממני הדרכות'}
            <span className="text-brand"> במתנה</span>
          </h2>
          <p className="text-charcoal text-lg max-w-xl mx-auto">
            {subheadline ?? 'עם ידע פרקטי, תרגילים פשוטים וכלים שמשפרים את החיבור לגוף ואת ההנאה במיטה.'}
          </p>
        </m.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {gifts.map((g, i) => {
            const imgUrl = getImageUrl(g.image ?? null, 'thumb')

            return (
              <m.div
                key={i}
                className="flex flex-col items-center text-center"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="relative w-52 h-52 mb-6">
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={g.title}
                      fill
                      className="object-cover rounded-full shadow-lg"
                      sizes="208px"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-gold/20 to-brand/20 flex items-center justify-center shadow-lg">
                      <span className="text-5xl">{g.emoji ?? '🎁'}</span>
                    </div>
                  )}
                </div>

                <h3 className="text-xl font-bold text-ink mb-1">{g.title}</h3>
                {g.subtitle && (
                  <p className="text-charcoal text-base mb-4">{g.subtitle}</p>
                )}
                {!g.subtitle && g.description && (
                  <p className="text-charcoal text-sm mb-4">{g.description}</p>
                )}

                <a
                  href={g.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#c9786e] text-white font-semibold px-7 py-3 rounded-full hover:bg-[#b8665c] transition-colors shadow-sm"
                >
                  לקבל את המתנה
                </a>
              </m.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
