import type { Testimonial } from '@/lib/types'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { SectionTitle } from '../motion-kit'
import { Unclip } from './motion'

// Real testimonials from Sanity written about this course (matched by course name in the page).
// A calm grid of quote cards that unclip upward one after another.
export default function PresaleVoices({ testimonials }: { testimonials: Testimonial[] }) {
  const list = testimonials.filter((t) => t.body?.trim())
  if (!list.length) return null

  return (
    <section className="relative bg-cream pt-16 md:pt-24 pb-12 md:pb-16 overflow-x-clip">
      <div aria-hidden className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
        <AuroraBackground palette="blush" />
      </div>
      <GrainOverlay />

      <div className="relative px-5 md:px-8">
        <SectionTitle kicker="מהלב שלהם" title="מה אמרו מי שכבר למדו" accent="שכבר למדו" />
      </div>

      <ul className={`relative mt-14 md:mt-16 max-w-6xl mx-auto px-5 md:px-8 grid grid-cols-1 gap-4 md:gap-5 ${list.length >= 4 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
        {list.map((t, i) => (
          <li key={i} className="flex">
            <Unclip delay={(i % 2) * 0.1 + Math.floor(i / 2) * 0.05} className="flex w-full">
              <figure className="relative w-full rounded-[28px] bg-white/80 ring-1 ring-brand/10 px-7 pt-12 pb-7 md:px-9 md:pt-14 text-right shadow-[0_30px_70px_-45px_rgba(168,90,84,0.6)]">
                <span aria-hidden className="absolute top-3 right-7 md:right-9 font-garamond text-7xl leading-none text-brand/30 select-none">
                  ”
                </span>
                <blockquote className="text-lg md:text-xl leading-relaxed text-[#3d2814] whitespace-pre-line text-pretty">{t.body}</blockquote>
                <figcaption className="mt-5 flex items-center gap-3 text-sm font-bold text-brand-dark">
                  <span aria-hidden className="w-6 h-[2px] rounded-full bg-gold" />
                  {t.name}
                </figcaption>
              </figure>
            </Unclip>
          </li>
        ))}
      </ul>
    </section>
  )
}
