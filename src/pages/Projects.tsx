import PageTransition from '../components/PageTransition'
import PageHeader from '../components/PageHeader'
import { projects } from '../data/resume'

export default function Projects() {
  return (
    <PageTransition>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <PageHeader title="代表" subtitle="以真实项目呈现任务组织、全栈建模、视觉推理与工程交付" highlightWord="项目" />

          <div className="illustrated-intro mb-12">
            <div className="paper-note bg-[var(--xuli-bg-tertiary)] p-5">
              <span className="eyebrow-note">作品蓝图</span>
              <p className="text-[var(--xuli-text-secondary)] text-sm leading-relaxed mt-3">
                AI 参与实现、重构、测试与文档整理；我负责目标、约束、方案取舍与最终验收。每个项目都明确当前阶段和验证边界。
              </p>
            </div>
            <figure className="spot-illustration spot-illustration-projects">
              <img
                src="/illustrations/projects-blueprint.webp"
                alt="桌面工作区、社区平台、视频时间线和数据管线组成的手绘项目蓝图墙"
                width="1080"
                height="720"
                loading="lazy"
              />
              <figcaption>不同形态的项目，沿着同一条交付路径展开</figcaption>
            </figure>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project, index) => (
              <article
                key={project.github?.repositoryId ?? project.name}
                className={`sketch-card bg-[var(--xuli-bg-tertiary)] overflow-hidden flex flex-col ${index < 2 ? 'lg:min-h-[430px]' : ''}`}
              >
                <div className="p-6 sm:p-7 flex flex-col h-full">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <span className="sketch-number">0{index + 1}</span>
                    <span className="paper-tag px-3 py-1 text-[var(--xuli-text-tertiary)] text-xs text-right">
                      {project.stage}
                    </span>
                  </div>

                  <p className="text-[var(--xuli-accent)] text-sm mb-1">{project.subtitle}</p>
                  <h2 className="font-display text-2xl text-[var(--xuli-text-primary)] mb-3">{project.name}</h2>
                  <p className="text-[var(--xuli-text-secondary)] text-xs font-mono mb-4">{project.role}</p>
                  <p className="text-[var(--xuli-text-tertiary)] text-sm mb-5 leading-relaxed">{project.description}</p>

                  <ul className="space-y-2 mb-5">
                    {project.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-start gap-2 text-[var(--xuli-text-secondary)] text-sm">
                        <span className="text-[var(--xuli-accent)] mt-0.5" aria-hidden="true">·</span>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.tech.map((tech) => (
                      <span key={tech} className="paper-chip px-2 py-1 text-[var(--xuli-text-tertiary)] text-xs font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.links.length > 0 ? (
                    <div className="flex flex-wrap gap-4 mt-auto pt-4 border-t border-[var(--xuli-border)]/70">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[var(--xuli-accent)] text-sm hover:underline"
                        >
                          {link.label} ↗
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-auto pt-4 border-t border-[var(--xuli-border)]/70 text-[var(--xuli-text-tertiary)] text-xs">
                      本地学习项目，暂未公开演示
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
