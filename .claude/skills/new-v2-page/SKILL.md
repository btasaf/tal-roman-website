---
name: new-v2-page
description: Step-by-step recipe for adding a new page, landing page, presale, course or campaign page to this site in the v2 style — file layout, metadata/SEO, Sanity data, CRM forms with consent, tracking, accessibility and the final checks. Use whenever the user asks for a new page or a full rebuild of one.
---

# New v2 page — recipe

## 0. Before building
- Load `tal-design-system` (look & motion) and, for content in Sanity, `tal-sanity-content`. For copy, `hebrew-copy`.
- Read the closest existing v2 page as a reference (e.g. `/v2/courses/[slug]` for sales pages, `/v2/articles/[slug]` for reading, `/v2/contact` for forms, `/v2/presale/[slug]` for focus-mode sales).
- If the page replaces an old one: read the old page only for content, data, links, forms and tracking — keep all of them identical.

## 1. Files
- Route: `src/app/v2/<route>/page.tsx` (server component: fetch data, metadata, JSON-LD).
- Components: `src/components/v2/<area>/` (client components with `'use client'` only where needed).
- Don't edit shared files (HeaderV2, FooterV2, layouts, globals.css, motion-kit, backgrounds) unless the task is about them.
- Unknown slugs → `notFound()`; dynamic routes with `generateStaticParams` + `dynamicParams = false` like the existing ones.

## 2. Metadata & SEO
```ts
export const metadata: Metadata = {
  title: { absolute: '<title> — טל רומן' },        // absolute: avoids a doubled "| טל רומן"
  description: '…',
  alternates: { canonical: 'https://www.talroman.com/<live-route>' },
  robots: { index: false, follow: true },          // while v2 is on staging (see v2-launch-checklist)
}
```
- One `<h1>`. Open Graph image where there's a real one.
- JSON-LD helpers in `src/components/JsonLd.tsx` (`BreadcrumbJsonLd`, `FaqJsonLd`, …); Course/Offer/Article only with real data. Load `seo-aeo-best-practices` for anything beyond basics.

## 3. Data
- Sanity via `src/lib/queries.ts` (add a query + type in `src/lib/types.ts`; new fields also need the schema in `src/sanity/schemas/` and `npx sanity deploy --yes`).
- Numbers/social links: `siteStats(settings)` / `socialUrls(settings)`.

## 4. Forms → CRM
- Post to `/api/crm/save-customer` exactly like the existing v2 forms (`contact-page/form-ui.tsx`, `ContactPageForm.tsx`, `gifts-page/GiftSignup.tsx`): name, mail, phone?, tag, status, freeText?, `emailConsent` (true/false), `visitorId`; quiz adds `consentSource`/`consentText`.
- Marketing consent checkbox: **optional, unticked by default**; the requested thing (gift, details) is never conditional on it.
- Under every submit button: lock icon + "פרטיך נשמרים בדיסקרטיות · מדיניות פרטיות" → `/v2/privacy`.
- Never send real test submissions: stub `/api/crm/**` in Playwright.

## 5. Tracking
- `track(eventType, data)` from `useCrmTracking()`; or declarative `data-track="name"` + `data-track-*` attributes (handled by `V2Tracking.tsx`), `data-track-form="<form>"` on forms for `form_start`.
- **Never rename or remove existing event names/payloads** (the CRM depends on them); add new events freely. Full list: talCRM `claudeDocs/WEBSITE_TRACKING_EVENTS.md`.

## 6. Accessibility & UX
- Keyboard reachable, visible focus rings, labels on inputs and icon buttons, `aria` on dialogs (focus trap, Esc), alt text.
- `data-hide-dock` on CTA/form wrappers; the per-page `<style>` overrides (see design system).
- Respect reduced motion via `useHydratedReducedMotion`.

## 7. Finish
- `npx tsc --noEmit -p .` and `npx eslint <files>` clean; curl the route → 200 (unknown slug → 404).
- Launch the `visual-qa` agent **in the background** for the new page; keep working meanwhile.
- Report: files, structure, new microcopy (so the owner can review it), decisions needed. Don't commit unless asked.
