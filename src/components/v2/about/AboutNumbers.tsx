'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { animate, m, useInView, useMotionValue, useTransform } from 'framer-motion'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { LogoMarquee } from '../media-logos'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { COMMUNITY_SIZE, halftone } from './about-content'
import { followerList, type SiteStats } from '../site-stats'
import SocialIcon from '../SocialIcon'

// Numbers + media, on a cream sheet with rounded shoulders that rises over the story.
// Each figure arrives as fine halftone dots (the v2 giant-word texture) and fills in to solid ink as it counts up.
export default function AboutNumbers({ role, stats }: { role: string; stats?: SiteStats }) {
  const years = stats?.years ?? 10
  const community = stats?.community ?? COMMUNITY_SIZE
  const followers = followerList(stats)
  return (
    <section
      aria-label="במספרים"
      // Pulled up over the story's last stretch so the rounded shoulders show the dark section behind them
      className="relative z-10 -mt-20 md:-mt-28 rounded-t-[40px] md:rounded-t-[72px] bg-cream overflow-hidden"
    >
      {/* Aurora fades out toward the bottom, so the cream continues into the next section with no edge */}
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-20 md:pt-28 pb-16 md:pb-24">
        {role && (
          <m.p
            className="text-center font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-2xl md:text-4xl lg:text-[2.75rem] leading-tight max-w-3xl mx-auto"
            initial={{ clipPath: 'inset(0 0 100% 0)', y: 24 }}
            whileInView={{ clipPath: 'inset(0 0 -10% 0)', y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={enterSpring}
          >
            {role}
          </m.p>
        )}

        <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3">
          <Stat value={years} suffix="+" label="שנות ניסיון בליווי" delay={0} />
          <Stat word="אלפי" label="אנשים וזוגות בארץ ובחו״ל" delay={0.12} />
          <Stat
            value={community}
            suffix="+"
            delay={0.24}
            label={
              <Link href="/v2/communities" className="inline-block py-2.5 -my-2.5 underline decoration-brand/40 underline-offset-4 hover:decoration-brand transition-colors">
                בקהילות שלי
              </Link>
            }
          />
        </div>

        {followers.length > 0 && (
          <m.ul
            aria-label="עוקבים ברשתות"
            className="mt-12 md:mt-16 flex flex-wrap justify-center gap-x-10 gap-y-5 md:gap-x-16"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '0px 0px -10% 0px' }}
            transition={enterSpring}
          >
            {followers.map((f) => (
              <li key={f.key}>
                <a href={f.url} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-3 text-[#3d2814]">
                  <span className="w-10 h-10 rounded-full ring-1 ring-[#a85a54]/25 group-hover:ring-[#a85a54]/60 flex items-center justify-center text-[#a85a54] transition-colors">
                    <SocialIcon name={f.key} />
                  </span>
                  <span className="leading-tight text-right">
                    <span className="block font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-2xl md:text-3xl">
                      {f.count.toLocaleString('en-US')}+
                    </span>
                    <span className="block text-sm text-[#5e5955] group-hover:text-[#a85a54] transition-colors">{f.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </m.ul>
        )}

        <m.div
          className="mt-16 md:mt-24 pt-10 border-t border-[#a85a54]/15 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={enterSpring}
        >
          <p className="text-sm md:text-base font-bold text-[#5e5955] mb-5">בתקשורת</p>
          <LogoMarquee tone="dark" logoClassName="h-8 md:h-10" duration={30} className="max-w-3xl mx-auto" />
        </m.div>
      </div>
    </section>
  )
}

function Stat({ value, word, suffix = '', label, delay }: { value?: number; word?: string; suffix?: string; label: React.ReactNode; delay: number }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const count = useMotionValue(0)
  const fill = useMotionValue(0)
  const text = useTransform(() => (word ? word : `${Math.round(count.get()).toLocaleString('en-US')}${suffix}`))
  // Width is reserved by the final value (invisible), so counting never shifts the layout
  const final = word ?? `${(value ?? 0).toLocaleString('en-US')}${suffix}`

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      count.set(value ?? 0)
      fill.set(1)
      return
    }
    const c = animate(count, value ?? 0, { duration: 1.6, ease: [0.16, 1, 0.3, 1], delay })
    const f = animate(fill, 1, { duration: 1.1, ease: [0.65, 0, 0.35, 1], delay: delay + 0.7 })
    return () => {
      c.stop()
      f.stop()
    }
  }, [inView, reduce, value, delay, count, fill])

  const dotsOpacity = useTransform(() => 1 - fill.get())

  return (
    <div ref={ref} className="py-8 md:py-2 md:px-4 text-center border-[#a85a54]/15 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-t-0 md:[&:not(:first-child)]:border-s">
      <p className="relative font-sans font-black tracking-[-0.02em] leading-none text-[min(20vw,5.5rem)] md:text-[min(6vw,4.75rem)]">
        <span className="invisible" aria-hidden>{final}</span>
        <span className="sr-only">{final}</span>
        {/* Halftone version */}
        <m.span
          aria-hidden
          className="absolute inset-0 text-transparent bg-clip-text [-webkit-background-clip:text]"
          style={{ ...halftone('rgba(168,90,84,0.75)', 'rgba(168,90,84,0.22)', 'rgba(201,120,112,0.1)', 4), opacity: dotsOpacity }}
        >
          {text}
        </m.span>
        {/* Solid ink */}
        <m.span aria-hidden className="absolute inset-0 text-[#2d1a0e]" style={{ opacity: fill }}>
          {text}
        </m.span>
      </p>
      <div className="mt-3 md:mt-4 text-base md:text-lg font-bold text-brand-dark">{label}</div>
    </div>
  )
}
