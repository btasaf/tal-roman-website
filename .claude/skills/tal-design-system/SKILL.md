---
name: tal-design-system
description: The v2 visual language of talroman.com — palette, typography, layout, backgrounds, motion rules, shared components and the pitfalls we already hit. Use whenever building, restyling or reviewing any UI in this repo (new page, section, landing page, presale, card, button, animation), so new work matches /v2 the first time.
---

# Tal Roman — v2 design system

Premium, warm, calm, intimate (sex & intimacy education). Hebrew RTL. Reference pages: `/v2` (home), `/v2/communities`, `/v2/courses`, `/v2/articles`, `/v2/contact`. Never reuse the old (pre-v2) page styles.

## Palette (Tailwind tokens in `src/app/globals.css`)
| Use | Value |
|---|---|
| Cream background | `bg-cream` #fff2d4 (cards: white/55–70, paper #F4EDE1) |
| Warm gray sections | gradient #5e5955 → #48443f (`AuroraBackground palette="gray"`) |
| Rose (brand / CTAs) | `brand` #c97870, `brand-dark` #a85a54 (use brand-dark or #94483f for small text — #c97870 fails contrast at small sizes) |
| Gold accent | `gold` #e6c060 (on dark only) |
| Dark brown | #2d1a0e (headings, dark bands, footer), #3d2814 (body on cream), #48443f / #5e5955 (secondary text) |
| Logo | rust #C34832 via `LogoMark` |

## Typography
- Headings: `font-sans font-black tracking-[-0.01em]` (Heebo), tight leading (`leading-[1.1]`), `text-balance`.
- One serif accent word per heading: `font-garamond font-bold` in rose (cream bg) or gold (dark bg) — `SectionTitle` supports `accent="…"`.
- **No italics on Hebrew, ever.** Emphasis = weight/colour.
- Body 17–19px, `leading-relaxed`/1.85 for reading, max ~65–75ch. Inputs ≥ 16px (iOS zoom). Labels ≥ 12px.
- Copy: warm, minimal, personal, gender-inclusive plural ("כתבו לי", "אתם") unless a page targets one gender on purpose.

## Layout
- Section padding ~`py-20 md:py-28`, container `max-w-6xl mx-auto px-6`. Mobile first; test 390 / 820 / 1280 / 1440.
- Rounded "shoulders" (`rounded-t-[40px] md:rounded-t-[72px]`) when a section rises over another; never hard 1px seams — one shared background or a gradient/mask fade.
- Fixed elements to keep clear: menu button (top-right, 48px, `top-6 right-6`), docked quiz button (bottom-left, home), page bottom bars. Put `data-hide-dock` on CTA/form wrappers so docks step aside.
- Every v2 page adds: `<style>{\`main.pt-20 { padding-top: 0 !important; } .fixed.bottom-6.left-6 { display: none !important; }\`}</style>`. Don't add another `<main>` (root layout has one).

## Backgrounds & texture (`src/components/v2/backgrounds.tsx`)
`AuroraBackground` (palettes cream/gray), `GrainOverlay` (fade it out with the background at edges, or it draws a visible line), `FlowLines`, `RippleRings`. Media logos: `LogoMarquee` from `media-logos.tsx`. Halftone giant words: `halftone()` in `about/about-content.ts`.

## Motion (framer-motion v12)
- `m` components under `LazyMotion features={domAnimation}`; any `layout`/`layoutId` subtree inside `<LazyMotion features={domMax}>`.
- Springs `bounce: 0` (`enterSpring` = visualDuration 0.8). Animate only transform / opacity / clip-path. Calm, never bouncy.
- Scroll-linked values: function form `useTransform(() => …)` read per frame; pinned sections with native `position: sticky`.
- Reduced motion: **use `useHydratedReducedMotion`** (`src/components/v2/useHydratedReducedMotion.ts`). Don't use framer's `useReducedMotion` or motion-kit's `FadeUp`/`WaveCap` in new code — they cause hydration mismatches. Use the safe helpers in `coaching/motion.tsx` (`FadeUp`, `SectionTitle`) or `recommendations-page/motion.tsx`.
- Background video only from Vimeo via `BackgroundReel` (never host video files on Vercel); it's skipped for reduced-motion users.
- For anything non-trivial, also load the `motion` skill.

## Shared building blocks
`SectionTitle`, `Kicker`, `CtaLink`, `ArrowIcon` (`coaching/ui.tsx`), `LogoMark`, `SocialIcon`, `socialUrls()` / `siteStats()` (`site-stats.ts`, numbers & links from Sanity), `LegalPageV2` + `ToFill` for legal pages, contact form pieces in `contact-page/form-ui.tsx`.

## Pitfalls we already hit
- Hydration errors: no `window`/`Date.now()`/random in render; reduced-motion via the hook above.
- `!inset-auto` overrides `left/top` — centre absolutely-positioned media with explicit classes.
- Text that gets covered mid-scroll in pinned sections: check several scroll positions, not just the top.
- Overlapping sections can swallow clicks: use `pointer-events` passthrough while one overlaps another.
- Hebrew punctuation: stored in logical order; fix RTL issues in content, not with CSS hacks.

After building UI: run visual QA **as a background agent** (see `visual-qa`) — never inline.
