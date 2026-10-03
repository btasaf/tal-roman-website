'use client'

import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import { AuroraBackground, GrainOverlay, RippleRings } from '../backgrounds'
import { SectionTitle, enterSpring } from '../motion-kit'
import { PHOTO } from './about-content'

// Closing invitation on cream: her portrait with the soft rings from the homepage hero, a short line, and two
// ways forward (the quiz, or a message). data-hide-dock: a docked quiz button steps aside while this is on screen.
const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

export default function AboutClosing() {
  return (
    <section aria-labelledby="closing-title" className="relative bg-cream overflow-hidden">
      {/* Aurora fades in from the top, so it meets the section above with no edge */}
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent_0%,black_35%)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      <div data-hide-dock className="relative max-w-3xl mx-auto px-6 pt-16 md:pt-24 pb-28 md:pb-36 flex flex-col items-center text-center">
        <m.div
          className="relative w-[150px] h-[150px] md:w-[184px] md:h-[184px]"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewport}
          transition={{ ...enterSpring, visualDuration: 1 }}
        >
          <div className="absolute inset-0 -z-10">
            <RippleRings count={2} color="rgba(201,120,112,0.35)" duration={8} />
          </div>
          <div className="relative w-full h-full rounded-[48px] overflow-hidden shadow-[0_24px_50px_-20px_rgba(168,90,84,0.5)] bg-white">
            <Image src={PHOTO.closing} alt="טל רומן" fill sizes="184px" className="object-cover object-[50%_20%]" />
          </div>
        </m.div>

        <div id="closing-title" className="mt-10 md:mt-12">
          <SectionTitle title="אשמח ללוות גם אותך" accent="גם אותך" />
        </div>

        <m.p
          className="mt-5 md:mt-6 text-[#48443f] text-lg md:text-xl leading-relaxed max-w-xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ ...enterSpring, delay: 0.15 }}
        >
          רוצים להתחיל? כתבו לי ואחזור אליכם באופן אישי. ואם אתם עוד בודקים, יש לי הדרכה קצרה במתנה.
        </m.p>

        <m.div
          className="mt-9 md:mt-10 flex flex-col sm:flex-row items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ ...enterSpring, delay: 0.25 }}
        >
          <Link
            href="/v2/contact"
            className="inline-flex items-center gap-3 bg-brand text-white font-bold rounded-full shadow-xl shadow-brand/30 hover:shadow-brand/50 hover:scale-105 transition-[box-shadow,scale] px-8 py-4 text-lg focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            לכתוב לי
            <svg className="w-5 h-5 rotate-180 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link
            href="/v2/quiz"
            className="inline-flex flex-col items-start leading-tight rounded-full border-2 border-brand/50 text-brand-dark font-bold px-7 py-2 hover:border-brand hover:bg-brand/5 transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
          >
            <span>הדרכה במתנה</span>
            <span className="text-sm font-medium opacity-80">שמתאימה למקום שבו אתם נמצאים</span>
          </Link>
        </m.div>
      </div>
    </section>
  )
}
