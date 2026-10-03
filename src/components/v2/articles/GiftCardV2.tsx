'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { ArrowIcon } from './ui'

// A gift guide card. Same destination and the same CRM event as the old article sidebar
// (gift-cta-click/article/<article>/<gift>).
interface Props {
  giftSlug: string
  giftTitle: string
  subtitle?: string
  imgUrl: string | null
  articleSlug: string
}

export default function GiftCardV2({ giftSlug, giftTitle, subtitle, imgUrl, articleSlug }: Props) {
  const { track } = useCrmTracking()
  return (
    <Link
      href={`/v2/gifts/${giftSlug}`}
      onClick={() => track(`gift-cta-click/article/${articleSlug}/${giftSlug}`)}
      className="group flex h-full flex-col overflow-hidden rounded-[24px] bg-cream/[0.06] ring-1 ring-cream/12 transition-colors duration-300 hover:bg-cream/[0.1] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
    >
      {imgUrl && (
        <div className="relative aspect-[16/9] overflow-hidden bg-[#1a0c06]">
          <Image src={imgUrl} alt="" fill sizes="(max-width: 768px) 100vw, 420px" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-5 md:p-6">
        <h3 className="font-bold text-lg md:text-xl leading-snug text-cream text-balance">{giftTitle}</h3>
        {subtitle && <p className="mt-2 text-sm md:text-base leading-relaxed text-cream/70 line-clamp-2">{subtitle}</p>}
        <span className="mt-auto pt-5 inline-flex items-center gap-2 text-sm font-bold text-gold">
          לקבלת ההדרכה
          <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
        </span>
      </div>
    </Link>
  )
}
