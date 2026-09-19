#!/usr/bin/env node

import { createHash } from 'node:crypto'
import { mkdir, readFile, readdir, rename, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseArgs } from 'node:util'

export const SOURCE_REPOSITORY = 'agenticnoob/vibe-journal-pipeline'

const PROJECT_ROOT = fileURLToPath(new URL('../', import.meta.url))
const PRIVATE_NAME = '\u5F90\u529B'

function object(value, label) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${label}: expected an object`)
  }
  return value
}

function string(value, label, { allowEmpty = false } = {}) {
  if (typeof value !== 'string') throw new Error(`${label}: expected text`)
  const normalized = value.trim()
  if (!allowEmpty && !normalized) throw new Error(`${label}: expected non-empty text`)
  return normalized
}

function integer(value, label, { minimum = 0 } = {}) {
  if (!Number.isInteger(value) || value < minimum) {
    throw new Error(`${label}: expected an integer >= ${minimum}`)
  }
  return value
}

function stringArray(value, label) {
  if (!Array.isArray(value)) throw new Error(`${label}: expected a text array`)
  return value.map((item, index) => string(item, `${label}[${index}]`))
}

function validDate(value, label) {
  const date = string(value, label)
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
    new Date(`${date}T00:00:00Z`).toISOString().slice(0, 10) !== date
  ) {
    throw new Error(`${label}: invalid YYYY-MM-DD date`)
  }
  return date
}

export function redactPublicText(value) {
  return value
    .split(PRIVATE_NAME)
    .join('AXMORF')
    .replace(/\/(?:home|Users)\/[^/\s`"']+/gu, '~')
    .replace(
      /\/(?:data|tmp|mnt|opt|srv)\/[A-Za-z0-9._~+@%=-]+(?:\/[A-Za-z0-9._~+@%=-]+)*/gu,
      '[local-path]',
    )
    .replace(/(?<!\d)(?:\d{1,3}\.){3}\d{1,3}(?!\d)/gu, '[private-ip]')
    .replace(/\b[A-Za-z0-9._-]+@\[private-ip\]/gu, '[private-host]')
}

function publicString(value, label, options) {
  return redactPublicText(string(value, label, options))
}

function publicStringArray(value, label) {
  return stringArray(value, label).map(redactPublicText)
}

function parseTimeline(value) {
  const input = object(value, 'TIMELINE.json')
  if (!Array.isArray(input.timeline)) {
    throw new Error('TIMELINE.json.timeline: expected an array')
  }

  const timeline = new Map()
  input.timeline.forEach((raw, index) => {
    const item = object(raw, `TIMELINE.json.timeline[${index}]`)
    const date = validDate(item.date, `TIMELINE.json.timeline[${index}].date`)
    if (timeline.has(date)) throw new Error(`TIMELINE.json: duplicate date ${date}`)
    timeline.set(
      date,
      publicString(item.event, `TIMELINE.json.timeline[${index}].event`, { allowEmpty: true }),
    )
  })
  return timeline
}

function parseJournal(value, filename, timeline) {
  const input = object(value, filename)
  const date = validDate(input.date, `${filename}.date`)
  if (filename !== `${date}.json`) {
    throw new Error(`${filename}: filename does not match record date ${date}`)
  }

  const body = object(input.body, `${filename}.body`)
  const recordEvent = publicString(input.timeline_event, `${filename}.timeline_event`, {
    allowEmpty: true,
  })
  const timelineEvent = timeline.get(date)
  if (timelineEvent !== undefined && timelineEvent !== recordEvent) {
    throw new Error(`${filename}: timeline_event disagrees with TIMELINE.json`)
  }

  if (!Array.isArray(input.skills_touched)) {
    throw new Error(`${filename}.skills_touched: expected an array`)
  }
  const skillsTouched = input.skills_touched.map((raw, index) => {
    const skill = object(raw, `${filename}.skills_touched[${index}]`)
    return {
      id: publicString(skill.id, `${filename}.skills_touched[${index}].id`),
      name: publicString(skill.name, `${filename}.skills_touched[${index}].name`),
      category: publicString(skill.category, `${filename}.skills_touched[${index}].category`),
      count: integer(skill.count, `${filename}.skills_touched[${index}].count`, { minimum: 1 }),
    }
  })

  return {
    date,
    sessionCount: integer(input.session_count, `${filename}.session_count`),
    turnCount: integer(input.turn_count, `${filename}.turn_count`),
    skillsTouched,
    timelineEvent: timelineEvent ?? recordEvent,
    tools: publicStringArray(body['今天用了啥'], `${filename}.body.今天用了啥`),
    work: publicStringArray(body['干了啥'], `${filename}.body.干了啥`),
    resumeHighlight: publicString(
      body['可写进简历的一件事'],
      `${filename}.body.可写进简历的一件事`,
      { allowEmpty: true },
    ),
  }
}

function parseSkills(value) {
  const input = object(value, 'skills.json')
  const generatedAt = string(input.generated_at, 'skills.json.generated_at')
  if (Number.isNaN(Date.parse(generatedAt))) {
    throw new Error('skills.json.generated_at: expected an ISO timestamp')
  }
  if (!Array.isArray(input.skills)) throw new Error('skills.json.skills: expected an array')

  const ids = new Set()
  const skills = input.skills.map((raw, index) => {
    const item = object(raw, `skills.json.skills[${index}]`)
    const id = publicString(item.id, `skills.json.skills[${index}].id`)
    if (ids.has(id)) throw new Error(`skills.json: duplicate skill id ${id}`)
    ids.add(id)
    return {
      id,
      name: publicString(item.name, `skills.json.skills[${index}].name`),
      category: publicString(item.category, `skills.json.skills[${index}].category`),
      dayCount: integer(item.day_count, `skills.json.skills[${index}].day_count`, {
        minimum: 1,
      }),
      totalCount: integer(item.total_count, `skills.json.skills[${index}].total_count`, {
        minimum: 1,
      }),
      firstSeen: validDate(item.first_seen, `skills.json.skills[${index}].first_seen`),
      lastSeen: validDate(item.last_seen, `skills.json.skills[${index}].last_seen`),
    }
  })
  return { generatedAt, skills }
}

function serialize(value) {
  return `${JSON.stringify(value, null, 2)}\n`
}

function sha256(content) {
  return createHash('sha256').update(content).digest('hex')
}

export async function buildPublicSnapshots({ source: sourceDirectory, revision }) {
  if (!/^[a-f0-9]{40}$/u.test(revision)) {
    throw new Error('revision must be a full lowercase Git commit SHA')
  }

  const timeline = parseTimeline(
    JSON.parse(await readFile(path.join(sourceDirectory, 'TIMELINE.json'), 'utf8')),
  )
  const journalDirectory = path.join(sourceDirectory, 'journal')
  const journalFiles = (await readdir(journalDirectory, { withFileTypes: true }))
    .filter((entry) => entry.name.endsWith('.json'))
    .sort((a, b) => a.name.localeCompare(b.name))
  if (!journalFiles.length) throw new Error('data/journal: no JSON records found')

  const entries = []
  for (const entry of journalFiles) {
    if (!entry.isFile()) throw new Error(`data/journal/${entry.name}: expected a regular file`)
    const value = JSON.parse(await readFile(path.join(journalDirectory, entry.name), 'utf8'))
    entries.push(parseJournal(value, entry.name, timeline))
  }
  entries.sort((a, b) => b.date.localeCompare(a.date))

  const { generatedAt, skills } = parseSkills(
    JSON.parse(await readFile(path.join(sourceDirectory, 'skills.json'), 'utf8')),
  )
  const source = {
    repository: SOURCE_REPOSITORY,
    revision,
    generatedAt,
  }
  const journalSnapshot = {
    schemaVersion: 1,
    source,
    entries,
  }
  const skillsSnapshot = {
    schemaVersion: 1,
    source,
    skills,
  }
  const journalContent = serialize(journalSnapshot)
  const skillsContent = serialize(skillsSnapshot)
  const manifest = {
    schemaVersion: 1,
    source,
    journal: {
      url: '/vibe-data/journal.json',
      sha256: sha256(journalContent),
      entryCount: entries.length,
      latestDate: entries[0].date,
    },
    skills: {
      url: '/vibe-data/skills.json',
      sha256: sha256(skillsContent),
      skillCount: skills.length,
    },
  }

  return {
    manifest,
    files: {
      'public/vibe-data/journal.json': journalContent,
      'public/vibe-data/skills.json': skillsContent,
      'public/vibe-data/manifest.json': serialize(manifest),
      'src/data/vibe-data-manifest.json': serialize(manifest),
    },
  }
}

async function atomicWrite(filename, content) {
  await mkdir(path.dirname(filename), { recursive: true })
  const temporary = `${filename}.${process.pid}.tmp`
  await writeFile(temporary, content)
  await rename(temporary, filename)
}

async function currentContent(filename) {
  try {
    return await readFile(filename, 'utf8')
  } catch (error) {
    if (error && error.code === 'ENOENT') return null
    throw error
  }
}

export async function syncPublicData({
  source,
  revision,
  destination = PROJECT_ROOT,
  dryRun = false,
}) {
  const result = await buildPublicSnapshots({ source, revision })
  const changedFiles = []
  for (const [relativePath, content] of Object.entries(result.files)) {
    const filename = path.join(destination, relativePath)
    if ((await currentContent(filename)) === content) continue
    changedFiles.push(relativePath)
    if (!dryRun) await atomicWrite(filename, content)
  }
  return { ...result.manifest, changedFiles, dryRun }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const { values } = parseArgs({
      options: {
        source: { type: 'string' },
        revision: { type: 'string' },
        'dry-run': { type: 'boolean', default: false },
      },
    })
    if (!values.source) {
      throw new Error('Use --source /path/to/vibe-journal-pipeline/data')
    }
    if (!values.revision) {
      throw new Error('Use --revision with the exact 40-character source commit SHA')
    }
    const result = await syncPublicData({
      source: path.resolve(values.source),
      revision: values.revision,
      dryRun: values['dry-run'],
    })
    console.log(
      `[vibe-data-sync] journals=${result.journal.entryCount} skills=${result.skills.skillCount}` +
        ` latest=${result.journal.latestDate} revision=${result.source.revision}` +
        ` changed=${result.changedFiles.length}${result.dryRun ? ' (dry-run)' : ''}`,
    )
    for (const filename of result.changedFiles) {
      console.log(`  ${result.dryRun ? '~' : '+'} ${filename}`)
    }
  } catch (error) {
    console.error('[vibe-data-sync] FAILED:', error instanceof Error ? error.stack : error)
    process.exitCode = 1
  }
}
