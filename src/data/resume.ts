import projectCatalog from './projects.json'

export const projects = projectCatalog.projects

export const profile = {
  name: 'AXMORF',
  title: 'AI 应用构建者 / 全栈工程师',
  summary: '8 年软件行业经验 · 问题定义与信息检索 · Agent 协作与自动化 · 端到端工程交付',
  status: '寻找全职机会',
  location: '中国',
  phone: '158****8755',
  email: 'L****@gmail.com',
  directions: ['AI 应用开发工程师', 'Agent 应用工程师', 'AI 方向全栈工程师'],
}

export const profileLinks = [
  { label: '个人主页', value: 'zzzxc.com', href: 'https://zzzxc.com' },
  { label: 'GitHub', value: 'agenticnoob', href: 'https://github.com/agenticnoob' },
  { label: '个人博客', value: 'blog.zzzxc.com', href: 'https://blog.zzzxc.com' },
  { label: '抖音', value: 'AXMORF · Cognition_hub', href: 'https://www.douyin.com/user/MS4wLjABAAAATcqt2Tq3UxNiJz8Qg5eEHhOkdpfNuEP1KuthHYn-oIycjaF24_KxkL9pY8bgbW3Z' },
  { label: '小红书', value: 'AXMORF · Cognition_hub', href: 'https://www.xiaohongshu.com/user/profile/651c334600000000240144aa' },
  { label: '哔哩哔哩', value: 'UID 269573670', href: 'https://space.bilibili.com/269573670' },
  { label: '力扣', value: 'skedush', href: 'https://leetcode.cn/u/skedush/' },
]

export const capabilityHighlights = [
  {
    title: '问题定义与方案判断',
    description: '先说明目标、背景与约束，再检索当前实践、比较候选路径，并在来源、代码和实际结果中验证判断。',
  },
  {
    title: 'Agent 协作与自动化',
    description: '通过独立身份、工作区、Skill、项目规则和可观察状态，让 Agent 在明确边界内执行并留下可检查结果。',
  },
  {
    title: '全栈工程交付',
    description: '从前端扩展到后端、数据库、媒体、视觉推理与部署运维，按项目需要理解接口、数据、状态与恢复路径。',
  },
  {
    title: '文档与质量治理',
    description: '让文档与代码共同演进，以类型检查、测试、构建、浏览器操作和交付证据约束实现质量。',
  },
]

export const workExperiences = [
  {
    company: '浙江芝立软件有限公司',
    position: '远程兼职开发',
    period: '2025.09 — 2026.04',
    type: '兼职',
    description: '全职离职后，因公司前端人力不足，继续以远程兼职方式协助开发，支持既有业务项目迭代。',
    highlights: ['远程协作', '既有系统迭代', '业务连续性支持'],
  },
  {
    company: '浙江芝立软件有限公司',
    position: '前端负责人',
    period: '2022.07 — 2025.08',
    type: '全职',
    description: '负责团队技术选型、架构设计、任务协作、代码质量与项目交付，参与成员培养及跨角色沟通。',
    highlights: ['低代码平台前端架构', 'React / x-render 动态表单', '审批与任务指派', '团队协作与质量治理'],
  },
  {
    company: '上海盛璨软件科技有限公司',
    position: '前端软件开发工程师',
    period: '2021.08 — 2022.06',
    type: '全职',
    description: '参与政企软件项目的架构设计、业务功能开发、接口联调和可视化展示，配合后端及业务团队完成交付。',
    highlights: ['政企软件交付', '业务功能开发', '接口联调', '数据可视化'],
  },
  {
    company: '浙江立地信息科技有限公司',
    position: 'Web 前端工程师',
    period: '2019.03 — 2021.08',
    type: '全职',
    description: '参与政企业务系统开发与维护，推进组件化与工程化；基于 GitLab CI、Docker 及代码检查工具搭建自动化构建与部署流程。',
    highlights: ['组件化与工程化', 'GitLab CI', 'Docker', '自动化构建与部署'],
  },
  {
    company: '杭州优户通科技有限公司',
    position: 'IT 技术支持',
    period: '2018.08 — 2019.01',
    type: '全职',
    description: '负责内部系统维护、用户支持与技术故障排查。',
    highlights: ['系统维护', '用户支持', '故障排查'],
  },
]

export const practiceAreas = [
  {
    title: '思考与研究',
    tools: 'ChatGPT、GitHub、OSSInsight、个人 Wiki',
    boundary: '用于问题讨论、资料检索、开源项目发现和知识整理；保留来源与待验证问题。',
  },
  {
    title: '编码与 Agent',
    tools: 'Codex、Hermes、OpenCode、Claude Code、Qoder、DeepSeek Harness',
    boundary: 'Codex / Hermes 有持续项目实践；其他工具按任务试用，重点比较模型、上下文、工具调用和完成质量。',
  },
  {
    title: '连接与自动化',
    tools: 'Ego Lite、MCP、Skills、Playwright、Puppeteer',
    boundary: '当前以 Ego Lite 作为 Mac 日常 Agent 浏览器自动化主路径，其他方案作为实验与能力比较。',
  },
  {
    title: '全栈与部署',
    tools: 'TypeScript、NestJS、Python、FastAPI、PostgreSQL、Docker、Cloudflare、Vercel',
    boundary: '已有后端、数据库、自托管与云端发布实践；依据项目阶段区分演示、测试与生产交付。',
  },
  {
    title: '媒体与视觉',
    tools: 'Remotion、FFmpeg、Blender MCP、腾讯混元图生 3D、YOLO OBB、WebGL',
    boundary: '覆盖视频工作流、3D 素材试验、计算机视觉测量与空间视觉运行时。',
  },
  {
    title: '数据与知识',
    tools: 'LLM Wiki、SQLite、JSON / JSONL、ChromaDB、Embedding API',
    boundary: '分别用于知识组织、会话数据处理和 RAG 原型，熟悉程度以实际项目证据为准。',
  },
]

export const engineeringPrinciples = [
  {
    title: '先拓宽判断，再确定做法',
    description: '不把最初设想直接当答案。先让 AI 检索当前实践、提出候选方案与遗漏，再结合来源、约束和实际条件作出选择。',
  },
  {
    title: '身份、环境与授权分离',
    description: '为 Agent 准备独立账号、macOS 用户与 Ubuntu 工作主机，减少个人资料、历史配置和无关上下文混用。',
  },
  {
    title: '稳定接口与可观察状态',
    description: '让 Agent 面向清楚的输入、权限、状态、产物和失败恢复路径工作，使过程可理解、结果可检查。',
  },
  {
    title: '文档与代码共同维护',
    description: '用 README、AGENTS.md、架构与状态文档分工记录当前事实；发生行为变化时，同步实现、合同、测试和说明。',
  },
  {
    title: '验证结果，而非宣称完成',
    description: '重要改动通过类型检查、测试、构建、浏览器操作或交付校验确认，并明确已实现、已验证、已发布之间的区别。',
  },
]

export const supportingCapabilities = [
  { name: 'CodeGraph', purpose: '按符号检索源码、调用关系与依赖，为理解实现和判断修改范围补充上下文。' },
  { name: 'Context7 / shadcn MCP', purpose: '按需检索库文档、代码示例和组件资料，并结合项目依赖版本核对用法。' },
  { name: 'Chrome DevTools MCP', purpose: '结合网络、控制台和性能记录诊断真实页面状态。' },
  { name: 'Skills / AGENTS.md', purpose: '把重复经验转成任务入口、参考资料、操作边界和验收条件。' },
  { name: 'React Doctor 与工程检查', purpose: '以代码审查、类型检查、测试和构建结果形成实现反馈。' },
  { name: 'LLM Wiki / my-agents-mcp', purpose: '将知识、任务模板、产物校验和协作说明整理为可调用接口。' },
]
