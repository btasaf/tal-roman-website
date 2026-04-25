export const SOURCE_LABELS: Record<string, string> = {
  ynet: 'ynet',
  mako: 'מאקו',
  walla: 'וואלה',
  channel12: 'ערוץ 12',
  sexapil: 'סקסאפיל',
  et: 'מגזין את',
  other: 'אחר',
}

export const MEDIA_TYPE_LABELS: Record<string, string> = {
  article: 'לקריאה',
  video: 'לצפייה',
  podcast: 'להאזנה',
  interview: 'לצפייה',
}

export const MEDIA_TYPE_BADGE_COLORS: Record<string, string> = {
  article: 'bg-blue-100 text-blue-700',
  video: 'bg-red-100 text-red-700',
  podcast: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber-100 text-amber-700',
}

export const COURSE_TYPE_LABELS: Record<string, string> = {
  digital: 'דיגיטלי',
  workshop: 'סדנה',
  personal: 'אישי',
}

export const NAV_LINKS = [
  { href: '/', label: 'בית' },
  { href: '/about', label: 'אודות' },
  { href: '/courses', label: 'קורסים' },
  { href: '/articles', label: 'מאמרים' },
  { href: '/media', label: 'תקשורת' },
  { href: '/contact', label: 'צור קשר' },
]
