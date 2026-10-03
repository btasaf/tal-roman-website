'use client'

import Image from 'next/image'
import { m } from 'framer-motion'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { ArrowIcon } from '../contact-page/form-ui'

export const SIGNUP_ID = 'gift-form'
export const INSIDE_ID = 'inside'
export const CTA_LABEL = 'לקבלת ההדרכה במתנה'

// The page's call to action: jumps to the email form
export function GiftCta({ tone = 'rose', className = '', label = CTA_LABEL }: { tone?: 'rose' | 'gold'; className?: string; label?: string }) {
  const gold = tone === 'gold'
  return (
    <a
      href={`#${SIGNUP_ID}`}
      data-track="gift_page_cta_click"
      data-track-label={label}
      className={`group inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-full font-bold text-base sm:text-lg px-6 sm:px-8 py-4 transition-[background-color,box-shadow,scale] duration-300 hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-4 ${
        gold
          ? 'bg-gold text-[#2d1a0e] hover:bg-cream shadow-xl shadow-black/20 focus-visible:ring-gold/40'
          : 'bg-brand text-white hover:bg-brand-dark shadow-xl shadow-brand/30 hover:shadow-brand/50 focus-visible:ring-brand/40'
      } ${className}`}
    >
      {label}
      <ArrowIcon className="transition-transform duration-300 group-hover:-translate-x-1" />
    </a>
  )
}

// The gift as a "video cover": the Sanity image in a soft frame, a play mark that breathes, the gift's name
export function GiftCover({
  src,
  title,
  badge,
  size = 'lg',
  priority = false,
}: {
  src: string | null
  title: string
  badge?: string
  size?: 'lg' | 'sm'
  priority?: boolean
}) {
  const reduce = useHydratedReducedMotion()
  const lg = size === 'lg'
  return (
    <div
      className={`relative overflow-hidden bg-[#3d2814] ${lg ? 'aspect-[4/3] rounded-[36px] md:rounded-[44px]' : 'aspect-[16/10] rounded-[24px]'} shadow-[0_40px_90px_-40px_rgba(61,40,20,0.6)]`}
    >
      {src && (
        <Image
          src={src}
          alt=""
          fill
          priority={priority}
          sizes={lg ? '(min-width: 1024px) 560px, (min-width: 768px) 46vw, 92vw' : '(min-width: 1024px) 420px, 92vw'}
          className="object-cover object-center"
        />
      )}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#2d1a0e]/85 via-[#2d1a0e]/20 to-[#2d1a0e]/5" />

      {/* Play mark */}
      <div aria-hidden className={`absolute inset-x-0 top-0 flex items-center justify-center ${lg ? "bottom-[26%]" : "bottom-[30%]"}`}>
        <span className={`relative flex items-center justify-center ${lg ? 'w-20 h-20 md:w-24 md:h-24' : 'w-14 h-14'}`}>
          {!reduce && (
            <m.span
              className="absolute inset-0 rounded-full bg-cream/40"
              initial={{ scale: 1, opacity: 0.6 }}
              animate={{ scale: 1.55, opacity: 0 }}
              transition={{ duration: 2.6, ease: 'easeOut', repeat: Infinity, repeatDelay: 0.6 }}
            />
          )}
          <span className="relative w-full h-full rounded-full bg-cream/95 text-brand flex items-center justify-center shadow-[0_14px_40px_-12px_rgba(0,0,0,0.5)]">
            <svg className={lg ? 'w-8 h-8 md:w-9 md:h-9 -translate-x-[2px]' : 'w-6 h-6 -translate-x-[1px]'} viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5.5v13a1 1 0 001.5.9l10.2-6.5a1 1 0 000-1.8L9.5 4.6A1 1 0 008 5.5z" />
            </svg>
          </span>
        </span>
      </div>

      {badge && (
        <span className={`absolute top-4 right-4 inline-flex items-center gap-2 rounded-full bg-gold text-[#2d1a0e] font-bold ${lg ? 'px-4 py-2 text-sm' : 'px-3 py-1.5 text-xs'}`}>
          <GiftIcon className={lg ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
          {badge}
        </span>
      )}

      <p className={`absolute inset-x-0 bottom-0 text-right text-cream font-sans font-black tracking-[-0.01em] text-balance ${lg ? 'p-6 md:p-8 text-2xl md:text-3xl leading-tight' : 'p-4 text-lg leading-snug'}`}>
        {title}
      </p>
    </div>
  )
}

export function GiftIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="3.5" y="8" width="17" height="4" rx="1" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12v7.5a1 1 0 001 1h12a1 1 0 001-1V12M12 8v12.5M12 8S10.5 3.5 8 4s-1.5 4 4 4zm0 0s1.5-4.5 4-4 1.5 4-4 4z" />
    </svg>
  )
}

export function CheckIcon({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.6} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}
