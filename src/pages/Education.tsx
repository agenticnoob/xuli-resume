import PageHeader from '../components/PageHeader'

const education = {
  school: '宁波财经学院',
  degree: '本科',
  major: '软件工程',
  period: '2014 - 2018',
  description: '系统学习数据结构、算法、操作系统、计算机网络、数据库与软件工程，建立计算机基础与工程思维。',
  awards: ['三等奖学金'],
}

const certificates = [
  { name: '软件设计师', issuer: '中华人民共和国人力资源和社会保障部', year: '2016' },
  { name: '浙江省三级数据库', issuer: '浙江省教育厅', year: '2015' },
  { name: '浙江省二级 C 语言', issuer: '浙江省教育厅', year: '2015' },
]

const military = {
  period: '2012.12 - 2014.12',
  unit: '解放军警卫班',
  description: '参军入伍，培养执行力、责任意识与团队协作习惯。',
}

const openSourceContributions = [
  {
    project: 'Alibaba x-render',
    description: '参与动态表单组件与问题修复',
    link: 'https://github.com/alibaba/x-render/commits?author=hsuliss',
  },
  {
    project: 'JD NutUI React / Taro',
    description: '参与多端组件生态建设',
    link: 'https://github.com/jdf2e/nutui-react/commits?author=Skedush',
  },
]

export default function Education() {
  return (
    <div className="min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageHeader title="教育" subtitle="计算机基础、专业证书与持续的开源实践" highlightWord="经历" />

        <div className="space-y-6 mb-16">
          <div className="sketch-card bg-[var(--xuli-bg-tertiary)] p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="sketch-icon w-16 h-16 bg-[var(--xuli-bg-secondary)] flex items-center justify-center">
                <svg className="w-8 h-8 text-[var(--xuli-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                </svg>
              </div>
              <div>
                <h2 className="font-display text-2xl text-[var(--xuli-text-primary)]">{education.school}</h2>
                <p className="text-[var(--xuli-accent)]">{education.degree} · {education.major}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="paper-tag px-3 py-1 text-[var(--xuli-accent)] text-sm font-mono">
                  {education.period}
                </span>
                <span className="px-2 py-1 bg-[var(--xuli-accent-muted)] text-[var(--xuli-accent)] text-xs rounded">
                  {education.awards[0]}
                </span>
              </div>
              <p className="text-[var(--xuli-text-tertiary)] leading-relaxed">{education.description}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--color-border)]/60">
              <h3 className="text-[var(--xuli-text-primary)] font-semibold mb-3">主修课程</h3>
              <div className="flex flex-wrap gap-2">
                {['数据结构', '算法设计', '操作系统', '计算机网络', '数据库原理', '软件工程', '面向对象编程'].map((course) => (
                  <span key={course} className="paper-chip px-3 py-1 text-[var(--xuli-text-tertiary)] text-sm">
                    {course}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="sketch-card bg-[var(--xuli-bg-tertiary)] p-6">
            <h3 className="font-display text-xl text-[var(--xuli-text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--xuli-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
              专业证书
            </h3>
            <div className="space-y-3">
              {certificates.map((cert, i) => (
                <div key={i} className="paper-note bg-[var(--xuli-bg-secondary)] p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[var(--xuli-text-primary)] font-medium text-sm">{cert.name}</span>
                    <span className="text-[var(--xuli-text-tertiary)] text-xs">{cert.year}</span>
                  </div>
                  <p className="text-[var(--xuli-text-tertiary)] text-xs">{cert.issuer}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="sketch-card bg-[var(--xuli-bg-tertiary)] p-6">
            <h3 className="font-display text-xl text-[var(--xuli-text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--xuli-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              开源贡献
            </h3>
            <div className="space-y-3">
              {openSourceContributions.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-note block bg-[var(--xuli-bg-secondary)] p-3 hover:bg-[var(--xuli-bg-tertiary)] transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[var(--xuli-text-primary)] font-medium text-sm">{item.project}</span>
                    <svg className="w-4 h-4 text-[var(--xuli-text-tertiary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </div>
                  <p className="text-[var(--xuli-text-tertiary)] text-xs">{item.description}</p>
                </a>
              ))}
            </div>
          </div>

          <div className="sketch-card bg-[var(--xuli-bg-tertiary)] p-6">
            <h3 className="font-display text-xl text-[var(--xuli-text-primary)] mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-[var(--xuli-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              其他经历
            </h3>
            <div className="paper-note bg-[var(--xuli-bg-secondary)] p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[var(--xuli-text-primary)] font-medium">{military.unit}</span>
                <span className="text-[var(--xuli-text-tertiary)] text-xs">{military.period}</span>
              </div>
              <p className="text-[var(--xuli-text-tertiary)] text-sm">{military.description}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
