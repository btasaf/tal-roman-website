---
name: mcp-health
description: What each MCP server in this project is for and how to fix it when it isn't connected (motion, motion-plus, Sanity, chrome-devtools, agentation, talcrm). Use when the session-start MCP check reports a problem, when an MCP tool is missing or failing, or when the user asks about MCP / "למה X לא עובד".
---

# MCP servers in this project

Explain briefly and kindly (Hebrew for Tal). For each broken server: what it's for → why it matters → the exact fix. "⏸ Pending approval" and "! Needs authentication" are normal the first time — not errors.

Check status any time: `claude mcp list` (the user can type `! claude mcp list` in the prompt). Manage interactively with `/mcp`. Changes to MCP config need a Claude Code restart.

| Server | What it's for | If it's not working |
|---|---|---|
| **Sanity** (`https://mcp.sanity.io`) | Edit and publish website content (texts, prices, testimonials…) without opening the Studio | **Pending approval** → restart Claude Code in this folder and approve the project's MCP servers (or `/mcp`). **Needs authentication** → `/mcp` → Sanity → Authenticate; a browser opens to log in with your own Sanity account. **No access** → ask Asaf to invite you at sanity.io/manage → project `f2dms55f` → Members (role Editor). Fallback until fixed: scripts with `SANITY_WRITE_TOKEN` in `.env.local`. |
| **agentation** (`npx -y agentation-mcp server`) | Reads the notes you leave on the dev site with the toolbar — needed for `/listen` and `/listen loop` | Needs Node.js/npx installed and internet for the first download. Approve it if pending. The toolbar only appears with `npm run dev` (development mode). If it says failed: restart Claude Code; check `npx -y agentation-mcp server` runs in a terminal. |
| **motion** (`https://mcp.motion.dev`) | Motion (animation) docs, examples, springs and performance audits | Approve if pending. If "Failed to connect" with an `npx … motion-ai` command, an old **local** setting is overriding the project one: `claude mcp remove motion -s local`, then restart. |
| **motion-plus** (`https://mcp.motion.dev/plus`) | Motion+ premium components/examples | **Needs authentication** → `/mcp` → motion-plus → Authenticate (needs a Motion+ account; ask Asaf). Optional — everything else works without it. |
| **chrome-devtools** (`npx -y chrome-devtools-mcp@latest`) | Lets Claude open a real Chrome to see console errors, network and performance (e.g. "why does this page stutter?") | Needs Google Chrome installed and Node.js/npx. Approve if pending. If it fails, restart Claude Code; it's optional — QA also works with Playwright. |
| **talcrm** (`node .claude/mcp/talcrm-mcp.mjs`, local file, no dependencies) | Read-only look at Tal's CRM: is it up (local/production), is `CRM_BASE_URL` right, email system status, which tag triggers which email sequence, which tracking events arrived, and the form→CRM field contract. No customer data, no sending. | Needs only Node.js. Approve if pending. If tools say "DOWN: ECONNREFUSED" for local, the CRM isn't running locally (`npm --prefix C:/projects/talCRM run server`), which is fine unless you're testing forms. If production is down or a tool returns 401, tell Asaf. Details: the `crm-connections` skill. |

**[CRM check] lines at session start** come from the same hook. They warn when `CRM_BASE_URL` in `.env.local` doesn't end with `/api`, or when the production CRM doesn't respond. If production is down, website leads are failing, so raise it first.

**Not installed on purpose (need credentials, never put in `.mcp.json`):** a read-only Postgres MCP for the CRM DB (local connection string, or for production an SSH tunnel, a read-only DB role and the server key, high risk: customer PII); GitHub MCP (OAuth or a personal token); AWS SES/SNS MCP (a separate read-only IAM identity, never the sending keys). Only Asaf decides; set up per person with `claude mcp add … -s local`.

**"Conflicting scopes"** warning: the same server is defined in several places (user / project / local) with different settings. Keep the project one (`.mcp.json`, shared with the team) and remove the others with `claude mcp remove <name> -s user` / `-s local`.

Never put tokens or passwords into `.mcp.json` (it's committed); servers here use per-person login (OAuth).
