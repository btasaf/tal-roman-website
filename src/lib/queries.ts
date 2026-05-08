import { client } from '@/sanity/client'
import type { Testimonial, Course, MediaMention, BlogPost, FreeGift, SiteSettings, Gift } from './types'

const revalidate = process.env.NODE_ENV === 'production'
  ? { next: { revalidate: 60 } }
  : { cache: 'no-store' as const }

export const coursesQuery = `*[_type == "course" && active != false] | order(order asc) {
  title, "slug": slug.current, shortDescription, description,
  thumbnail, price, purchaseUrl, type, featured, order, active
}`


export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0] {
  title, "slug": slug.current, shortDescription, description,
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
  return client.fetch(homepageSectionQuery, {}, revalidate)
}

export async function fetchCourses(): Promise<Course[]> {
  return client.fetch(coursesQuery, {}, revalidate)
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  return client.fetch(courseBySlugQuery, { slug }, revalidate)
}

export async function fetchTestimonials(): Promise<Testimonial[]> {
  return client.fetch(testimonialsQuery, {}, revalidate)
}

export async function fetchAllTestimonials(): Promise<Testimonial[]> {
  return client.fetch(allTestimonialsQuery, {}, revalidate)
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  return client.fetch(blogPostsQuery, {}, revalidate)
}

export async function fetchBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return client.fetch(blogPostBySlugQuery, { slug }, revalidate)
}

export async function fetchMediaMentions(): Promise<MediaMention[]> {
  return client.fetch(mediaMentionsQuery, {}, revalidate)
}

export async function fetchFreeGifts(): Promise<FreeGift[]> {
  return client.fetch(freeGiftsQuery, {}, revalidate)
}

export async function fetchSiteSettings(): Promise<SiteSettings | null> {
  return client.fetch(siteSettingsQuery, {}, revalidate)
}

export async function fetchGifts(): Promise<Gift[]> {
  return client.fetch(giftsQuery, {}, revalidate)
}

export async function fetchGiftBySlug(slug: string): Promise<Gift | null> {
  return client.fetch(giftBySlugQuery, { slug }, revalidate)
}
