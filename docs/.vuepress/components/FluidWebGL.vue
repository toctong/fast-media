<template>
  <canvas ref="el" class="fluid-webgl" aria-hidden="true" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * Lightweight WebGL pointer-fluid:
 * velocity splat → advect dye → fade. Mouse-linked bloom trails.
 */
const el = ref<HTMLCanvasElement | null>(null)

let gl: WebGLRenderingContext | null = null
let raf = 0
let running = true
let w = 0
let h = 0
let dpr = 1

const mouse = { x: 0.5, y: 0.5, px: 0.5, py: 0.5, vx: 0, vy: 0, down: false }
let texA: WebGLTexture | null = null
let texB: WebGLTexture | null = null
let fboA: WebGLFramebuffer | null = null
let fboB: WebGLFramebuffer | null = null
let progSim: WebGLProgram | null = null
let progDraw: WebGLProgram | null = null
let buf: WebGLBuffer | null = null
let flip = false
const simScale = 0.45

function compile(ctx: WebGLRenderingContext, type: number, src: string) {
  const sh = ctx.createShader(type)!
  ctx.shaderSource(sh, src)
  ctx.compileShader(sh)
  if (!ctx.getShaderParameter(sh, ctx.COMPILE_STATUS)) {
    console.warn(ctx.getShaderInfoLog(sh))
  }
  return sh
}

function program(ctx: WebGLRenderingContext, vs: string, fs: string) {
  const p = ctx.createProgram()!
  ctx.attachShader(p, compile(ctx, ctx.VERTEX_SHADER, vs))
  ctx.attachShader(p, compile(ctx, ctx.FRAGMENT_SHADER, fs))
  ctx.linkProgram(p)
  return p
}

const VS = `
attribute vec2 a;
varying vec2 v;
void main(){
  v = a * 0.5 + 0.5;
  gl_Position = vec4(a, 0.0, 1.0);
}`

const FS_SIM = `
precision highp float;
varying vec2 v;
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform vec2 uTexel;
uniform float uForce;
uniform float uTime;

void main(){
  vec2 uv = v;
  // soft advection along residual field
  vec4 prev = texture2D(uPrev, uv - uVel * 0.018);
  float decay = 0.975;
  vec3 col = prev.rgb * decay;

  float d = distance(uv, uMouse);
  float splat = exp(-d * d * 48.0) * uForce;
  vec3 dye = vec3(0.22, 0.42, 0.58) * 0.4 + vec3(0.12, 0.55, 0.48) * 0.3;
  dye += 0.06 * vec3(sin(uTime), cos(uTime * 0.8), sin(uTime * 1.3));
  col += dye * splat * 0.75;

  // curl-ish swirl around pointer
  vec2 dir = uv - uMouse;
  float swirl = splat * 0.35;
  col += vec3(0.2, 0.55, 0.9) * swirl * (0.5 + 0.5 * sin(atan(dir.y, dir.x) * 3.0 + uTime));

  // subtle noise bloom
  float n = fract(sin(dot(uv * 80.0 + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  col += n * 0.008;

  gl_FragColor = vec4(col, 1.0);
}`

const FS_DRAW = `
precision highp float;
varying vec2 v;
uniform sampler2D uSim;
uniform vec2 uMouse;
uniform float uTime;

void main(){
  vec2 uv = v;
  // slight lens warp toward pointer
  vec2 d = uv - uMouse;
  float dist = length(d);
  uv -= d * exp(-dist * 6.0) * 0.04;

  vec3 c = texture2D(uSim, uv).rgb;
  // chromatic aberration
  float ab = 0.0018 + exp(-dist * 5.0) * 0.004;
  float r = texture2D(uSim, uv + vec2(ab, 0.0)).r;
  float g = c.g;
  float b = texture2D(uSim, uv - vec2(ab, 0.0)).b;
  c = vec3(r, g, b);

  // vignette
  float vig = smoothstep(1.15, 0.25, dist * 1.15);
  c *= 0.35 + vig * 0.9;

  // film grain
  float n = fract(sin(dot(v * vec2(210.0, 170.0) + uTime, vec2(12.9898,78.233))) * 43758.5453);
  c += (n - 0.5) * 0.035;

  gl_FragColor = vec4(c, 0.88);
}`

function makeTarget(ctx: WebGLRenderingContext, tw: number, th: number) {
  const tex = ctx.createTexture()!
  ctx.bindTexture(ctx.TEXTURE_2D, tex)
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.LINEAR)
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.LINEAR)
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE)
  ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE)
  ctx.texImage2D(ctx.TEXTURE_2D, 0, ctx.RGBA, tw, th, 0, ctx.RGBA, ctx.UNSIGNED_BYTE, null)
  const fbo = ctx.createFramebuffer()!
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, fbo)
  ctx.framebufferTexture2D(ctx.FRAMEBUFFER, ctx.COLOR_ATTACHMENT0, ctx.TEXTURE_2D, tex, 0)
  return { tex, fbo }
}

function resize() {
  const canvas = el.value
  if (!canvas || !gl) return
  dpr = Math.min(window.devicePixelRatio || 1, 2)
  w = window.innerWidth
  h = window.innerHeight
  canvas.width = Math.floor(w * dpr)
  canvas.height = Math.floor(h * dpr)
  canvas.style.width = `${w}px`
  canvas.style.height = `${h}px`
  gl.viewport(0, 0, canvas.width, canvas.height)

  const tw = Math.max(64, Math.floor(w * simScale))
  const th = Math.max(64, Math.floor(h * simScale))
  const a = makeTarget(gl, tw, th)
  const b = makeTarget(gl, tw, th)
  texA = a.tex
  fboA = a.fbo
  texB = b.tex
  fboB = b.fbo
}

function onMove(e: PointerEvent) {
  const nx = e.clientX / Math.max(1, window.innerWidth)
  const ny = 1 - e.clientY / Math.max(1, window.innerHeight)
  mouse.vx = nx - mouse.x
  mouse.vy = ny - mouse.y
  mouse.px = mouse.x
  mouse.py = mouse.y
  mouse.x = nx
  mouse.y = ny
}

function onDown() {
  mouse.down = true
}
function onUp() {
  mouse.down = false
}

function tick(t: number) {
  if (!running || !gl || !progSim || !progDraw || !buf) return
  const ctx = gl
  const time = t * 0.001
  const force = Math.min(0.9, Math.hypot(mouse.vx, mouse.vy) * 28 + (mouse.down ? 0.28 : 0.06))

  const tw = Math.max(64, Math.floor(w * simScale))
  const th = Math.max(64, Math.floor(h * simScale))

  // simulate
  const readTex = flip ? texB : texA
  const writeFbo = flip ? fboA : fboB
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, writeFbo)
  ctx.viewport(0, 0, tw, th)
  ctx.useProgram(progSim)
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buf)
  const aLoc = ctx.getAttribLocation(progSim, 'a')
  ctx.enableVertexAttribArray(aLoc)
  ctx.vertexAttribPointer(aLoc, 2, ctx.FLOAT, false, 0, 0)
  ctx.activeTexture(ctx.TEXTURE0)
  ctx.bindTexture(ctx.TEXTURE_2D, readTex)
  ctx.uniform1i(ctx.getUniformLocation(progSim, 'uPrev'), 0)
  ctx.uniform2f(ctx.getUniformLocation(progSim, 'uMouse'), mouse.x, mouse.y)
  ctx.uniform2f(ctx.getUniformLocation(progSim, 'uVel'), mouse.vx, mouse.vy)
  ctx.uniform2f(ctx.getUniformLocation(progSim, 'uTexel'), 1 / tw, 1 / th)
  ctx.uniform1f(ctx.getUniformLocation(progSim, 'uForce'), force)
  ctx.uniform1f(ctx.getUniformLocation(progSim, 'uTime'), time)
  ctx.drawArrays(ctx.TRIANGLES, 0, 6)
  flip = !flip

  // damp velocity
  mouse.vx *= 0.86
  mouse.vy *= 0.86

  // draw to screen
  ctx.bindFramebuffer(ctx.FRAMEBUFFER, null)
  ctx.viewport(0, 0, Math.floor(w * dpr), Math.floor(h * dpr))
  ctx.enable(ctx.BLEND)
  ctx.blendFunc(ctx.SRC_ALPHA, ctx.ONE_MINUS_SRC_ALPHA)
  ctx.useProgram(progDraw)
  ctx.bindBuffer(ctx.ARRAY_BUFFER, buf)
  const a2 = ctx.getAttribLocation(progDraw, 'a')
  ctx.enableVertexAttribArray(a2)
  ctx.vertexAttribPointer(a2, 2, ctx.FLOAT, false, 0, 0)
  ctx.activeTexture(ctx.TEXTURE0)
  ctx.bindTexture(ctx.TEXTURE_2D, flip ? texA : texB)
  ctx.uniform1i(ctx.getUniformLocation(progDraw, 'uSim'), 0)
  ctx.uniform2f(ctx.getUniformLocation(progDraw, 'uMouse'), mouse.x, mouse.y)
  ctx.uniform1f(ctx.getUniformLocation(progDraw, 'uTime'), time)
  ctx.drawArrays(ctx.TRIANGLES, 0, 6)

  raf = requestAnimationFrame(tick)
}

onMounted(() => {
  const canvas = el.value
  if (!canvas) return
  gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: false })
  if (!gl) return

  progSim = program(gl, VS, FS_SIM)
  progDraw = program(gl, VS, FS_DRAW)
  buf = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buf)
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
    gl.STATIC_DRAW,
  )

  resize()
  window.addEventListener('resize', resize)
  window.addEventListener('pointermove', onMove, { passive: true })
  window.addEventListener('pointerdown', onDown)
  window.addEventListener('pointerup', onUp)
  raf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  running = false
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', resize)
  window.removeEventListener('pointermove', onMove)
  window.removeEventListener('pointerdown', onDown)
  window.removeEventListener('pointerup', onUp)
})
</script>

<style scoped>
.fluid-webgl {
  position: fixed;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  mix-blend-mode: screen;
  opacity: 0.28;
}
</style>
