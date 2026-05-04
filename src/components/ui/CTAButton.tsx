'use client'
import Link from 'next/link'
import MagneticButton from '@/components/ui/MagneticButton'

interface CTAButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  target?: string
  rel?: string
}

export default function CTAButton({ children, href, onClick, className = '', target, rel }: CTAButtonProps) {
  const base = `bg-brand text-white font-bold px-7 py-3 rounded-xl hover:bg-brand-dark transition-colors ${className}`

  let inner: React.ReactNode
  if (href) {
    if (href.startsWith('http') || href.startsWith('https') || target) {
      inner = <a href={href} className={base} target={target} rel={rel}>{children}</a>
    } else {
      inner = <Link href={href} className={base}>{children}</Link>
    }
  } else {
    inner = <button onClick={onClick} className={`${base} cursor-pointer`}>{children}</button>
  }

  return <>{inner}</>
}
