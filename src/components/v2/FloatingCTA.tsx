'use client'

import { useEffect, useState } from 'react'
import { m, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'

export default function FloatingCTA() {
  const [show, setShow] = useState(false)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero (100vh)
      const scrollY = window.scrollY
      const threshold = window.innerHeight
      setShow(scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <m.div
          className="fixed bottom-6 left-1/2 z-50"
          initial={prefersReducedMotion ? { opacity: 1, x: '-50%', y: 0 } : { opacity: 0, x: '-50%', y: 20 }}
          animate={{ opacity: 1, x: '-50%', y: 0 }}
          exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <Link
            href="/v2/quiz"
            className="flex items-center gap-3 bg-brand text-white font-bold px-6 py-3 rounded-full shadow-lg shadow-brand/40 hover:bg-brand-dark hover:shadow-brand/60 transition-all duration-300"
          >
            <span>לקבל הדרכה חינם</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="rotate-180"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </m.div>
      )}
    </AnimatePresence>
  )
}
