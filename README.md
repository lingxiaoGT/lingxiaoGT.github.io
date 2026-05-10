# Minecraft 工具导航站

<div align="center">
  <img src="launchericon-192x192.png" width="128" height="128" alt="Minecraft 工具">
  <h1 align="center">⛏️ Minecraft 工具导航站</h1>
  <p align="center">
    <a href="https://lingxiaogt.github.io">🌐 在线访问</a> •
    <a href="#-功能亮点">✨ 功能亮点</a> •
    <a href="#-技术栈">🛠️ 技术栈</a> •
    <a href="#-本地运行">🚀 本地运行</a> •
    <a href="#-贡献指南">🤝 贡献</a> •
    <a href="#-许可证">📜 许可证</a>
  </p>
  <p align="center">
    <a href="https://github.com/lingxiaoGT/lingxiaoGT.github.io/blob/main/LICENSE"><img src="https://img.shields.io/github/license/lingxiaoGT/lingxiaoGT.github.io?style=flat-square&color=10b981" alt="MIT License"></a>
    <a href="https://github.com/lingxiaoGT/lingxiaoGT.github.io/stargazers"><img src="https://img.shields.io/github/stars/lingxiaoGT/lingxiaoGT.github.io?style=flat-square" alt="GitHub Stars"></a>
    <a href="https://lingxiaogt.github.io"><img src="https://img.shields.io/website?url=https%3A%2F%2Flingxiaogt.github.io&style=flat-square&label=网站&color=10b981" alt="Website"></a>
    <a href="https://github.com/lingxiaoGT/lingxiaoGT.github.io/issues"><img src="https://img.shields.io/github/issues/lingxiaoGT/lingxiaoGT.github.io?style=flat-square" alt="Issues"></a>
    <a href="https://github.com/lingxiaoGT/lingxiaoGT.github.io/commits/main"><img src="https://img.shields.io/github/last-commit/lingxiaoGT/lingxiaoGT.github.io?style=flat-square" alt="Last Commit"></a>
    <a href="https://github.com/lingxiaoGT/lingxiaoGT.github.io"><img src="https://img.shields.io/github/repo-size/lingxiaoGT/lingxiaoGT.github.io?style=flat-square" alt="Repo Size"></a>
  </p>
</div>

**一个精心整理的 Minecraft 工具与资源导航站**，收录 **280+** 精选链接和一个完整的后台管理系统。

## ✨ 功能亮点

| 分类 | 特性 |
|:---|:---|
| **工具导航** | 9 个主要分类，卡片折叠，拼音搜索，一键收藏和对比 |
| **社区互动** | 集成 Giscus 评论，提交新工具，反馈失效链接 |
| **个性化体验** | 暗色模式，PWA 离线支持，多语言（联合国六种工作语言） |
| **管理后台** | 工具审核，轮播图管理，用户登录（支持 GitHub OAuth 等），用户提交统计 |
| **开发者友好** | 模块化代码，独立数据文件，RESTful API，开放数据导出 |

> 网站后台已实现动态数据管理，用户提交的工具会进入审核列表，管理员审核后方可显示。

## 🛠️ 技术栈

| 类别 | 技术 |
|:---|:---|
| 前端 | 原生 HTML + Tailwind CSS + Font Awesome 6 + Chart.js 4 |
| 拼音搜索 | pinyin-pro |
| 后端 | Node.js + Express + SQLite (可迁移到 PostgreSQL) |
| 认证 | Passport.js (GitHub OAuth) |
| 部署 | GitHub Pages + 独立服务器 (支持主备切换) |
| 表单 | Web3Forms |
| 评论 | Giscus |

## 🚀 本地运行

### 1. 克隆仓库
```bash
git clone https://github.com/lingxiaoGT/lingxiaoGT.github.io.git
cd lingxiaoGT.github.io
```

### 2. 启动本地 HTTP 服务器
由于浏览器安全策略，直接打开 `index.html` 无法加载外部数据，需要启动一个简单的 HTTP 服务器。
```bash
python -m http.server  # 默认端口 8000, 访问 http://localhost:8000
```
或者使用 VS Code 的 Live Server 插件。

## 📁 项目结构

```
.
├── index.html
├── manifest.json
├── sw.js
├── LICENSE
├── README.md
├── launchericon-192x192.png
├── launchericon-512x512.png
└── assets/                # 静态资源
    ├── css/               # 样式文件
    ├── js/                # 前端逻辑 (模块化)
    └── data/              # 数据文件
        ├── tools.json          # 所有工具数据
        ├── tag-mapping.json    # 标签合并映射
        └── i18n/               # 语言包 (zh, en, ar, fr, ru, es)
```

## 🔧 维护指南

### 添加新工具
编辑 `assets/data/tools.json`，按格式添加。未映射的标签会自动归入“其他”分类。

### 修复失效链接
运行检测脚本（需要安装 `requests`）：
```bash
pip install requests
python check_links.py
```
生成 `dead_links.json`，手动验证后更新 `tools.json`。

### 调整标签映射
编辑 `assets/data/tag-mapping.json`，将不同原标签映射到同一个父标签。

## 🤝 贡献指南

欢迎任何形式的贡献！

- **提交新工具**：点击网站页脚“提交新工具”按钮，等待后台审核。
- **报告失效链接**：点击卡片上的铅笔图标反馈，或通过页脚“报告失效”发送邮件。
- **改进代码**：提交 Pull Request。
- **完善标签映射**：修改 `tag-mapping.json` 并提交。

## 💖 支持项目

如果你喜欢这个导航站，欢迎通过 **[爱发电](https://ifdian.net/a/gt0507)** 支持作者，你的支持将帮助我持续维护和更新工具站！

## 📜 许可证

本项目采用 **MIT 许可证**，详情见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [GitHub](https://github.com) 提供免费托管服务
- 所有开源库的作者们
- 每一位使用和贡献的朋友

---

<p align="center">
  <b>Minecraft 工具</b> · 持续更新中<br>
  <sub>最后更新：2026年5月</sub>
</p>

<p align="center">
  <a href="https://ifdian.net/a/gt0507">
    <img src="https://img.shields.io/badge/支持-爱发电-946ce6?style=for-the-badge&logo=githubsponsors" alt="爱发电">
  </a>
</p>