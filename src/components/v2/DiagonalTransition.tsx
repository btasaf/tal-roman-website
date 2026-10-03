'use client'

import { useRef } from 'react'
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion'

export default function DiagonalTransition() {
  const prefersReducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })

  // The diagonal line moves up as you scroll
  const clipProgress = useTransform(scrollYProgress, [0, 0.5], [100, 30])
  const clipPath = useTransform(clipProgress, (v) => `polygon(0 ${v}%, 100% ${v - 20}%, 100% 100%, 0 100%)`)

  return (
    <div ref={sectionRef} className="relative h-[50vh] -mt-[20vh] z-40">
      {/* Dark section rising up with diagonal edge */}
      <m.div
        className="absolute inset-0 bg-night"
        style={{
          clipPath: prefersReducedMotion
            ? 'polygon(0 50%, 100% 30%, 100% 100%, 0 100%)'
            : clipPath
        }}
      >
        {/* Yard line markers like jjettas */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around items-end pb-8 pointer-events-none">
          <span className="text-[15vw] font-black text-white/[0.03] leading-none">10</span>
          <span className="text-[15vw] font-black text-white/[0.03] leading-none">20</span>
          <span className="text-[15vw] font-black text-white/[0.03] leading-none">30</span>
          <span className="text-[15vw] font-black text-white/[0.03] leading-none">40</span>
        </div>

        {/* Horizontal line */}
        <div className="absolute top-1/2 left-0 right-0 h-px bg-white/10" />
      </m.div>
    </div>
  )
}
