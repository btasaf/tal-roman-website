'use client'

import { m } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '@/sanity/client'
import { fadeInUp } from '@/lib/animations'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionDivider from '@/components/ui/SectionDivider'
import type { Gift } from '@/lib/types'

const OPTION_COPY = [
  {
    title: 'התשוקה בינינו כבר לא כמו שהייתה',
    lines: ['אני מנסה ומשקיע, אבל מרגיש שככל שאני מתאמץ יותר – היא דווקא מתרחקת'],
    subtitle: null,
  },
  {
    title: 'הכל טוב בינינו… אבל אני מרגיש שיש עוד',
    lines: [],
    subtitle: 'מאוד כיף לנו יחד, אבל אני יודע שיש עוד הרבה מה לחקור ולגלות בינינו',
  },
] as const

// ── Diagonal geometry ────────────────────────────────────────────────────────
// D  = total horizontal swing of the diagonal over the full card height.
// D2 = D/2 = how far each card extends beyond the true centre (50%).
//
// Both cards are the same width: calc(50% + D2).
// • Card 2 (physical LEFT,  z-10): clip cuts its top-right  corner.
// • Card 1 (physical RIGHT, z-20): clip cuts its bottom-left corner.
//
// Resulting diagonal: runs from (50% − D2, top) → (50% + D2, bottom).
// The midpoint is EXACTLY at 50% horizontally → "או" lives at dead-centre.
const D  = '10vw'
const D2 = '5vw'

// ─── Card ─────────────────────────────────────────────────────────────────────

function OptionCard({
  copy,
  imageUrl,
  href,
  isRight,   // true  → physically RIGHT half (Card 1)
             // false → physically LEFT  half (Card 2)
}: {
  copy: typeof OPTION_COPY[number]
  imageUrl: string | null
  href: string
  isRight: boolean
}) {
  // Scale from the diagonal edge so the image opens outward away from the cut.
  const imgOrigin = isRight ? 'origin-left' : 'origin-right'

  // Card 2 (left) needs extra right-padding so text doesn't reach the diagonal.
  // Card 1 (right) uses normal symmetric padding (text is already on the far side).
  const contentPadding = isRight
    ? 'px-8 md:px-12'
    : 'pl-8 md:pl-12 pr-8 lg:pr-[14vw]'

  return (
    <Link
      href={href}
      className="group relative flex items-end h-full min-h-[65vh] block"
      dir="rtl"
    >
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt=""
            fill
            className={`object-cover object-center scale-100 group-hover:scale-110 transition-all duration-700 ease-out ${imgOrigin}`}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-sienna/40 via-dusk to-night" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-night/15 group-hover:from-night/75 group-hover:via-night/40 group-hover:to-transparent transition-all duration-500" />
      </div>

      {/* Content */}
      <div className={`relative z-10 w-full pb-14 pt-20 text-right ${contentPadding}`}>
        <div className="transition-transform duration-500 group-hover:scale-[1.03]">
          <h3 className="text-3xl md:text-4xl font-extrabold text-white leading-snug mb-5">
            {copy.title}
          </h3>

          {copy.lines.map((line, i) => (
            <p key={i} className="text-white/90 text-xl leading-relaxed mb-3 text-right font-medium" dir="rtl">
              {line}
            </p>
          ))}

          {copy.subtitle && (
            <p className="text-white/90 text-xl leading-relaxed mt-2 mb-5 text-right font-medium" dir="rtl">
              {copy.subtitle}
            </p>
          )}

          <div className="mt-8">
            <span className="inline-block border-2 border-brand text-brand font-bold px-10 py-4 rounded-full text-xl group-hover:bg-brand group-hover:text-white transition-all duration-300">
              זה אני
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ─── Section ──────────────────────────────────────────────────────────────────

export default function FunnelSection({ gifts }: { gifts: Gift[] }) {
  const gift0 = gifts[0] ?? null
  const gift1 = gifts[1] ?? null

  const img0 = gift0?.image ? urlFor(gift0.image as object).width(900).height(800).url() : null
  const img1 = gift1?.image ? urlFor(gift1.image as object).width(900).height(800).url() : null

  const href0 = gift0 ? `/gifts/${gift0.slug}` : '#'
  const href1 = gift1 ? `/gifts/${gift1.slug}` : '#'

  return (
    <section id="gifts" className="bg-cream relative overflow-hidden">
      <BokehBackground />

      {/* ── Header — מובייל בלבד ── */}
      <div className="relative text-center py-10 md:hidden">
        <h2 className="text-2xl font-extrabold text-ink leading-tight px-4">
          איך האינטימיות ביניכם מרגישה לאחרונה?
        </h2>
      </div>

      {/* ── Mobile: stacked ── */}
      <div className="flex flex-col md:hidden">
        <OptionCard copy={OPTION_COPY[0]} imageUrl={img0} href={href0} isRight />
        <OptionCard copy={OPTION_COPY[1]} imageUrl={img1} href={href1} isRight={false} />
      </div>

      {/*
        ── Desktop: diagonal split ─────────────────────────────────────────────
        Physical left→right:
          Card 2 (OPTION_COPY[1]) = left half  → absolute left-0,  z-10
          Card 1 (OPTION_COPY[0]) = right half → absolute right-0, z-20

        Both cards are calc(50% + D2) wide, so each extends D2 past the midpoint.
        Clip-paths make them meet precisely along the diagonal.

        Diagonal: top = 50%−D2 from left, bottom = 50%+D2 from left.
        Dead-centre at every height → "או" sits at (50%, 50%).
        ──────────────────────────────────────────────────────────────────────── */}
      <div className="hidden md:block relative" style={{ minHeight: '78vh' }}>

        {/* כותרת על התמונות */}
        <div className="absolute top-0 inset-x-0 z-30 text-center pt-10 pointer-events-none">
          <m.div {...fadeInUp}>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white leading-tight drop-shadow-lg px-4">
              איך האינטימיות ביניכם מרגישה לאחרונה?
            </h2>
          </m.div>
        </div>

        {/* Card 2 — physical LEFT */}
        <div
          className="absolute left-0 top-0 bottom-0 z-10"
          style={{
            width: `calc(50% + ${D2})`,
            clipPath: `polygon(0 0, calc(100% - ${D}) 0, 100% 100%, 0 100%)`,
          }}
        >
          <OptionCard copy={OPTION_COPY[1]} imageUrl={img1} href={href1} isRight={false} />
        </div>

        {/* Card 1 — physical RIGHT, sits on top in the overlap zone */}
        <div
          className="absolute right-0 top-0 bottom-0 z-20"
          style={{
            width: `calc(50% + ${D2})`,
            clipPath: `polygon(0 0, 100% 0, 100% 100%, ${D} 100%)`,
          }}
        >
          <OptionCard copy={OPTION_COPY[0]} imageUrl={img0} href={href0} isRight />
        </div>

        {/* "או" — exactly at section centre */}
        <div
          className="absolute z-30 pointer-events-none"
          style={{ left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="w-16 h-16 rounded-full border-2 border-brand bg-white flex items-center justify-center text-brand font-extrabold text-lg shadow-2xl">
            או
          </div>
        </div>

      </div>
    </section>
  )
}
