import Image from 'next/image'
import { PHOTO } from '../about/about-content'
import { FadeUp } from './motion'
import { QuizButton } from './ui'

// A short personal note in the middle of the article, between two sections: the gift quiz.
// Quiet on purpose (light card, no motion beyond a soft fade) so it doesn't break the reading.
export default function InlineCta({ position }: { position?: number }) {
  return (
    <FadeUp y={16} className="my-14 md:my-16">
      <aside
        aria-label="מתנה ממני"
        data-hide-dock
        data-track="quiz_cta_click"
        data-track-placement="article_inline"
        data-track-position={position}
        className="relative overflow-hidden rounded-[28px] bg-[#fffaf0] ring-1 ring-[#c97870]/20 shadow-[0_30px_60px_-40px_rgba(61,40,20,0.4)] p-6 sm:p-8 md:p-9"
      >
        <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(60% 80% at 0% 100%, rgba(230,192,96,0.18), transparent 70%), radial-gradient(50% 70% at 100% 0%, rgba(201,120,112,0.12), transparent 70%)' }} />
        <div className="relative">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-[#1a0c06] ring-2 ring-white shadow-md shrink-0">
              <Image src={PHOTO.closing} alt="" fill sizes="48px" className="object-cover object-[50%_20%]" />
            </div>
            <p className="text-sm font-bold text-brand-dark">רגע לפני שממשיכים</p>
          </div>
          <p className="mt-4 font-sans font-black tracking-[-0.01em] text-[#2d1a0e] text-[1.4rem] md:text-[1.75rem] leading-snug text-balance">
            רוצים הדרכה שמתאימה בדיוק <span className="font-garamond font-bold text-brand">לכם</span>?
          </p>
          <div className="mt-2 flex flex-col md:flex-row md:items-center md:justify-between gap-5 md:gap-8">
            <p className="text-base md:text-lg leading-relaxed text-[#48443f]">3 שאלות קצרות, ותקבלו ממני הדרכה במתנה.</p>
            <QuizButton className="self-start shrink-0" />
          </div>
        </div>
      </aside>
    </FadeUp>
  )
}
