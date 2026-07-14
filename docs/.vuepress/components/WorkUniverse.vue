<template>
  <section ref="sectionEl" id="work" class="work-universe">
    <div class="work-stage">
      <div class="work-hud">
        <div>
          <p class="eyebrow">WHAT ARE YOU LOOKING FOR?</p>
          <ul>
            <li v-for="item in menu" :key="item">→ {{ item }}</li>
          </ul>
        </div>
        <div class="work-hud-meta">
          <span>{{ activeLabel }}</span>
          <span class="mono">CLICK PANEL · {{ progressLabel }}</span>
        </div>
      </div>

      <canvas
        ref="canvasEl"
        class="work-canvas"
        :class="{ hoverable: !!hoverTitle }"
        @pointerdown="onDown"
        @pointerup="onUp"
        @pointerleave="onUp"
      />
    </div>

    <div class="work-caption">
      <p class="eyebrow">PRODUCT SURFACES</p>
      <h2>在空间里翻阅界面</h2>
      <p>玻璃轨道轴心 · 十屏螺旋展览 · 点击面板全屏查看。</p>
    </div>

    <Teleport to="body">
      <div
        v-if="lightbox"
        class="work-lightbox"
        :class="{ open: lightboxOpen }"
        @click.self="closeLightbox"
      >
        <button type="button" class="work-lightbox-close" aria-label="关闭" @click="closeLightbox">
          ESC / CLOSE
        </button>
        <figure class="work-lightbox-frame">
          <img :src="lightbox.src" :alt="lightbox.title" />
          <figcaption>
            <strong>{{ lightbox.title }}</strong>
            <span>{{ lightbox.caption }}</span>
          </figcaption>
        </figure>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { withBase } from 'vuepress/client'
import * as THREE from 'three'

defineProps<{
  scrollY?: number
}>()

const sectionEl = ref<HTMLElement | null>(null)
const canvasEl = ref<HTMLCanvasElement | null>(null)
const activeLabel = ref('FAST MEDIA')
const hoverTitle = ref('')
const progress = ref(0)
const progressLabel = computed(() => `${Math.round(progress.value * 100)}%`)

const lightbox = ref<{ src: string; title: string; caption: string } | null>(null)
const lightboxOpen = ref(false)

const menu = ['DASHBOARD', 'EXPLORE', 'RSS', 'CALENDAR', 'ORGANIZE', '115', 'EMBY', 'ASSISTANT']

const shotSources = [
  {
    src: withBase('/shots/SHOT-01-dashboard.png'),
    title: 'DASHBOARD',
    caption: '概览工作台 · 媒体统计与继续观看',
  },
  {
    src: withBase('/shots/SHOT-02-explore-search.png'),
    title: 'EXPLORE',
    caption: '探索与全局搜索',
  },
  {
    src: withBase('/shots/SHOT-03-rss-download.png'),
    title: 'RSS',
    caption: 'RSS 订阅与下载进度',
  },
  {
    src: withBase('/shots/SHOT-04-subscription-calendar.png'),
    title: 'CALENDAR',
    caption: '影视订阅日历',
  },
  {
    src: withBase('/shots/SHOT-05-organize.png'),
    title: 'ORGANIZE',
    caption: '整理归档与刮削',
  },
  {
    src: withBase('/shots/SHOT-06-plugins-115.png'),
    title: '115',
    caption: '115 助手账号与空间',
  },
  {
    src: withBase('/shots/SHOT-07-assistant-mcp.png'),
    title: 'ASSISTANT',
    caption: '智能助手与系统工具',
  },
  {
    src: withBase('/shots/SHOT-08-emby-302.png'),
    title: 'EMBY 302',
    caption: 'Emby 302 直链与刷新',
  },
  {
    src: withBase('/shots/SHOT-09-file-manager.png'),
    title: 'FILES',
    caption: '文件与网盘浏览',
  },
]

// helix + outer ring so every screenshot gets air
const shots = shotSources.map((s, i) => {
  const n = shotSources.length
  const t = i / n
  const helix = i * ((Math.PI * 2) / 5.2)
  const layer = i % 2
  return {
    ...s,
    angle: helix,
    y: (t - 0.48) * 3.8 + (layer ? 0.22 : -0.12),
    radius: 2.85 + layer * 0.55 + Math.sin(i * 1.7) * 0.18,
    tilt: (layer ? -1 : 1) * (0.12 + (i % 3) * 0.06),
  }
})

type Pane = {
  mesh: THREE.Mesh
  mat: THREE.ShaderMaterial
  title: string
  caption: string
  src: string
  base: THREE.Vector3
  phase: number
}

let renderer: THREE.WebGLRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let group: THREE.Group | null = null
let sculpture: THREE.Group | null = null
let camPath: THREE.CatmullRomCurve3 | null = null
let lookPath: THREE.CatmullRomCurve3 | null = null
let raf = 0
let running = true
let panes: Pane[] = []
let raycaster: THREE.Raycaster | null = null
const pointerNdc = new THREE.Vector2(0, 0)
const targetCam = { x: 0, y: 0 }
const smoothCam = { x: 0, y: 0 }
let dragging = false
let dragLastX = 0
let dragDist = 0
let orbit = 0
let orbitTarget = 0
let hoverPane: Pane | null = null
let startMs = 0
let io: IntersectionObserver | null = null
let visible = false
const disposables: Array<{ dispose: () => void }> = []

let dustCloud: THREE.Points | null = null
let grainMesh: THREE.Mesh | null = null

const VERT = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const FRAG = `
uniform sampler2D uMap;
uniform float uHover;
uniform float uTime;
uniform vec2 uPointer;
uniform float uLoaded;
varying vec2 vUv;

float roundedMask(vec2 uv, float r) {
  vec2 p = abs(uv - 0.5) * 2.0;
  vec2 b = vec2(1.0 - r);
  vec2 d = max(p - b, 0.0);
  float dist = length(d) / max(r, 0.0001);
  return 1.0 - smoothstep(0.92, 1.0, dist);
}

void main() {
  vec2 uv = vUv;
  vec2 p = uPointer;
  float d = distance(uv, p);
  float amp = uHover * 0.1;
  float ripple = sin(d * 26.0 - uTime * 5.5) * amp * exp(-d * 5.0);
  uv += normalize(uv - p + 0.0001) * ripple;
  uv += (uv - 0.5) * uHover * 0.035;

  vec2 ca = (uv - 0.5) * (0.003 + uHover * 0.01);
  float rr = texture2D(uMap, uv + ca).r;
  float gg = texture2D(uMap, uv).g;
  float bb = texture2D(uMap, uv - ca).b;
  vec3 color = vec3(rr, gg, bb);

  float grain = fract(sin(dot(vUv * vec2(312.0, 178.0) + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  color += (grain - 0.5) * 0.045;

  float edge = smoothstep(0.0, 0.035, uv.x) * smoothstep(0.0, 0.035, uv.y)
    * smoothstep(0.0, 0.035, 1.0 - uv.x) * smoothstep(0.0, 0.035, 1.0 - uv.y);
  color += vec3(0.25, 0.85, 0.8) * (1.0 - edge) * (0.08 + uHover * 0.32);

  float mask = roundedMask(vUv, 0.18);
  float alpha = mix(0.08, 0.88, uLoaded) * mask;
  alpha *= mix(0.62, 1.0, uHover);
  gl_FragColor = vec4(color, alpha);
}`

const CORE_VERT = `
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec4 world = modelMatrix * vec4(position, 1.0);
  vNormal = normalize(mat3(modelMatrix) * normal);
  vView = normalize(cameraPosition - world.xyz);
  gl_Position = projectionMatrix * viewMatrix * world;
}`

const CORE_FRAG = `
varying vec3 vNormal;
varying vec3 vView;
void main(){
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vView);
  float fresnel = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  vec3 deep = vec3(0.05, 0.07, 0.1);
  vec3 edge = vec3(0.35, 0.85, 0.82);
  vec3 color = mix(deep, edge, fresnel * 0.85);
  float spec = pow(max(dot(reflect(-v, n), normalize(vec3(0.2, 0.85, 0.4))), 0.0), 48.0);
  color += vec3(0.75, 0.92, 0.95) * spec * 0.55;
  gl_FragColor = vec4(color, 0.96);
}`

function createArchiveCore() {
  sculpture = new THREE.Group()

  const glass = new THREE.ShaderMaterial({
    uniforms: {},
    vertexShader: CORE_VERT,
    fragmentShader: CORE_FRAG,
    transparent: true,
  })
  disposables.push(glass)

  const chrome = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0x0e141c),
    metalness: 0.92,
    roughness: 0.22,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
    emissive: new THREE.Color(0x0a2a28),
    emissiveIntensity: 0.18,
  })
  disposables.push(chrome)

  const glowLine = new THREE.MeshBasicMaterial({
    color: 0x5ef0d8,
    transparent: true,
    opacity: 0.55,
  })
  disposables.push(glowLine)

  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.34, 3.6, 48, 1, true), glass)
  disposables.push(column.geometry)
  sculpture.add(column)

  const columnCap = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.08, 48), chrome)
  disposables.push(columnCap.geometry)
  columnCap.position.y = 1.85
  sculpture.add(columnCap)
  const columnBase = columnCap.clone()
  columnBase.position.y = -1.85
  sculpture.add(columnBase)

  const ringSpecs = [
    { r: 1.15, tube: 0.018, y: 0.15, rx: Math.PI / 2.1, ry: 0.2 },
    { r: 1.55, tube: 0.012, y: -0.35, rx: Math.PI / 2.4, ry: -0.35 },
    { r: 1.9, tube: 0.01, y: 0.55, rx: Math.PI / 1.85, ry: 0.55 },
  ]
  for (const rs of ringSpecs) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(rs.r, rs.tube, 16, 128), chrome)
    disposables.push(ring.geometry)
    ring.position.y = rs.y
    ring.rotation.x = rs.rx
    ring.rotation.y = rs.ry
    sculpture.add(ring)

    const accent = new THREE.Mesh(new THREE.TorusGeometry(rs.r, rs.tube * 0.35, 8, 96), glowLine)
    disposables.push(accent.geometry)
    accent.position.copy(ring.position)
    accent.rotation.copy(ring.rotation)
    sculpture.add(accent)
  }

  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')
  shotSources.forEach((s, i) => {
    const t = i / shotSources.length
    const a = t * Math.PI * 2
    const y = (t - 0.5) * 2.8
    const r = 1.05 + (i % 3) * 0.12
    const geo = new THREE.PlaneGeometry(0.72, 0.46)
    disposables.push(geo)
    const mat = new THREE.MeshBasicMaterial({
      color: 0x111820,
      transparent: true,
      opacity: 0.92,
      side: THREE.DoubleSide,
    })
    disposables.push(mat)
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(Math.cos(a) * r, y, Math.sin(a) * r)
    mesh.lookAt(0, y * 0.4, 0)
    mesh.userData.spin = 0.15 + (i % 4) * 0.03
    mesh.userData.baseY = y
    mesh.userData.phase = i * 0.55
    sculpture!.add(mesh)

    loader.load(s.src, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace
      mat.map = tex
      mat.color.set(0xffffff)
      mat.needsUpdate = true
      disposables.push(tex)
    })
  })

  const floor = new THREE.Mesh(
    new THREE.CircleGeometry(2.2, 64),
    new THREE.MeshBasicMaterial({
      color: 0x122028,
      transparent: true,
      opacity: 0.22,
    }),
  )
  disposables.push(floor.geometry, floor.material as THREE.Material)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -2.05
  sculpture.add(floor)

  sculpture.position.set(0, 0.15, -0.1)
  group?.add(sculpture)
}

function createAtmosphere() {
  if (!scene) return

  const count = 1100
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const cA = new THREE.Color(0x5b8cff)
  const cB = new THREE.Color(0x22d3c5)
  const cC = new THREE.Color(0xa8c0d8)
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2
    const r = 0.5 + Math.random() * 4.8
    const y = (Math.random() - 0.45) * 5.4
    positions[i * 3] = Math.cos(a) * r
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(a) * r - 0.3
    const col = Math.random() < 0.55 ? cA.clone().lerp(cB, Math.random()) : cB.clone().lerp(cC, Math.random())
    colors[i * 3] = col.r
    colors[i * 3 + 1] = col.g
    colors[i * 3 + 2] = col.b
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  disposables.push(geo)
  const mat = new THREE.PointsMaterial({
    size: 0.024,
    vertexColors: true,
    transparent: true,
    opacity: 0.62,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  })
  disposables.push(mat)
  dustCloud = new THREE.Points(geo, mat)
  scene.add(dustCloud)

  const grainMat = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    fog: false,
    blending: THREE.NormalBlending,
    uniforms: { uTime: { value: 0 } },
    vertexShader: `
      varying vec2 vUv;
      void main(){
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }`,
    fragmentShader: `
      uniform float uTime;
      varying vec2 vUv;
      void main(){
        float n = fract(sin(dot(vUv * vec2(1400.0, 900.0) + floor(uTime * 18.0), vec2(12.9898, 78.233))) * 43758.5453);
        float a = abs(n - 0.5) * 0.09;
        gl_FragColor = vec4(1.0, 1.0, 1.0, a);
      }`,
  })
  disposables.push(grainMat)
  grainMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), grainMat)
  disposables.push(grainMesh.geometry)
  grainMesh.renderOrder = 999
  scene.add(grainMesh)
}

function buildCameraPaths() {
  camPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0.3, -0.2, 8.8),
      new THREE.Vector3(4.2, 0.5, 6.4),
      new THREE.Vector3(4.6, 1.1, 3.0),
      new THREE.Vector3(0.2, 1.55, 2.5),
      new THREE.Vector3(-4.2, 0.7, 3.8),
      new THREE.Vector3(-3.4, -0.1, 6.4),
      new THREE.Vector3(-0.2, 0.2, 8.0),
    ],
    false,
    'catmullrom',
    0.4,
  )
  lookPath = new THREE.CatmullRomCurve3(
    [
      new THREE.Vector3(0, 0.2, -0.1),
      new THREE.Vector3(0.1, 0.35, -0.15),
      new THREE.Vector3(0, 0.55, -0.2),
      new THREE.Vector3(-0.08, 0.4, -0.15),
      new THREE.Vector3(0, 0.25, -0.1),
      new THREE.Vector3(0.05, 0.15, -0.08),
      new THREE.Vector3(0, 0.2, -0.1),
    ],
    false,
    'catmullrom',
    0.4,
  )
}

function createSculpture() {
  createArchiveCore()
}

function createRenderer() {
  const canvas = canvasEl.value
  if (!canvas) return
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.setClearColor(0x000000, 0)
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.25
  renderer.outputColorSpace = THREE.SRGBColorSpace
  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x05060c, 0.028)
  camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100)
  camera.position.set(0.15, -0.35, 8.2)
  group = new THREE.Group()
  scene.add(group)

  const pmrem = new THREE.PMREMGenerator(renderer)
  const envScene = new THREE.Scene()
  envScene.add(new THREE.AmbientLight(0xffffff, 1))
  const envL1 = new THREE.PointLight(0x88c8ff, 36, 20)
  envL1.position.set(4, 3, 2)
  envScene.add(envL1)
  const envL2 = new THREE.PointLight(0x44ffe0, 38, 20)
  envL2.position.set(-4, -1, 3)
  envScene.add(envL2)
  const envL3 = new THREE.PointLight(0xffffff, 26, 20)
  envL3.position.set(0, 5, -2)
  envScene.add(envL3)
  const envMap = pmrem.fromScene(envScene, 0.04).texture
  scene.environment = envMap
  disposables.push(envMap)
  pmrem.dispose()

  scene.add(new THREE.AmbientLight(0xb8c8d8, 0.5))
  const p1 = new THREE.PointLight(0x7ab8ff, 2.0, 30)
  p1.position.set(2.8, 2.2, 4)
  scene.add(p1)
  const p2 = new THREE.PointLight(0x2ee6d6, 2.0, 28)
  p2.position.set(-3.4, -0.4, 3.2)
  scene.add(p2)
  const p3 = new THREE.PointLight(0xffffff, 1.0, 18)
  p3.position.set(0.3, -1.2, 2)
  scene.add(p3)
  const spot = new THREE.SpotLight(0xffffff, 2.0, 24, 0.55, 0.45, 1)
  spot.position.set(0, 5.5, 6)
  spot.target.position.set(0, 0.2, -0.2)
  scene.add(spot)
  scene.add(spot.target)

  raycaster = new THREE.Raycaster()
  startMs = performance.now()
  createSculpture()
  createAtmosphere()
  buildCameraPaths()
  loadPanes()
  resize()
}

function loadPanes() {
  if (!group) return
  const loader = new THREE.TextureLoader()
  loader.setCrossOrigin('anonymous')
  panes = []

  shots.forEach((s, index) => {
    const geo = new THREE.PlaneGeometry(2.15, 1.36, 32, 24)
    disposables.push(geo)
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uMap: { value: null },
        uHover: { value: 0 },
        uTime: { value: 0 },
        uPointer: { value: new THREE.Vector2(0.5, 0.5) },
        uLoaded: { value: 0 },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    disposables.push(mat)
    const mesh = new THREE.Mesh(geo, mat)
    const x = Math.sin(s.angle) * s.radius
    const z = Math.cos(s.angle) * s.radius - 0.35
    mesh.position.set(x, s.y, z)
    mesh.lookAt(0, s.y * 0.35, -0.35)
    mesh.rotateZ(s.tilt * 0.2)
    mesh.userData.title = s.title
    group!.add(mesh)

    panes.push({
      mesh,
      mat,
      title: s.title,
      caption: s.caption,
      src: s.src,
      base: mesh.position.clone(),
      phase: index * 0.7,
    })

    loader.load(
      s.src,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace
        tex.anisotropy = 4
        mat.uniforms.uMap.value = tex
        mat.uniforms.uLoaded.value = 1
        disposables.push(tex)
      },
      undefined,
      () => {
        const data = new Uint8Array([20, 28, 48, 255])
        const t = new THREE.DataTexture(data, 1, 1)
        t.needsUpdate = true
        mat.uniforms.uMap.value = t
        mat.uniforms.uLoaded.value = 0.35
        disposables.push(t)
      },
    )
  })
}

function resize() {
  const section = sectionEl.value
  const canvas = canvasEl.value
  if (!section || !canvas || !renderer || !camera) return
  const width = section.clientWidth
  const height = canvas.clientHeight || Math.max(560, window.innerHeight * 0.92)
  renderer.setSize(width, height, false)
  camera.aspect = width / Math.max(1, height)
  camera.updateProjectionMatrix()
}

function onPointer(e: PointerEvent) {
  const canvas = canvasEl.value
  if (!canvas || lightbox.value) return
  const r = canvas.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  const y = (e.clientY - r.top) / r.height
  pointerNdc.x = x * 2 - 1
  pointerNdc.y = -(y * 2 - 1)
  targetCam.x = (x - 0.5) * 1.1
  targetCam.y = (0.5 - y) * 0.7

  if (dragging) {
    const dx = e.clientX - dragLastX
    dragDist += Math.abs(dx)
    orbitTarget += dx * 0.0035
    dragLastX = e.clientX
  }

  if (raycaster && camera) {
    raycaster.setFromCamera(pointerNdc, camera)
    const hits = raycaster.intersectObjects(
      panes.map((p) => p.mesh),
      false,
    )
    const hit = hits[0]
    const next = hit ? panes.find((p) => p.mesh === hit.object) || null : null
    hoverPane = next
    hoverTitle.value = next?.title || ''
    if (next) {
      activeLabel.value = next.title
      if (hit?.uv) next.mat.uniforms.uPointer.value.set(hit.uv.x, hit.uv.y)
    }
  }
}

function onDown(e: PointerEvent) {
  if (lightbox.value) return
  dragging = true
  dragDist = 0
  dragLastX = e.clientX
  canvasEl.value?.setPointerCapture?.(e.pointerId)
}

function onUp(e: PointerEvent) {
  const wasDrag = dragDist > 7
  dragging = false
  try {
    canvasEl.value?.releasePointerCapture?.(e.pointerId)
  } catch {
    /* noop */
  }
  if (!wasDrag && hoverPane && e.button === 0) {
    openLightbox(hoverPane)
  }
}

function openLightbox(pane: Pane) {
  lightbox.value = {
    src: pane.src,
    title: pane.title,
    caption: pane.caption,
  }
  requestAnimationFrame(() => {
    lightboxOpen.value = true
  })
  document.documentElement.classList.add('work-lightbox-lock')
}

function closeLightbox() {
  lightboxOpen.value = false
  window.setTimeout(() => {
    lightbox.value = null
    document.documentElement.classList.remove('work-lightbox-lock')
  }, 280)
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && lightbox.value) closeLightbox()
}

function updateScrollProgress() {
  const section = sectionEl.value
  if (!section) return
  const rect = section.getBoundingClientRect()
  const view = window.innerHeight || 1
  // progress while section travels through viewport
  const start = view * 0.85
  const end = -rect.height + view * 0.2
  const t = (start - rect.top) / Math.max(1, start - end)
  progress.value = Math.min(1, Math.max(0, t))
}

function tick() {
  if (!running) return
  raf = requestAnimationFrame(tick)
  if (!visible || !renderer || !scene || !camera || !group) return

  const t = (performance.now() - startMs) * 0.001
  updateScrollProgress()

  smoothCam.x += (targetCam.x - smoothCam.x) * 0.055
  smoothCam.y += (targetCam.y - smoothCam.y) * 0.055
  orbit += (orbitTarget - orbit) * 0.055

  const pathT = progress.value
  if (camPath && lookPath) {
    const camPos = camPath.getPoint(pathT)
    const look = lookPath.getPoint(pathT)
    camera.position.set(
      camPos.x + smoothCam.x * 0.55 + Math.sin(orbit) * 0.25,
      camPos.y + smoothCam.y * 0.45,
      camPos.z,
    )
    camera.lookAt(
      look.x + smoothCam.x * 0.12,
      look.y + smoothCam.y * 0.08,
      look.z,
    )
  }

  group.rotation.y = orbit * 0.28 + pathT * 0.18
  group.position.y = Math.sin(t * 0.28) * 0.04

  if (sculpture) {
    sculpture.rotation.y = t * 0.12 + orbit * 0.08
    sculpture.rotation.x = Math.sin(t * 0.22) * 0.025
    sculpture.traverse((obj) => {
      const mesh = obj as THREE.Mesh
      if (mesh.userData?.baseY != null) {
        mesh.position.y = mesh.userData.baseY + Math.sin(t * 0.8 + mesh.userData.phase) * 0.04
        mesh.rotation.y += (mesh.userData.spin || 0.1) * 0.002
      }
    })
  }

  if (dustCloud) {
    dustCloud.rotation.y = t * 0.04
    dustCloud.rotation.x = Math.sin(t * 0.12) * 0.04
  }

  if (grainMesh) {
    const gm = grainMesh.material as THREE.ShaderMaterial
    if (gm.uniforms?.uTime) gm.uniforms.uTime.value = t
  }

  for (const pane of panes) {
    const hover = !lightbox.value && hoverPane === pane ? 1 : 0
    pane.mat.uniforms.uHover.value += (hover - pane.mat.uniforms.uHover.value) * 0.12
    pane.mat.uniforms.uTime.value = t
    const floatY = Math.sin(t * 0.65 + pane.phase) * 0.08
    const floatX = Math.cos(t * 0.4 + pane.phase) * 0.03
    pane.mesh.position.x = pane.base.x + floatX
    pane.mesh.position.y = pane.base.y + floatY
    pane.mesh.scale.setScalar(1 + pane.mat.uniforms.uHover.value * 0.06)
  }

  renderer.render(scene, camera)
}

onMounted(() => {
  createRenderer()
  const canvas = canvasEl.value
  canvas?.addEventListener('pointermove', onPointer, { passive: true })
  window.addEventListener('resize', resize)
  window.addEventListener('keydown', onKey)

  io = new IntersectionObserver(
    ([entry]) => {
      visible = !!entry?.isIntersecting
    },
    { threshold: 0.02 },
  )
  if (sectionEl.value) io.observe(sectionEl.value)

  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(raf)
  io?.disconnect()
  window.removeEventListener('resize', resize)
  window.removeEventListener('keydown', onKey)
  canvasEl.value?.removeEventListener('pointermove', onPointer)
  document.documentElement.classList.remove('work-lightbox-lock')
  disposables.forEach((d) => d.dispose())
  renderer?.dispose()
})
</script>

<style scoped>
.work-universe {
  position: relative;
  z-index: 1;
  min-height: 170vh;
  padding: 24px 0 48px;
  display: grid;
  gap: 12px;
}

.work-stage {
  position: sticky;
  top: 64px;
  height: 92vh;
  border-block: 1px solid rgba(255, 255, 255, 0.08);
  background:
    radial-gradient(900px 520px at 50% 42%, rgba(91, 140, 255, 0.1), transparent 58%),
    radial-gradient(800px 400px at 50% 70%, rgba(34, 211, 197, 0.08), transparent 60%),
    rgba(0, 0, 0, 0.3);
}

.work-canvas {
  width: 100%;
  height: 100%;
  display: block;
  cursor: grab;
  touch-action: none;
}

.work-canvas.hoverable {
  cursor: pointer;
}

.work-hud {
  position: absolute;
  z-index: 2;
  left: clamp(16px, 4vw, 48px);
  top: 28px;
  display: flex;
  justify-content: space-between;
  width: calc(100% - clamp(32px, 8vw, 96px));
  pointer-events: none;
  font-family: 'Space Grotesk', ui-monospace, monospace;
}

.work-hud .eyebrow {
  margin: 0 0 10px;
  letter-spacing: 0.18em;
  font-size: 11px;
  color: rgba(127, 240, 228, 0.72);
}

.work-hud ul {
  margin: 0;
  padding: 0;
  list-style: none;
  display: grid;
  gap: 4px;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: rgba(244, 247, 255, 0.45);
}

.work-hud-meta {
  text-align: right;
  display: grid;
  gap: 6px;
  align-content: start;
}

.work-hud-meta span:first-child {
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.mono {
  font-size: 11px;
  letter-spacing: 0.14em;
  color: rgba(244, 247, 255, 0.38);
}

.work-caption {
  max-width: 1440px;
  margin: 0 auto;
  padding: 8px clamp(16px, 4vw, 48px) 0;
}

.work-caption .eyebrow {
  margin: 0 0 10px;
  letter-spacing: 0.18em;
  font-size: 12px;
  color: #7ff0e4;
  font-weight: 700;
}

.work-caption h2 {
  margin: 0;
  font-size: clamp(28px, 4vw, 40px);
  letter-spacing: -0.03em;
}

.work-caption p {
  margin: 10px 0 16px;
  color: rgba(244, 247, 255, 0.62);
}

.btn {
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 650;
}

@media (max-width: 760px) {
  .work-universe {
    min-height: 140vh;
  }

  .work-hud ul {
    display: none;
  }

  .work-stage {
    height: 72vh;
  }
}
</style>

<style>
.work-lightbox-lock,
.work-lightbox-lock body {
  overflow: hidden !important;
}

.work-lightbox {
  position: fixed;
  inset: 0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 32px;
  background: rgba(3, 5, 10, 0.2);
  backdrop-filter: blur(0px);
  opacity: 0;
  transition: opacity 0.28s ease, backdrop-filter 0.28s ease, background 0.28s ease;
}

.work-lightbox.open {
  opacity: 1;
  background: rgba(3, 5, 10, 0.82);
  backdrop-filter: blur(16px);
}

.work-lightbox-close {
  position: absolute;
  top: 22px;
  right: 22px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(244, 247, 255, 0.7);
  letter-spacing: 0.16em;
  font-size: 11px;
  font-weight: 700;
  padding: 10px 14px;
  cursor: pointer;
}

.work-lightbox-frame {
  margin: 0;
  width: min(1200px, 92vw);
  transform: translateY(18px) scale(0.97);
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.35s ease;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: #0a0f18;
  box-shadow: 0 30px 100px rgba(0, 0, 0, 0.55);
}

.work-lightbox.open .work-lightbox-frame {
  transform: none;
  opacity: 1;
}

.work-lightbox-frame img {
  display: block;
  width: 100%;
  max-height: min(78vh, 900px);
  object-fit: contain;
  background: #070a12;
}

.work-lightbox-frame figcaption {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(244, 247, 255, 0.7);
  font-size: 13px;
}

.work-lightbox-frame strong {
  color: #fff;
  letter-spacing: 0.12em;
}
</style>
