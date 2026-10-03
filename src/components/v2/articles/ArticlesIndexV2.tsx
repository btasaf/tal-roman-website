'use client'

import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { PHOTO } from '../about/about-content'
import { FadeUp, Rise } from './motion'
import { ArrowIcon, Kicker, Meta, QuizButton } from './ui'

// /v2/articles: an editorial index. Cream masthead, the newest piece as a large cover story,
// then the rest as a numbered table of contents, and a quiet gift invitation at the end.

export interface ArticleCard {
  slug: string
  title: string
  excerpt?: string
  date: string | null
  minutes: string | null
  image: string | null
}

const href = (slug: string) => `/v2/articles/${slug}`

export default function ArticlesIndexV2({ posts }: { posts: ArticleCard[] }) {
  const [featured, ...rest] = posts
  return (
    // One grain layer for the whole page, so no section edge shows a texture seam
    <div className="relative bg-cream">
      <Masthead count={posts.length} />
      {featured ? <Featured post={featured} /> : <Empty />}
      {rest.length > 0 && <MoreList posts={rest} />}
      <Closing />
      <GrainOverlay />
    </div>
  )
}

function Masthead({ count }: { count: number }) {
  const reduce = useHydratedReducedMotion()
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_40%,transparent_100%)]">
        <AuroraBackground palette="cream" />
      </div>
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-28 md:pt-40 pb-12 md:pb-16">
        <Rise>
          <Kicker>מאמרים</Kicker>
        </Rise>
        <h1 className="mt-6 font-sans font-black tracking-[-0.01em] leading-[1.04] text-[#2d1a0e] text-[2.6rem] sm:text-6xl lg:text-[5.4rem] max-w-[15ch] text-balance">
          <m.span
            className="block"
            initial={reduce ? false : { y: 22 }}
            animate={{ y: 0 }}
            transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.05 }}
          >
            תשובות לשאלות שאנשים שואלים <span className="font-garamond font-bold text-brand">בשקט</span>
          </m.span>
        </h1>
        <Rise delay={0.15} className="mt-6 md:mt-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <p className="text-lg md:text-2xl leading-relaxed text-[#48443f] max-w-[38ch]">מחשבות ותובנות על זוגיות, תשוקה ואינטימיות.</p>
          {count > 0 && (
            <p className="text-sm md:text-base font-bold text-[#5e5955] tabular-nums">{count === 1 ? 'מאמר אחד' : `${count} מאמרים`}</p>
          )}
        </Rise>
      </div>
    </section>
  )
}

function Featured({ post }: { post: ArticleCard }) {
  return (
    <section aria-label="המאמר החדש" className="relative px-4 sm:px-6 md:px-10 pb-16 md:pb-24">
      <FadeUp className="relative max-w-6xl mx-auto">
        <Link
          href={href(post.slug)}
          data-track="article_card_click"
          data-track-slug={post.slug}
          data-track-position={1}
          className="group grid lg:grid-cols-[1.12fr_0.88fr] rounded-[28px] md:rounded-[40px] overflow-hidden bg-[#fffaf0] ring-1 ring-[#c97870]/15 shadow-[0_40px_90px_-45px_rgba(61,40,20,0.45)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
        >
          {/* Text */}
          <div className="flex flex-col p-6 sm:p-9 md:p-12 lg:p-14 order-2 lg:order-1">
            <span className="self-start">
              <Kicker>המאמר החדש</Kicker>
            </span>
            <h2 className="mt-5 md:mt-6 font-sans font-black tracking-[-0.01em] leading-[1.12] text-[#2d1a0e] text-[1.85rem] sm:text-4xl lg:text-[3.1rem] text-balance transition-colors duration-300 group-hover:text-brand-dark">
              {post.title}
            </h2>
            {post.excerpt && <p className="mt-5 text-lg md:text-xl leading-relaxed text-[#48443f] line-clamp-4">{post.excerpt}</p>}
            <div className="mt-8 md:mt-10 lg:mt-auto lg:pt-10 flex flex-wrap items-center justify-between gap-4">
              <Meta date={post.date} minutes={post.minutes} className="text-sm md:text-base text-[#5e5955]" />
              <span className="inline-flex items-center gap-2.5 rounded-full bg-brand text-white font-bold px-5 py-2.5 shadow-lg shadow-brand/25 transition-[box-shadow] duration-300 group-hover:shadow-brand/45">
                לקריאת המאמר
                <ArrowIcon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
              </span>
            </div>
          </div>

          {/* Cover: the article image, or Tal's portrait in an arch on the warm dark */}
          <div className="relative order-1 lg:order-2 min-h-[230px] sm:min-h-[300px] lg:min-h-[520px] overflow-hidden bg-[#2d1a0e]">
            {post.image ? (
              <Image
                src={post.image}
                alt=""
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 520px"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              />
            ) : (
              <PortraitCover />
            )}
          </div>
        </Link>
      </FadeUp>
    </section>
  )
}

function PortraitCover() {
  return (
    <>
      <div aria-hidden className="absolute inset-0" style={{ background: 'radial-gradient(70% 60% at 50% 70%, rgba(201,120,112,0.35), transparent 70%), radial-gradient(50% 40% at 15% 15%, rgba(230,192,96,0.18), transparent 70%)' }} />
      <GrainOverlay opacity={0.2} blend="soft-light" />
      <span aria-hidden className="absolute top-3 right-6 lg:right-8 font-garamond text-[7rem] lg:text-[10rem] leading-none text-gold/25 select-none">״</span>
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div className="relative h-[200px] sm:h-[270px] lg:h-[440px] aspect-[4/5] rounded-t-full overflow-hidden transition-transform duration-700 group-hover:scale-[1.03] origin-bottom">
          <Image src={PHOTO.hero} alt="" fill sizes="(max-width: 1024px) 60vw, 360px" className="object-cover object-[50%_18%]" />
          <div aria-hidden className="absolute inset-0" style={{ background: 'linear-gradient(to top, #2d1a0e 0%, transparent 28%)' }} />
        </div>
      </div>
      <p className="absolute bottom-5 inset-x-0 text-center text-sm font-bold text-cream/85">מאת טל רומן</p>
    </>
  )
}

function MoreList({ posts }: { posts: ArticleCard[] }) {
  return (
    <section aria-labelledby="more-title" className="relative px-6 md:px-10 pb-20 md:pb-28">
      <div className="max-w-6xl mx-auto">
        <FadeUp y={14} className="flex items-end justify-between gap-4 border-b border-[#2d1a0e]/15 pb-4">
          <h2 id="more-title" className="font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-2xl md:text-4xl">
            עוד <span className="font-garamond font-bold text-brand">מאמרים</span>
          </h2>
        </FadeUp>
        <ol>
          {posts.map((p, i) => (
            <li key={p.slug} data-track="article_card_click" data-track-slug={p.slug} data-track-position={i + 2} className="border-b border-[#2d1a0e]/10">
              <FadeUp delay={Math.min(i, 4) * 0.06} y={18}>
                <Link
                  href={href(p.slug)}
                  className="group grid grid-cols-[auto_minmax(0,1fr)] md:grid-cols-[5.5rem_minmax(0,1fr)_auto] items-start gap-x-5 md:gap-x-10 py-8 md:py-11 rounded-2xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                >
                  <span aria-hidden className="font-garamond font-bold text-4xl md:text-6xl leading-none text-brand/60 tabular-nums transition-colors duration-300 group-hover:text-brand">
                    {String(i + 2).padStart(2, '0')}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-sans font-black tracking-[-0.01em] leading-[1.2] text-[#2d1a0e] text-xl sm:text-2xl md:text-[2rem] text-balance transition-colors duration-300 group-hover:text-brand-dark">
                      {p.title}
                    </h3>
                    {p.excerpt && <p className="mt-3 text-base md:text-lg leading-relaxed text-[#48443f] line-clamp-3 md:line-clamp-2 max-w-[62ch]">{p.excerpt}</p>}
                    <Meta date={p.date} minutes={p.minutes} className="mt-4 text-sm text-[#5e5955]" />
                  </div>
                  <span
                    aria-hidden
                    className="hidden md:flex self-center w-14 h-14 rounded-full border border-[#2d1a0e]/20 items-center justify-center text-[#2d1a0e] transition-colors duration-300 group-hover:bg-brand group-hover:border-brand group-hover:text-white"
                  >
                    <ArrowIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-0.5" />
                  </span>
                </Link>
              </FadeUp>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function Empty() {
  return (
    <section className="relative px-6 pb-24 text-center">
      <p className="text-xl text-[#5e5955]">מאמרים חדשים בדרך.</p>
    </section>
  )
}

function Closing() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_45%)]">
        <AuroraBackground palette="cream" />
      </div>
      <div data-hide-dock className="relative max-w-3xl mx-auto px-6 pt-10 md:pt-16 pb-28 md:pb-36 text-center flex flex-col items-center">
        <FadeUp y={16}>
          <h2 className="font-sans font-black tracking-[-0.01em] leading-[1.1] text-[#2d1a0e] text-4xl md:text-6xl text-balance">
            ממשיכים מכאן, <span className="font-garamond font-bold text-brand">בקצב שלכם</span>
          </h2>
        </FadeUp>
        <FadeUp delay={0.1} y={14}>
          <p className="mt-5 md:mt-6 text-lg md:text-xl leading-relaxed text-[#48443f] max-w-xl">3 שאלות קצרות, ותקבלו ממני הדרכה במתנה שמתאימה למקום שבו אתם נמצאים.</p>
        </FadeUp>
        <FadeUp delay={0.2} y={14} className="mt-9">
          <QuizButton />
        </FadeUp>
      </div>
    </section>
  )
}
