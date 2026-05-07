'use client'
import Link from 'next/link'
import { useOriginRipple } from '@/hooks/useOriginRipple'

interface CTAButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  target?: string
  rel?: string
  variant?: 'brand' | 'gold' | 'outline'
}

const variants = {
  brand:   'bg-brand text-white',
  gold:    'bg-gold text-night',
  outline: 'bg-transparent border-2 border-brand text-brand',
}

const rippleColors = {
  brand:   'rgba(255,255,255,0.35)',
  gold:    'rgba(255,255,255,0.35)',
  outline: 'rgba(201,120,112,0.2)',
}

export default function CTAButton({ children, href, onClick, className = '', target, rel, variant = 'brand' }: CTAButtonProps) {
  const { rippleHandlers, ripple } = useOriginRipple(rippleColors[variant])

  const base = `relative overflow-hidden font-bold px-7 py-3 rounded-xl transition-colors ${variants[variant]} ${className}`
  const inner = <><span className="relative">{children}</span>{ripple}</>

  if (href) {
    if (href.startsWith('http') || href.startsWith('https') || target) {
      return <a href={href} className={base} target={target} rel={rel} {...rippleHandlers}>{inner}</a>
    }
    return <Link href={href} className={base} {...rippleHandlers}>{inner}</Link>
  }

  return (
    <button onClick={onClick} className={`${base} cursor-pointer`} {...rippleHandlers}>
      {inner}
    </button>
  )
}
