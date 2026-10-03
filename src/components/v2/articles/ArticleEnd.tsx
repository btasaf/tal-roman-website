import Link from 'next/link'
import { GrainOverlay } from '../backgrounds'
import { FadeUp } from './motion'
import GiftCardV2 from './GiftCardV2'
import { ArrowIcon, Kicker, Meta, QUIZ_HREF } from './ui'

// After the last paragraph: the free gift guides (the old sidebar's links, same tracking) on the warm dark,
// then more articles on cream.
export interface EndGift {
  slug: string
  title: string
  subtitle?: string
  imgUrl: string | null
}

export interface RelatedCard {
  slug: string
  title: string
  excerpt?: string
  date: string | null
  minutes: string | null
}

export function ArticleGifts({ gifts, articleSlug }: { gifts: EndGift[]; articleSlug: string }) {
  if (!gifts.length) return null
  return (
    <aside aria-labelledby="gifts-title" className="relative bg-cream px-4 sm:px-6 md:px-10 pt-6 pb-16 md:pb-24">
      <FadeUp className="relative max-w-[1180px] mx-auto">
        <div data-hide-dock className="relative overflow-hidden rounded-[28px] md:rounded-[40px] bg-[#2d1a0e] text-cream px-6 py-10 sm:px-10 md:px-14 md:py-14">
          <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(55% 60% at 100% 0%, rgba(201,120,112,0.32), transparent 70%), radial-gradient(45% 55% at 0% 100%, rgba(230,192,96,0.16), transparent 70%)' }} />
          <GrainOverlay opacity={0.18} blend="soft-light" />
          <div className="relative grid lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-14 items-center">
            <div>
              <Kicker tone="dark">מתנה בשבילך</Kicker>
              <h2 id="gifts-title" className="mt-5 font-sans font-black tracking-[-0.01em] leading-[1.1] text-3xl md:text-5xl text-balance">
                הדרכה חינמית <span className="font-garamond font-bold text-gold">מטל</span>
              </h2>
              <p className="mt-4 text-base md:text-lg leading-relaxed text-cream/75 max-w-[36ch]">
                לא בטוחים איזו מתאימה לכם?{' '}
                <Link href={QUIZ_HREF} data-track="quiz_cta_click" data-track-placement="article_gifts" className="font-bold text-gold underline decoration-gold/40 underline-offset-4 hover:decoration-gold">
                  3 שאלות קצרות
                </Link>{' '}
                יעזרו לבחור.
              </p>
            </div>
            <ul className={`grid gap-4 md:gap-5 ${gifts.length > 1 ? 'sm:grid-cols-2' : ''}`}>
              {gifts.map((g) => (
                <li key={g.slug}>
                  <GiftCardV2 giftSlug={g.slug} giftTitle={g.title} subtitle={g.subtitle} imgUrl={g.imgUrl} articleSlug={articleSlug} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </FadeUp>
    </aside>
  )
}

export function RelatedArticles({ posts }: { posts: RelatedCard[] }) {
  if (!posts.length) return null
  return (
    <section aria-labelledby="related-title" className="relative bg-cream px-6 md:px-10 pb-24 md:pb-32">
      <div className="relative max-w-[1180px] mx-auto">
        <FadeUp y={14} className="flex items-end justify-between gap-4 border-b border-[#2d1a0e]/15 pb-4">
          <h2 id="related-title" className="font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-2xl md:text-4xl">
            להמשיך <span className="font-garamond font-bold text-brand">לקרוא</span>
          </h2>
          <Link
            href="/v2/articles"
            className="group inline-flex items-center gap-2 py-2.5 -my-2.5 text-sm md:text-base font-bold text-brand-dark hover:text-[#2d1a0e] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            כל המאמרים
            <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-0.5" />
          </Link>
        </FadeUp>
        <ul className={`mt-8 md:mt-10 grid gap-5 md:gap-6 ${posts.length > 1 ? 'md:grid-cols-2' : ''} ${posts.length > 2 ? 'lg:grid-cols-3' : ''}`}>
          {posts.map((p, i) => (
            // Two columns on tablets: the third card waits for the three-column desktop grid
            <li key={p.slug} data-track="related_article_click" data-track-slug={p.slug} data-track-position={i + 1} className={i === 2 ? 'md:max-lg:hidden' : undefined}>
              <FadeUp delay={i * 0.07} y={18} className="h-full">
                <Link
                  href={`/v2/articles/${p.slug}`}
                  className="group flex h-full flex-col rounded-[26px] bg-[#fffaf0] ring-1 ring-[#c97870]/15 p-6 md:p-7 shadow-[0_24px_50px_-38px_rgba(61,40,20,0.45)] transition-[box-shadow,translate] duration-300 hover:-translate-y-1 hover:shadow-[0_34px_60px_-36px_rgba(61,40,20,0.5)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                >
                  <Meta date={p.date} minutes={p.minutes} className="text-xs md:text-sm text-[#5e5955]" />
                  <h3 className="mt-3 font-sans font-black tracking-[-0.01em] leading-[1.25] text-[#2d1a0e] text-xl md:text-[1.45rem] text-balance transition-colors duration-300 group-hover:text-brand-dark">
                    {p.title}
                  </h3>
                  {p.excerpt && <p className="mt-3 text-base leading-relaxed text-[#48443f] line-clamp-3">{p.excerpt}</p>}
                  <span className="mt-auto pt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-dark">
                    לקריאת המאמר
                    <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
                  </span>
                </Link>
              </FadeUp>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
