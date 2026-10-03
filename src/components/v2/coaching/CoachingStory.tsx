'use client'

import { useRef, type ReactNode } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { enterSpring } from '../motion-kit'
import { FadeUp } from './motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { APPROACH, PHOTO, STORY } from './coaching-content'
import { CtaLink, Kicker } from './ui'

// The personal letter. Each paragraph brightens as it reaches the reading line (scroll-linked opacity),
// so the text is read at the pace it's scrolled. Tal's photo stays beside it on wide screens.
// Then the approach (talk + body, no touch) in a framed note, and the CTA.
export default function CoachingStory() {
  const reduce = useHydratedReducedMotion()
  const photoRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'end start'] })
  // The photo drifts inside its frame (parallax, transform only)
  const imgY = useTransform(() => (reduce ? '0%' : `${(scrollYProgress.get() - 0.5) * -12}%`))

  return (
    <section className="relative px-5 md:px-8 pt-16 md:pt-24 pb-24 md:pb-32">
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.15fr_0.85fr] gap-14 md:gap-10 lg:gap-20 items-start">
        <div className="text-right max-w-2xl">
          <FadeUp y={12}>
            <Kicker>מילה אישית</Kicker>
          </FadeUp>

          <div className="mt-8 space-y-7">
            {STORY.map((p, i) =>
              p.tone === 'lead' ? (
                <ReadLine key={i} className="font-garamond font-bold text-brand text-4xl md:text-6xl leading-tight py-2">
                  {p.text}
                </ReadLine>
              ) : (
                <ReadLine
                  key={i}
                  className={`text-xl md:text-2xl leading-[1.75] text-pretty ${p.tone === 'warm' ? 'font-bold text-brand-dark' : 'text-[#3d2814]'}`}
                >
                  {p.text}
                </ReadLine>
              )
            )}
          </div>

          <FadeUp y={14} className="mt-8">
            <p className="font-garamond font-bold text-2xl text-[#2d1a0e]">טל</p>
          </FadeUp>
        </div>

        {/* Photo: sticky beside the letter on wide screens, after the letter on phones */}
        <div className="md:sticky md:top-24">
          <m.div
            ref={photoRef}
            className="relative mx-auto w-full max-w-[360px] md:max-w-none aspect-[4/5] overflow-hidden rounded-[36px] shadow-[0_40px_90px_-40px_rgba(61,40,20,0.55)]"
            initial={reduce ? false : { clipPath: 'inset(12% 12% 12% 12% round 36px)', opacity: 0 }}
            whileInView={{ clipPath: 'inset(0% 0% 0% 0% round 36px)', opacity: 1 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={{ type: 'spring', bounce: 0, visualDuration: 1 }}
          >
            <m.div className="absolute -inset-y-[8%] inset-x-0" style={{ y: imgY }}>
              <Image
                src={PHOTO.story}
                alt="טל רומן, יד על הלב"
                fill
                sizes="(min-width: 1024px) 420px, 360px"
                className="object-cover object-[46%_center]"
              />
            </m.div>
          </m.div>
        </div>
      </div>

      {/* The approach */}
      <div className="relative max-w-4xl mx-auto mt-20 md:mt-28">
        <m.figure
          className="relative rounded-[36px] bg-white/75 ring-1 ring-gold/40 px-7 py-10 md:px-14 md:py-14 text-right shadow-[0_30px_80px_-40px_rgba(168,90,84,0.45)] overflow-hidden"
          initial={reduce ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -12% 0px' }}
          transition={enterSpring}
        >
          <span aria-hidden className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(230,192,96,0.4)_0%,transparent_70%)]" />
          <span aria-hidden className="absolute -bottom-24 -right-16 w-64 h-64 rounded-full bg-[radial-gradient(circle,rgba(201,120,112,0.28)_0%,transparent_70%)]" />
          <figcaption className="relative">
            <Kicker>הגישה שלי</Kicker>
          </figcaption>
          <blockquote className="relative mt-6 text-xl md:text-[1.6rem] leading-[1.7] text-[#2d1a0e] text-pretty">
            {APPROACH}
          </blockquote>
        </m.figure>

        <FadeUp y={16} delay={0.1} className="mt-12 flex justify-center">
          <CtaLink />
        </FadeUp>
      </div>
    </section>
  )
}

// A paragraph that brightens from faint to full as it scrolls up to the reading line
function ReadLine({ children, className }: { children: ReactNode; className: string }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 58%'] })
  const opacity = useTransform(() => (reduce ? 1 : 0.22 + 0.78 * scrollYProgress.get()))
  const y = useTransform(() => (reduce ? 0 : (1 - scrollYProgress.get()) * 14))
  return (
    <m.p ref={ref} className={className} style={{ opacity, y }}>
      {children}
    </m.p>
  )
}
