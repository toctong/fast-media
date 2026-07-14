<template>
  <div
    ref="rootEl"
    class="home-page-root"
    :class="{ ready }"
  >
    <div class="nebula" aria-hidden="true">
      <NebulaCanvas />
      <FluidWebGL />
      <span class="orb orb-a" />
      <span class="orb orb-b" />
      <span class="orb orb-c" />
      <span class="grid" />
      <span class="noise" />
      <span class="scan" />
    </div>

    <div class="intro" :class="{ leave: introLeaving, gone: introGone }" aria-hidden="true">
      <div class="intro-brand">
        <img :src="logoSrc" alt="" width="42" height="42" />
        <span>FAST MEDIA</span>
      </div>
      <div class="intro-bar"><i /></div>
    </div>

    <header class="nav reveal" data-reveal>
      <a class="brand" :href="home">
        <img :src="logoSrc" alt="Fast Media" width="28" height="28" />
        <span>Fast Media</span>
      </a>
      <nav class="nav-links">
        <a href="#work">Work</a>
        <a href="#features">能力</a>
        <a href="#flow">流程</a>
        <a href="#gallery">界面</a>
        <a href="#plugins">插件</a>
        <a :href="linkSetup">配置</a>
      </nav>
      <div class="nav-actions">
        <a class="btn primary magnet" :href="linkStart">开始使用</a>
      </div>
    </header>

    <section
      class="cinema"
      @pointermove="onCinemaMove"
      @pointerleave="resetCinema"
    >
      <div class="cinema-field" aria-hidden="true">
        <div class="cinema-glow" :style="cinemaGlowStyle" />
        <div class="cinema-orbit o1" :style="cinemaRingStyle" />
        <div class="cinema-orbit o2" />
        <div class="cinema-orbit o3" />
        <div class="cinema-sculpt" :style="cinemaSculptStyle">
          <span class="knot k1" />
          <span class="knot k2" />
          <span class="knot k3" />
          <span class="pulse" />
        </div>
      </div>

      <div class="cinema-orbit-cards" :style="cinemaDeckStyle" aria-hidden="true">
        <figure class="orbit-card oc1">
          <img :src="asset('/shots/SHOT-01-dashboard.webp')" alt="" loading="eager" />
        </figure>
        <figure class="orbit-card oc2">
          <img :src="asset('/shots/SHOT-02-explore-search.webp')" alt="" loading="lazy" />
        </figure>
        <figure class="orbit-card oc3">
          <img :src="asset('/shots/SHOT-04-subscription-calendar.webp')" alt="" loading="lazy" />
        </figure>
        <figure class="orbit-card oc4">
          <img :src="asset('/shots/SHOT-07-assistant-mcp.webp')" alt="" loading="lazy" />
        </figure>
      </div>

      <div class="cinema-hud" aria-hidden="true">
        <i class="corner tl" /><i class="corner tr" /><i class="corner bl" /><i class="corner br" />
        <div class="hud-line top" />
        <div class="hud-line bottom" />
      </div>

      <aside class="cinema-rail left reveal" data-reveal>
        <p class="rail-label">SYSTEM ONLINE</p>
        <ul>
          <li><span>01</span> EMBY 302</li>
          <li><span>02</span> STRM SYNC</li>
          <li><span>03</span> RSS TRACK</li>
          <li><span>04</span> MCP TOOLS</li>
        </ul>
      </aside>

      <aside class="cinema-rail right reveal" data-reveal style="--d: 0.08s">
        <p class="rail-label">LIVE SURFACE</p>
        <p class="rail-meta">POINTER LINKED</p>
        <p class="rail-meta dim">SCROLL → WORKSPACE</p>
      </aside>

      <div class="cinema-core" :style="cinemaCoreStyle">
        <p class="cinema-kicker reveal" data-reveal>
          <span class="live-dot" />
          CREATIVE MEDIA AUTOMATION
        </p>
        <h1 class="cinema-title" aria-label="Fast Media">
          <span class="cinema-word reveal" data-reveal style="--d: 0.05s">
            <i v-for="(ch, i) in 'FAST'" :key="'f' + i" :style="{ '--i': i }">{{ ch }}</i>
          </span>
          <span class="cinema-word media reveal" data-reveal style="--d: 0.18s">
            <i v-for="(ch, i) in 'MEDIA'" :key="'m' + i" :style="{ '--i': i }">{{ ch }}</i>
          </span>
        </h1>
        <p class="cinema-sub reveal" data-reveal style="--d: 0.3s">
          私人媒体控制中心 · 发现 · 订阅 · 整理 · 302 播放
        </p>
        <div class="cinema-cta reveal" data-reveal style="--d: 0.38s">
          <a class="btn primary lg magnet" :href="linkStart">
            <span>立刻开始</span>
            <i class="btn-shine" />
          </a>
          <a class="btn ghost lg magnet" href="#work">进入 3D 展览</a>
        </div>
        <div class="cinema-chips reveal" data-reveal style="--d: 0.46s">
          <span v-for="tag in tags" :key="tag.k"><b>{{ tag.k }}</b>{{ tag.v }}</span>
        </div>
      </div>

      <a class="scroll-hint" href="#work">
        <span>SCROLL</span>
        <b />
      </a>
    </section>

    <section id="story" class="story-bridge reveal" data-reveal>
      <p class="eyebrow">PRIVATE MEDIA CONTROL CENTER</p>
      <h2>从「想补这集」到「库里可播」，全部收进同一控制面</h2>
      <p>
        Fast Media 把 RSS 追更、规则搜种、115/CD2 整理、STRM 同步与 Emby 302 直链连成闭环——
        自动化可感知、可干预。
      </p>
    </section>

    <section class="marquee" aria-hidden="true">
      <div class="marquee-track">
        <span v-for="n in 2" :key="n">
          EMBY 302 · STRM SYNC · RSS · 115 · CLOUDDRIVE2 · MCP ASSISTANT · ORGANIZE · DISCOVER ·
        </span>
      </div>
    </section>

    <WorkUniverse :scroll-y="scrollY" />

    <section id="features" class="section">
      <div class="section-head reveal" data-reveal>
        <p class="eyebrow">CAPABILITIES</p>
        <h2>一套系统，覆盖媒体全链路</h2>
        <p>
          不是单纯的下载器，也不是只会代理的反向外壳。Fast Media 面向「自建媒体库」场景，把常见手工步骤产品化。
        </p>
      </div>
      <div class="feature-grid">
        <article
          v-for="(item, i) in features"
          :key="item.title"
          class="feature-card reveal"
          data-reveal
          :style="{ '--tone': item.tone, '--d': `${i * 0.06}s` }"
        >
          <div class="feature-shot" aria-hidden="true">
            <img :src="item.shot" alt="" loading="lazy" />
          </div>
          <div class="feature-body">
            <div class="feature-icon">{{ item.icon }}</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.desc }}</p>
            <ul>
              <li v-for="point in item.points" :key="point">{{ point }}</li>
            </ul>
          </div>
        </article>
      </div>
    </section>

    <section id="flow" class="section flow">
      <div class="section-head reveal" data-reveal>
        <p class="eyebrow">WORKFLOW</p>
        <h2>从「想补这集」到「库里可播」</h2>
      </div>
      <ol class="flow-track">
        <li
          v-for="(step, index) in steps"
          :key="step.title"
          class="reveal"
          data-reveal
          :style="{ '--d': `${index * 0.07}s` }"
        >
          <span class="step-no">{{ String(index + 1).padStart(2, '0') }}</span>
          <h3>{{ step.title }}</h3>
          <p>{{ step.desc }}</p>
        </li>
      </ol>
    </section>

    <section id="gallery" class="gallery-section">
      <div class="section-head reveal" data-reveal>
        <p class="eyebrow">SURFACES</p>
        <h2>产品界面，沉浸呈现</h2>
        <p>从概览到助手，把日常操作收进同一视觉节奏。</p>
      </div>

      <figure class="gallery-feature reveal" data-reveal>
        <img :src="asset('/shots/SHOT-01-dashboard.webp')" alt="Fast Media 概览" loading="lazy" />
      </figure>

      <div class="gallery-trio reveal" data-reveal>
        <figure v-for="item in galleryFeatured" :key="item.src">
          <img :src="item.src" :alt="item.alt" loading="lazy" />
        </figure>
      </div>

      <div class="gallery-grid">
        <figure
          v-for="(item, i) in galleryRest"
          :key="item.src"
          class="reveal"
          data-reveal
          :style="{ '--d': `${i * 0.05}s` }"
        >
          <img :src="item.src" :alt="item.alt" loading="lazy" />
        </figure>
      </div>
    </section>

    <section id="plugins" class="section">
      <div class="section-head reveal" data-reveal>
        <p class="eyebrow">PLUGIN ECOSYSTEM</p>
        <h2>插件化扩展，核心能力开箱即用</h2>
      </div>
      <div class="plugin-grid">
        <article
          v-for="(plugin, i) in plugins"
          :key="plugin.name"
          class="plugin-card reveal"
          data-reveal
          :style="{ '--d': `${i * 0.04}s` }"
        >
          <div v-if="plugin.shot" class="plugin-shot" aria-hidden="true">
            <img :src="plugin.shot" alt="" loading="lazy" />
          </div>
          <h3>{{ plugin.name }}</h3>
          <p>{{ plugin.desc }}</p>
        </article>
      </div>
    </section>

    <section class="section quote reveal" data-reveal>
      <blockquote>
        「一切皆插件」让工具拥有生命力——Fast Media 把 Emby、115、CD2、RSS 与 AI 助手放进同一控制面，
        让你只需要关注「今晚播什么」而不是「今晚又要去串三条命令行」。
      </blockquote>
    </section>

    <section class="cta reveal" data-reveal>
      <div>
        <h2>部署上去，开始补片</h2>
        <p>Docker Hub 一键拉取，数据卷持久化；按文档完成 Emby / CD2 / RSS 即可闭环。</p>
      </div>
      <div class="cta-actions">
        <a class="btn primary lg magnet" :href="linkStart">快速开始</a>
        <a class="btn ghost lg magnet" :href="linkSetup">配置指南</a>
      </div>
    </section>

    <footer class="footer">
      <div>
        <strong>Fast Media</strong>
        <span>私人媒体控制中心</span>
      </div>
      <div class="footer-links">
        <a :href="linkStart">快速开始</a>
        <a :href="linkSetup">配置指南</a>
        <a :href="linkFeatures">功能总览</a>
        <a :href="linkDonate">捐赠</a>
      </div>
      <p>© {{ year }} Fast Media · Built with VuePress + Vite</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { computed, defineAsyncComponent, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { withBase } from 'vuepress/client'
import NebulaCanvas from './NebulaCanvas.vue'

const FluidWebGL = defineAsyncComponent(() => import('./FluidWebGL.vue'))
const WorkUniverse = defineAsyncComponent(() => import('./WorkUniverse.vue'))

const home = withBase('/')
const logoSrc = withBase('/logo.svg')
const linkStart = withBase('/guide/getting-started.html')
const linkSetup = withBase('/guide/setup.html')
const linkFeatures = withBase('/guide/features.html')
const linkDonate = withBase('/donate.html')
const asset = (path: string) => withBase(path)

const year = new Date().getFullYear()
const rootEl = ref<HTMLElement | null>(null)
const ready = ref(false)
const introLeaving = ref(false)
const introGone = ref(false)
const scrollY = ref(0)

const cinema = reactive({ x: 0, y: 0, tx: 0, ty: 0 })

let lenis: Lenis | null = null
let lenisRaf = 0
let cinemaRaf = 0

function tickCinema() {
  cinema.x += (cinema.tx - cinema.x) * 0.08
  cinema.y += (cinema.ty - cinema.y) * 0.08
  cinemaRaf = requestAnimationFrame(tickCinema)
}

const cinemaCoreStyle = computed(() => ({
  transform: `translate3d(${cinema.x * -22}px, ${cinema.y * -14}px, 0)`,
}))

const cinemaDeckStyle = computed(() => ({
  transform: `translate3d(${cinema.x * 36}px, ${cinema.y * 22}px, 0) rotateY(${cinema.x * -6}deg) rotateX(${6 + cinema.y * 5}deg)`,
}))

const cinemaRingStyle = computed(() => ({
  transform: `translate(-50%, -50%) rotate(${cinema.x * 10}deg) scale(${1 + Math.abs(cinema.y) * 0.05})`,
}))

const cinemaGlowStyle = computed(() => ({
  transform: `translate3d(${cinema.x * 48}px, ${cinema.y * 36}px, 0)`,
}))

const cinemaSculptStyle = computed(() => ({
  transform: `translate(-50%, -50%) translate3d(${cinema.x * 20}px, ${cinema.y * 16}px, 0) rotateX(${12 + cinema.y * 8}deg) rotateY(${cinema.x * -14}deg)`,
}))

const tags = [
  { k: '302', v: ' 直链反代' },
  { k: 'STRM', v: ' 链接同步' },
  { k: '115', v: ' 网盘全家桶' },
  { k: 'MCP', v: ' 智能助手' },
]

const features = [
  {
    icon: '◎',
    title: '发现与搜种',
    tone: '#5b8cff',
    desc: '探索热榜与资源站并轨，关键词一次投入，多站点回灌。',
    points: ['豆瓣 / TMDB / 腾讯 / B 站', '全局搜索跨探索 · 频道 · RSS', '详情补全海报与演职人员'],
    shot: asset('/shots/SHOT-02-explore-search.webp'),
  },
  {
    icon: '↻',
    title: '订阅与 RSS',
    tone: '#22d3c5',
    desc: '追更日历感知缺集，RSS 站点规则化搜种，自动推到下载器。',
    points: ['影视订阅 + Emby 库状态', 'RSS 站点优先级与认证', '下载进度 / 历史卡片'],
    shot: asset('/shots/SHOT-04-subscription-calendar.webp'),
  },
  {
    icon: '▣',
    title: '整理与入库',
    tone: '#7dd3fc',
    desc: '归档规则、智能重命名与 STRM 生成，把「下完了」变成「库里能播」。',
    points: ['归档刮削任务', '115 链接同步 STRM', 'CD2 跨存储搬运'],
    shot: asset('/shots/SHOT-05-organize.webp'),
  },
  {
    icon: '↯',
    title: '播放与运维',
    tone: '#fda4af',
    desc: 'Emby 302 把播放流送到可直链路径，助手与定时任务接住日常巡检。',
    points: ['多实例 Emby 302', 'MCP 系统工具目录', '通知 / 日志 / Cron'],
    shot: asset('/shots/SHOT-08-emby-302.webp'),
  },
]

const steps = [
  {
    title: '订阅 / 发现',
    desc: '在探索或订阅里锁定作品，系统对齐 Emby 已入库集数，找到缺口。',
  },
  {
    title: '搜种 / 推送',
    desc: 'RSS 多站并发搜种，按规则挑包；磁力可推 115 云下载或 qB/TR。',
  },
  {
    title: '整理 / 同步',
    desc: '下载完成后走归档命名；115 侧生成 STRM，按需 CD2 搬运。',
  },
  {
    title: '刷新 / 播放',
    desc: '通知 Emby 扫库，播放走 302 直链。助手可查询进度、触发任务。',
  },
]

const plugins = [
  {
    name: '115 助手',
    desc: '扫码/Cookie 登录，账号空间与 VIP 状态，链接同步任务。',
    shot: asset('/shots/SHOT-06-plugins-115.webp'),
  },
  {
    name: '115 云下载',
    desc: '一键推磁力到离线目录，和订阅 / 搜索流打通。',
    shot: asset('/shots/SHOT-03-rss-download.webp'),
  },
  {
    name: '115 转存 / 回收站',
    desc: '分享转存与定时清空回收站，运维收口。',
    shot: asset('/shots/SHOT-09-file-manager.webp'),
  },
  {
    name: 'CloudDrive2',
    desc: '挂载探测与目录树，服务整理与深度删除。',
    shot: asset('/shots/SHOT-05-organize.webp'),
  },
  {
    name: 'Emby 302 / 刷新',
    desc: '路径映射、反代与扫库刷新，播放与入库闭环。',
    shot: asset('/shots/SHOT-08-emby-302.webp'),
  },
  {
    name: '智能助手',
    desc: 'OpenAI 兼容协议 + 类 MCP 工具，读库/写操作可授权。',
    shot: asset('/shots/SHOT-07-assistant-mcp.webp'),
  },
  {
    name: '频道资源',
    desc: 'QQ / Telegram 频道资源导入与浏览。',
    shot: asset('/shots/SHOT-02-explore-search.webp'),
  },
  {
    name: '天气 / 每日一言',
    desc: '概览氛围插件，让控制台每天多一点温度。',
    shot: asset('/shots/SHOT-01-dashboard.webp'),
  },
]

const galleryFeatured = [
  { src: asset('/shots/SHOT-02-explore-search.webp'), alt: '探索' },
  { src: asset('/shots/SHOT-04-subscription-calendar.webp'), alt: '订阅日历' },
  { src: asset('/shots/SHOT-07-assistant-mcp.webp'), alt: '助手' },
]

const galleryRest = [
  { src: asset('/shots/SHOT-03-rss-download.webp'), alt: 'RSS' },
  { src: asset('/shots/SHOT-05-organize.webp'), alt: '整理' },
  { src: asset('/shots/SHOT-06-plugins-115.webp'), alt: '115' },
  { src: asset('/shots/SHOT-08-emby-302.webp'), alt: 'Emby 302' },
  { src: asset('/shots/SHOT-09-file-manager.webp'), alt: '文件' },
  { src: asset('/shots/SHOT-01-dashboard.webp'), alt: '概览' },
]

let io: IntersectionObserver | null = null
let introTimer = 0
let leaveTimer = 0

function onCinemaMove(e: PointerEvent) {
  const t = e.currentTarget as HTMLElement
  const r = t.getBoundingClientRect()
  cinema.tx = (e.clientX - r.left) / r.width - 0.5
  cinema.ty = (e.clientY - r.top) / r.height - 0.5
}

function resetCinema() {
  cinema.tx = 0
  cinema.ty = 0
}

function bindReveal() {
  const nodes = rootEl.value?.querySelectorAll<HTMLElement>('[data-reveal]')
  if (!nodes?.length) return
  io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in')
          io?.unobserve(entry.target)
        }
      }
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' },
  )
  nodes.forEach((n) => io?.observe(n))
}

function bootLenis() {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return
  document.documentElement.classList.add('lenis')
  lenis = new Lenis({
    duration: 1.25,
    smoothWheel: true,
    touchMultiplier: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  })
  lenis.on('scroll', (e) => {
    scrollY.value = e.scroll
  })
  const loop = (time: number) => {
    lenis?.raf(time)
    lenisRaf = requestAnimationFrame(loop)
  }
  lenisRaf = requestAnimationFrame(loop)

  // anchor links through Lenis
  rootEl.value?.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (ev) => {
      const id = a.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target || !lenis) return
      ev.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -20 })
    })
  })
}

onMounted(async () => {
  await nextTick()
  cinemaRaf = requestAnimationFrame(tickCinema)
  bootLenis()
  introTimer = window.setTimeout(() => {
    introLeaving.value = true
    leaveTimer = window.setTimeout(() => {
      introGone.value = true
      ready.value = true
      bindReveal()
      rootEl.value
        ?.querySelectorAll<HTMLElement>('.cinema [data-reveal], .nav[data-reveal]')
        .forEach((n) => n.classList.add('in'))
    }, 620)
  }, 900)
})

onBeforeUnmount(() => {
  io?.disconnect()
  window.clearTimeout(introTimer)
  window.clearTimeout(leaveTimer)
  cancelAnimationFrame(lenisRaf)
  cancelAnimationFrame(cinemaRaf)
  lenis?.destroy()
  lenis = null
  document.documentElement.classList.remove('lenis')
})
</script>

<style scoped>
.home-page-root {
  position: relative;
  color: var(--fm-text, #f4f7ff);
  overflow: clip;
  background: #05070d;
}

.nebula {
  pointer-events: none;
  position: fixed;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(1000px 520px at 85% -8%, rgba(91, 140, 255, 0.14), transparent 60%),
    radial-gradient(820px 480px at 8% 18%, rgba(34, 211, 197, 0.1), transparent 55%),
    radial-gradient(700px 400px at 50% 110%, rgba(91, 140, 255, 0.07), transparent 60%),
    #05070d;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(48px);
  opacity: 0.32;
  animation: drift 14s ease-in-out infinite alternate;
  mix-blend-mode: screen;
}

.orb-a {
  width: 480px;
  height: 480px;
  left: -120px;
  top: 80px;
  background: rgba(91, 140, 255, 0.42);
}

.orb-b {
  width: 400px;
  height: 400px;
  right: 4%;
  top: 36%;
  background: rgba(34, 211, 197, 0.32);
  animation-delay: -5s;
}

.orb-c {
  width: 300px;
  height: 300px;
  left: 40%;
  bottom: 8%;
  background: rgba(125, 211, 252, 0.18);
  animation-delay: -9s;
}

.grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 72px 72px;
  mask-image: radial-gradient(ellipse at center, black 15%, transparent 72%);
  opacity: 0.5;
  animation: gridPulse 8s ease-in-out infinite;
}

.noise {
  position: absolute;
  inset: 0;
  opacity: 0.045;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

.scan {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    transparent 0%,
    rgba(127, 240, 228, 0.03) 50%,
    transparent 100%
  );
  background-size: 100% 220%;
  animation: scanMove 9s linear infinite;
  opacity: 0.28;
}

@keyframes drift {
  from {
    transform: translate3d(0, 0, 0) scale(1);
  }
  to {
    transform: translate3d(28px, -22px, 0) scale(1.08);
  }
}

@keyframes gridPulse {
  0%,
  100% {
    opacity: 0.35;
  }
  50% {
    opacity: 0.55;
  }
}

@keyframes scanMove {
  from {
    background-position: 0 -40%;
  }
  to {
    background-position: 0 140%;
  }
}

.intro {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-content: center;
  gap: 22px;
  background: #03050a;
  transition: clip-path 0.65s cubic-bezier(0.77, 0, 0.18, 1), opacity 0.4s;
  clip-path: inset(0 0 0 0);
}

.intro.leave {
  clip-path: inset(0 0 100% 0);
}

.intro.gone {
  display: none;
}

.intro-brand {
  display: flex;
  align-items: center;
  gap: 14px;
  font-size: 18px;
  font-weight: 760;
  letter-spacing: 0.28em;
  animation: introPop 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.intro-bar {
  width: 180px;
  height: 2px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
}

.intro-bar i {
  display: block;
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #5b8cff, #22d3c5);
  animation: introBar 0.85s ease-in-out both;
}

@keyframes introPop {
  from {
    opacity: 0;
    letter-spacing: 0.5em;
    filter: blur(8px);
  }
  to {
    opacity: 1;
    letter-spacing: 0.28em;
    filter: blur(0);
  }
}

@keyframes introBar {
  from {
    transform: translateX(-120%);
  }
  to {
    transform: translateX(220%);
  }
}

.nav,
.hero,
.section,
.cta,
.footer,
.marquee {
  position: relative;
  z-index: 1;
}

.nav {
  position: sticky;
  top: 0;
  z-index: 20;
  display: flex;
  align-items: center;
  gap: 24px;
  min-height: 64px;
  padding: 0 clamp(16px, 4vw, 40px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(5, 7, 13, 0.55);
  backdrop-filter: blur(18px) saturate(1.2);
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none !important;
  font-weight: 720;
  letter-spacing: 0.02em;
  border: 0;
  box-shadow: none;
}

.brand span {
  text-decoration: none;
  border-bottom: 0;
}

.cinema {
  position: relative;
  z-index: 1;
  min-height: calc(100vh - 64px);
  display: grid;
  place-items: center;
  padding: 40px 20px 88px;
  overflow: hidden;
  perspective: 1600px;
}

.cinema-field {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.cinema-glow {
  position: absolute;
  top: 42%;
  left: 50%;
  width: min(640px, 68vw);
  height: min(640px, 68vw);
  margin: calc(min(640px, 68vw) / -2) 0 0 calc(min(640px, 68vw) / -2);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(34, 211, 197, 0.12), rgba(91, 140, 255, 0.05) 42%, transparent 72%);
  filter: blur(28px);
  animation: glowBreath 5.5s ease-in-out infinite;
  opacity: 0.85;
}

.cinema-orbit {
  position: absolute;
  top: 46%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(127, 240, 228, 0.14);
  transform: translate(-50%, -50%);
}

.cinema-orbit.o1 {
  width: min(780px, 90vw);
  height: min(780px, 90vw);
  box-shadow:
    inset 0 0 80px rgba(34, 211, 197, 0.04),
    0 0 90px rgba(91, 140, 255, 0.05);
}

.cinema-orbit.o1::before,
.cinema-orbit.o1::after {
  content: '';
  position: absolute;
  inset: 9%;
  border-radius: 50%;
  border: 1px dashed rgba(255, 255, 255, 0.08);
  animation: ringSpin 42s linear infinite;
}

.cinema-orbit.o1::after {
  inset: 20%;
  border-style: solid;
  border-color: rgba(91, 140, 255, 0.12);
  animation-direction: reverse;
  animation-duration: 58s;
}

.cinema-orbit.o2 {
  width: min(520px, 66vw);
  height: min(520px, 66vw);
  border-color: rgba(91, 140, 255, 0.12);
  animation: orbitSpin 36s linear infinite reverse;
}

.cinema-orbit.o3 {
  width: min(300px, 42vw);
  height: min(300px, 42vw);
  border-color: rgba(127, 240, 228, 0.18);
  animation: orbitSpin 22s linear infinite;
}

@keyframes ringSpin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes orbitSpin {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.cinema-sculpt {
  position: absolute;
  top: 46%;
  left: 50%;
  width: 160px;
  height: 160px;
  transform-style: preserve-3d;
  z-index: 1;
  opacity: 0.55;
}

.cinema-sculpt .knot {
  position: absolute;
  inset: 18%;
  border-radius: 46% 54% 48% 52% / 52% 48% 54% 46%;
  border: 2px solid rgba(127, 240, 228, 0.35);
  box-shadow:
    inset 0 0 24px rgba(34, 211, 197, 0.2),
    0 0 30px rgba(91, 140, 255, 0.18);
  background: linear-gradient(135deg, rgba(34, 211, 197, 0.16), rgba(91, 140, 255, 0.08));
  animation: knotTwist 9s ease-in-out infinite;
}

.cinema-sculpt .k2 {
  inset: 28%;
  border-color: rgba(91, 140, 255, 0.4);
  animation-delay: -2s;
  animation-duration: 11s;
}

.cinema-sculpt .k3 {
  inset: 38%;
  border-color: rgba(244, 247, 255, 0.22);
  animation-delay: -4s;
  animation-duration: 7s;
}

.cinema-sculpt .pulse {
  position: absolute;
  inset: 42%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(127, 240, 228, 0.35), transparent 70%);
  filter: blur(8px);
  animation: pulseCore 2.8s ease-in-out infinite;
}

@keyframes knotTwist {
  0%,
  100% {
    transform: rotateX(18deg) rotateY(-12deg) rotateZ(0deg);
  }
  50% {
    transform: rotateX(-10deg) rotateY(18deg) rotateZ(16deg);
  }
}

@keyframes pulseCore {
  0%,
  100% {
    opacity: 0.45;
    transform: scale(0.85);
  }
  50% {
    opacity: 1;
    transform: scale(1.15);
  }
}

.cinema-orbit-cards {
  position: absolute;
  inset: 8% 4% 12%;
  z-index: 1;
  transform-style: preserve-3d;
  pointer-events: none;
}

.orbit-card {
  position: absolute;
  margin: 0;
  width: min(280px, 28vw);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(6, 10, 18, 0.72);
  backdrop-filter: blur(8px);
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    0 0 0 1px rgba(127, 240, 228, 0.06);
  animation: cardFloat 7s ease-in-out infinite;
}

.orbit-card img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
  opacity: 0.92;
}

.orbit-card.oc1 {
  left: 6%;
  top: 14%;
  transform: rotateY(18deg) rotateX(8deg);
  animation-delay: 0s;
}

.orbit-card.oc2 {
  right: 5%;
  top: 10%;
  transform: rotateY(-20deg) rotateX(6deg);
  animation-delay: -1.6s;
}

.orbit-card.oc3 {
  left: 10%;
  bottom: 8%;
  width: min(240px, 24vw);
  transform: rotateY(14deg) rotateX(-4deg);
  animation-delay: -3s;
}

.orbit-card.oc4 {
  right: 8%;
  bottom: 10%;
  width: min(230px, 22vw);
  transform: rotateY(-16deg) rotateX(-6deg);
  animation-delay: -4.4s;
}

@keyframes cardFloat {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -12px;
  }
}

.cinema-hud {
  position: absolute;
  inset: 18px clamp(12px, 3vw, 28px);
  z-index: 2;
  pointer-events: none;
}

.cinema-hud .corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 1.5px solid rgba(127, 240, 228, 0.45);
}

.cinema-hud .tl {
  top: 0;
  left: 0;
  border-right: 0;
  border-bottom: 0;
}

.cinema-hud .tr {
  top: 0;
  right: 0;
  border-left: 0;
  border-bottom: 0;
}

.cinema-hud .bl {
  bottom: 0;
  left: 0;
  border-right: 0;
  border-top: 0;
}

.cinema-hud .br {
  bottom: 0;
  right: 0;
  border-left: 0;
  border-top: 0;
}

.hud-line {
  position: absolute;
  left: 36px;
  right: 36px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(127, 240, 228, 0.22), transparent);
}

.hud-line.top {
  top: 10px;
}

.hud-line.bottom {
  bottom: 10px;
}

.cinema-rail {
  position: absolute;
  top: 16%;
  z-index: 3;
  width: 170px;
  font-family: 'Space Grotesk', ui-monospace, monospace;
  pointer-events: none;
}

.cinema-rail.left {
  left: clamp(28px, 5vw, 56px);
}

.cinema-rail.right {
  right: clamp(28px, 5vw, 56px);
  text-align: right;
}

.rail-label {
  margin: 0 0 12px;
  font-size: 11px;
  letter-spacing: 0.2em;
  color: rgba(127, 240, 228, 0.75);
  font-weight: 700;
}

.cinema-rail ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 8px;
  font-size: 11px;
  letter-spacing: 0.12em;
  color: rgba(244, 247, 255, 0.42);
}

.cinema-rail li span {
  color: rgba(127, 240, 228, 0.8);
  margin-right: 8px;
}

.rail-meta {
  margin: 0 0 8px;
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(244, 247, 255, 0.55);
}

.rail-meta.dim {
  color: rgba(244, 247, 255, 0.32);
}

.cinema-core {
  position: relative;
  z-index: 4;
  display: grid;
  justify-items: center;
  text-align: center;
  gap: 16px;
  max-width: 980px;
  padding: 28px 20px;
  transition: transform 0.05s linear;
  background: radial-gradient(ellipse at center, rgba(5, 7, 13, 0.72) 0%, rgba(5, 7, 13, 0.35) 55%, transparent 78%);
}

.cinema-kicker {
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.28em;
  font-weight: 700;
  color: #7ff0e4;
}

.cinema-title {
  margin: 0;
  display: grid;
  gap: 0.02em;
  line-height: 0.84;
  font-weight: 860;
  letter-spacing: -0.06em;
  font-size: clamp(78px, 17vw, 176px);
  text-transform: uppercase;
}

.cinema-word {
  display: block;
  white-space: nowrap;
}

.cinema-word i {
  display: inline-block;
  font-style: normal;
  animation: charIn 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
  animation-delay: calc(var(--i) * 0.05s + 1.05s);
  text-shadow: 0 0 48px rgba(127, 240, 228, 0.18);
}

.cinema-word.media i {
  background: linear-gradient(115deg, #f4f7ff 8%, #7ff0e4 48%, #9dbcff 92%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 36px rgba(34, 211, 197, 0.22));
}

@keyframes charIn {
  from {
    opacity: 0;
    transform: translate3d(0, 0.55em, 0) rotateX(40deg);
    filter: blur(10px);
  }
  to {
    opacity: 1;
    transform: none;
    filter: none;
  }
}

.cinema-sub {
  margin: 4px 0 0;
  max-width: 36rem;
  font-size: clamp(15px, 2vw, 18px);
  color: rgba(244, 247, 255, 0.62);
  letter-spacing: 0.04em;
  line-height: 1.6;
}

.cinema-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 8px;
}

.cinema-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px 18px;
  margin-top: 4px;
  color: rgba(244, 247, 255, 0.48);
  font-size: 12px;
  letter-spacing: 0.04em;
}

.cinema-chips b {
  color: rgba(244, 247, 255, 0.88);
  margin-right: 6px;
}

.story-bridge {
  position: relative;
  z-index: 1;
  max-width: 920px;
  margin: 0 auto;
  padding: 56px clamp(16px, 4vw, 48px) 24px;
  text-align: center;
}

.story-bridge .eyebrow {
  margin: 0 0 12px;
  letter-spacing: 0.18em;
  font-size: 12px;
  color: #7ff0e4;
  font-weight: 700;
}

.story-bridge h2 {
  margin: 0;
  font-size: clamp(26px, 3.6vw, 40px);
  letter-spacing: -0.03em;
  line-height: 1.2;
}

.story-bridge p {
  margin: 14px auto 0;
  max-width: 42rem;
  color: rgba(244, 247, 255, 0.62);
  line-height: 1.7;
}

.scroll-hint {
  position: absolute;
  bottom: 22px;
  left: 50%;
  z-index: 4;
  translate: -50% 0;
  display: grid;
  justify-items: center;
  gap: 8px;
  color: rgba(244, 247, 255, 0.45);
  text-decoration: none;
  font-size: 11px;
  letter-spacing: 0.28em;
  font-weight: 700;
}

.scroll-hint b {
  width: 1px;
  height: 42px;
  background: linear-gradient(#7ff0e4, transparent);
  animation: scrollLine 1.6s ease-in-out infinite;
}

@keyframes scrollLine {
  0%,
  100% {
    transform: scaleY(0.4);
    opacity: 0.3;
    transform-origin: top;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
    transform-origin: top;
  }
}

.nav-links {
  display: flex;
  gap: 18px;
  flex: 1;
}

.nav-links a,
.footer-links a {
  color: rgba(244, 247, 255, 0.68);
  text-decoration: none;
  font-size: 14px;
  transition: color 0.2s, text-shadow 0.2s;
}

.nav-links a:hover,
.footer-links a:hover {
  color: #fff;
  text-shadow: 0 0 18px rgba(127, 240, 228, 0.45);
}

.nav-actions {
  display: flex;
  gap: 10px;
}

.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  height: 36px;
  padding: 0 14px;
  border: 1px solid transparent;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 650;
  transition: transform 0.2s, background 0.2s, border-color 0.2s, box-shadow 0.2s;
}

.btn.lg {
  height: 48px;
  padding: 0 20px;
  font-size: 14px;
}

.btn.primary {
  background: linear-gradient(120deg, #5b8cff, #22d3c5 70%);
  color: #061018;
  box-shadow: 0 0 0 1px rgba(127, 240, 228, 0.15), 0 10px 40px rgba(34, 211, 197, 0.18);
}

.btn.ghost {
  border-color: rgba(255, 255, 255, 0.16);
  background: rgba(255, 255, 255, 0.03);
}

.btn:hover {
  transform: translateY(-2px);
}

.btn.primary:hover {
  box-shadow: 0 0 0 1px rgba(127, 240, 228, 0.35), 0 16px 50px rgba(91, 140, 255, 0.28);
}

.btn-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(110deg, transparent 30%, rgba(255, 255, 255, 0.45) 50%, transparent 70%);
  transform: translateX(-120%);
  animation: shine 3.6s ease-in-out infinite;
}

@keyframes shine {
  0%,
  60%,
  100% {
    transform: translateX(-120%);
  }
  75% {
    transform: translateX(120%);
  }
}

.hero {
  display: grid;
  grid-template-columns: minmax(320px, 0.95fr) minmax(420px, 1.15fr);
  gap: 48px;
  align-items: center;
  padding: 64px clamp(16px, 4vw, 48px) 36px;
  min-height: calc(100vh - 64px);
  max-width: 1440px;
  margin: 0 auto;
}

.eyebrow {
  margin: 0 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  letter-spacing: 0.2em;
  font-weight: 700;
  color: #7ff0e4;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #22d3c5;
  box-shadow: 0 0 0 0 rgba(34, 211, 197, 0.7);
  animation: pulseDot 1.8s infinite;
}

@keyframes pulseDot {
  0% {
    box-shadow: 0 0 0 0 rgba(34, 211, 197, 0.55);
  }
  70% {
    box-shadow: 0 0 0 12px rgba(34, 211, 197, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(34, 211, 197, 0);
  }
}

.hero-title {
  margin: 0;
  font-size: clamp(36px, 5.5vw, 58px);
  line-height: 0.98;
  letter-spacing: -0.04em;
  font-weight: 800;
}

.hero-title .line {
  display: block;
  overflow: hidden;
}

.grad {
  background: linear-gradient(115deg, #f4f7ff 8%, #7ff0e4 48%, #9dbcff 92%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  filter: drop-shadow(0 0 28px rgba(34, 211, 197, 0.25));
}

.lead {
  margin: 20px 0 0;
  max-width: 38rem;
  font-size: 16px;
  line-height: 1.75;
  color: rgba(244, 247, 255, 0.68);
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 30px;
}

.hero-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px 18px;
  margin-top: 28px;
  color: rgba(244, 247, 255, 0.52);
  font-size: 13px;
}

.hero-tags b {
  color: #fff;
  margin-right: 6px;
}

.hero-stage {
  position: relative;
  padding: 18px;
}

.stage-glow {
  position: absolute;
  inset: 8% 4%;
  background: radial-gradient(circle at 50% 40%, rgba(34, 211, 197, 0.28), transparent 65%);
  filter: blur(30px);
  animation: glowBreath 5s ease-in-out infinite;
}

@keyframes glowBreath {
  0%,
  100% {
    opacity: 0.55;
    transform: scale(0.96);
  }
  50% {
    opacity: 1;
    transform: scale(1.04);
  }
}

.stage-frame {
  position: relative;
  transition: transform 0.18s ease-out;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.55),
    0 0 0 1px rgba(127, 240, 228, 0.18),
    0 0 60px rgba(91, 140, 255, 0.18);
  clip-path: inset(0 round 0);
}

.stage-frame::after {
  content: '';
  pointer-events: none;
  position: absolute;
  inset: 0;
  background: linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.08) 50%, transparent 60%);
  mix-blend-mode: screen;
  transform: translateX(-60%);
  animation: frameSweep 5.5s ease-in-out infinite;
}

@keyframes frameSweep {
  0%,
  55%,
  100% {
    transform: translateX(-70%);
  }
  70% {
    transform: translateX(70%);
  }
}

.hud-corner {
  position: absolute;
  width: 18px;
  height: 18px;
  border: 1.5px solid rgba(127, 240, 228, 0.55);
}

.tl {
  top: 4px;
  left: 4px;
  border-right: 0;
  border-bottom: 0;
}

.tr {
  top: 4px;
  right: 4px;
  border-left: 0;
  border-bottom: 0;
}

.bl {
  bottom: 4px;
  left: 4px;
  border-right: 0;
  border-top: 0;
}

.br {
  bottom: 4px;
  right: 4px;
  border-left: 0;
  border-top: 0;
}

.float-card {
  position: absolute;
  min-width: 190px;
  padding: 12px 14px;
  border: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(8, 12, 22, 0.82);
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
  transition: transform 0.18s ease-out;
  z-index: 2;
}

.float-card strong {
  display: block;
  margin-bottom: 4px;
  font-size: 13px;
}

.float-card span {
  font-size: 12px;
  color: rgba(244, 247, 255, 0.6);
}

.f1 {
  left: -8px;
  bottom: 16%;
  animation: floaty 5.5s ease-in-out infinite;
}

.f2 {
  right: 4%;
  top: 8%;
  animation: floaty 6.5s ease-in-out infinite reverse;
}

@keyframes floaty {
  0%,
  100% {
    translate: 0 0;
  }
  50% {
    translate: 0 -10px;
  }
}

.marquee {
  border-block: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.marquee-track {
  display: flex;
  width: max-content;
  gap: 0;
  animation: marquee 28s linear infinite;
  font-size: 12px;
  letter-spacing: 0.22em;
  font-weight: 700;
  color: rgba(244, 247, 255, 0.42);
  padding: 14px 0;
  white-space: nowrap;
}

@keyframes marquee {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}

.section {
  padding: 88px clamp(16px, 4vw, 48px);
  max-width: 1440px;
  margin: 0 auto;
}

.section-head {
  max-width: 720px;
  margin-bottom: 34px;
}

.section-head h2 {
  margin: 0;
  font-size: clamp(30px, 4.4vw, 44px);
  letter-spacing: -0.03em;
}

.section-head p {
  margin: 12px 0 0;
  color: rgba(244, 247, 255, 0.64);
  line-height: 1.7;
}

.section-head code {
  color: #7ff0e4;
  background: rgba(0, 0, 0, 0.28);
  padding: 2px 6px;
}

.section-head a {
  color: #9dbcff;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.plugin-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.feature-card,
.plugin-card,
.flow-track li {
  position: relative;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  transition: transform 0.25s, border-color 0.25s, box-shadow 0.25s;
  overflow: hidden;
}

.feature-card::before,
.plugin-card::before,
.flow-track li::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(420px 180px at var(--mx, 50%) var(--my, 0%), rgba(127, 240, 228, 0.12), transparent 60%);
  opacity: 0;
  transition: opacity 0.25s;
  pointer-events: none;
  z-index: 1;
}

.feature-card:hover,
.plugin-card:hover,
.flow-track li:hover {
  transform: translateY(-4px);
  border-color: rgba(127, 240, 228, 0.28);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.feature-card:hover::before,
.plugin-card:hover::before,
.flow-track li:hover::before {
  opacity: 1;
}

.feature-card {
  border-top: 2px solid var(--tone);
  display: grid;
  grid-template-columns: 1.15fr 1fr;
  min-height: 280px;
}

.feature-shot {
  position: relative;
  overflow: hidden;
  min-height: 220px;
  background: #070b14;
}

.feature-shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0.92;
}

.feature-card:hover .feature-shot img {
  transform: scale(1.05);
}

.feature-body {
  position: relative;
  z-index: 1;
  padding: 22px 20px;
  display: flex;
  flex-direction: column;
}

.feature-icon {
  position: relative;
  width: 38px;
  height: 38px;
  display: grid;
  place-items: center;
  margin-bottom: 14px;
  border: 1px solid color-mix(in srgb, var(--tone) 45%, transparent);
  color: var(--tone);
  font-size: 16px;
  box-shadow: 0 0 24px color-mix(in srgb, var(--tone) 25%, transparent);
}

.plugin-card {
  padding: 0 0 18px;
}

.plugin-shot {
  height: 118px;
  overflow: hidden;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  margin-bottom: 14px;
  background: #070b14;
}

.plugin-shot img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  opacity: 0.85;
  transition: transform 0.55s ease, opacity 0.35s;
}

.plugin-card:hover .plugin-shot img {
  transform: scale(1.06);
  opacity: 1;
}

.plugin-card h3,
.plugin-card p {
  padding: 0 16px;
}

.feature-card h3,
.plugin-card h3,
.flow-track h3 {
  position: relative;
  margin: 0 0 8px;
  font-size: 18px;
}

.feature-card p,
.plugin-card p,
.flow-track p {
  position: relative;
  margin: 0;
  color: rgba(244, 247, 255, 0.62);
  line-height: 1.6;
  font-size: 13.5px;
}

.feature-card ul {
  position: relative;
  margin: 14px 0 0;
  padding-left: 16px;
  color: rgba(244, 247, 255, 0.72);
  font-size: 13px;
  line-height: 1.7;
}

.flow-track {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;
}

.flow-track li {
  padding: 22px 18px;
}

.step-no {
  display: block;
  margin-bottom: 14px;
  font-size: 12px;
  letter-spacing: 0.14em;
  color: #7ff0e4;
  font-weight: 700;
}

.gallery-section {
  position: relative;
  z-index: 1;
  padding: 72px clamp(16px, 4vw, 48px) 40px;
  max-width: 1440px;
  margin: 0 auto;
}

.gallery-feature {
  margin: 0 0 16px;
  overflow: hidden;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #070b14;
  box-shadow:
    0 28px 70px rgba(0, 0, 0, 0.42),
    0 0 0 1px rgba(127, 240, 228, 0.05);
}

.gallery-feature img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 9;
  object-fit: cover;
  object-position: top center;
}

.gallery-trio {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 14px;
  perspective: 1200px;
}

.gallery-trio figure {
  margin: 0;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #070b14;
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.3);
  transition: transform 0.35s ease, border-color 0.25s;
}

.gallery-trio figure:nth-child(1) {
  transform: rotateY(4deg) translateZ(0);
}
.gallery-trio figure:nth-child(2) {
  transform: translateY(-6px);
}
.gallery-trio figure:nth-child(3) {
  transform: rotateY(-4deg) translateZ(0);
}

.gallery-trio figure:hover {
  transform: translateY(-8px) scale(1.015);
  border-color: rgba(127, 240, 228, 0.28);
}

.gallery-trio img,
.gallery-grid img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  object-position: top center;
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1);
}

.gallery-trio figure:hover img,
.gallery-grid figure:hover img {
  transform: scale(1.035);
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

.gallery-grid figure {
  margin: 0;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: #070b14;
  transition: transform 0.3s ease, border-color 0.25s, box-shadow 0.25s;
}

.gallery-grid figure:hover {
  transform: translateY(-4px);
  border-color: rgba(127, 240, 228, 0.24);
  box-shadow: 0 16px 36px rgba(0, 0, 0, 0.32);
}

.quote {
  padding-top: 24px;
  padding-bottom: 24px;
}

.quote blockquote {
  margin: 0;
  padding: 28px 32px;
  border-left: 3px solid #5b8cff;
  background: linear-gradient(90deg, rgba(91, 140, 255, 0.14), rgba(34, 211, 197, 0.05));
  color: rgba(244, 247, 255, 0.86);
  font-size: 18px;
  line-height: 1.7;
  box-shadow: inset 0 0 40px rgba(91, 140, 255, 0.05);
}

.cta {
  margin: 24px clamp(16px, 4vw, 48px) 48px;
  padding: 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background:
    linear-gradient(120deg, rgba(91, 140, 255, 0.2), rgba(34, 211, 197, 0.12)),
    rgba(8, 12, 22, 0.92);
  box-shadow: 0 0 80px rgba(34, 211, 197, 0.08);
}

.cta h2 {
  margin: 0 0 8px;
  font-size: 30px;
}

.cta p {
  margin: 0;
  color: rgba(244, 247, 255, 0.66);
}

.cta-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.footer {
  padding: 28px clamp(16px, 4vw, 48px) 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: grid;
  gap: 12px;
  color: rgba(244, 247, 255, 0.5);
  font-size: 13px;
}

.footer strong {
  color: #fff;
  margin-right: 10px;
}

.footer-links {
  display: flex;
  gap: 16px;
}

.reveal {
  opacity: 0;
  transform: translate3d(0, 36px, 0) scale(0.985);
  filter: blur(6px);
  transition:
    opacity 0.85s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s),
    transform 0.85s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s),
    filter 0.85s cubic-bezier(0.16, 1, 0.3, 1) var(--d, 0s);
}

.reveal.in {
  opacity: 1;
  transform: none;
  filter: blur(0);
}

@media (max-width: 1100px) {
  .feature-grid,
  .flow-track,
  .plugin-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .feature-card {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .feature-shot {
    min-height: 180px;
    max-height: 200px;
  }

  .hero {
    grid-template-columns: 1fr;
    min-height: auto;
  }

  .gallery-trio,
  .gallery-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .gallery-trio figure:nth-child(3) {
    grid-column: span 2;
  }

  .gallery-trio figure:nth-child(1),
  .gallery-trio figure:nth-child(2),
  .gallery-trio figure:nth-child(3) {
    transform: none;
  }
}

@media (max-width: 760px) {
  .cinema-rail,
  .cinema-orbit-cards {
    display: none;
  }

  .cinema-sculpt {
    width: 120px;
    height: 120px;
    opacity: 0.7;
  }

  .cinema-title {
    font-size: clamp(56px, 18vw, 96px);
  }

  .nav-links {
    display: none;
  }

  .feature-grid,
  .flow-track,
  .plugin-grid {
    grid-template-columns: 1fr;
  }

  .gallery-trio,
  .gallery-grid {
    grid-template-columns: 1fr;
  }

  .gallery-trio figure:nth-child(3) {
    grid-column: auto;
  }

  .cta {
    flex-direction: column;
    align-items: flex-start;
  }

  .float-card,
  .hud-corner {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    filter: none;
    transition: none;
  }

  .marquee-track,
  .scan,
  .intro-bar i,
  .btn-shine,
  .stage-frame::after,
  .orb,
  .grid {
    animation: none !important;
  }
}
</style>
