#!/usr/bin/env node
// talcrm: a tiny, READ-ONLY MCP server that lets Claude (in this website repo) look at Tal's CRM.
// No dependencies, no secrets: it only calls CRM endpoints that are public GETs today.
// It never creates customers, never sends email/WhatsApp, and has no customer-data (PII) tools.
// Protocol: MCP over stdio (newline-delimited JSON-RPC 2.0).
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const REPO = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')
const CRM_REPO = process.env.TALCRM_REPO || 'C:\\projects\\talCRM'
const TARGETS = {
  production: process.env.TALCRM_PROD_API || 'https://crm.talroman.com/api',
  local: process.env.TALCRM_LOCAL_API || 'http://localhost:5000/api',
}

// ---------- helpers ----------
async function get(base, p, timeoutMs = 6000) {
  const url = `${base}${p}`
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), timeoutMs)
  const started = Date.now()
  try {
    const res = await fetch(url, { signal: ctrl.signal, headers: { accept: 'application/json' } })
    const text = await res.text()
    let body
    try { body = JSON.parse(text) } catch { body = text.slice(0, 300) }
    return { url, ok: res.ok, status: res.status, ms: Date.now() - started, body }
  } catch (e) {
    const reason = e.name === 'AbortError' ? `timeout after ${timeoutMs}ms` : (e.cause?.code || e.message)
    return { url, ok: false, status: 0, ms: Date.now() - started, error: reason }
  } finally {
    clearTimeout(t)
  }
}

function targetsFrom(arg, dflt = 'both') {
  const t = arg || dflt
  return t === 'both' ? ['local', 'production'] : [t]
}

function readWebsiteCrmBaseUrl() {
  for (const f of ['.env.local', '.env']) {
    try {
      const line = fs.readFileSync(path.join(REPO, f), 'utf8').split(/\r?\n/).find((l) => /^\s*CRM_BASE_URL\s*=/.test(l))
      if (line) return { file: f, value: line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '') }
    } catch { /* missing file */ }
  }
  return { file: null, value: null }
}

function courseKeysFromCrmRepo() {
  try {
    const src = fs.readFileSync(path.join(CRM_REPO, 'services', 'service.schooler.js'), 'utf8')
    const block = src.slice(src.indexOf('const COURSE_MAP'), src.indexOf('};', src.indexOf('const COURSE_MAP')))
    const keys = [...block.matchAll(/^\s{2}'([^']+)'\s*:/gm)].map((m) => m[1])
    return keys.length ? { source: 'talCRM/services/service.schooler.js (live)', keys } : null
  } catch { return null }
}

const FALLBACK_COURSES = ['what-woman-wants', 'what-woman-wants-2', 'what-men-want', 'what-men-want-2', 'couples-want', 'couples-want-2', 'gift-course']

const fmt = (o) => JSON.stringify(o, null, 2)
const authHint = (r) => (r.status === 401 ? ' (CRM now requires login for this endpoint, so the read-only tool can no longer see it)' : '')

// ---------- tools ----------
const tools = {
  crm_health: {
    description: 'Is the CRM up? Checks the server, the website-integration route (/api/wix/test) and email health, on local (http://localhost:5000) and/or production (https://crm.talroman.com). Read-only.',
    inputSchema: { type: 'object', properties: { target: { type: 'string', enum: ['local', 'production', 'both'], description: 'default: both' } } },
    async run({ target }) {
      const out = {}
      for (const t of targetsFrom(target)) {
        const base = TARGETS[t]
        const [server, wix, email] = await Promise.all([get(base, '/con_test'), get(base, '/wix/test'), get(base, '/email/health')])
        if (t === 'production' && !server.ok) {
          const plain = await get(base.replace(/^https:/, 'http:'), '/con_test')
          if (plain.ok) out.productionHttpsWarning = 'Production answers on http:// but not https:// — email unsubscribe links and the open pixel use https://crm.talroman.com, so they are likely broken. HTTPS on the CRM server needs fixing (Asaf).'
        }
        out[t] = {
          server: server.ok ? `up (${server.ms}ms)` : `DOWN: ${server.error || server.status}`,
          websiteRoute: wix.ok ? 'ok (/api/wix/test)' : `FAIL: ${wix.error || wix.status}`,
          emailHealth: email.ok ? email.body : `n/a: ${email.error || email.status}${authHint(email)}`,
        }
      }
      return out
    },
  },

  crm_check_website_config: {
    description: "Checks this website's CRM_BASE_URL (from .env.local/.env): it must end with /api, because crm-client.ts appends /wix/... and the CRM routes are /api/wix/.... Then pings <CRM_BASE_URL>/wix/test. Use when forms/leads/tracking fail locally.",
    inputSchema: { type: 'object', properties: {} },
    async run() {
      const { file, value } = readWebsiteCrmBaseUrl()
      const effective = value || 'http://localhost:5000 (code default)'
      const base = (value || 'http://localhost:5000').replace(/\/$/, '')
      const problems = []
      if (!/\/api$/.test(base)) problems.push(`CRM_BASE_URL should end with "/api" (e.g. http://localhost:5000/api or https://crm.talroman.com/api). Right now form posts go to ${base}/wix/customer, which returns 404.`)
      const ping = await get(base, '/wix/test')
      if (!ping.ok) problems.push(`${base}/wix/test → ${ping.error || ping.status}`)
      return { file: file || '(not set)', CRM_BASE_URL: effective, ok: problems.length === 0, problems, note: 'Production value lives in Vercel → Project → Settings → Environment Variables (should be https://crm.talroman.com/api).' }
    },
  },

  crm_email_status: {
    description: 'Email system status: health/auto-pause, queue stats, scheduler running?, pg-boss status. Read-only. Use for "why was no email sent".',
    inputSchema: { type: 'object', properties: { target: { type: 'string', enum: ['local', 'production'], description: 'default: production' } } },
    async run({ target }) {
      const base = TARGETS[target || 'production']
      const paths = ['/email/health', '/email/queue/stats', '/email/scheduler/status', '/email/pgboss/status']
      const res = await Promise.all(paths.map((p) => get(base, p)))
      return Object.fromEntries(res.map((r, i) => [paths[i], r.ok ? r.body : `n/a: ${r.error || r.status}${authHint(r)}`]))
    },
  },

  crm_sequences: {
    description: 'Lists CRM email sequences with their trigger tags, number of steps, active flag and "רצף שירות" (isTransactional) flag. Use to check which website tag triggers which email sequence, and whether gift sequences reach people who did not tick marketing consent. Read-only; no customer data.',
    inputSchema: { type: 'object', properties: { target: { type: 'string', enum: ['local', 'production'], description: 'default: production' } } },
    async run({ target }) {
      const r = await get(TARGETS[target || 'production'], '/email/sequences')
      if (!r.ok || !Array.isArray(r.body)) return `Could not read sequences: ${r.error || r.status}${authHint(r)}`
      return r.body.map((s) => ({
        id: s.id,
        name: s.name,
        active: s.isActive,
        transactional_service_sequence: s.isTransactional === true,
        triggerTags: (s.triggerTags || []).map((t) => t.tag?.name || t.name || t.tag_id).filter(Boolean),
        steps: (s.steps || []).length,
      }))
    },
  },

  crm_event_types: {
    description: 'Distinct tracking event names the CRM has actually received from the website (visitor_events). Use to verify a new event arrives, or that an existing name was not changed. Read-only.',
    inputSchema: { type: 'object', properties: { target: { type: 'string', enum: ['local', 'production'], description: 'default: production' } } },
    async run({ target }) {
      const r = await get(TARGETS[target || 'production'], '/funnel-stages/event-types')
      return r.ok ? r.body : `Could not read event types: ${r.error || r.status}${authHint(r)}`
    },
  },

  crm_contract: {
    description: 'The website → CRM contract: endpoints, every save-customer field with allowed values (tags, status, enrollToSchool course keys, notifyTal, emailConsent/consentSource/consentText, visitorId) and the track payload. Course keys are read live from the talCRM repo when it exists on this machine.',
    inputSchema: { type: 'object', properties: {} },
    async run() {
      const live = courseKeysFromCrmRepo()
      return {
        endpoints: {
          'website POST /api/crm/save-customer': 'CRM POST /api/wix/customer',
          'website POST /api/crm/track': 'CRM POST /api/wix/track',
          'website POST /api/crm/track/:eventId': 'CRM PUT /api/wix/track/:eventId',
          auth: 'none (server-to-server from Next.js routes; CORS irrelevant)',
          env: 'CRM_BASE_URL must end with /api',
        },
        saveCustomerFields: {
          'mail | phone': 'at least one required; existing customer matched by either; not overwritten',
          'name | firstname+lastname': 'new customers only; name split on first space',
          tag: 'comma-separated tag names; auto-created; may auto-enroll into email sequences; default "הגיע מהאתר"',
          status: 'status name; new customers only; default "קר"',
          enrollToSchool: { allowed: live ? live.keys : FALLBACK_COURSES, source: live ? live.source : 'fallback list (talCRM repo not found)', effect: 'Schooler enrollment → response.uniqueLink; unknown key → no link, lead still saved' },
          notifyTal: 'boolean → email to Tal (production only)',
          freeText: 'added to customer history',
          visitorId: 'localStorage crm_visitor_id → links events, records "signup"',
          emailConsent: 'true/false (also "on"/"off", 1/0); missing = not asked. Rules: talCRM utils/marketingConsent.js',
          consentSource: 'e.g. "quiz" (default "website")',
          consentText: 'exact wording shown (≤2000 chars)',
        },
        trackFields: { visitorId: 'required', eventType: 'required — never rename existing names', eventData: 'object', pageUrl: 'string', referrer: 'string' },
        fullEventList: 'C:\\projects\\talCRM\\claudeDocs\\WEBSITE_TRACKING_EVENTS.md',
      }
    },
  },
}

// ---------- JSON-RPC over stdio ----------
const send = (msg) => process.stdout.write(JSON.stringify(msg) + '\n')
let buf = ''
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk) => {
  buf += chunk
  let i
  while ((i = buf.indexOf('\n')) >= 0) {
    const line = buf.slice(0, i).trim()
    buf = buf.slice(i + 1)
    if (line) handle(line)
  }
})
process.stdin.on('end', () => process.exit(0))

async function handle(line) {
  let msg
  try { msg = JSON.parse(line) } catch { return }
  const { id, method, params = {} } = msg
  if (id === undefined) return // notification
  try {
    if (method === 'initialize') {
      return send({ jsonrpc: '2.0', id, result: { protocolVersion: params.protocolVersion || '2025-06-18', capabilities: { tools: {} }, serverInfo: { name: 'talcrm', version: '1.0.0' }, instructions: 'Read-only view of Tal\'s CRM. For the full connection map and safety rules use the crm-connections skill.' } })
    }
    if (method === 'ping') return send({ jsonrpc: '2.0', id, result: {} })
    if (method === 'tools/list') {
      return send({ jsonrpc: '2.0', id, result: { tools: Object.entries(tools).map(([name, t]) => ({ name, description: t.description, inputSchema: t.inputSchema, annotations: { readOnlyHint: true, openWorldHint: true } })) } })
    }
    if (method === 'tools/call') {
      const tool = tools[params.name]
      if (!tool) return send({ jsonrpc: '2.0', id, error: { code: -32602, message: `Unknown tool ${params.name}` } })
      try {
        const result = await tool.run(params.arguments || {})
        return send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: typeof result === 'string' ? result : fmt(result) }] } })
      } catch (e) {
        return send({ jsonrpc: '2.0', id, result: { content: [{ type: 'text', text: `Error: ${e.message}` }], isError: true } })
      }
    }
    send({ jsonrpc: '2.0', id, error: { code: -32601, message: `Method not found: ${method}` } })
  } catch (e) {
    send({ jsonrpc: '2.0', id, error: { code: -32603, message: e.message } })
  }
}
