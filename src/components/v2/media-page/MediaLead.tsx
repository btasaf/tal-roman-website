'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { m, useMotionValue, useScroll, useTransform } from 'framer-motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ExternalIcon, FadeUp, viewport } from '../recommendations-page/motion'
import { enterSpring } from '../motion-kit'
import { ACTION_LABEL, KIND_LABEL, type MediaItem } from './media-data'
import { IMG_TONE, INK, PAPER_BG, Paper, PlayGlyph, atOutlet } from './Clipping'

// The lead story, set like a front page on newsprint: a nameplate between double rules, the photo opening
// from a slit as it scrolls in (and settling from a slight zoom), then a large serif headline.
export default function MediaLead({ item }: { item: MediaItem }) {
  const reduce = useHydratedReducedMotion()
  const reduceMv = useMotionValue(false)
  useEffect(() => reduceMv.set(reduce), [reduce, reduceMv])

  const photoRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: photoRef, offset: ['start end', 'center 0.55'] })
  const clip = useTransform(() => {
    if (reduceMv.get()) return 'inset(0% 0% 0% 0%)'
    const e = Math.min(1, scrollYProgress.get() * 1.1)
    const v = (1 - e) * 22
    return `inset(${v.toFixed(2)}% ${(v * 0.6).toFixed(2)}% ${v.toFixed(2)}% ${(v * 0.6).toFixed(2)}%)`
  })
  const scale = useTransform(() => (reduceMv.get() ? 1 : 1.14 - 0.14 * Math.min(1, scrollYProgress.get())))

  return (
    <section aria-labelledby="lead-title" className="relative overflow-hidden" style={{ background: PAPER_BG, color: INK }}>
      <Paper edge={false} />
      <div className="relative max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-20 md:pb-28">
        {/* Nameplate */}
        <FadeUp y={14}>
          <div className="border-y-[3px] border-double border-[#2d1a0e]/75 py-3 flex items-center justify-between gap-4">
            <span className="text-[12px] md:text-[13px] font-medium tracking-[0.14em] text-[#6e5f52]">הכתבה הראשית</span>
            <span className="font-frank font-black text-2xl md:text-4xl leading-none">טל רומן בתקשורת</span>
            <span className="text-[12px] md:text-[13px] font-medium tracking-[0.14em] text-[#6e5f52]">
              <bdi dir="auto">{item.outlet}</bdi>
            </span>
          </div>
        </FadeUp>

        <div className="mt-10 md:mt-14 grid md:grid-cols-[1.25fr_1fr] gap-10 md:gap-14 items-center">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={-1}
            data-track="media_clipping_click"
            data-track-outlet={item.outlet}
            data-track-kind={item.kind}
            data-track-placement="lead_image"
            aria-hidden
            className="group block"
          >
            <m.div ref={photoRef} className="relative aspect-[4/3] overflow-hidden" style={{ clipPath: clip }}>
              {item.image && (
                <m.div className={`absolute inset-0 ${IMG_TONE}`} style={{ scale }}>
                  <Image src={item.image.src} alt="" fill sizes="(max-width: 768px) 92vw, 620px" className={item.image.contain ? 'object-contain' : 'object-cover'} style={item.image.bg ? { background: item.image.bg } : undefined} />
                </m.div>
              )}
              <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[#2d1a0e]/25" />
              {item.kind === 'video' && (
                <span aria-hidden className="absolute bottom-5 right-5 w-16 h-16 rounded-full bg-[#2d1a0e]/80 text-cream flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                  <PlayGlyph className="w-6 h-6" />
                </span>
              )}
            </m.div>
          </a>

          <div className="text-right">
            <FadeUp y={12}>
              <p className="text-[13px] font-bold tracking-[0.12em] text-[#a85a54]">{KIND_LABEL[item.kind]}</p>
            </FadeUp>
            <m.h2
              id="lead-title"
              className="mt-3 font-frank font-black text-[2.6rem] sm:text-5xl lg:text-[4.2rem] leading-[1.02]"
              initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 26 }}
              whileInView={{ clipPath: 'inset(0 0 -14% 0)', y: 0 }}
              viewport={viewport}
              transition={reduce ? { duration: 0 } : { ...enterSpring, delay: 0.1 }}
            >
              {item.title}
            </m.h2>
            <span aria-hidden className="mt-6 block w-14 h-[3px] bg-[#a85a54]" />
            {item.dek && (
              <FadeUp delay={0.15} y={14}>
                <p className="mt-6 text-lg md:text-xl leading-relaxed text-[#4e4036]">{item.dek}</p>
              </FadeUp>
            )}
            <FadeUp delay={0.25} y={14}>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                data-track="media_clipping_click"
                data-track-outlet={item.outlet}
                data-track-kind={item.kind}
                data-track-placement="lead_button"
                className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#2d1a0e] text-cream font-bold px-7 py-3.5 shadow-xl shadow-[#2d1a0e]/20 transition-[background-color,scale] duration-300 hover:bg-[#3d2814] hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#a85a54]/40"
              >
                {ACTION_LABEL[item.kind]} {atOutlet(item.outlet)}
                <ExternalIcon className="w-4 h-4" />
                <span className="sr-only">(נפתח בחלון חדש)</span>
              </a>
            </FadeUp>
          </div>
        </div>
      </div>
    </section>
  )
}
