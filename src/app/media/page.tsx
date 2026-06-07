import type { Metadata } from 'next'
import Image from 'next/image'
import { fetchMediaMentions } from '@/lib/queries'
import { getImageUrl } from '@/lib/image-utils'
import { SOURCE_LABELS, MEDIA_TYPE_LABELS, MEDIA_TYPE_BADGE_COLORS } from '@/lib/constants'
import type { MediaMention } from '@/lib/types'
import PageHero from '@/components/ui/PageHero'
import { urlFor } from '@/sanity/client'

export const metadata: Metadata = {
  title: 'טל רומן בתקשורת',
  description: 'כתבות, ראיונות והופעות תקשורתיות של טל רומן — מדריכת מיניות ואינטימיות — ב-ynet, מאקו, וואלה ועוד.',
  alternates: { canonical: 'https://talroman.com/media' },
  openGraph: {
    title: 'טל רומן בתקשורת',
    description: 'כתבות, ראיונות והופעות תקשורתיות של טל רומן — מדריכת מיניות ואינטימיות — ב-ynet, מאקו, וואלה ועוד.',
    url: 'https://talroman.com/media',
    locale: 'he_IL',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'טל רומן בתקשורת',
    description: 'כתבות, ראיונות והופעות תקשורתיות של טל רומן — מדריכת מיניות ואינטימיות — ב-ynet, מאקו, וואלה ועוד.',
  },
}

export default async function MediaPage() {
  const mentions: MediaMention[] = await fetchMediaMentions().catch(() => [])

  return (
    <div className="min-h-screen bg-cream">
      <PageHero
        title="בתקשורת"
        subtitle="מה אמרו עליי ב-ynet, מאקו, וואלה ועוד"
      />

      <div className="max-w-6xl mx-auto px-4 py-16">
        {mentions.length === 0 && (
          <p className="text-mist text-lg text-center py-20">כתבות בקרוב...</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentions.map((item, i) => {
            const thumbUrl = getImageUrl(item.thumbnail, 'media')
            const logoUrl = item.logo ? urlFor(item.logo).width(160).height(80).url() : null

            return (
              <a
                key={i}
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-gold/15 hover:shadow-xl hover:border-gold/45 transition-all flex flex-col"
              >
                <div className="relative w-full aspect-video bg-gold/10 overflow-hidden">
                  {thumbUrl ? (
                    <Image
                      src={thumbUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-gold/50 text-6xl">📰</span>
                    </div>
                  )}

                  <span className="absolute top-3 right-3 bg-white/90 text-brand text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {SOURCE_LABELS[item.source] ?? item.source}
                  </span>

                  {item.mediaType && (
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${MEDIA_TYPE_BADGE_COLORS[item.mediaType] ?? 'bg-gray-100 text-gray-600'}`}>
                      {MEDIA_TYPE_LABELS[item.mediaType] ?? item.mediaType}
                    </span>
                  )}

                  {logoUrl && (
                    <div className="absolute bottom-3 left-3 bg-white/90 rounded-xl px-2 py-1.5 shadow-sm">
                      <Image
                        src={logoUrl}
                        alt={SOURCE_LABELS[item.source] ?? item.source}
                        width={70}
                        height={35}
                        className="object-contain h-7 w-auto"
                      />
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1 text-right">
                  {item.upperTitle && (
                    <p className="text-brand text-xs font-semibold uppercase tracking-wide mb-1">
                      {item.upperTitle}
                    </p>
                  )}
                  <h3 className="font-bold text-ink text-base mb-2 group-hover:text-brand transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-charcoal text-sm leading-relaxed mb-3 flex-1 line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-gold/20">
                    {item.publicationDate ? (
                      <span className="text-mist text-xs">
                        {new Date(item.publicationDate).toLocaleDateString('he-IL')}
                      </span>
                    ) : <span />}
                    <span className="text-brand text-sm font-semibold">לחצו כאן ←</span>
                  </div>
                </div>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
