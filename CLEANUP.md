# Codebase Cleanup Plan

> Status: **Pending Approval**
> Scope: DRY, clean, simple — no behavior changes, no new dependencies.

---

## Group 1 — Design Tokens

### 1. CSS Color Theme Variables
**Files affected:** Every component (~200+ occurrences)

All hex colors are hardcoded as Tailwind arbitrary values everywhere:
`text-[#e6c060]`, `bg-[#cd2c2c]`, `text-[#303030]`, etc.

**Fix:** Define once in `globals.css` as Tailwind 4 `@theme` variables, then use semantic class names everywhere.

| Variable | Value | Usage |
|---|---|---|
| `--color-gold` | `#e6c060` | Accents, dividers, borders |
| `--color-red` | `#cd2c2c` | CTA buttons, highlights |
| `--color-dark` | `#0d0804` | Dark section backgrounds |
| `--color-dark-mid` | `#1a0f08` | Mid-dark backgrounds |
| `--color-cream` | `#fff2d4` | Light section backgrounds |
| `--color-text-dark` | `#303030` | Primary text |
| `--color-text-mid` | `#4f4f4f` | Secondary text |
| `--color-text-light` | `#d4b896` | Muted text |
| `--color-brown` | `#b07830` | Decorative elements |

**Before:** `text-[#e6c060] border-[#e6c060]/15 hover:bg-[#a82424]`
**After:** `text-gold border-gold/15 hover:bg-red-dark`

- [ ] **Approved**

---

## Group 2 — Shared Constants

### 2. `/src/lib/constants.ts` (new file)
**Files affected:** `MediaMentionsSection.tsx`, `MediaScrollReveal.tsx`, `media/page.tsx`, `CourseCard.tsx`, `Nav.tsx`, `Footer.tsx`

Several lookup objects and arrays are copy-pasted across 2–3 files each.

| Constant | Currently duplicated in |
|---|---|
| `sourceLabel` (media outlet names) | `MediaMentionsSection`, `MediaScrollReveal`, `media/page` |
| `mediaTypeLabel` (article/video/etc.) | `MediaMentionsSection`, `MediaScrollReveal`, `media/page` |
| `courseTypeLabels` (digital/workshop/etc.) | `CourseCard` only — but belongs here |
| `NAV_LINKS` | `Nav.tsx` (array), `Footer.tsx` (hardcoded separately) |

**Fix:** Define all of these once in `/src/lib/constants.ts`, import everywhere.

- [ ] **Approved**

---

## Group 3 — Shared Types

### 3. `/src/lib/types.ts` (new file)
**Files affected:** `MediaMentionsSection.tsx`, `MediaScrollReveal.tsx`, `page.tsx`, `courses/page.tsx`, `articles/page.tsx`, `media/page.tsx`

Interfaces are either duplicated across files or typed as `any`.

| Type | Problem |
|---|---|
| `MediaMention` | Identical interface defined in both `MediaMentionsSection` and `MediaScrollReveal` |
| `Course` | Typed as `any` in `page.tsx` and `courses/page.tsx` |
| `BlogPost` | Typed as `any` in `articles/page.tsx` |
| `Testimonial` | Defined inline in `TestimonialsSection`, not shared |
| `GalleryItem` | Defined inline in `ScrollGallery`, not shared |

**Fix:** Single `/src/lib/types.ts`, imported by all components and pages that need them. Eliminates all `(item: any)`, `(course: any)`, `(post: any)`.

- [ ] **Approved**

---

## Group 4 — Shared Utilities

### 4. Utility functions in `/src/lib/utils.ts`
**Files affected:** `Nav.tsx`, `Footer.tsx`, `about/page.tsx`, `contact/page.tsx`, `queries.ts`

Two small utilities are copy-pasted across multiple files:

**`cleanWhatsApp(phone)`**
`phone?.replace(/\D/g, '')` is repeated verbatim in 4 files.

**`queryOptions()`**
`{ next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } }` is repeated in all 8 functions in `queries.ts`.

**Fix:** Add both as named exports in `/src/lib/utils.ts` (file likely already exists — add to it or create).

- [ ] **Approved**

### 5. `/src/lib/image-utils.ts` (new file)
**Files affected:** ~12 components and pages

`urlFor(image).width(X).height(Y).url()` appears 20+ times with different hardcoded dimensions scattered everywhere.

**Fix:** Named size presets with a single `getImageUrl(image, preset)` helper.

```
thumb  → 300×300   (cards, avatars)
card   → 400×300   (course/article cards)
hero   → 600×700   (gallery, hero)
banner → 1200×600  (article detail)
```

**Before:** `urlFor(post.thumbnail).width(1200).height(600).url()`
**After:** `getImageUrl(post.thumbnail, 'banner')`

- [ ] **Approved**

---

## Group 5 — Shared Components

### 6. `<BokehBackground />`
**Files affected:** `HeroSection.tsx`, `AboutSection.tsx`, `PersonalMessage.tsx`, `TestimonialsSection.tsx`, `page.tsx`

This exact block is copy-pasted into 5 sections:
```jsx
<div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#e6c060]/10 rounded-full blur-3xl" />
  <div className="absolute bottom-[10%] right-[15%] w-80 h-80 bg-[#cd2c2c]/15 rounded-full blur-3xl" />
</div>
```

**Fix:** `<BokehBackground />` component in `/src/components/ui/`. Optional `variant` prop for light/dark versions.

- [ ] **Approved**

### 7. `<SectionDivider />`
**Files affected:** 8+ sections

```jsx
<div className="w-16 h-1 bg-[#e6c060] mx-auto rounded-full" />
```

Verbatim copy in every section that has a decorative underline.

**Fix:** Tiny one-liner component. Zero props needed.

- [ ] **Approved**

### 8. `<CTAButton />`
**Files affected:** 10+ components

The red CTA button style is hardcoded everywhere:
```
bg-[#cd2c2c] text-white px-5 py-4 rounded-full hover:bg-[#a82424] transition-colors
```

**Fix:** `<CTAButton href? onClick? className?>` in `/src/components/ui/`. Renders as `<a>` or `<button>` depending on which prop is passed.

- [ ] **Approved**

---

## Group 6 — Animation Presets

### 9. `/src/lib/animations.ts` (new file)
**Files affected:** `FreeGiftsSection.tsx`, `PersonalMessage.tsx`, `HeroSection.tsx`, and 7+ more

The same Framer Motion config object is spread-pasted 10+ times:
```typescript
initial={{ opacity: 0, y: 20 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.5 }}
```

**Fix:** Named preset objects that can be spread directly onto `<motion.*>` elements.

```typescript
export const fadeInUp = { initial: ..., whileInView: ..., viewport: ..., transition: ... }
export const fadeInDown = { ... }
export const fadeIn = { ... }
```

**Before:** `<motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>`
**After:** `<motion.div {...fadeInUp}>`

- [ ] **Approved**

---

## Group 7 — Schema / Config Sync

### 10. Section Keys — Single Source of Truth
**Files affected:** `src/sanity/schemas/homepageSection.ts`, `sanity.config.ts`

`SECTION_KEYS` (the list of homepage section IDs) is hardcoded in both files independently. Adding or renaming a section requires updating two places.

**Fix:** Export from `homepageSection.ts`, import into `sanity.config.ts`.

- [ ] **Approved**

---

## Group 8 — Queries Cleanup

### 11. Revalidation helper in `queries.ts`
**Files affected:** `src/lib/queries.ts` (8 functions)

```typescript
{ next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } }
```

This exact object is the third argument of every `client.fetch()` call in the file.

**Fix:** One constant at the top of the file:
```typescript
const revalidateOpts = { next: { revalidate: process.env.NODE_ENV === 'production' ? 60 : 0 } }
```

Used in all 8 calls below it.

- [ ] **Approved**

---

## Summary

| # | What | New files | Files changed | Effort |
|---|---|---|---|---|
| 1 | Color tokens → CSS theme variables | — | `globals.css` + all components | Medium |
| 2 | Shared constants | `src/lib/constants.ts` | 6 files | Low |
| 3 | Shared types | `src/lib/types.ts` | 6 files | Low |
| 4 | Utility functions | `src/lib/utils.ts` | 5 files | Low |
| 5 | Image URL presets | `src/lib/image-utils.ts` | ~12 files | Low |
| 6 | `<BokehBackground />` | `src/components/ui/BokehBackground.tsx` | 5 files | Low |
| 7 | `<SectionDivider />` | `src/components/ui/SectionDivider.tsx` | 8 files | Low |
| 8 | `<CTAButton />` | `src/components/ui/CTAButton.tsx` | 10 files | Low |
| 9 | Animation presets | `src/lib/animations.ts` | ~10 files | Low |
| 10 | Section keys sync | — | 2 files | Trivial |
| 11 | Queries revalidation helper | — | `queries.ts` | Trivial |

**No behavior changes. No new dependencies. Build stays green.**

---

## Out of Scope (not recommending now)

- Merging `MediaMentionsSection` + `MediaScrollReveal` — risky, complex interaction code
- Splitting `useCrmTracking` — functional as-is, just large
- Error boundaries — no current error UX issues
- Component JSDoc — low value at this stage
