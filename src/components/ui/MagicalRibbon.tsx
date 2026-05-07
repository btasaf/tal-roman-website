'use client'

import { useEffect, useRef } from 'react'
import { useScroll } from 'framer-motion'

// ╔══════════════════════════════════════════════════════════════════════════╗
// ║  EDIT THIS BLOCK TO CHANGE EVERYTHING                                   ║
// ╚══════════════════════════════════════════════════════════════════════════╝

const CONFIG = {
  // ── Path the fairy travels while scrolling ──────────────────────────────
  // x: 0 = left edge, 1 = right edge. Keep < 0.14 or > 0.86 to stay on sides.
  // y: 0 = viewport top, 1 = viewport bottom
  // at: scroll progress (0–1) when the fairy is at this point
  waypoints: [
    { x: 0.93, y: 0.08, at: 0.00 },
    { x: 0.91, y: 0.20, at: 0.11 },
    { x: 0.89, y: 0.33, at: 0.22 },
    { x: 0.92, y: 0.46, at: 0.33 },
    { x: 0.90, y: 0.58, at: 0.44 },
    { x: 0.88, y: 0.68, at: 0.55 },
    { x: 0.91, y: 0.78, at: 0.68 },
    { x: 0.93, y: 0.86, at: 0.80 },
    { x: 0.90, y: 0.93, at: 1.00 },
  ],

  // ── Shape drawn when user stops scrolling ────────────────────────────────
  // scrollAt: shape becomes active at this scroll progress
  // shape: key from SHAPES map (heart | infinity | spiral | rose5 | trefoil | lissajous | star5 | orbit)
  // size: radius in pixels — keep 40–85
  idleShapes: [
    { scrollAt: 0.00, shape: 'heart',     size: 55 },
    { scrollAt: 0.14, shape: 'infinity',  size: 50 },
    { scrollAt: 0.28, shape: 'spiral',    size: 58 },
    { scrollAt: 0.42, shape: 'rose5',     size: 50 },
    { scrollAt: 0.56, shape: 'lissajous', size: 54 },
    { scrollAt: 0.70, shape: 'trefoil',   size: 46 },
    { scrollAt: 0.84, shape: 'star5',     size: 50 },
  ],

  // ── Ribbon feel ──────────────────────────────────────────────────────────
  ribbon: {
    idleThreshold:   62,    // frames before idle mode begins  (~1s at 60fps)
    idleBlendFrames: 38,    // frames to blend in/out of shape
    trailLength:    120,    // trail points while scrolling
    idleTrailLength:165,    // trail points during idle shapes (covers full loop)
    loopAmplitude:   10,    // px — inward wiggle while scrolling
    depthMin:       0.60,   // scale at "far" point of breath cycle
    depthMax:       1.00,   // scale at "close" point
    depthSpeed:   0.00042,  // breath speed (~15s full cycle)
    maxTrailWidth:   8,     // px at ribbon head (multiplied by depth)
    glowRadius:     15,     // px head glow (multiplied by depth)
  },
}

// ── Hue progression (scroll-driven) ──────────────────────────────────────────
// Lightness is computed at runtime from background luminance.
const HUE_STOPS = [
  { at: 0.00, h: 285 }, // Violet
  { at: 0.28, h: 333 }, // Deep rose
  { at: 0.58, h:  43 }, // Rich gold
  { at: 0.85, h: 316 }, // Mauve
  { at: 1.00, h: 316 },
]

// ── Shape library ─────────────────────────────────────────────────────────────
// Each fn(t) returns { x, y } normalized to roughly ±1. Multiply by size for px.
// All shapes are closed loops with period 2π.
type Pt = { x: number; y: number }
const SHAPES: Record<string, { fn: (t: number) => Pt; duration: number }> = {
  // ❤ Heart
  heart: {
    duration: 2000,
    fn: (t) => ({
      x:  16 * Math.pow(Math.sin(t), 3) / 16,
      y: -(13*Math.cos(t) - 5*Math.cos(2*t) - 2*Math.cos(3*t) - Math.cos(4*t)) / 17,
    }),
  },
  // ∞ Lemniscate of Bernoulli
  infinity: {
    duration: 2200,
    fn: (t) => {
      const d = 1 + Math.sin(t) * Math.sin(t)
      return { x: Math.cos(t) / d, y: Math.sin(t) * Math.cos(t) / d }
    },
  },
  // Inward-then-outward spiral (closed loop)
  spiral: {
    duration: 2600,
    fn: (t) => {
      const r = t < Math.PI ? t / Math.PI : (2 * Math.PI - t) / Math.PI
      const angle = t * 3
      return { x: r * Math.cos(angle), y: r * Math.sin(angle) }
    },
  },
  // 5-petal rose  r = cos(5θ)
  rose5: {
    duration: 2400,
    fn: (t) => {
      const r = Math.cos(5 * t)
      return { x: r * Math.cos(t), y: r * Math.sin(t) }
    },
  },
  // 3-leaf trefoil  r = cos(3θ)
  trefoil: {
    duration: 2000,
    fn: (t) => {
      const r = Math.cos(3 * t)
      return { x: r * Math.cos(t), y: r * Math.sin(t) }
    },
  },
  // Lissajous 3:2
  lissajous: {
    duration: 2500,
    fn: (t) => ({
      x: Math.sin(3 * t + Math.PI / 4),
      y: Math.sin(2 * t),
    }),
  },
  // 5-pointed star (smooth radius alternation)
  star5: {
    duration: 2200,
    fn: (t) => {
      const frac = ((t / (Math.PI * 2)) * 5) % 1
      const r = frac < 0.5
        ? 1 - (1 - 0.38) * frac * 2
        : 0.38 + (1 - 0.38) * (frac - 0.5) * 2
      return { x: r * Math.cos(t - Math.PI / 2), y: r * Math.sin(t - Math.PI / 2) }
    },
  },
  // Two fairies orbiting each other (uses second trail for partner)
  orbit: {
    duration: 2000,
    fn: (t) => ({ x: 0.50 * Math.cos(t), y: 0.40 * Math.sin(t) }),
  },
}

// ─────────────────────────────────────────────────────────────────────────────

interface Particle {
  x: number; y: number; vx: number; vy: number
  size: number; born: number; life: number
  r: number; g: number; b: number
  rot: number; active: boolean
}
interface BgSample { absY: number; lum: number }

// ── Math helpers ──────────────────────────────────────────────────────────────

function lerp(a: number, b: number, t: number) { return a + (b - a) * t }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)) }
function easeInOutSine(t: number) { return -(Math.cos(Math.PI * t) - 1) / 2 }
function easeInOutCubic(t: number) {
  return t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3) / 2
}

// ── HSL helpers ───────────────────────────────────────────────────────────────

function hslToRgb(h: number, s: number, l: number) {
  h /= 360
  if (s === 0) { const v = Math.round(l * 255); return { r: v, g: v, b: v } }
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s
  const p = 2 * l - q
  const hf = (t: number) => {
    if (t < 0) t += 1; if (t > 1) t -= 1
    if (t < 1/6) return p + (q-p)*6*t
    if (t < 1/2) return q
    if (t < 2/3) return p + (q-p)*(2/3-t)*6
    return p
  }
  return { r: Math.round(hf(h+1/3)*255), g: Math.round(hf(h)*255), b: Math.round(hf(h-1/3)*255) }
}

function lerpHue(a: number, b: number, t: number) {
  let d = b - a
  if (d > 180) d -= 360
  if (d < -180) d += 360
  return (a + d * t + 360) % 360
}

// ── Background luminance scanner ──────────────────────────────────────────────

function parseRgbLum(css: string): number | null {
  const m = css.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?/)
  if (!m) return null
  if (m[4] !== undefined && parseFloat(m[4]) < 0.08) return null
  return 0.299*parseInt(m[1])/255 + 0.587*parseInt(m[2])/255 + 0.114*parseInt(m[3])/255
}

function buildBgMap(): BgSample[] {
  const map: BgSample[] = []
  const bodyLum = parseRgbLum(getComputedStyle(document.body).backgroundColor) ?? 0.05
  map.push({ absY: 0, lum: bodyLum })
  document.querySelectorAll('section, header, footer, main > div, main > section').forEach(el => {
    const lum = parseRgbLum(getComputedStyle(el).backgroundColor)
    if (lum === null) return
    map.push({ absY: el.getBoundingClientRect().top + window.scrollY, lum })
  })
  return map.sort((a, b) => a.absY - b.absY)
}

function bgLumAt(absY: number, map: BgSample[]) {
  let lum = map[0]?.lum ?? 0.05
  for (const s of map) { if (s.absY <= absY) lum = s.lum; else break }
  return lum
}

// ── Contrast-aware color ──────────────────────────────────────────────────────

function colorAt(scrollProg: number, bgLum: number) {
  let h = HUE_STOPS[HUE_STOPS.length - 1].h
  for (let i = 0; i < HUE_STOPS.length - 1; i++) {
    const a = HUE_STOPS[i], b = HUE_STOPS[i+1]
    if (scrollProg >= a.at && scrollProg <= b.at) {
      h = lerpHue(a.h, b.h, (scrollProg - a.at) / (b.at - a.at))
      break
    }
  }
  const l = lerp(0.78, 0.32, clamp((bgLum - 0.05) / 0.75, 0, 1))
  const s = bgLum > 0.5 ? 0.82 : 0.78
  return hslToRgb(h, s, l)
}

// ── Waypoint interpolation ────────────────────────────────────────────────────

function waypointPos(scroll: number, vw: number, vh: number): Pt {
  const wps = CONFIG.waypoints
  if (scroll <= wps[0].at) return { x: wps[0].x * vw, y: wps[0].y * vh }
  const last = wps[wps.length - 1]
  if (scroll >= last.at) return { x: last.x * vw, y: last.y * vh }
  for (let i = 0; i < wps.length - 1; i++) {
    const a = wps[i], b = wps[i+1]
    if (scroll >= a.at && scroll <= b.at) {
      const t = easeInOutSine((scroll - a.at) / (b.at - a.at))
      return { x: lerp(a.x * vw, b.x * vw, t), y: lerp(a.y * vh, b.y * vh, t) }
    }
  }
  return { x: vw / 2, y: vh / 2 }
}

// ── Drawing ───────────────────────────────────────────────────────────────────

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, sz: number, rot: number,
  r: number, g: number, b: number, a: number,
) {
  ctx.save()
  ctx.translate(x, y); ctx.rotate(rot)
  ctx.globalAlpha = clamp(a, 0, 1)
  ctx.fillStyle = `rgb(${r},${g},${b})`
  ctx.shadowColor = `rgba(${r},${g},${b},0.7)`
  ctx.shadowBlur = sz * 2.5
  ctx.beginPath()
  for (let i = 0; i < 8; i++) {
    const ang = (i * Math.PI) / 4
    const rad = i % 2 === 0 ? sz : sz * 0.35
    if (i === 0) ctx.moveTo(Math.cos(ang)*rad, Math.sin(ang)*rad)
    else         ctx.lineTo(Math.cos(ang)*rad, Math.sin(ang)*rad)
  }
  ctx.closePath(); ctx.fill(); ctx.restore()
}

function drawTrail(
  ctx: CanvasRenderingContext2D,
  trail: Pt[],
  r: number, g: number, b: number,
  alpha = 1,
  depth = 1,
  maxW  = 8,
) {
  if (trail.length < 2) return
  const w0 = maxW * depth
  // Pass 1 — soft white underglow
  for (let i = 1; i < trail.length; i++) {
    const t = i / trail.length
    const a = clamp(Math.pow(t, 1.8) * alpha * 0.28, 0, 1)
    const w = lerp(0.4, w0 * 1.6, t)
    const p0 = trail[i-1], p1 = trail[i]
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y)
    ctx.strokeStyle = `rgba(255,255,255,${a})`
    ctx.lineWidth = w; ctx.lineCap = 'round'
    ctx.shadowColor = 'rgba(255,255,255,0.3)'; ctx.shadowBlur = w
    ctx.stroke(); ctx.shadowBlur = 0
  }
  // Pass 2 — colored ribbon
  for (let i = 1; i < trail.length; i++) {
    const t = i / trail.length
    const a = clamp(Math.pow(t, 1.5) * alpha, 0, 1)
    const w = lerp(0.4, w0, t)
    const p0 = trail[i-1], p1 = trail[i]
    const grd = ctx.createLinearGradient(p0.x, p0.y, p1.x, p1.y)
    grd.addColorStop(0, `rgba(${r},${g},${b},${clamp(a-0.08,0,1)})`)
    grd.addColorStop(1, `rgba(${r},${g},${b},${a})`)
    ctx.beginPath(); ctx.moveTo(p0.x, p0.y); ctx.lineTo(p1.x, p1.y)
    ctx.strokeStyle = grd; ctx.lineWidth = w; ctx.lineCap = 'round'
    ctx.shadowColor = `rgba(${r},${g},${b},0.65)`; ctx.shadowBlur = w * 2.2
    ctx.stroke(); ctx.shadowBlur = 0
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function MagicalRibbon() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { scrollYProgress } = useScroll()
  const scrollRef = useRef(0)

  useEffect(() => {
    return scrollYProgress.on('change', v => { scrollRef.current = v })
  }, [scrollYProgress])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rawCtx = canvas.getContext('2d')
    if (!rawCtx) return
    const ctx: CanvasRenderingContext2D = rawCtx

    let vw = window.innerWidth, vh = window.innerHeight
    let mobile = vw < 768
    canvas.width = vw; canvas.height = vh

    const ro = new ResizeObserver(() => {
      vw = window.innerWidth; vh = window.innerHeight
      mobile = vw < 768
      canvas.width = vw; canvas.height = vh
      setTimeout(() => { bgMap = buildBgMap() }, 120)
    })
    ro.observe(document.documentElement)

    // Trails: [0] = main fairy, [1] = orbit partner
    const trails: Pt[][] = [[], []]

    // Particle pool
    const POOL = 36
    const pool: Particle[] = Array.from({ length: POOL }, () => ({
      x:0, y:0, vx:0, vy:0, size:0, born:0, life:0, r:200, g:164, b:212, rot:0, active:false,
    }))

    // Background map
    let bgMap: BgSample[] = []
    let bgLum = 0.05
    setTimeout(() => { bgMap = buildBgMap() }, 320)

    // Idle / shape state
    let lastScrollY    = window.scrollY
    let idleFrames     = 0
    let idleBlend      = 0   // 0 = scrolling, 1 = fully in idle shape
    let shapePhase     = 0
    let shapeEnteredAt = -1

    let frameN = 0
    let raf: number

    const { idleThreshold, idleBlendFrames, loopAmplitude, depthMin, depthMax,
            depthSpeed, maxTrailWidth, glowRadius } = CONFIG.ribbon

    function spawn(x: number, y: number, col: {r:number,g:number,b:number}, now: number, big: boolean) {
      const p = pool.find(p => !p.active); if (!p) return
      const ang = Math.random() * Math.PI * 2
      const sp  = Math.random() * 1.4 + 0.3
      p.x = x + (Math.random()-0.5)*6; p.y = y + (Math.random()-0.5)*6
      p.vx = Math.cos(ang)*sp; p.vy = Math.sin(ang)*sp - 0.5
      p.size = Math.random()*(big ? 4 : 2.5) + (big ? 1.5 : 1)
      p.born = now; p.life = Math.random()*600+500
      p.r = col.r; p.g = col.g; p.b = col.b
      p.rot = Math.random()*Math.PI*2; p.active = true
    }

    function tick(now: number) {
      raf = requestAnimationFrame(tick)
      frameN++

      const s    = scrollRef.current
      const curY = window.scrollY

      // ── Idle detection ────────────────────────────────────────────────────
      if (Math.abs(curY - lastScrollY) > 0.8) {
        idleFrames = 0; lastScrollY = curY
        idleBlend = Math.max(0, idleBlend - 1 / idleBlendFrames)
      } else {
        idleFrames++
        if (idleFrames >= idleThreshold)
          idleBlend = Math.min(1, idleBlend + 1 / idleBlendFrames)
      }
      const blend = easeInOutCubic(idleBlend)

      // ── Active shape ──────────────────────────────────────────────────────
      let shapeCfg = CONFIG.idleShapes[0]
      for (const sc of CONFIG.idleShapes) { if (s >= sc.scrollAt) shapeCfg = sc }
      const shapeDef  = SHAPES[shapeCfg.shape] ?? SHAPES.heart
      const shapeSize = shapeCfg.size
      const isOrbit   = shapeCfg.shape === 'orbit'

      // Advance shape phase on a timer (not scroll-speed-dependent)
      if (idleBlend > 0) {
        if (shapeEnteredAt < 0) shapeEnteredAt = now
        shapePhase = ((now - shapeEnteredAt) / shapeDef.duration * Math.PI * 2) % (Math.PI * 2)
      } else {
        shapeEnteredAt = -1; shapePhase = 0
      }

      // ── Trail length (longer during shapes to show full loop) ─────────────
      const tLen = idleBlend > 0
        ? (mobile ? 80  : CONFIG.ribbon.idleTrailLength)
        : (mobile ? 55  : CONFIG.ribbon.trailLength)

      // ── Depth breath (size illusion) ──────────────────────────────────────
      const depth = lerp(depthMin, depthMax, 0.5 + 0.5 * Math.sin(now * depthSpeed))

      // ── Base position from waypoints ──────────────────────────────────────
      const base   = waypointPos(s, vw, vh)
      // Always on the right side — wiggle inward (toward center = negative x)
      const wigX = -Math.abs(Math.sin(now * 0.0027)) * loopAmplitude
      const wigY =  Math.cos(now * 0.0019) * loopAmplitude * 0.5
      const scrollHx = base.x + wigX
      const scrollHy = base.y + wigY

      // ── Shape anchor (pinned to right edge) ───────────────────────────────
      const anchorX = vw * 0.91
      const anchorY = base.y

      // ── Shape head positions ───────────────────────────────────────────────
      const sp   = shapeDef.fn(shapePhase)
      const shapeHx = anchorX + sp.x * shapeSize
      const shapeHy = anchorY + sp.y * shapeSize

      // Blended fairy position
      const hx = lerp(scrollHx, shapeHx, blend)
      const hy = lerp(scrollHy, shapeHy, blend)

      // ── Update trails ─────────────────────────────────────────────────────
      trails[0].push({ x: hx, y: hy })
      if (trails[0].length > tLen) trails[0].shift()

      if (isOrbit && blend > 0.05) {
        // Partner fairy orbits the opposite side
        const f2x = lerp(scrollHx, anchorX - sp.x * shapeSize * 0.9, blend)
        const f2y = lerp(scrollHy, anchorY - sp.y * shapeSize * 0.9, blend)
        trails[1].push({ x: f2x, y: f2y })
        if (trails[1].length > tLen) trails[1].shift()
      } else if (trails[1].length > 0) {
        trails[1].shift() // drain partner trail when not in orbit
      }

      // ── Background sample ─────────────────────────────────────────────────
      if (frameN % 8 === 0 && bgMap.length > 0)
        bgLum = bgLumAt(hy + curY, bgMap)
      const col = colorAt(s, bgLum)

      // ── Render ────────────────────────────────────────────────────────────
      ctx.clearRect(0, 0, vw, vh)

      const edgeFade = s > 0.96 ? clamp(1 - (s - 0.96) / 0.04, 0, 1) : 1
      ctx.globalAlpha = edgeFade

      if (isOrbit && trails[1].length > 1)
        drawTrail(ctx, trails[1], col.r, col.g, col.b, 0.72 * blend, depth, maxTrailWidth)
      drawTrail(ctx, trails[0], col.r, col.g, col.b, 1, depth, maxTrailWidth)

      // Head glow
      const gr = glowRadius * depth
      const hg = ctx.createRadialGradient(hx, hy, 0, hx, hy, gr)
      hg.addColorStop(0,   'rgba(255,255,255,0.95)')
      hg.addColorStop(0.2, `rgba(${col.r},${col.g},${col.b},0.95)`)
      hg.addColorStop(1,   `rgba(${col.r},${col.g},${col.b},0)`)
      ctx.beginPath(); ctx.arc(hx, hy, gr, 0, Math.PI*2)
      ctx.fillStyle = hg; ctx.fill()

      // Particles
      const spawnRate = blend > 0.5 ? 2 : 4
      if (frameN % spawnRate === 0) spawn(hx, hy, col, now, blend > 0.5)

      const poolLimit = mobile ? 16 : POOL
      for (let i = 0; i < poolLimit; i++) {
        const p = pool[i]; if (!p.active) continue
        const age = now - p.born
        if (age >= p.life) { p.active = false; continue }
        const life = 1 - age / p.life
        p.x += p.vx; p.y += p.vy; p.vy += 0.022; p.rot += 0.055
        drawStar(ctx, p.x, p.y, p.size * life, p.rot, p.r, p.g, p.b, life * 0.80)
      }

      ctx.globalAlpha = 1
    }

    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 50 }}
      aria-hidden="true"
    />
  )
}
