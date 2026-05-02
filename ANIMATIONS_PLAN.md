# Animation & Scroll Effects Plan

## Priority Order (biggest ROI first)

---

### 1. Lenis Smooth Scroll — Whole Site
**Where:** Global (`layout.tsx`)
**Impact:** ★★★★★
**Effort:** Low
**What:** Replaces default browser scroll with a buttery, physics-based scroll. Single biggest feel upgrade — the whole site instantly feels premium.
**Package:** `lenis`
**Example:** https://lenis.darkroom.engineering
**Status:** [ ] Not started

---

### 2. Hero Text Reveal — Mask Wipe
**Where:** `HeroSection.tsx`
**Impact:** ★★★★★
**Effort:** Medium
**What:** The main headline words slide up from behind an invisible clip mask on page load. Cinematic, editorial feel.
**Package:** Framer Motion (already installed) + `react-split-type`
**Status:** [ ] Not started

---

### 3. Grain / Film Texture Overlay — Dark Sections
**Where:** All dark sections (Hero, night bg sections, product pages)
**Impact:** ★★★★☆
**Effort:** Low
**What:** A subtle animated noise/grain texture layered on dark backgrounds. Makes it feel like a high-end magazine instead of a plain dark div. CSS-only.
**Reference:** https://css-tricks.com/animated-grain/
**Status:** [ ] Not started

---

### 4. 3D Tilt on Course Cards
**Where:** `CourseCard.tsx`
**Impact:** ★★★★☆
**Effort:** Low
**What:** Cards physically tilt toward the cursor in 3D on hover. Very premium and interactive.
**Package:** `vanilla-tilt` or `react-tilt`
**Example:** https://micku7zu.github.io/vanilla-tilt.js/
**Status:** [ ] Not started

---

### 5. Parallax Hero Background
**Where:** `HeroSection.tsx`
**Impact:** ★★★★☆
**Effort:** Low
**What:** Background image / bokeh moves at 60% scroll speed while content moves at 100%. Creates depth and dimension.
**Package:** Framer Motion `useScroll` + `useTransform` (already installed)
**Status:** [ ] Not started

---

### 6. Animated Counters — Stats
**Where:** Anywhere stats appear ("7,500+ חברים", community numbers)
**Impact:** ★★★★☆
**Effort:** Low
**What:** Numbers count up from 0 when they enter the viewport. Very effective for trust signals.
**Package:** `react-countup`
**Status:** [ ] Not started

---

### 7. Scroll Progress Bar
**Where:** Global — top of page (inside `Nav.tsx` or `layout.tsx`)
**Impact:** ★★★☆☆
**Effort:** Low
**What:** A thin gold line at the top that fills as the user scrolls down. Makes the site feel polished and alive.
**Package:** Framer Motion `useScroll` (already installed)
**Status:** [ ] Not started

---

### 8. Image Reveal Wipe
**Where:** `AboutSection.tsx` — Tal's photo
**Impact:** ★★★★☆
**Effort:** Medium
**What:** A gold-colored overlay slides away to reveal the image on scroll. Very editorial, feels intentional and designed.
**Package:** Framer Motion (already installed)
**Status:** [ ] Not started

---

### 9. Image Parallax Zoom
**Where:** `AboutSection.tsx`, course hero images
**Impact:** ★★★☆☆
**Effort:** Low
**What:** As you scroll past an image, it very slowly zooms in (scale 1.0 → 1.08). Makes images feel alive instead of static.
**Package:** Framer Motion `useScroll` + `useTransform` (already installed)
**Status:** [ ] Not started

---

### 10. Infinite Auto-Scroll Marquee — Testimonials / Media
**Where:** `MediaMentionsSection.tsx` logos, or a trust-strip component
**Impact:** ★★★☆☆
**Effort:** Low
**What:** Logos or short testimonial quotes scroll horizontally in a continuous loop. No dots, no arrows — just flowing. Great for social proof.
**Package:** Framer Motion (already installed)
**Status:** [ ] Not started

---

### 11. Staggered Blur-to-Sharp Card Entrance
**Where:** `CourseCard.tsx`, `RecommenderCard.tsx`
**Impact:** ★★★☆☆
**Effort:** Low
**What:** Cards don't just fade in — they blur-to-sharp (`filter: blur(8px) → 0`) while rising. Much richer than a plain opacity fade.
**Package:** Framer Motion (already installed)
**Status:** [ ] Not started

---

### 12. Magnetic CTA Buttons
**Where:** All gold CTA buttons (`CTAButton.tsx`)
**Impact:** ★★★★☆
**Effort:** Medium
**What:** The button slightly pulls toward the cursor when hovering nearby. Feels satisfying and premium.
**Package:** Pure JS — mouse proximity + `transform: translate(x, y)`
**Status:** [ ] Not started

---

### 13. Staggered Letter / Word Split on Hero
**Where:** `HeroSection.tsx` — tagline or sub-headline
**Impact:** ★★★☆☆
**Effort:** Medium
**What:** Words split into individual letters that fly in from different directions on load. Use sparingly — one line max.
**Package:** `react-split-type` + Framer Motion
**Status:** [ ] Not started

---

### 14. Sticky Scroll Storytelling (Apple-style)
**Where:** New "how it works" section or personal-coaching page
**Impact:** ★★★★★
**Effort:** High
**What:** A section stays pinned to the screen while the user scrolls. Content inside changes like slides advancing — "step 1 → step 2 → step 3". Best for explaining a process.
**Package:** GSAP ScrollTrigger or Framer Motion `useTransform`
**Status:** [ ] Not started

---

## Implementation Notes

- Items 1–3 affect the whole site feel and should be done first
- Items 4–7 are quick wins, each under 1 hour
- Items 8–11 are medium — need care with RTL layout
- Items 12–14 are polish — do last
- All packages except `lenis`, `react-countup`, and `react-split-type` use Framer Motion which is **already installed**
