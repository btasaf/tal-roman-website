'use client'

import Image from 'next/image'
import Link from 'next/link'
import { m } from 'framer-motion'
import { FadeUp, SectionTitle } from '../coaching/motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon } from '../contact-page/form-ui'

// Who's behind the gift: Tal's photo and the opening line of her bio (both from Sanity), two site numbers
export default function GiftAbout({ imageUrl, bio, years, community }: { imageUrl: string; bio?: string; years: number; community: number }) {
  const reduce = useHydratedReducedMotion()
  const stats = [
    { value: `${years}+`, label: 'שנות ניסיון' },
    { value: `${community.toLocaleString('en-US')}+`, label: 'חברות וחברים בקהילה' },
  ]

  return (
    <section className="relative px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
      <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[0.8fr_1.2fr] gap-10 md:gap-14 lg:gap-20 items-center">
        <m.div
          className="relative w-full max-w-[340px] md:max-w-none mx-auto aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[32px] shadow-[0_40px_90px_-40px_rgba(61,40,20,0.55)]"
          initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, margin: '0px 0px -20% 0px' }}
          transition={{ type: 'spring', bounce: 0, visualDuration: 1.1 }}
        >
          <Image src={imageUrl} alt="טל רומן" fill sizes="(min-width: 768px) 360px, 80vw" className="object-cover object-top" />
        </m.div>

        <div className="text-right">
          <SectionTitle kicker="מי מאחורי ההדרכה" title="טל רומן" accent="רומן" align="start" />
          {bio && (
            <FadeUp y={14} delay={0.15}>
              <p className="mt-6 text-lg md:text-2xl text-[#3d2814]/85 leading-relaxed text-pretty max-w-xl">{bio}</p>
            </FadeUp>
          )}
          <FadeUp y={14} delay={0.22}>
            <dl className="mt-8 flex flex-wrap gap-x-10 gap-y-5">
              {stats.map((s) => (
                <div key={s.label} className="flex flex-col-reverse">
                  <dt className="mt-1 text-[#5a4538]">{s.label}</dt>
                  <dd className="font-sans font-black tracking-[-0.01em] text-4xl md:text-5xl text-brand tabular-nums" dir="ltr" style={{ textAlign: 'right' }}>
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </FadeUp>
          <FadeUp y={14} delay={0.28}>
            <Link
              href="/v2/about"
              className="group mt-9 inline-flex items-center gap-3 ring-2 ring-brand text-brand-dark font-bold px-7 py-3.5 rounded-full hover:bg-brand hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-brand/40"
            >
              קצת עליי
              <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
            </Link>
          </FadeUp>
        </div>
      </div>
    </section>
  )
}
