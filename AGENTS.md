# PROJECT KNOWLEDGE BASE

**Updated:** 2026-09-21
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
├── lib/             # 浏览器侧线上 JSON 类型、缓存与加载 hook
├── data/            # 简历静态内容 + 线上数据发布 manifest
└── styles/
    ├── tokens.css   # 工程手账设计 token
    └── index.css    # 全局样式、手绘组件与响应式规则
scripts/             # vibe-journal CLI runner
public/
├── favicon.svg      # 手绘文档 + 铅笔标志
├── illustrations/   # 首页、关于页、项目页、Vibe 日志页的透明 WebP 插画
└── vibe-data/       # 由同步脚本生成的公开 JSON 快照
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
| 同步线上 Pipeline 数据 | `npm run sync:vibe-journal -- --source <pipeline>/data --revision <sha>` |
| 修改数据适配器 | `scripts/sync-vibe-journal.mjs` + 对应测试 |
| 修改日志/技能展示 | `src/pages/VibeJournal.tsx`, `src/pages/Skills.tsx`, `src/lib/vibeData.ts` |

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
- `redactPublicText()` 只作用于浏览器可见的公开 JSON；不要修改或回写 Pipeline 源数据。
- 修改公开身份时，同步检查 `index.html`、`src/data/resume.ts`、Navbar、Footer、README、`AGENTS.md`、`PROGRESS.md`、`个人简历.md` 与受管 Vibe Journal 产物。

## ONLINE VIBE DATA CONTRACT

- 唯一权威源是 GitHub 私有仓库 `agenticnoob/vibe-journal-pipeline`，不是本机 `/data/projects/repos/vibe-coding-journal`。
- 源数据为 `data/journal/*.json`、`data/TIMELINE.json`、`data/skills.json`；同步必须绑定完整 40 位 source SHA。
- `scripts/sync-vibe-journal.mjs` 验证源 schema、时间线一致性和技能唯一性，只投影公开字段并执行身份、home 路径和 IP 脱敏。
- 生成产物是 `public/vibe-data/{journal,skills,manifest}.json` 与 `src/data/vibe-data-manifest.json`；不要手工编辑。
- 日志保留全部 3 个 body 字段、会话/轮次数、当日技能计数和 timeline event；技能保留全量 `day_count/total_count/first_seen/last_seen`。
- 技能页面显示实际使用次数与覆盖天数，不再维护或展示人为 `level` 百分比。
- 浏览器只请求公开 JSON；私有仓库 deploy key 仅存在于 GitHub Actions，绝不进入 Vite 环境变量或 bundle。
- 实践日志顶部展示源仓库、精确 SHA 校验和脱敏边界；timeline 展示全部公开 event，不截断为固定天数。
- 桌面日志目录保持 sticky；切换条目定位到文章卡片顶部而不是页面顶部。单日技能记录使用响应式卡片网格，显示技能名、类别和当日次数。

## CONSTRAINTS
- TypeScript: `noUnusedLocals=true`, `noUnusedParameters=true`
- 无 ESLint；数据适配器使用 Node 内置 test runner
- 代码中无 DO NOT/NEVER 注释
- 同步逻辑保持无运行时依赖，写入必须原子化且重复运行 `changed=0`
- 修改同步契约后运行 `npm test`、真实数据 dry-run、两次实际 sync 和 `npm run build`

## AGENT PITFALLS / CHANGE SAFETY
- **Navbar 必须保持 `fixed` 吸顶并遮住下方内容**：移动端和桌面端都依赖顶部固定定位；滚动状态使用不透明纸张底色与底部分隔，不要改成 `relative` / `absolute` 或透明背景，否则正文会与导航文字重叠。
- **移动端汉堡菜单图标不要用未定义的 Tailwind 颜色类**：例如 `bg-primary` 在本项目里无效；请使用 `bg-text-primary`、`bg-[var(--...)]` 或 `tailwind.config.js` 中真实存在的颜色 token。
- **移动端菜单背景要用实底**：滚动状态下也要保持 `bg-surface` / 明确的 CSS var 背景和足够的 `z-index`，避免出现"能点但看起来透明"的问题。
- **改主题/布局时优先改 token，不要在页面里硬编码颜色**：全局主题由 `src/styles/tokens.css` / `src/styles/index.css` 驱动。
- **不要恢复本地绝对上游路径**：同步输入只能由 CLI `--source` 显式提供；生产由 Actions 检出线上源仓库。
- **不要在浏览器中读取 GitHub 私有仓库**：页面只消费 `public/vibe-data/`，任何 GitHub 凭据都只属于 CI。
- **不要把计数伪装成能力百分比**：`totalCount` 是日志命中总数，`dayCount` 是覆盖日期数。
- **不要手工编辑公开快照**：`public/vibe-data/*.json` 和 manifest 是受管生成物，下次 sync 会覆盖。
- **日志切换不要滚回整页顶部**：日期、键盘和上一篇/下一篇切换都应通过文章容器的 `scrollIntoView()` 与 `scroll-margin-top` 定位；左侧目录的内部滚动不得带动 window。
- **验证方式**：至少运行 `npm test` 与 `npm run build`；改动同步逻辑后必须用真实 Pipeline 数据执行 dry-run、实际 sync 两次并证明第二次 `changed=0`。

## COMMANDS
```bash
npm run dev                       # http://localhost:5173
npm run build                     # tsc -b && vite build
npm run preview                   # 预览构建
npm test                          # 数据适配器回归测试
npm run sync:vibe-journal -- --source <pipeline>/data --revision <40位sha>
npm run sync:vibe-journal:dry -- --source <pipeline>/data --revision <40位sha>
```

## DEPLOY
- 生产仓库是 `agenticnoob/xuli-resume`；`Skedush/xuli-resume` 仅作为 fork upstream，不是 Vercel 发布源
- Pipeline 的 `journal_updated` dispatch、每日兜底 schedule 和手工运行由 `.github/workflows/sync-vibe-data.yml` 检出精确线上数据 SHA
- CI 使用只读 deploy key 读取 Pipeline，生成后运行测试和生产构建，只提交四个受管 JSON；不要让 bot 提交其他文件
- Vercel 原生 Git 将受管数据提交发布到 Production；同步 Action 随后回读 manifest 与两个 JSON 的 SHA-256
- 普通 `main` 提交、非 `main` 分支和 Pull Request 继续由 Vercel Git 集成发布，使用仓库中最近一次已验证的公开快照
- Vercel 自动识别 Vite，构建命令为 `npm run build`，输出目录为 `dist`
- `vercel.json` 提供 React Router SPA 深链接 rewrite；修改路由时保持该规则有效
- GitHub Actions 的 `verify.yml` 是测试/构建门禁；`sync-vibe-data.yml` 是线上数据更新权威，Vercel Git 是发布权威
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
- 技能面板使用 Pipeline 的全量聚合结果，展示实际覆盖天数、累计次数和首次/最近使用日期
