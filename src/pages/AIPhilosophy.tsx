import PageHeader from '../components/PageHeader'

const questions = [
  {
    title: 'AI 会如何改变工作与能力的定义？',
    description: '当实现速度持续提升，岗位分工、软件形态乃至问题本身的前提都会变化。提出值得解决的问题、组织资源和判断结果，是越来越需要主动练习的能力。',
  },
  {
    title: '当 Agent 成为操作者，产品应该怎样设计？',
    description: '稳定接口、明确权限、可观察状态、可检查产物与失败恢复路径，会比只为人类界面优化更重要；经验也需要沉淀为 Skill、工作流和可复用工具。',
  },
  {
    title: '更强的自动化如何保持可靠？',
    description: '递归改进、认知与语言、人的判断和责任都是开放问题。具体工作仍要回到来源、代码、测试和实际行为中验证。',
  },
]

const discoverySteps = [
  {
    title: '从问题出发检索',
    description: '结合项目需求、AI 讨论、官方文档与开源社区寻找候选方案，用 GitHub Stars 与个人 Wiki 保存研究线索。',
  },
  {
    title: '理解用途与边界',
    description: '先弄清工具解决什么问题、适合工作流的哪一段，再比较 Release、活跃度、许可证、运行条件与使用成本。',
  },
  {
    title: '用小实验做取舍',
    description: '通过安装、连接、生成或最小任务观察实际效果和失败点；不合适时及时换方案，只把有效部分接入真实项目。',
  },
  {
    title: '留下可复用记录',
    description: '把讨论、检索和开发过程整理为 Wiki、日志、工作流说明与项目文档，并在版本变化时重新核对。',
  },
]

export default function AIPhilosophy() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute top-24 right-[8%] text-[14rem] leading-none text-[var(--xuli-accent)]/[0.045] font-display pointer-events-none -rotate-6" aria-hidden="true">
        思
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        <PageHeader title="AI" subtitle="理解变化、定义问题，并对 AI 协作的结果负责" highlightWord="思考" />

        <div className="paper-note bg-[var(--xuli-bg-tertiary)] p-4 mb-12">
          <p className="text-[var(--xuli-text-secondary)] text-sm text-center font-medium leading-relaxed">
            以下内容来自个人实践、持续讨论与阶段性理解，涉及仍在演化的领域；它们是工作假设，不是权威结论。
          </p>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-8 mb-16">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="eyebrow-note">能力与责任</span>
            <h2 className="font-display text-3xl sm:text-4xl text-[var(--xuli-text-primary)] mt-3 mb-5 leading-tight">
              能力不只是“会什么”，还包括如何找到路径与承担结果
            </h2>
          </div>
          <div className="space-y-5 text-[var(--xuli-text-secondary)] leading-relaxed text-base sm:text-lg">
            <p>
              我认为，AI 时代需要重新定义个人能力的体现方式，简历也应该随之改变。比起罗列更多工具，我更愿意展示自己提出的问题、发现和筛选工具的方法、组织 AI 完成任务的过程，以及可以检查的作品。
            </p>
            <p>
              许多工具最初我也不了解，是通过网站、开源社区、AI 检索与持续交流，围绕自己的想法逐步发现、试用和组合起来的。从前端开发出发，我把实践扩展到 Agent 工作流、数据处理、视觉推理、视频生产、后端服务和部署运维。
            </p>
            <p>
              当前好用的工具可能很快被新方案替代。因此，选型需要随任务、版本和实际效果持续更新；人仍需负责目标、授权、判断与最终验收。
            </p>
          </div>
        </section>

        <section className="mb-16">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <span className="eyebrow-note">持续追问</span>
              <h2 className="font-display text-2xl sm:text-3xl text-[var(--xuli-text-primary)] mt-2">我持续关注的三个问题</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {questions.map((question, index) => (
              <article key={question.title} className="sketch-card bg-[var(--xuli-bg-tertiary)] p-6">
                <span className="sketch-number">0{index + 1}</span>
                <h3 className="font-display text-xl text-[var(--xuli-text-primary)] mt-4 mb-4 leading-snug">{question.title}</h3>
                <p className="text-[var(--xuli-text-tertiary)] text-sm leading-relaxed">{question.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sketch-card bg-[var(--xuli-bg-tertiary)] p-6 sm:p-10 mb-16">
          <span className="eyebrow-note">工具发现路径</span>
          <h2 className="font-display text-2xl sm:text-3xl text-[var(--xuli-text-primary)] mt-2 mb-8">我如何发现、选择和更新工具</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
            {discoverySteps.map((step, index) => (
              <div key={step.title} className="flex gap-4">
                <span className="sketch-number flex-shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-[var(--xuli-text-primary)] font-semibold mb-2">{step.title}</h3>
                  <p className="text-[var(--xuli-text-tertiary)] text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="quote-sketch text-center max-w-3xl mx-auto">
          <blockquote className="font-display text-xl sm:text-2xl text-[var(--xuli-text-secondary)] leading-relaxed">
            “AI 可以越来越擅长如何做到；人仍需要判断为什么做、做到什么程度，以及谁为结果负责。”
          </blockquote>
          <a href="https://blog.zzzxc.com" target="_blank" rel="noopener noreferrer" className="mt-8 inline-flex btn btn-outline">
            阅读更多个人思考 ↗
          </a>
        </section>
      </div>
    </div>
  )
}
