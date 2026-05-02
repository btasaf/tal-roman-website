'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { NAV_LINKS, SOCIAL_LINKS } from '@/lib/constants'
import SocialIconLink from '@/components/ui/SocialIconLink'

export default function Nav() {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

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
              className="text-ink hover:text-brand transition-colors text-xl font-semibold whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* col-3 → LEFT in RTL — social media icons */}
        <div className="flex items-center justify-end gap-5">
          {SOCIAL_LINKS.map((s) => (
            <SocialIconLink key={s.icon} href={s.href} label={s.label} icon={s.icon} size={28} className="text-black hover:text-brand" />
          ))}
        </div>
      </div>

      {/* Mobile — logo + hamburger */}
      <div className="md:hidden max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <button
          className="text-white/80 p-2"
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
        <div className="md:hidden bg-cream border-t border-gold/30 px-6 py-5 flex flex-col gap-5">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-ink hover:text-brand font-semibold text-lg transition-colors"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <div className="flex items-center gap-4 pt-1 border-t border-gold/30">
            {SOCIAL_LINKS.map((s) => (
              <SocialIconLink key={s.icon} href={s.href} label={s.label} icon={s.icon} size={26} className="text-black hover:text-brand" />
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
