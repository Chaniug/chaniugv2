# 组件化迁移手册（Valkjin 个人主页 → Astro）

> 本手册为**只读分析产物**，供主代理将现有纯静态页面重写为 Astro 组件时参考。
> 所有事实均提取自 `index.html` / `css/modules/*` / `js/*` / `data/modals.json` / `docs/PROJECT.md`。
> 当前仓库根已存在 Astro 脚手架：`astro.config.mjs`、`src/{layouts,pages,styles}/`、`package.json` 已含依赖
> `(@tsparticles/slim, canvas-confetti, gsap, vanilla-tilt)` —— **其中 `canvas-confetti` 与 `vanilla-tilt` 在现有 `personal.min.js` 中并未实际使用**，重写时应作为现代替代引入（见第二章）。

---

## 一、区块清单（按 index.html 出现顺序）

行号区间为肉眼+脚本核对结果。每个区块给出：行号区间 / 中文文案 / 关键 SVG / 使用的 CSS class（标注来源模块）/ JS 驱动。

### 0. `<head>` 与全局注入（行 1–97）
- **文案**：站点标题 `Valkjin · 探索未来的开发者`；description/OG/Twitter 文案 `Your Name — 热爱前沿技术的开发者…`。
- **关键 SVG（内联 favicon，行 31）**：渐变圆环 + 三角路径，`linearGradient id="g"`。
- **CSS**：首屏内联 `<style>`（critical CSS）写死了 `--bg-deep/--text-primary/--accent-*` 等少量令牌；深色半透明 `.site-nav`、`.reveal{opacity:0}`、三个 canvas 固定最底层。
- **JS 驱动**：无运行时逻辑；注意第 43–44 行预加载带 `?v=20260701-*` 缓存戳，迁移后用 Astro 资源哈希替代。

### 1. 顶部导航 `#siteNav`（行 100–121）
- **文案**：Logo 文字 `Valkjin`；导航项 `About / Skills / Stats / Contact`。
- **关键 SVG（内联，行 104）**：navLogo 渐变 `linearGradient id="navLogoGrad"`（#4f8cff→#a855f7），圆+折线路径。
- **CSS class 与来源**：
  - `site-nav` ← `layout.css`(固定底) + `navigation.css`(主样式) + `responsive.css`
  - `nav-inner / nav-logo / nav-links / nav-link / nav-toggle / nav-indicator` ← `navigation.css`（均含 `responsive.css` 覆盖）
- **JS 驱动**：`personal.min.js`「Navigation」块——`#navToggle` 汉堡菜单、`#navIndicator` 下划线指示器随滚动高亮（函数 `Ie` 监听 scroll，定位到 `#navLinks` 各 `.nav-link` 对应 `section`）。

### 2. 全局背景层（行 123–140）
- **结构**：3 个 `<canvas>`（`#starfield` 星空 / `#nebula` 星云 / `#starDust` 星尘）+ 4 个 `.orb`（浮动光球）+ `#spotlight`（鼠标聚光灯）+ 4 个纹理 overlay（`.noise-overlay` 噪点 / `.grid-overlay` 网格 / `.scanline-overlay` 扫描线 / `.hex-mesh-overlay` 蜂窝）。
- **CSS class 与来源**：
  - `starfield/nebula/starDust` ← 无显式 class 规则（由 inline + `layout.css` 定位，`position:fixed;z-index:-1`）
  - `orb / noise-overlay / grid-overlay / marquee-*` ← `layout.css`；`scanline-overlay / hex-mesh-overlay` ← `animations.css`+`layout.css`
  - `spotlight` ← 由 JS 注入 `transform`，样式在 `layout.css`
- **JS 驱动**：`personal.min.js` 三个独立 `requestAnimationFrame` 循环（函数 `C`/`j`/`G` 对应三 canvas，约 180+25+120 粒子）；`#spotlight` 鼠标缓动跟随（函数 `Ke`，触摸端禁用）；`visibilitychange` 统一暂停/恢复三循环；`prefers-reduced-motion` 停止。

### 3. HERO 首屏 `#hero`（行 145–228）
- **文案**：
  - 头像 `alt="valkjin 头像"`，状态 `title="在线"`。
  - 签名区 `aria-label="Valkjin 签名"`，**签名路径本身在 `img/valkjin.svg`**（运行时 fetch 注入，见下）。
  - 代码编辑器内容（3 态，行 182–189 为 `error` 态）：
    - `// valkjin — creative developer`
    - `const developer = { role: "前端架构 × AI", stack: ["LLM","自动化","创意工具"], motto: "用代码点亮数字世界", status: "co-creating the future" }`
    - `// ✖ SyntaxError: expected ','`
    - 文件名 `~/valkjin/profile.ts`、语言标签 `TS`、提示 `▸ click to fix`。
  - 社交按钮 title：`个人主页 / X (Twitter) / Telegram / 邮箱 / GitHub`；终端占位 `enter code...`。
  - 滚动引导 `// scroll to explore` + `↓`。
- **关键 SVG**：
  - 编辑器底栏 5 个内联图标（行 203–215）：主页（圆+经纬）、X（✕形）、Telegram（纸飞机）、邮箱（信封）、GitHub（octocat 轮廓）。
  - 装饰 `hero-orbits` 三个 `.orbit-ring`（纯 CSS）。
- **CSS class 与来源**（主：`hero.css`，几乎全含 `responsive.css`）：
  - `hero / section-inner / hero-content / hero-orbits / orbit-ring / avatar-wrapper / avatar / avatar-status / hero-signature / signature-inner / hero-bio / editor-titlebar / editor-dots / editor-filename / editor-lang / editor-body / code-content / code-line / tok-* / hero-terminal / terminal-input / editor-statusbar / editor-status / editor-actions / action-btn / scroll-hint` ← `hero.css`
  - `signature-inner` 同时 ← `signature.css`（签名绘制动画）
- **JS 驱动**：
  - `personal.min.js`「Signature」：fetch `img/valkjin.svg` → 注入 `.signature-inner` → 注入 `linearGradient#signature-gradient`（#f59e0b→#f472b6→#22d3ee→#0ea5e9）→ 添加 `.svg-glow` 完成信号。
  - `editor-interact.js`（源码已读）：`#editorBody` 点击循环 `error→fixed→result`，逐行入场（`line-in`/`shake`），派发 `editor-state-change`。
  - `hero-sync.js`（源码已读）：监听签名 `.svg-glow` → 解锁代码框入场（`narrative-code-enter`）；监听 `editor-state-change` 给 `.hero-content` 设 `data-sync-state`（error 触发头像+签名微抖）；hover 同步呼吸。
  - 终端彩蛋在 `personal.min.js`：监听 `#terminalInput` Enter，值 `=== "your-qq"` 时显示 `#easterEggOverlay`（注意：占位文案是 enter code，但触发词是 `your-qq`，重写时建议统一）。

### 4. 滚动字幕 Marquee（行 230–254）
- **文案**（重复两组，用于无缝滚动）：`Courage · Perseverance · Resilience · Innovation Changes the World · Forge Ahead · Tech for Good · Craft with Passion · Break Boundaries`。
- **CSS class 与来源**：`marquee-section / marquee-track / marquee-content / marquee-dot` ← `layout.css`（动画来自 `animations.css` 的 `marquee` 相关 + `layout.css`）。
- **JS 驱动**：纯 CSS 动画，无 JS。

### 5. ABOUT `#about`（行 259–690）
- **区块标签**：`A B O U T`。
- **卡片 1（何以为我 / 全宽轮播）行 268–459**：
  - 文案：`Know Thyself` / `何以为我` / `Valkjin`；`Full-Stack Engineer & Indie Developer`；`AI 驱动产品与自动化，构建有序的数字世界。`
  - Slide2 `Into the Unknown`/`向何而去`/`Pathfinder` + 两个细节项（`LLM 应用架构 · 智能体工作流`、`端侧 AI 推理 · 优化与部署`）。
  - Slide3 `The Making`/`何以筑之`/`The Architect` + 两个细节项（`开发者工具链 · 自动化效率`、`开源社区贡献 · 技术分享`）。
  - 每张图用 `picture`（webp 优先 + png 回退 + `onerror` 画廊兜底 SVG）。
  - 轮播控件：`.carousel-prev / carousel-pause-btn / carousel-dots-inner / carousel-next`，play/pause 图标切换。
  - **关键 SVG**：Slide1 浏览器插画（行 278–293）、Slide2 神经网络圆点（324–338）、Slide3 文档分层（386–394）、画廊兜底 SVG（312 等）。
  - **CSS**：`about / section-label / about-grid / about-card / glass-card / about-card-hero / hero-slideshow / hero-slideshow-track / hero-slide / hero-slide-text / hero-slide-image / gallery-image-wrapper / carousel-*` ← `about.css` + `explore.css`（图片变体）+ `responsive.css`。
  - **JS**：`personal.min.js`「Hero Slideshow」自动轮播（间隔 `7000/6500/6500` ms）+ 上/下一张 + 暂停；「About Observer」`IntersectionObserver` 控制轮播播放/暂停；图片懒加载（HTML 用 `data-src`/`data-srcset` + JS 回填）。
- **卡片 2（探索方向 / Explore）行 464–541**：
  - 文案：`探索方向`/`Exploration`；chips：`多模态感知 / 知识推理 / 模型可解释性`；副文 `从语义理解到多模态对齐…`；引用 `「万物静观皆自得」 — 程颢《秋日偶成》`。
  - **关键 SVG**：神经网络节点+连线+中央脉冲（行 467–504，含 `<animate>` 脉冲）。
  - **CSS**：`explore-card / card-illustration / explore-chips / explore-chip / explore-extra / card-content-row / card-content-visual / visual-corner / card-inline-detail / card-quote-footer / fold-quote*` ← `explore.css` + `about.css`（通用卡片壳）。
  - **JS**：chips `data-explore="multimodal|reasoning|explainability"` 点击 → 打开 modal（见第二章 Fetch modals.json）。
- **卡片 3（创造与分享 / Create）行 544–617**：
  - 文案：`创造与分享`/`Create & Share`；chips：`AI 创意工具 / 效率产品 / 开源贡献`；`独立开发是最好的学习方式…`；引用 `「What I cannot create, I do not understand.」 — Richard Feynman`。
  - **关键 SVG**：火箭+火焰（含 `<animate>` 闪烁）+ 轨迹虚线（行 547–580）。
  - **CSS**：`create-card / create-chips / chip-create / create-extra` ← `explore.css`。
  - **JS**：chips `data-create="ai-tools|efficiency|open-source"` → 打开 modal。
- **卡片 4（技术栈 / Tech Stack）行 620–686**：
  - 文案：`技术栈`/`Tech Stack`；chips：`Frontend / Backend / Infra / DevOps`；三列说明 `前端工程 / 后端服务 / 基础设施`；总结 `全栈视野 · 模块化思维 · 追求可维护的工程体系`；引用 `「技进乎道」 — 《庄子·养生主》`。
  - **关键 SVG**：分层架构块 Frontend/Backend/Infra（行 623–638，含 `<text>` 标签）。
  - **CSS**：`tech-card / tech-content-row / tech-extra-grid / tech-extra-col / tech-extra-title / tech-summary` ← `tech-stack.css`。
  - **JS**：chips `data-tech="frontend|backend|infra"` → 打开 modal。

### 6. SKILLS 技能星图 `#skills`（行 695–782）
- **区块标签**：`S K I L L S`。
- **文案**：展开提示 `✦ 点击星核 · 展开星图`。中央星核 `器以载道 / Code as Craft`。
- **节点（14 个，`.constellation-node`，第 722–777 行，由 HTML 静态列出）**：
  | data-skill | data-category | 图标 |
  |---|---|---|
  | JavaScript | lang | `img/icons/javascript.svg` |
  | TypeScript | lang | `img/icons/typescript.svg` |
  | Python | lang | `img/icons/python.svg` |
  | React | fe | `img/icons/react.svg` |
  | Vue | fe | `img/icons/vuedotjs.svg` |
  | Node.js | be | `img/icons/nodedotjs.svg` |
  | Docker | devops | `img/icons/docker.svg` |
  | Linux | devops | `img/icons/linux.svg` |
  | Git | devops | `img/icons/git.svg` |
  | AI / LLM | ai | 内联 SVG（青色星★） |
  | GitHub | devops | `img/icons/github.svg` |
  | Java | lang | `img/icons/openjdk.svg` |
  | Windows | devops | 内联 SVG（四格窗） |
  | Rust | lang | `img/icons/rust.svg` |
- **关键 SVG**：节点图标（本地 svg 或内联）、中央星核（CSS+`.core-pulse`）。连线由 JS 在 `.constellation-canvas` 上绘制。
- **CSS class 与来源**：`constellation / constellation-toggle / constellation-core / core-pulse / core-dot / core-inner / core-motto / motto-cn / motto-en / constellation-nodes / constellation-node / node-icon / node-label / constellation-canvas` ← `tech-stack.css`（+ `responsive.css`）。
- **JS 驱动**：`personal.min.js`「Skills Constellation」——`#skills-constellation` 内 canvas 绘制连线粒子；节点按 `data-category` 取色（`lang:#4f8cff / fe:#22d3ee / be:#a855f7 / devops:#c084fc / ai:#22d3ee`）；支持拖拽 + 大爆炸展开/收拢（IntersectionObserver `threshold:.1, rootMargin:100px` 触发入场）。

### 7. STATS 统计 `#stats`（行 787–934）
- **区块标签**：`S T A T I S T I C S`。
- **4 个计数器（`.counter-number`，行 801–823）**：
  | data-target | suffix | label |
  |---|---|---|
  | 2138 | （无） | Total Commits |
  | 47 | （无，运行时被 GitHub API 覆盖） | Stars Earned |
  | 28 | （无，运行时被覆盖） | Repositories |
  | 4 | `+` | Years Coding |
  注：Stars/Repos 初始值会被 `api.github.com/users/Chaniug` + `/repos` 拉取结果覆盖 `data-target`。
- **哲思标语**：`履霜，坚冰至 — Dripping water hollows out stone.`
- **图表（外部图，行 842–885）**：
  - 语言分布 / 提交语言：`github-profile-summary-cards.vercel.app/api/cards/repos-per-language|most-commit-language?username=Chaniug&theme=tokyonight`
  - 贡献概览：`/cards/profile-details`
  - 贡献动画（贪吃蛇）：`raw.githubusercontent.com/Chaniug/chaniugv2/output/github-contribution-grid-snake.svg`
- **最近项目（行 889–931）**：`R E C E N T  P R O J E C T S`；2 张 fallback 卡片（`chaniugv2` 47★ / 「更多项目」），由 JS 用 GitHub API 动态替换 `#projectsGrid`。
- **关键 SVG**：各 counter 图标（行 799/806/813/820 内联）、图表标签图标、项目卡图标。
- **CSS class 与来源**：`stats-counters / stat-counter-card / counter-icon / counter-number / counter-label / stats-motto* / stats-charts / stat-card / stat-card-accent / stat-label / stat-label-icon / stat-card-chart / stat-card-full / recent-projects / projects-grid / project-card / project-icon / project-info / project-name / project-desc / project-tags / project-tag / project-stars / project-arrow` ← `stats.css`（+ `layout.css` 通用卡片壳 / `responsive.css`）。
- **JS 驱动**：`personal.min.js`「Stats Counters」——`IntersectionObserver` 触发，easeOutCubic（`1-Math.pow(1-s,3)`，1500ms）滚动计数；GitHub API fetch 更新 Stars/Repos 及渲染最近项目。

### 8. CONTACT 联系方式 `#contact`（行 939–1002）
- **文案**：`C O N T A C T`；副标 `期待与你交流 — Let's Connect`。
- **7 张联系卡（`.contact-card`，data-platform）**：
  | platform | name | detail | 可复制 |
  |---|---|---|---|
  | web | 个人主页 | `Chaniug.github.io/chaniugv2` | 否（外链） |
  | x | X (Twitter) | `@valkjin` | 否（外链） |
  | tg | Telegram | `@valkjin` | 否（外链） |
  | wechat | 微信 | `valkjin` | 是（点击复制） |
  | qq | QQ | `your-qq` | 是 |
  | email | 邮箱 | `you@example.com` | 是 |
  | github | GitHub | `@Chaniug` | 否（外链） |
  注：wechat/qq/email 卡带 `.contact-copy-hint`「点击复制」并通过 JS 写入剪贴板；**qq 与 email 当前仍是占位 `your-qq`/`you@example.com`，需在主数据里补真实值**。
- **关键 SVG**：7 个内联联系图标（行 950/957/964/971/979/987/995：地球/ X / 纸飞机 / 微信双气泡 / QQ 企鹅 / 信封 / octocat）。
- **CSS class 与来源**：`contact-subtitle / contact-grid / contact-card / contact-icon / contact-name / contact-detail / contact-copy-hint` ← `contact.css`（+ `layout.css` `glass-card` 壳 / `responsive.css`）。
- **JS 驱动**：`personal.min.js`「Contact Copy」——对 wechat/qq/email 卡 `navigator.clipboard.writeText` + Toast（`Me` 成功 / `Ee` 兜底），键盘 Enter/Space 可触发。

### 9. FOOTER（行 1007–1014）
- **文案**：分隔线 + `不慕往，不闵来`；`© 2023-2026 Valkjin · 用代码点亮数字世界`。
- **CSS**：`site-footer / footer-divider / footer-divider-line / footer-divider-dot / footer-motto` ← `layout.css`。
- **JS 驱动**：无。

### 10. 隐藏彩蛋弹窗 Easter Egg（行 1016–1045）
- **结构**：`.easter-egg-overlay#easterEggOverlay` > `.easter-egg-card.glass-card` > 关闭按钮 `&times;` + `.easter-egg-content`（`.ee-diamond ◇` / `.ee-title` / `.ee-text` / `.ee-divider` / `.ee-signature`）。
- **文案**：标题 `我终于活成了自己讨厌的样子`；正文长段情绪文字（行 1023–1039）；签名 `— 如果这就是人生的答案，那我宁愿没答过这道题`。
- **CSS class 与来源**：`easter-egg-overlay / easter-egg-card / easter-egg-close / easter-egg-content / ee-diamond / ee-title / ee-text / ee-divider / ee-signature` ← `modal.css`（彩蛋复用弹窗层样式）。
- **JS 驱动**：`personal.min.js`「Terminal Egg」——`#terminalInput` 输入 `your-qq` + Enter 打开；`#easterEggClose` / `Escape` 关闭（函数 `Re`/`Be`/`Xe`）。**当前未使用 `canvas-confetti`**，重写时建议打开瞬间调用 `canvas-confetti()` 作为反馈（依赖已装）。

### 11. 脚本注入与 `safeRenderHTML`（行 1047–1054）
- 内联：`window.safeRenderHTML=function(el,html){...}`（personal.min.js 调用，防 chip 点击 ReferenceError）。
- 加载顺序（defer）：`hero-sync.min.js` → `personal.min.js` → `editor-interact.min.js`。`hero-sync` 必须先于 `personal` 以锁定叙事链。
- **重写注意**：Astro 客户端脚本应使用 `is:inline` 或 `<script>` 客户端指令，并保留此顺序（hero-sync 先行）。

---

## 二、JS 功能拆解（面向重写）

下表汇总 `personal.min.js`（42KB，IIFE，无源码注释）可识别功能块，**以及是否建议用现代库替代**。`hero-sync.js`、`editor-interact.js` 为带源码的辅助脚本。

| # | 功能 | 现有实现要点 | 是否应替换 | 重写建议（Astro 客户端脚本 / 框架组件） |
|---|---|---|---|---|
| 1 | 工具函数 | `debounce`（250ms resize）、触摸/低端设备检测 `r()`、`is-scrolling` class、prefers-reduced-motion | 否 | 保留为 `src/lib/utils.ts` |
| 2 | Hero 轮播 | 3 张 slide，自动 `7000/6500/6500ms`，prev/next/pause，dots | 可选 | 抽 `HeroSlideshow.astro` + 客户端脚本；或用轻量轮播库 |
| 3 | About Observer | IntersectionObserver 控制轮播播放/暂停 | 否 | 同上组件内 |
| 4 | 星空背景 | 3 个 canvas：`C`(180 星，三频正弦闪烁+十字星芒) / `j`(25 星云) / `G`(120 微尘)；`visibilitychange` 暂停 | **是** | **用 `@tsparticles/slim` 替代**三 canvas，单一粒子背景组件；自动处理暂停/reduced-motion |
| 5 | Spotlight | `#spotlight` 鼠标缓动跟随，触摸端禁用 | 可选 | 纯 CSS 变量 + 轻脚本，或并入背景组件 |
| 6 | Reveal 渐显 | IntersectionObserver 给 `.reveal` 加 `.visible`（threshold .15） | 否 | 抽 `reveal` 客户端指令 / 小脚本，或直接用 `astro-animate`/CSS |
| 7 | SVG 签名 | fetch `img/valkjin.svg` → 注入 → 注入 `linearGradient#signature-gradient` → `.svg-glow` | 否 | 迁移 SVG 到 `public/`，组件内 fetch 或用 `<svg>` 内联 + CSS `stroke-dashoffset` 动画 |
| 8 | 编辑器 3 态 | `editor-interact.js`：error/fixed/result 循环、逐行入场、派发事件 | 否（已有源码） | 直接迁移为 `src/scripts/editor-interact.ts` |
| 9 | 叙事联动 | `hero-sync.js`：签名完成→解锁代码框；状态同步；hover 呼吸 | 否（已有源码） | 直接迁移为 `src/scripts/hero-sync.ts` |
| 10 | Skills 星图 | canvas 连线粒子 + 14 节点拖拽 + 大爆炸展开 | **部分** | 连线/粒子可用 tsparticles 辅助；节点拖拽保留手写（或 `gsap` 做缓动） |
| 11 | Stats 计数 | `IntersectionObserver` + easeOutCubic，1500ms | 否 | 抽 `Counter.astro` 客户端脚本 |
| 12 | GitHub 数据 | fetch `api.github.com/users/Chaniug` + `/repos` → 覆盖 Stars/Repos、渲染 `#projectsGrid` | 否（注意限流） | 抽 `GitHubStats.astro`，或在构建期用 Astro SSR/端点拉取 |
| 13 | Contact 复制 | `navigator.clipboard.writeText` + Toast | 否 | 抽 `ContactCard.astro` + 复制脚本 |
| 14 | 导航 | 滚动高亮 + `#navIndicator` + 汉堡菜单 | 否 | `SiteNav.astro` + 滚动脚本 |
| 15 | 玻璃卡光晕 | 鼠标光晕跟随（`--mouse-x/y`） | 否 | `glass-card` 客户端指令 |
| 16 | Modal 渲染 | `fetch("data/modals.json")` → `Ye`；chips 打开 modal（`Be`/`Re`/`Xe`/`safeRenderHTML`） | 否 | data 抽到 `src/data/modals.ts`，Modal 组件接收 props 直接渲染（**无需运行时 fetch**，构建期内联） |
| 17 | 终端彩蛋 | `#terminalInput` 输入 `your-qq` → 显示 `#easterEggOverlay` | 否（建议加 confetti） | 保留逻辑 + **打开时调用 `canvas-confetti()`** |
| — | 3D tilt | 现有**手写**（无 vanilla-tilt 调用） | **是** | 用 `vanilla-tilt` 给卡片加 3D 倾斜（依赖已装） |
| — | 彩蛋反馈 | 现有无 confetti | **是** | 用 `canvas-confetti`（依赖已装） |

**重要依赖现状**：`package.json` 已含 `@tsparticles/slim`、`canvas-confetti`、`gsap`、`vanilla-tilt`，但 `personal.min.js` 当前**仅用到原生 API**（confetti/tilt 均为 0 次引用）。重写时应真正启用这些库，删除手写 canvas 星空的 ~1000 行。

---

## 三、数据提取建议

### 3.1 `data/modals.json` 结构
顶层 3 个分组，共 **9 条**：
- `techStack`（3 条）：`frontend` / `backend` / `infra`
- `explore`（3 条）：`multimodal` / `reasoning` / `explainability`
- `create`（3 条）：`ai-tools` / `efficiency` / `open-source`

每条字段：
| 字段 | 类型 | 说明 |
|---|---|---|
| `title` | string | 中文标题（如 `前端开发`） |
| `subtitle` | string | 英文副标题（如 `Frontend Development · 用户界面与交互体验`） |
| `icon` | string(HTML) | **内联 SVG 字符串**（带 `class="tech-modal-icon-svg"` 与各自的 `linearGradient id`，如 `icon-fe-grad`） |
| `details` | string(HTML) | 富文本（`<h4>/<ul>/<li>/<p>/<span class='tech-tag'>`），弹窗主体 |

> 重写建议：转为 `src/data/modals.ts` 的 TS 对象（类型化），直接在 Modal 组件中渲染，**移除运行时 `fetch("data/modals.json")`**。注意 SVG 中 `linearGradient` 的 `id` 必须全局唯一，避免多实例冲突（可加前缀）。

### 3.2 联系卡字段（建议抽到 `src/data/site.ts`）
| key | 当前值 | 备注 |
|---|---|---|
| web | `Chaniug.github.io/chaniugv2` | 外链 |
| x | `@valkjin` / `https://x.com/valkjin` | 外链 |
| tg | `@valkjin` / `https://t.me/valkjin` | 外链 |
| wechat | `valkjin` | **需复制**（占位待补真实微信号） |
| qq | `your-qq` | **占位，需补真实 QQ** |
| email | `you@example.com` | **占位，需补真实邮箱** |
| github | `@Chaniug` / `https://github.com/Chaniug` | 外链 |

### 3.3 统计数字（建议抽到 `src/data/site.ts` 或构建期常量）
- 4 个计数器：`commits: 2138`、`stars: 47`（运行时会用 GitHub API 覆盖）、`repos: 28`（同）、`years: 4`（`+` 后缀）。
- GitHub 用户名：`Chaniug`（用于 API、summary-cards、snake SVG 三处 URL）。
- 外部图 URL 汇总（重写字面量）：
  - `https://github-profile-summary-cards.vercel.app/api/cards/repos-per-language?username=Chaniug&theme=tokyonight`
  - `.../most-commit-language?...`
  - `.../profile-details?...`
  - `https://raw.githubusercontent.com/Chaniug/chaniugv2/output/github-contribution-grid-snake.svg`

### 3.4 适合构建期数据化的内容
- `src/data/site.ts`：`siteName="Valkjin"`、社交链接、联系卡、GitHub 用户名、统计初始值、SEO meta、OG/Twitter 文案。
- `src/data/modals.ts`：9 条 modal（title/subtitle/icon SVG/details HTML）。
- `src/data/skills.ts`：14 个技能节点（name/category/icon 路径或内联）。
- `src/data/nav.ts`：导航锚点列表。
- 轮播图/配图/头像：移入 `public/img/`，组件用 Astro 资源导入或 `<picture>`。

---

## 四、SVG 图标清单

### 4.1 本地 SVG 文件（`img/`，共 13 个 = `valkjin.svg` + `icons/` 12 个）
| 文件 | 用途 | 引用位置 |
|---|---|---|
| `img/valkjin.svg` | 手写签名路径（运行时 fetch 注入 `.signature-inner`） | HERO 签名 |
| `img/icons/javascript.svg` | JS 技能节点图标 | Skills 节点 |
| `img/icons/typescript.svg` | TS 节点 | Skills |
| `img/icons/python.svg` | Python 节点 | Skills |
| `img/icons/react.svg` | React 节点 | Skills |
| `img/icons/vuedotjs.svg` | Vue 节点 | Skills |
| `img/icons/nodedotjs.svg` | Node.js 节点 | Skills |
| `img/icons/docker.svg` | Docker 节点 | Skills |
| `img/icons/linux.svg` | Linux 节点 | Skills |
| `img/icons/git.svg` | Git 节点 | Skills |
| `img/icons/github.svg` | GitHub 节点 + 联系卡 + 编辑器底栏 | Skills / Contact / Hero |
| `img/icons/openjdk.svg` | Java 节点 | Skills |
| `img/icons/rust.svg` | Rust 节点 | Skills |

> 迁移：将上述 12 个 `icons/*.svg` 与 `valkjin.svg` 复制到 `public/img/`（保持路径）或作为 Astro 组件内联导入；技能节点改用 `<img src={icon}>` 或 `import` 导入。

### 4.2 内联 SVG（关键 id / class，便于迁移为组件或 public）
| 位置 | 关键 class / id | 用途 |
|---|---|---|
| 导航 Logo（行 104） | `linearGradient id="navLogoGrad"` | 导航渐变标志 |
| favicon（行 31） | `linearGradient id="g"` | 浏览器标签图标 |
| HERO 编辑器底栏（203–215） | `.action-btn` 内 5 个 `<svg>` | 主页/X/Telegram/邮箱/GitHub 按钮 |
| ABOUT Slide 插画（278/324/386） | `.hero-eyebrow-icon`、`.card-illustration` | 浏览器/神经网络/文档 |
| 探索卡神经网络（467–504） | 节点 `<circle>` + `<line>` 连线 + `中央脉冲 <animate>` | 探索方向插画 |
| 创造卡火箭（547–580） | `.flame-outer/.flame-inner` + `<animate>` | 火箭升空 |
| 技术栈卡分层（623–638） | `<rect>` 三分层 + `<text>` Frontend/Backend/Infra | 架构图 |
| Skills 节点内联（759/771） | `.node-icon-ai`（★）、Windows 四格 | AI/Windows 节点 |
| STATS 图标（799/806/813/820/865/878/911/928） | `.counter-icon`、`.stat-label-icon`、`.project-icon` | 各计数器/图表/项目卡 |
| CONTACT 图标（950–995） | `.contact-icon` 内联 | 7 个联系平台图标 |
| Modal icon（modals.json） | `class="tech-modal-icon-svg"` + `linearGradient id="icon-*-grad"` | 弹窗大图标（9 个） |
| 签名渐变（JS 注入） | `linearGradient id="signature-gradient"` | 签名描边渐变 |

> 注意：多个内联 SVG 使用**相同 id** 的 `linearGradient`（如 nav、favicon、各 modal 的 `icon-*-grad`）。迁移为 Astro 组件复用时要**确保 id 全局唯一**（加组件作用域前缀），否则渐变会错乱。

### 4.3 图片资源（移入 `public/img/`）
- 头像：`avatar.jpg` / `avatar.webp`
- 轮播：`slide1~3.png` / `slide1~3.webp`
- 配图：`02~04.jpg` / `02~04.webp`
- 使用 `<picture>`（webp 优先 + jpg/png 回退 + `onerror` 画廊兜底），重写时建议用 Astro 内置 `<Image>`/`getImage` 或保留 `<picture>`。

---

## 附录：迁移落地快速索引
- **布局骨架**：`BaseLayout.astro`（head meta + 背景层 + nav + footer + 脚本顺序）。
- **区块组件**：`SiteNav` / `BackgroundField`(tsparticles) / `Hero`(+`EditorInteract`) / `Marquee` / `About`(+`Slideshow`) / `Skills`(星图) / `Stats`(+`Counter`+GitHub 数据) / `Contact` / `EasterEgg` / `Modal`。
- **数据**：`src/data/site.ts`、`src/data/modals.ts`、`src/data/skills.ts`、`src/data/nav.ts`。
- **脚本**：`src/scripts/{hero-sync,editor-interact,personal}.ts`（personal 拆为上述 17 个功能模块）。
- **待补真实数据**：QQ、邮箱、微信、GitHub 统计初始值（当前为占位 `your-qq`/`you@example.com`/占位数字）。
