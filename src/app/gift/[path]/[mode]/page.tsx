'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { m } from 'framer-motion'
import Link from 'next/link'
import Script from 'next/script'
import quizContent from '@/lib/quiz-content.json'
import { useCrmTracking } from '@/hooks/useCrmTracking'

type Mode = 'explore' | 'repair'
type Path = 'woman_self' | 'woman_partner' | 'man_self' | 'man_partner' | 'couple'

// Get target URL from content
function getTargetUrl(target: string): string {
  const targets = quizContent.targets as Record<string, string>
  return targets[target] || '/courses'
}

// Convert Vimeo URL to embed URL
function getVimeoEmbedUrl(url: string): string {
  // URL format: https://vimeo.com/VIDEO_ID/HASH or https://vimeo.com/VIDEO_ID
  const match = url.match(/vimeo\.com\/(\d+)(?:\/([a-zA-Z0-9]+))?/)
  if (!match) return url

  const videoId = match[1]
  const hash = match[2]

  if (hash) {
    return `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1&title=0&byline=0&portrait=0`
  }
  return `https://player.vimeo.com/video/${videoId}?autoplay=1&title=0&byline=0&portrait=0`
}

export default function GiftPage() {
  const params = useParams()
  const { track } = useCrmTracking()
  const thankYouRef = useRef<HTMLDivElement>(null)
  const [hasTrackedThankYou, setHasTrackedThankYou] = useState(false)

  const path = params.path as Path
  const mode = params.mode as Mode

  const [audioOnly, setAudioOnly] = useState(false)
  const [videoPlaying, setVideoPlaying] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const playerRef = useRef<any>(null)

  // Validate path and mode
  const validPaths: Path[] = ['woman_self', 'woman_partner', 'man_self', 'man_partner', 'couple']
  const validModes: Mode[] = ['explore', 'repair']

  const isValidPath = validPaths.includes(path)
  const isValidMode = validModes.includes(mode)

  if (!isValidPath || !isValidMode) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center" dir="rtl">
        <p className="text-ink text-xl">הדף לא נמצא</p>
      </div>
    )
  }

  const pathData = quizContent.paths[path]
  const gift = pathData.gift[mode]
  const isCouple = path === 'couple'
  const hasSoftRow = pathData.softRow.length > 0

  // Track thank you view when it comes into view
  useEffect(() => {
    if (hasTrackedThankYou) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track('thankyou_view', { path, mode })
          setHasTrackedThankYou(true)
        }
      },
      { threshold: 0.5 }
    )

    if (thankYouRef.current) {
      observer.observe(thankYouRef.current)
    }

    return () => observer.disconnect()
  }, [path, mode, track, hasTrackedThankYou])

  // Initialize Vimeo player when iframe is ready
  useEffect(() => {
    const initPlayer = () => {
      if (videoPlaying && iframeRef.current && typeof window !== 'undefined' && (window as any).Vimeo) {
        playerRef.current = new (window as any).Vimeo.Player(iframeRef.current)
      }
    }

    // Try immediately
    initPlayer()

    // Also try after a short delay in case SDK isn't loaded yet
    const timeout = setTimeout(initPlayer, 1000)
    return () => clearTimeout(timeout)
  }, [videoPlaying])

  const handlePlayVideo = () => {
    setVideoPlaying(true)
    setIsPaused(false)
    track('gift_play', { path, mode })
  }

  const handleAudioOnly = () => {
    setAudioOnly(true)
    track('gift_audio_only', { path, mode })
  }

  const handlePlayPause = async () => {
    if (!playerRef.current) {
      // Try to initialize player if not ready
      if (iframeRef.current && (window as any).Vimeo) {
        playerRef.current = new (window as any).Vimeo.Player(iframeRef.current)
      }
    }

    if (playerRef.current) {
      try {
        if (isPaused) {
          await playerRef.current.play()
        } else {
          await playerRef.current.pause()
        }
        setIsPaused(!isPaused)
      } catch (e) {
        console.error('Play/pause error:', e)
      }
    }
  }

  const handleSeek = async (seconds: number) => {
    if (!playerRef.current) {
      // Try to initialize player if not ready
      if (iframeRef.current && (window as any).Vimeo) {
        playerRef.current = new (window as any).Vimeo.Player(iframeRef.current)
      }
    }

    if (playerRef.current) {
      try {
        const currentTime = await playerRef.current.getCurrentTime()
        const newTime = Math.max(0, currentTime + seconds)
        await playerRef.current.setCurrentTime(newTime)
      } catch (e) {
        console.error('Seek error:', e)
      }
    }
  }

  const handlePrimaryCtaClick = () => {
    track('cta_primary_click', { path, mode, target: pathData.cta.target })
  }

  const handleSoftCtaClick = (label: string, target: string) => {
    track('cta_soft_click', { path, mode, label, target })
  }

  return (
    <div className="min-h-screen bg-cream" dir="rtl">
      {/* Vimeo Player SDK */}
      <Script src="https://player.vimeo.com/api/player.js" strategy="lazyOnload" />

      {/* No header/nav - clean funnel */}

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Part 1: The Gift */}
        <m.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          {/* Video Player */}
          <div className="relative aspect-video bg-night rounded-2xl overflow-hidden mb-6">
            {!videoPlaying ? (
              // Poster/placeholder before play
              <div className="absolute inset-0 flex flex-col items-center justify-center
                bg-gradient-to-br from-night to-dusk text-white">
                <p className="text-lg font-medium text-sand mb-6">{gift.title}</p>

                <div className="flex gap-4">
                  {/* Play video button */}
                  <button
                    onClick={handlePlayVideo}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-brand/90 flex items-center justify-center
                      shadow-lg shadow-brand/30 group-hover:bg-brand transition-colors">
                      <svg className="w-7 h-7 mr-[-3px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                    <span className="text-sm text-sand/80">צפייה</span>
                  </button>

                  {/* Audio only button */}
                  <button
                    onClick={() => { setAudioOnly(true); handlePlayVideo(); }}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center
                      shadow-lg group-hover:bg-white/20 transition-colors border border-white/20">
                      <svg className="w-7 h-7 text-sand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6v12" />
                      </svg>
                    </div>
                    <span className="text-sm text-sand/80">האזנה בלבד</span>
                  </button>
                </div>

                {gift.videoUrl === null && (
                  <p className="mt-4 text-sm text-sand/60">(הסרטון יתווסף בקרוב)</p>
                )}
              </div>
            ) : (
              // Video/Audio playing
              gift.videoUrl ? (
                <>
                  {/* Vimeo iframe - hidden when audio only */}
                  <iframe
                    ref={iframeRef}
                    src={getVimeoEmbedUrl(gift.videoUrl)}
                    className={`absolute inset-0 w-full h-full transition-opacity duration-300 ${
                      audioOnly ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={gift.title}
                  />
                  {/* Audio-only overlay with controls */}
                  {audioOnly && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center
                      bg-gradient-to-br from-night to-dusk text-white p-8">
                      <div className={`w-20 h-20 rounded-full bg-brand/20 flex items-center justify-center mb-4 ${!isPaused ? 'animate-pulse' : ''}`}>
                        <svg className="w-10 h-10 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6v12" />
                        </svg>
                      </div>
                      <p className="text-lg font-medium text-sand mb-2">{gift.title}</p>
                      <p className="text-sm text-sand/60 mb-6">{isPaused ? 'מושהה' : 'מאזינים...'}</p>

                      {/* Playback controls */}
                      <div className="flex items-center gap-4">
                        {/* Rewind 10s */}
                        <button
                          onClick={() => handleSeek(-10)}
                          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center
                            hover:bg-white/20 transition-colors relative"
                        >
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.5 3C17.15 3 21.08 6.03 22.47 10.22L20.1 11C19.05 7.81 16.04 5.5 12.5 5.5C10.54 5.5 8.77 6.22 7.38 7.38L10 10H3V3L5.6 5.6C7.45 4 9.85 3 12.5 3Z" />
                            <path d="M7.5 12V18H9V12H7.5Z" />
                            <path d="M13.5 18C14.88 18 16 16.88 16 15.5V14.5C16 13.12 14.88 12 13.5 12H11V18H13.5ZM12.5 13.5H13.5C14.05 13.5 14.5 13.95 14.5 14.5V15.5C14.5 16.05 14.05 16.5 13.5 16.5H12.5V13.5Z" />
                          </svg>
                        </button>

                        {/* Play/Pause */}
                        <button
                          onClick={handlePlayPause}
                          className="w-16 h-16 rounded-full bg-brand flex items-center justify-center
                            hover:bg-brand-dark transition-colors shadow-lg"
                        >
                          {isPaused ? (
                            <svg className="w-8 h-8 mr-[-2px]" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          ) : (
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                            </svg>
                          )}
                        </button>

                        {/* Forward 10s */}
                        <button
                          onClick={() => handleSeek(10)}
                          className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center
                            hover:bg-white/20 transition-colors relative"
                        >
                          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M11.5 3C6.85 3 2.92 6.03 1.53 10.22L3.9 11C4.95 7.81 7.96 5.5 11.5 5.5C13.46 5.5 15.23 6.22 16.62 7.38L14 10H21V3L18.4 5.6C16.55 4 14.15 3 11.5 3Z" />
                            <path d="M7.5 12V18H9V12H7.5Z" />
                            <path d="M13.5 18C14.88 18 16 16.88 16 15.5V14.5C16 13.12 14.88 12 13.5 12H11V18H13.5ZM12.5 13.5H13.5C14.05 13.5 14.5 13.95 14.5 14.5V15.5C14.5 16.05 14.05 16.5 13.5 16.5H12.5V13.5Z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center
                  bg-gradient-to-br from-night to-dusk text-white">
                  <p className="text-lg font-medium text-sand">{gift.title}</p>
                  <p className="mt-2 text-sm text-sand/60">(הסרטון יתווסף בקרוב)</p>
                </div>
              )
            )}
          </div>

          {/* Player caption and toggle button */}
          <div className="text-center space-y-4">
            <p className="text-ink">
              {quizContent.giftScreen.playerCaption}
            </p>

            {videoPlaying && (
              <button
                onClick={() => setAudioOnly(!audioOnly)}
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full
                  border-2 border-sand/30 text-mist hover:border-brand hover:text-ink
                  transition-colors"
              >
                {audioOnly ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    הצג וידאו
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M15.536 8.464a5 5 0 010 7.072M18.364 5.636a9 9 0 010 12.728M12 6v12" />
                    </svg>
                    {quizContent.giftScreen.audioOnlyButton}
                  </>
                )}
              </button>
            )}

            <p className="text-mist text-sm">
              {quizContent.giftScreen.emailReminder}
            </p>
          </div>
        </m.section>

        {/* Visual separator */}
        <div className="flex items-center justify-center my-12">
          <div className="w-16 h-px bg-gold/40" />
          <div className="w-2 h-2 rounded-full bg-gold/60 mx-3" />
          <div className="w-16 h-px bg-gold/40" />
        </div>

        {/* Part 2: Thank You & Offer */}
        <m.section
          ref={thankYouRef}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Bridge */}
          <div className="space-y-4 text-ink leading-relaxed">
            {pathData.bridge.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>

          {/* Taste line + result line */}
          <div className="bg-white/50 rounded-2xl p-6 border border-sand/20">
            <p className="text-ink leading-relaxed">
              <span className="font-medium">
                {isCouple
                  ? quizContent.thankYouScreen.tasteLine_couple
                  : quizContent.thankYouScreen.tasteLine}
              </span>
              {' '}
              {pathData.resultLine[mode]}
            </p>
          </div>

          {/* Recommendation */}
          <div className="space-y-6">
            <p className="text-ink leading-relaxed">
              {pathData.recommendation[mode]}
            </p>

            {/* Primary CTA button */}
            <Link
              href={getTargetUrl(pathData.cta.target)}
              onClick={handlePrimaryCtaClick}
              className="block w-full p-4 bg-brand text-white font-bold rounded-xl
                text-center text-lg shadow-lg shadow-brand/30
                hover:bg-brand-dark transition-colors
                focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            >
              {pathData.cta.label}
            </Link>
          </div>

          {/* Soft row (only if not empty) */}
          {hasSoftRow && (
            <div className="pt-4 text-center">
              <p className="text-mist mb-4">
                {quizContent.thankYouScreen.softRowIntro}
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {pathData.softRow.map((item, i) => (
                  <Link
                    key={i}
                    href={getTargetUrl(item.target)}
                    onClick={() => handleSoftCtaClick(item.label, item.target)}
                    className="px-5 py-2 rounded-full border-2 border-sand/30
                      text-mist hover:border-brand hover:text-ink
                      transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </m.section>
      </main>
    </div>
  )
}
