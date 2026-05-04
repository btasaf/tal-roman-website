'use client'

import { m } from 'framer-motion'

interface LavaBackgroundProps {
  color1?: string
  color2?: string
  color3?: string
  speed?: number // 1 = default, higher = faster
}

export default function LavaBackground({
  color1 = '#2d1a0e',
  color2 = '#7c3000',
  color3 = '#b86000',
  speed = 1,
}: LavaBackgroundProps) {
  const d = (base: number) => base / speed

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{ filter: 'blur(72px) saturate(140%)' }}>
        <m.div
          className="absolute w-[65%] h-[65%] rounded-full opacity-90"
          style={{ background: color1, top: '0%', left: '0%' }}
          animate={{ x: [0, 300, -200, 100, 0], y: [0, 200, -150, 80, 0] }}
          transition={{ duration: d(5), repeat: Infinity, ease: 'easeInOut' }}
        />
        <m.div
          className="absolute w-[55%] h-[55%] rounded-full opacity-80"
          style={{ background: color2, top: '30%', right: '0%' }}
          animate={{ x: [0, -280, 150, -100, 0], y: [0, -200, 250, -80, 0] }}
          transition={{ duration: d(6), repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
        />
        <m.div
          className="absolute w-[50%] h-[50%] rounded-full opacity-80"
          style={{ background: color3, bottom: '0%', left: '20%' }}
          animate={{ x: [0, 250, -300, 150, 0], y: [0, -250, 150, -100, 0] }}
          transition={{ duration: d(7), repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
        />
        <m.div
          className="absolute w-[40%] h-[40%] rounded-full opacity-70"
          style={{ background: color2, top: '15%', left: '40%' }}
          animate={{ x: [0, -200, 300, -150, 0], y: [0, 300, -200, 100, 0] }}
          transition={{ duration: d(5.5), repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
        />
        <m.div
          className="absolute w-[35%] h-[35%] rounded-full opacity-60"
          style={{ background: color1, bottom: '10%', right: '15%' }}
          animate={{ x: [0, 200, -250, 100, 0], y: [0, -200, 180, -120, 0] }}
          transition={{ duration: d(6.5), repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
      </div>
    </div>
  )
}
