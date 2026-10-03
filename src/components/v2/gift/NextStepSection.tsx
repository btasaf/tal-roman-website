'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { AngledCap } from '../motion-kit'
import { UI, springCalm, type GiftData } from './gift-copy'

const viewport = { once: true, margin: '0px 0px -12% 0px' } as const

// The recommendation and its button, then (on some paths) a quiet row of other doors.
export default function NextStepSection({
  data,
  onPrimaryClick,
  onSoftClick,
}: {
  data: GiftData
  onPrimaryClick: () => void
  onSoftClick: (label: string, target: string) => void
}) {
  return (
    <section className="relative isolate bg-cream px-5 pt-6 pb-24 sm:px-8 md:pb-32">
      <AngledCap color="#fff2d4" rise="right" height="14vh" />
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
        <AuroraBackground palette="cream" />
      </div>
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,transparent,black_30%)]">
        <GrainOverlay />
      </div>

      <div className="relative mx-auto max-w-3xl">
        {/* The offer card unfolds from a narrower window */}
        <m.article
          aria-labelledby="next-step"
          className="relative overflow-hidden rounded-[32px] bg-white/80 p-7 text-right ring-1 ring-brand/10 shadow-[0_40px_90px_-45px_rgba(168,90,84,0.6)] sm:p-10 md:rounded-[40px] md:p-14"
          initial={{ clipPath: 'inset(10% 6% 10% 6% round 40px)', opacity: 0, y: 30 }}
          whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 40px)', opacity: 1, y: 0 }}
          viewport={viewport}
          transition={{ ...springCalm, visualDuration: 1 }}
        >
          <span aria-hidden className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(230,192,96,0.38)_0%,transparent_70%)]" />
          <span aria-hidden className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(201,120,112,0.28)_0%,transparent_70%)]" />

          <m.h2
            id="next-step"
            className="relative inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand-dark"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...springCalm, delay: 0.25 }}
          >
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
            {UI.nextStep}
          </m.h2>

          <m.p
            className="relative mt-6 text-xl leading-[1.7] text-[#3d2814] md:text-[25px] md:leading-[1.65]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...springCalm, delay: 0.35 }}
          >
            {data.recommendation}
          </m.p>

          <m.div
            data-hide-dock
            className="relative mt-9 md:mt-11"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewport}
            transition={{ ...springCalm, delay: 0.45 }}
          >
            <Link
              href={data.cta.href}
              onClick={onPrimaryClick}
              data-track-skip
              className="group inline-flex w-full items-center justify-center gap-3 rounded-full bg-brand px-10 py-4 text-lg font-bold text-white shadow-xl shadow-brand/30 transition-[background-color,box-shadow] duration-300 hover:bg-brand-dark hover:shadow-brand/45 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40 sm:w-auto md:text-xl"
            >
              {data.cta.label}
              <svg aria-hidden className="h-5 w-5 transition-transform duration-300 group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </Link>
          </m.div>
        </m.article>

        {data.softRow.length > 0 && (
          <div className="mt-14 text-center md:mt-16">
            <m.p
              className="text-lg text-[#5e5955]"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewport}
              transition={springCalm}
            >
              {data.softRowIntro}
            </m.p>
            <ul className="mt-5 flex flex-wrap justify-center gap-3">
              {data.softRow.map((item, i) => (
                <m.li
                  key={item.target}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={viewport}
                  transition={{ ...springCalm, delay: 0.1 + i * 0.07 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => onSoftClick(item.label, item.target)}
                    data-track-skip
                    className="group inline-flex items-center gap-2 rounded-full bg-white/70 px-5 py-2.5 font-bold text-[#3d2814] ring-1 ring-brand/15 transition-[background-color,box-shadow] duration-300 hover:bg-white hover:ring-brand/35 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/30"
                  >
                    {item.label}
                    <svg aria-hidden className="h-4 w-4 text-brand transition-transform duration-300 group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                    </svg>
                  </Link>
                </m.li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
