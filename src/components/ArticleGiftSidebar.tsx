import { fetchGifts } from '@/lib/queries'
import { urlFor } from '@/sanity/client'
import ArticleGiftLink from '@/components/ArticleGiftLink'

interface Props {
  articleSlug: string
}

export default async function ArticleGiftSidebar({ articleSlug }: Props) {
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
              <ArticleGiftLink
                key={gift.slug}
                giftSlug={gift.slug}
                giftTitle={gift.title}
                imgUrl={imgUrl}
                articleSlug={articleSlug}
              />
            )
          })}
        </div>
      </div>
    </aside>
  )
}
