'use client'
import { useRef } from 'react'
import { m, useInView } from 'framer-motion'

interface Props {
  children: React.ReactNode
  direction?: 'left' | 'right' | 'up' | 'down'
  delay?: number
  duration?: number
  className?: string
}

const clipStart = {
  left:  'inset(0 100% 0 0)',
  right: 'inset(0 0 0 100%)',
  up:    'inset(100% 0 0 0)',
  down:  'inset(0 0 100% 0)',
}

// Reveals children with a sliding clip-path wipe animation on scroll
export default function WipeReveal({ children, direction = 'right', delay = 0, duration = 0.9, className = '' }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-80px' })

  return (
    <m.div
      ref={ref}
      className={className}
      initial={{ clipPath: clipStart[direction] }}
      animate={inView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
      transition={{ duration, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </m.div>
  )
}
