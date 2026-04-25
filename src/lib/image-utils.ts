import { urlFor } from '@/sanity/client'

const IMAGE_SIZES = {
  thumb:  { width: 300, height: 300 },
  card:   { width: 400, height: 300 },
  promo:  { width: 600, height: 450 },
  hero:   { width: 600, height: 700 },
  about:  { width: 500, height: 640 },
  media:  { width: 560, height: 340 },
  banner: { width: 800, height: 500 },
  detail: { width: 1200, height: 600 },
  section: { width: 1920, height: 1080 },
} as const

type ImagePreset = keyof typeof IMAGE_SIZES

export function getImageUrl(source: object | null | undefined, preset: ImagePreset): string | null {
  if (!source) return null
  const { width, height } = IMAGE_SIZES[preset]
  return urlFor(source).width(width).height(height).url()
}
