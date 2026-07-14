# 初始化配置

按顺序做完左侧「必做」即可看片；右侧可随时补齐。

## 总览

| 阶段 | 必做 | 可选 | 文档 |
|------|------|------|------|
| 部署激活 | Docker、许可证、登录 | — | [部署](./deploy.md) |
| 系统基础 | API 令牌、TMDB | 代理、域名、日志 | 下文 |
| 存储链路 | 115、CD2 | 回收站 / 转存 | [插件](./plugins.md) · [CD2](./cd2.md) |
| 媒体播放 | Emby 服务器、STRM、302 | 扫库、深度删除 | [Emby](./emby.md) · [整理](./organize.md) |
| 追更下载 | — | RSS 站点 / TR / 规则 / 日历 | [RSS](./rss.md) |
| 资源与运维 | — | 频道、通知、助手、主题 | [频道通知](./channels.md) · [外观](./appearance.md) |

## 设定 → 系统设置（先做）

### 基础设置

| 字段 | 说明 |
|------|------|
| 域名 | 如 `http://192.168.1.10:8080`，Webhook / 对外地址参考 |
| API 令牌 | STRM 直连、深度删除、Webhook 鉴权，可随机生成 |
| GitHub Token | 可选 |
| HTTP 代理 | 频道 / RSS / TMDB 出站，如 `http://127.0.0.1:7890` |

### TheMovieDB

| 字段 | 说明 |
|------|------|
| API Key | 探索 / 刮削 enrichment **建议必填** |
| 图片代理 | 开关：是否经本站转发海报 |

<ShotPlaceholder
  id="DOC-SYS"
  title="系统基础设置"
  filename="DOC-system-basic.png"
  hint="截取：设定 → 系统设置 → 基础设置 / TMDB"
  caption="补图：系统基础设置"
/>

## 推荐联调顺序（网盘播放闭环）

1. **115助手**：扫码或 Cookie 登录账号  
2. **CloudDrive2**：服务地址、账号密码、挂载根路径（填局域网 IP，勿写容器内 `127.0.0.1` 误指 CD2）  
3. **Emby → 媒体服务器**：地址 + API Key  
4. **整理 → 链接同步**：网盘目录 + CD2 媒体目录 + STRM 输出目录  
5. **Emby → 302**：路径映射（可从 STRM 配置生成）  
6. Emby 客户端服务器地址改为：`http://IP:端口/emby-proxy/{id}`  
7. 播一集验证直链

更细字段见各专题页。

## 界面导览（补图区）

<ShotPlaceholder
  id="DOC-HOME"
  title="概览工作台"
  filename="DOC-dashboard.png"
  hint="截取概览：统计卡 + 媒体库"
  caption="补图：概览"
/>

<ShotPlaceholder
  id="DOC-PLUGINS"
  title="插件中心"
  filename="DOC-plugins.png"
  hint="截取插件中心列表"
  caption="补图：插件中心"
/>
