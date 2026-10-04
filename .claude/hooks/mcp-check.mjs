// SessionStart hook: checks this project's MCP servers and the CRM connection, and tells Claude what needs attention.
// Output (stdout) is added to Claude's context. Never blocks the session: any failure just prints a short note.
import { execFile } from 'node:child_process'
import fs from 'node:fs'

const PROJECT_SERVERS = ['motion', 'motion-plus', 'Sanity', 'chrome-devtools', 'agentation', 'talcrm']

// ---- CRM checks (read-only, short timeouts): is CRM_BASE_URL right, is the CRM up? ----
async function ping(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
    return res.ok ? 'up' : `HTTP ${res.status}`
  } catch (e) {
    return e.name === 'TimeoutError' ? 'timeout' : (e.cause?.code || e.message)
  }
}

async function crmChecks() {
  const notes = []
  let base = null
  for (const f of ['.env.local', '.env']) {
    try {
      const line = fs.readFileSync(f, 'utf8').split(/\r?\n/).find((l) => /^\s*CRM_BASE_URL\s*=/.test(l))
      if (line) {
        base = line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '').replace(/\/$/, '')
        break
      }
    } catch { /* file missing */ }
  }
  if (!base) notes.push('CRM_BASE_URL is not set in .env.local, so forms use the code default http://localhost:5000, which is missing /api and gets a CRM 404. Set CRM_BASE_URL=http://localhost:5000/api.')
  else if (!/\/api$/.test(base)) notes.push(`CRM_BASE_URL in .env.local is "${base}". It must end with /api (e.g. http://localhost:5000/api), or every website form gets a CRM 404.`)
  const [prod, prodHttp, local] = await Promise.all([ping('https://crm.talroman.com/api/con_test'), ping('http://crm.talroman.com/api/con_test'), ping('http://localhost:5000/api/con_test')])
  if (prod !== 'up' && prodHttp === 'up') notes.push(`Production CRM answers on http:// but NOT on https:// (${prod}). The emails' unsubscribe links and open-tracking pixel use https://crm.talroman.com, so they are likely broken (legal risk: the unsubscribe link must work). Tell the user (Asaf) first thing: HTTPS/certificate/nginx on the CRM server needs fixing. See the crm-connections skill.`)
  else if (prod !== 'up') notes.push(`Production CRM (crm.talroman.com) is not responding (https: ${prod}, http: ${prodHttp}), so website leads are failing right now. Tell the user first thing (CRM is Asaf's); see the crm-connections skill.`)
  return { notes, summary: `production up, local ${local === 'up' ? 'running' : 'not running (fine unless testing forms locally)'}` }
}
const crmPromise = crmChecks().catch(() => ({ notes: [], summary: 'check skipped' }))

// ---- MCP servers ----
execFile('claude', ['mcp', 'list'], { timeout: 45000, shell: process.platform === 'win32', windowsHide: true }, async (err, stdout = '', stderr = '') => {
  const crm = await crmPromise
  if (crm.notes.length) crm.notes.forEach((n) => console.log(`[CRM check] ${n}`))
  else console.log(`[CRM check] CRM: ${crm.summary}. No need to mention it unless asked.`)

  const out = `${stdout}\n${stderr}`
  if (err && !stdout) {
    console.log(`[MCP check] Could not run "claude mcp list" (${err.code || err.message}). At the start of this conversation, tell the user briefly that the automatic MCP check didn't run, and use the "mcp-health" skill if any MCP tool is missing.`)
    return
  }
  const problems = []
  for (const name of PROJECT_SERVERS) {
    const line = out.split(/\r?\n/).find((l) => l.startsWith(`${name}:`))
    if (!line) problems.push(`${name}: not configured`)
    else if (!/Connected/.test(line)) problems.push(line.trim())
  }
  const conflicts = /Conflicting scopes/.test(out) ? out.slice(out.indexOf('[Conflicting scopes]')).split(/\r?\n/).slice(0, 4).join(' ').trim() : ''
  if (!problems.length && !conflicts) {
    console.log(`[MCP check] All project MCP servers are connected (${PROJECT_SERVERS.join(', ')}). No need to mention it unless asked.`)
    return
  }
  console.log(
    [
      '[MCP check] Some project MCP servers need attention:',
      ...problems.map((p) => `- ${p}`),
      conflicts && `- ${conflicts}`,
      'At the start of this conversation (before anything else, briefly, in the user\'s language), tell the user which servers are not working, what each one is for, and exactly how to fix it — use the "mcp-health" skill. "Pending approval" and "Needs authentication" are normal on first use.',
    ]
      .filter(Boolean)
      .join('\n'),
  )
})
