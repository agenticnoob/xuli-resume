#!/usr/bin/env node

import { createHash } from 'node:crypto'

function origin(value) {
  const url = new URL(value)
  const local = url.hostname === '127.0.0.1' || url.hostname === 'localhost'
  if (url.protocol !== 'https:' && !(local && url.protocol === 'http:')) {
    throw new Error('deployment URL must use https (except localhost verification)')
  }
  return url.origin
}

async function fetchText(url) {
  const response = await fetch(url, { cache: 'no-store' })
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(`${url}: expected application/json, got ${contentType || 'unknown'}`)
  }
  return response.text()
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex')
}

export async function verifyDeployment(productionUrl, expectedRevision) {
  const base = origin(productionUrl)
  const manifest = JSON.parse(await fetchText(`${base}/vibe-data/manifest.json`))
  if (manifest.source?.revision !== expectedRevision) {
    throw new Error(
      `source revision mismatch: expected ${expectedRevision}, got ${manifest.source?.revision || 'missing'}`,
    )
  }

  const [journalText, skillsText] = await Promise.all([
    fetchText(new URL(manifest.journal.url, base).href),
    fetchText(new URL(manifest.skills.url, base).href),
  ])
  if (sha256(journalText) !== manifest.journal.sha256) {
    throw new Error('journal snapshot hash mismatch')
  }
  if (sha256(skillsText) !== manifest.skills.sha256) {
    throw new Error('skills snapshot hash mismatch')
  }

  const journal = JSON.parse(journalText)
  const skills = JSON.parse(skillsText)
  if (journal.entries?.length !== manifest.journal.entryCount) {
    throw new Error('journal entry count mismatch')
  }
  if (skills.skills?.length !== manifest.skills.skillCount) {
    throw new Error('skill count mismatch')
  }
  return {
    sourceRevision: manifest.source.revision,
    latestDate: manifest.journal.latestDate,
    journalEntries: manifest.journal.entryCount,
    skills: manifest.skills.skillCount,
  }
}

if (process.argv[1] && process.argv[1].endsWith('verify-vibe-data-deployment.mjs')) {
  const productionUrl = process.argv[2]
  const expectedRevision = process.argv[3]
  if (!productionUrl || !expectedRevision) {
    throw new Error('Usage: verify-vibe-data-deployment.mjs <production-url> <source-revision>')
  }
  console.log(JSON.stringify(await verifyDeployment(productionUrl, expectedRevision), null, 2))
}
