'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants'
import SocialIconLink from '@/components/ui/SocialIconLink'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setHidden(true)
      } else if (currentScrollY < lastScrollY.current) {
        setHidden(false)
      }
      lastScrollY.current = currentScrollY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function isActive(href: string) {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 bg-cream/95 backdrop-blur-md border-b border-gold/30 transition-transform duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      {/* Desktop — 3-column grid: logo(right) | nav(center) | media(left) */}
      <div className="hidden md:grid grid-cols-[1fr_auto_1fr] w-full px-[100px] h-20 items-center">

        {/* col-1 → RIGHT in RTL — logo */}
        <div className="flex items-center justify-start">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="text-2xl font-extrabold text-gold tracking-wide">טל רומן</span>
            <Image src="/logo.png" alt="טל רומן" width={40} height={40} className="rounded-full" priority />
          </Link>
        </div>

        {/* col-2 — nav links centered */}
        <nav className="flex items-center justify-center gap-10">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-2 text-xl font-semibold whitespace-nowrap transition-colors relative
                ${isActive(l.href)
                  ? 'text-brand font-bold after:absolute after:bottom-0 after:right-0 after:left-0 after:h-[2px] after:bg-brand after:rounded-full'
                  : 'text-ink hover:text-brand'
                }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* col-3 → LEFT in RTL — social media icons */}
        <div className="flex items-center justify-end gap-3">
          {SOCIAL_LINKS.map((s) => (
            <div key={s.icon} className="p-2">
              <SocialIconLink href={s.href} label={s.label} icon={s.icon} size={24} className="text-black hover:text-brand" />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile — logo + hamburger */}
      <div className="md:hidden max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button
          className="text-ink p-2"
          onClick={() => setOpen(!open)}
          aria-label="תפריט"
        >
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current mb-1.5" />
          <span className="block w-5 h-0.5 bg-current" />
        </button>

        <Link href="/" className="flex items-center gap-2.5">
          <span className="text-2xl font-extrabold text-gold tracking-wide">טל רומן</span>
          <Image src="/logo.png" alt="טל רומן" width={38} height={38} className="rounded-full" priority />
        </Link>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-cream border-t border-gold/30 px-6 py-5 flex flex-col gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`py-3 font-semibold text-lg transition-colors border-b border-gold/10 last:border-0
                ${isActive(l.href) ? 'text-brand font-bold' : 'text-ink hover:text-brand'}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-3 pt-3">
            {SOCIAL_LINKS.map((s) => (
              <div key={s.icon} className="p-2">
                <SocialIconLink href={s.href} label={s.label} icon={s.icon} size={24} className="text-black hover:text-brand" />
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
