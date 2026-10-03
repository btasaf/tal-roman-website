import { PRONOUNS } from './quiz-config'

// Small line icons for each answer value. 24×24, stroke = currentColor.
const PATHS: Record<string, React.ReactNode> = {
  // "for me" — a spark
  self: (
    <>
      <path d="M12 3.5c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5 3.9-.6 5.9-2.6 6.5-6.5Z" />
      <path d="M18.5 16.5c.2 1.3.9 2 2.2 2.2-1.3.2-2 .9-2.2 2.2-.2-1.3-.9-2-2.2-2.2 1.3-.2 2-.9 2.2-2.2Z" />
    </>
  ),
  // "for us" — two overlapping hearts
  partner: (
    <>
      <path d="M8.6 18.6C5.2 16.2 2.5 13.7 2.5 10.4 2.5 8.6 3.9 7.2 5.7 7.2c1.2 0 2.3.7 2.9 1.7.6-1 1.7-1.7 2.9-1.7" />
      <path d="M15.4 19.8c-3.4-2.4-6.1-4.9-6.1-8.2 0-1.8 1.4-3.2 3.2-3.2 1.2 0 2.3.7 2.9 1.7.6-1 1.7-1.7 2.9-1.7 1.8 0 3.2 1.4 3.2 3.2 0 3.3-2.7 5.8-6.1 8.2Z" />
    </>
  ),
  // all good — sun
  good: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  // something isn't working — a tangled line
  stuck: <path d="M3 15c2.5 0 3.5-6 6-6s2 7 5 7 2.4-8 5-8c1.3 0 2 1 2 2" />,
  // a bit of both — sun behind a cloud
  both: (
    <>
      <path d="M9.5 5.5a4 4 0 0 1 5.9 3.3" />
      <path d="M9.5 2.5v1M4.6 4.6l.7.7M2.5 9.5h1" />
      <path d="M7 19.5h10a3.5 3.5 0 0 0 .4-7 5 5 0 0 0-9.6 1.1A3 3 0 0 0 7 19.5Z" />
    </>
  ),
  // another identity — a soft arc spectrum
  other: (
    <>
      <path d="M3 17a9 9 0 0 1 18 0" />
      <path d="M6.5 17a5.5 5.5 0 0 1 11 0" />
      <path d="M10 17a2 2 0 0 1 4 0" />
    </>
  ),
}

export default function OptionIcon({ value }: { value: string }) {
  const pronoun = PRONOUNS[value]
  if (pronoun) {
    return (
      <span aria-hidden className="text-[17px] font-extrabold leading-none tracking-[-0.02em]">
        {pronoun}
      </span>
    )
  }
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      className="h-[22px] w-[22px]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {PATHS[value]}
    </svg>
  )
}
