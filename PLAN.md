# Plan: Homepage Sections + UI Improvements

## Scope
1. Sanity Studio – section-based navigation + ordering
2. Hero section – bigger image, transparent bg, scroll-to-gifts CTA
3. About section – egg-shaped image
4. Courses section – white title
5. Media section – scroll animation (CodePen-style), "see all" button
6. Media page – rich card display with logos + images
7. Contact section – proper form (name, email, phone optional, message optional)

---

## Phase 1 – Sanity: Section Navigation & Ordering

### 1.1 Field Groups in `homepageSection`
Add `groups` array to the schema so the Studio renders each section as a named tab:
- `hero` → Hero
- `personalMessage` → הודעה אישית
- `gifts` → מתנות
- `about` → אודות
- `featuredPromo` → פרומו
- `courses` → קורסים
- `media` → בתקשורת
- `testimonials` → המלצות
- `contact` → צור קשר

Each existing field gets a `group` property matching its section.

### 1.2 Section Order Field
Add `sectionOrder` field — array of strings (section keys).  
Users drag rows to reorder; homepage renders sections in this order.  
Default order: hero → personalMessage → gifts → about → featuredPromo → courses → media → testimonials → contact

### 1.3 Sanity Studio Structure
In `sanity.config.ts`, replace the flat "דף הבית" entry with a sub-list showing each section as a clickable item (all pointing to the same `homepageSection` document). Users click a section name to jump directly to its tab.

---

## Phase 2 – Hero Section

### 2.1 Bigger Portrait
- Container: `w-[340px] h-[420px]` on desktop (portrait orientation, taller than wide)
- Image: `object-cover object-top`
- Rounded stays as full for now (egg shape is only for About)

### 2.2 Transparent Background
- Remove `bg-[#0d0804]` from the `<section>`; page body is already `#0d0804`
- Keep bokeh blobs (they still layer nicely over the page bg)

### 2.3 Button Changes
- **Remove**: the "הקורסים שלי" `/courses` button
- **Keep**: one CTA button that **scrolls** to the gifts section (`#gifts`) using `window.scrollTo` / anchor `href="#gifts"`
- Button text comes from Sanity `heroCtaText` (default: "לקבלת מתנות חינמיות")

---

## Phase 3 – About Section: Egg Shape

Replace `rounded-full` on the image container with an inline CSS egg shape:
```css
border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
```
Also remove the circular gold ring `div` and replace with an egg-shaped one using the same border-radius.

---

## Phase 4 – Courses Section: White Title

In `src/app/page.tsx`, change the courses headline from `text-[#303030]` → `text-white`.  
The section background is `bg-[#e6c060]/25` (gold tint) — white reads clearly there.

---

## Phase 5 – Media Section: Scroll Animation

### 5.1 Animation Style
Implement a **horizontal scroll-driven card stack** effect inspired by the CodePen:
- Cards are arranged in a horizontal scroll container with `overflow-x: auto` hidden
- As the section scrolls into view (using Framer Motion `useScroll` + `useTransform`), cards fan in from a stacked position
- Each card gets a slight rotateY and translateX offset that resolves to 0 as it "arrives"
- Cards are always pointer-events-enabled (no disabling clickability)

### 5.2 Card Limit + "See All" Button
- Show maximum 6 media cards on homepage
- If `mentions.length > 6`: render a "לכל הכתבות" button linking to `/media`

### 5.3 Card Layout
Each card (same as current but with the animation wrapper):
- Thumbnail image top
- Source badge overlay
- Title + excerpt
- CTA text (read/watch/listen)

---

## Phase 6 – Media Page: Rich Display

Replace the current list-style layout with a proper card grid:
- Full-width image thumbnail (aspect 16/9)
- Source **logo image** overlaid bottom-right (from `mediaMention.logo` field in Sanity — already exists in schema)
- Title, excerpt, publication date
- Media type badge (article / video / podcast / interview)
- Hover: lift shadow + border highlight

Layout: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — same as homepage media section.  
Group by source above the grid (section headers), or show all in one flat grid sorted by order.

Also: ensure `mediaMention` schema has `order` / `weight` field (already exists) — confirm it's exposed clearly in the Studio.

---

## Phase 7 – Contact Section: Form

Replace the current "תשאירו לי פרטים ואחזור אליכם" + WhatsApp CTA with:

### Fields
| Field | Type | Required |
|-------|------|----------|
| שם מלא | text input | ✓ |
| כתובת מייל | email input | ✓ |
| טלפון | tel input | optional |
| הודעה | textarea | optional |

### Behavior
- Client-side validation (required fields)
- On submit: show success message ("תודה! אחזור אליך בקרוב")
- No server call yet — form will be wired later
- New component: `src/components/ContactForm.tsx`

### Style
- Dark background `bg-[#1a0f08]` or cream `bg-[#fff2d4]`
- RTL inputs (text-right, dir="rtl")
- Gold border focus ring
- Red submit button matching site style

---

## Files to Change

| File | What Changes |
|------|-------------|
| `src/sanity/schemas/homepageSection.ts` | Add field groups + `sectionOrder` field |
| `sanity.config.ts` | Sub-list structure for each section under Homepage |
| `src/components/HeroSection.tsx` | Larger image, transparent bg, scroll CTA |
| `src/components/AboutSection.tsx` | Egg-shaped image |
| `src/app/page.tsx` | White courses title, pass `id="gifts"` to FreeGiftsSection, cap media at 6 |
| `src/components/FreeGiftsSection.tsx` | Accept + apply `id="gifts"` anchor |
| `src/components/MediaMentionsSection.tsx` | Scroll animation, card limit, "see all" button |
| `src/app/media/page.tsx` | Rich card grid with logos + images |
| `src/components/ContactForm.tsx` | **New** – contact form component |

---

## Order of Implementation
1. Sanity schema (groups + order) — no visual change, just studio
2. Sanity structure config
3. Hero changes
4. About egg shape
5. Courses title color
6. FreeGiftsSection id anchor
7. Media homepage animation + limit
8. Media page rich display
9. ContactForm component + wire into page.tsx
