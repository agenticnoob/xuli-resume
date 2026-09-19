# AGENT RESULT

## 当前结果

AXMORF 工程实践手账已形成稳定的浅色“工程师工作手账”设计：首页、项目页和 Vibe 日志页使用内容型手绘插画，关于页使用同一视觉语言的手绘角色头像；公开署名统一为 `AXMORF`，公开产物不再展示真实姓名或真人证件照。

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
- `src/styles/index.css`：共享 sketch/paper 组件、插画容器和移动端溢出规则。
- `src/components/BackgroundEffects.tsx`：低强度手绘背景线稿。
- `src/pages/Home.tsx`、`About.tsx`、`Projects.tsx`、`VibeJournal.tsx`：插画与公开角色入口。
- `src/lib/vibeJournalSync.ts`：保持上游消费语义，只对浏览器可见元数据与 HTML 快照执行公开脱敏。
- `public/favicon.svg`：手绘文档与铅笔标志。

## 验证结果

- `npm run build`：通过。
- 9 个路由已完成桌面和移动端浏览器检查，均返回 200。
- 4 张插画均加载成功；导航与移动端菜单交互通过。
- 关于页已完成桌面/移动端视觉检查；Vibe Journal 历史文档在浏览器中已脱敏为 `AXMORF`。
- 页面无横向溢出，控制台无错误，`git diff --check` 通过。

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
