'use client'

import Link from 'next/link'
import { m } from 'framer-motion'
import type { SiteSettings } from '@/lib/types'
import { GrainOverlay } from './backgrounds'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'
import { socialUrls } from './site-stats'
import LogoMark from './LogoMark'

// The v2 footer: a slim, quiet sign-off (the page already ends with a full contact section, the menu holds
// every link and the docked button holds the quiz CTA). Two tiers: wordmark + a short link row + socials,
// then the legal line. A dark sheet with soft rounded shoulders rises out of the cream above.

const ACCESSIBILITY_HREF = '/v2/accessibility'
const PRIVACY_HREF = '/v2/privacy'

const LINKS = [
  { href: '/v2/personal-coaching', label: 'ליווי אישי' },
  { href: '/v2/courses', label: 'קורסים' },
  { href: '/v2/articles', label: 'מאמרים' },
  { href: '/v2/recommendations', label: 'המלצות' },
  { href: '/v2/communities', label: 'קהילות' },
  { href: '/v2/about', label: 'קצת עלי' },
]

const ICON_PATHS: Record<string, string> = {
  tiktok:
    'M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .6 0 .8.1V9.7a5.8 5.8 0 00-.8-.1 5.7 5.7 0 105.7 5.7V9a7.4 7.4 0 004.3 1.4V7.3a4.3 4.3 0 01-3.2-1.5z',
  facebook:
    'M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z',
  whatsapp:
    'M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3.9 2.5c.1.2 1.6 2.5 4 3.5 1.5.6 2 .7 2.8.6.4-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.2z',
  youtube:
    'M21.6 7.2a2.5 2.5 0 00-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 002.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 001.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 001.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z',
}

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#2d1a0e]'

interface Props {
  settings: SiteSettings | null
  year: number
}

export default function FooterV2({ settings, year }: Props) {
  const reduce = useHydratedReducedMotion()
  const urls = socialUrls(settings)
  const socials = [
    { label: 'Instagram', href: urls.instagram, icon: 'instagram' },
    { label: 'TikTok', href: urls.tiktok, icon: 'tiktok' },
    { label: 'Facebook', href: urls.facebook, icon: 'facebook' },
    ...(urls.youtube ? [{ label: 'YouTube', href: urls.youtube, icon: 'youtube' }] : []),
    ...(urls.whatsapp ? [{ label: 'WhatsApp', href: urls.whatsapp, icon: 'whatsapp' }] : []),
  ]

  return (
    <m.footer
      // The docked quiz button steps aside while the footer is on screen, so it never covers the legal links
      data-hide-dock
      className="relative z-[70] overflow-hidden rounded-t-[24px] md:rounded-t-[40px] bg-[#2d1a0e] text-cream"
      initial={reduce ? false : { opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', bounce: 0, visualDuration: 0.6 }}
    >
      {/* Thin gold line along the top edge: the only accent */}
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <GrainOverlay opacity={0.09} blend="soft-light" />

      {/* Extra bottom room on phones so the docked quiz button never covers the legal line */}
      <div className="relative max-w-6xl mx-auto px-6 pt-10 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pt-10 md:pb-6">
        {/* Tier 1: wordmark · links · socials */}
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between md:gap-8">
          <Link href="/v2" className={`group inline-flex items-center gap-2.5 py-1 font-sans font-black text-[22px] leading-none tracking-[-0.01em] text-cream hover:text-gold transition-colors rounded ${focusRing}`}>
            <LogoMark className="h-9 text-[#C34832] group-hover:text-gold transition-colors" />
            טל רומן
          </Link>

          <nav aria-label="ניווט תחתון">
            <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2 md:gap-x-7">
              {LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} data-track="footer_link_click" data-track-label={l.label} className={`text-[15px] text-cream/70 hover:text-gold transition-colors rounded ${focusRing}`}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="flex items-center gap-2" aria-label="רשתות חברתיות">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  data-track="social_click"
                  data-track-network={s.icon}
                  data-track-placement="footer"
                  rel="noopener noreferrer"
                  aria-label={`${s.label} (נפתח בחלון חדש)`}
                  className={`w-11 h-11 rounded-full ring-1 ring-cream/15 flex items-center justify-center text-cream/75 hover:text-gold hover:ring-gold/40 transition-colors ${focusRing}`}
                >
                  {s.icon === 'instagram' ? (
                    <InstagramIcon />
                  ) : (
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d={ICON_PATHS[s.icon]} />
                    </svg>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Tier 2: legal */}
        <div className="mt-8 md:mt-7 pt-5 border-t border-cream/10 flex flex-col-reverse items-center gap-3 text-[13px] text-cream/50 md:flex-row md:justify-between">
          <p>© {year} טל רומן. כל הזכויות שמורות.</p>
          <ul className="flex items-center gap-5">
            <li>
              <Link href={ACCESSIBILITY_HREF} className={`hover:text-gold transition-colors rounded ${focusRing}`}>
                הצהרת נגישות
              </Link>
            </li>
            <li>
              <Link href={PRIVACY_HREF} className={`hover:text-gold transition-colors rounded ${focusRing}`}>
                מדיניות פרטיות
              </Link>
            </li>
            <li>
              <Link href="/v2/terms" className={`hover:text-gold transition-colors rounded ${focusRing}`}>
                תנאי שימוש
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </m.footer>
  )
}

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}
