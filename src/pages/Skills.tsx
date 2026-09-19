import { useDeferredValue, useMemo, useState } from 'react'
import PageHeader from '../components/PageHeader'
import PageTransition from '../components/PageTransition'
import { practiceAreas } from '../data/resume'
import {
  formatSourceTimestamp,
  loadSkillsSnapshot,
  useVibeSnapshot,
  vibeDataManifest,
  type PipelineSkill,
} from '../lib/vibeData'

interface SkillGroupDefinition {
  id: string
  title: string
  icon: string
  matches: (category: string) => boolean
}

interface SkillGroup extends SkillGroupDefinition {
  skills: PipelineSkill[]
}

const ICONS = {
  ai: 'M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5m9.25-11.396v5.714c0 .597.237 1.17.659 1.591L19 14.5M5 14.5v2.25a2.25 2.25 0 002.25 2.25h9.5A2.25 2.25 0 0019 16.75V14.5M5 14.5h14',
  code: 'M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5',
  build: 'M11.42 15.17l-5.21 3.01A2.25 2.25 0 013 16.23V7.77a2.25 2.25 0 013.21-1.95l5.21 3.01m0 6.34l5.21 3.01A2.25 2.25 0 0020 16.23V7.77a2.25 2.25 0 00-3.37-1.95l-5.21 3.01m0 6.34V8.83',
  infra: 'M4.5 12a7.5 7.5 0 0115 0m-15 0a7.5 7.5 0 0015 0m-15 0h15M12 4.5c1.657 0 3 3.358 3 7.5s-1.343 7.5-3 7.5-3-3.358-3-7.5 1.343-7.5 3-7.5z',
  data: 'M4.5 6.75C4.5 5.507 7.858 4.5 12 4.5s7.5 1.007 7.5 2.25S16.142 9 12 9 4.5 7.993 4.5 6.75zm0 0v5.25c0 1.243 3.358 2.25 7.5 2.25s7.5-1.007 7.5-2.25V6.75m-15 5.25v5.25c0 1.243 3.358 2.25 7.5 2.25s7.5-1.007 7.5-2.25V12',
  workflow: 'M3.75 6h16.5M3.75 12h16.5m-16.5 6h16.5',
  other: 'M9.568 3.057c.315-1.19 2.005-1.19 2.32 0a1.2 1.2 0 001.79.743c1.064-.619 2.259.576 1.64 1.64a1.2 1.2 0 00.743 1.79c1.19.315 1.19 2.005 0 2.32a1.2 1.2 0 00-.743 1.79c.619 1.064-.576 2.259-1.64 1.64a1.2 1.2 0 00-1.79.743c-.315 1.19-2.005 1.19-2.32 0a1.2 1.2 0 00-1.79-.743c-1.064.619-2.259-.576-1.64-1.64a1.2 1.2 0 00-.743-1.79c-1.19-.315-1.19-2.005 0-2.32a1.2 1.2 0 00.743-1.79c-.619-1.064.576-2.259 1.64-1.64a1.2 1.2 0 001.79-.743z',
} as const

const GROUPS: SkillGroupDefinition[] = [
  {
    id: 'ai-agent',
    title: 'AI 与 Agent',
    icon: ICONS.ai,
    matches: (category) => /ai|agent|coding agent/iu.test(category),
  },
  {
    id: 'development',
    title: '语言、框架与创作',
    icon: ICONS.code,
    matches: (category) => /language|framework|library|frontend|css|webgl|creative/iu.test(category),
  },
  {
    id: 'build-quality',
    title: '构建与质量',
    icon: ICONS.build,
    matches: (category) => /build|package|test|lint|toolchain|format/iu.test(category),
  },
  {
    id: 'infrastructure',
    title: '基础设施与运行环境',
    icon: ICONS.infra,
    matches: (category) => /cloud|container|infrastructure|system|runtime|os|server/iu.test(category),
  },
  {
    id: 'data-protocol',
    title: '数据、接口与协议',
    icon: ICONS.data,
    matches: (category) => /database|api|protocol|vcs/iu.test(category),
  },
  {
    id: 'workflow-platform',
    title: '工作流与平台',
    icon: ICONS.workflow,
    matches: (category) => /workflow|automation|platform|note-taking/iu.test(category),
  },
]

const OTHER_GROUP: SkillGroupDefinition = {
  id: 'tools-other',
  title: '工具与其他实践',
  icon: ICONS.other,
  matches: () => true,
}

function groupSkills(skills: PipelineSkill[]): SkillGroup[] {
  const grouped = new Map(GROUPS.map((group) => [group.id, { ...group, skills: [] as PipelineSkill[] }]))
  const other = { ...OTHER_GROUP, skills: [] as PipelineSkill[] }
  for (const skill of skills) {
    const definition = GROUPS.find((group) => group.matches(skill.category))
    if (definition) grouped.get(definition.id)?.skills.push(skill)
    else other.skills.push(skill)
  }
  return [...grouped.values(), other]
    .map((group) => ({
      ...group,
      skills: [...group.skills].sort(
        (a, b) => b.totalCount - a.totalCount || a.name.localeCompare(b.name),
      ),
    }))
    .filter((group) => group.skills.length > 0)
}

function SkillRow({ skill, maxCount }: { skill: PipelineSkill; maxCount: number }) {
  const width = Math.max(4, (Math.log1p(skill.totalCount) / Math.log1p(maxCount)) * 100)
  return (
    <div className="py-2 border-b border-[var(--color-border)]/30 last:border-b-0">
      <div className="flex justify-between gap-3 mb-1">
        <span className="text-secondary text-sm font-medium min-w-0 break-words">{skill.name}</span>
        <span className="text-tertiary text-xs font-mono whitespace-nowrap">
          {skill.totalCount} 次 / {skill.dayCount} 天
        </span>
      </div>
      <div className="skill-track h-1.5 bg-surface overflow-hidden" aria-hidden="true">
        <div className="skill-fill h-full bg-accent" style={{ width: `${width}%` }} />
      </div>
      <div className="flex justify-between gap-2 mt-1 text-[10px] text-tertiary font-mono">
        <span>{skill.category}</span>
        <span>{skill.firstSeen} → {skill.lastSeen}</span>
      </div>
    </div>
  )
}

function CategoryCard({ group }: { group: SkillGroup }) {
  const maxCount = group.skills[0]?.totalCount || 1
  return (
    <article className="sketch-card skill-data-card bg-card p-4 flex flex-col h-full">
      <div className="flex items-center justify-between gap-3 mb-3 flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="sketch-icon w-9 h-9 bg-surface flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={group.icon} />
            </svg>
          </div>
          <h2 className="font-display text-base text-primary leading-tight">{group.title}</h2>
        </div>
        <span className="paper-tag px-2 py-1 text-[10px] font-mono text-tertiary">{group.skills.length}</span>
      </div>
      <div className="space-y-0 flex-1 min-h-0 max-h-[28rem] overflow-y-auto pr-1">
        {group.skills.map((skill) => (
          <SkillRow key={skill.id} skill={skill} maxCount={maxCount} />
        ))}
      </div>
    </article>
  )
}

function StatusCard({ message }: { message: string }) {
  return (
    <div className="sketch-card bg-card p-8 text-center" role="status">
      <p className="text-tertiary text-sm">{message}</p>
    </div>
  )
}

export default function Skills() {
  const { data, error, loading } = useVibeSnapshot(loadSkillsSnapshot)
  const [query, setQuery] = useState('')
  const [activeGroup, setActiveGroup] = useState('all')
  const deferredQuery = useDeferredValue(query.trim().toLocaleLowerCase())

  const allGroups = useMemo(() => groupSkills(data?.skills ?? []), [data?.skills])
  const visibleGroups = useMemo(() => {
    return allGroups
      .filter((group) => activeGroup === 'all' || group.id === activeGroup)
      .map((group) => ({
        ...group,
        skills: group.skills.filter((skill) => {
          if (!deferredQuery) return true
          return `${skill.name} ${skill.category}`.toLocaleLowerCase().includes(deferredQuery)
        }),
      }))
      .filter((group) => group.skills.length > 0)
  }, [activeGroup, allGroups, deferredQuery])

  const summary = useMemo(() => {
    const skills = data?.skills ?? []
    let totalCount = 0
    let latestDate = ''
    const categories = new Set<string>()
    for (const skill of skills) {
      totalCount += skill.totalCount
      categories.add(skill.category)
      if (skill.lastSeen > latestDate) latestDate = skill.lastSeen
    }
    return { totalCount, latestDate, categoryCount: categories.size }
  }, [data?.skills])

  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <PageHeader
            title="技术"
            subtitle="从线上工程日志聚合实际使用次数、覆盖天数与最近实践时间"
            highlightWord="实践"
          />

          <div className="paper-note bg-card p-4 mb-6">
            <p className="text-secondary text-xs text-center font-medium leading-relaxed">
              下方不是主观“掌握度”。数据由 <code className="font-mono text-accent">vibe-journal-pipeline</code> 全量日志确定性聚合；条形长度仅用于同组内比较使用频次。
            </p>
          </div>

          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {practiceAreas.map((area) => (
              <article key={area.title} className="sketch-card bg-card p-5">
                <h2 className="font-display text-lg text-primary mb-2">{area.title}</h2>
                <p className="text-accent text-sm mb-3 leading-relaxed">{area.tools}</p>
                <p className="text-tertiary text-sm leading-relaxed">{area.boundary}</p>
              </article>
            ))}
          </section>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            {[
              ['技能记录', `${data?.skills.length ?? vibeDataManifest.skills.skillCount}`],
              ['原始分类', `${summary.categoryCount}`],
              ['累计使用', `${summary.totalCount}`],
              ['最近实践', summary.latestDate || vibeDataManifest.journal.latestDate],
            ].map(([label, value]) => (
              <div key={label} className="paper-note bg-card p-3 text-center">
                <div className="font-display text-xl text-primary">{value}</div>
                <div className="text-[10px] font-mono text-tertiary mt-1">{label}</div>
              </div>
            ))}
          </div>

          <div className="sketch-card bg-card p-4 mb-6">
            <label htmlFor="skill-search" className="block text-xs font-mono text-tertiary mb-2">
              检索全部技能记录
            </label>
            <input
              id="skill-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="输入技能或分类，例如 TypeScript、cloud、agent"
              className="w-full bg-surface border border-[var(--color-border)] rounded-md px-3 py-2 text-sm text-primary placeholder:text-tertiary focus:outline-none focus:ring-2 focus:ring-[var(--xuli-accent-muted)]"
            />
            <div className="flex flex-wrap gap-2 mt-3" aria-label="技能分组筛选">
              <button
                type="button"
                onClick={() => setActiveGroup('all')}
                className={`paper-tag px-3 py-1.5 text-xs ${activeGroup === 'all' ? 'text-accent bg-[var(--xuli-accent-muted)]' : 'text-secondary'}`}
              >
                全部
              </button>
              {allGroups.map((group) => (
                <button
                  type="button"
                  key={group.id}
                  onClick={() => setActiveGroup(group.id)}
                  className={`paper-tag px-3 py-1.5 text-xs ${activeGroup === group.id ? 'text-accent bg-[var(--xuli-accent-muted)]' : 'text-secondary'}`}
                >
                  {group.title} · {group.skills.length}
                </button>
              ))}
            </div>
          </div>

          {loading ? <StatusCard message="正在加载线上技能统计…" /> : null}
          {error ? <StatusCard message={`技能数据暂时无法加载：${error}`} /> : null}
          {!loading && !error && visibleGroups.length === 0 ? (
            <StatusCard message="没有匹配的技能记录。" />
          ) : null}

          {visibleGroups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
              {visibleGroups.map((group) => (
                <CategoryCard key={group.id} group={group} />
              ))}
            </div>
          ) : null}

          <div className="paper-note bg-card p-4 mt-8 text-center">
            <p className="text-tertiary text-xs font-mono leading-relaxed">
              source {vibeDataManifest.source.revision.slice(0, 12)} · 更新于 {formatSourceTimestamp(vibeDataManifest.source.generatedAt)} · 共 {vibeDataManifest.skills.skillCount} 项
            </p>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
