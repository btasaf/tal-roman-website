import Link from 'next/link'

interface CTAButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  target?: string
  rel?: string
}

export default function CTAButton({ children, href, onClick, className = '', target, rel }: CTAButtonProps) {
  const base = `bg-brand text-white font-bold px-8 py-4 rounded-full hover:bg-brand-dark transition-colors ${className}`

  if (href) {
    if (href.startsWith('http') || href.startsWith('https') || target) {
      return <a href={href} className={base} target={target} rel={rel}>{children}</a>
    }
    return <Link href={href} className={base}>{children}</Link>
  }

  return <button onClick={onClick} className={`${base} cursor-pointer`}>{children}</button>
}
