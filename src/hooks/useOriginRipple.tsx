'use client'

import { m, useMotionValue, useSpring } from 'framer-motion'

export function useOriginRipple(color = 'rgba(255,255,255,0.35)') {
  const x    = useMotionValue(0)
  const y    = useMotionValue(0)
  const size = useMotionValue(400)
  const raw  = useMotionValue(0)
  const scale = useSpring(raw, { stiffness: 85, damping: 18 })

  const rippleHandlers = {
    onMouseEnter(e: React.MouseEvent<HTMLElement>) {
      const r = e.currentTarget.getBoundingClientRect()
      size.set(Math.ceil(Math.sqrt(r.width ** 2 + r.height ** 2) * 2))
      x.set(e.clientX - r.left)
      y.set(e.clientY - r.top)
      raw.set(1)
    },
    onMouseLeave(e: React.MouseEvent<HTMLElement>) {
      const r = e.currentTarget.getBoundingClientRect()
      x.set(e.clientX - r.left)
      y.set(e.clientY - r.top)
      raw.set(0)
    },
  }

  // Outer span clips to the button shape (borderRadius: inherit).
  // This is more reliable than relying on overflow:hidden + CSS transforms on the parent,
  // which browsers sometimes fail to clip correctly.
  const ripple = (
    <span
      aria-hidden
      style={{
        position:     'absolute',
        inset:        0,
        overflow:     'hidden',
        borderRadius: 'inherit',
        pointerEvents:'none',
      }}
    >
      <m.span
        style={{
          position:     'absolute',
          left:         0,
          top:          0,
          x,
          y,
          translateX:   '-50%',
          translateY:   '-50%',
          scale,
          width:        size,
          height:       size,
          borderRadius: '9999px',
          background:   color,
          pointerEvents:'none',
        }}
      />
    </span>
  )

  return { rippleHandlers, ripple }
}
