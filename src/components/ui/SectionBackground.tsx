import Image from 'next/image'
import { getImageUrl } from '@/lib/image-utils'

interface SectionBackgroundProps {
  image?: object | null
  opacity?: number
}

export default function SectionBackground({ image, opacity = 20 }: SectionBackgroundProps) {
  if (!image) return null
  const url = getImageUrl(image, 'section')
  if (!url) return null

  return (
    <div className="absolute inset-0 pointer-events-none" style={{ opacity: opacity / 100 }}>
      <Image
        src={url}
        alt=""
        fill
        className="object-cover"
        sizes="100vw"
        priority={false}
      />
    </div>
  )
}
