# 项目记忆 (Chaniug-v2)

## 项目来源与隔离约束
- 本项目 (D:\Chaniug-v2) 是从老项目 `github.com/Chaniug/Chaniug` 复制而来的**全新独立项目**。
- 核心约束：**新项目改动不影响老项目，老项目内容也不应污染新项目**。两个项目在 git、记忆、配置、内容层面都要独立演进。
- 老项目本地路径未知；所有改动一律只在此目录内进行，绝不跨目录修改任何文件。

## 当前隔离状态 (2026-07-09 完成)
- ✅ git remote 已配置 `origin` → `github.com/Chaniug/chaniugv2`（public，已上传，与老项目完全独立）
- ✅ 工程记忆 (.workbuddy) 独立于此目录，不与其它项目共享
- ✅ 老项目**特有**引用已全部清理：package.json / CNAME / README.md / docs/PROJECT.md / index.html / js/personal.min.js / .vscode/launch.json 中的旧仓库 `Chaniug/Chaniug`、旧域名 `valk.ccwu.cc`、旧邮箱 `cheniug99@gmail.com`、QQ `1247903536`、老本地路径 `d:\mychaniug\Chaniug`、项目标题名均已替换
- ✅ 保留的**用户身份**标识：GitHub 用户名 `Chaniug`、社交账号 `x.com/valkjin` / `t.me/valkjin`、文案 `Valkjin`、GitHub 统计与蛇图查询用户名 `Chaniug`
- ⚠️ 待用户替换的中性占位符：邮箱 `you@example.com`、QQ `your-qq`、品牌名 `Your Name`、项目名 `Your Project`（域名已统一为默认 `Chaniug.github.io/chaniugv2`，CNAME 已删除）
- ✅ 已删除 `CNAME` 文件，GitHub Pages 使用默认域名 `https://Chaniug.github.io/chaniugv2/`
- GitHub Actions：`.github/workflows/jekyll-gh-pages.yml`（push main 自动部署 Pages）+ `snake.yml`（每日生成贡献蛇图到本仓库 output 分支，不会回写老项目）
