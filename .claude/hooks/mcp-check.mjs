// SessionStart hook: checks this project's MCP servers and tells Claude which ones need attention.
// Output (stdout) is added to Claude's context. Never blocks the session: any failure just prints a short note.
import { execFile } from 'node:child_process'

const PROJECT_SERVERS = ['motion', 'motion-plus', 'Sanity', 'chrome-devtools', 'agentation']

execFile('claude', ['mcp', 'list'], { timeout: 45000, shell: process.platform === 'win32', windowsHide: true }, (err, stdout = '', stderr = '') => {
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
    console.log('[MCP check] All project MCP servers are connected (motion, motion-plus, Sanity, chrome-devtools, agentation). No need to mention it unless asked.')
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
