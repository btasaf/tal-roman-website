# Tal Roman — UI/UX Wow Upgrade Plan

## Direction: Luxury Editorial × Dark Intimacy

Keep the warm-dark identity. Elevate every layer — dramatic typography, premium glass cards,
richer color story, editorial spacing. Same structure, same Sanity data, dramatically better UI.

---

## Phase 1 — Design Tokens & Globals (`globals.css`)

### Color System

```css
/* Backgrounds */
--night:      #080503;   /* deepest bg (body) */
--dusk:       #130b05;   /* dark section bg */
--ash:        #1f1208;   /* card surfaces */

/* Light sections */
--cream:      #fef6e4;   /* light section bg */
--parchment:  #f2e3c8;   /* section alternates */

/* Gold family */
--gold-bright: #f7de8a;  /* display headings */
--gold:        #e8c566;  /* accents */
--gold-muted:  #b8922a;  /* borders, dividers */

/* Brand */
--brand:      #c8573a;   /* CTA primary */
--brand-dark: #a03d24;   /* CTA hover */
--rose:       #d4847a;   /* feminine soft accent */

/* Text */
--sand:       #c9a97c;   /* muted body text on dark */
--dust:       #8a6a50;   /* very muted text */
```

### Typography Scale

| Element         | Class                                                        |
|-----------------|--------------------------------------------------------------|
| H1 hero         | `font-garamond text-7xl md:text-[8rem] font-bold tracking-tight` |
| H2 section      | `font-garamond text-4xl md:text-5xl italic`                  |
| Eyebrow label   | `uppercase tracking-[0.3em] text-xs text-gold/60 font-heebo` |
| Body            | `font-heebo text-base leading-[1.8]`                         |
| Blockquote      | `font-garamond text-2xl md:text-3xl italic`                  |
| Caption / muted | `font-heebo text-sm text-sand/70`                            |

**Rule:** Every section H2 gets an eyebrow label above it (small uppercase gold text).

---

## Phase 2 — Nav

**Current:**
- `bg-cream/95 backdrop-blur-md border-b border-gold/30` — stuck to top edge
- Clashes with dark pages

**Upgrade:**
- Floating: `fixed top-4 left-4 right-4 z-50`
- Glass: `bg-black/30 backdrop-blur-2xl border border-white/8 rounded-2xl`
- Logo: gold wordmark only — no image ring
- Links: `text-white/80 hover:text-gold` on all pages
- Mobile drawer: `bg-night/95 backdrop-blur-xl`
- Active link: gold underline, `text-gold`

---

## Phase 3 — HeroSection

**Current:**
- Cream background, oval portrait with double ring, moderate headline

**Upgrade:**
- Background: full dark `#080503` with radial warm gradient `radial-gradient(ellipse at 60% 0%, #2a1208 0%, #080503 70%)`
- Portrait: tall editorial crop, **no oval ring** — gradient fade to transparent at bottom (`mask-image: linear-gradient(to bottom, black 60%, transparent 100%)`)
- Headline: massive Garamond, `text-gold-gradient`, 2-line break with `<br>`
- Subheadline: thin Heebo, `uppercase tracking-[0.2em]`, `text-gold/60`
- Body text: `text-sand/80 text-xl leading-[1.8]`
- Shimmer accent: animated `2px` gold line under headline
- CTA button: keep brand red, add `shadow-[0_8px_32px_rgba(200,87,58,0.35)]`

---

## Phase 4 — Cards

### Unified Dark Glass Card System

Applies to: `CourseCard`, `RecommenderCard`, gift cards

**Base card:**
```
bg-ash/80 backdrop-blur-sm
border border-gold/15 rounded-3xl
hover:border-gold/35 hover:shadow-[0_0_40px_rgba(232,197,102,0.1)]
transition-all duration-300
```

### CourseCard
- Remove `📖` emoji → SVG book icon from Lucide
- Dark card bg instead of white
- Image overlay: `bg-gradient-to-t from-ash/80 to-transparent` at bottom
- Course type badge: glass pill `bg-white/10 backdrop-blur text-white text-xs`
- CTA link: gold underline style instead of red pill

### RecommenderCard
- Dark glass card
- Opening quote: large Garamond `"` in `text-gold/20 text-7xl` as decorative bg element
- Star rating: 5 gold SVG stars
- Author photo: small circle, `border border-gold/30`
- Text: Garamond italic body

---

## Phase 5 — Content Sections

### PersonalMessage
- Full-width section, cream or dark bg
- Giant decorative `"` in `font-garamond text-[10rem] text-gold/8` absolute positioned
- Message body: `font-garamond text-2xl md:text-3xl italic text-ink/80 max-w-3xl mx-auto`
- Gold right-border `border-r-4 border-gold/40 pr-8` (RTL)
- Eyebrow: `מסר אישי` in gold

### AboutSection
- Remove oval image — use tall editorial crop in a clipped rectangle with subtle gold border
- Asymmetric 2-col: portrait left, large pull quote + bio right
- Pull quote in Garamond italic, large, gold
- Bio: Heebo, generous line-height, sand color on dark bg

### FunnelSection (Gifts)
- Eyebrow: `מתנות חינמיות`
- Glass gift cards: `bg-white/5 border border-gold/15 backdrop-blur-sm rounded-2xl`
- Download/claim CTA per card in brand red
- Replace any emoji icons with Lucide SVGs

### MediaMentionsSection
- Dark horizontal strip `bg-dusk`
- Eyebrow: `סיקור תקשורתי`
- Logos: grayscale, `opacity-50 hover:opacity-100 hover:grayscale-0 transition-all duration-300`
- Subtle gold divider line above section

---

## Phase 6 — Contact & Footer

### ContactForm Section
- Keep cream bg (`bg-parchment`)
- Form card: `bg-white/70 backdrop-blur-sm border border-gold/20 rounded-3xl shadow-xl`
- Inputs: bottom-border-only style `border-b border-gold/30 bg-transparent focus:border-gold`
- Labels: small uppercase gold
- Submit button: full brand red with shimmer on hover

### Footer
- Full dark `bg-night`
- Decorative Garamond tagline in large italic `text-gold/20`
- Gold social icon links
- 3-column grid: brand/tagline | nav links | social + contact
- Thin `border-t border-gold/10` separator

---

## Phase 7 — Inner Pages

Apply same tokens, eyebrow labels, and card system to:

| Page | Key Change |
|------|------------|
| `/courses` | Grid of upgraded CourseCards, page hero with eyebrow |
| `/courses/[slug]` | Editorial layout, large image, Garamond headings throughout |
| `/articles` | Card grid → magazine-style editorial cards |
| `/articles/[slug]` | Prose styles upgraded: Garamond body, gold blockquotes |
| `/recommendations` | Full grid of RecommenderCards upgraded |
| `/about` | AboutSection as full page, timeline or stats strip |
| `/contact` | Standalone contact form, map or info sidebar |
| `/personal-coaching` | Premium landing: hero + features + CTA |

---

## What Does NOT Change

- All Sanity schemas and data — zero changes
- All routes and URL structure — zero changes  
- Heebo as primary font (Hebrew support is critical)
- Framer Motion animations (keep and improve)
- RTL layout direction
- CRM tracking hooks
- WhatsApp FAB
- Scroll progress bar
- Grain overlay

---

## Implementation Order

```
Phase 1  →  globals.css (tokens + typography)
Phase 2  →  Nav.tsx
Phase 3  →  HeroSection.tsx
Phase 4  →  CourseCard.tsx + RecommenderCard.tsx
Phase 5  →  PersonalMessage + AboutSection + FunnelSection + MediaMentions
Phase 6  →  ContactForm section + Footer.tsx
Phase 7  →  Inner pages
```

Each phase is self-contained and shippable independently.
