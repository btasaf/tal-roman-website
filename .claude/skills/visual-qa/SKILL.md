---
name: visual-qa
description: Responsive/visual QA for this site — screenshots at phone/tablet/laptop/desktop, horizontal overflow, covered or cut-off content, tap targets, console and hydration errors, forms tested with the CRM stubbed. Use after any visual change, new page or section, or when the user asks to check, test or "make sure it's responsive". ALWAYS run it in the background (the `visual-qa` agent or /subtask), never inline in the main conversation — it is slow.
---

# Visual QA

## Rule #1 — always in the background
QA takes a long time. **Never run it inline.** Launch the `visual-qa` agent (Agent tool, `subagent_type: "visual-qa"`, `run_in_background: true`) or tell the user to use `/subtask`, then keep working on other things. Give the agent: the pages/routes to check, what changed, and anything it must not touch.

## What the agent does (Playwright via node — no Python on this machine)
- Temp script under `scripts/_qa-*.ts`, run with `npx tsx`, deleted afterwards. Screenshots to `.screenshots/` (gitignored), viewed with the Read tool, deleted afterwards.
- Dev server `http://localhost:3000` is shared and can be slow: one browser at a time, `waitUntil: 'load'` with long timeouts (90–180s), retry if a hot reload aborts navigation. Never start a second dev server.
- Sizes: 390×844, 820×1180, 1280×720, 1440×900 (full pass adds 360×740, 430×932, 768×1024, 1024×768, 1920×1080 and 844×390 landscape).
- Scroll each page in ~10–12 steps (pinned/scroll-driven sections change mid-scroll) and check at each step:
  - horizontal overflow (`scrollWidth > clientWidth`) and the offending element;
  - content under the fixed menu button / docked buttons / bottom bars, overlapping or cut-off text;
  - tap targets ≥ 40px on phones, inputs ≥ 16px, labels ≥ 12px;
  - seams/1px lines between sections, blank screens, jumps;
  - console errors, page errors, hydration warnings (ignore the known dev-only "container has a non-static position" warning and the 404 page's dev-only "negative time stamp").
- Reduced motion: one pass with `reducedMotion: 'reduce'`.
- Forms/CRM: **never hit the real CRM** — `page.route('**/api/crm/**', r => r.fulfill(...))`; to see tracking set `localStorage.crm_track_debug = '1'`.
- Fix only clear, minimal issues consistent with the design (see `tal-design-system`); list anything needing a design decision. Re-read files before editing (other agents may be editing). `npx tsc --noEmit -p .` + eslint clean. Don't commit.

## Report format
Table: page × size → issue → fixed/left, then decisions needed, then "checks run" (sizes, pages, console clean, tsc/eslint).
