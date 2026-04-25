import { createClient } from 'next-sanity'
import { createImageUrlBuilder } from '@sanity/image-url'
import { sanityConfig } from './config'

export const client = createClient({
  ...sanityConfig,
  token: process.env.SANITY_API_TOKEN,
})

const builder = createImageUrlBuilder(client)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source)
}
