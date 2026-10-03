'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { BuyButton, Price } from './ui'

// A slim price + purchase bar docked at the bottom while no other purchase button is on screen
// (the hero's and the closing card's are marked data-hide-dock) and the footer isn't in view.
// Slides up from below; stays out of the way of the fixed menu button at the top.
export default function PresaleDock({ href, label, now, was }: { href: string; label: string; now?: number; was?: number }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-hide-dock], footer')
    if (!targets.length) return
    const onScreen = new Set<Element>()
    let started = false
    const update = () => setShow(started && onScreen.size === 0)

    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) onScreen.add(e.target)
        else onScreen.delete(e.target)
      }
      update()
    })
    targets.forEach((t) => io.observe(t))

    // Only after the visitor has actually scrolled (never on first paint)
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.5
      if (next !== started) {
        started = next
        update()
      }
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div className="fixed inset-x-3 bottom-3 z-[80] flex justify-center pointer-events-none">
      <AnimatePresence>
        {show && (
          <m.div
            key="dock"
            className="pointer-events-auto w-full sm:w-[560px]"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 48 }}
            transition={enterSpring}
          >
            <div className="flex items-center justify-between gap-3 rounded-full bg-[#2d1a0e]/95 backdrop-blur-md ps-5 pe-1.5 py-1.5 shadow-[0_24px_50px_-20px_rgba(45,26,14,0.8)] ring-1 ring-cream/10">
              <Price now={now} was={was} tone="dark" size="sm" />
              <BuyButton href={href} label={label} tone="gold" size="sm" placement="dock" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
