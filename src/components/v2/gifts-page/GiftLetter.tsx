'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import type { Gift } from '@/lib/types'
import LogoMark from '../LogoMark'
import { FadeUp } from '../coaching/motion'
import { Kicker } from '../coaching/ui'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { m } from 'framer-motion'
import { enterSpring } from '../motion-kit'

// No italics on Hebrew: Sanity's `em` becomes a colour accent
const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-[#3d2814]/90 text-lg md:text-xl leading-[1.85] mb-6 last:mb-0 text-pretty">{children}</p>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-[#2d1a0e]">{children}</strong>,
    em: ({ children }) => <span className="font-bold text-brand-dark">{children}</span>,
  },
}

// Who it's for (the gift's own words, in the visitor's voice) and the personal letter from Sanity
export default function GiftLetter({ title, audience, body }: { title: string; audience?: string; body?: Gift['mainBody'] }) {
  const reduce = useHydratedReducedMotion()
  return (
    <section className="relative px-5 md:px-8 pt-16 md:pt-24 pb-20 md:pb-28">
      <div className="relative max-w-3xl mx-auto">
        <div className="text-center">
          <FadeUp y={10}>
            <Kicker>{audience ? `למי זה מתאים · ${audience}` : 'למי זה מתאים'}</Kicker>
          </FadeUp>
          <p className="mt-6 text-lg md:text-xl text-[#5a4538]">ההדרכה הזו בשבילך, אם הרגשת פעם:</p>
          <m.h2
            className="mt-4 font-garamond font-bold text-brand text-4xl md:text-6xl leading-[1.15] text-balance"
            initial={reduce ? false : { clipPath: 'inset(0 0 100% 0)', y: 26 }}
            whileInView={{ clipPath: 'inset(0 0 -14% 0)', y: 0 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ ...enterSpring, delay: 0.08 }}
          >
            ״{title}״
          </m.h2>
        </div>

        {body && body.length > 0 && (
          <FadeUp y={28} delay={0.1} className="mt-14 md:mt-20">
            <div className="relative rounded-[36px] bg-white/75 ring-1 ring-brand/10 shadow-[0_30px_80px_-40px_rgba(168,90,84,0.45)] px-6 py-10 sm:px-10 md:px-14 md:py-14 text-right">
              <span aria-hidden className="absolute -top-7 right-8 md:right-12 w-14 h-14 rounded-full bg-cream ring-1 ring-brand/15 flex items-center justify-center font-garamond text-5xl leading-none text-brand pt-4">
                ”
              </span>
              <PortableText value={body} components={components} />
              <div className="mt-10 pt-6 border-t border-brand/10 flex items-center justify-between gap-4">
                <span className="font-garamond font-bold text-3xl text-[#2d1a0e]">טל</span>
                <LogoMark className="h-10 text-[#C34832]" />
              </div>
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  )
}
