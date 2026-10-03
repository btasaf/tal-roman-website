---
description: צוות: בונת דפים — בונה/משפצת דף או סקשן בסגנון v2 (ברקע)
argument-hint: "[what to do, e.g. which page / what changed]"
---

Launch the **page-builder** agent from `.claude/agents/page-builder.md` (Builds or rebuilds a page, landing page or section in the v2 style.)

1. Use the Agent tool with `subagent_type: "page-builder"` and `run_in_background: true`.
2. Write a complete brief following the `agent-orchestration` skill (agents start with no context): goal, files it owns, what must stay identical, what not to touch (check the status log for agents already running and their files), how to verify, report format. The user's request: $ARGUMENTS
   - If the request is empty or unclear, ask one short question first.
3. Add a line to the status log `.claude/status/agents.md` (create it if missing) under **Running**: time, agent, one-line task.
4. Tell the user in one line that it's running, then keep working with them. When it finishes, move it to **Finished** with a one-line result (and anything waiting for the user to **Waiting for you**), report the result briefly, and suggest the natural next agent (see the suggestions table in `agent-orchestration`).
