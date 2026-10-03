import type { SiteSettings } from '@/lib/types'

// Site numbers, editable in Sanity (הגדרות אתר → מספרים). These defaults apply only if a field is empty.
export interface SiteStats {
  years: number
  community: number
  tiktok: number | null
  facebook: number | null
  instagram: number | null
  urls: SocialUrls
}

const DEFAULT_URLS = {
  facebook: 'https://www.facebook.com/tal.roman',
  instagram: 'https://www.instagram.com/talroman/',
  tiktok: 'https://www.tiktok.com/@tal.roman',
}
const DEFAULT_WHATSAPP = '972586540744'

export interface SocialUrls {
  facebook: string
  instagram: string
  tiktok: string
  youtube: string | null
  whatsapp: string | null
}

// Social profile links, editable in Sanity (הגדרות אתר → רשתות חברתיות)
export function socialUrls(settings: SiteSettings | null | undefined): SocialUrls {
  const wa = settings?.whatsapp?.replace(/\D/g, '') || DEFAULT_WHATSAPP
  return {
    facebook: settings?.facebook || DEFAULT_URLS.facebook,
    instagram: settings?.instagram || DEFAULT_URLS.instagram,
    tiktok: settings?.tiktok || DEFAULT_URLS.tiktok,
    youtube: settings?.youtube || null,
    whatsapp: wa ? `https://wa.me/${wa}` : null,
  }
}

export type FollowerKey = 'facebook' | 'instagram' | 'tiktok'

// Follower counts that are set, in display order (empty ones are left out)
export function followerList(stats: SiteStats | undefined): { key: FollowerKey; count: number; label: string; url: string }[] {
  if (!stats) return []
  const all: { key: FollowerKey; count: number | null; label: string }[] = [
    { key: 'facebook', count: stats.facebook, label: 'עוקבים בפייסבוק' },
    { key: 'instagram', count: stats.instagram, label: 'עוקבים באינסטגרם' },
    { key: 'tiktok', count: stats.tiktok, label: 'עוקבים בטיקטוק' },
  ]
  return all.flatMap((f) => (f.count ? [{ key: f.key, count: f.count, label: f.label, url: stats.urls[f.key] }] : []))
}

export function siteStats(settings: SiteSettings | null | undefined): SiteStats {
  return {
    years: settings?.yearsExperience ?? 10,
    community: settings?.communityMembers ?? 22000,
    tiktok: settings?.tiktokFollowers ?? null,
    facebook: settings?.facebookFollowers ?? 18000,
    instagram: settings?.instagramFollowers ?? null,
    urls: socialUrls(settings),
  }
}
