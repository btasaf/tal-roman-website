# Project notes for Claude

- Two people work on this repo with Claude Code: **Asaf** and **Tal** (Tal Roman, the site owner). At the start of a conversation, if your memory doesn't say who the user is, use the `tal-welcome` skill to ask (once) and remember the answer.
- The v2 redesign lives under `/v2/*` (branch `test/motion`). Before any deploy, use the `v2-launch-checklist` skill.
- Content lives in Sanity — use the `tal-sanity-content` skill for any content change.
- Tracking: never rename or remove existing CRM event names or payloads; adding new events is fine.
- Ask before committing or pushing.
