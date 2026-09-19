import { useEffect, useRef, useState } from 'react'
import PageHeader from '../components/PageHeader'
import PageTransition from '../components/PageTransition'
import {
  formatSourceTimestamp,
  loadJournalSnapshot,
  useVibeSnapshot,
  vibeDataManifest,
  type JournalEntry,
} from '../lib/vibeData'

const EMPTY_ENTRIES: JournalEntry[] = []

function formatDate(date: string): string {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  }).format(new Date(`${date}T00:00:00+08:00`))
}

function LoadingCard({ message }: { message: string }) {
  return (
    <div className="sketch-card bg-[var(--color-card)] p-8 text-center" role="status">
      <p className="text-[var(--xuli-text-tertiary)] text-sm">{message}</p>
    </div>
  )
}

function JournalArticle({ entry }: { entry: JournalEntry }) {
  return (
    <div className="vj-doc-host">
      <div className="vj-doc">
        {entry.resumeHighlight ? (
          <>
            <h2>可写进简历的一件事</h2>
            <blockquote>
              <p>{entry.resumeHighlight}</p>
            </blockquote>
          </>
        ) : null}

        <h2>今天用了啥</h2>
        <div className="flex flex-wrap gap-2 not-prose">
          {entry.tools.map((tool) => (
            <span key={tool} className="paper-chip px-3 py-1.5 text-xs text-[var(--xuli-text-secondary)]">
              {tool}
            </span>
          ))}
        </div>

        <h2>干了啥</h2>
        <ul>
          {entry.work.map((item, index) => (
            <li key={`${index}-${item}`}>{item}</li>
          ))}
        </ul>

        {entry.skillsTouched.length > 0 ? (
          <>
            <h2>技能使用记录</h2>
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>技能</th>
                    <th>类别</th>
                    <th>当日次数</th>
                  </tr>
                </thead>
                <tbody>
                  {entry.skillsTouched.map((skill) => (
                    <tr key={skill.id}>
                      <td>{skill.name}</td>
                      <td><code>{skill.category}</code></td>
                      <td>{skill.count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default function VibeJournal() {
  const { data, error, loading } = useVibeSnapshot(loadJournalSnapshot)
  const entries = data?.entries ?? EMPTY_ENTRIES
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (selectedIndex >= entries.length) setSelectedIndex(0)
  }, [entries.length, selectedIndex])

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = 0
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [selectedIndex])

  useEffect(() => {
    if (entries.length === 0) return
    const onKey = (event: KeyboardEvent) => {
      const tag = (event.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (event.key === 'ArrowDown' || event.key === 'ArrowRight' || event.key === 'j') {
        event.preventDefault()
        setSelectedIndex((index) => (index + 1) % entries.length)
      } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft' || event.key === 'k') {
        event.preventDefault()
        setSelectedIndex((index) => (index - 1 + entries.length) % entries.length)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [entries.length])

  useEffect(() => {
    const active = sidebarRef.current?.querySelector<HTMLElement>(
      `[data-doc-index="${selectedIndex}"]`,
    )
    active?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const current = entries[selectedIndex]
  const timelineEntries = entries.filter((entry) => entry.timelineEvent).slice(0, 10)
  const entryNumber = entries.length > 0 ? `${selectedIndex + 1} / ${entries.length}` : '0 / 0'

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <PageHeader
            title="Vibe Coding"
            subtitle="由线上 vibe-journal-pipeline 持续生成的结构化工程实践记录"
            highlightWord="日志"
          />

          <div className="illustrated-intro illustrated-intro-journal mb-8">
            <div className="paper-note bg-[var(--color-card)]/70 p-4 flex flex-col justify-center gap-3">
              <span className="eyebrow-note self-start">线上数据源</span>
              <span className="text-[var(--xuli-text-tertiary)] text-xs font-mono">
                更新：{formatSourceTimestamp(vibeDataManifest.source.generatedAt)}
              </span>
              <span className="text-[var(--xuli-text-tertiary)] text-xs font-mono">
                {vibeDataManifest.journal.entryCount} 天日志 · 最新 {vibeDataManifest.journal.latestDate}
              </span>
              <span className="text-[var(--xuli-text-tertiary)] text-xs font-mono break-all">
                source {vibeDataManifest.source.revision.slice(0, 12)}
              </span>
            </div>
            <figure className="spot-illustration spot-illustration-journal">
              <img
                src="/illustrations/practice-journal.webp"
                alt="记录代码、实验、失败修正、时间线和验证结果的手绘工程日志本"
                width="1080"
                height="720"
                loading="lazy"
              />
              <figcaption>保留试验、修正与验证，让方法随实践生长</figcaption>
            </figure>
          </div>

          {timelineEntries.length > 0 ? (
            <div className="journal-timeline overflow-x-auto pb-4 mb-8">
              <div className="flex items-start justify-start gap-4 min-w-max px-4">
                {timelineEntries.map((entry) => (
                  <button
                    type="button"
                    key={entry.date}
                    className="journal-milestone flex flex-col items-center min-w-[170px] max-w-[210px]"
                    onClick={() => setSelectedIndex(entries.indexOf(entry))}
                  >
                    <span className="timeline-dot mb-3" aria-hidden="true">×</span>
                    <span className="text-[var(--xuli-accent)] text-xs font-mono mb-1">{entry.date}</span>
                    <span className="text-[var(--xuli-text-primary)] text-xs text-center leading-tight">
                      {entry.timelineEvent}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {loading ? <LoadingCard message="正在加载线上工程日志…" /> : null}
          {error ? <LoadingCard message={`日志暂时无法加载：${error}`} /> : null}
          {!loading && !error && entries.length === 0 ? (
            <LoadingCard message="线上数据源暂时没有可展示的日志。" />
          ) : null}

          {current ? (
            <>
              <button
                type="button"
                onClick={() => setMobileTocOpen((open) => !open)}
                className="paper-note lg:hidden w-full mb-4 flex items-center justify-between gap-2 px-4 py-3 bg-[var(--color-card)]/80 text-left"
                aria-expanded={mobileTocOpen}
                aria-controls="vj-mobile-toc"
              >
                <span className="flex items-center gap-2 min-w-0">
                  <span className="text-[var(--xuli-accent)] font-mono text-xs">{entryNumber}</span>
                  <span className="text-[var(--xuli-text-primary)] text-sm truncate">
                    {current.date} · {current.timelineEvent || current.resumeHighlight}
                  </span>
                </span>
                <svg
                  className={`w-4 h-4 text-[var(--xuli-text-tertiary)] transition-transform ${mobileTocOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {mobileTocOpen ? (
                <div id="vj-mobile-toc" className="sketch-card lg:hidden mb-4 max-h-72 overflow-y-auto bg-[var(--color-surface)]/80">
                  {entries.map((entry, index) => (
                    <button
                      type="button"
                      key={entry.date}
                      onClick={() => {
                        setSelectedIndex(index)
                        setMobileTocOpen(false)
                      }}
                      className={`w-full text-left px-4 py-2 text-sm border-b border-[var(--color-border)]/40 last:border-b-0 ${
                        index === selectedIndex
                          ? 'bg-[var(--xuli-accent-muted)] text-[var(--xuli-accent)]'
                          : 'text-[var(--xuli-text-secondary)] hover:bg-[var(--color-card)]'
                      }`}
                    >
                      <span className="font-mono text-[10px] text-[var(--xuli-text-tertiary)] mr-2">{entry.date}</span>
                      {entry.timelineEvent || entry.resumeHighlight || '实践记录'}
                    </button>
                  ))}
                </div>
              ) : null}

              <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] gap-6 mb-12">
                <aside
                  ref={sidebarRef}
                  className="sketch-card hidden lg:block self-start sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto bg-[var(--color-surface)]/60 p-2"
                >
                  <div className="px-3 py-2 text-xs font-mono text-[var(--xuli-text-tertiary)] uppercase tracking-wider border-b border-[var(--color-border)]/40 mb-2">
                    每日实践
                  </div>
                  <ul className="space-y-0.5">
                    {entries.map((entry, index) => (
                      <li key={entry.date}>
                        <button
                          type="button"
                          data-doc-index={index}
                          onClick={() => setSelectedIndex(index)}
                          className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                            index === selectedIndex
                              ? 'bg-[var(--xuli-accent-muted)] text-[var(--xuli-accent)] border-l-2 border-[var(--xuli-accent)]'
                              : 'text-[var(--xuli-text-secondary)] hover:bg-[var(--color-card)] hover:text-[var(--xuli-text-primary)] border-l-2 border-transparent'
                          }`}
                        >
                          <span className="font-mono text-[10px] text-[var(--xuli-text-tertiary)]">{entry.date}</span>
                          <span className="block line-clamp-2 leading-tight mt-1">
                            {entry.timelineEvent || entry.resumeHighlight || '实践记录'}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </aside>

                <article ref={contentRef} className="sketch-card sketch-reader bg-[var(--color-card)] p-6 sm:p-8 min-h-[28rem]">
                  <header className="mb-6 pb-4 border-b border-[var(--color-border)]/40">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <span className="font-mono text-xs text-[var(--xuli-text-tertiary)]">
                        {entryNumber} · {current.sessionCount} 个会话 · {current.turnCount} 轮对话
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedIndex((index) => (index - 1 + entries.length) % entries.length)}
                          className="paper-tag px-3 py-1.5 text-xs font-mono text-[var(--xuli-text-secondary)] hover:text-[var(--xuli-accent)] transition-colors"
                          title="上一篇（← 或 ↑）"
                        >
                          ← 上一篇
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedIndex((index) => (index + 1) % entries.length)}
                          className="paper-tag px-3 py-1.5 text-xs font-mono text-[var(--xuli-text-secondary)] hover:text-[var(--xuli-accent)] transition-colors"
                          title="下一篇（→ 或 ↓）"
                        >
                          下一篇 →
                        </button>
                      </div>
                    </div>
                    <h2 className="font-display text-2xl sm:text-3xl text-[var(--xuli-text-primary)] leading-tight">
                      {formatDate(current.date)}
                    </h2>
                    {current.timelineEvent ? (
                      <p className="mt-2 text-sm text-[var(--xuli-text-secondary)]">{current.timelineEvent}</p>
                    ) : null}
                  </header>
                  <JournalArticle entry={current} />
                </article>
              </div>
            </>
          ) : null}

          <div className="paper-note bg-[var(--color-card)]/70 p-4">
            <p className="text-[var(--xuli-text-secondary)] text-sm text-center font-body leading-relaxed">
              数据来自 GitHub 上的 <code className="font-mono text-[var(--xuli-accent)]">{vibeDataManifest.source.repository}</code>。
              每次源仓库更新后按精确 commit SHA 校验、脱敏并生成公开 JSON；浏览器不接触私有仓库凭据，也不再依赖本机 Markdown 仓库。
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
