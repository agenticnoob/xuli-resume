# AGENT RESULT

## 当前结果

AXMORF 工程实践手账已形成稳定的浅色“工程师工作手账”设计：首页、项目页和实践日志页使用内容型手绘插画，关于页使用同一视觉语言的手绘角色头像；公开署名统一为 `AXMORF`，公开产物不再展示真实姓名或真人证件照。实践日志现在明确展示线上数据来源与脱敏边界，并提供完整时间线、吸附目录、文章级切换定位和响应式技能卡片。

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
- `src/components/Navbar.tsx`：保持 fixed 吸顶，并根据滚动状态切换为不透明纸张遮罩。
- `src/components/BackgroundEffects.tsx`：低强度手绘背景线稿。
- `src/pages/Home.tsx`、`About.tsx`、`Projects.tsx`、`VibeJournal.tsx`：插画与公开角色入口。
- `src/pages/VibeJournal.tsx`：消费公开结构化 JSON，展示顶部来源说明、全部 timeline event、桌面/移动目录、正文和当日技能记录。
- `src/lib/vibeData.ts`：浏览器侧公开 JSON 类型、SHA-256 校验、请求缓存和加载 hook。
- `scripts/sync-vibe-journal.mjs`：按精确源 SHA 校验线上 Pipeline 数据，投影公开字段并执行身份、home 路径与 IP 脱敏。
- `public/favicon.svg`：手绘文档与铅笔标志。

## 验证结果

- `npm test`：4 项全部通过；`npm run build` 与 `git diff --check`：通过。
- 实践日志已完成 Chrome 1440×1000 与 390×844 浏览器检查：页面标识、公开来源、完整 123 条时间线、导航遮罩、目录切换和技能卡片均通过。
- 桌面左栏滚动前后保持在 88px；切换条目后文章顶部位于 87.5px，移动端约为 86px，没有回到页面顶部。
- 桌面与移动端均无页面级横向溢出、Vite error overlay 或控制台错误。

## 生产部署

- 生产仓库已迁移为 `agenticnoob/xuli-resume` fork；原 `Skedush/xuli-resume` 保留为 upstream。
- Vercel 已连接生产 fork：`main` 发布 Production，其他分支与 Pull Request 发布 Preview。
- `vercel.json` 提供 React Router SPA 深链接 rewrite；Vercel 使用 `npm run build` 构建 `dist`。
- GitHub Actions 只负责独立构建验证，不再轮询本地服务的 `/version.txt`。
- 仓库已移除 Docker、Nginx、systemd timer 与本地主动拉取部署脚本。
- `resume.zzzxc.com` 已通过 Vercel 域名校验；旧 timer 已移入回收站，旧容器已删除，8888 端口已关闭。

## 提交边界

- `_site-content/` 是未跟踪的内容草稿目录，不属于本次视觉改版，不纳入提交。
- `.sisyphus/plans/` 是历史计划，保留当时语境，不改写为当前状态。
