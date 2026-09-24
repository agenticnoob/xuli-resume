import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { profile, projects } from '../data/resume'

const focusWords = ['前端工程', 'Agent 协作', 'Python', '全栈实践', '可靠交付']

export default function Home() {
  return (
    <div className="min-h-screen flex items-start justify-center px-4 pt-24 pb-20 sm:pt-28 sm:pb-24">
      <div className="home-layout-notebook relative z-10 w-full mx-auto">
        <motion.div
          initial={{ opacity: 0, rotate: -8 }}
          animate={{ opacity: 1, rotate: -3 }}
          transition={{ duration: 0.6 }}
          className="home-hero-symbol"
          aria-hidden="true"
        >
          <span>工作手记</span>
          <svg viewBox="0 0 160 42" fill="none">
            <path d="M4 27c35 11 88 9 150-12M7 32c43 7 96 3 145-12" />
          </svg>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-[var(--xuli-text-primary)] home-title"
        >
          AI 应用构建者
          <br />
          <span className="text-[var(--xuli-accent)]">全栈工程师</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10 home-hero-intro"
        >
          <p className="text-lg sm:text-xl text-[var(--xuli-text-secondary)] font-body max-w-3xl leading-relaxed">
            {profile.summary}
          </p>
          <span className="paper-tag mt-4 inline-flex items-center gap-2 px-4 py-1.5 text-[var(--xuli-text-secondary)] text-sm font-mono">
            <span className="status-mark" aria-hidden="true">✓</span>
            {profile.status}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-4 mb-16 home-actions"
        >
          <Link to="/projects" className="btn btn-primary">
            查看代表项目
          </Link>
          <Link to="/about" className="btn btn-outline">
            了解我的方法
          </Link>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, x: 24, rotate: 1.5 }}
          animate={{ opacity: 1, x: 0, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="home-illustration"
        >
          <img
            src="/illustrations/hero-workbench.webp"
            alt="从问题草稿、协作分工、代码实现到检查和交付的手绘工程工作台"
            width="1200"
            height="900"
          />
          <figcaption>把想法放上工作台，一步步做成可检查的结果</figcaption>
        </motion.figure>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="max-w-lg home-ai-card"
        >
          <Link
            to="/ai-philosophy"
            className="sketch-card block bg-[var(--xuli-bg-tertiary)] p-6 text-left"
          >
            <span className="eyebrow-note">工作方法</span>
            <h2 className="text-[var(--xuli-text-primary)] font-display text-xl mt-2 mb-3">
              先定义问题，再组织 AI 完成交付
            </h2>
            <p className="text-[var(--xuli-text-secondary)] text-sm leading-relaxed">
              我关注的不只是工具熟练度，而是如何检索方案、明确边界、组织 Agent、检查状态，并对接口、数据、验证与最终结果负责。
            </p>
            <span className="mt-4 inline-flex text-[var(--xuli-accent)] text-sm">阅读我的 AI 思考 →</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="max-w-lg mt-8 home-log-card"
        >
          <Link
            to="/projects"
            className="sketch-card block bg-[var(--xuli-bg-tertiary)] p-6 text-left"
          >
            <span className="eyebrow-note">代表作品</span>
            <h2 className="text-[var(--xuli-text-primary)] font-display text-xl mt-2 mb-4">从想法到可检查的作品</h2>
            <div className="space-y-3">
              {projects.slice(0, 3).map((project) => (
                <div key={project.name} className="flex items-baseline justify-between gap-4">
                  <span className="text-[var(--xuli-text-secondary)] text-sm">{project.name}</span>
                  <span className="text-[var(--xuli-text-tertiary)] text-xs text-right">{project.subtitle}</span>
                </div>
              ))}
            </div>
            <span className="mt-5 inline-flex text-[var(--xuli-accent)] text-sm">查看 7 个代表项目 →</span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4 text-sm font-mono mt-12 home-tag-cloud"
        >
          {focusWords.map((word) => (
            <span key={word} className="paper-chip text-[var(--xuli-text-secondary)]">
              {word}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
