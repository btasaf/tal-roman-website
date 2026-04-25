'use client'

import { m } from 'framer-motion'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { fadeInUp } from '@/lib/animations'
import BokehBackground from '@/components/ui/BokehBackground'
import SectionBackground from '@/components/ui/SectionBackground'

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-sand text-xl md:text-2xl leading-loose mb-6 last:mb-0">
        {children}
      </p>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-gold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
  },
}

type Block = { _type: string; _key: string; [key: string]: unknown }

export default function PersonalMessage({ message, bgImage }: { message: Block[] | string; bgImage?: object | null }) {
  return (
    <section className="py-24 bg-dusk relative overflow-hidden">
      <SectionBackground image={bgImage} />
      <BokehBackground />

      <div className="relative max-w-3xl mx-auto px-4 text-center">
        <m.div {...fadeInUp} transition={{ duration: 0.7 }}>
          {Array.isArray(message) ? (
            <PortableText value={message} components={components} />
          ) : (
            <p className="text-sand text-xl md:text-2xl leading-loose whitespace-pre-line">
              {message}
            </p>
          )}
        </m.div>
      </div>
    </section>
  )
}
