'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, m } from 'framer-motion'
import { enterSpring } from '../motion-kit'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { GiftCta, GiftIcon } from './gift-ui'

// A slim bar docked at the bottom once the hero is behind, while no other call to action (data-hide-dock)
// and no footer is on screen. Slides up from below; clear of the fixed menu button at the top.
export default function GiftDock() {
  const reduce = useHydratedReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const targets = document.querySelectorAll('[data-hide-dock], footer')
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
    const onScroll = () => {
      const next = window.scrollY > window.innerHeight * 0.6
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
            className="pointer-events-auto w-full sm:w-auto sm:min-w-[480px] max-w-[600px]"
            initial={{ opacity: 0, y: reduce ? 0 : 48 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduce ? 0 : 48 }}
            transition={enterSpring}
          >
            <div className="flex items-center justify-between gap-3 rounded-full bg-[#2d1a0e]/95 backdrop-blur-md ps-5 sm:ps-6 pe-1.5 py-1.5 shadow-[0_24px_50px_-20px_rgba(45,26,14,0.8)] ring-1 ring-cream/10">
              <p className="flex items-center gap-2 text-cream font-bold min-w-0">
                <GiftIcon className="w-5 h-5 text-gold shrink-0" />
                <span className="truncate">הדרכה במתנה</span>
              </p>
              <GiftCta tone="gold" label="שלחו לי" className="!py-3 !px-6 !text-base" />
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
