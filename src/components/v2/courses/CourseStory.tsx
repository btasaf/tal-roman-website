'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { m, useScroll, useTransform } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import type { CourseView } from './course-view'
import CourseCta from './CourseCta'
import { enterSpring } from '../motion-kit'
import { FadeUp, SectionTitle, inView } from './motion'
import { Emph, Icon } from './ui'

const AVATAR = '/wix-assets/images/tal-photos/VV9A8369%20copy_edited.jpg'

const portable: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="text-pretty">{children}</p>,
    h2: ({ children }) => <h3 className="font-sans font-black text-2xl md:text-3xl text-[#2d1a0e] pt-2">{children}</h3>,
    h3: ({ children }) => <h3 className="font-sans font-black text-xl md:text-2xl text-[#2d1a0e] pt-2">{children}</h3>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-[#2d1a0e]">{children}</strong>,
    em: ({ children }) => <strong className="font-bold text-brand-dark">{children}</strong>,
  },
  list: { bullet: ({ children }) => <ul className="space-y-2 pr-5 list-disc marker:text-brand">{children}</ul> },
}

// The longer text ("full details" + description from Sanity), set like a letter. A sticky heading with Tal's
// signature on the right; on the left the lines brighten one by one as they reach the reading line
// (scroll-linked opacity only), checklists and the description card rise in.
export default function CourseStory({ course }: { course: CourseView }) {
  const { details, description } = course
  if (!details.length && !description) return null
  const firstLines = details.find((b) => b.kind === 'lines')

  return (
    <section id="details" className="relative px-5 md:px-8 pt-20 md:pt-32 pb-16 md:pb-24 scroll-mt-4">
      <GrainOverlay />
      <div className="relative max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[0.75fr_1.25fr] gap-10 lg:gap-20">
        <div className="text-right lg:sticky lg:top-28 lg:self-start">
          <SectionTitle kicker="כמה מילים ממני" title="פרטים נוספים" accent="נוספים" align="start" />
          <FadeUp delay={0.15} y={14}>
            <div className="mt-8 inline-flex items-center gap-4 rounded-full bg-white/70 ring-1 ring-brand/10 pe-6 ps-1.5 py-1.5 shadow-[0_10px_30px_-18px_rgba(168,90,84,0.5)]">
              <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-white shrink-0">
                <Image src={AVATAR} alt="" fill sizes="48px" className="object-cover object-top" />
              </div>
              <p className="font-bold text-[#2d1a0e]">טל רומן</p>
            </div>
          </FadeUp>
        </div>

        <div className="text-right min-w-0">
          <div className="space-y-8 md:space-y-10">
            {details.map((block, bi) => {
              if (block.kind === 'heading') {
                return (
                  <FadeUp key={bi} y={18}>
                    <h3 className="font-sans font-black text-2xl md:text-3xl text-[#2d1a0e] text-balance">{block.text}</h3>
                  </FadeUp>
                )
              }
              if (block.kind === 'checks') {
                return <CheckList key={bi} items={block.items} />
              }
              const isFirst = block === firstLines
              return (
                <div key={bi} className="space-y-2 md:space-y-2.5">
                  {block.lines.map((line, li) => (
                    <StoryLine key={li} text={line} lead={isFirst && li === 0 && line.length <= 110} />
                  ))}
                </div>
              )
            })}
          </div>

          {description && (
            <FadeUp y={30} className="mt-12">
              <div className="relative rounded-[32px] bg-white/80 ring-1 ring-brand/10 shadow-[0_30px_70px_-40px_rgba(168,90,84,0.55)] p-7 md:p-10 overflow-hidden">
                <span aria-hidden className="absolute top-0 right-0 w-1.5 h-full bg-gradient-to-b from-gold via-brand to-transparent" />
                <div className="space-y-4 text-lg md:text-xl leading-relaxed text-[#3d2814]">
                  <PortableText value={description} components={portable} />
                </div>
              </div>
            </FadeUp>
          )}

          {course.ctaUrl && (
            <FadeUp y={18} className="mt-12">
              <CourseCta href={course.ctaUrl} label={course.ctaLabel} slug={course.slug} placement="story" className="w-full sm:w-auto sm:max-w-[36rem]" />
            </FadeUp>
          )}
        </div>
      </div>
    </section>
  )
}

function CheckList({ items }: { items: string[] }) {
  const reduce = useHydratedReducedMotion()
  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {items.map((item, i) => (
        <m.li
          key={i}
          className="flex items-start gap-3 rounded-2xl bg-white/70 ring-1 ring-brand/10 px-5 py-4 text-base md:text-lg text-[#3d2814] leading-snug"
          initial={reduce ? false : { opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={inView}
          transition={{ ...enterSpring, delay: (i % 2) * 0.06 }}
        >
          <span className="shrink-0 mt-0.5 w-7 h-7 rounded-full bg-brand/12 text-brand-dark flex items-center justify-center">
            <Icon name="check" className="w-4 h-4" />
          </span>
          <span className="text-pretty">{item}</span>
        </m.li>
      ))}
    </ul>
  )
}

function StoryLine({ text, lead }: { text: string; lead: boolean }) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLParagraphElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 92%', 'start 62%'] })
  const opacity = useTransform(() => (reduce ? 1 : 0.28 + 0.72 * scrollYProgress.get()))
  return (
    <m.p
      ref={ref}
      style={{ opacity }}
      className={`text-pretty ${lead ? 'font-sans font-black text-[1.7rem] md:text-4xl leading-[1.25] text-[#2d1a0e] pb-2' : 'text-xl md:text-[1.6rem] leading-[1.6] font-medium text-[#3d2814]'}`}
    >
      <Emph text={text} />
    </m.p>
  )
}
