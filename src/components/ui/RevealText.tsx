'use client'
import { useRef } from 'react'
import { m, useInView } from 'framer-motion'

interface Props {
  text: string
  className?: string
  delay?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  stagger?: number
}

// Each word slides up through a clip mask — the classic editorial text reveal
export default function RevealText({ text, className = '', delay = 0, as: Tag = 'span', stagger = 0.055 }: Props) {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref as React.RefObject<Element>, { once: true, margin: '-60px' })
  const words = text.split(' ')

  const content = words.map((word, i) => (
    <span key={i} className="inline-block overflow-hidden" style={{ verticalAlign: 'bottom' }}>
      <m.span
        className="inline-block"
        initial={{ y: '110%', opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : {}}
        transition={{
          duration: 0.7,
          delay: delay + i * stagger,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {word}{i < words.length - 1 ? ' ' : ''}
      </m.span>
    </span>
  ))

  return (
    <Tag ref={ref as never} className={className}>
      {content}
    </Tag>
  )
}
