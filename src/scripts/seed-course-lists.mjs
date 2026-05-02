#!/usr/bin/env node
/**
 * Seed whatYoullLearn + whoIsItFor for each course from Wix CSV exports.
 * Run from project root:
 *   node src/scripts/seed-course-lists.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '../../')

const client = createClient({
  projectId: 'f2dms55f',
  dataset: 'production',
  token: 'skSukHTRgQ0L7e9iKiXtxXSnAney0OWF1bkS5lPRHbr3QKvQp0flEbigInoB1hoPG3dS9iCBayrln1JhdvVUMzM8u1NPPBBUk06Cged6GtCJEP1eW1oGN0sX1RzVAULMJiUfcs0rjoBnrXxqBOhrjcpPsXnj3cVgVFUaZDjTSPrMIPWUTCWv',
  apiVersion: '2024-01-01',
  useCdn: false,
})

// ── CSV parser (handles quoted fields with embedded newlines/commas/quotes) ──
function parseCSV(raw) {
  const text = raw.replace(/^﻿/, '') // strip BOM
  const rows = []
  let headers = null
  let i = 0

  function readField() {
    if (text[i] === '"') {
      i++ // skip opening quote
      let val = ''
      while (i < text.length) {
        if (text[i] === '"' && text[i + 1] === '"') { val += '"'; i += 2 }
        else if (text[i] === '"') { i++; break }
        else { val += text[i++] }
      }
      return val
    }
    let val = ''
    while (i < text.length && text[i] !== ',' && text[i] !== '\n' && text[i] !== '\r') {
      val += text[i++]
    }
    return val
  }

  function readRow() {
    const fields = []
    while (i < text.length) {
      fields.push(readField())
      if (text[i] === ',') { i++; continue }
      if (text[i] === '\r') i++
      if (text[i] === '\n') i++
      break
    }
    return fields
  }

  while (i < text.length) {
    const fields = readRow()
    if (fields.length === 0 || (fields.length === 1 && fields[0] === '')) continue
    if (!headers) { headers = fields; continue }
    const row = {}
    headers.forEach((h, idx) => { row[h] = fields[idx] ?? '' })
    rows.push(row)
  }
  return rows
}

function parseJsonField(str) {
  if (!str || str.trim() === '') return []
  try { return JSON.parse(str) } catch { return [] }
}

// ── 1. Load list items ──
const listRows = parseCSV(readFileSync(join(ROOT, 'wix csv cms/old/רשימות+מוצרים+_.csv'), 'utf-8'))
const listItemById = {}
for (const row of listRows) {
  if (row.ID) listItemById[row.ID] = { text: row.Title.trim(), type: row.type?.trim() }
}
console.log(`Loaded ${Object.keys(listItemById).length} list items`)

// ── 2. Load products and build per-product lists ──
const productRows = parseCSV(readFileSync(join(ROOT, 'wix csv cms/old/מוצרים.csv'), 'utf-8'))
const wixByTitle = {}

for (const row of productRows) {
  const refs = parseJsonField(row['productSuitability_multireference'])
  if (refs.length === 0) continue

  const learn = []
  const suitable = []

  for (const id of refs) {
    const item = listItemById[id]
    if (!item) { console.warn(`  ⚠ unknown list item id: ${id}`); continue }
    if (item.type === 'מה נלמד') learn.push(item.text)
    else if (item.type === 'למי זה מתאים') suitable.push(item.text)
  }

  wixByTitle[row.Title.trim()] = { learn, suitable }
  console.log(`  ${row.Title}: ${learn.length} learn, ${suitable.length} suitable`)
}

// ── 3. Fetch Sanity courses ──
console.log('\nFetching courses from Sanity...')
const courses = await client.fetch('*[_type == "course"] { _id, title, "slug": slug.current }')
console.log(`Found ${courses.length} courses\n`)

// ── 4. Match and patch ──
function normalize(s) {
  return (s ?? '').trim().replace(/\s+/g, ' ').toLowerCase()
}

let patched = 0
for (const course of courses) {
  const norm = normalize(course.title)
  let data = wixByTitle[course.title]

  // Fallback: normalized match
  if (!data) {
    for (const [wixTitle, d] of Object.entries(wixByTitle)) {
      if (normalize(wixTitle) === norm) { data = d; break }
    }
  }

  if (!data) {
    console.log(`  ⚠  No Wix match for: "${course.title}"`)
    continue
  }

  if (data.learn.length === 0 && data.suitable.length === 0) {
    console.log(`  ⏭  No list items for: "${course.title}"`)
    continue
  }

  await client
    .patch(course._id)
    .set({ whatYoullLearn: data.learn, whoIsItFor: data.suitable })
    .unset(['suitableFor'])
    .commit()

  console.log(`  ✅ "${course.title}" — ${data.learn.length} learn, ${data.suitable.length} suitable`)
  patched++
}

console.log(`\nDone — patched ${patched} course(s).`)
