# Docker 部署

与 [Docker Hub · liuxiaodi2026/fast-media](https://hub.docker.com/r/liuxiaodi2026/fast-media) 一致：使用已发布镜像，无需本地构建源码。

## 准备目录

```bash
mkdir -p fastmedia && cd fastmedia
```

## docker-compose.yml（推荐示例）

按你机器路径改 volumes；端口按需改左侧宿主机端口。

```yaml
services:
  fast-media:
    container_name: fast-media
    image: liuxiaodi2026/fast-media:latest
    restart: always
    ports:
      - "8080:80"          # Web 入口 → 访问 http://IP:8080
      # - "9002:9002"      # 若使用「独立反代端口」做 302，再按需打开
    environment:
      - TZ=Asia/Shanghai
      - JWT_SECRET=请改成随机长串
      - ADMIN_USERNAME=admin
      - ADMIN_PASSWORD=请改成强密码
      # - LICENSE_KEY=你的许可证密钥
    volumes:
      - ./data:/app/data                           # 数据库 / 日志 / 上传（必挂）
      - /path/to/CloudNAS:/CloudNAS                # CD2 挂载根（按实际路径改）
      - /path/to/media:/media                      # 媒体目录（按需）
      - /path/to/tr/torrents:/tr_torrents          # Transmission 种子（按需）
      - /path/to/tr/downloads:/downloads           # 下载目录（RSS→TR 时）
```

> Hub 上示例还写过 `network_mode: host` 与 `9000:80`：请**以你实际映射端口访问**，不要混用未映射的端口号。

### 路径怎么理解

| 挂载 | 作用 |
|------|------|
| `./data → /app/data` | 配置与数据，删除会丢库 |
| CloudNAS | CloudDrive2 网盘挂载，整理 / STRM / 深度删除会用到 |
| media | Emby / 本地媒体目录（可按库结构调整） |
| downloads / torrents | Transmission 下载链路 |

## 启动与更新

```bash
docker compose pull && docker compose up -d
docker compose logs -f fast-media
```

访问：`http://服务器IP:8080`（端口以 compose 为准）

更新同一条 pull + up 即可。

## 访问与端口

| 项 | 说明 |
|----|------|
| Web | 宿主机映射端口 → 容器 `80` |
| API | 容器内由 Nginx 反代，一般**不必**单独映射后端端口 |
| Emby 302（推荐） | `http://IP:8080/emby-proxy/{服务器id}`，无需再开独立端口 |
| Emby「反代端口」字段 | 仅当你额外映射时才在宿主机可用 |

## 说明速查

| 项 | 内容 |
|----|------|
| 镜像 | `liuxiaodi2026/fast-media:latest` |
| 数据 | `./data`（容器 `/app/data`） |
| 激活 | 首次打开按页面提示；或环境变量 `LICENSE_KEY` |
| 日志 | `docker compose logs -f fast-media` |
| 密钥 | 见 Docker Hub 简介联系方式 |

## 环境变量（常用）

| 变量 | 说明 |
|------|------|
| `JWT_SECRET` | 登录令牌密钥，务必修改 |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 首次管理员 |
| `LICENSE_KEY` | 可选，预填许可证 |
| `TZ` | 建议 `Asia/Shanghai` |

## 安全建议

1. 修改默认管理员密码与 `JWT_SECRET`  
2. 不要把 `data/` 提交到公开仓库  
3. 管理面尽量内网 / VPN；外网需配合反向代理与 HTTPS  

## 界面示意（补图）

<ShotPlaceholder
  id="DOC-DEPLOY"
  title="部署后登录页 / 概览"
  filename="DOC-deploy-login.png"
  hint="部署完成后截取登录页或概览首屏，放到 docs/.vuepress/public/shots/"
  caption="补一张部署成功后的界面截图"
/>

## 下一步

按 [快速开始](./getting-started.md) 的最小配置顺序，或打开 [初始化配置](./setup.md)。
