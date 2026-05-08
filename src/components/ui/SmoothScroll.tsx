'use client'
import { useEffect } from 'react'

// Lightweight lerp-based smooth scroll — desktop/mouse only, degrades gracefully on touch
export default function SmoothScroll() {
  useEffect(() => {
    // Only on pointer-fine (mouse) devices
    if (!window.matchMedia('(pointer: fine)').matches) return

    let current = window.scrollY
    let target = window.scrollY
    let rafId: number
    const ease = 0.1

    // קפיצה פתאומית (Home, End, PgUp, PgDn, עוגן) — מסנכרן מיד
    function onScroll() {
      const jump = Math.abs(window.scrollY - current)
      if (jump > 60) {
        current = window.scrollY
        target = window.scrollY
      }
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      target += e.deltaY
      target = Math.max(0, Math.min(target, document.documentElement.scrollHeight - window.innerHeight))
    }

    function loop() {
      const diff = target - current
      if (Math.abs(diff) > 0.15) {
        current += diff * ease
        window.scrollTo(0, current)
      }
      rafId = requestAnimationFrame(loop)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })
    rafId = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
