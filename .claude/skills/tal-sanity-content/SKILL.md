---
name: tal-sanity-content
description: How this website's Sanity content is organised and how to change it safely. Use when the user asks to change, add, fix, hide or publish any website content (texts, prices, testimonials, media items, courses, articles, gifts, presale pages, social links, follower counts, homepage sections, images) or asks "where is X in Sanity" — so they never have to open the Studio themselves.
---

# Tal Roman website — Sanity content

- Project `f2dms55f`, dataset `production`. Studio: https://tal-roman.sanity.studio/ (deploy after schema changes: `npx sanity deploy --yes`).
- Prefer the **Sanity MCP server** (`Sanity` in `.mcp.json`, OAuth with your own Sanity account) for reading/writing content. Fallback: scripts using `SANITY_WRITE_TOKEN` from `.env.local` (never print or commit tokens; never use a `NEXT_PUBLIC_` name for a write token).
- Schemas: `src/sanity/schemas/*.ts`; queries: `src/lib/queries.ts`; types: `src/lib/types.ts`. A new field needs all three, plus a Studio deploy.
- Content changes reach the live site through the Sanity webhook (cache tags) — no code deploy needed.

## Where things live
| What | Document type / id | Notes |
|---|---|---|
| Homepage texts (hero, about, media, contact…) | `homepageSection` (singleton, id `homepageSection`) | Tabs/groups: hero, personalMessage, gifts, about, featuredPromo, courses, media (incl. `mediaBackgroundVideo` Vimeo URL), testimonials, contact, order |
| Phone, WhatsApp, social links, follower counts, years, SEO, CRM tag | `siteSettings` (singleton, id `siteSettings`) | Tabs: פרטי קשר, רשתות חברתיות (instagram/facebook/tiktok/youtube URLs, communityMembers, facebookFollowers, instagramFollowers, tiktokFollowers), מספרים (yearsExperience), SEO, CRM. Empty Instagram/TikTok follower count = hidden on the site |
| Testimonials | `testimonial` | `active` (false = hidden), `featured`, `sort`, `courseTitle` — the coaching page shows only `courseTitle` "ליווי אישי"/"ייעוץ אישי"; course pages match by course name |
| Press / media items | `mediaMention` | `active`, `order`, `mediaType` (video/article/podcast), `externalUrl`, `thumbnail` |
| Courses | `course` | prices, dates, CTA links, FAQ, `active` |
| Articles | `blogPost` | Word-file body or Portable Text |
| Free-gift landing pages (`/gifts/<slug>`) | `freeGift` | |
| Quiz gift results | `gift` | |
| Presale pages (`/presale/<slug>`) | `presalePage` | copy for the "what women want" presale is addressed to men on purpose |
| Uploaded HTML pages (`/p/<slug>`) | `htmlPage` | |
| Shared images | `imageLibrary` (singleton) | |

## Safe-editing rules
1. Read the current document first (including any `drafts.<id>` version). If a draft exists, the Studio shows the draft — edit/publish the draft or ask, never silently overwrite it.
2. Dry-run mutations first (`?dryRun=true` / preview), then apply, then read back to verify.
3. To hide something, set `active: false` rather than deleting.
4. Keep Hebrew RTL punctuation correct (text is stored in logical order) and gender-inclusive wording unless the page targets one gender on purpose.
5. Tell the user exactly what changed (document, field, before → after).
