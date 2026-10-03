import type { FollowerKey } from './site-stats'

// Small brand glyphs for follower counts (inherit text color)
export default function SocialIcon({ name, className = 'w-4 h-4' }: { name: FollowerKey; className?: string }) {
  if (name === 'instagram')
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    )
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={PATHS[name]} />
    </svg>
  )
}

const PATHS: Record<Exclude<FollowerKey, 'instagram'>, string> = {
  facebook:
    'M13.5 21v-7.5h2.5l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21h2.9z',
  tiktok:
    'M16.6 5.8A4.3 4.3 0 0115.5 3h-3.1v12.4a2.6 2.6 0 11-2.6-2.6c.3 0 .6 0 .8.1V9.7a5.8 5.8 0 00-.8-.1 5.7 5.7 0 105.7 5.7V9a7.4 7.4 0 004.3 1.4V7.3a4.3 4.3 0 01-3.2-1.5z',
}
