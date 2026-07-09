# Valkjin · chaniugv2

> 探索未来的开发者 — 用代码点亮数字世界。
> 一个基于 **Astro 5** 重构的现代化个人主页，集成极光粒子背景、霓虹玻璃卡、技能星图与横向滑轨等动态效果。

🌐 在线预览：https://Chaniug.github.io/chaniugv2/

---

## ✨ 特性

- **极光 mesh 背景**：流动渐变光幕 + tsparticles 粒子，区别于传统纯星空。
- **霓虹玻璃卡**：所有卡片默认流光描边 + hover 外发光。
- **Hero 叙事**：旋转渐变光环 + 渐变流光主标题 + 打字机身份标语。
- **横向展示**：联系方式 / 最近项目 / 成长时间轴均为可滑动滑轨（不劫持整页滚动）。
- **明暗主题**：一键切换并 `localStorage` 持久化，含防闪烁脚本。
- **真实数据**：构建期拉取 GitHub 仓库/星数（带静态 fallback，CI 无网也不崩）。
- **零外链图表**：语言分布环形图、星标排行、仓库概览均由本地 SVG 生成，无隐私/性能外链。
- **性能与可达性**：滚动暂停装饰动画、`prefers-reduced-motion` 守卫、移动端降级。

## 🛠️ 技术栈

Astro 5 · TypeScript · Lightning CSS · @tsparticles · GSAP · vanilla-tilt · canvas-confetti

## 🚀 本地开发

```bash
npm install
npm run dev        # 本地开发，默认 http://localhost:4321/chaniugv2/
npm run build      # 构建到 dist/
npm run preview    # 预览构建产物
```

> 可选：构建期设置 `GITHUB_TOKEN` 环境变量可拉取更完整的 GitHub 数据（不设置则使用静态回退）。

## 📦 部署

GitHub Actions（`.github/workflows/deploy.yml`）在 push `main` 时自动构建并发布到 GitHub Pages，站点根路径为 `/chaniugv2/`（见 `astro.config.mjs` 的 `base`）。

## 📁 项目结构

```
src/
├── components/      # Astro 组件（Hero / About / Skills / Stats / Contact / Journey / Modal ...）
├── data/            # 单一数据源（site.ts / skills.ts / journey.ts / modals.json / github.ts）
├── lib/             # 纯函数工具（charts.ts 本地 SVG 图表）
├── layouts/         # BaseLayout（全局样式与脚本装配）
├── pages/index.astro
css/modules/         # 组件级 CSS（按模块拆分）
public/img/          # 静态图片资源
```

数据驱动：文案、技能、时间轴、联系方式均集中在 `src/data/`，改内容无需动组件。

## ✏️ 待替换占位符

- 邮箱 `you@example.com`、QQ `your-qq`、微信 `valkjin`（在 `src/data/site.ts`）
- 如需真实 GitHub 统计，给 CI 配置 `GITHUB_TOKEN`

---

© 2026 Chaniug · 全新独立项目（与老仓库 `Chaniug/Chaniug` 完全隔离）
