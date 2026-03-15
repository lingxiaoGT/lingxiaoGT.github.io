\# Minecraft 工具导航站



欢迎来到 \*\*Minecraft 工具\*\*——一个开源的 Minecraft 工具与资源导航站。这里收录了超过 280 个精选链接，涵盖网页版 MC、工具类、Wiki 百科、社区论坛、模组资源、启动器、材质光影、服务器技术等方方面面。



\*\*在线地址\*\*：\[https://lingxiaogt.github.io](https://lingxiaogt.github.io)



---



\## 主要功能



\- 分类折叠 – 9 个主要分类，每个分类下卡片可折叠，界面清爽。

\- 拼音搜索 – 支持输入拼音（如“mokuai”）搜索工具名称和描述。

\- 收藏 / 对比 – 收藏常用工具，或选择多个工具一键对比。

\- 随机探索 – 随机跳转一个工具，发现新大陆。

\- 统计图表 – 查看各分类工具数量及状态分布。

\- 暗色模式 – 一键切换，保护眼睛。

\- 反馈 / 提交新工具 – 点击卡片上的铅笔图标反馈问题，或通过页脚表单提交新工具。

\- PWA 支持 – 可安装到桌面，像原生 App 一样使用，并支持离线访问。

\- 社区讨论 – 集成 Giscus，通过 GitHub 账号登录后即可留言。



---



\## 技术栈



\- 前端框架：原生 HTML + Tailwind CSS（CDN 版）

\- 图标库：Font Awesome 6.0

\- 图表：Chart.js 4.4

\- 拼音搜索：pinyin-pro

\- 表单处理：Web3Forms（免费，无需后端）

\- 评论系统：Giscus（基于 GitHub Discussions）

\- 托管：GitHub Pages（免费，自带 HTTPS）

\- PWA：自定义 manifest.json 和 Service Worker



---



\## 本地运行



1\. \*\*克隆仓库\*\*  

&nbsp;  ```bash

&nbsp;  git clone https://github.com/lingxiaoGT/lingxiaoGT.github.io.git

&nbsp;  cd lingxiaoGT.github.io

&nbsp;  ```



2\. \*\*启动本地服务器\*\*  

&nbsp;  由于浏览器安全策略，直接打开 index.html 无法加载外部 fetch，需要启动一个简单的 HTTP 服务器。  

&nbsp;  如果你有 Python：  

&nbsp;  ```bash

&nbsp;  python -m http.server

&nbsp;  ```  

&nbsp;  或者使用 VS Code 的 Live Server 插件。



3\. \*\*访问网站\*\*  

&nbsp;  打开浏览器，访问 `http://localhost:8000` 即可。



---



\## 贡献指南



欢迎任何形式的贡献！你可以通过以下方式参与：



\- 提交新工具：点击页脚“提交新工具”按钮，填写信息后，我会手动审核并添加到 tools.json。

\- 报告失效链接：点击卡片上的铅笔图标反馈，或通过页脚“报告失效”发送邮件。

\- 改进代码：提交 Pull Request，优化功能或修复 Bug。

\- 完善标签映射：如果发现新标签未正确归类，可以修改 tag-mapping.json 并提交。



---



\## 支持项目



如果你喜欢这个导航站，欢迎通过 \[爱发电](https://ifdian.net/a/gt0507) 支持作者。你的支持将帮助我持续维护和更新工具站！



---



\## 许可证



本项目采用 \*\*MIT 许可证\*\*，详情请见 LICENSE 文件。



---



\## 致谢



\- 感谢 GitHub 提供免费托管服务。

\- 感谢每一位使用和贡献的朋友！(●'◡'●)



---



\*\*Minecraft 工具\*\* · 持续更新中  

最后更新：2026年3月

