# Design & SEO Upgrade Plan v2 — Tal Roman Website

Audit date: 2026-05-02 | Focus: WOW effect, visual polish, SEO

---

## Current baseline (after v1 fixes)
- All pages unified via `PageHero` component ✓
- Communities palette restored to brand ✓
- Nav active state + touch targets ✓
- Garamond font on display headings ✓
- WhatsApp FAB live ✓

---

## 1. Motion & Animation

### 1.1 Section fade-in on scroll
**File:** `src/components/ui/FadeIn.tsx` (new) + apply across all pages

Every major section currently appears static. Add a lightweight `FadeIn` wrapper using framer-motion (already installed v12) that triggers `opacity 0→1` + `translateY 16px→0` when the element enters the viewport.

- [ ] Create `src/components/ui/FadeIn.tsx`:
  ```tsx
  'use client'
  import { motion, useInView } from 'framer-motion'
  import { useRef } from 'react'
  // opacity 0→1, y 20→0, duration 0.6, ease easeOut
  // delay prop for staggering siblings
  ```
- [ ] Wrap each `<section>` on homepage in `<FadeIn>`
- [ ] Wrap each `<section>` on personal-coaching in `<FadeIn>`
- [ ] Wrap each `<section>` on communities in `<FadeIn>`
- [ ] Skip `PageHero` and nav — they should appear immediately

---

### 1.2 Staggered card grid entrance
**Files:** `src/components/CourseCard.tsx`, `src/components/RecommenderCard.tsx`

Card grids should fan in one-by-one instead of all appearing at once.

- [ ] Add `index` prop to both card components (already exists on CourseCard)
- [ ] Apply `delay: index * 0.08` to each card's `FadeIn`
- [ ] Cap delay at `0.4s` max (after 5 cards, no additional delay)

---

### 1.3 Animated stat counter
**File:** `src/app/communities/page.tsx`

The "7,500" participant count should count up when scrolled into view.

- [ ] Create `src/components/ui/CountUp.tsx` — uses `useInView` + `useMotionValue` + `useSpring`
- [ ] Replace the static "7,500" in the hero subtitle and footer CTA with `<CountUp to={7500} />`
- [ ] Duration: 1.8s, ease: spring with low stiffness

---

### 1.4 Parallax depth on PageHero bokeh blobs
**File:** `src/components/ui/BokehBackground.tsx`

The bokeh blobs are static. Add subtle parallax so they drift at different speeds on scroll.

- [ ] Convert `BokehBackground` to `'use client'`
- [ ] Use `useScroll` + `useTransform` from framer-motion
- [ ] Blob 1: moves at 0.15× scroll speed (slow)
- [ ] Blob 2: moves at 0.3× scroll speed (faster)
- [ ] Only runs on desktop (skip on `prefers-reduced-motion`)

---

### 1.5 Hero portrait float animation
**File:** `src/components/HeroSection.tsx`

The portrait is currently static after its entrance animation.

- [ ] Add a gentle idle float: `y: [0, -8, 0]` loop, 6s duration, ease: easeInOut
- [ ] Start after the entrance animation completes (delay: 0.8s)
- [ ] Wrap with `prefers-reduced-motion` check

---

### 1.6 Button shimmer/pulse on hover
**File:** `src/components/ui/CTAButton.tsx`

The primary CTA button has no micro-interaction beyond color change.

- [ ] Add a `::after` pseudo-element with a white shimmer sweep on hover
- [ ] CSS: `@keyframes shimmer { from { left: -100% } to { left: 200% } }`
- [ ] Add to `globals.css` with a `.btn-shimmer` utility class
- [ ] Apply to `CTAButton` and the coaching `CtaButton`

---

## 2. Visual Design Upgrades

### 2.1 Section wave divider between dark and cream
**File:** new `src/components/ui/WaveDivider.tsx`

The hard cut between dark sections (`bg-night`) and light sections (`bg-cream`) looks abrupt. A subtle SVG wave at the boundary adds depth.

- [ ] Create `WaveDivider` component with a gentle wave path in `fill-cream` or `fill-night`
- [ ] Props: `inverted?: boolean` (controls wave direction)
- [ ] Use `clip-path: polygon(...)` or inline SVG — inline SVG is better for RTL
- [ ] Apply between: hero → content on homepage, pricing → FAQ on coaching, night sections throughout
- [ ] Wave height: `80px` desktop, `48px` mobile

---

### 2.2 Glassmorphism testimonial cards
**File:** `src/components/RecommenderCard.tsx`

Currently plain white cards. On dark background sections, a frosted glass treatment looks premium.

- [ ] For the dark section variant: `bg-white/8 backdrop-blur-md border border-white/15`
- [ ] For light section: keep `bg-white border border-gold/15`
- [ ] Add a subtle gold shimmer border on hover: `hover:border-gold/40 hover:shadow-[0_0_20px_rgba(230,192,96,0.15)]`

---

### 2.3 Trust bar / media logos strip
**File:** new section on homepage + `src/app/page.tsx`

Tal has been in ynet, מאקו, וואלה, ערוץ 12. These logos should appear as a horizontal "As seen in" bar between the hero and the courses section. This is a major trust signal.

- [ ] Create `src/components/MediaLogoStrip.tsx`
- [ ] Fetch media mentions from Sanity and extract unique source logos
- [ ] Display as a horizontally scrolling strip on mobile, centered row on desktop
- [ ] Background: `bg-cream/80 border-y border-gold/20`
- [ ] Eyebrow text: "כפי שסוקרה ב..."
- [ ] Add to homepage between HeroSection and the courses section

---

### 2.4 Homepage: "About Tal" section redesign
**File:** `src/app/page.tsx` (the AboutSection)

Currently the about section has a basic layout. Replace with a two-column split: stats on one side, story on the other.

- [ ] Left column: 3 large stats with animated counters
  - `+7,500` קהילה
  - `+500` נשים לוו
  - `8` שנות ניסיון
- [ ] Right column: Tal's photo (editorial crop, not circle) + 2-3 lines of bio
- [ ] Add a "קראו עוד על טל" link to the about page (once it's built)

---

### 2.5 Course cards — hover reveal overlay
**File:** `src/components/CourseCard.tsx`

Course cards are flat white cards. Add a hover state that reveals a gold overlay with a "לפרטים" action.

- [ ] On hover: overlay appears `opacity 0→0.95` from bottom, containing the CTA button
- [ ] Background: `bg-gradient-to-t from-dusk/90 to-transparent`
- [ ] "לפרטים" button in gold text appears in the overlay
- [ ] Transition: `duration-300 ease-out`

---

### 2.6 Personal coaching pricing card upgrade
**File:** `src/app/personal-coaching/page.tsx`

The ₪400 pricing block uses emoji icons (📍 🗓 🔒). Replace with SVG icons and elevate the design.

- [ ] Replace emoji icons with inline SVG icons (Location, Calendar, Lock) in `text-gold`
- [ ] The ₪400 price uses `font-extrabold` but not Garamond — switch to `font-garamond` for elegance
- [ ] Add a thin gold animated border around the pricing card: `ring-1 ring-gold/30 hover:ring-gold/60 transition-all`
- [ ] Add a "ניהול חופשי ✓" trust badge beneath the price

---

### 2.7 Footer upgrade — richer layout
**File:** `src/components/Footer.tsx`

Check current footer — it's minimal (3 columns: brand, nav, contact). Add a newsletter signup or a meaningful CTA.

- [ ] Add a top strip to the footer: dark band with text "רוצים להתעדכן?" + email input + subscribe button
- [ ] OR add social proof quote from Tal in the footer
- [ ] Add copyright year dynamic: `{new Date().getFullYear()}`
- [ ] Add proper semantic `<footer>` if not present

---

### 2.8 Dark section subtle noise texture
**File:** `src/app/globals.css`

Dark (`bg-night`, `bg-dusk`) sections look flat. A 3% noise texture gives them depth and warmth — like velvet vs plain black.

- [ ] Add `.noise` utility class:
  ```css
  .noise::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,..."); /* SVG noise */
    opacity: 0.03;
    pointer-events: none;
    z-index: 0;
  }
  ```
- [ ] Apply to the `bg-night` and `bg-dusk` sections that have `relative` + `overflow-hidden`
- [ ] Generate the noise SVG: a 200×200 `feTurbulence` filter SVG data URI

---

## 3. SEO — Structured Data

### 3.1 PersonJsonLd — add social links + complete fields
**File:** `src/components/JsonLd.tsx` + `src/app/layout.tsx`

The `PersonJsonLd` component exists but has an empty `sameAs` array and isn't added to layout.

- [ ] Add `sameAs` to `PersonJsonLd`:
  ```json
  "sameAs": [
    "https://www.instagram.com/talroman/",
    "https://www.facebook.com/tal.roman",
    "https://www.tiktok.com/discover/Tal-roman"
  ]
  ```
- [ ] Add `image`, `telephone`, `address` fields
- [ ] Add `<PersonJsonLd />` to `src/app/layout.tsx` (root layout — appears on every page)
- [ ] Add `knowsAbout`: `["מיניות", "אינטימיות", "זוגיות", "ליווי אישי"]`

---

### 3.2 FAQ schema on personal-coaching page
**File:** `src/app/personal-coaching/page.tsx`

The page has 7 FAQ items. Google will show these as rich results in search.

- [ ] Add to `JsonLd.tsx`:
  ```tsx
  export function FaqJsonLd({ items }: { items: { q: string, a: string }[] })
  ```
- [ ] Add `<FaqJsonLd items={faq} />` to `personal-coaching/page.tsx`

---

### 3.3 Missing meta descriptions on all pages
**Files:** courses, recommendations, contact, media pages

Most inner pages have `{ title: '...' }` with no `description`. Google uses these in search snippets.

- [ ] `courses/page.tsx`: add description: `"קורסים, סדנאות וליווי אישי של טל רומן בנושא מיניות, אינטימיות וזוגיות. תכנים שנבנו מתוך ניסיון אמיתי."`
- [ ] `recommendations/page.tsx`: add description: `"מה אומרות נשים שהשתתפו בסדנאות ובקורסים של טל רומן. המלצות אמיתיות על ליווי אישי ועל קורסי מיניות."`
- [ ] `contact/page.tsx`: add description: `"צרו קשר עם טל רומן — מדריכת מיניות ואינטימיות. זמינה בוואטסאפ, טלפון ומייל. מגיבה תוך 24 שעות."`
- [ ] `media/page.tsx`: add description: `"טל רומן בתקשורת — ראיונות וכתבות ב-ynet, מאקו, וואלה, ערוץ 12 ועוד."`
- [ ] `communities/page.tsx`: add description: `"הצטרפו לקהילות הפייסבוק והוואטסאפ של טל רומן — קהילות מתחברים ומתחברות. כ-7,500 חברים. בחינם."`
- [ ] `personal-coaching/page.tsx`: add description: `"תהליך ליווי אישי עם טל רומן — ליווי רגשי ומקצועי בנושא מיניות, אינטימיות ויחסים. מרחב בטוח, לא שיפוטי."`

---

### 3.4 OpenGraph images per page
**Files:** All page metadata files

Currently `openGraph` only has `locale` and `type`. No image means WhatsApp/Facebook previews show nothing.

- [ ] Add a default OG image: Tal's portrait as `/public/og-default.jpg` (1200×630)
- [ ] Add to `layout.tsx` default metadata: `openGraph: { images: [{ url: '/og-default.jpg', width: 1200, height: 630 }] }`
- [ ] Override per-page for courses: use course cover image
- [ ] Override for articles: use article thumbnail

---

### 3.5 Breadcrumb schema + visible breadcrumbs
**Files:** All inner pages

Breadcrumbs help Google understand site structure and appear in search results.

- [ ] Add to `JsonLd.tsx`:
  ```tsx
  export function BreadcrumbJsonLd({ items }: { items: { name: string, url: string }[] })
  ```
- [ ] Add `<BreadcrumbJsonLd>` to every inner page
- [ ] Add a small visible breadcrumb nav below the PageHero on each page:
  `בית > ליווי אישי` — small `text-gold/50 text-xs` line
- [ ] This also adds an internal link from every page back to homepage

---

### 3.6 LocalBusiness schema
**File:** `src/components/JsonLd.tsx` + `src/app/layout.tsx`

Tal has a clinic in South Tel Aviv. LocalBusiness schema helps with local Google search.

- [ ] Add `LocalBusinessJsonLd` to `JsonLd.tsx`:
  ```json
  "@type": "LocalBusiness",
  "name": "טל רומן — ליווי אישי",
  "address": { "@type": "PostalAddress", "addressLocality": "תל אביב", "addressCountry": "IL" },
  "telephone": "058-654-0744",
  "priceRange": "₪₪"
  ```
- [ ] Add to layout.tsx alongside PersonJsonLd

---

### 3.7 Internal linking strategy
**Files:** homepage, personal-coaching, recommendations, communities

Pages rarely link to each other. Google scores internal link depth.

- [ ] Homepage courses section → link each card to its page (already done via CTAButton?)
- [ ] Personal-coaching FAQ section → add "לקורסים שלי" link in one FAQ answer
- [ ] Recommendations page → "לפרטי הסדנה" buttons (already exist) — verify they work
- [ ] Communities page footer CTA → add "לכל הקורסים ←" link
- [ ] Articles page → each article → link to related course in the article footer

---

### 3.8 Title tag optimization
**Files:** All page `metadata` exports

Page titles should include the primary keyword AND Tal's name consistently.

Current format: `"קהילות — טל רומן"` — good
Bad examples: `"קורסים ומוצרים"` (no name), `"צור קשר"` (no name)

- [ ] `courses/page.tsx`: `"הקורסים שלי — טל רומן | מיניות ואינטימיות"`
- [ ] `contact/page.tsx`: `"צרו קשר — טל רומן | ליווי אישי"`
- [ ] `recommendations/page.tsx`: `"המלצות — טל רומן | קורסים ואינטימיות"`
- [ ] `media/page.tsx`: `"טל רומן בתקשורת — ynet, מאקו, וואלה"`
- [ ] `personal-coaching/page.tsx`: `"ליווי אישי — טל רומן | מיניות ואינטימיות"`

---

## 4. UX & Conversion

### 4.1 Scroll-triggered "Book a session" sticky mini-bar
**File:** new `src/components/ui/StickyBookingBar.tsx`

After scrolling 400px past the homepage hero, a slim bar appears at the bottom:
`"רוצים להתחיל? → קבעו שיחת היכרות חינם"`

- [ ] Only appears on homepage and personal-coaching
- [ ] Dismissable with an X
- [ ] `fixed bottom-0 left-0 right-0 bg-brand text-white py-3 px-6`
- [ ] Animated: slides up from bottom when triggered
- [ ] Hides on scroll up (like the nav)

---

### 4.2 Build the About page
**File:** `src/app/about/page.tsx`

Currently redirects to homepage. A real About page is the #1 trust builder for a personal brand.

- [ ] Remove `redirect('/')`
- [ ] Add to nav links in `constants.ts`
- [ ] Sections:
  - PageHero: eyebrow "מי אני", title "טל רומן"
  - Story section: Tal's personal journey (2-3 paragraphs)
  - Credentials/training section
  - Stats: years experience, people helped, communities
  - Quote / personal philosophy
  - CTA to personal-coaching

---

### 4.3 Contact page — response time promise
**File:** `src/app/contact/page.tsx`

Users hesitate to fill forms without knowing if they'll hear back. Add a trust line.

- [ ] Add below the form title: `"מגיבה בדרך כלל תוך 24 שעות ⏱"`
- [ ] Small `text-mist text-sm` below the subtitle

---

### 4.4 Personal coaching: add a "free first session" hook
**File:** `src/app/personal-coaching/page.tsx`

The current pricing is ₪400/session with no low-barrier entry. Add context about a free intro call.

- [ ] Add a line near the pricing: `"השיחה הראשונה — שיחת היכרות חינמית של 20 דקות"`
- [ ] Small badge: `bg-gold/10 text-gold border border-gold/30 rounded-full text-xs px-3 py-1`

---

### 4.5 Homepage: missing headline keyword
**File:** `src/app/page.tsx`

The homepage H1 comes from Sanity (`headline` prop). Check that it contains the primary keyword "מיניות ואינטימיות" or similar. If the Sanity content doesn't, the H1 will miss the top keyword.

- [ ] Check what the actual H1 content is from Sanity
- [ ] If it's just "טל רומן", suggest updating in Sanity to something like "מגשרת על פערים באינטימיות וביחסים"
- [ ] Ensure the `<meta description>` at root level includes "מיניות, אינטימיות, זוגיות, ליווי אישי"

---

## 5. Performance & Technical

### 5.1 Preload Garamond font
**File:** `src/app/layout.tsx`

EB Garamond is used on every page hero H1. Without preloading it shows a flash of unstyled text (FOUT) before the font loads.

- [ ] Add to `<head>` in layout.tsx:
  ```html
  <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
  ```
- [ ] The Next.js font loader (`EB_Garamond({ display: 'swap' })`) already handles this — verify `display: 'optional'` vs `'swap'` for above-the-fold text. `'optional'` prevents layout shift at cost of not loading on slow connections.

---

### 5.2 Sanity CDN preconnect
**File:** `src/app/layout.tsx`

All images come from Sanity's CDN. A preconnect hint saves ~100ms on first image fetch.

- [ ] Add: `<link rel="preconnect" href="https://cdn.sanity.io" />`

---

### 5.3 Image optimization audit
**Files:** All pages with `next/image`

Some images may have incorrect `sizes` values causing oversized downloads.

- [ ] Audit `<Image sizes="...">` on: HeroSection portrait, CourseCard thumbnails, RecommenderCard
- [ ] Hero portrait: `sizes="(max-width: 768px) 320px, 460px"` — already correct
- [ ] RecommenderCard: check current value
- [ ] Add `quality={85}` to large images (default is 75 for some)

---

## Priority Order

| # | Item | Category | Impact | Effort | Do First |
|---|------|----------|--------|--------|----------|
| 1 | Section fade-in animations (1.1) | Motion | High | 45 min | ✓ |
| 2 | Staggered card entrance (1.2) | Motion | High | 20 min | ✓ |
| 3 | FAQ schema personal-coaching (3.2) | SEO | High | 15 min | ✓ |
| 4 | PersonJsonLd complete + add to layout (3.1) | SEO | High | 20 min | ✓ |
| 5 | Meta descriptions all pages (3.3) | SEO | High | 20 min | ✓ |
| 6 | Title tag optimization (3.8) | SEO | High | 15 min | ✓ |
| 7 | Wave divider dark→cream transitions (2.1) | Visual | High | 45 min | |
| 8 | Media logo trust bar on homepage (2.3) | Visual+Trust | High | 60 min | |
| 9 | OG images per page (3.4) | SEO | Medium | 30 min | |
| 10 | Breadcrumb schema + visible nav (3.5) | SEO | Medium | 30 min | |
| 11 | LocalBusiness schema (3.6) | SEO | Medium | 15 min | |
| 12 | Animated stat counter (1.3) | Motion | Medium | 30 min | |
| 13 | About page (4.2) | Content | High | 90 min | |
| 14 | Glassmorphism testimonial cards (2.2) | Visual | Medium | 20 min | |
| 15 | Course card hover reveal (2.5) | Visual | Medium | 30 min | |
| 16 | Parallax bokeh (1.4) | Motion | Medium | 30 min | |
| 17 | Sticky booking bar (4.1) | Conversion | Medium | 45 min | |
| 18 | Pricing card upgrade (2.6) | Visual | Low | 20 min | |
| 19 | Noise texture on dark sections (2.8) | Visual | Low | 20 min | |
| 20 | Hero portrait float animation (1.5) | Motion | Low | 15 min | |
| 21 | Button shimmer (1.6) | Motion | Low | 20 min | |
| 22 | Footer upgrade (2.7) | Visual | Low | 45 min | |
| 23 | Sanity CDN preconnect (5.2) | Perf | Low | 5 min | |
| 24 | Internal linking strategy (3.7) | SEO | Medium | 30 min | |
| 25 | Contact response time (4.3) | UX | Low | 5 min | |
| 26 | Free first session hook (4.4) | Conversion | Medium | 10 min | |
