import manifestJson from '../data/vibe-data-manifest.json'
import { useEffect, useState } from 'react'

export interface VibeDataSource {
  repository: string
  revision: string
  generatedAt: string
}

export interface JournalSkillTouch {
  id: string
  name: string
  category: string
  count: number
}

export interface JournalEntry {
  date: string
  sessionCount: number
  turnCount: number
  skillsTouched: JournalSkillTouch[]
  timelineEvent: string
  tools: string[]
  work: string[]
  resumeHighlight: string
}

export interface JournalSnapshot {
  schemaVersion: 1
  source: VibeDataSource
  entries: JournalEntry[]
}

export interface PipelineSkill {
  id: string
  name: string
  category: string
  dayCount: number
  totalCount: number
  firstSeen: string
  lastSeen: string
}

export interface SkillsSnapshot {
  schemaVersion: 1
  source: VibeDataSource
  skills: PipelineSkill[]
}

export interface VibeDataManifest {
  schemaVersion: 1
  source: VibeDataSource
  journal: {
    url: string
    sha256: string
    entryCount: number
    latestDate: string
  }
  skills: {
    url: string
    sha256: string
    skillCount: number
  }
}

export const vibeDataManifest = manifestJson as VibeDataManifest

async function fetchSnapshot<T>(url: string, sha256: string, label: string): Promise<T> {
  const separator = url.includes('?') ? '&' : '?'
  const response = await fetch(`${url}${separator}v=${sha256.slice(0, 16)}`)
  if (!response.ok) throw new Error(`${label} 请求失败（HTTP ${response.status}）`)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error(`${label} 返回了非 JSON 内容`)
  }
  return response.json() as Promise<T>
}

let journalPromise: Promise<JournalSnapshot> | undefined
let skillsPromise: Promise<SkillsSnapshot> | undefined

export function loadJournalSnapshot(): Promise<JournalSnapshot> {
  journalPromise ??= fetchSnapshot<JournalSnapshot>(
    vibeDataManifest.journal.url,
    vibeDataManifest.journal.sha256,
    'Vibe Journal 数据',
  ).catch((error) => {
    journalPromise = undefined
    throw error
  })
  return journalPromise
}

export function loadSkillsSnapshot(): Promise<SkillsSnapshot> {
  skillsPromise ??= fetchSnapshot<SkillsSnapshot>(
    vibeDataManifest.skills.url,
    vibeDataManifest.skills.sha256,
    '技能数据',
  ).catch((error) => {
    skillsPromise = undefined
    throw error
  })
  return skillsPromise
}

export function formatSourceTimestamp(value: string): string {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('zh-CN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Shanghai',
  }).format(date)
}

export interface VibeSnapshotState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export function useVibeSnapshot<T>(loader: () => Promise<T>): VibeSnapshotState<T> {
  const [state, setState] = useState<VibeSnapshotState<T>>({
    data: null,
    error: null,
    loading: true,
  })

  useEffect(() => {
    let active = true
    loader().then(
      (data) => {
        if (active) setState({ data, error: null, loading: false })
      },
      (error: unknown) => {
        if (active) {
          setState({
            data: null,
            error: error instanceof Error ? error.message : '数据加载失败',
            loading: false,
          })
        }
      },
    )
    return () => {
      active = false
    }
  }, [loader])

  return state
}
