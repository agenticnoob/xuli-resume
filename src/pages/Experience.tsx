import PageHeader from '../components/PageHeader'
import { workExperiences } from '../data/resume'

export default function Experience() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageHeader title="工作" subtitle="从技术支持、前端工程，到团队负责与远程协作" highlightWord="经历" />

        <div className="space-y-8">
          {workExperiences.map((exp) => (
            <div
              key={`${exp.company}-${exp.period}`}
              className="timeline-sketch relative pl-8 border-l-2 border-dashed border-[var(--color-border)]/55"
            >
              <div className="timeline-pin absolute left-0 top-0 -translate-x-1/2" aria-hidden="true">×</div>

              <div className="sketch-card bg-[var(--xuli-bg-tertiary)] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="paper-tag px-2 py-0.5 text-[var(--xuli-accent)] text-xs font-mono">
                    {exp.type}
                  </span>
                  <span className="text-[var(--xuli-text-tertiary)] text-sm">{exp.period}</span>
                </div>
                <h3 className="font-display text-xl text-[var(--xuli-text-primary)] mb-1">{exp.position}</h3>
                <p className="text-[var(--xuli-text-secondary)] text-sm mb-3">{exp.company}</p>
                <p className="text-[var(--xuli-text-tertiary)] text-sm mb-4 leading-relaxed">{exp.description}</p>
                <div className="flex flex-wrap gap-2">
                  {exp.highlights.map((highlight) => (
                    <span key={highlight} className="paper-chip px-2 py-1 text-[var(--xuli-text-secondary)] text-xs">
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
