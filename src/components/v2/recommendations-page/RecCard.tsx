'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { viewport } from './motion'
import type { RecItem } from './rec-data'

// One voice on the wall: the words, who wrote them, and a small "receipt" of the original message that opens
// it full size. Three surfaces keep the long wall in rhythm: white, warm paper, and deep brown.
export type CardTone = 'white' | 'paper' | 'dark'

export function toneFor(i: number): CardTone {
  if (i % 7 === 3) return 'dark'
  if (i % 5 === 1) return 'paper'
  return 'white'
}

const SURFACE: Record<CardTone, string> = {
  white: 'bg-white/90 text-[#3d2814] shadow-[0_14px_40px_-18px_rgba(168,90,84,0.32)] ring-1 ring-brand/10',
  paper: 'bg-[#f7ead2] text-[#3d2814] shadow-[0_14px_40px_-18px_rgba(120,80,40,0.3)] ring-1 ring-[#2d1a0e]/[0.06]',
  dark: 'bg-[#2d1a0e] text-cream shadow-[0_18px_44px_-18px_rgba(45,26,14,0.7)]',
}

export default function RecCard({ item, index, onOpen }: { item: RecItem; index: number; onOpen: (id: string) => void }) {
  const reduce = useHydratedReducedMotion()
  // Every few cards, the original message leads (portrait screenshots only, always on white)
  const lead = toneFor(index) !== 'dark' && index % 6 === 4 && !!item.shot && item.shot.h > item.shot.w
  const tone: CardTone = lead ? 'white' : toneFor(index)
  const dark = tone === 'dark'
  const big = item.body.length < 60 // short, punchy lines read larger

  return (
    <m.article
      className={`relative break-inside-avoid mb-5 rounded-[26px] p-6 md:p-7 text-right ${SURFACE[tone]}`}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={reduce ? { duration: 0 } : { ...enterSpring, delay: (index % 3) * 0.07 }}
    >
      {lead && <ShotHeader item={item} onOpen={onOpen} />}
      <span aria-hidden className={`block font-garamond font-bold text-6xl leading-[0.55] h-7 ${dark ? 'text-gold/60' : 'text-brand/45'}`}>”</span>
      <p className={`mt-3 whitespace-pre-line ${big ? 'text-xl md:text-[1.4rem] font-bold leading-snug' : 'text-[16px] md:text-[17px] leading-relaxed'}`}>{item.body}</p>

      <div className={`mt-6 pt-5 border-t flex items-center gap-3 ${dark ? 'border-cream/10' : 'border-brand/10'}`}>
        <span aria-hidden className={`w-11 h-11 rounded-full font-garamond font-extrabold text-xl flex items-center justify-center shrink-0 ${dark ? 'bg-gold/15 text-gold' : 'bg-brand/15 text-brand-dark'}`}>
          {item.name.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className={`font-bold truncate ${dark ? 'text-cream' : 'text-[#2d1a0e]'}`}>{item.name}</p>
          {item.course && <p className={`text-sm truncate ${dark ? 'text-cream/75' : 'text-[#6f5546]'}`}>{item.course}</p>}
        </div>
        {item.shot && !lead && <Receipt item={item} dark={dark} onOpen={onOpen} />}
      </div>
    </m.article>
  )
}

// The original message as the card's header: the top of the screenshot, fading into the card
function ShotHeader({ item, onOpen }: { item: RecItem; onOpen: (id: string) => void }) {
  if (!item.shot) return null
  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      data-track="rec_lightbox_open"
      data-track-name={item.name}
      data-track-placement="card_header"
      aria-label={`הצגת ההודעה המקורית של ${item.name}`}
      aria-haspopup="dialog"
      className="group relative block -mx-2 -mt-2 md:-mx-3 md:-mt-3 mb-6 w-[calc(100%+1rem)] md:w-[calc(100%+1.5rem)] h-56 overflow-hidden rounded-[20px] bg-[#f1e7d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand"
    >
      <Image src={item.shot.src} alt="" fill sizes="(max-width: 640px) 90vw, 360px" className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-white/95 to-transparent" />
      <span aria-hidden className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-brand text-white text-[13px] font-bold px-3 py-1.5 shadow transition-transform duration-300 group-hover:-translate-y-0.5">
        <EyeIcon className="w-4 h-4" />
        ההודעה המקורית
      </span>
    </button>
  )
}

// The original message, as a small tilted thumbnail: it straightens and lifts on hover / focus
function Receipt({ item, dark, onOpen }: { item: RecItem; dark: boolean; onOpen: (id: string) => void }) {
  if (!item.shot) return null
  return (
    <button
      type="button"
      onClick={() => onOpen(item.id)}
      data-track="rec_lightbox_open"
      data-track-name={item.name}
      data-track-placement="card_thumb"
      aria-label={`הצגת ההודעה המקורית של ${item.name}`}
      aria-haspopup="dialog"
      className={`group relative shrink-0 w-[58px] h-[72px] rounded-[10px] p-[3px] rotate-[-5deg] transition-[rotate,translate,box-shadow] duration-300 hover:rotate-0 hover:-translate-y-1 focus-visible:rotate-0 focus-visible:outline-none focus-visible:ring-2 ${
        dark ? 'bg-cream/90 shadow-[0_8px_18px_-6px_rgba(0,0,0,0.6)] focus-visible:ring-gold' : 'bg-white shadow-[0_8px_18px_-8px_rgba(61,40,20,0.45)] ring-1 ring-[#2d1a0e]/[0.06] focus-visible:ring-brand'
      }`}
    >
      <span className="relative block w-full h-full overflow-hidden rounded-[7px] bg-[#f3ece0]">
        <Image src={item.shot.thumb} alt="" fill sizes="58px" className="object-cover object-top" />
      </span>
      <span aria-hidden className={`absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center shadow ${dark ? 'bg-gold text-[#2d1a0e]' : 'bg-brand text-white'}`}>
        <EyeIcon className="w-3.5 h-3.5" />
      </span>
    </button>
  )
}

export function EyeIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
