# PROJECT KNOWLEDGE BASE

**Updated:** 2026-09-20
**Project:** AXMORF 工程实践手账 (xuli-resume)

## OVERVIEW
React 18 + TypeScript 5 + Vite 5 简历网站，9 页面展示技术能力、AI 哲学、开发过程、vibe coding 日志。

**访问**: <https://resume.zzzxc.com>

## STRUCTURE
```
src/
├── App.tsx          # 路由 + AnimatePresence
├── main.tsx         # 入口 (BrowserRouter)
├── pages/           # 9 页面 (Home, About, Skills, Experience, Projects, Education, AIPhilosophy, DevelopmentLog, VibeJournal)
├── components/      # 6 个共享组件 (Navbar, Footer, Logo, PageHeader, PageTransition, BackgroundEffects)
├── lib/             # 工具库 (vibeJournalSync.ts — 下游同步层)
├── data/            # 简历、技能、同步状态与预渲染 HTML
└── styles/
    ├── tokens.css   # 工程手账设计 token
    └── index.css    # 全局样式、手绘组件与响应式规则
scripts/             # vibe-journal CLI runner
public/
├── favicon.svg      # 手绘文档 + 铅笔标志
└── illustrations/   # 首页、关于页、项目页、Vibe 日志页的透明 WebP 插画
```

## WHERE TO LOOK
| Task | Location |
|------|----------|
| 添加新页面 | `src/pages/` + `src/App.tsx` |
| 修改导航/页脚 | `src/components/Navbar.tsx`, `Footer.tsx` |
| 修改主题 token | `src/styles/tokens.css` |
| 修改手绘组件 / 响应式 CSS | `src/styles/index.css` |
| 修改页面插画 | `public/illustrations/` + 对应页面组件 |
| 页面头部统一 | `src/components/PageHeader.tsx` |
| 同步 vibe-coding-journal 上游 | `npm run sync:vibe-journal`（实现见 `src/lib/vibeJournalSync.ts`） |
| 修改技能面板 | `src/data/skills.json`（结构见 `src/data/skills-types.ts`） |

## CONVENTIONS
- **组件**: 大写驼峰 (`PageHeader.tsx`)
- **页面**: 大写驼峰 (`Home.tsx`)
- **样式**: Tailwind class，拼写错误会被忽略
- **动画**: Framer Motion + CSS GPU 加速
- **无 ESLint**: 项目无 lint 配置

## VISUAL SYSTEM

- 当前唯一主题是浅色“工程师工作手账”：灰绿绘图纸背景、石墨文字、工程蓝强调色、印章红与荧光笔黄。
- 标题使用 `LXGW WenKai`，正文使用 `Noto Sans SC`，代码与标签使用 `IBM Plex Mono`。
- 卡片、标签、时间线和背景线稿由 CSS 构成；首页、项目页与 Vibe 日志页使用项目专属的透明 WebP 插画，关于页使用透明手绘角色头像。
- 布局与主题保持稳定，不再使用随机 theme/layout、localStorage TTL 或“换一版”入口。
- 优先修改 `tokens.css` 和共享 sketch/paper 类，避免在单页硬编码新的颜色体系。
- 插画应保持低饱和墨线、水彩填色、透明背景；新增资源需压缩、提供准确 `alt`，并检查桌面与移动端溢出。

## PUBLIC IDENTITY AND PRIVACY

- 公开署名是 `AXMORF`；真实姓名不得出现在可见页面、SEO、打包产物或受管 Vibe Journal 快照中。
- 关于页头像权威资源是 `public/illustrations/profile-avatar.webp`；不得将真人照片放回 `public/`。
- `redactPublicContent()` 只作用于下游的浏览器可见元数据与 HTML 快照；不要用脱敏文本参与上游技能识别或计分。
- 修改公开身份时，同步检查 `index.html`、`src/data/resume.ts`、Navbar、Footer、README、`AGENTS.md`、`PROGRESS.md`、`个人简历.md` 与受管 Vibe Journal 产物。

## SKILL LEVEL MODEL

`src/data/skills.json` 中的技能等级由 `src/lib/vibeJournalSync.ts` 同步层维护。
三个常量（vibeJournalSync.ts:706–707 + 44）决定全部数值行为：

| 常量 | 值 | 含义 |
|------|----|----|
| `SKILL_BASE_LEVEL` | 30 | 任何新 skill 进入 skills.json 的**起始 level**（含 `auto-register` 路径与手工新增） |
| `SKILL_INCREMENT_AMOUNT` | 0.5 | 每命中一次上游 `skills_used[]` 条目对 level 的**累加 delta** |
| `MAX_SKILL_LEVEL` | 95 | level 软上限，超过则被 `clampLevel` 截断 |

### 写入路径

| 触发条件 | 路径 | level 终值 | 审计位置 |
|----------|------|-----------|----------|
| 上游 meta 声明的 `category_hint` 落 `skills.json`（policy=`auto-register`） | `autoRegisterSkill` | `30`（首次）+ 0.5/命中 | `vibe-journal-consumer-state.json#autoRegisteredSkills` |
| 上游 meta 声明的 `category_hint` 但 policy=`pending-review` | 不写 skills.json | — | `vibe-journal-consumer-state.json#pendingSkillCandidates` |
| 已注册 skill 命中上游 `skills_used[]` | `applySkillIncrements` | +0.5/次 | `vibe-journal-consumer-state.json#skillsIncrementLog` |
| fallback 模式（无 meta 走 prose alias scan） | `applySkillIncrements` | +0.5/匹配 | 同上 |

### 起步 30 的语义

`30` 不是"掌握度"，而是"识别度基线"——区分"registry 里有这条 skill"（≥30）
与"registry 里没有"（不存在）。普通 deliverable 贡献的 +0.5 累加上去
是"用得多不多"的指示。`MAX_SKILL_LEVEL=95` 防止长尾累积把 level 推到
100+（前端进度条 UI 假设 0–100 区间）。

### 修改时

- **不要**手工 `level:` 字段——下次 sync 跑会被覆盖
- **不要**改 `SKILL_BASE_LEVEL=30` 这条规则本身——它是 `auto-register`
  审计语义的一部分（PROGRESS.md:253–257）
- 改 `SKILL_INCREMENT_AMOUNT` 会同时影响 `auto-register` 之后的累加和
  fallback 路径——慎重

## CONSTRAINTS
- TypeScript: `noUnusedLocals=true`, `noUnusedParameters=true`
- 无 ESLint / 无测试
- 代码中无 DO NOT/NEVER 注释
- `src/lib/vibeJournalSync.ts` 是 server-side only（用 `fs`），**不要**在浏览器组件里 import
- `scripts/sync-vibe-journal.mjs` 通过 Node 24 `--experimental-strip-types` 直接运行 TS，**不要**用 tsx/ts-node 之类的依赖

## 下游消费侧（vibe-coding-journal）

### 数据源（只读）
- 上游内容：`/data/projects/repos/vibe-coding-journal/`
  - `deliverables/*.md` — 已总结的 markdown 文档
  - `TIMELINE.md` — 时间线（追加式）
  - `AGENTS.md` / `SUMMARY_MANIFEST.md` — 上游约束

### 同步入口
```bash
npm run sync:vibe-journal        # 实际写入
npm run sync:vibe-journal:dry    # 仅计算 diff，不写盘
```

未来统一 cron 直接调用 `scripts/sync-vibe-journal.mjs` 即可（不要重新实现同步逻辑）。

### 状态文件
- `src/data/vibe-journal-consumer-state.json` — sync 写入
  - `consumedDeliverables: string[]` — 已消费的 deliverable 文件名
  - `deliverableLineHashes: Record<file, string[]>` — 每个文件的已消费行 hash 快照（审计/可读）
  - `deliverableLineCursors: Record<file, number>` — 每个文件已消费到的 meaningful line 位置（增量判定主依据，可处理重复行追加）
  - `timelineLineHashes: string[]` — TIMELINE.md 已消费行 hash 快照
  - `timelineLineCursor: number` — TIMELINE.md 已消费到的 meaningful line 位置
  - `skillsIncrementLog: SkillsIncrementEntry[]` — 每次增量审计日志（最近 500 条）
  - `lastRun: ISO string | null` — 最近一次有变化的时间
  - `metadataHashes: Record<file, sha256>` — 每个 deliverable 最近一次有效 `.meta.json` 内容的 sha256；hash 不变则 metadata 不重放
  - `autoRegisteredSkills: AutoRegisteredSkillEntry[]` — 自动注册技能审计日志（最近 200 条）
  - `pendingSkillCandidates: PendingSkillCandidate[]` — 未知技能待 review 队列
  - `metadataParseErrors: Array<{file, error, timestamp}>` — meta 解析/校验错误日志（最近 50 条）
- `src/data/vibe-journal-meta.json` — sync 写入
  - 浏览器可读的轻量摘要：lastRun、新文档数、新行数、文档列表、近期增量
  - `lastRunMetadataFiles / lastRunMetadataParseErrors / lastRunFallbackDeliverables / lastRunAutoRegisteredSkills / pendingSkillCandidates` — 最近一次 metadata-first 同步的审计摘要
  - **不要**把它当成下游消费状态；真正的状态在 consumer-state.json
- `src/data/skills.json` — sync 写入
  - 每个被识别的 skill 按其 alias 归一化为 canonical id，命中后 +1，被 95 上限 clamp
  - 新技能按 `SKILL_CATEGORY_HINT` 落到对应 category，否则落到第一个 category
- `src/data/vibe-journal-html/` — sync 写入（受管生成目录）
  - 每篇已消费 deliverable 的预渲染 HTML 快照（`<article class="vj-doc">…</article>`）
  - 由 `runSync()` 通过 `marked` 在服务端生成；浏览器通过 Vite `import.meta.glob('?raw', { eager: true })` 在构建时内联进 bundle
  - 命名规则：`<上游 deliverable 文件名>.html`（例如 `daily-summary-0525-0529.md.html`）
  - **不要手工编辑这个目录**；改动会随下次 sync 被覆盖
  - `git` 跟踪但不是手编目标（同步脚本幂等重写）

### HTML 渲染管线
- 入口：`src/lib/vibeJournalSync.ts` 的 `renderMarkdownToHtml(md)` + `renderAllDeliverableSnapshots(consumed)`
- 库：`marked@^14.1.4`（devDep；不进浏览器 bundle；gfm tables / autolinks；不换行；默认转义源 md 里的内联 HTML）
- 写入时机：`runSync()` 的 `persist` 分支里无条件重渲染所有 `consumedDeliverables`（< 100ms / 当前 3 篇）
- `dry-run` 模式不渲染（`persist === false` 短路）
- meta 字段：`DeliverableMeta.htmlPath` 是仓库相对路径（如 `src/data/vibe-journal-html/foo.md.html`）
- 浏览器端：`VibeJournal.tsx` 用 `import.meta.glob` 把所有 HTML 字符串 map 进 bundle；当前选中 doc 通过 `dangerouslySetInnerHTML` 注入 `<div class="vj-doc-host"><article class="vj-doc">…</article></div>` 容器
- 样式作用域：`.vj-doc-host .vj-doc *` 全部样式隔离在 `src/styles/index.css` 末尾

### 幂等保证
- **新 deliverable**（文件名首次出现）→ 全文逐行记录 hash，并把 cursor 推进到文件末尾
- **已有 deliverable**（文件存在但内容新增）→ 用 cursor 只消费上次位置之后的新行；即使新增行文本与旧行重复，也会被计入
- **TIMELINE.md** → 同上，使用 timelineLineCursor 判断新增位置
- **metadata-first**：每个 deliverable 优先检查 sibling `.meta.json`
  - 存在且 hash 与 `state.metadataHashes[d]` 不同 → 应用 metadata（不再二次 prose scan，避免双重计分）
  - 存在但 hash 相同 → 跳过（idempotent）
  - 缺失 / 解析错误 / schema_version 不匹配 → 走 alias fallback，并记入 `metadataParseErrors`
- 重复运行（无上游变化）→ `newDeliverables=0 newTimelineLines=0 increments=0 metadata=0`
- 单技能永远不超过 95；累计 delta 受 clamp 影响（被 cap 的部分不会虚增）

### Metadata-first 输入优先级
1. `deliverables/<file>.meta.json` — 权威；存在即应用（hash 不同触发）
2. 上游 `SKILLS.md` — alias / category registry（`loadUpstreamSkillRegistry()`）
3. 下游 `SKILL_ALIASES` — 兼容旧内容和 registry 缺失
4. deliverable / TIMELINE.md 正文 alias scan — 仅 metadata 缺失或损坏时

### 未知技能处理（默认 policy: `auto-register`）
- 入口：`UNKNOWN_SKILL_POLICY` 常量（`src/lib/vibeJournalSync.ts`）
- `auto-register`（默认）：在 metadata 声明的 category 落 `skills.json`（level 30），同时写 `autoRegisteredSkills` 审计（最近 200 条）
- `pending-review`：不写 `skills.json`，追加到 `pendingSkillCandidates` 队列；CLI 输出 `? pending review:` 行
- CLI 覆盖：`scripts/sync-vibe-journal.mjs --policy=pending-review`

### skill 归一化
- 入口：`SKILL_ALIASES` 字典（`src/lib/vibeJournalSync.ts`）
- 匹配规则：最长优先 + 词边界（避免 "react" 误匹配 "react native"）
- 新增技能：只需在 `src/data/skills.json` 加一个条目；alias 表里加一个映射即可

## AGENT PITFALLS / CHANGE SAFETY
- **Navbar 必须保持 `fixed` 吸顶**：移动端和桌面端都依赖顶部固定定位；不要把 `Navbar` 改成 `relative` / `absolute`，否则滚动后会失去吸顶。
- **移动端汉堡菜单图标不要用未定义的 Tailwind 颜色类**：例如 `bg-primary` 在本项目里无效；请使用 `bg-text-primary`、`bg-[var(--...)]` 或 `tailwind.config.js` 中真实存在的颜色 token。
- **移动端菜单背景要用实底**：滚动状态下也要保持 `bg-surface` / 明确的 CSS var 背景和足够的 `z-index`，避免出现"能点但看起来透明"的问题。
- **改主题/布局时优先改 token，不要在页面里硬编码颜色**：全局主题由 `src/styles/tokens.css` / `src/styles/index.css` 驱动。
- **不要把 `src/lib/vibeJournalSync.ts` 引入浏览器**：它是 server-side only（用 fs/path）。浏览器侧用 `vibe-journal-meta.json` 拿同步元数据。
- **不要直接读 `SUMMARY_MANIFEST.md` 当作下游消费状态**：那是上游用的清单；下游必须自己维护 `vibe-journal-consumer-state.json`。
- **不要在浏览器侧重新实现 markdown 解析**：VibeJournal 的 HTML 渲染管线是"sync 阶段用 marked 预渲染 → 构建时 Vite import.meta.glob 内联 → 浏览器只 dangerouslySetInnerHTML 注入"。浏览器 bundle 不应引入 `marked` / `markdown-it` / `remark` / 类似运行时 parser。如果觉得"marked 渲染得不够好"，请改 sync 阶段的渲染参数（marked.parse options）或换 devDep 的 markdown 库（但**不要**在浏览器侧解析）。
- **不要手工编辑 `src/data/vibe-journal-html/`**：那是 sync 写入的受管目录；任何手编改动会被下次 `npm run sync:vibe-journal` 覆盖。
- **验证方式**：本项目没有 lint/test，改动后至少跑 `npm run build` 确认能过；改动同步逻辑后必须跑 `npm run sync:vibe-journal` 至少两次验证幂等。

## COMMANDS
```bash
npm run dev                       # http://localhost:5173
npm run build                     # tsc -b && vite build
npm run preview                   # 预览构建
npm run sync:vibe-journal         # 增量同步 vibe-coding-journal
npm run sync:vibe-journal:dry     # 仅计算 diff，不写盘
```

## DEPLOY
- 生产仓库是 `agenticnoob/xuli-resume`；`Skedush/xuli-resume` 仅作为 fork upstream，不是 Vercel 发布源
- 生产托管使用 Vercel 原生 Git 集成；`main` 自动发布到 Production，其他分支与 Pull Request 自动生成 Preview
- Vercel 自动识别 Vite，构建命令为 `npm run build`，输出目录为 `dist`
- `vercel.json` 提供 React Router SPA 深链接 rewrite；修改路由时保持该规则有效
- GitHub Actions 只负责独立执行 `npm ci` 与 `npm run build`，不负责上传产物或轮询生产地址
- 自定义域名 `resume.zzzxc.com` 在 Vercel Domains 中管理；DNS 以 Vercel 控制台给出的当前记录为准
- 不再维护本地 Docker、Nginx、systemd timer、端口映射或 Tunnel 发布链路

## 用户偏好

### 设计风格
- **主题**: 浅色工程手账，手绘线稿与插画结合，减少模板化 AI 产品感
- **配色**: 灰绿纸张 + 石墨黑 + 工程蓝，辅以印章红和荧光笔黄
- **字体**: LXGW WenKai（标题）、Noto Sans SC（正文）、IBM Plex Mono（代码）
- **图标与插画**: 手绘文档、铅笔、工作台与蓝图意象；插画服务于内容叙事，不使用真实照片

### 页面布局偏好
- 状态 badge（如"待业中"）放在副标题行
- 页面顶部需要有足够留白，内容不要被 navbar 遮挡
- "探索更多"按钮文字根据页面调整（如"个人介绍"）
- 需要在特定页面添加文言文风格的 disclaimer

### 代码偏好
- 提取共享组件，避免重复代码（Logo, PageHeader, PageTransition）
- 使用 Tailwind class，简洁为主
- 动画使用 Framer Motion + CSS GPU 加速

### 内容偏好
- AI 工程实录页面展示 AI 工作方法和流程
- 开源贡献需要两个项目都做成可点击链接
- 技能面板允许被 sync 自动增量更新；新技能按 alias 归一化，重复计分会去重
