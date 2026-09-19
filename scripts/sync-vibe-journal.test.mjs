import assert from 'node:assert/strict'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import test from 'node:test'

import {
  buildPublicSnapshots,
  redactPublicText,
  syncPublicData,
} from './sync-vibe-journal.mjs'

const REVISION = 'a'.repeat(40)

async function fixture() {
  const root = await mkdtemp(path.join(os.tmpdir(), 'xuli-vibe-sync-'))
  const source = path.join(root, 'source')
  await mkdir(path.join(source, 'journal'), { recursive: true })
  await writeFile(
    path.join(source, 'TIMELINE.json'),
    JSON.stringify({ timeline: [{ date: '2026-09-20', event: '完成线上同步' }] }),
  )
  await writeFile(
    path.join(source, 'journal/2026-09-20.json'),
    JSON.stringify({
      date: '2026-09-20',
      session_count: 2,
      turn_count: 12,
      skills_touched: [
        { id: 'typescript', name: 'TypeScript', category: 'language', count: 3 },
      ],
      timeline_event: '完成线上同步',
      body: {
        今天用了啥: ['TypeScript'],
        干了啥: ['在 /home/private/project 为徐力完成 127.0.0.1 验证'],
        可写进简历的一件事: '完成确定性数据发布',
      },
    }),
  )
  await writeFile(
    path.join(source, 'skills.json'),
    JSON.stringify({
      generated_at: '2026-09-20T08:00:00+08:00',
      skills: [
        {
          id: 'typescript',
          name: 'TypeScript',
          category: 'language',
          day_count: 8,
          total_count: 21,
          first_seen: '2026-05-17',
          last_seen: '2026-09-20',
        },
      ],
    }),
  )
  return { root, source }
}

test('buildPublicSnapshots projects every public journal and skill field', async (t) => {
  const { root, source } = await fixture()
  t.after(() => rm(root, { recursive: true, force: true }))

  const result = await buildPublicSnapshots({ source, revision: REVISION })
  const journal = JSON.parse(result.files['public/vibe-data/journal.json'])
  const skills = JSON.parse(result.files['public/vibe-data/skills.json'])

  assert.equal(result.manifest.source.revision, REVISION)
  assert.equal(result.manifest.journal.entryCount, 1)
  assert.equal(journal.entries[0].sessionCount, 2)
  assert.equal(journal.entries[0].skillsTouched[0].count, 3)
  assert.equal(journal.entries[0].work[0], '在 ~/project 为AXMORF完成 [private-ip] 验证')
  assert.deepEqual(skills.skills[0], {
    id: 'typescript',
    name: 'TypeScript',
    category: 'language',
    dayCount: 8,
    totalCount: 21,
    firstSeen: '2026-05-17',
    lastSeen: '2026-09-20',
  })
})

test('syncPublicData is deterministic and dry-run never writes', async (t) => {
  const { root, source } = await fixture()
  t.after(() => rm(root, { recursive: true, force: true }))
  const destination = path.join(root, 'destination')

  const dry = await syncPublicData({ source, revision: REVISION, destination, dryRun: true })
  assert.equal(dry.changedFiles.length, 4)
  await assert.rejects(readFile(path.join(destination, 'src/data/vibe-data-manifest.json')))

  const first = await syncPublicData({ source, revision: REVISION, destination })
  const second = await syncPublicData({ source, revision: REVISION, destination })
  assert.equal(first.changedFiles.length, 4)
  assert.deepEqual(second.changedFiles, [])
})

test('timeline disagreement fails closed', async (t) => {
  const { root, source } = await fixture()
  t.after(() => rm(root, { recursive: true, force: true }))
  const filename = path.join(source, 'TIMELINE.json')
  await writeFile(filename, JSON.stringify({ timeline: [{ date: '2026-09-20', event: '不一致' }] }))

  await assert.rejects(
    buildPublicSnapshots({ source, revision: REVISION }),
    /timeline_event disagrees/,
  )
})

test('redactPublicText removes public identity and machine-specific locations', () => {
  assert.equal(
    redactPublicText(
      '徐力 /Users/private/code /data/projects/repos/private ssh zzzxc@192.168.1.8',
    ),
    'AXMORF ~/code [local-path] ssh [private-host]',
  )
})
