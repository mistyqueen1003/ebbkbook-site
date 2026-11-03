# 拆书笔记

读书笔记站点。纯静态：HTML + Markdown + Mermaid，无需服务器、无需联网。

**在线访问**：<https://mistyqueen1003.github.io/ebbkbook-site/>

## 收录

| 书名 | 作者 |
|---|---|
| [梅奥诊所疼痛缓解指南](books/mayo-clinic-guide-to-pain-relief/index.html) | Barbara K. Bruce, Ph.D., L.P. |

## 说明

- 本站只包含**拆书笔记**（结构梳理、核心概念、可执行清单），不含原文全文与扫描图。
- 笔记为个人阅读整理，**不构成医疗或专业建议**。
- 原书版权归作者与出版方所有。

## 结构

```
index.html                    书库首页
assets/                       样式、脚本、marked 与 mermaid（本地内置）
books/<slug>/index.html       拆书页（由 notes.md 构建生成）
books/<slug>/notes.md         笔记源文件（纯 markdown）
```
