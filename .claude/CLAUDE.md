# Project notes for Claude

- Two people work on this repo with Claude Code: **Asaf** and **Tal** (Tal Roman, the site owner). At the start of a conversation, if your memory doesn't say who the user is, use the `tal-welcome` skill to ask (once) and remember the answer.
- The v2 redesign lives under `/v2/*` (branch `test/motion`). Before any deploy, use the `v2-launch-checklist` skill.
- Building UI: `tal-design-system` (look & motion), `new-v2-page` (recipe), `hebrew-copy` (text). Content lives in Sanity — use `tal-sanity-content` for any content change.
- **Visual QA always runs in the background** (the `visual-qa` agent or `/subtask`), never inline — it is slow.
- Big or parallel work: follow `agent-orchestration` and use the ready-made agents in `.claude/agents/` (page-builder, visual-qa, tracking-auditor, content-editor, legal-reviewer, copy-writer). The user can launch them with `/subtask-<role>`; `/subtask-team` lists them, `/subtask-status` shows the log.
- **Proactively suggest the right team member** after relevant moments (e.g. after building UI → suggest `/subtask-visual-qa`; after touching forms/tracking → `/subtask-tracking-auditor`) — see the table in `agent-orchestration`. Keep the status log `.claude/status/agents.md` updated.
- A SessionStart hook checks the project's MCP servers; if it reports problems, start by telling the user what's not working, why it matters and how to fix it (`mcp-health` skill).
- Tracking: never rename or remove existing CRM event names or payloads; adding new events is fine.
- Ask before committing or pushing. Never deploy, or write to production Sanity/CRM data, without explicit approval.
