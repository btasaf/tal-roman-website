'use client'

import { useRef, useState } from 'react'
import { useScroll, useMotionValueEvent, m, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { urlFor } from '@/sanity/client'

interface GalleryItem {
  image: object | null
  headline: string
  body: string
}

interface ScrollGalleryProps {
  items: GalleryItem[]
}

export default function ScrollGallery({ items }: ScrollGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start start', 'end end'] })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const idx = Math.min(Math.floor(v * items.length), items.length - 1)
    setActiveIndex(idx)
  })

  if (!items?.length) return null

  const activeItem = items[activeIndex]
  const imageUrl = activeItem.image ? urlFor(activeItem.image).width(600).height(700).url() : null

  return (
    <section className="bg-[#fff8e1]">
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#303030] mb-4">
          אולי את.ה מרגיש.ה
        </h2>
        <p className="text-[#4f4f4f] text-lg max-w-xl mx-auto">
          כדי להבין אם אנחנו מתאימים — קרא.י ותרגיש.י אם זה מדבר אלייך
        </p>
      </div>

      {/* Desktop: scroll-linked sticky layout */}
      <div ref={containerRef} className="hidden md:block relative" style={{ minHeight: `${items.length * 80}vh` }}>
        <div className="sticky top-[calc(50%-240px)] h-[480px] flex items-stretch max-w-6xl mx-auto px-4">
          {/* Sticky image */}
          <div className="relative w-[45%] rounded-[24px] overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
              <m.div
                key={activeIndex}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {imageUrl ? (
                  <Image src={imageUrl} alt={activeItem.headline} fill className="object-cover" sizes="45vw" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#e6c060]/30 to-[#cd2c2c]/20" />
                )}
              </m.div>
            </AnimatePresence>
          </div>

          {/* Text list */}
          <div className="flex-1 flex flex-col justify-center pr-12">
            {items.map((item, i) => (
              <m.div
                key={i}
                className={`py-6 border-b border-[#e6c060]/20 cursor-default transition-all duration-300 ${
                  i === activeIndex ? 'opacity-100' : 'opacity-30'
                }`}
                animate={{ x: i === activeIndex ? 8 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className={`text-2xl font-bold mb-2 transition-colors ${
                  i === activeIndex ? 'text-[#303030]' : 'text-[#4f4f4f]'
                }`}>
                  {item.headline}
                </h3>
                {i === activeIndex && (
                  <m.p
                    className="text-[#4f4f4f] text-base leading-relaxed"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.body}
                  </m.p>
                )}
              </m.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile: CSS scroll-snap carousel */}
      <div className="md:hidden overflow-x-auto snap-x snap-mandatory flex gap-4 px-4 pb-8" style={{ scrollbarWidth: 'none' }}>
        {items.map((item, i) => {
          const imgUrl = item.image ? urlFor(item.image).width(400).height(400).url() : null
          return (
            <div key={i} className="snap-center flex-shrink-0 w-[80vw] bg-white rounded-[24px] overflow-hidden shadow-lg">
              <div className="relative h-48">
                {imgUrl ? (
                  <Image src={imgUrl} alt={item.headline} fill className="object-cover" sizes="80vw" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-[#e6c060]/30 to-[#cd2c2c]/20" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-[#303030] mb-2">{item.headline}</h3>
                <p className="text-[#4f4f4f] text-sm leading-relaxed">{item.body}</p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
