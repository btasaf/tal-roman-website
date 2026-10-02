import { notFound } from 'next/navigation'
import Image from 'next/image'
import { fetchPresalePageBySlug, fetchPresalePages } from '@/lib/queries'
import { urlFor } from '@/sanity/client'
import type { PresalePage } from '@/lib/types'

interface Props {
  params: Promise<{ slug: string }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  const pages = await fetchPresalePages().catch(() => [])
  return pages.map((p) => ({ slug: p.slug }))
}

// Icon components
function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 3l7 3v5c0 5-3.5 8.5-7 10-3.5-1.5-7-5-7-10V6l7-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" />
      <circle cx="12" cy="12" r="2.4" />
    </svg>
  )
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M8.2 8.2c-2.2 0-3.7 1.6-3.7 3.8s1.5 3.8 3.7 3.8c1.7 0 2.6-1.2 3.8-3.8 1.2-2.6 2.1-3.8 3.8-3.8 2.2 0 3.7 1.6 3.7 3.8s-1.5 3.8-3.7 3.8c-1.7 0-2.6-1.2-3.8-3.8-1.2-2.6-2.1-3.8-3.8-3.8z" />
    </svg>
  )
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M5 7.2A2.2 2.2 0 0 1 7.2 5h5.2A2.2 2.2 0 0 1 14.6 7.2v2.6A2.2 2.2 0 0 1 12.4 12H8.6L6.4 14v-1.8A2.2 2.2 0 0 1 5 9.8V7.2z" />
      <path d="M10.2 11.2h5.4A2.2 2.2 0 0 1 17.8 13.4v2.2A2.2 2.2 0 0 1 15.6 17.8H13l-1.8 1.6v-1.6h-1A2.2 2.2 0 0 1 8 15.6v-2.2" />
    </svg>
  )
}

function VideoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="8" />
      <path d="M10.3 8.9v6.2l5.1-3.1z" fill="currentColor" stroke="none" />
    </svg>
  )
}

function FolderIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3.5 8.2A1.7 1.7 0 0 1 5.2 6.5H9l1.6 1.6h7.7A1.7 1.7 0 0 1 20 9.8v7.2a1.7 1.7 0 0 1-1.7 1.7H5.2a1.7 1.7 0 0 1-1.7-1.7V8.2z" />
    </svg>
  )
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  )
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H6M11 7l-5 5 5 5" />
    </svg>
  )
}

const trustIcons: Record<string, React.FC<{ className?: string }>> = {
  lock: LockIcon,
  shield: ShieldIcon,
  eye: EyeIcon,
  heart: HeartIcon,
  check: CheckIcon,
}

const benefitIcons: Record<string, React.FC<{ className?: string }>> = {
  infinity: InfinityIcon,
  chat: ChatIcon,
  video: VideoIcon,
  folder: FolderIcon,
  book: BookIcon,
  clock: ClockIcon,
  star: StarIcon,
}

function renderCourseTitle(title: string, highlight?: string) {
  if (!highlight || !title.includes(highlight)) {
    return <span>{title}</span>
  }
  const parts = title.split(highlight)
  return (
    <>
      {parts[0]}
      <span className="relative inline-block mx-1 -rotate-2 origin-bottom">
        {highlight}
        <span className="absolute bottom-0 left-[2%] right-[2%] h-[3px] bg-presale-red rounded-full -rotate-2" />
      </span>
      {parts[1]}
    </>
  )
}

export default async function PresalePageRoute({ params }: Props) {
  const { slug } = await params
  const page: PresalePage | null = await fetchPresalePageBySlug(slug).catch(() => null)

  if (!page) notFound()

  const bgImageUrl = page.backgroundImage ? urlFor(page.backgroundImage).width(1920).quality(85).url() : null
  const deviceImageUrl = page.deviceImage ? urlFor(page.deviceImage).width(300).quality(90).url() : null

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto lg:overflow-hidden flex flex-col font-sans bg-presale-bg"
      dir="rtl"
    >
      {/* Hero with background */}
      <section
        className="relative flex-1 flex flex-col"
        style={{
          backgroundImage: bgImageUrl ? `url(${bgImageUrl})` : undefined,
          backgroundPosition: 'center 52%',
          backgroundSize: 'cover',
        }}
      >
        {/* Main content area */}
        <main className="flex-1 flex flex-col items-center justify-center lg:justify-start lg:pt-[12vh] px-4 py-8 lg:py-4 lg:w-[57%] lg:mr-auto lg:ml-0">
          {/* Intro */}
          <section className="text-center w-full max-w-[760px] mb-6 lg:mb-4">
            {page.introTitle && (
              <h1 className="text-presale-teal text-2xl md:text-3xl lg:text-[clamp(30px,2.35vw,44px)] font-extrabold leading-tight mb-2">
                {page.introTitle}
              </h1>
            )}
            {page.introSubtitle && (
              <p className="text-presale-gray text-sm md:text-base lg:text-[clamp(14px,1.12vw,18px)] font-medium leading-relaxed whitespace-pre-line">
                {page.introSubtitle}
              </p>
            )}
          </section>

          {/* Body */}
          {page.bodyLines && page.bodyLines.length > 0 && (
            <section className="text-center w-full max-w-[760px] mt-4 lg:mt-6 mb-6 lg:mb-4">
              <div className="text-presale-maroon text-lg md:text-xl lg:text-[clamp(20px,1.8vw,30px)] font-bold leading-relaxed">
                {page.bodyLines.map((line, i) => (
                  <span key={i} className="block">{line}</span>
                ))}
              </div>
            </section>
          )}

          {/* Course info */}
          <section className="text-center w-full max-w-[760px]">
            {page.courseEyebrow && (
              <p className="text-presale-maroon text-sm md:text-base lg:text-[clamp(15px,1.2vw,20px)] font-bold mb-2">
                {page.courseEyebrow}
              </p>
            )}
            {page.courseTitle && (
              <h2 className="inline-block text-presale-red text-2xl md:text-3xl lg:text-[clamp(30px,2.5vw,46px)] font-extrabold leading-none tracking-tight bg-presale-pink rounded-2xl px-5 py-3 mb-3">
                {renderCourseTitle(page.courseTitle, page.courseTitleHighlight)}
              </h2>
            )}
            {page.courseSpecialText && (
              <p className="text-presale-maroon text-sm md:text-base lg:text-[clamp(15px,1.2vw,20px)] font-bold mt-3">
                {page.courseSpecialText}
              </p>
            )}
          </section>
        </main>

        {/* Bottom bar */}
        <section
          className="relative flex flex-col-reverse lg:flex-row items-center justify-between px-4 lg:px-[0.8%] py-6 lg:py-[1.6%] gap-6 lg:gap-0 bg-presale-card"
        >
          {/* Curved top edge - desktop only */}
          <div
            className="hidden lg:block absolute -top-[12%] left-[-3%] right-[-3%] h-[24%] rounded-t-[50%_16%] pointer-events-none bg-presale-card"
          />

          {/* Benefits section - RIGHT side (appears first in RTL) */}
          {page.benefits && page.benefits.length > 0 && (
            <div className="relative flex flex-wrap items-start justify-center gap-3 lg:gap-2 lg:flex-nowrap lg:justify-evenly lg:flex-1 w-full lg:w-auto" dir="rtl">
              {page.benefits.map((benefit, i) => {
                const IconComponent = benefitIcons[benefit.icon] || InfinityIcon
                return (
                  <div
                    key={i}
                    className={`w-[calc(50%-0.75rem)] max-w-[200px] lg:w-auto lg:max-w-none lg:flex-1 text-center px-1.5 lg:px-2 text-presale-teal-dark ${i < page.benefits!.length - 1 ? 'lg:border-l lg:border-presale-teal-dark/20' : ''}`}
                  >
                    <IconComponent className="w-7 h-7 lg:w-8 lg:h-8 mx-auto mb-1.5 stroke-presale-red" />
                    <p className="font-bold text-sm lg:text-[clamp(14px,1.1vw,18px)] leading-tight">
                      {benefit.title}
                    </p>
                    {benefit.description && (
                      <p className="text-[10px] lg:text-[clamp(11px,0.78vw,13px)] font-medium leading-tight mt-0.5 whitespace-pre-line">
                        {benefit.description}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {/* Purchase section - LEFT side */}
          <div className="relative flex flex-col items-center gap-4 lg:flex-1 w-full lg:w-auto">
            {/* CTA + Price + Device row - LTR order: button, amount, image */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-12 sm:gap-28 w-full" dir="ltr">
              {/* CTA Button */}
              {page.ctaButtonText && (
                <a
                  href={page.ctaButtonLink || '#'}
                  className="inline-flex items-center justify-center gap-3 bg-presale-red-cta text-white font-bold text-base lg:text-[clamp(16px,1.15vw,20px)] px-7 py-3.5 rounded-full hover:bg-presale-red-dark transition-colors"
                  dir="rtl"
                >
                  <span>{page.ctaButtonText}</span>
                  <ArrowIcon className="w-5 h-5" />
                </a>
              )}

              {/* Price */}
              {(page.priceNew || page.priceOld) && (
                <div className="flex items-center gap-3" dir="ltr">
                  {page.priceNew && (
                    <span className="text-presale-red text-3xl lg:text-[clamp(34px,2.7vw,48px)] font-extrabold leading-none tracking-tight">
                      {page.priceNew}
                      <span className="text-[0.46em] font-bold mr-0.5">&#8362;</span>
                    </span>
                  )}
                  {page.priceOld && (
                    <span className="text-presale-gray-light text-base lg:text-[clamp(16px,1.15vw,20px)] font-semibold line-through bg-presale-bubble px-3 py-1.5 rounded-full">
                      {page.priceOld}
                      <span className="text-[0.72em]">&#8362;</span>
                    </span>
                  )}
                </div>
              )}

              {/* Device image */}
              {deviceImageUrl && (
                <div className="hidden sm:block">
                  <Image
                    src={deviceImageUrl}
                    alt="מחשב וטלפון"
                    width={158}
                    height={64}
                    className="object-contain max-h-16"
                  />
                </div>
              )}
            </div>

            {/* Trust badges */}
            {page.trustBadges && page.trustBadges.length > 0 && (
              <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap">
                {page.trustBadges.map((badge, i) => {
                  const IconComponent = trustIcons[badge.icon] || LockIcon
                  return (
                    <div key={i} className="flex items-center gap-2.5 text-presale-teal-dark font-bold text-base lg:text-[clamp(15px,1.1vw,19px)] whitespace-nowrap">
                      <IconComponent className="w-5 h-5 lg:w-[24px] lg:h-[24px]" />
                      <span>{badge.text}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  )
}
