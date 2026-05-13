'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useCrmTracking } from '@/hooks/useCrmTracking'

interface Props {
  giftSlug: string
  giftTitle: string
  imgUrl: string | null
  articleSlug: string
}

export default function ArticleGiftLink({ giftSlug, giftTitle, imgUrl, articleSlug }: Props) {
  const { track } = useCrmTracking()

  return (
    <Link
      href={`/gifts/${giftSlug}`}
      className="group block p-3 hover:bg-cream/60 transition-colors"
      onClick={() => track(`gift-cta-click/article/${articleSlug}/${giftSlug}`)}
    >
      {imgUrl && (
        <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
          <Image
            src={imgUrl}
            alt={giftTitle}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="224px"
          />
        </div>
      )}
      <p className="text-sm font-bold text-ink leading-snug mb-1 group-hover:text-sienna transition-colors line-clamp-2">
        {giftTitle}
      </p>
      <span className="text-xs font-semibold text-sienna group-hover:text-gold transition-colors">
        קבל עכשיו ←
      </span>
    </Link>
  )
}
