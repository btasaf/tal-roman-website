'use client'
import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'

interface Props {
  children: React.ReactNode
  speed?: number    // 0.1 = barely moves, 0.5 = half speed, negative = opposite direction
  className?: string
}

// Wraps children so they move at a different rate than the page scroll
export default function ParallaxWrapper({ children, speed = 0.3, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}px`, `${speed * 100}px`])

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <m.div style={{ y }}>{children}</m.div>
    </div>
  )
}
