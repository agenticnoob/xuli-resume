# AGENT RESULT

## 当前结果

AXMORF 工程实践手账已形成稳定的浅色“工程师工作手账”设计：首页、项目页和实践日志页使用内容型手绘插画，关于页使用同一视觉语言的手绘角色头像；公开署名统一为 `AXMORF`。实践日志使用线上 Pipeline 的受校验公开快照，项目介绍已接入 GitHub README 自动更新。当前应用架构已收口为单一路由配置、按页面懒加载、集中转场/加载/404 边界和无产物类型检查，历史随机布局与生成文件已移除。

## 设计方案

- 浅色灰绿绘图纸背景，搭配石墨文字、工程蓝、印章红和荧光笔黄。
- 标题使用 LXGW WenKai，正文使用 Noto Sans SC，代码与标签使用 IBM Plex Mono。
- 卡片、按钮、标签、时间线与背景均采用纸张、铅笔线稿和轻微不规则边框语汇。
- 主题和布局固定可复现；已移除随机 theme/layout、localStorage TTL 和“换一版”入口。
- 插画是手绘视觉语言的第二层：保留清晰的信息层级，同时增强个人作品集的叙事性。

## 插画资产

| 资产 | 页面 | 叙事作用 |
|------|------|----------|
| `public/illustrations/hero-workbench.webp` | 首页 | 想法、协作、代码、验证到交付的完整工作台 |
| `public/illustrations/projects-blueprint.webp` | 项目 | 项目结构、工程关系与可交付结果的蓝图 |
| `public/illustrations/practice-journal.webp` | Vibe 日志 | 实验、失败、修复与验证的实践循环 |
| `public/illustrations/profile-avatar.webp` | 关于 | 代替真人照片的工程手账风格公开角色 |

4 张插画均为本项目生成的透明背景 WebP，并由 CSS 纸张托底、标题签和响应式规则统一呈现。

## 关键实现

- `src/styles/tokens.css`：当前设计 token 的唯一事实来源。
- `src/styles/index.css`：共享 sketch/paper 组件、导航遮罩、日志时间线、吸附目录、技能卡片和移动端溢出规则。
- `src/siteRoutes.ts`：9 个页面的路径、导航标签、Footer 可见性与懒加载入口。
- `src/App.tsx`：全局 Suspense、页面转场、加载态与 404 边界。
- `src/components/Navbar.tsx`：保持 fixed 吸顶，并根据滚动状态切换为不透明纸张遮罩。
- `src/components/StatusCard.tsx`：技能与实践日志共用的加载、错误与空状态容器。
- `src/components/BackgroundEffects.tsx`：低强度手绘背景线稿。
- `src/pages/Home.tsx`、`About.tsx`、`Projects.tsx`、`VibeJournal.tsx`：插画与公开角色入口。
- `src/pages/VibeJournal.tsx`：消费公开结构化 JSON，展示顶部来源说明、全部 timeline event、桌面/移动目录、正文和当日技能记录。
- `src/lib/vibeData.ts`：浏览器侧公开 JSON 类型、manifest 版本化 URL、请求缓存和加载 hook。
- `scripts/sync-vibe-journal.mjs`：按精确源 SHA 校验线上 Pipeline 数据，投影公开字段并执行身份、home 路径与 IP 脱敏。
- `src/data/projects.json`：项目介绍唯一数据源，保留人工排序与非自动字段，以 GitHub 数字仓库 ID 保存自动同步元数据。
- `scripts/github-projects.mjs`、`scripts/sync-github-projects.mjs`：扫描候选、计算相关内容指纹、校验结构化输出并执行受限写入。
- `.github/codex/`：独立的不可信 README 提示词与结构化输出 Schema。
- `.github/private-automation/`：私有 GitHub-hosted Actions 模板、双 GitHub App 权限边界和专用 Codex 会话回写逻辑。
- `public/favicon.svg`：手绘文档与铅笔标志。

## 验证结果

- 公开仓库 `npm test`：18 项全部通过；`npm run build` 与 `git diff --check`：通过。
- `npm run typecheck` 使用 `tsc --noEmit` 检查应用与 Vite 配置；构建后不会重新生成 `vite.config.js` 或 `*.tsbuildinfo`。
- 路由懒加载后首屏 JS 从 344.44 kB 降至 290.13 kB（gzip 115.34 → 95.39 kB）；CSS 从 45.86 kB 降至 38.39 kB。
- 真实 Pipeline 数据 dry-run、首次实际 sync 与第二次幂等 sync 通过，第二次 `changed=0`；受管公开快照未被本地验证改写。
- 真实浏览器已覆盖 9 个正式路由、404 和 375 px 移动菜单；无页面级横向溢出或应用脚本错误，Esc 可关闭菜单。
- 私有自动化仓库 `npm test`：7 项全部通过；工作流模板、提示词和 Schema 与部署版本一致。
- 首次真实项目同步新增 4 个项目，内容 PR 只修改 `src/data/projects.json`，检查通过后自动合并并触发 Vercel Production；第二次扫描候选数为 0，生成与发布均跳过。
- 当前项目目录包含 12 个已发布条目、0 个 `pending`；当前受管快照来自 Pipeline `3b0cfdcbc1e3c65e76702506cfe83974c8ff1b86`，包含 128 天日志、126 条 timeline event 和 230 项技能。结构优化已在最新自动同步数据之上完成，没有手工改写受管 JSON。

## 生产部署

- 生产仓库已迁移为 `agenticnoob/xuli-resume` fork；原 `Skedush/xuli-resume` 保留为 upstream。
- Vercel 已连接生产 fork：`main` 发布 Production，其他分支与 Pull Request 发布 Preview。
- `vercel.json` 提供 React Router SPA 深链接 rewrite；Vercel 使用 `npm run build` 构建 `dist`。
- GitHub Actions 只负责独立构建验证，不再轮询本地服务的 `/version.txt`。
- GitHub README 项目同步由 `agenticnoob/xuli-resume-automation` 定时运行；publisher App 的合并会触发公开仓库普通 `main` push 检查与 Vercel Git 发布。
- 仓库已移除 Docker、Nginx、systemd timer 与本地主动拉取部署脚本。
- `resume.zzzxc.com` 已通过 Vercel 域名校验；旧 timer 已移入回收站，旧容器已删除，8888 端口已关闭。

## 提交边界

- `_site-content/` 是未跟踪的内容草稿目录，不属于当前受管功能或文档更新，不纳入提交。
- `.sisyphus/plans/` 是历史计划，保留当时语境，不改写为当前状态。
