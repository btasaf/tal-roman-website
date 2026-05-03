'use client'
import { m } from 'framer-motion'

interface Props {
  children: React.ReactNode
  speed?: number        // seconds for one full loop
  direction?: 'left' | 'right'
  gap?: number          // px gap between items
  className?: string
}

export default function InfiniteMarquee({ children, speed = 30, direction = 'left', gap = 48, className = '' }: Props) {
  const x = direction === 'left' ? [0, '-50%'] : ['-50%', 0]

  return (
    <div className={`overflow-hidden ${className}`} aria-hidden="true">
      <m.div
        className="flex w-max"
        style={{ gap }}
        animate={{ x }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear', repeatType: 'loop' }}
      >
        {/* Duplicate for seamless loop */}
        <div className="flex shrink-0 items-center" style={{ gap }}>{children}</div>
        <div className="flex shrink-0 items-center" style={{ gap }}>{children}</div>
      </m.div>
    </div>
  )
}
