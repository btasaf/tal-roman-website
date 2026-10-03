'use client'

import Image from 'next/image'
import Link from 'next/link'
import { AuroraBackground } from '../backgrounds'
import { PHOTO } from '../about/about-content'
import { Rise } from './motion'
import { Meta } from './ui'

// Article masthead: breadcrumb, the one H1, the standfirst (CMS excerpt) and the byline.
// The H1 is visible from the first paint (it only settles a few pixels); the rest fades up after it.
interface Props {
  title: string
  excerpt?: string
  date: string | null
  minutes: string
  image: string | null
}

export default function ArticleHero({ title, excerpt, date, minutes, image }: Props) {
  return (
    <header className="relative overflow-hidden bg-cream">
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_30%,transparent_100%)] opacity-80">
        <AuroraBackground palette="cream" />
      </div>

      <div className="relative max-w-[1180px] mx-auto px-6 md:px-10 pt-28 md:pt-36 pb-10 md:pb-14">
        <Rise y={10}>
          <nav aria-label="פירורי לחם">
            <ol className="flex flex-wrap items-center gap-2 text-sm font-bold text-[#5e5955]">
              <li>
                <Link href="/v2" className="hover:text-brand-dark transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                  טל רומן
                </Link>
              </li>
              <li aria-hidden className="text-brand/60">/</li>
              <li>
                <Link href="/v2/articles" className="hover:text-brand-dark transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40">
                  מאמרים
                </Link>
              </li>
            </ol>
          </nav>
        </Rise>

        <Rise fade={false} delay={0.05} y={16}>
          <h1 className="mt-6 md:mt-8 font-sans font-black tracking-[-0.01em] leading-[1.1] text-[#2d1a0e] text-[2.15rem] sm:text-5xl lg:text-[4rem] max-w-[22ch] text-balance">
            {title}
          </h1>
        </Rise>

        {excerpt && (
          <Rise delay={0.15}>
            <p className="mt-6 md:mt-8 text-lg md:text-[1.4rem] leading-[1.7] text-[#48443f] max-w-[44ch]">{excerpt}</p>
          </Rise>
        )}

        <Rise delay={0.25}>
          <div className="mt-8 md:mt-10 flex items-center gap-3.5">
            <Link href="/v2/about" className="relative w-12 h-12 rounded-full overflow-hidden bg-[#1a0c06] ring-2 ring-white shadow-md shrink-0" aria-label="קצת על טל רומן">
              <Image src={PHOTO.closing} alt="" fill sizes="48px" className="object-cover object-[50%_20%]" />
            </Link>
            <div className="leading-tight">
              <p className="font-bold text-[#2d1a0e]">טל רומן</p>
              <Meta date={date} minutes={minutes} className="mt-1 text-sm text-[#5e5955]" />
            </div>
          </div>
        </Rise>
      </div>

      {image && (
        <Rise delay={0.2} className="relative max-w-[1180px] mx-auto px-4 sm:px-6 md:px-10 pb-6">
          <div className="relative aspect-[2/1] rounded-[24px] md:rounded-[36px] overflow-hidden bg-[#2d1a0e] shadow-[0_40px_80px_-40px_rgba(61,40,20,0.5)]">
            <Image src={image} alt="" fill priority sizes="(max-width: 1180px) 100vw, 1100px" className="object-cover" />
          </div>
        </Rise>
      )}
    </header>
  )
}
