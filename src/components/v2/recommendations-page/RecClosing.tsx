'use client'

import Link from 'next/link'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { ArrowIcon, FadeUp, SectionTitle, halftone } from './motion'

// Closing invitation: a giant halftone quote mark opening the space, one line, and two ways forward:
// the short quiz (gift guide), or personal coaching. data-hide-dock: the docked quiz button steps aside here.
export default function RecClosing() {
  return (
    <section aria-labelledby="rec-closing-title" className="relative bg-cream overflow-hidden">
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_40%)]">
        <AuroraBackground palette="blush" />
      </div>
      <GrainOverlay />

      <div data-hide-dock className="relative max-w-3xl mx-auto px-6 pt-10 md:pt-16 pb-28 md:pb-36 flex flex-col items-center text-center">
        <FadeUp y={20}>
          <span
            aria-hidden
            className="block font-garamond font-bold leading-[0.7] h-[0.5em] text-[11rem] md:text-[15rem] text-transparent bg-clip-text [-webkit-background-clip:text] select-none"
            style={halftone(0.5)}
          >
            ”
          </span>
        </FadeUp>

        <div className="mt-8">
          <SectionTitle id="rec-closing-title" title="הסיפור הבא יכול להיות שלך" accent="שלך" />
        </div>

        <FadeUp delay={0.15} y={16}>
          <p className="mt-6 text-[#48443f] text-lg md:text-xl leading-relaxed max-w-xl">
            אפשר להתחיל בהדרכה קצרה במתנה, או לבחור בליווי אישי צמוד.
          </p>
        </FadeUp>

        <FadeUp delay={0.25} y={16} className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/v2/quiz"
            className="group inline-flex items-center gap-3 bg-brand text-white font-bold rounded-full shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:bg-brand-dark transition-[box-shadow,background-color,scale] duration-300 hover:scale-[1.03] active:scale-[0.98] px-7 py-3 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            <span className="flex flex-col items-start leading-tight">
              <span className="text-lg">להתחיל עם הדרכה במתנה</span>
              <span className="text-sm font-medium text-white/85">שמתאימה בדיוק לכם</span>
            </span>
            <ArrowIcon className="w-5 h-5 transition-transform duration-300 group-hover:-translate-x-1" />
          </Link>
          <Link
            href="/v2/personal-coaching"
            className="inline-flex items-center gap-2 rounded-full border-2 border-brand/50 text-brand-dark font-bold px-7 py-[0.95rem] hover:border-brand hover:bg-brand/5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            לליווי האישי
          </Link>
        </FadeUp>
      </div>
    </section>
  )
}
