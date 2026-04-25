export interface MediaMention {
  title: string
  source: string
  mediaType?: string
  externalUrl: string
  excerpt?: string
  thumbnail?: object | null
  logo?: object | null
  logoAlt?: string
  publicationDate?: string
  featured?: boolean
  upperTitle?: string
}

export interface Course {
  title: string
  slug: string
  shortDescription?: string
  description?: { _type: string; _key: string; [key: string]: unknown }[]
  thumbnail?: object | null
  price?: string
  purchaseUrl?: string
  type?: string
  featured?: boolean
  order?: number
}

export interface BlogPost {
  title: string
  slug: string
  publishedAt?: string
  excerpt?: string
  thumbnail?: object | null
  body?: { _type: string; _key: string; [key: string]: unknown }[]
}

export interface Testimonial {
  name: string
  courseTitle?: string
  body: string
  rating?: number
}

export interface GalleryItem {
  image: object | null
  headline: string
  body: string
}

export interface FreeGift {
  title: string
  subtitle?: string
  description?: string
  emoji?: string
  image?: object
  downloadUrl: string
}

export interface SiteSettings {
  phone?: string
  whatsapp?: string
  instagram?: string
  seoTitle?: string
  seoDescription?: string
}
