'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { m, useScroll, useTransform } from 'framer-motion'
import SocialIcon from '../SocialIcon'
import type { SocialUrls } from '../site-stats'
import { FadeUp, SectionTitle } from '../coaching/motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon, PhoneIcon } from './form-ui'
import { PHOTO } from './contact-content'

// Other ways to reach Tal: phone and social profiles, beside a warm photo that opens like a curtain
// and drifts a little slower than the page (depth, not spectacle).
export default function ContactWays({ phone, urls }: { phone?: string; urls: SocialUrls }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const photoY = useTransform(() => (reduce ? 0 : (scrollYProgress.get() - 0.5) * -60))

  const socials = [
    { key: 'instagram' as const, label: 'Instagram', note: 'עקבו אחריי לתוכן שוטף', href: urls.instagram },
    { key: 'facebook' as const, label: 'Facebook', note: null, href: urls.facebook },
    { key: 'tiktok' as const, label: 'TikTok', note: null, href: urls.tiktok },
  ]

  return (
    <section ref={ref} className="relative px-5 md:px-8 pt-12 md:pt-20 pb-20 md:pb-28">
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1.05fr_0.95fr] gap-12 md:gap-12 lg:gap-20 items-center">
        <div className="text-right">
          <SectionTitle kicker="עוד דרכים" title="מעדיפים לדבר אחרת?" accent="אחרת" align="start" />

          <div className="mt-10 space-y-3 max-w-lg">
            {phone && (
              <FadeUp y={18} delay={0.1}>
                <a
                  href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                  className="group flex items-center gap-4 rounded-[24px] bg-white/70 hover:bg-white ring-1 ring-brand/10 hover:ring-brand/30 p-5 transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                >
                  <span className="w-12 h-12 rounded-2xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                    <PhoneIcon className="w-6 h-6" />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-bold text-lg text-[#2d1a0e]">טלפון</span>
                    <span className="block text-[#5a4538] tabular-nums" dir="ltr" style={{ textAlign: 'right' }}>
                      {phone}
                    </span>
                  </span>
                  <ArrowIcon className="text-brand-dark transition-transform duration-300 group-hover:-translate-x-1" />
                </a>
              </FadeUp>
            )}

            <FadeUp y={18} delay={0.18}>
              <a
                href={socials[0].href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 rounded-[24px] bg-white/70 hover:bg-white ring-1 ring-brand/10 hover:ring-brand/30 p-5 transition-[background-color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
              >
                <span className="w-12 h-12 rounded-2xl bg-brand/10 text-brand-dark flex items-center justify-center shrink-0">
                  <SocialIcon name="instagram" className="w-6 h-6" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-bold text-lg text-[#2d1a0e]">Instagram</span>
                  <span className="block text-[#5a4538]">{socials[0].note}</span>
                </span>
                <ArrowIcon className="text-brand-dark transition-transform duration-300 group-hover:-translate-x-1" />
              </a>
            </FadeUp>

            <FadeUp y={18} delay={0.26}>
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <span className="text-[#5a4538] ms-1 me-2">אפשר למצוא אותי גם כאן</span>
                {socials.slice(1).map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="w-12 h-12 rounded-full bg-white/70 ring-1 ring-brand/15 text-[#3d2814] flex items-center justify-center transition-[background-color,color,scale] duration-300 hover:bg-brand hover:text-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  >
                    <SocialIcon name={s.key} className="w-5 h-5" />
                  </a>
                ))}
                {urls.youtube && (
                  <a
                    href={urls.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-12 h-12 rounded-full bg-white/70 ring-1 ring-brand/15 text-[#3d2814] flex items-center justify-center transition-[background-color,color,scale] duration-300 hover:bg-brand hover:text-white hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/50"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2 26 26 0 002 12a26 26 0 00.4 4.8 2.5 2.5 0 001.8 1.8c1.6.4 7.8.4 7.8.4s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8A26 26 0 0022 12a26 26 0 00-.4-4.8zM10 15V9l5.2 3L10 15z" />
                    </svg>
                  </a>
                )}
              </div>
            </FadeUp>
          </div>
        </div>

        {/* Photo */}
        <m.div className="relative mx-auto w-full max-w-[400px] md:max-w-none" style={{ y: photoY }}>
          <div aria-hidden className="absolute -inset-10 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.32),transparent)]" />
          <m.div
            className="relative aspect-[4/5] overflow-hidden rounded-t-[999px] rounded-b-[36px] shadow-[0_40px_90px_-40px_rgba(61,40,20,0.55)]"
            initial={reduce ? false : { clipPath: 'inset(100% 0 0 0)' }}
            whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
            viewport={{ once: true, margin: '0px 0px -20% 0px' }}
            transition={{ type: 'spring', bounce: 0, visualDuration: 1.1 }}
          >
            <Image src={PHOTO} alt="טל רומן עם כוס קפה" fill sizes="(min-width: 768px) 45vw, 90vw" className="object-cover object-[35%_center]" />
          </m.div>
        </m.div>
      </div>
    </section>
  )
}
