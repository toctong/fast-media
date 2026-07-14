import { defineUserConfig } from 'vuepress'
import { viteBundler } from '@vuepress/bundler-vite'
import { slimsearchPlugin } from '@vuepress/plugin-slimsearch'
import { defaultTheme } from '@vuepress/theme-default'
import { getDirname, path } from 'vuepress/utils'

const __dirname = getDirname(import.meta.url)

export default defineUserConfig({
  base: '/fast-media/',
  lang: 'zh-CN',
  title: 'Fast Media',
  description:
    '私人媒体控制中心：整理刮削、115/CD2、STRM、Emby 302、RSS 与智能助手',
  alias: {
    '@theme/VPNavbar.vue': path.resolve(__dirname, './components/VPNavbar.vue'),
  },
  plugins: [
    slimsearchPlugin({
      indexContent: true,
      suggestion: true,
      hotReload: true,
      filter: (page) => page.path !== '/',
      locales: {
        '/': {
          placeholder: '搜索文档',
          search: '搜索',
        },
      },
    }),
  ],
  head: [
    ['meta', { name: 'theme-color', content: '#0a0e18' }],
    ['meta', { name: 'og:title', content: 'Fast Media · 私人媒体控制中心' }],
    [
      'meta',
      {
        name: 'og:description',
        content: 'Docker 一键部署的媒体自动化控制中心',
      },
    ],
    ['link', { rel: 'icon', href: '/fast-media/logo.svg' }],
    [
      'link',
      {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    ],
    [
      'link',
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap',
      },
    ],
  ],
  bundler: viteBundler({
    viteOptions: {
      optimizeDeps: {
        include: ['three', 'lenis'],
      },
      ssr: {
        noExternal: ['three', 'lenis'],
      },
    },
  }),
  theme: defaultTheme({
    logo: '/logo.svg',
    logoDark: '/logo.svg',
    repo: 'https://github.com/toctong/fastmedia',
    navbar: [
      { text: '首页', link: '/' },
      { text: '快速开始', link: '/guide/getting-started.html' },
      { text: '配置指南', link: '/guide/setup.html' },
      { text: '功能总览', link: '/guide/features.html' },
      { text: '捐赠', link: '/donate.html' },
      {
        text: 'Docker Hub',
        link: 'https://hub.docker.com/r/liuxiaodi2026/fast-media',
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: '开始',
          children: [
            '/guide/getting-started.md',
            '/guide/deploy.md',
            '/guide/setup.md',
            '/guide/features.md',
          ],
        },
        {
          text: '配置专题',
          children: [
            '/guide/emby.md',
            '/guide/cd2.md',
            '/guide/plugins.md',
            '/guide/organize.md',
            '/guide/rss.md',
            '/guide/channels.md',
            '/guide/appearance.md',
          ],
        },
      ],
      '/donate': [
        {
          text: '支持项目',
          children: ['/donate.md'],
        },
      ],
    },
    colorMode: 'dark',
    colorModeSwitch: true,
    editLink: false,
    lastUpdated: false,
    contributors: false,
  }),
})
