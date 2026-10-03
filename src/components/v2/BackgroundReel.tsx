'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useHydratedReducedMotion } from './useHydratedReducedMotion'

// Background reel for the media section, streamed from Vimeo (nothing hosted on our own server).
// - vimeo.com/<id> or player.vimeo.com/video/<id> (optionally with a privacy hash) -> Vimeo background player
// - a direct video file URL (.mp4/.webm, e.g. Vimeo's direct link on paid plans) -> <video>
// Nothing loads until the section is near the screen; with no URL it renders nothing (plain gray background).

const SHARED = 'pointer-events-none grayscale blur-[2px] transition-opacity duration-[1200ms]'
// Fade the top and the bottom (where the TV captions sit) so only the faces/motion read as texture
const MASK = '[mask-image:linear-gradient(to_bottom,transparent,black_28%,black_62%,transparent_88%)]'

function vimeoEmbed(url: string): string | null {
  try {
    const u = new URL(url)
    if (!u.hostname.endsWith('vimeo.com')) return null
    const parts = u.pathname.split('/').filter(Boolean)
    const idIndex = parts.findIndex((p) => /^\d+$/.test(p))
    if (idIndex === -1) return null
    const id = parts[idIndex]
    // Unlisted videos: vimeo.com/<id>/<hash> or ?h=<hash>
    const hash = u.searchParams.get('h') || (parts[idIndex + 1] && /^[a-f0-9]+$/i.test(parts[idIndex + 1]) ? parts[idIndex + 1] : null)
    const params = new URLSearchParams({ background: '1', autoplay: '1', loop: '1', muted: '1', autopause: '0', dnt: '1' })
    if (hash) params.set('h', hash)
    return `https://player.vimeo.com/video/${id}?${params.toString()}`
  } catch {
    return null
  }
}

export default function BackgroundReel({ url, poster }: { url?: string | null; poster?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInView(ref, { margin: '600px 0px' })
  const inRange = useInView(ref, { margin: '600px 0px', once: true }) // latches: once loaded, keep it
  // "Reduce motion" turned on in the device settings: keep the still photo, no moving video
  const reduce = useHydratedReducedMotion()
  const load = inRange && !reduce

  const embed = url ? vimeoEmbed(url) : null
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [playing, setPlaying] = useState(false)

  // Vimeo player API (postMessage): show the video only once it actually plays, then hide the poster,
  // so the still and the moving video never show on top of each other
  useEffect(() => {
    if (!load || !embed) return
    const onMsg = (e: MessageEvent) => {
      if (!/(^|.)vimeo.com$/.test(new URL(e.origin).hostname)) return
      if (e.source !== frameRef.current?.contentWindow) return
      let data: { event?: string } = {}
      try { data = typeof e.data === 'string' ? JSON.parse(e.data) : e.data } catch { return }
      if (data.event === 'ready') {
        frameRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'addEventListener', value: 'play' }), '*')
        frameRef.current?.contentWindow?.postMessage(JSON.stringify({ method: 'addEventListener', value: 'playProgress' }), '*')
      } else if (data.event === 'play' || data.event === 'playProgress') {
        setPlaying(true)
      }
    }
    window.addEventListener('message', onMsg)
    return () => window.removeEventListener('message', onMsg)
  }, [load, embed])
  const isFile = !!url && !embed && /\.(mp4|webm|m3u8)(\?|$)/i.test(url)

  return (
    <div ref={ref} aria-hidden className={`absolute inset-0 overflow-hidden pointer-events-none ${MASK}`}>
      {poster && (
        <div
          className={`absolute inset-0 ${SHARED} bg-cover bg-center scale-[1.12] ${playing ? 'opacity-0' : 'opacity-[0.08]'}`}
          style={{ backgroundImage: `url(${poster})` }}
        />
      )}
      {load && embed && (
        // Cover the box: the iframe is 16:9, sized to overflow whichever side is shorter
        <iframe
          ref={frameRef}
          src={embed}
          title=""
          tabIndex={-1}
          allow="autoplay; fullscreen; picture-in-picture"
          // scaled up a little to crop the reel's TV frame/corners
          className={`absolute ${SHARED} left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.12] w-[max(100%,177.78vh)] h-[max(100%,56.25vw)] border-0 ${playing ? 'opacity-[0.12]' : 'opacity-0'}`}
        />
      )}
      {load && isFile && <FileVideo src={url!} active={near} />}
    </div>
  )
}

function FileVideo({ src, active }: { src: string; active: boolean }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (active) v.play().catch(() => {})
    else v.pause()
  }, [active])
  return <video ref={ref} className={`absolute inset-0 ${SHARED} opacity-[0.12] w-full h-full object-cover`} src={src} muted loop playsInline preload="none" />
}
