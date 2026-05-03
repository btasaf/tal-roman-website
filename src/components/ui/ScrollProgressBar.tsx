'use client'
import { useScroll, useSpring, m } from 'framer-motion'

export default function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 })

  return (
    <m.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gold z-[200] origin-left"
      style={{ scaleX }}
      aria-hidden="true"
    />
  )
}
