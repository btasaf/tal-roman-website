'use client'

import { useRef } from 'react'
import { m, useInView } from 'framer-motion'
import Image from 'next/image'

const bulletPoints = [
  { prefix: 'לחוות', bold: 'אקסטזה מינית', suffix: 'שנמשכת שעות' },
  { prefix: 'לגלם', bold: 'מצבי תודעה מיסטיים', suffix: 'מאורגזמה' },
  { prefix: 'להרגיש', bold: 'בטוחים לחלוטין באינטימיות', suffix: 'עם האהוב/ה שלכם' },
]

export default function TantricPlaygroundSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' })

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 md:py-24 bg-[#faf5eb]"
    >
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Text Content - appears on right in RTL */}
          <m.div
            className="order-2 md:order-1"
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            {/* Main Heading */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#2d1a0e] leading-tight mb-8 font-garamond">
              היכנסו ל
              <span className="underline decoration-[#c9a050] decoration-2 underline-offset-4">
                מגרש המשחקים הטנטרי
              </span>
              {' '}שבו תוכלו...
            </h2>

            {/* Bullet Points */}
            <ul className="space-y-4 mb-10">
              {bulletPoints.map((point, index) => (
                <m.li
                  key={index}
                  className="flex items-start gap-3 text-lg md:text-xl text-[#3d2814]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                >
                  <span className="text-xl mt-0.5">✨</span>
                  <span>
                    {point.prefix}{' '}
                    <strong className="font-bold">{point.bold}</strong>{' '}
                    {point.suffix}
                  </span>
                </m.li>
              ))}
            </ul>

            {/* Secondary Heading */}
            <m.h3
              className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#2d1a0e] leading-tight mb-6 font-garamond"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              הדברים האלה לא נוצרו{' '}
              <br className="hidden md:block" />
              עבור{' '}
              <span className="underline decoration-[#c9a050] decoration-2 underline-offset-4">
                &quot;המעטים הנבחרים&quot;
              </span>
              ...
            </m.h3>

            {/* Paragraphs */}
            <m.div
              className="space-y-4 text-lg md:text-xl text-[#3d2814] leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <p>
                ...כולנו נוצרנו עבור{' '}
                <strong className="font-bold">מיניות מרהיבה</strong>{' '}
                ומערכות יחסים עמוקות.
              </p>
              <p>
                בעוד ש
                <strong className="font-bold">דרך רוחנית-מינית אמיתית</strong>{' '}
                מתפתחת לאורך חיים שלמים...
              </p>
            </m.div>

            {/* Final Statement */}
            <m.p
              className="text-xl md:text-2xl text-[#2d1a0e] leading-relaxed mt-8 font-medium"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              אפילו רק{' '}
              <strong className="font-bold">15 דקות</strong>{' '}
              של התרגולים הנכונים
              <br />
              יכולות{' '}
              <strong className="font-bold">לשנות את חיי המין שלכם לנצח</strong>.
            </m.p>
          </m.div>

          {/* Oval Image - appears on left in RTL */}
          <m.div
            className="order-1 md:order-2 flex justify-center"
            initial={{ opacity: 0, scale: 0.92, filter: 'blur(12px)' }}
            animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : {}}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <div className="relative w-[320px] h-[480px] md:w-[390px] md:h-[580px] lg:w-[485px] lg:h-[720px]">
              <Image
                src="/wix-assets/images/tal-photos/IMG_4932_2048px.jpg"
                alt="טל רומן"
                fill
                className="object-cover object-top rounded-[45%/50%] shadow-2xl"
                sizes="(max-width: 768px) 320px, (max-width: 1024px) 390px, 485px"
              />
              {/* Decorative border rings */}
              <div className="absolute inset-0 rounded-[45%/50%] border-2 border-[#c9a050]/35 scale-[1.03]" />
              <div className="absolute inset-0 rounded-[45%/50%] border border-[#c9a050]/12 scale-[1.07]" />
            </div>
          </m.div>
        </div>
      </div>
    </section>
  )
}
