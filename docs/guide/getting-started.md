# 快速开始

::: tip 先说两句再开工
Fast Media 还在**持续升级、打磨、抠细节**——功能会加、BUG 会修、体验会一点点变顺手。

文档尽量跟着版本跑，但偶尔也会「软件已经先跑两步、页面还在系鞋带」。如果你发现截图或文案和当前界面有一点点对不上，大概率是迭代太勤，不是你眼花。有疑惑直接按文档里的联系方式敲门就好～
:::

一张图看完：装好 → 激活 → 登录 → 配关键插件 → 验证播放。

```
Docker 部署 → 激活许可证 → 登录
      ↓
设定：API 令牌 + TMDB
      ↓
插件：115 → CloudDrive2 → Emby 媒体服务器
      ↓
整理：链接同步（生成 STRM）
      ↓
Emby 302 路径映射 → 客户端改代理地址
      ↓
可选：RSS / 频道 / 通知 / 助手 / 主题
```

## 1. Docker 部署（推荐）

镜像：[liuxiaodi2026/fast-media](https://hub.docker.com/r/liuxiaodi2026/fast-media)

详细说明与卷映射见 [Docker 部署](./deploy.md)。最短命令：

```bash
mkdir -p fastmedia && cd fastmedia
# 创建 docker-compose.yml（见部署页完整示例）
docker compose pull && docker compose up -d
```

浏览器访问：`http://服务器IP:映射端口`（示例 compose 常见为 `8080` 或 `9000`，以你映射为准）。

## 2. 激活与登录

1. 首次打开进入**激活系统**：复制机械码，联系作者获取许可证密钥后粘贴激活  
2. 使用管理员账号登录（可用环境变量 `ADMIN_USERNAME` / `ADMIN_PASSWORD` 预置）

## 3. 最小可用配置（必做）

| 顺序 | 去做什么 | 入口 |
|------|----------|------|
| 1 | 域名 / API 令牌 / TMDB Key | 设定 → 系统设置 → 基础设置 |
| 2 | 登录 115 账号 | 插件中心 → 115助手 |
| 3 | 连接 CloudDrive2 | 插件中心 → CloudDrive2 |
| 4 | 添加 Emby 媒体服务器 | 插件中心 → Emby → 媒体服务器 |
| 5 | 配置链接同步（STRM） | 整理 & 刮削 → 链接同步 |
| 6 | 配置 Emby 302 + 路径映射 | 插件中心 → Emby → 302 代理 |

逐步字段说明：[初始化配置](./setup.md)

## 4. 常用可选能力

| 模块 | 文档 |
|------|------|
| Emby / 302 / 扫库 | [Emby 配置](./emby.md) |
| CloudDrive2 | [CD2 配置](./cd2.md) |
| 115 与插件 | [插件配置](./plugins.md) |
| RSS / 下载 / 日历 | [RSS 与订阅](./rss.md) |
| 频道资源 / 通知 | [频道与通知](./channels.md) |
| 整理 / STRM / 归档 | [整理与 STRM](./organize.md) |
| 主题 / 看板娘 | [外观与主题](./appearance.md) |

## 参考

- Docker Hub：[liuxiaodi2026/fast-media](https://hub.docker.com/r/liuxiaodi2026/fast-media)
- 密钥索取：见 Docker Hub 简介中的联系邮箱
