import { client } from '@/sanity/client'
import type { Testimonial, Course, MediaMention, BlogPost, FreeGift, SiteSettings, Gift, HtmlPage } from './types'

// Cache options with tags for on-demand revalidation
// In production: cache forever until explicitly revalidated via webhook
// In development: no caching for instant updates
const cacheOpts = (tags: string[]) =>
  process.env.NODE_ENV === 'production'
    ? { cache: 'force-cache' as const, next: { tags } }
    : { cache: 'no-store' as const }

export const coursesQuery = `*[_type == "course" && active != false] | order(order asc) {
  title, "slug": slug.current, shortDescription, description,
  thumbnail, price, purchaseUrl, type, featured, order, active
}`


export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0] {
  title, "slug": slug.current, shortDescription, description, seoTitle, seoDescription,
  thumbnail, primaryImage, price, purchaseUrl, landingPageUrl, type,
  location, cancellationPolicy, ctaText, ctaButtonLabel,
  fullDetails, paragraphBelowSubtitle,
  whatYoullLearn, whoIsItFor,
  faq[] { question, answer }
}`

export const testimonialsQuery = `*[_type == "testimonial" && active != false && featured == true] | order(sort asc, _createdAt desc) {
  name, courseTitle, body, image
}`

export const allTestimonialsQuery = `*[_type == "testimonial" && active != false] | order(sort asc, _createdAt desc) {
  name, courseTitle, body, image
}`

export const blogPostsQuery = `*[_type == "blogPost" && active != false] | order(publishedAt desc) {
  title, "slug": slug.current, publishedAt, excerpt, thumbnail
}`

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  title, "slug": slug.current, publishedAt, excerpt, thumbnail, body,
  "docxFileUrl": docxFile.asset->url
}`

export const mediaMentionsQuery = `*[_type == "mediaMention" && active != false] | order(order asc, publicationDate desc) {
  title, source, mediaType, externalUrl, publicationDate, excerpt, thumbnail, logo, logoAlt, featured, upperTitle
}`

export const freeGiftsQuery = `*[_type == "freeGift" && active != false] | order(order asc) {
  title, subtitle, description, emoji, image, downloadUrl
}`

export const homepageSectionQuery = `*[_type == "homepageSection"][0] {
  heroHeadline, heroSubheadline, heroBodyText, heroCtaText, heroImage, heroBgImage,
  heroStroke,
  personalMessage, personalMessageBgImage,
  personalMessageStroke,
  giftsHeadline, giftsSubheadline, giftsBgImage,
  giftsStroke,
  aboutImage, aboutBio, aboutQuote, aboutBgImage,
  aboutStroke,
  featuredPromoTitle, featuredPromoBody, featuredPromoCtaText, featuredPromoUrl, featuredPromoImage, featuredPromoBgImage,
  featuredPromoStroke,
  coursesHeadline, coursesBgImage,
  coursesStroke,
  "featuredCourses": featuredCourses[]->{ title, "slug": slug.current, shortDescription, thumbnail, price, purchaseUrl, type, active },
  testimonialsBgImage,
  testimonialsStroke,
  contactBgImage,
  contactStroke,
  scrollGalleryItems[] { image, headline, body }
}`

export const giftsQuery = `*[_type == "gift" && active != false] | order(title asc) {
  title, "slug": slug.current, subtitle, image
}`

export const giftBySlugQuery = `*[_type == "gift" && slug.current == $slug][0] {
  title, "slug": slug.current, subtitle, image, active,
  heroSubheadline, heroHeadline, mainBody, secondaryText, listItems,
  crmStatus, crmTags,
  "enrollToSchool": coalesce(enrollToSchool, courseSlug)
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  phone, whatsapp, instagram, seoTitle, seoDescription,
  contactFormTag, contactFormStatus
}`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function fetchHomepageSection(): Promise<any> {
  return client.fetch(homepageSectionQuery, {}, cacheOpts(['homepage', 'homepageSection']))
}

export async function fetchCourses(): Promise<Course[]> {
  return client.fetch(coursesQuery, {}, cacheOpts(['courses']))
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  return client.fetch(courseBySlugQuery, { slug }, cacheOpts(['courses', `course:${slug}`]))
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return client.fetch(testimonialsQuery, {}, cacheOpts(['testimonials']))
}

export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  return client.fetch(allTestimonialsQuery, {}, cacheOpts(['testimonials']))
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(blogPostsQuery, {}, cacheOpts(['blogPosts']))
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(blogPostBySlugQuery, { slug }, cacheOpts(['blogPosts', `blogPost:${slug}`]))
}

export async function fetchMediaMentions(): Promise<MediaMention[]> {
  return client.fetch(mediaMentionsQuery, {}, cacheOpts(['mediaMentions']))
}

export async function fetchFreeGifts(): Promise<FreeGift[]> {
  return client.fetch(freeGiftsQuery, {}, cacheOpts(['freeGifts']))
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(siteSettingsQuery, {}, cacheOpts(['siteSettings']))
}

export async function fetchGifts(): Promise<Gift[]> {
  return client.fetch(giftsQuery, {}, cacheOpts(['gifts']))
}

export async function fetchGiftBySlug(slug: string): Promise<Gift | null> {
  return client.fetch(giftBySlugQuery, { slug }, cacheOpts(['gifts', `gift:${slug}`]))
}

// HTML Pages
export const htmlPagesQuery = `*[_type == "htmlPage"] | order(title asc) {
  title, "slug": slug.current
}`

export const htmlPageBySlugQuery = `*[_type == "htmlPage" && slug.current == $slug][0] {
  title, "slug": slug.current,
  "htmlFileUrl": htmlFile.asset->url
}`

export async function fetchHtmlPages(): Promise<{ title: string; slug: string }[]> {
  return client.fetch(htmlPagesQuery, {}, cacheOpts(['htmlPages']))
}

export async function fetchHtmlPageBySlug(slug: string): Promise<HtmlPage | null> {
  return client.fetch(htmlPageBySlugQuery, { slug }, cacheOpts(['htmlPages', `htmlPage:${slug}`]))
}
