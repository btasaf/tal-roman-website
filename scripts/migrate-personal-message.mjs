import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'f2dms55f',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})

function stringToBlocks(text) {
  return text
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0)
    .map((line, i) => ({
      _type: 'block',
      _key: `migrated_${i}`,
      style: 'normal',
      markDefs: [],
      children: [{ _type: 'span', _key: `span_${i}`, text: line, marks: [] }],
    }))
}

const doc = await client.fetch(`*[_type == "homepageSection"][0]{ _id, personalMessage }`)

if (!doc) {
  console.error('No homepageSection document found.')
  process.exit(1)
}

if (!doc.personalMessage) {
  console.log('personalMessage is empty — nothing to migrate.')
  process.exit(0)
}

if (Array.isArray(doc.personalMessage)) {
  console.log('personalMessage is already an array — no migration needed.')
  process.exit(0)
}

console.log('Current value (string):')
console.log(doc.personalMessage)
console.log()

const blocks = stringToBlocks(doc.personalMessage)
console.log(`Converting to ${blocks.length} portable text block(s)…`)

await client.patch(doc._id).set({ personalMessage: blocks }).commit()

console.log('Done. personalMessage migrated to portable text.')
