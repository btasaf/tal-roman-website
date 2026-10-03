'use client'

import Link from 'next/link'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { ArrowIcon, FadeUp, SectionTitle } from '../recommendations-page/motion'

// Closing on cream: the outlets as a quiet serif roll call, one line, and two ways forward.
// data-hide-dock: the docked quiz button steps aside here.
export default function MediaClosing({ outlets }: { outlets: string[] }) {
  return (
    <section aria-labelledby="media-closing-title" className="relative bg-cream overflow-hidden">
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div data-hide-dock className="relative max-w-3xl mx-auto px-6 pt-24 md:pt-32 pb-28 md:pb-36 flex flex-col items-center text-center">
        {outlets.length > 0 && (
          <FadeUp y={14}>
            <p className="max-w-2xl font-frank font-bold text-[#2d1a0e]/45 text-lg md:text-2xl leading-[1.9]">
              {outlets.map((o, i) => (
                <span key={o}>
                  {i > 0 && <span aria-hidden className="mx-2.5 text-[#a85a54]/60">·</span>}
                  <bdi dir="auto" className="whitespace-nowrap">{o}</bdi>
                </span>
              ))}
            </p>
          </FadeUp>
        )}

        <div className="mt-12">
          <SectionTitle id="media-closing-title" title="בואו נדבר" accent="נדבר" />
        </div>
        <FadeUp delay={0.15} y={16}>
          <p className="mt-6 text-[#48443f] text-lg md:text-xl leading-relaxed max-w-xl">לפניות תקשורת, להרצאות או לכל שאלה, אפשר לכתוב לי ישירות.</p>
        </FadeUp>

        <FadeUp delay={0.25} y={16} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/v2#contact"
            className="group inline-flex items-center gap-3 bg-brand text-white text-lg font-bold rounded-full shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:bg-brand-dark transition-[box-shadow,background-color,scale] duration-300 hover:scale-[1.03] active:scale-[0.98] px-8 py-4 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            לכתוב לי
            <ArrowIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/v2/about"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand/50 text-brand-dark font-bold px-7 py-[0.95rem] hover:border-brand hover:bg-brand/5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            קצת עליי
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
