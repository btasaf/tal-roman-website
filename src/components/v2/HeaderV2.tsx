'use client'

import { useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { AuroraBackground, GrainOverlay } from './backgrounds'
import type { SiteSettings } from '@/lib/types'
import { socialUrls } from './site-stats'
import LogoMark from './LogoMark'

const menuItems = [
  { label: 'ייעוץ אישי', href: '/v2/personal-coaching' },
  { label: 'קהילות', href: '/v2/communities' },
  { label: 'קורסים', href: '/v2/courses' },
  { label: 'המלצות', href: '/v2/recommendations' },
  { label: 'מאמרים', href: '/v2/articles' },
  { label: 'תקשורת', href: '/v2/media' },
  { label: 'צור קשר', href: '/v2/contact' },
  { label: 'קצת עלי', href: '/v2/about' },
]

// Icons for the profile links (URLs come from Sanity via socialUrls)
const SOCIAL_ICONS = [
  {
    key: 'instagram',
    label: 'Instagram',
    path: 'M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.3.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1.1.1-1.7.2-2.1.4-.5.2-.9.4-1.3.8-.4.4-.6.8-.8 1.3-.2.4-.3 1-.4 2.1-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2.1.2.5.4.9.8 1.3.4.4.8.6 1.3.8.4.2 1 .3 2.1.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2.1-.4.5-.2.9-.4 1.3-.8.4-.4.6-.8.8-1.3.2-.4.3-1 .4-2.1.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2.1-.2-.5-.4-.9-.8-1.3-.4-.4-.8-.6-1.3-.8-.4-.2-1-.3-2.1-.4C15.5 4 15.1 4 12 4zm0 3.1a4.9 4.9 0 110 9.8 4.9 4.9 0 010-9.8zm0 8a3.1 3.1 0 100-6.2 3.1 3.1 0 000 6.2zm6.2-8.3a1.1 1.1 0 11-2.3 0 1.1 1.1 0 012.3 0z',
  },
  {
    key: 'tiktok',
    label: 'TikTok',
    path: 'M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .6 0 .8.1V9.7a5.8 5.8 0 00-.8-.1 5.7 5.7 0 105.7 5.7V9a7.4 7.4 0 004.3 1.4V7.3a4.3 4.3 0 01-3.2-1.5z',
  },
  {
    key: 'facebook',
    label: 'Facebook',
    path: 'M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    path: 'M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2z',
  },
  {
    key: 'youtube',
    label: 'YouTube',
    path: 'M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z',
  },
] as const

export default function HeaderV2({ settings }: { settings?: SiteSettings | null }) {
  const [isOpen, setIsOpen] = useState(false)
  const urls = socialUrls(settings)
  const socials = SOCIAL_ICONS.flatMap((s) => {
    const href = urls[s.key]
    return href ? [{ ...s, href }] : []
  })

  return (
    <>
      {/* Hamburger button - fixed position */}
      <button
        onClick={() => setIsOpen(true)}
        data-track="menu_open"
        className="fixed top-6 right-6 z-[90] w-12 h-12 rounded-full bg-night/80 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-night transition-colors group"
        aria-label="פתח תפריט"
      >
        <div className="flex flex-col gap-1.5">
          <span className="w-5 h-0.5 bg-cream group-hover:bg-gold transition-colors" />
          <span className="w-5 h-0.5 bg-cream group-hover:bg-gold transition-colors" />
          <span className="w-3 h-0.5 bg-cream group-hover:bg-gold transition-colors ml-auto" />
        </div>
      </button>

      {/* Full screen menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            className="fixed inset-0 z-[100] overflow-hidden bg-[linear-gradient(160deg,#3a2a24_0%,#2d1a0e_45%,#1a0f08_100%)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Warm moving glows + grain, same family as the page backgrounds */}
            <AuroraBackground palette="gray" />
            <GrainOverlay opacity={0.15} blend="soft-light" />
            <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 50% at 50% 45%, rgba(201,120,112,0.18), transparent 70%)' }} />

            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute z-10 top-6 right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
              aria-label="סגור תפריט"
            >
              <svg className="w-6 h-6 text-cream" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Menu items */}
            <div className="relative h-full overflow-y-auto overscroll-contain flex flex-col items-center justify-center-safe gap-6 py-6">
              <m.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', bounce: 0, visualDuration: 0.4 }}>
                <Link href="/v2" onClick={() => setIsOpen(false)} data-track="menu_click" data-track-label="home" aria-label="טל רומן — לדף הבית" className="block mb-2">
                  <LogoMark className="h-14 md:h-16 text-[#C34832] hover:text-gold transition-colors" />
                </Link>
              </m.div>
              {menuItems.map((item, i) => (
                <m.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    data-track="menu_click"
                    data-track-label={item.label}
                    data-track-position={i + 1}
                    className="text-3xl md:text-4xl font-bold text-cream hover:text-gold transition-colors"
                  >
                    {item.label}
                  </Link>
                </m.div>
              ))}

              {/* Social links */}
              <m.div
                className="flex gap-4 mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    data-track="social_click"
                    data-track-network={social.key}
                    data-track-placement="menu"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-cream hover:bg-gold hover:text-night transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={social.path} />
                    </svg>
                  </a>
                ))}
              </m.div>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  )
}
