# AXMORF 工程实践手账

[resume.zzzxc.com](https://resume.zzzxc.com) 是一个用 React 18、TypeScript 5 和 Vite 5 构建的九页面个人简历与工程实践站点。

## 当前视觉方向

网站采用稳定的“工程师工作手账”设计：灰绿绘图纸、石墨文字、工程蓝标注、印章红与荧光笔黄。CSS 手绘组件负责全站结构，首页、项目页和 Vibe 日志页的透明 WebP 插画分别表达工作流、项目蓝图与实践循环；关于页使用同一墨线与水彩语言的透明手绘角色头像。

这是一套手绘风格的数字界面与项目专属插画组合，不再使用深色 neon、随机主题或“换一版”交互。

## 公开身份与隐私

- 全站统一使用公开署名 `AXMORF`，不在页面、SEO 或内容文档中展示真实姓名。
- 关于页使用 `public/illustrations/profile-avatar.webp` 手绘角色，不再发布真人证件照。
- Vibe Journal 在构建前将线上 Pipeline JSON 投影为公开快照，并脱敏真实姓名、机器 home 路径与 IP；私有源仓库凭据不会进入浏览器。

## 页面

- `/` 首页
- `/about` 关于
- `/skills` 技能
- `/experience` 工作经历
- `/projects` 项目
- `/education` 教育
- `/ai-philosophy` AI 哲学
- `/development-log` AI 工程实录
- `/vibe-journal` 实践日志：顶部公开数据来源、完整时间线、吸附式日期目录、结构化正文与当日技能卡片

## 本地开发

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Vibe Journal 同步

```bash
npm run sync:vibe-journal:dry -- --source /path/to/vibe-journal-pipeline/data --revision <40位sha>
npm run sync:vibe-journal -- --source /path/to/vibe-journal-pipeline/data --revision <40位sha>
```

唯一权威源是 GitHub 私有仓库 `agenticnoob/vibe-journal-pipeline`。CLI 入口 `scripts/sync-vibe-journal.mjs` 校验精确 source SHA、每日 JSON、Timeline 与技能聚合，然后生成 `public/vibe-data/` 和轻量 manifest。日志页展示完整公开 journal 字段；技能页展示 `day_count`、`total_count` 与首次/最近实践日期，不再使用人为百分比模型。

实践日志顶部明确展示数据来源与隐私边界，并提供全部 timeline event 的横向时间线。桌面端日期目录在阅读正文时保持吸附，切换日期只把视口定位到文章顶部；移动端使用折叠目录。单日技能记录采用响应式卡片网格，次数是当日真实计数。

```bash
npm test
npm run build
```

## 设计与内容入口

- 设计 token：`src/styles/tokens.css`
- 手绘组件与响应式样式：`src/styles/index.css`
- 插画资产：`public/illustrations/`
- 简历共享数据：`src/data/resume.ts`
- 当前工程约束：`AGENTS.md`
- 阶段记录：`PROGRESS.md`

## 部署

生产环境使用 Vercel，不再依赖本地 Docker、Nginx、systemd timer、端口映射或 Tunnel。生产仓库是 `agenticnoob/xuli-resume`；它 fork 自 `Skedush/xuli-resume`，本地保留 `upstream` remote 以便按需同步原仓库更新。

- Pipeline 更新通过 `repository_dispatch` 把精确 source SHA 发送给本仓库；
- 数据 dispatch、每日兜底 schedule 与手工运行均由 `sync-vibe-data.yml` 检出线上 Pipeline，运行数据测试/生产构建，并只提交四个受管 JSON 文件；
- Vercel 原生 Git 将通过验证的数据提交发布到 Production；同步 Action 随后回读公开 JSON，校验 SHA-256 与 source revision；
- 其他分支和 Pull Request 自动创建 Preview Deployment；
- 构建命令为 `npm run build`，输出目录为 `dist`；
- `vercel.json` 将所有应用路由重写到 `index.html`，保证 React Router 深链接可直接访问。

`verify.yml` 继续作为独立测试/构建门禁；数据提交保留源 SHA 审计记录，实际发布状态、历史版本与回滚由 Vercel 管理。Vercel 项目 `agent-first/xuli-resume` 已连接生产仓库，`resume.zzzxc.com` 已完成域名校验和 DNS 切换。

生产地址：[resume.zzzxc.com](https://resume.zzzxc.com)。Vercel 项目关联信息保存在本机 `.vercel/`，该目录已忽略，不提交到仓库。
