# AXMORF 工程实践手账

[resume.zzzxc.com](https://resume.zzzxc.com) 是一个用 React 18、TypeScript 5 和 Vite 5 构建的九页面个人简历与工程实践站点。

## 当前视觉方向

网站采用稳定的“工程师工作手账”设计：灰绿绘图纸、石墨文字、工程蓝标注、印章红与荧光笔黄。CSS 手绘组件负责全站结构，首页、项目页和 Vibe 日志页的透明 WebP 插画分别表达工作流、项目蓝图与实践循环；关于页使用同一墨线与水彩语言的透明手绘角色头像。

这是一套手绘风格的数字界面与项目专属插画组合，不再使用深色 neon、随机主题或“换一版”交互。

## 公开身份与隐私

- 全站统一使用公开署名 `AXMORF`，不在页面、SEO 或内容文档中展示真实姓名。
- 关于页使用 `public/illustrations/profile-avatar.webp` 手绘角色，不再发布真人证件照。
- Vibe Journal 在同步时只对浏览器侧元数据与 HTML 快照做公开脱敏，原始上游内容与技能计分仍保持原始语义。

## 页面

- `/` 首页
- `/about` 关于
- `/skills` 技能
- `/experience` 工作经历
- `/projects` 项目
- `/education` 教育
- `/ai-philosophy` AI 哲学
- `/development-log` AI 工程实录
- `/vibe-journal` Vibe 日志

## 本地开发

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Vibe Journal 同步

```bash
npm run sync:vibe-journal
npm run sync:vibe-journal:dry
```

同步实现位于 `src/lib/vibeJournalSync.ts`，CLI 入口是 `scripts/sync-vibe-journal.mjs`。浏览器只读取同步生成的元数据与 HTML 快照，不直接访问上游仓库，也不在运行时解析 Markdown。

## 设计与内容入口

- 设计 token：`src/styles/tokens.css`
- 手绘组件与响应式样式：`src/styles/index.css`
- 插画资产：`public/illustrations/`
- 简历共享数据：`src/data/resume.ts`
- 当前工程约束：`AGENTS.md`
- 阶段记录：`PROGRESS.md`

## 部署

生产环境使用 Vercel 原生 Git 集成，不再依赖本地 Docker、Nginx、systemd timer、端口映射或 Tunnel。生产仓库是 `agenticnoob/xuli-resume`；它 fork 自 `Skedush/xuli-resume`，本地保留 `upstream` remote 以便按需同步原仓库更新。Vercel 连接生产仓库后：

- `main` 分支的提交自动创建 Production Deployment；
- 其他分支和 Pull Request 自动创建 Preview Deployment；
- 构建命令为 `npm run build`，输出目录为 `dist`；
- `vercel.json` 将所有应用路由重写到 `index.html`，保证 React Router 深链接可直接访问。

GitHub Actions 只在独立环境运行 `npm ci` 和 `npm run build`，作为代码构建门禁；实际发布状态、历史版本与回滚由 Vercel 管理。Vercel 项目 `agent-first/xuli-resume` 已连接生产仓库，`resume.zzzxc.com` 已完成域名校验和 DNS 切换。

生产地址：[resume.zzzxc.com](https://resume.zzzxc.com)。Vercel 项目关联信息保存在本机 `.vercel/`，该目录已忽略，不提交到仓库。
