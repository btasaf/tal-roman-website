import type { Metadata } from 'next'
import Image from 'next/image'
import { fetchMediaMentions } from '@/lib/queries'
import { urlFor } from '@/sanity/client'

export const metadata: Metadata = { title: 'טל רומן בתקשורת' }

const sourceLabels: Record<string, string> = {
  ynet: 'ynet',
  mako: 'מאקו',
  walla: 'וואלה',
  channel12: 'ערוץ 12',
  sexapil: 'סקסאפיל',
  et: 'מגזין את',
  other: 'אחר',
}

const mediaTypeLabel: Record<string, string> = {
  article: 'כתבה',
  video: 'וידאו',
  podcast: 'פודקאסט',
  interview: 'ראיון',
} 

const mediaTypeBadgeColor: Record<string, string> = {
  article: 'bg-blue-100 text-blue-700',
  video: 'bg-red-100 text-red-700',
  podcast: 'bg-purple-100 text-purple-700',
  interview: 'bg-amber-100 text-amber-700',
}

export default async function MediaPage() {
  const mentions = await fetchMediaMentions().catch(() => [])

  return (
    <div className="min-h-screen bg-[#fff2d4]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-14 text-right">
          <h1 className="text-4xl md:text-5xl font-bold text-[#303030] mb-3">בתקשורת</h1>
          <p className="text-[#4f4f4f] text-xl mb-4">מה אמרו עליי ב-ynet, מאקו, וואלה ועוד</p>
          <div className="w-16 h-1 bg-[#e6c060] rounded-full" />
        </div>

        {mentions.length === 0 && (
          <p className="text-[#6b6b6b] text-lg text-right">כתבות בקרוב...</p>
        )}

        {/* Card grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {mentions.map((item: any, i: number) => {
            const thumbUrl = item.thumbnail
              ? urlFor(item.thumbnail).width(560).height(340).url()
              : null
            const logoUrl = item.logo
              ? urlFor(item.logo).width(160).height(80).url()
              : null

            return (
              <a
                key={i}
                href={item.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl overflow-hidden bg-white shadow-sm border border-[#e6c060]/15 hover:shadow-xl hover:border-[#e6c060]/45 transition-all flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative w-full aspect-video bg-[#e6c060]/10 overflow-hidden">
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
                      <span className="text-[#e6c060]/50 text-6xl">📰</span>
                    </div>
                  )}

                  {/* Source badge top-right */}
                  <span className="absolute top-3 right-3 bg-white/90 text-[#cd2c2c] text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                    {sourceLabels[item.source] ?? item.source}
                  </span>

                  {/* Media type badge top-left */}
                  {item.mediaType && (
                    <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-1 rounded-full ${mediaTypeBadgeColor[item.mediaType] ?? 'bg-gray-100 text-gray-600'}`}>
                      {mediaTypeLabel[item.mediaType] ?? item.mediaType}
                    </span>
                  )}

                  {/* Logo overlay bottom-left */}
                  {logoUrl && (
                    <div className="absolute bottom-3 left-3 bg-white/90 rounded-lg px-2 py-1.5 shadow-sm">
                      <Image
                        src={logoUrl}
                        alt={sourceLabels[item.source] ?? item.source}
                        width={70}
                        height={35}
                        className="object-contain h-7 w-auto"
                      />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1 text-right">
                  {item.upperTitle && (
                    <p className="text-[#cd2c2c] text-xs font-semibold uppercase tracking-wide mb-1">
                      {item.upperTitle}
                    </p>
                  )}
                  <h3 className="font-bold text-[#303030] text-base mb-2 group-hover:text-[#cd2c2c] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  {item.excerpt && (
                    <p className="text-[#4f4f4f] text-sm leading-relaxed mb-3 flex-1 line-clamp-3">
                      {item.excerpt}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#e6c060]/20">
                    {item.publicationDate ? (
                      <span className="text-[#6b6b6b] text-xs">
                        {new Date(item.publicationDate).toLocaleDateString('he-IL')}
                      </span>
                    ) : <span />}
                    <span className="text-[#cd2c2c] text-sm font-semibold">
                      לחצו כאן ←
                    </span>
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
