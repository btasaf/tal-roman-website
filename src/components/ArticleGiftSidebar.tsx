import Image from 'next/image'
import Link from 'next/link'
import { fetchGifts } from '@/lib/queries'
import { urlFor } from '@/sanity/client'

export default async function ArticleGiftSidebar() {
  const gifts = await fetchGifts().catch(() => [])
  if (!gifts.length) return null

  return (
    <aside className="w-full lg:w-44 flex-shrink-0 lg:sticky lg:top-28 lg:self-start" dir="rtl">
      <div className="bg-white rounded-[24px] border border-gold/20 shadow-md overflow-hidden">
        <div className="bg-gradient-to-l from-sienna/10 to-dusk/10 px-4 py-3 border-b border-gold/10">
          <p className="text-xs text-mist tracking-widest mb-0.5">מתנה בשבילך</p>
          <h3 className="text-base font-bold text-ink leading-snug">הדרכה חינמית מטל</h3>
        </div>

        <div className="divide-y divide-gold/10">
          {gifts.slice(0, 2).map((gift) => {
            const imgUrl = gift.image
              ? urlFor(gift.image as object).width(240).height(160).url()
              : null

            return (
              <Link
                key={gift.slug}
                href={`/gifts/${gift.slug}`}
                className="group block p-3 hover:bg-cream/60 transition-colors"
              >
                {imgUrl && (
                  <div className="relative w-full h-24 rounded-lg overflow-hidden mb-2">
                    <Image
                      src={imgUrl}
                      alt={gift.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="224px"
                    />
                  </div>
                )}
                <p className="text-sm font-bold text-ink leading-snug mb-1 group-hover:text-sienna transition-colors line-clamp-2">
                  {gift.title}
                </p>
                <span className="text-xs font-semibold text-sienna group-hover:text-gold transition-colors">
                  קבל עכשיו ←
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </aside>
  )
}
