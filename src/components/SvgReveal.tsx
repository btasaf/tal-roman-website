'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform } from 'framer-motion'

interface SvgRevealProps {
  path: string
  color?: string
  strokeWidth?: number
  opacity?: number
  hideOnMobile?: boolean
  strokeLinecap?: 'round' | 'butt' | 'square'
  strokeLinejoin?: 'round' | 'miter' | 'bevel'
}

export default function SvgReveal({
  path,
  color = '#B5A99A',
  strokeWidth = 1.5,
  opacity = 0.5,
  hideOnMobile = true,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
}: SvgRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1])

  if (!path) return null

  return (
    <div
      ref={ref}
      className={`absolute inset-0 pointer-events-none${hideOnMobile ? ' hidden md:block' : ''}`}
      aria-hidden="true"
    >
      <svg
        style={{ width: '100%', height: '100%', overflow: 'visible' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <m.path
          d={path}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          vectorEffect="non-scaling-stroke"
          style={{ pathLength, opacity }}
        />
      </svg>
    </div>
  )
}
