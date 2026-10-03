import type { ReactNode } from 'react'
import { AuroraBackground, GrainOverlay } from './backgrounds'

// Shared layout for the v2 legal pages (accessibility statement, privacy policy):
// calm cream page, a clear title, comfortable reading width, no motion.
export default function LegalPageV2({
  kicker,
  title,
  updated,
  children,
}: {
  kicker: string
  title: string
  updated: ReactNode
  children: ReactNode
}) {
  return (
    <div className="relative bg-cream min-h-svh overflow-x-clip">
      <div aria-hidden className="absolute inset-x-0 top-0 h-[70svh] pointer-events-none [mask-image:linear-gradient(to_bottom,black,transparent)]">
        <AuroraBackground palette="cream" />
        <GrainOverlay />
      </div>

      <article className="relative max-w-3xl mx-auto px-6 pt-28 md:pt-36 pb-24 text-right text-[#3d2814]">
        <p className="inline-flex items-center gap-2 rounded-full bg-brand/10 text-brand-dark px-3.5 py-1.5 text-sm font-bold mb-5">
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-brand" />
          {kicker}
        </p>
        <h1 className="font-sans font-black tracking-[-0.01em] leading-[1.1] text-[#2d1a0e] text-4xl md:text-6xl">{title}</h1>
        <p className="mt-4 text-sm text-[#5a4538]">עודכן לאחרונה: {updated}</p>

        <div className="mt-12 space-y-10 text-lg leading-relaxed text-pretty [&_h2]:font-sans [&_h2]:font-black [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:text-[#2d1a0e] [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pr-6 [&_ul]:space-y-2 [&_a]:text-brand-dark [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-brand">
          {children}
        </div>
      </article>
    </div>
  )
}

// Visible marker for details Tal still needs to fill in / confirm
export function ToFill({ children }: { children: ReactNode }) {
  return <mark className="rounded bg-gold/35 px-1 text-[#2d1a0e]">[{children}]</mark>
}
