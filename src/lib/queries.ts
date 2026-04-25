import { client } from '@/sanity/client'

export const coursesQuery = `*[_type == "course"] | order(order asc) {
  title, "slug": slug.current, shortDescription, description,
  thumbnail, price, purchaseUrl, type, featured, order
}`

export const featuredCoursesQuery = `*[_type == "course" && featured == true] | order(order asc) {
  title, "slug": slug.current, shortDescription, thumbnail, price, purchaseUrl, type
}`

export const courseBySlugQuery = `*[_type == "course" && slug.current == $slug][0] {
  title, "slug": slug.current, description, shortDescription,
  thumbnail, price, purchaseUrl, type
}`

export const testimonialsQuery = `*[_type == "testimonial" && featured == true] | order(_createdAt desc) {
  name, courseTitle, body, rating
}`

export const blogPostsQuery = `*[_type == "blogPost"] | order(publishedAt desc) {
  title, "slug": slug.current, publishedAt, excerpt, thumbnail
}`

export const blogPostBySlugQuery = `*[_type == "blogPost" && slug.current == $slug][0] {
  title, "slug": slug.current, publishedAt, excerpt, thumbnail, body
}`

export const mediaMentionsQuery = `*[_type == "mediaMention"] | order(order asc, publicationDate desc) {
  title, source, mediaType, externalUrl, publicationDate, excerpt, thumbnail, logo, logoAlt, featured, upperTitle
}`

export const freeGiftsQuery = `*[_type == "freeGift"] | order(order asc) {
  title, subtitle, description, emoji, image, downloadUrl
}`

export const homepageSectionQuery = `*[_type == "homepageSection"][0] {
  heroHeadline, heroSubheadline, heroBodyText, heroCtaText, heroImage,
  personalMessage,
  giftsHeadline, giftsSubheadline,
  aboutImage, aboutBio, aboutQuote,
  featuredPromoTitle, featuredPromoBody, featuredPromoCtaText, featuredPromoUrl, featuredPromoImage,
  coursesHeadline,
  featuredCourses[]-> { title, "slug": slug.current, shortDescription, thumbnail, price, purchaseUrl, type },
  scrollGalleryItems[] { image, headline, body }
}`

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  phone, whatsapp, instagram, seoTitle, seoDescription
}`

export async function fetchHomepageSection() {
  return client.fetch(homepageSectionQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchCourses() {
  return client.fetch(coursesQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchCourseBySlug(slug: string) {
  return client.fetch(courseBySlugQuery, { slug }, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchTestimonials() {
  return client.fetch(testimonialsQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchBlogPosts() {
  return client.fetch(blogPostsQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchBlogPostBySlug(slug: string) {
  return client.fetch(blogPostBySlugQuery, { slug }, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchMediaMentions() {
  return client.fetch(mediaMentionsQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchFreeGifts() {
  return client.fetch(freeGiftsQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}

export async function fetchSiteSettings() {
  return client.fetch(siteSettingsQuery, {}, { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } })
}
