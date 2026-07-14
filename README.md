# Fast Media Blog

> 这里是 Fast Media 的官网 + 使用说明书。  
> 代码仓库是干活的，这个仓库负责把话讲清楚（偶尔还讲得俏皮一点）。

---

## Fast Media 是啥？

**私人媒体控制中心** —— 不是又一个「半成品下载器说明书」，更像你家影音链路的总控台：

- 🗂️ 整理 / 刮削 / STRM，把「下完了」变成「库里能播」
- ☁️ 115 / CloudDrive2 等网盘场景，少踩点路径雷
- 🎬 Emby 302 直链反代，链路短一点、观感顺一点
- 📡 RSS 追更、频道与通知，能自动的尽量别手搓
- 🤖 智能助手（MCP）在旁边唠两句配置，也比干瞪眼强

一句话：Docker 拉起来，按文档配完 Emby / CD2 / RSS，就能闭环。

主项目 GitHub：[toctong/fastmedia](https://github.com/toctong/fastmedia)  
镜像：[liuxiaodi2026/fast-media](https://hub.docker.com/r/liuxiaodi2026/fast-media)

> 软件还在持续升级、打磨。文档尽量跟着跑，偶尔会慢半拍 —— 那是迭代太勤，不是你眼花。

---

## 这个仓库能干嘛

本仓是 **VuePress 2 + Vite** 文档站：

```bash
npm install
npm run docs:dev    # 默认 http://127.0.0.1:8088
npm run docs:build  # 产物：docs/.vuepress/dist
```

截图放 `docs/.vuepress/public/shots/`，命名见 [截图清单](./docs/shots/README.md)。

玩得开心～ 🧋
