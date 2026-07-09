# 项目记忆 (Chaniug-v2)

## 项目来源与隔离约束
- 本项目 (D:\Chaniug-v2) 是从老项目 `github.com/Chaniug/Chaniug` 复制而来的**全新独立项目**。
- 核心约束：**新项目改动不影响老项目，老项目内容也不应污染新项目**。两个项目在 git、记忆、配置、内容层面都要独立演进。
- 老项目本地路径未知；所有改动一律只在此目录内进行，绝不跨目录修改任何文件。

## 当前隔离状态 (2026-07-09 确认)
- ✅ git remote 已清空（复制时断开），新项目不会误推到老仓库。
- ✅ 工程记忆 (.workbuddy) 独立于此目录，不与其它项目共享。
- ⚠️ 以下内容仍残留老项目引用，属于"老项目内容影响新项目"，待用户确定新品牌/域名后再清理：
  - package.json：`repository` / `bugs` / `homepage` 指向老项目
  - README.md / CHANGELOG.md：仍是老项目内容
  - CNAME：`my.valk.ccwu.cc`（与老项目相同域名，部署会冲突）
  - index.html：硬引用 `Chaniug` 用户名、`my.valk.ccwu.cc`、贡献蛇图 raw.githubusercontent.com/Chaniug/Chaniug
  - js/personal.min.js：含老项目引用（minified）
