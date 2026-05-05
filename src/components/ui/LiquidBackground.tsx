'use client'

import { useEffect, useRef } from 'react'

export default function LiquidBackground() {
  const blob1Ref = useRef<HTMLDivElement>(null)
  const blob2Ref = useRef<HTMLDivElement>(null)
  const blob3Ref = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let animFrame: number
    let mouseX = 0.5
    let mouseY = 0.5
    let currentX1 = 0.3, currentY1 = 0.2
    let currentX2 = 0.7, currentY2 = 0.7
    let currentX3 = 0.5, currentY3 = 0.5

    const handleMouseMove = (e: MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect()
      if (!rect) return
      mouseX = (e.clientX - rect.left) / rect.width
      mouseY = (e.clientY - rect.top) / rect.height
    }

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const animate = () => {
      currentX1 = lerp(currentX1, mouseX * 0.8 + 0.1, 0.03)
      currentY1 = lerp(currentY1, mouseY * 0.8 + 0.05, 0.03)
      currentX2 = lerp(currentX2, (1 - mouseX) * 0.8 + 0.1, 0.025)
      currentY2 = lerp(currentY2, (1 - mouseY) * 0.8 + 0.1, 0.025)
      currentX3 = lerp(currentX3, mouseX * 0.5 + 0.25, 0.02)
      currentY3 = lerp(currentY3, mouseY * 0.5 + 0.25, 0.02)

      if (blob1Ref.current) {
        blob1Ref.current.style.left = `${currentX1 * 100}%`
        blob1Ref.current.style.top  = `${currentY1 * 100}%`
      }
      if (blob2Ref.current) {
        blob2Ref.current.style.left = `${currentX2 * 100}%`
        blob2Ref.current.style.top  = `${currentY2 * 100}%`
      }
      if (blob3Ref.current) {
        blob3Ref.current.style.left = `${currentX3 * 100}%`
        blob3Ref.current.style.top  = `${currentY3 * 100}%`
      }

      animFrame = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animFrame = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animFrame)
    }
  }, [])

  return (
    <div ref={sectionRef} className="absolute inset-0 overflow-hidden pointer-events-none bg-[#3a2608]">
      <div
        ref={blob1Ref}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[55%] h-[70%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(192,80,48,0.85) 0%, rgba(138,40,0,0.6) 45%, transparent 70%)',
          filter: 'blur(70px)',
          left: '30%', top: '20%',
        }}
      />
      <div
        ref={blob2Ref}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[45%] h-[60%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(230,192,96,0.5) 0%, rgba(176,120,48,0.35) 45%, transparent 70%)',
          filter: 'blur(80px)',
          left: '70%', top: '70%',
        }}
      />
      <div
        ref={blob3Ref}
        className="absolute -translate-x-1/2 -translate-y-1/2 w-[35%] h-[45%] rounded-full"
        style={{
          background: 'radial-gradient(ellipse, rgba(160,60,20,0.6) 0%, transparent 65%)',
          filter: 'blur(60px)',
          left: '50%', top: '50%',
        }}
      />
    </div>
  )
}
