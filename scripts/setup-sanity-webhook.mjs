/**
 * Creates a Sanity webhook that triggers a GitHub Actions deploy
 * whenever content is published.
 *
 * Prerequisites:
 *   - SANITY_WRITE_TOKEN in .env.local (already there)
 *   - GITHUB_PAT env var: a GitHub personal access token with `repo` + `workflow` scopes
 *     Create one at: https://github.com/settings/tokens/new
 *
 * Usage:
 *   GITHUB_PAT=ghp_xxx node scripts/setup-sanity-webhook.mjs
 */

const SANITY_TOKEN = process.env.SANITY_WRITE_TOKEN
const GITHUB_PAT   = process.env.GITHUB_PAT
const PROJECT_ID   = 'f2dms55f'
const REPO         = 'btasaf/tal-roman-website'
const WORKFLOW     = 'deploy.yml'
const BRANCH       = 'main'

if (!SANITY_TOKEN) { console.error('Missing SANITY_WRITE_TOKEN'); process.exit(1) }
if (!GITHUB_PAT)   { console.error('Missing GITHUB_PAT');         process.exit(1) }

const webhook = {
  name: 'Redeploy on content publish',
  description: 'Triggers GitHub Actions deploy when Sanity content changes',
  url: `https://api.github.com/repos/${REPO}/actions/workflows/${WORKFLOW}/dispatches`,
  on: {
    create: { filter: "!(_id in path('drafts.**'))" },
    update: { filter: "!(_id in path('drafts.**'))" },
    delete: { filter: "!(_id in path('drafts.**'))" },
  },
  httpMethod: 'POST',
  headers: [
    { name: 'Authorization', value: `Bearer ${GITHUB_PAT}` },
    { name: 'Accept',        value: 'application/vnd.github.v3+json' },
    { name: 'Content-Type',  value: 'application/json' },
  ],
  payloadAsBody: false,
  body: JSON.stringify({ ref: BRANCH }),
}

const res = await fetch(
  `https://api.sanity.io/v2021-06-07/hooks/projects/${PROJECT_ID}`,
  {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${SANITY_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(webhook),
  }
)

const data = await res.json()
if (!res.ok) {
  console.error('Failed:', JSON.stringify(data, null, 2))
  process.exit(1)
}

console.log('Webhook created:', data.id)
console.log('Every time you publish in Sanity, the site will automatically redeploy.')
