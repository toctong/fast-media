# RSS 与订阅

入口：**订阅**（`/subscription`）

| Tab | 用途 |
|-----|------|
| RSS 订阅 | 影视追更列表，启停 / 筛选 |
| RSS 站点 | 种子站 / 索引站连接 |
| RSS 下载 | Transmission、进度、历史 |
| RSS 规则 | 分辨率 / 编码等选源规则 |
| RSS 日历 | 播出日历（需关联 TMDB） |

## 1. 添加 RSS 站点

| 字段 | 说明 |
|------|------|
| 连接协议 | 公开 / 私有 PT Cookie（NexusPhp）/ 私有 PT API Key（M-Team）等 |
| 站点预设 | 动漫花园、漫猫、萌番组、nyaa、常见 NexusPhp、M-Team… |
| 站点名称 | 自定义显示名 |
| 站点域名 / RSS URL | 按站填写 |
| Cookie / Authorization / API Key | 私有站需要 |
| User-Agent、超时、颜色 | 按需 |

保存后可在订阅任务里选用站点优先级。

<ShotPlaceholder
  id="DOC-RSS-SITE"
  title="RSS 站点"
  filename="DOC-rss-sites.png"
  hint="截取：RSS 站点列表或添加站点弹窗（可打码 Cookie）"
  caption="补图：RSS 站点"
/>

## 2. 下载器（Transmission）

当前界面下载器类型为 **Transmission**。

| 字段 | 说明 |
|------|------|
| 启用下载器 | 开 |
| 访问地址 | 完整 URL，如 `http://192.168.1.50:9091` |
| 用户名 / 密码 | TR 凭据 |
| 下载目录 | UI 常见固定为 `/downloads`（与 compose 挂载对齐） |

Docker 请把宿主机 TR 下载目录挂到容器 `/downloads`，见 [部署](./deploy.md)。

<ShotPlaceholder
  id="DOC-RSS-DL"
  title="RSS 下载进度"
  filename="DOC-rss-download.png"
  hint="截取：RSS 下载 Tab，含进度卡片更佳"
  caption="补图：下载进度"
/>

## 3. RSS 规则

配置规则组：分辨率、编码、字幕组关键词等，用于多站并发时挑包。

## 4. 订阅与日历

1. 在探索 / 订阅中锁定作品  
2. 启用 RSS 追更，对齐 Emby 已入库集数找缺口  
3. **RSS 日历**查看播出与任务节奏  

同日同剧多集可合并展示（如 `S01E01-02`）。

<ShotPlaceholder
  id="DOC-RSS-CAL"
  title="订阅日历"
  filename="DOC-rss-calendar.png"
  hint="截取：RSS 日历月视图或当日弹层"
  caption="补图：订阅日历"
/>

## 检查清单

- [ ] 至少一个站点测试搜种成功  
- [ ] Transmission 连接成功，下载目录可写  
- [ ] 订阅作品能出缺口并推送下载  
- [ ] （可选）规则组过滤符合预期  
