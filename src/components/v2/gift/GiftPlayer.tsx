'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { m, AnimatePresence } from 'framer-motion'
import { GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import { LEGACY, UI, springCalm, springUI } from './gift-copy'

type VimeoPlayer = {
  play(): Promise<void>
  pause(): Promise<void>
  getCurrentTime(): Promise<number>
  setCurrentTime(t: number): Promise<number>
  on(event: 'play' | 'pause' | 'ended', cb: () => void): void
  on(event: 'timeupdate', cb: (d: { seconds: number; percent: number; duration: number }) => void): void
}
type VimeoGlobal = { Player: new (el: HTMLIFrameElement) => VimeoPlayer }
const getVimeo = () => (window as unknown as { Vimeo?: VimeoGlobal }).Vimeo

// Same embed URL as the original page (https://vimeo.com/ID/HASH or https://vimeo.com/ID)
function getVimeoEmbedUrl(url: string): string {
  const match = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (!match) return url
  const [, videoId, hash] = match
  return hash
    ? `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1&title=0&byline=0&portrait=0`
    : `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
}

type Props = {
  title: string
  videoUrl: string | null
  audioOnly: boolean
  setAudioOnly: (v: boolean) => void
  playing: boolean
  onPlay: () => void
  /** Playback really started (from the player itself). May be called more than once; the caller dedupes. */
  onPlaybackStart?: () => void
  /** Playback position, 0–1 of the duration (in seconds). */
  onPlaybackProgress?: (fraction: number, duration: number) => void
  /** Played again after reaching the end. */
  onReplay?: () => void
  /** Audio face rewind/forward, in seconds (-10 / +10). */
  onSeek?: (seconds: number) => void
}

// The gift itself: a warm dark "screen". Poster (watch / listen only) → Vimeo iframe, with an
// audio-only face on top that keeps the iframe playing underneath (same behaviour as the original page).
export default function GiftPlayer({ title, videoUrl, audioOnly, setAudioOnly, playing, onPlay, onPlaybackStart, onPlaybackProgress, onReplay, onSeek }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<VimeoPlayer | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  // Latest callbacks for the player listeners, which are attached once
  const cbRef = useRef({ onPlaybackStart, onPlaybackProgress, onReplay })
  useEffect(() => {
    cbRef.current = { onPlaybackStart, onPlaybackProgress, onReplay }
  })

  const ensurePlayer = useCallback(() => {
    if (playerRef.current) return playerRef.current
    const Vimeo = getVimeo()
    if (!iframeRef.current || !Vimeo) return null
    const p = new Vimeo.Player(iframeRef.current)
    // keep our play/pause face in sync with Vimeo's own controls
    let ended = false
    p.on('ended', () => {
      ended = true
    })
    p.on('play', () => {
      setIsPaused(false)
      if (ended) {
        ended = false
        cbRef.current.onReplay?.()
      }
      cbRef.current.onPlaybackStart?.()
    })
    p.on('pause', () => setIsPaused(true))
    // timeupdate also catches playback that began before the listeners were attached
    p.on('timeupdate', ({ seconds, percent, duration }) => {
      if (seconds > 0) cbRef.current.onPlaybackStart?.()
      cbRef.current.onPlaybackProgress?.(percent, duration)
    })
    playerRef.current = p
    return p
  }, [])

  // Initialise the Vimeo player once the iframe exists (retry once in case the SDK is still loading)
  useEffect(() => {
    if (!playing) return
    ensurePlayer()
    const t = setTimeout(ensurePlayer, 1000)
    return () => clearTimeout(t)
  }, [playing, ensurePlayer])

  const handlePlayPause = async () => {
    const p = ensurePlayer()
    if (!p) return
    try {
      if (isPaused) await p.play()
      else await p.pause()
      setIsPaused(!isPaused)
    } catch (e) {
      console.error('Play/pause error:', e)
    }
  }

  const handleSeek = async (seconds: number) => {
    onSeek?.(seconds)
    const p = ensurePlayer()
    if (!p) return
    try {
      const now = await p.getCurrentTime()
      await p.setCurrentTime(Math.max(0, now + seconds))
    } catch (e) {
      console.error('Seek error:', e)
    }
  }

  const start = (listenOnly: boolean) => {
    if (listenOnly) setAudioOnly(true)
    setIsPaused(false)
    onPlay()
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-[28px] md:rounded-[36px] bg-[#2d1a0e] text-cream shadow-[0_50px_100px_-40px_rgba(45,26,14,0.75)]">
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />

      {/* Iframe stays mounted once playing (audio-only just hides it) */}
      {playing && videoUrl && (
        <m.iframe
          ref={iframeRef}
          src={getVimeoEmbedUrl(videoUrl)}
          className="absolute inset-0 h-full w-full"
          style={{ pointerEvents: audioOnly ? 'none' : 'auto' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: audioOnly ? 0 : 1 }}
          transition={springCalm}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title={title}
          aria-hidden={audioOnly || undefined}
          tabIndex={audioOnly ? -1 : undefined}
        />
      )}

      <AnimatePresence initial={false}>
        {!playing ? (
          <Face key="poster">
            <Poster onWatch={() => start(false)} onListen={() => start(true)} noVideo={videoUrl === null} />
          </Face>
        ) : !videoUrl ? (
          <Face key="soon">
            <p className="text-lg font-bold">{title}</p>
            <p className="mt-2 text-sm text-cream/60">{LEGACY.comingSoon}</p>
          </Face>
        ) : audioOnly ? (
          <Face key="audio">
            <AudioFace title={title} isPaused={isPaused} onPlayPause={handlePlayPause} onSeek={handleSeek} />
          </Face>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

// A full-bleed face over the screen: rises in softly, dissolves out with a slight lift
function Face({ children }: { children: React.ReactNode }) {
  return (
    <m.div
      className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center sm:p-6"
      initial={{ opacity: 0, transform: 'scale(0.98)' }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      exit={{ opacity: 0, transform: 'scale(1.03)' }}
      transition={springCalm}
    >
      <ScreenBackdrop />
      <div className="relative flex flex-col items-center">{children}</div>
    </m.div>
  )
}

function ScreenBackdrop() {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,#3d2814_0%,#2d1a0e_55%,#1f1209_100%)]">
      <div className="absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(230,192,96,0.22),transparent)]" />
      <div className="absolute -bottom-1/2 -right-1/4 h-full w-3/4 rounded-full bg-[radial-gradient(closest-side,rgba(201,120,112,0.28),transparent)]" />
      <GrainOverlay opacity={0.18} blend="soft-light" />
    </div>
  )
}

function Poster({ onWatch, onListen, noVideo }: { onWatch: () => void; onListen: () => void; noVideo: boolean }) {
  return (
    <>
      <p className="flex items-center gap-2 text-sm font-bold tracking-[0.04em] text-gold">
        <span aria-hidden>✦</span>
        {UI.giftLabel}
      </p>
      <div className="mt-4 flex items-start gap-8 sm:mt-8 sm:gap-12">
        <RoundButton label={LEGACY.watch} primary onClick={onWatch}>
          <svg className="h-7 w-7 -mr-1 sm:h-8 sm:w-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        </RoundButton>
        <RoundButton label={LEGACY.listenOnly} onClick={onListen}>
          <HeadphonesIcon className="h-7 w-7 sm:h-8 sm:w-8" />
        </RoundButton>
      </div>
      {noVideo && <p className="mt-6 text-sm text-cream/60">{LEGACY.comingSoon}</p>}
    </>
  )
}

function RoundButton({ label, primary, onClick, children }: { label: string; primary?: boolean; onClick: () => void; children: React.ReactNode }) {
  const reduce = useHydratedReducedMotion()
  return (
    <button type="button" onClick={onClick} className="group flex flex-col items-center gap-2 rounded-3xl sm:gap-3 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-[#2d1a0e]">
      <span className="relative grid h-16 w-16 place-items-center sm:h-20 sm:w-20 md:h-24 md:w-24">
        {primary && !reduce && <BreathingHalo />}
        <m.span
          className={`relative grid h-full w-full place-items-center rounded-full transition-colors duration-300 ${
            primary
              ? 'bg-brand text-white shadow-[0_18px_40px_-12px_rgba(201,120,112,0.7)] group-hover:bg-[#d48a82]'
              : 'bg-cream/10 text-cream ring-1 ring-cream/25 group-hover:bg-cream/15'
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={springUI}
        >
          {children}
        </m.span>
      </span>
      <span className="text-[15px] font-bold text-cream/85 md:text-base">{label}</span>
    </button>
  )
}

// Two soft rings breathing out from behind the play button
function BreathingHalo() {
  return (
    <>
      {[0, 1].map((i) => (
        <m.span
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-full border border-brand/70"
          initial={{ opacity: 0, transform: 'scale(1)' }}
          animate={{ opacity: [0.8, 0], transform: ['scale(1)', 'scale(1.55)'] }}
          transition={{ duration: 3.2, ease: 'easeOut', repeat: Infinity, delay: i * 1.6 }}
        />
      ))}
    </>
  )
}

function AudioFace({ title, isPaused, onPlayPause, onSeek }: { title: string; isPaused: boolean; onPlayPause: () => void; onSeek: (s: number) => void }) {
  const reduce = useHydratedReducedMotion()
  return (
    <>
      {/* Listening orb: rings breathe while playing, settle when paused */}
      <div className="relative grid h-14 w-14 place-items-center sm:h-24 sm:w-24 md:h-28 md:w-28">
        {!reduce &&
          [0, 1, 2].map((i) => (
            <m.span
              key={i}
              aria-hidden
              className="absolute inset-0 rounded-full bg-brand/25"
              animate={isPaused ? { opacity: 0, transform: 'scale(1)' } : { opacity: [0.55, 0], transform: ['scale(0.9)', 'scale(1.7)'] }}
              transition={isPaused ? springUI : { duration: 3.6, ease: 'easeOut', repeat: Infinity, delay: i * 1.2 }}
            />
          ))}
        <span className="relative grid h-full w-full place-items-center rounded-full bg-brand/20 ring-1 ring-brand/40 text-brand">
          <HeadphonesIcon className="h-7 w-7 sm:h-11 sm:w-11" />
        </span>
      </div>

      <p className="mt-6 hidden max-w-md text-balance text-lg font-bold sm:block md:text-xl">{title}</p>
      <div className="relative mt-3 h-6 overflow-hidden text-sm sm:mt-1 text-cream/60" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          <m.p
            key={isPaused ? 'p' : 'l'}
            initial={{ opacity: 0, transform: 'translateY(100%)' }}
            animate={{ opacity: 1, transform: 'translateY(0%)' }}
            exit={{ opacity: 0, transform: 'translateY(-100%)' }}
            transition={springUI}
          >
            {isPaused ? LEGACY.paused : LEGACY.listening}
          </m.p>
        </AnimatePresence>
      </div>

      {/* Media controls read left-to-right like every player */}
      <div dir="ltr" className="mt-3 flex items-center gap-5 sm:mt-7">
        <ControlButton label={UI.rewind} onClick={() => onSeek(-10)}>
          <SkipIcon />
        </ControlButton>
        <m.button
          type="button"
          onClick={onPlayPause}
          aria-label={isPaused ? UI.play : UI.pause}
          className="grid h-12 w-12 place-items-center rounded-full bg-brand sm:h-16 sm:w-16 text-white shadow-[0_16px_36px_-12px_rgba(201,120,112,0.75)] outline-none transition-colors hover:bg-[#d48a82] focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-4 focus-visible:ring-offset-[#2d1a0e]"
          whileTap={{ scale: 0.94 }}
          transition={springUI}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <m.svg
              key={isPaused ? 'play' : 'pause'}
              className="h-6 w-6 sm:h-8 sm:w-8"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
              initial={{ opacity: 0, transform: 'scale(0.6)' }}
              animate={{ opacity: 1, transform: 'scale(1)' }}
              exit={{ opacity: 0, transform: 'scale(0.6)' }}
              transition={springUI}
            >
              {isPaused ? <path d="M8 5v14l11-7z" /> : <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />}
            </m.svg>
          </AnimatePresence>
        </m.button>
        <ControlButton label={UI.forward} onClick={() => onSeek(10)}>
          <SkipIcon forward />
        </ControlButton>
      </div>
    </>
  )
}

function ControlButton({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <m.button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="grid h-10 w-10 place-items-center rounded-full bg-cream/10 sm:h-12 sm:w-12 text-cream outline-none ring-1 ring-cream/15 transition-colors hover:bg-cream/20 focus-visible:ring-2 focus-visible:ring-gold"
      whileTap={{ scale: 0.92 }}
      transition={springUI}
    >
      {children}
    </m.button>
  )
}

function SkipIcon({ forward }: { forward?: boolean }) {
  return (
    <svg className="h-6 w-6 sm:h-7 sm:w-7" viewBox="0 0 24 24" fill="currentColor" aria-hidden style={forward ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3Z" />
      <g style={forward ? { transform: 'scaleX(-1)', transformOrigin: '11.75px 15px' } : undefined}>
        <path d="M7.5 12V18H9V12H7.5Z" />
        <path d="M13.5 18C14.88 18 16 16.88 16 15.5V14.5C16 13.12 14.88 12 13.5 12H11V18H13.5ZM12.5 13.5H13.5C14.05 13.5 14.5 13.95 14.5 14.5V15.5C14.5 16.05 14.05 16.5 13.5 16.5H12.5V13.5Z" />
      </g>
    </svg>
  )
}

export function HeadphonesIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="14" width="4.5" height="6.5" rx="1.6" />
      <rect x="16.5" y="14" width="4.5" height="6.5" rx="1.6" />
    </svg>
  )
}
