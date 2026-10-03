'use client'

import { useEffect, useRef, useState } from 'react'
import { m, AnimatePresence, MotionConfig, useScroll, useTransform } from 'framer-motion'
import { useCrmTracking } from '@/hooks/useCrmTracking'
import { AuroraBackground, GrainOverlay } from '../backgrounds'
import { useHydratedReducedMotion } from '../useHydratedReducedMotion'
import GiftPlayer, { HeadphonesIcon } from './GiftPlayer'
import LetterSection from './LetterSection'
import WorldSection from './WorldSection'
import NextStepSection from './NextStepSection'
import { LEGACY, UI, springCalm, springUI, type GiftData } from './gift-copy'

// The v2 quiz lands here: the gift first (watch or just listen), then a short personal letter,
// the "world" the gift is a taste of, and the next step. Same content, links and CRM events as /gift,
// plus gift_view / gift_complete, and gift_play fires on real playback rather than on the click.
export default function GiftResultV2({ data }: { data: GiftData }) {
  const { track } = useCrmTracking()
  const { path, mode } = data
  const [playing, setPlaying] = useState(false)
  const [audioOnly, setAudioOnly] = useState(false)

  // gift_view: once per page view on entry (the ref survives React's dev double effects)
  const trackedView = useRef(false)
  useEffect(() => {
    if (trackedView.current) return
    trackedView.current = true
    track('gift_view', { path, mode })
  }, [path, mode, track])

  // thankyou_view: once, when the letter is half in view (same event + payload as the original page)
  const thankYouRef = useRef<HTMLDivElement>(null)
  const trackedThankYou = useRef(false)
  useEffect(() => {
    const el = thankYouRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !trackedThankYou.current) {
          trackedThankYou.current = true
          track('thankyou_view', { path, mode })
          observer.disconnect()
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [path, mode, track])

  // CRM media events, each once per page view (client-only: player callbacks never run on the server).
  // Page entry is the site-wide page-view event (same as the live page).
  //   gift_play     playback really started (first play of the player, not just the click)
  //   gift_complete 90% of the duration watched/listened
  const fired = useRef({ play: false, complete: false })
  // Kept in sync synchronously so an event fired in the same click ("listen only") already sees it
  const audioOnlyRef = useRef(false)
  const setAudio = (v: boolean) => {
    if (v !== audioOnlyRef.current) {
      // gift_audio_only: same event + payload as the live page; switching back to video is new
      if (v) track('gift_audio_only', { path, mode })
      else track('gift_show_video', { path, mode })
    }
    audioOnlyRef.current = v
    setAudioOnly(v)
  }
  const media = () => (audioOnlyRef.current ? 'audio' : 'video')

  const trackPlayStart = () => {
    if (fired.current.play) return
    fired.current.play = true
    track('gift_play', { path, mode, media: media() })
  }

  const trackProgress = (fraction: number, duration: number) => {
    if (fired.current.complete || !(duration > 0) || fraction < 0.9) return
    fired.current.complete = true
    track('gift_complete', { path, mode, media: media(), percent: 90, durationSeconds: Math.round(duration) })
  }

  const handlePlay = () => {
    setPlaying(true)
    // Vimeo player script blocked or missing: no player events will ever arrive, so count the click as the start
    if (!(window as unknown as { Vimeo?: unknown }).Vimeo) trackPlayStart()
  }

  return (
    <MotionConfig reducedMotion="user">
      <div dir="rtl" className="overflow-x-clip bg-cream text-[#2d1a0e]">
        <GiftHero
          data={data}
          playing={playing}
          audioOnly={audioOnly}
          setAudioOnly={setAudio}
          onPlay={handlePlay}
          onPlaybackStart={trackPlayStart}
          onPlaybackProgress={trackProgress}
          onReplay={() => track('gift_replay', { path, mode, media: media() })}
          onSeek={(seconds) => track('gift_seek', { path, mode, seconds })}
        />
        <LetterSection bridge={data.bridge} thankYouRef={thankYouRef} />
        <WorldSection tasteLine={data.tasteLine} resultLine={data.resultLine} />
        <NextStepSection
          data={data}
          onPrimaryClick={() => track('cta_primary_click', { path, mode, target: data.cta.target })}
          onSoftClick={(label, target) => track('cta_soft_click', { path, mode, label, target })}
        />
      </div>
    </MotionConfig>
  )
}

// ─── Hero: the gift ──────────────────────────────────────────────────────────

function GiftHero({
  data,
  playing,
  audioOnly,
  setAudioOnly,
  onPlay,
  onPlaybackStart,
  onPlaybackProgress,
  onReplay,
  onSeek,
}: {
  data: GiftData
  playing: boolean
  audioOnly: boolean
  setAudioOnly: (v: boolean) => void
  onPlay: () => void
  onPlaybackStart: () => void
  onPlaybackProgress: (fraction: number, duration: number) => void
  onReplay: () => void
  onSeek: (seconds: number) => void
}) {
  const reduce = useHydratedReducedMotion()
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  // The giant backdrop word drifts down and fades as the hero scrolls away (depth, not distraction)
  const wordY = useTransform(() => `${scrollYProgress.get() * 35}%`)
  const wordOpacity = useTransform(() => Math.max(0, 1 - scrollYProgress.get() * 1.6))

  return (
    <section ref={ref} className="relative isolate px-5 pt-[168px] pb-4 sm:px-8 sm:pt-32 md:pb-6">
      {/* fades out toward the bottom so the hero melts into the letter (no seam) */}
      <div aria-hidden className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_55%,transparent)]">
        <AuroraBackground palette="cream" />
      </div>
      <GrainOverlay />

      {/* Halftone backdrop word, like the communities hero */}
      <m.p
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-16 select-none sm:top-10 text-center font-sans font-black leading-[0.85] tracking-[-0.02em] text-transparent bg-clip-text [-webkit-background-clip:text] text-[38vw] sm:text-[24vw] md:text-[22vw]"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(168,90,84,0.45) 0.9px, transparent 1.3px), linear-gradient(to bottom, rgba(168,90,84,0.18), rgba(201,120,112,0.04))',
          backgroundSize: '3.5px 3.5px, 100% 100%',
          ...(reduce ? { y: 0, opacity: 1 } : { y: wordY, opacity: wordOpacity }),
        }}
      >
        מתנה
      </m.p>

      <div className="relative mx-auto max-w-5xl text-center">
        <m.p
          className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-bold text-brand-dark"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springCalm, delay: 0.1 }}
        >
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-brand" />
          {UI.kicker(data.isCouple)}
        </m.p>

        <m.h1
          className="mx-auto mt-5 max-w-4xl text-balance font-sans text-[34px] font-black leading-[1.08] tracking-[-0.01em] text-[#2d1a0e] sm:text-5xl md:text-6xl lg:text-7xl"
          initial={{ clipPath: 'inset(0 0 100% 0)', y: 24 }}
          animate={{ clipPath: 'inset(0 0 -10% 0)', y: 0 }}
          transition={{ ...springCalm, delay: 0.18 }}
        >
          {data.gift.title}
        </m.h1>

        {/* The screen unfolds from a smaller rounded window */}
        <m.div
          className="relative mx-auto mt-8 max-w-3xl md:mt-10"
          initial={{ clipPath: 'inset(8% 10% 8% 10% round 36px)', opacity: 0 }}
          animate={{ clipPath: 'inset(0% 0% 0% 0% round 36px)', opacity: 1 }}
          transition={{ ...springCalm, visualDuration: 1.1, delay: 0.32 }}
        >
          <GiftPlayer
            title={data.gift.title}
            videoUrl={data.gift.videoUrl}
            audioOnly={audioOnly}
            setAudioOnly={setAudioOnly}
            playing={playing}
            onPlay={onPlay}
            onPlaybackStart={onPlaybackStart}
            onPlaybackProgress={onPlaybackProgress}
            onReplay={onReplay}
            onSeek={onSeek}
          />
        </m.div>

        <m.div
          className="mx-auto mt-7 flex max-w-xl flex-col items-center gap-4 md:mt-9"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springCalm, delay: 0.6 }}
        >
          <p className="text-balance text-lg leading-relaxed text-[#3d2814]/90 md:text-xl">{data.playerCaption}</p>

          <p className="flex items-center gap-2 text-[15px] text-[#5e5955]">
            <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-brand" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="5" width="18" height="14" rx="3" />
              <path d="m4 7 8 6 8-6" />
            </svg>
            {data.emailReminder}
          </p>

          {/* Fixed slot: the audio/video toggle appears here without pushing anything */}
          <div className="flex h-12 items-center justify-center">
            <AnimatePresence initial={false}>
              {playing && data.gift.videoUrl && (
                <m.button
                  key="toggle"
                  type="button"
                  onClick={() => setAudioOnly(!audioOnly)}
                  aria-pressed={audioOnly}
                  className="inline-flex items-center gap-2.5 rounded-full bg-white/75 px-6 py-3 font-bold text-[#2d1a0e] ring-1 ring-brand/20 outline-none transition-colors hover:bg-white focus-visible:ring-4 focus-visible:ring-brand/40"
                  initial={{ opacity: 0, transform: 'translateY(8px) scale(0.96)' }}
                  animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
                  exit={{ opacity: 0, transform: 'translateY(8px) scale(0.96)' }}
                  transition={springUI}
                >
                  <AnimatePresence mode="popLayout" initial={false}>
                    <m.span
                      key={audioOnly ? 'video' : 'audio'}
                      className="inline-flex items-center gap-2.5"
                      initial={{ opacity: 0, transform: 'translateY(60%)' }}
                      animate={{ opacity: 1, transform: 'translateY(0%)' }}
                      exit={{ opacity: 0, transform: 'translateY(-60%)' }}
                      transition={springUI}
                    >
                      {audioOnly ? (
                        <>
                          <svg className="h-5 w-5 text-brand" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          {LEGACY.showVideo}
                        </>
                      ) : (
                        <>
                          <HeadphonesIcon className="h-5 w-5 text-brand" />
                          {data.audioOnlyButton}
                        </>
                      )}
                    </m.span>
                  </AnimatePresence>
                </m.button>
              )}
            </AnimatePresence>
          </div>
        </m.div>
      </div>
    </section>
  )
}
