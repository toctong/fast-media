<template>
  <canvas ref="el" class="nebula-canvas" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const el = ref<HTMLCanvasElement | null>(null)

let raf = 0
let running = true
let w = 0
let h = 0
let dpr = 1
const mouse = { x: 0, y: 0, tx: 0, ty: 0, active: false }
const pts: Array<{
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  pulse: number
}> = []

function resize() {
  const canvas = el.value
  if (!canvas) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  const ctx = canvas.getContext('2d')
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  seed()
}

function seed() {
  pts.length = 0
  const count = Math.floor((w * h) / 14000)
  for (let i = 0; i < count; i++) {
    pts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.55 + 0.15,
      pulse: Math.random() * Math.PI * 2,
    })
  }
}

function onMove(e: PointerEvent) {
  mouse.tx = e.clientX
  mouse.ty = e.clientY
  mouse.active = true
}

function onLeave() {
  mouse.active = false
}

function tick() {
  if (!running) return
  const canvas = el.value
  const ctx = canvas?.getContext('2d')
  if (!ctx) return

  mouse.x += (mouse.tx - mouse.x) * 0.08
  mouse.y += (mouse.ty - mouse.y) * 0.08

  ctx.clearRect(0, 0, w, h)

  // soft vignette glow under cursor
  if (mouse.active) {
    const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 340)
    g.addColorStop(0, 'rgba(34, 211, 197, 0.06)')
    g.addColorStop(0.35, 'rgba(91, 140, 255, 0.04)')
    g.addColorStop(1, 'rgba(0, 0, 0, 0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, w, h)
  }

  for (const p of pts) {
    p.pulse += 0.02
    p.x += p.vx
    p.y += p.vy
    if (p.x < -20) p.x = w + 20
    if (p.x > w + 20) p.x = -20
    if (p.y < -20) p.y = h + 20
    if (p.y > h + 20) p.y = -20

    if (mouse.active) {
      const dx = p.x - mouse.x
      const dy = p.y - mouse.y
      const dist = Math.hypot(dx, dy) || 1
      if (dist < 180) {
        const f = (180 - dist) / 180
        p.x += (dx / dist) * f * 0.9
        p.y += (dy / dist) * f * 0.9
      }
    }

    const glow = 0.55 + Math.sin(p.pulse) * 0.25
    ctx.beginPath()
    ctx.fillStyle = `rgba(160, 190, 220, ${p.a * glow * 0.55})`
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
    ctx.fill()
  }

  // constellation links (nearby only, capped passes)
  ctx.lineWidth = 0.7
  const maxLink = Math.min(pts.length, 90)
  for (let i = 0; i < maxLink; i++) {
    const a = pts[i]
    for (let j = i + 1; j < maxLink; j++) {
      const b = pts[j]
      const dx = a.x - b.x
      const dy = a.y - b.y
      const d2 = dx * dx + dy * dy
      if (d2 > 12000) continue
      const d = Math.sqrt(d2)
      const alpha = (1 - d / 110) * 0.2
      ctx.strokeStyle = `rgba(127, 240, 228, ${alpha})`
      ctx.beginPath()
      ctx.moveTo(a.x, a.y)
      ctx.lineTo(b.x, b.y)
      ctx.stroke()
    }
  }

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerleave', onLeave)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerleave', onLeave)
})
</script>

<style scoped>
.nebula-canvas {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>
