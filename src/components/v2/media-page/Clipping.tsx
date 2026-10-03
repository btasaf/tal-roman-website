'use client'

import { useState } from 'react'
import Image from 'next/image'
import { AnimatePresence, m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ExternalIcon, viewport } from '../recommendations-page/motion'
import { ACTION_LABEL, KIND_LABEL, type MediaItem } from './media-data'

// Press clipping, the media page's card (same language as the homepage media section): warm newsprint with a
// faint grain, the outlet as a serif masthead over a double rule, a framed photo in one warm sepia tone, and a
// serif headline. Clippings whose photo is intimate are set in type only. Each one is "placed on the table" as it
// scrolls in: it settles from a slightly larger tilt into its resting angle.

export const INK = '#2d1a0e'
export const PAPER_BG = '#F4EDE1'
// One static warm tone for every photo: unifies the mixed CMS screenshots and keeps them calm
export const IMG_TONE = '[filter:sepia(0.5)_saturate(0.55)_contrast(1.04)]'

const PAPER_GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.31  0 0 0 0 0.24  0 0 0 0 0.16  0 0 0 0.1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")"

export function Paper({ edge = true }: { edge?: boolean }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 pointer-events-none ${edge ? 'shadow-[inset_0_0_48px_rgba(120,88,48,0.13)]' : ''}`}
      style={{ backgroundImage: PAPER_GRAIN, backgroundSize: '180px 180px' }}
    />
  )
}

// "ב-ynet", "בחדשות 12"
export const atOutlet = (outlet: string) => (outlet ? `ב${/^[A-Za-z0-9]/.test(outlet) ? '-' : ''}${outlet}` : '')

const SURFACE =
  'relative overflow-hidden rounded-[3px] shadow-[0_18px_40px_-16px_rgba(20,12,6,0.55),0_3px_8px_rgba(20,12,6,0.14)] transition-shadow duration-300'

export function Masthead({ item, size = 'md' }: { item: MediaItem; size?: 'md' | 'lg' }) {
  return (
    <div className="flex items-end justify-between gap-3 pb-2 border-b-[3px] border-double border-[#2d1a0e]/75">
      <span className={`font-frank font-bold leading-none truncate ${size === 'lg' ? 'text-[26px] md:text-[32px]' : 'text-[21px] md:text-[23px]'}`}>
        <bdi dir="auto">{item.outlet || KIND_LABEL[item.kind]}</bdi>
      </span>
      <span className="shrink-0 pb-0.5 text-[11px] font-medium tracking-[0.12em] text-[#6e5f52]">{KIND_LABEL[item.kind]}</span>
    </div>
  )
}

export function Photo({ item, className = '', sizes }: { item: MediaItem; className?: string; sizes: string }) {
  if (!item.image) return null
  return (
    <div className={`${className.includes('absolute') ? '' : 'relative '}overflow-hidden ${IMG_TONE} ${className}`} style={item.image.bg ? { background: item.image.bg } : undefined}>
      <Image src={item.image.src} alt="" fill sizes={sizes} className={`${item.image.contain ? 'object-contain' : 'object-cover'} transition-transform duration-700 ease-out group-hover:scale-[1.04]`} />
      <div aria-hidden className="absolute inset-0 ring-1 ring-inset ring-[#2d1a0e]/20" />
      {item.kind === 'video' && (
        <span aria-hidden className="absolute bottom-3 right-3 w-11 h-11 rounded-full bg-[#2d1a0e]/80 text-cream flex items-center justify-center backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
          <PlayGlyph />
        </span>
      )}
    </div>
  )
}

// The play symbol is universal, so it keeps pointing right even in RTL
export function PlayGlyph({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={`translate-x-[1px] ${className}`} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" />
    </svg>
  )
}

function Placed({ children, rotate, delay = 0, className = '' }: { children: React.ReactNode; rotate: number; delay?: number; className?: string }) {
  const reduce = useHydratedReducedMotion()
  return (
    <m.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 46, rotate: rotate + (rotate >= 0 ? 4 : -4), scale: 1.03 }}
      whileInView={{ opacity: 1, y: 0, rotate, scale: 1 }}
      viewport={viewport}
      transition={reduce ? { duration: 0 } : { ...enterSpring, visualDuration: 0.9, delay }}
      style={reduce ? { rotate } : undefined}
    >
      {children}
    </m.div>
  )
}

// A clipping that links out to the story
export default function Clipping({ item, rotate = 0, delay = 0 }: { item: MediaItem; rotate?: number; delay?: number }) {
  if (item.embed) return <PlayableClipping item={item} rotate={rotate} delay={delay} />
  return (
    <Placed rotate={rotate} delay={delay}>
      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        data-track="media_clipping_click"
        data-track-outlet={item.outlet}
        data-track-kind={item.kind}
        data-track-placement="clipping"
        className="group block focus-visible:outline-none"
      >
        <article className={`${SURFACE} group-hover:shadow-[0_26px_54px_-16px_rgba(20,12,6,0.65),0_0_0_1px_rgba(168,90,84,0.45)] group-focus-visible:ring-2 group-focus-visible:ring-[#e6c060] group-focus-visible:ring-offset-4 group-focus-visible:ring-offset-transparent`} style={{ background: PAPER_BG, color: INK }}>
          <Paper />
          <div className="relative flex flex-col px-5 pt-4 pb-4 md:px-6 md:pt-5 text-right">
            <Masthead item={item} />
            {item.image ? (
              <>
                <Photo item={item} className="mt-3.5 aspect-[4/3]" sizes="(max-width: 640px) 88vw, (max-width: 1024px) 44vw, 340px" />
                <h3 className="mt-3.5 font-frank font-bold text-[21px] md:text-[23px] leading-[1.18]">{item.title}</h3>
                {item.dek && <p className="mt-1.5 text-[14px] leading-[1.6] text-[#6e5f52]">{item.dek}</p>}
              </>
            ) : (
              <TypeOnly item={item} />
            )}
            <div className="mt-4 pt-2.5 flex items-center justify-between gap-3 border-t border-[#2d1a0e]/15">
              <span className="text-[12px] text-[#6e5f52] truncate">
                <bdi dir="auto">{item.outlet}</bdi>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[14px] font-bold text-[#a85a54] whitespace-nowrap">
                {ACTION_LABEL[item.kind]}
                <ExternalIcon />
                <span className="sr-only">(נפתח בחלון חדש)</span>
              </span>
            </div>
          </div>
        </article>
      </a>
    </Placed>
  )
}

// No photo: a big serif headline over a thin rule, the story line as a standfirst, and the rest of the page
// as two soft, out-of-focus text columns
function TypeOnly({ item }: { item: MediaItem }) {
  return (
    <div className="mt-5">
      <h3 className="font-frank font-black text-[30px] md:text-[34px] leading-[1.08]">{item.title}</h3>
      {item.dek && <p className="mt-4 pr-3 border-r-[3px] border-[#a85a54]/70 text-[15px] leading-[1.6] text-[#4e4036]">{item.dek}</p>}
      <div aria-hidden className="mt-5 grid grid-cols-2 gap-4">
        {[0, 1].map((c) => (
          <div key={c} className="space-y-[7px]">
            {(c ? [100, 96, 100, 58] : [100, 92, 100, 97, 70]).map((w, i) => (
              <span key={i} className="block h-[4px] rounded-full bg-[#2d1a0e]/[0.09]" style={{ width: w + "%" }} />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Podcasts / videos with an embeddable player: press play to load it inside the clipping
function PlayableClipping({ item, rotate, delay }: { item: MediaItem; rotate: number; delay: number }) {
  const [playing, setPlaying] = useState(false)
  const reduce = useHydratedReducedMotion()
  if (!item.embed) return null
  const youtube = item.embed.provider === 'youtube'
  return (
    <Placed rotate={playing ? 0 : rotate} delay={delay}>
      <article className={SURFACE} style={{ background: PAPER_BG, color: INK }}>
        <Paper />
        <div className="relative flex flex-col px-5 pt-4 pb-4 md:px-6 md:pt-5 text-right">
          <Masthead item={item} />
          <div className={`relative mt-3.5 ${youtube ? 'aspect-video' : 'aspect-[4/3]'}`}>
            <AnimatePresence initial={false} mode="popLayout">
              {playing ? (
                <m.div
                  key="player"
                  className={`absolute inset-0 overflow-hidden ${youtube ? 'bg-black' : 'rounded-[12px] bg-[#2d1a0e] flex items-center'}`}
                  initial={reduce ? false : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
                  animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
                  transition={reduce ? { duration: 0 } : { type: 'spring', bounce: 0, visualDuration: 0.5 }}
                >
                  <iframe
                    src={item.embed.src}
                    title={`${item.title}: נגן`}
                    className={youtube ? 'absolute inset-0 w-full h-full' : 'w-full h-[152px]'}
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                  />
                </m.div>
              ) : (
                <m.button
                  key="cover"
                  type="button"
                  onClick={() => setPlaying(true)}
                  data-track="media_play"
                  data-track-outlet={item.outlet}
                  data-track-kind={item.kind}
                  data-track-placement="cover"
                  className="group absolute inset-0 block w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a85a54] focus-visible:ring-offset-2"
                  exit={reduce ? { opacity: 0 } : { opacity: 0, transition: { duration: 0.2 } }}
                  aria-label={`${ACTION_LABEL[item.kind]} כאן: ${item.title}`}
                >
                  <Photo item={{ ...item, kind: 'article' }} className="absolute inset-0" sizes="(max-width: 640px) 88vw, 340px" />
                  <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                    <span className="w-16 h-16 rounded-full bg-[#2d1a0e]/85 text-cream flex items-center justify-center shadow-xl backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                      <PlayGlyph className="w-6 h-6" />
                    </span>
                  </span>
                </m.button>
              )}
            </AnimatePresence>
          </div>
          <h3 className="mt-3.5 font-frank font-bold text-[21px] md:text-[23px] leading-[1.18]">{item.title}</h3>
          {item.dek && <p className="mt-1.5 text-[14px] leading-[1.6] text-[#6e5f52]">{item.dek}</p>}
          <div className="mt-4 pt-2.5 flex items-center justify-between gap-3 border-t border-[#2d1a0e]/15">
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              data-track={playing ? undefined : 'media_play'}
              data-track-outlet={item.outlet}
              data-track-kind={item.kind}
              data-track-placement="button"
              aria-pressed={playing}
              className="inline-flex items-center gap-1.5 py-2.5 -my-2.5 text-[14px] font-bold text-[#2d1a0e] hover:text-[#a85a54] transition-colors rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a85a54]"
            >
              {playing ? 'סגירת הנגן' : `${ACTION_LABEL[item.kind]} כאן`}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              data-track="media_clipping_click"
              data-track-outlet={item.outlet}
              data-track-kind={item.kind}
              data-track-placement="external"
              className="inline-flex items-center gap-1.5 py-2.5 -my-2.5 text-[14px] font-bold text-[#a85a54] whitespace-nowrap hover:underline underline-offset-4 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a85a54]"
            >
              {youtube ? 'ב-YouTube' : 'ב-Spotify'}
              <ExternalIcon />
              <span className="sr-only">(נפתח בחלון חדש)</span>
            </a>
          </div>
        </div>
      </article>
    </Placed>
  )
}
