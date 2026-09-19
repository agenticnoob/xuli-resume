# 项目进度与注意事项

> 给后续 session / 新对话快速恢复上下文。本文档只记项目级阶段、决策、注意事项与未来任务。
> 每次完成项目级任务后，请在本文件追加新阶段，不要覆盖历史。

## 时间线

| 阶段 | 时间 | 事件 | 关键产物 |
|------|------|------|----------|
| 1    | 2026-05-12 起 | xuli-resume 第一个版本上线（9 页面 + 简历内容） | React 18 + TS 5 + Vite 5 + Framer Motion + GitHub Actions 部署 |
| 2    | 2026-05 中 | 主题 / 布局 / Background Effects / 设计 token 重构 | `tokens.css` + `GenerativeDesignProvider` + `BackgroundEffects` |
| 3    | 2026-05 末 | 移动端导航 fixed 吸顶 + 实底菜单修复 | `Navbar.tsx` 修复回归 |
| 4    | 2026-06-01 | **vibe-coding-journal 下游消费侧接入** | `VibeJournal` 页 + 路由 + 同步 lib + 消费状态 + skills 增量 |
| 5    | 2026-06-01 | **Skills 页面：分类细化 + 卡片等高** | skills taxonomy 拆为 8 类（ai-coding / ai-infra / devops 单独分类）；`Skills.tsx` 重写为等高卡片 + 内部滚动 |
| 6    | 2026-06-01 | **VibeJournal 升级为 HTML 阅读器** | 同步阶段用 `marked` 预渲染 md→html 写入 `src/data/vibe-journal-html/`；`VibeJournal.tsx` 重写为左目录 + 右内容阅读器（移动端折叠面板） |
| 7    | 2026-06-01 | **metadata-first 下游同步 + 未知技能审计** | 优先消费上游 `deliverables/*.meta.json` + `SKILLS.md` registry；保留 alias/正文 fallback；auto-register / pending 策略；CLI 输出 `metadata/fallback/autoRegistered/pending`；D6 4 个 scenario 全部验证通过 |
| 8    | 2026-09-18 | **全站改为工程手账设计系统** | 浅色纸张 token、手绘组件、稳定布局、9 页面统一；移除随机主题与“换一版”入口 |
| 9    | 2026-09-18 | **加入内容型手绘插画** | 首页工作台、项目蓝图、实践日志 3 张透明 WebP 插画；完成桌面/移动端回归 |
| 10   | 2026-09-18 | **生产部署改为主机主动拉取** | systemd user timer 轮询 main；安全 fast-forward + Docker 重建；Actions 通过 revision endpoint 验收 |
| 11   | 2026-09-18 | **公开身份脱敏与手绘角色头像** | 全站统一 AXMORF；移除真人证件照；新增透明 WebP 头像与 Vibe Journal 公开快照脱敏 |
| 12   | 2026-09-20 | **生产托管迁移至 Vercel** | 原生 Git 集成发布；SPA rewrite；移除本地 Docker、Nginx、systemd 与映射链路 |

## 阶段 4 详情（vibe-coding-journal 下游消费侧）

### 目标
把 `vibe-coding-journal` 当成"已整理好的上游内容源"，在 xuli-resume 内做"下游消费器"：
- 新增页面展示上游 timeline + deliverables
- 增量更新技能面板
- 为未来"上游 + 下游"一体化 cron 预留清晰入口

### 严格边界
- **只做下游，不实现完整总流水线**
- **不修改** `/data/projects/repos/vibe-coding-journal/` 任何文件
- **不依赖** `SUMMARY_MANIFEST.md` 作为下游消费状态
- 同步逻辑**不在** 页面组件里，必须抽成可复用入口

### 实现内容

| 模块 | 文件 | 角色 |
|------|------|------|
| 同步 lib（核心） | `src/lib/vibeJournalSync.ts` | 服务端单文件库，导出 `runSync()` / `applySkillIncrements()` / `loadState()` 等 |
| CLI runner | `scripts/sync-vibe-journal.mjs` | `node --experimental-strip-types` 直接跑；带 `--dry-run` / `--json` / `--quiet` |
| 消费状态（机器用） | `src/data/vibe-journal-consumer-state.json` | 真状态：consumedDeliverables + 逐行 hash + skillsIncrementLog |
| 元数据（浏览器用） | `src/data/vibe-journal-meta.json` | 轻量摘要，**不要**当成下游状态 |
| 技能数据 | `src/data/skills.json` + `src/data/skills-types.ts` | Skills 页用；sync 写入（idempotent） |
| 页面 | `src/pages/VibeJournal.tsx` | 读取 sync 生成的 timelinePhases + deliverables 正文预览；不直接解析上游、不硬编码上游内容 |
| 路由 | `src/App.tsx` | `/vibe-journal` |
| 导航 | `src/components/Navbar.tsx` | 加了"Vibe 日志"入口（桌面端 + 移动端） |
| 项目说明 | `AGENTS.md` | 记录了下游消费侧、状态文件、幂等保证、skill 归一化等 |

### 关键技术栈
- 同步 lib 用 `node:fs` / `node:path`；通过 Node 24 `--experimental-strip-types` 直接跑 TS
- 技能识别用 `SKILL_ALIASES` 字典 + 最长优先 + 词边界匹配
- 增量检测用“meaningful line cursor + 行 hash 快照”：cursor 判断新增位置，能处理重复文本追加；hash 仅用于审计/状态可读性
- 95 上限靠 `clampLevel()` + `applySkillIncrements()` 组合保证；超 cap 时 `increments` 列表里不会写虚的 delta

### 关键转折点
- **不实现总 cron**：本次只完成"下游消费器"，上游生成 + 触发仍待未来统一入口
- **不把 manifest 当状态**：`SUMMARY_MANIFEST.md` 是上游清单，不能替代 `vibe-journal-consumer-state.json`
- **元数据 vs 状态分两层**：meta 给浏览器读、state 给 sync 读，避免浏览器把 fs-only 字段当数据读
- **技能增量 log 上限 500**：超出会自动裁剪，避免 `consumer-state.json` 无界增长

### 仓库表（xuli-resume 视角）

| 仓库 | 关系 |
|------|------|
| `xuli-resume` | 下游（本次工作所在） |
| `vibe-coding-journal` | 上游内容源（只读） |
| `codex-hermes` | workflow 治理参考（未来总入口可能挂在这里） |

### 命令
```bash
npm run dev                              # 启动开发服务器
npm run build                            # tsc + vite build（本次验证通过）
npm run sync:vibe-journal                # 实际写入（idempotent）
npm run sync:vibe-journal:dry            # 仅计算 diff，不写盘
```

## 注意事项

1. **`src/lib/vibeJournalSync.ts` 是 server-side only**（用 `fs`/`path`），**不要**在浏览器组件里 import。浏览器只读 `vibe-journal-meta.json`。
2. **`scripts/sync-vibe-journal.mjs` 用 Node 24 `--experimental-strip-types`** 跑 TS，**不要**装 tsx / ts-node。
3. **未来总 cron 接入方式**：直接 `node --experimental-strip-types --no-warnings scripts/sync-vibe-journal.mjs`，不要重新实现同步逻辑。
4. **新增 skill 的标准做法**：在 `src/data/skills.json` 加条目 + 在 `src/lib/vibeJournalSync.ts` 的 `SKILL_ALIASES` 加 alias + 可选 `SKILL_CATEGORY_HINT`。
5. **不修改 `vibe-coding-journal` 上游**——所有改动都在 xuli-resume 内。
6. **不依赖 `SUMMARY_MANIFEST.md`**——下游消费状态只看 `vibe-journal-consumer-state.json`。
7. **未来追加 deliverables/TIMELINE.md** 时，不需要改任何 xuli-resume 代码，重跑 `npm run sync:vibe-journal` 即可。

## 验证（本次）

- `npm run build`：通过（vite 5.4.21 / 410 modules / 366.70 kB JS）
- `npm run sync:vibe-journal` 第一次：增量 0（当前状态已消费上游内容）
- `npm run sync:vibe-journal` 第二次：增量 0（idempotent 验证通过）
- `npm run sync:vibe-journal:dry`：增量 0（dry-run 不写盘）
- `npm run preview -- --host 0.0.0.0` + `curl -I http://127.0.0.1:4173/vibe-journal`：HTTP 200

## 后续建议

1. 未来总 cron 可以直接以 `scripts/sync-vibe-journal.mjs` 作为下游入口；上游生成由独立的 cron 负责并写入 `vibe-coding-journal/deliverables/`。
2. 技能面板如需更精细的"按周/月聚合"，可以在 `vibe-journal-meta.json` 加一层 `recentIncrements` 聚合视图。
3. 监控建议：在 `consumer-state.json` 缺失或异常时，让 sync 自动重建一个空状态（已实现 `loadState()` 的容错），但生产里建议配合文件存在性告警。

## 阶段 5 详情（Skills 分类细化 + 卡片等高）

### 目标
在保持下游 sync 兼容的前提下，把 Skills 页面从 7 个语义混合的大类拆成 8 个语义单一的小类，并解决同一行卡片高度不一致的问题。

### 严格边界
- **不破坏** `vibeJournalSync.ts` 的 sync 机制
- 所有现有 skill **ID 保持不变**（向后兼容 sync 的增量写入）
- 不引入新依赖
- 卡片视觉沿用当时的深色 neon 科技风（历史阶段记录；阶段 8 已整体替换为工程手账风格）

### 分类拆分（8 类）

| 原分类 | 新分类 | 包含的 skills |
|--------|--------|---------------|
| `frontend-basics` | 不变 | html5, css3, javascript, typescript |
| `frontend-frameworks` | 不变 | react, vue, taro, uniapp, react-native |
| `ui-libraries` | 不变 | ant-design, element-ui, echarts |
| `frontend-tooling` | 不变 | vite, webpack, eslint-prettier, gitlab-ci, husky |
| `ai-tools` | 拆为 `ai-coding` | trae-cursor, claude-code, openai-codex, opencode, hermes-agent, agent-workflow |
| `ai-tools` | 拆为 `ai-infra`（与原 ai-infra 合并） | llm-rag 加入；原 ai-infra 保留 mcp/ollama/litellm/open-webui/chromadb/pgvector/qdrant/minimax |
| `ai-infra` | 拆为 `ai-infra` + `devops`（新增） | devops 拿走 docker/github-actions/nginx/ssh/tailscale/mihomo/vpn/vps |
| `backend` | 改名为 `后端框架`（语义收窄） | nodejs, python, django, fastapi, pydantic, sqlalchemy, jwt, ant-design-pro, playwright, sqladmin |

### 卡片等高策略
- `grid` + `auto-rows-fr` 让同行卡片自动拉伸到等高
- 卡片内 `flex flex-col h-full` 让 skill 列表 `flex-1 min-h-0`
- 长分类的 skill 列表用 `max-h-[480px] overflow-y-auto`，超出时内部滚动而不是撑高整张卡
- 短分类自然不会触发滚动，整张卡片高度等于同行最高的卡片

### 改动文件

| 文件 | 角色 |
|------|------|
| `src/data/skills.json` | 8 类 taxonomy，50 个 skill ID 全部保留 |
| `src/lib/vibeJournalSync.ts` | 更新 `SKILL_CATEGORY_HINT` 把所有 skill 映射到新 category ID |
| `src/pages/Skills.tsx` | 重写为等高卡片 + 内部滚动 + 提取 `SkillRow` / `CategoryCard` 子组件 |
| `PROGRESS.md` | 追加阶段 5 |

### sync 兼容性
- 所有原 skill ID 保持 → `findSkillEntry()` 仍能命中老条目
- `SKILL_CATEGORY_HINT` 的 value 从 `ai-tools` 改为 `ai-coding`，新增 `devops`；老 value `ai-tools` 已不再使用
- 重复运行 sync：`newDeliverables=0 newTimelineLines=0 increments=0`（idempotent 通过）
- 未来上游 deliverable 里提到新 skill：会按新的 `SKILL_CATEGORY_HINT` 落到正确 category

### 验证（本次）
- `npm run build`：通过（vite 5.4.21 / 410 modules / 367.13 kB JS）
- `npm run sync:vibe-journal` 第一次：增量 0
- `npm run sync:vibe-journal` 第二次：增量 0（idempotent 通过）
- `npm run preview -- --host 0.0.0.0` + `curl -I /skills`：HTTP 200
- bundle 中 4 个新 category title 全部出现；老 title（`AI工具`、`后端 / 全栈`、`AI 基础设施 / 代理`）全部消失

## 阶段 6 详情（VibeJournal 升级为 HTML 阅读器）

### 目标
把 VibeJournal 从"18 行 markdown 纯文本预览"升级为"完整 md → HTML 渲染的阅读器"，并解决"页面变成无限长滚动列表"的问题。借鉴 omo-markdown-site 的"构建阶段把 md 渲染成 HTML"思路，但保持"下游消费侧"约束（不直接读上游路径）。

### 严格边界
- **不破坏** 现有 `runSync()` 幂等性
- **不把** `src/lib/vibeJournalSync.ts` 引入浏览器（保持 server-side only）
- **不**在浏览器运行时去解析上游 markdown
- **不**新增运行时依赖（marked 是 devDep，浏览器 bundle 不变重）
- **不**修改上游 `/data/projects/repos/vibe-coding-journal/`
- **不**重写 Skills 页面（属于阶段 5，本阶段不碰）

### 架构

| 层 | 位置 | 角色 |
|----|------|------|
| 同步 lib | `src/lib/vibeJournalSync.ts` | 服务端单文件库；`runSync()` 期间用 `marked` 把每篇 deliverable 渲染成 HTML 写入 `src/data/vibe-journal-html/<file>.html` |
| 快照目录 | `src/data/vibe-journal-html/` | 新增受管目录；存放每篇已消费 deliverable 的预渲染 HTML（`<article class="vj-doc">…</article>`） |
| 元数据 | `src/data/vibe-journal-meta.json` | 每个 deliverable 多一个 `htmlPath` 字段（指向快照目录里的 HTML） |
| 浏览器入口 | `src/pages/VibeJournal.tsx` | `import.meta.glob('/src/data/vibe-journal-html/*.html', { query: '?raw', eager: true })` 在构建时把所有 HTML 字符串内联进 bundle；页面渲染时按 `htmlPath` 取 HTML，用 `dangerouslySetInnerHTML` 注入 `.vj-doc-host` 容器 |
| 样式 | `src/styles/index.css` | 新增 `.vj-doc-host .vj-doc h1/h2/h3/p/ul/ol/li/code/pre/blockquote/table/hr/a/strong/em/img` 作用域样式 |
| 依赖 | `package.json` devDeps | 新增 `marked@^14.1.4`（仅服务端使用，不进浏览器 bundle） |

### 阅读交互

- **桌面端**：左侧 260px sticky 文档目录 + 右侧阅读区；`grid-cols-[260px_minmax(0,1fr)]`
  - 目录项：编号 + 标题，当前选中项 accent 左边框 + 背景
  - 阅读区头部：文档号 `1/3`、上游文件名、上一篇/下一篇按钮、文档标题、summary
  - 阅读区主体：完整 HTML（无截断、无 preview）
- **移动端**：顶部可折叠"文档选择器"按钮，点击展开后是文档列表；展开后点选 → 切换到该文档 + 自动收起
- **键盘**：↑/↓/←/→ 或 k/j 在文档间切换（聚焦在 input/textarea 时禁用）
- **切换时**：内容区 scrollTop 重置 + window 平滑滚回顶部
- **侧栏**：当前选中项自动 scrollIntoView(`block: 'nearest'`) 保持可见

### 完整性保证
- 同步阶段把 deliverable 全文 md 一次性渲染为完整 HTML，**不做 preview / 截断 / 摘要**
- 浏览器只是"从已生成的 HTML 字符串里挑一篇渲染"，不存在丢正文的可能
- fallback：若某篇 `htmlPath` 在构建时未找到（极少见，比如 sync 跑过但 build 还没跑过），降级为 `<pre>{markdown}</pre>` 纯文本展示，且不阻塞其他文档

### 安全
- `marked` 默认会转义源 md 里的内联 HTML（`<script>`、`<style>` 不会直接执行）
- 生成的 HTML 通过 `dangerouslySetInnerHTML` 注入；信任边界是"上游 `vibe-coding-journal` 仓库（用户自己的）"——和现有 meta `consumedDeliverables[].content` 信任级别一致
- 渲染产物落在 `src/data/vibe-journal-html/`（被 git 跟踪，但不是手工编辑的目标）

### idempotency
- HTML 渲染在 `persist` 分支里无条件重跑所有 `consumedDeliverables`
- 这样做的好处：未来若有人手动编辑了某篇 md，无需额外 cursor 记账就能反映
- 渲染成本：当前 3 篇 md 总耗时 < 100ms（marked v14 性能很好）
- `dry-run` 模式不渲染（`persist === false` 短路），符合现有"dry-run 只算 diff 不写盘"约束

### 改动文件

| 文件 | 角色 |
|------|------|
| `package.json` / `package-lock.json` | 新增 `marked` devDep |
| `src/lib/vibeJournalSync.ts` | 新增 `HTML_SNAPSHOT_DIR` 常量 + `htmlSnapshotRelPath()` + `renderMarkdownToHtml()` + `renderAllDeliverableSnapshots()`；`DeliverableMeta.htmlPath` 字段；`writeMeta()` / `runSync()` 串联渲染 |
| `src/data/vibe-journal-html/*.html` | 新增（git 跟踪）：3 份预渲染 HTML |
| `src/data/vibe-journal-meta.json` | 重新生成：每篇 deliverable 多 `htmlPath` 字段 |
| `src/pages/VibeJournal.tsx` | 重写为左目录 + 右内容阅读器（mobile 折叠面板 + 键盘导航） |
| `src/styles/index.css` | 新增 `.vj-doc-host .vj-doc *` 作用域样式 |
| `PROGRESS.md` | 追加阶段 6 |

### 验证（本次）
- `npm run build`：通过（vite 5.4.21 / 413 modules / 403.25 kB JS / 35.72 kB CSS）
- `npm run sync:vibe-journal` 第一次：增量 0
- `npm run sync:vibe-journal` 第二次：增量 0（idempotent 通过）
- `npm run sync:vibe-journal` 第三次：增量 0（连续多次稳定）
- `npm run sync:vibe-journal:dry`：增量 0（不写盘，不渲染 HTML）
- `npm run preview -- --host 0.0.0.0`：
  - `curl -I /vibe-journal`：HTTP 200
  - `curl -I /skills`：HTTP 200（验证 Skills 阶段 5 没被破坏）
- bundle 检查：`dist/assets/*.js` 含 3 份 HTML 快照标题（"VPN 代理项目"、"2026-05 日志汇总"、"Vibe Coding 完整经历"）
- 完整性检查：source `daily-summary-0525-0529.md` 末尾 4 行 list items ↔ 渲染 HTML 末尾 4 行 `<li>` 完全对应（无截断）

## 阶段 7 详情（metadata-first 下游同步 + 未知技能审计）

### 目标
实现"上游 LLM 产结构化 metadata + 下游脚本纯消费"链路。下游 sync 不再只是 prose alias 扫描兜底，而是 metadata 优先消费，并把未知技能可审计地落库或入待 review 队列。

### 严格边界
- **不调用 LLM**——下游是纯脚本消费方，不重新做语义判断
- **不修改上游** `/data/projects/repos/vibe-coding-journal/`（本阶段 D6 临时 fixture 已清理）
- **不新增/不复制同步脚本**——`scripts/sync-vibe-journal.mjs` 是唯一入口
- **不破坏阶段 6 的 HTML 渲染管线**——HTML 快照仍在 `persist` 分支无条件重渲染
- **不破坏现有 skill id 兼容**——`SKILL_ALIASES` 仍是合法 fallback，phase 4 之后的所有 sync 行为对老内容保持

### 输入优先级（PR / `docs/downstream-contract.md` 规定）
1. `deliverables/<file>.meta.json` —— 权威；存在且 hash 不同就应用
2. 上游 `SKILLS.md` —— alias / category registry（`loadUpstreamSkillRegistry()`）
3. 下游 `SKILL_ALIASES` —— 兼容旧内容和 registry 缺失
4. deliverable / TIMELINE.md 正文 alias scan —— 仅当 1 缺失/损坏

### state / meta schema 增量
- `ConsumerState` 新增：
  - `metadataHashes: Record<file, sha256>` —— 每个 deliverable 最近一次有效 meta 内容的 sha256；hash 一致则不重放
  - `autoRegisteredSkills: AutoRegisteredSkillEntry[]` —— 自动注册技能审计（最近 200 条）
  - `pendingSkillCandidates: PendingSkillCandidate[]` —— 未知技能待 review 队列
  - `metadataParseErrors: Array<{file, error, timestamp}>` —— meta 解析/校验错误日志（最近 50 条）
- `VibeJournalMeta` 新增（最近一次同步审计摘要）：
  - `lastRunMetadataFiles / lastRunMetadataParseErrors / lastRunFallbackDeliverables / lastRunAutoRegisteredSkills / pendingSkillCandidates`
- `SyncResult` 新增 `metadataFilesUsed / metadataParseErrors / fallbackDeliverables / autoRegisteredThisRun / pendingSkillCandidatesThisRun / unknownSkillPolicy`

### 未知技能处理策略
- 默认 policy = `auto-register`（常量 `UNKNOWN_SKILL_POLICY`）
- `auto-register`：在 metadata 声明的 `category_hint` 落 `skills.json`（level 30），并写 `autoRegisteredSkills` 审计
- `pending-review`：不写 `skills.json`，追加到 `pendingSkillCandidates` 队列
- CLI 覆盖：`scripts/sync-vibe-journal.mjs --policy=auto-register|pending-review`

### 双重计分防护
- 同一 deliverable 走 metadata 路径时，`runSync()` 跳过 `extractSkillIdsFromLine()` 调用
- `resolveDeclaredSkill()` 用 `seenInFile` Set 在单个文件内去重
- `applySkillIncrements()` 自带去重
- 增量 log 用 `(name, resolved)` 去重，pending queue 用 `(resolved, source)` 去重

### D6 verification（临时 fixture，验证后清理）
构造 4 个临时 deliverable + meta（路径 `/data/projects/repos/vibe-coding-journal/deliverables/__d6-*.{md,meta.json}`），验证后移除：

| Scenario | 输入 | 期望行为 | 实际结果 |
|----------|------|----------|----------|
| S1 新 deliverable + 合法 meta | `__d6-s1-valid.{md,meta.json}` | 走 metadata，不二次 prose scan；docker/hermes-agent 来自 meta，nginx/ssh 不出现 | ✓ `metadataFilesUsed: [__d6-s1-valid.meta.json]`；increments: docker +1, hermes-agent +1 |
| S2 新 deliverable + 缺失 meta | `__d6-s2-missing.md` | fallback alias scan；body 内 docker/nginx/ssh 全部命中 | ✓ `fallbackDeliverables: [..., __d6-s2-missing.md]`；increments: docker +0.5, nginx +0.5, ssh +0.5 |
| S3 新 deliverable + 损坏 meta | `__d6-s3-corrupt.{md,meta.json}` | parse error 记录后 fallback；sync 不崩 | ✓ `metadataParseErrors: [{file: __d6-s3-corrupt.md, error: invalid JSON...}]` + fallback |
| S4 未知技能 Webwright in meta | `__d6-s4-unknown.{md,meta.json}` | Webwright 不在 SKILLS.md / skills.json → auto-register 落 devops / level 30 + 审计 | ✓ `autoRegisteredThisRun: [Webwright->webwright (metadata-new-skill, devops)]`；skills.json 多 webwright 条目 |

### 验证（本次）
- 基线（无 fixture）：`npm run sync:vibe-journal` × 3 → 全部 `increments=0 metadata=0 fallback=3 autoRegistered=0 pending=0`（idempotent 通过）
- 4 个 fixture 全部按上表行为通过
- 第二次 sync 在 fixture 仍在的情况下：`newDeliverables=0 metadataFilesUsed=0 autoRegisteredThisRun=0 increments=0`（metadata hash 复用）
- `npm run sync:vibe-journal:dry`：`sha256sum` 对 `skills.json` / `consumer-state.json` / `meta.json` 三文件零差异（dry-run 真的不写盘）
- `npm run build`：通过（vite 5.4.21 / 420 modules / 405.23 kB JS / 35.64 kB CSS）
- 清理后再次 `npm run sync:vibe-journal` × 2：回到 3 文件 fallback 基线，0 增量
- fixtures 全部从上游 deliverables/ 移除（`ls` 只剩 3 个真实文件）

### 改动文件
| 文件 | 角色 |
|------|------|
| `src/lib/vibeJournalSync.ts` | 新增 `loadUpstreamSkillRegistry()` / `loadDeliverableMeta()` / `resolveDeclaredSkill()` / `clampMetadataDelta()` / `mergeAutoRegistered()` / `mergePendingCandidates()` / `pruneResolvedPending()` / `dedupRunAutoRegistered()` / `dedupRunPending()`；扩展 `applySkillIncrements()` 接受 `categoryHints` / `unknownSkillPolicy` / `autoRegisteredOut` / `pendingOut` / `sourceTag`；`runSync()` 改为 metadata-first；`SyncResult` / `ConsumerState` / `VibeJournalMeta` 加新字段；`UNKNOWN_SKILL_POLICY` 常量 |
| `scripts/sync-vibe-journal.mjs` | 新增 `--policy=auto-register\|pending-review` 覆盖；CLI 输出 `metadata/fallback/autoRegistered/pending` 计数 + 明细 |
| `src/data/vibe-journal-consumer-state.json` | schema 迁移：增加 `metadataHashes / autoRegisteredSkills / pendingSkillCandidates / metadataParseErrors`（forward-compat 缺失时回退到空） |
| `src/data/vibe-journal-meta.json` | schema 迁移：增加 `lastRunMetadataFiles / lastRunMetadataParseErrors / lastRunFallbackDeliverables / lastRunAutoRegisteredSkills / pendingSkillCandidates` |
| `AGENTS.md` | 状态字段补全；新增 "Metadata-first 输入优先级" / "未知技能处理" 章节 |
| `PROGRESS.md` | 追加阶段 7 详情 |

### 后续
- 未来总 cron A 写 metadata 后，B 直接 `npm run sync:vibe-journal` 即可；不需要修改任何下游代码
- 若想把未知技能落到更保守的"待 review"模式，cron 命令加 `--policy=pending-review` 即可
- `metadataParseErrors` 是 review 入口：repo 出现新 error 通常意味着上游 schema 漂移或 hash 漂移

## 个人简历内容升级

- 新增 `个人简历.md` 作为当前个人信息、能力边界、工作经历、代表项目、教育与开源贡献的内容依据。
- 新增 `src/data/resume.ts` 作为页面共享数据源，统一首页、关于、技能、工作经历与项目页的核心事实，减少多页面内容漂移。
- 首页定位更新为“AI 应用构建者 / 全栈工程师”；代表项目更新为 AXMORF Studio、Luju Living、Vibe Journal Pipeline、SyringeMeter、Viselora、Hero Next 与 RAG 原型。
- AI 页面改为当前的能力观、开放问题与工具选择方法；工程实录改为 Agent-first 的环境隔离、工程规则、辅助能力与 Skill 演变。
- 技能页明确数值是同步层维护的“识别与使用记录”，不是主观掌握度；未手工修改 `skills.json`。
- `npm run build` 已通过；桌面 1440×1000 与移动端 390×844 已完成首页、项目页和 Agent 工程页截图检查。

## 阶段 8 详情（工程手账设计系统）

### 目标与结果

- 将深色 neon / AI 控制台观感改成浅色、有人味的工程师工作手账。
- 以 `src/styles/tokens.css` 统一灰绿纸张、石墨文字、工程蓝、印章红与荧光笔黄；保留旧颜色变量作为兼容别名。
- 9 个页面统一采用纸张卡片、手绘边框、编号、标签、时间线和低强度背景线稿。
- 移除 `GenerativeDesignProvider`、随机 theme/layout、localStorage TTL 与导航栏“换一版”，页面视觉稳定可复现。
- Navbar 继续保持 fixed 吸顶，移动端菜单继续使用实底背景。

### 验证

- `npm run build`：通过。
- 桌面和移动端检查 9 个路由：页面均可访问，导航交互正常，控制台无报错。
- 基线版本提交：`205db8e feat: redesign resume as an engineering notebook`。

## 阶段 9 详情（手绘插画层）

### 目标与结果

- 在工程手账设计系统之上增加真正参与叙事的插画，不把插画当作无关装饰。
- `hero-workbench.webp`：首页展示“想法 → 协作 → 代码 → 验证 → 交付”的工作台。
- `projects-blueprint.webp`：项目页展示可检查的系统蓝图与交付路径。
- `practice-journal.webp`：Vibe 日志页展示实验、失败、修复、验证的实践记录。
- 3 张资源均为本项目生成的透明背景 WebP；CSS 提供纸张托底、标题签和响应式布局。
- 修复移动端长代码与文章列表的换行规则，避免 Vibe 日志产生页面级横向溢出。

### 验证

- `npm run build`：通过。
- 9 个路由在桌面与移动端均返回 200；3 张插画全部加载成功。
- 首页到项目页、移动端菜单到项目页/关于页的交互通过。
- 页面无横向溢出，浏览器控制台无错误，`git diff --check` 通过。

## 阶段 10 详情（生产部署去公网 SSH，已由阶段 12 替代）

### 根因

- 原链路要求 GitHub-hosted Runner 通过公网 IPv4 和路由器端口映射 SSH 进入生产机。
- 失败时本机 `sshd` 正常监听，但系统日志没有任何来自 Runner 的连接，说明请求未到达主机；更新动态公网 IP 后仍无法到达，入口还受端口映射或运营商网络影响。
- 这类故障无需修改项目代码也会发生，因此不再把公网入站 SSH 作为部署前提。

### 新链路

- systemd user timer 每分钟在生产机执行 `scripts/deploy-production.sh`，通过 HTTPS 主动 fetch GitHub `main`。
- 脚本拒绝 tracked dirty tree 和分支分叉，只允许 fast-forward；Docker 构建失败时不会替换现有容器，并会在下次 timer 继续重试。
- Docker 镜像写入 `version.txt`；Nginx 对该文件禁用缓存。
- GitHub Actions 仍运行干净环境生产构建，并等待线上 `version.txt` 等于 `github.sha`，以线上 revision 而不是“命令已执行”作为成功标准。

## 阶段 11 详情（公开身份与手绘角色）

### 目标与结果

- 公开页面、SEO、简历文档、导航与页脚统一使用 `AXMORF`，不再展示真实姓名。
- 移除 `public/ai-photo.jpg` 真人证件照，新增 768×768 透明手绘角色 `public/illustrations/profile-avatar.webp`，压缩后约 96 KB。
- 关于页头像卡使用工程蓝、灰绿纸张与墨线水彩语言，与现有工程手账设计保持一致。
- `redactPublicContent()` 在同步时脱敏浏览器侧 `vibe-journal-meta.json` 和 HTML 快照，上游原文、消费状态和技能计分逻辑不受影响。
- 运维相关的历史名称 `xuli-resume` 暂保留于仓库、systemd 单元和部署路径，避免为一次视觉与隐私修改引入部署迁移。

### 验证

- `npm run sync:vibe-journal` 连续运行两次：均为 `newDeliverables=0`、`increments=0`。
- `npm run build`：通过。
- 关于页完成 1440×1000 桌面端与 390×844 移动端浏览器检查；页面无溢出，控制台无错误。
- 实际打开包含原始私有姓名的 Vibe Journal 文档，浏览器只显示 `AXMORF`；源码可见文本、生成快照和 `dist/` 均无真实姓名与旧照片引用。

## 阶段 12 详情（生产托管迁移至 Vercel）

### 目标与结果

- 采用 Vercel 原生 Git 集成：`main` 作为 Production Branch，其他分支和 Pull Request 自动生成 Preview Deployment。
- 生产仓库迁移为 `agenticnoob/xuli-resume` fork；本地 `origin` 指向该 fork，`upstream` 保留 `Skedush/xuli-resume`。
- 新增 `vercel.json`，将所有前端路由 rewrite 到 `index.html`，支持 React Router 深链接。
- GitHub Actions 改为纯构建门禁，不再轮询本地 `/version.txt` 或承担第二套发布逻辑。
- 删除仓库中的 Dockerfile、Docker Compose、Nginx、systemd timer 与本地主动拉取脚本，避免新旧发布权威并存。

### 切换与验证

- Vercel 项目 `agent-first/xuli-resume` 的首次 Production Deployment 状态为 `READY`，生产别名为 `xuli-resume.vercel.app`。
- `resume.zzzxc.com` 已通过 Vercel `configured-correctly` 校验，权威 DNS 指向项目专属 Vercel CNAME。
- 旧 `xuli-resume-deploy.timer` 已禁用并移入回收站；旧容器已停止并删除，8888 端口不再监听；其他 Cloudflare Tunnel 与项目未改动。
- Vercel Git 连接已绑定 `agenticnoob/xuli-resume`，Production Branch 为 `main`。
