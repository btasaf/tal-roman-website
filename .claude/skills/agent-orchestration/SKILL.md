---
name: agent-orchestration
description: How to run several background agents on this repo in synergy without them colliding — when to delegate, the ready-made agent roles in .claude/agents, pacing, file ownership, the shared dev server, briefing and report formats, and the build → QA → summary order. Use whenever a task is big, has independent parts, or the user asks for subagents, /subtask, "in parallel", "deploy agents", or a status of running work.
---

# Running agents in synergy

## When to delegate
- Big or slow tasks (new page, full-site check, audit, research) → background agent. Small, quick fixes → do them directly.
- Independent parts → parallel agents. Dependent steps → one after another (or one agent with a plan).
- Visual QA is **always** a background agent (`visual-qa`), never inline.
- For very large jobs the user can opt into a Workflow ("use a workflow" / "ultracode"); otherwise use the Agent tool / `/subtask`.

## Ready-made roles (`.claude/agents/`)
| Agent | Use for |
|---|---|
| `page-builder` | building/rebuilding a page or section in v2 style |
| `visual-qa` | responsive/visual QA (always background) |
| `tracking-auditor` | checking tracking events + CRM payloads, adding new events |
| `content-editor` | Sanity content changes (safe workflow) |
| `legal-reviewer` | privacy/accessibility/terms pages, consent wording (Israeli law) |
| `copy-writer` | Hebrew microcopy and page copy |
Launch with the Agent tool, `subagent_type: "<name>"`, `run_in_background: true`.

## Pacing & collisions
- **2–3 agents at a time**; launch the next when one finishes. More than that slows the shared dev server and causes flaky tests.
- **File ownership:** give each agent its own folder/files. Shared files (HeaderV2, FooterV2, layouts, globals.css, motion-kit, backgrounds, MediaSection…) are off-limits unless that is the task; if an agent must touch a shared file, it re-reads it right before editing and keeps edits minimal.
- **Dev server:** one shared `localhost:3000` — agents never start a second one, use one browser at a time, long timeouts, retry on hot-reload aborts. If it gets slow (memory grows over hours), suggest a restart between waves.
- **Never** let agents commit, push, deploy, run production migrations, or write to Sanity/CRM production data without the user's explicit approval in this conversation.

## Briefing an agent (keep it complete — agents start with no context)
1. Role + goal in one line, and the repo path.
2. Skills to load first (e.g. `tal-design-system`, `new-v2-page`, `motion`).
3. What to keep identical (content, links, CRM payloads, event names).
4. What not to touch (other agents' files, shared files).
5. How to verify (tsc, eslint, curl, Playwright with CRM stubbed; QA in background).
6. Report format (below).

## Report format (ask every agent for this)
- What changed (files) · what was checked and how · decisions needed from the owner · anything left undone. Short — the owner reads it, not the transcript.

## Order of work
build → `visual-qa` in background → fix → short summary to the user. Nothing is reported "done" before it's verified.

## Proactively suggest the right agent
Don't wait to be asked — after these moments, suggest (one line, with the command) the agent that fits. Suggest, don't launch, unless the user already said to.
| Moment | Suggest |
|---|---|
| Built or restyled a page/section, changed layout or animation | `/subtask-visual-qa` on the changed pages |
| Touched forms, buttons/CTAs, links, quiz, tracking code | `/subtask-tracking-auditor` |
| Added a form, a new data field, analytics/cookies, or changed legal/consent text | `/subtask-legal-reviewer` |
| New page or section that needs text, or copy feels off | `/subtask-copy-writer` |
| User wants to change texts/prices/testimonials/links in Sanity | `/subtask-content-editor` |
| User asks for a new page / landing / presale | `/subtask-page-builder` (then visual-qa after) |
| Before any deploy | `v2-launch-checklist` (while open) + `/subtask-tracking-auditor` + `/subtask-visual-qa` |
| Several independent tasks pending | run them as parallel agents (2–3 at a time) |

## Status log
Keep `.claude/status/agents.md` (gitignored, per machine) up to date with three sections — **Running** (time, agent, task, files it owns), **Finished** (time, agent, one-line result; keep the last ~10), **Waiting for you** (decisions/content the user owes). Update it when launching an agent, when one finishes, and when the user answers a pending item. When the user asks "status" (or `/subtask-status`), answer from it, grouped exactly so. Team commands: `/subtask-team` lists all roles.
