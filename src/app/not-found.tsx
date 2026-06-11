'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { notFoundSignal } from '@/lib/not-found-signal'

const TOTAL = 4
const CIRCUMFERENCE = 2 * Math.PI * 20

export default function NotFound() {
  const [count, setCount] = useState(TOTAL)
  const router = useRouter()

  useEffect(() => {
    notFoundSignal.set(window.location.href)
    return () => notFoundSignal.clear()
  }, [])

  useEffect(() => {
    if (count === 0) {
      router.push('/')
      return
    }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
  }, [count, router])

  const dashOffset = CIRCUMFERENCE * ((TOTAL - count) / TOTAL)

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6" dir="rtl">
      <div className="text-center max-w-md">

        <p className="font-garamond text-[140px] md:text-[180px] leading-none font-bold select-none text-gold-gradient">
          404
        </p>

        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-16 bg-gold/30" />
          <span className="text-gold/50 text-base">✦</span>
          <div className="h-px w-16 bg-gold/30" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-sand mb-3">
          הדף לא נמצא
        </h1>
        <p className="text-mist text-base leading-relaxed mb-10">
          נראה שהדף שחיפשת לא כאן — אבל הדרך הביתה קצרה
        </p>

        <div className="flex flex-col items-center gap-5">

          <div className="relative w-16 h-16">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="#e6c060"
                strokeOpacity="0.15"
                strokeWidth="3"
              />
              <circle
                cx="24" cy="24" r="20"
                fill="none"
                stroke="#e6c060"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={dashOffset}
                className="transition-[stroke-dashoffset] duration-1000 ease-linear"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-gold font-bold text-xl">
              {count}
            </span>
          </div>

          <Link
            href="/"
            className="inline-block bg-brand text-white font-bold px-10 py-4 rounded-full text-lg shadow-lg shadow-brand/30 hover:bg-brand-dark transition-colors"
          >
            חזרה לדף הבית
          </Link>

          <p className="text-mist text-sm">
            {count > 0 ? `תועבר אוטומטית תוך ${count} שניות` : 'מעביר...'}
          </p>

        </div>
      </div>
    </div>
  )
}
