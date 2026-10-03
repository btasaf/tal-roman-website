---
name: v2-launch-checklist
description: Pending launch checklist for the v2 redesign of talroman.com. Use whenever the user asks to deploy, publish, launch, go live, push to production, or "deploy whatever we need today" for this website or the talCRM — before doing anything else, read this list and fold every open item into that deploy. Temporary: delete this skill once v2 is live.
---

# v2 launch checklist (temporary)

The v2 redesign lives under `/v2/*` on branch `test/motion`. Tal must give the OK before launch.
When the user asks for **any** deploy, bring this list up and confirm which items to include today.
Never deploy without the user's explicit go-ahead for that deploy.

## The list (order matters)

1. **CRM first, then the website.**
   - Deploy talCRM (`C:\projects\talCRM`) with the marketing-consent changes (new `marketingConsent*` customer fields, `isTransactional` on email sequences, `utils/marketingConsent.js`, `claudeDocs/WEBSITE_TRACKING_EVENTS.md`). Production adds the columns on startup (`sequelize.sync({alter:true})`) or run `node migrations/add-marketing-consent.js`.
   - In the CRM UI, tick **"רצף שירות"** on the 10 `מייל מתנה- …` gift sequences (and course-access sequences whose every email delivers what was asked for).
   - Only then deploy the website. If the website goes first, quiz leads who don't tick consent won't get the gift email.
2. **Move v2 to the real addresses**, with 301 redirects so every current URL keeps working (keep slugs identical).
   - Remove the `/v2` prefix everywhere: links in `src/components/v2/**` and `src/app/v2/**`, `V2_TARGETS` in `src/components/v2/gift/gift-copy.ts`, `toV2()` in `src/components/v2/articles/article-content.ts`, `/v2/...` hrefs in HeaderV2/FooterV2/V2Chrome, tracking path stripping in `PageViewTracker.tsx` / `V2Tracking.tsx` (keep event names unchanged).
   - The old quiz (`/quiz`) still forces the consent box — it must be replaced by the v2 quiz.
3. **Let Google index the site**: remove `robots: { index: false }` from every v2 page (keep it on the 404), check canonicals point to the live URLs, update `src/app/sitemap.ts` and `robots.ts` (no `/v2` URLs), check titles/descriptions/OG images, validate structured data.
4. **Remove the old pages and leftovers**: old page routes and components, the old Footer + `SiteFooterGate`, the per-page style overrides (`main.pt-20 { padding-top: 0 }`, hiding `.fixed.bottom-6.left-6`), then clean up Sanity fields only the old site used and redeploy the Studio (`npx sanity deploy --yes`).
5. **Test on a real iPhone and Android** (Safari address bar/sticky sections, Vimeo background, forms, quiz → gift flow) after the deploy.

## Also open before launch (check status with the user)
- Legal pages: fill the gold `ToFill` placeholders (business details, coordinator, retention periods…), ideally lawyer-reviewed.
- Content: replacement images for the two explicit media thumbnails and the presale device image; correct Spotify link for "אנאלי – סקסאפיל"; Two-for-tantra 14 vs 18 chapters.
- Decisions: quiz line "אשמח לשמור איתך על קשר…" (contradicts optional consent); bulk WhatsApp in the CRM ignores consent.

## When everything above is done
Delete this skill folder (`.claude/skills/v2-launch-checklist/`), commit the deletion, and remove the matching memory entry ("v2-launch-pending") from the project memory.
