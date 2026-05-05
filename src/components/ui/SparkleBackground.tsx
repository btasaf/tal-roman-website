'use client'

import { useEffect, useRef } from 'react'

const SPARKLES = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 4 + 2,
  delay: Math.random() * 4,
  duration: Math.random() * 2 + 1.5,
}))

export default function SparkleBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {SPARKLES.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            borderRadius: '50%',
            background: '#c8a020',
            boxShadow: `0 0 ${s.size * 3}px ${s.size}px rgba(200,160,32,0.8)`,
            animation: `sparkle ${s.duration}s ease-in-out ${s.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0.3); }
          50%       { opacity: 0.9; transform: scale(1.6); }
        }
      `}</style>
    </div>
  )
}
