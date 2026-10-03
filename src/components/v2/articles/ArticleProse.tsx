import Image from 'next/image'
import { PortableText, type PortableTextComponents } from '@portabletext/react'
import { urlFor } from '@/sanity/client'
import type { BodySegment } from './article-content'
import styles from './prose.module.css'

// One stretch of the article body. Word files arrive as HTML converted on the server from the CMS file
// (the same source the old page renders); Portable Text gets components that output the same elements,
// so both share the reading styles in prose.module.css.

function isExternal(href: string) {
  return /^https?:\/\//.test(href) && !href.includes('talroman.com')
}

// Sanity image refs carry their size: image-<id>-1200x800-jpg
function imageSize(ref?: string) {
  const m = ref?.match(/-(\d+)x(\d+)-/)
  return m ? { width: Number(m[1]), height: Number(m[2]) } : { width: 1200, height: 800 }
}

function ptComponents(headingIds: Record<string, string>): PortableTextComponents {
  return {
    block: {
      // The page has its own H1; a body H1 is a section heading
      h1: ({ children, value }) => <h2 id={headingIds[value._key ?? '']}>{children}</h2>,
      h2: ({ children, value }) => <h2 id={headingIds[value._key ?? '']}>{children}</h2>,
    },
    marks: {
      link: ({ children, value }) => {
        const href: string = value?.href ?? '#'
        return isExternal(href) ? (
          <a href={href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ) : (
          <a href={href}>{children}</a>
        )
      },
    },
    types: {
      image: ({ value }) => {
        if (!value?.asset) return null
        const { width, height } = imageSize(value.asset._ref)
        const w = Math.min(width, 1400)
        const h = Math.round((height / width) * w)
        return (
          <figure>
            <Image src={urlFor(value).width(w).url()} alt={value.alt ?? ''} width={w} height={h} sizes="(max-width: 768px) 100vw, 720px" />
            {value.caption && <figcaption>{value.caption}</figcaption>}
          </figure>
        )
      },
    },
  }
}

export default function ArticleProse({ segment, lede = false, headingIds }: { segment: BodySegment; lede?: boolean; headingIds: Record<string, string> }) {
  const className = `${styles.prose} ${lede ? styles.lede : ''}`
  if (segment.kind === 'html') {
    return <div className={className} dangerouslySetInnerHTML={{ __html: segment.html }} />
  }
  return (
    <div className={className}>
      <PortableText value={segment.blocks} components={ptComponents(headingIds)} />
    </div>
  )
}
