// This module has side effects (renderer + rAF loop). Hot-patching it would
// stack duplicate instances on one canvas → fully reload instead.
if (import.meta.hot) import.meta.hot.accept(() => window.location.reload())

import { initGateway } from './gateway.js'
initGateway() // covers screen immediately; Three.js initialises behind it

import Lenis from 'lenis'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'
import { gsap } from 'gsap'

import { Tunnel } from './world/tunnel.js'
import { Backdrop } from './world/backdrop.js'
import { Head, HEAD_Z } from './world/head.js'
import { Galaxy } from './world/galaxy.js'
import { buildContent } from './content.js'

/* ============================================================
   Continuous cinematic journey — v2 (Beat A: kaleidoscope tunnel)
   ============================================================ */
const IS_MOBILE = window.matchMedia('(max-width: 860px)').matches
const PARTICLE_SCALE = IS_MOBILE ? 0.4 : 1
const BLOOM_ENABLED = !IS_MOBILE

const canvas = document.getElementById('webgl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05

const scene = new THREE.Scene()
scene.background = new THREE.Color('#f5f1e8') // cream; soft backdrop sits in-scene

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 200)
camera.position.set(0, 0, 0)

const pmrem = new THREE.PMREMGenerator(renderer)
pmrem.compileEquirectangularShader()
new RGBELoader().load('/hdr/studio.hdr', (hdr) => {
  hdr.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = pmrem.fromEquirectangular(hdr).texture
  hdr.dispose()
})

/* ---------- Post-processing ---------- */
const composer = new EffectComposer(renderer)
composer.addPass(new RenderPass(scene, camera))
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.16,
  0.5,
  0.95
)
if (BLOOM_ENABLED) composer.addPass(bloomPass)

/* ---------- World (beats) ---------- */
const backdrop = new Backdrop(scene)
backdrop.init()
const tunnel = new Tunnel(scene, { particleScale: PARTICLE_SCALE })
tunnel.init()
const head = new Head(scene)
head.init()
const galaxy = new Galaxy(scene, { particleScale: PARTICLE_SCALE })
galaxy.init()

/* ============================================================
   Scroll → progress (0..1 through the sticky stage)
   ============================================================ */
/* ---------- Lenis smooth scroll ---------- */
const lenis = new Lenis({
  duration: 1.45,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-out — heavy, premium feel
  smoothWheel: true,
  wheelMultiplier: 0.82,
  touchMultiplier: 1.4,
  infinite: false,
})

/* ---------- Full-page progress bar (thin line, top of viewport) ---------- */
const pageProgressEl = document.createElement('div')
pageProgressEl.className = 'page-progress'
document.body.prepend(pageProgressEl)

const stageScroll = document.querySelector('.stage-scroll')
const progressFill = document.getElementById('progressFill')
const progressNum = document.getElementById('progressNum')
const storyCaption = document.getElementById('storyCaption')
const headFade = document.getElementById('headFade')
const nameReveal = document.getElementById('nameReveal')
const buildReveal1 = document.getElementById('buildReveal1')
const buildReveal2 = document.getElementById('buildReveal2')
const topnavEl = document.getElementById('nav')

// Caption beats keyed by progress
const CAPTIONS = [
  { at: 0.0,  text: "Everyone works with the same AI tools." },
  { at: 0.15, text: "The same logos. The same dashboards." },
  { at: 0.34, text: "But tools don’t think. They don’t feel the weight of a decision." },
  { at: 0.56, text: "Real intelligence isn’t trained. It’s felt." },
  { at: 0.68, text: "It’s the spark before the decision." },
  { at: 0.76, text: "One idea — caught, shaped, built." },
]
let currentCaption = -1

let scrollProgress = 0

function updateScroll() {
  const rect = stageScroll.getBoundingClientRect()
  const total = stageScroll.offsetHeight - window.innerHeight
  const scrolled = Math.min(Math.max(-rect.top, 0), total)
  scrollProgress = total > 0 ? scrolled / total : 0

  // Stage beat progress (the 07 WebGL chapters)
  progressFill.style.width = (scrollProgress * 100).toFixed(1) + '%'

  // Full-page thin progress bar — tracks entire page scroll
  const pageTotal = document.documentElement.scrollHeight - window.innerHeight
  const fullProgress = pageTotal > 0 ? Math.min(window.scrollY / pageTotal, 1) : 0
  pageProgressEl.style.transform = `scaleX(${fullProgress})`
  progressNum.textContent =
    scrollProgress < 0.3  ? 'THE TOOLS'    :
    scrollProgress < 0.6  ? 'THE MIND'     :
    scrollProgress < 0.79 ? 'THE SPARK'    :
    scrollProgress < 0.89 ? 'THE BUILD'    :
    scrollProgress < 0.97 ? 'THE SYSTEM'   : 'THE OPERATOR'

  // dark caption with a light halo — legible across the warm/cream palette
  const line = storyCaption.querySelector('.story-line')
  if (line) {
    line.style.color = 'rgba(11,28,48,0.92)'
    line.style.textShadow = '0 2px 22px rgba(245,241,232,0.95), 0 0 10px rgba(245,241,232,0.9)'
  }

  // nav: light over cinematic, dark over cream content, light again over dark contact
  const stageScrollable = stageScroll.offsetHeight - window.innerHeight
  const pastStage = window.scrollY > stageScrollable + 60
  const contactEl = document.getElementById('contact')
  const overContact = contactEl ? contactEl.getBoundingClientRect().top < window.innerHeight * 0.5 : false
  topnavEl.classList.toggle('dark', pastStage && !overContact)

  // Build Beat 01 — Video Clipping Agent (p=0.82–0.92)
  const br1 = THREE.MathUtils.smoothstep(scrollProgress, 0.82, 0.87) *
              (1 - THREE.MathUtils.smoothstep(scrollProgress, 0.90, 0.93))
  buildReveal1.style.opacity = String(br1)

  // Build Beat 02 — Jarvis (p=0.90–0.98)
  const br2 = THREE.MathUtils.smoothstep(scrollProgress, 0.90, 0.94) *
              (1 - THREE.MathUtils.smoothstep(scrollProgress, 0.96, 0.99))
  buildReveal2.style.opacity = String(br2)

  // Name reveal — payoff at the very end (p=0.97–1.0)
  const nr = THREE.MathUtils.smoothstep(scrollProgress, 0.97, 1.0)
  nameReveal.style.opacity = String(nr)
  nameReveal.classList.toggle('live', nr > 0.5)

  // Caption clear — fade out before the build beats arrive
  if (scrollProgress > 0.79) {
    gsap.killTweensOf(storyCaption)
    storyCaption.style.opacity = String(1 - THREE.MathUtils.smoothstep(scrollProgress, 0.79, 0.84))
  }

  // caption swap
  let idx = 0
  for (let i = 0; i < CAPTIONS.length; i++) if (scrollProgress >= CAPTIONS[i].at) idx = i
  if (idx !== currentCaption) {
    currentCaption = idx
    swapCaption(CAPTIONS[idx].text)
  }
}

function swapCaption(text) {
  gsap.to(storyCaption, {
    opacity: 0,
    y: 10,
    duration: 0.25,
    onComplete: () => {
      storyCaption.querySelector('.story-line').textContent = text
      gsap.to(storyCaption, { opacity: 1, y: 0, duration: 0.45 })
    },
  })
}

// Lenis fires scroll events as it interpolates — replaces raw scroll listener
lenis.on('scroll', updateScroll)

/* ============================================================
   Custom cursor
   ============================================================ */
const dot = document.getElementById('cursorDot')
const ring = document.getElementById('cursorRing')
let mx = innerWidth / 2,
  my = innerHeight / 2,
  rx = mx,
  ry = my
if (!IS_MOBILE) {
  addEventListener('mousemove', (e) => {
    mx = e.clientX
    my = e.clientY
    dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`
  })
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a,button,input,select,textarea')) ring.classList.add('hover')
  })
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('a,button,input,select,textarea')) ring.classList.remove('hover')
  })
}

/* ============================================================
   Camera rig — one continuous forward path across all beats
   ============================================================ */
const CAMZ = [
  [0.0,  0],
  [0.3,  -94],
  [0.5,  -103],
  [0.62, -105.5],
  [0.68, -107.2], // push into forehead on burst (matches compressed galaxy)
  [0.83, -103],   // begin pulling back as galaxy ends
  [0.88, -96],    // settle to neutral — canvas clear for build reveals
  [1.0,  -92],    // comfortable reading distance for name reveal
]
const _look = new THREE.Vector3()
const _mind = new THREE.Vector3()

function keyframe(arr, p) {
  for (let i = 0; i < arr.length - 1; i++) {
    const [a, va] = arr[i]
    const [b, vb] = arr[i + 1]
    if (p <= b) return THREE.MathUtils.lerp(va, vb, THREE.MathUtils.smoothstep(p, a, b))
  }
  return arr[arr.length - 1][1]
}

function updateCameraRig(p, elapsed) {
  const z = keyframe(CAMZ, p)
  camera.position.x = Math.sin(elapsed * 0.08) * 0.12
  camera.position.y = Math.cos(elapsed * 0.06) * 0.1
  camera.position.z = z
  // gaze rises up the body → neck → face → forehead/brain as we approach
  const headPan = THREE.MathUtils.smoothstep(p, 0.3, 0.6)
  const lookY = THREE.MathUtils.lerp(-1.2, -0.5, headPan) // settle on the face/forehead (no big pan)
  const lb = THREE.MathUtils.smoothstep(p, 0.28, 0.42)
  _mind.set(0, lookY, HEAD_Z)
  _look.set(camera.position.x, camera.position.y, z - 10).lerp(_mind, lb)
  camera.lookAt(_look)
}

function bloomTarget(p) {
  // gentler on the light palette (high bloom washes white on cream)
  if (p < 0.3)  return 0.16
  if (p < 0.6)  return 0.2
  if (p < 0.83) return THREE.MathUtils.lerp(0.2, 0.45, THREE.MathUtils.smoothstep(p, 0.6, 0.72))
  // settle back to soft glow for the build reveals + name payoff
  return THREE.MathUtils.lerp(0.42, 0.14, THREE.MathUtils.smoothstep(p, 0.83, 0.90))
}

// warm/light palette like the reel: cream → warm-peach (mind/galaxy) → cream
const BG_CREAM = new THREE.Color('#f5f1e8')
const BG_WARM = new THREE.Color('#f0d0b2') // warm peach (head)
const BG_AMBER = new THREE.Color('#e0a06a') // deeper amber (galaxy) so gold particles read

/* ============================================================
   Render loop
   ============================================================ */
const clock = new THREE.Clock()

function tick(time) {
  lenis.raf(time) // Lenis needs the RAF timestamp for smooth interpolation
  const elapsed = clock.getElapsedTime()
  const dt = clock.getDelta()

  rx += (mx - rx) * 0.18
  ry += (my - ry) * 0.18
  ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`

  updateCameraRig(scrollProgress, elapsed)
  // cream → warm peach (head) → deeper amber (galaxy/spark) → cream (builds + name)
  const p = scrollProgress
  if (p < 0.55) {
    scene.background.copy(BG_CREAM).lerp(BG_WARM, THREE.MathUtils.smoothstep(p, 0.28, 0.46))
  } else if (p < 0.68) {
    scene.background.copy(BG_WARM).lerp(BG_AMBER, THREE.MathUtils.smoothstep(p, 0.55, 0.65))
  } else {
    // return to cream by 0.88 so build reveals read cleanly on warm canvas
    scene.background.copy(BG_AMBER).lerp(BG_CREAM, THREE.MathUtils.smoothstep(p, 0.68, 0.88))
  }
  backdrop.update(camera, elapsed)

  // bottom-fade blends the head's lower edge into the background (no hard cut)
  const fadeOpacity =
    THREE.MathUtils.smoothstep(scrollProgress, 0.28, 0.38) *
    (1 - THREE.MathUtils.smoothstep(scrollProgress, 0.70, 0.82))
  if (fadeOpacity > 0.001) {
    const hex = '#' + scene.background.getHexString()
    headFade.style.background = `linear-gradient(to top, ${hex} 0%, ${hex} 28%, transparent 100%)`
    headFade.style.opacity = fadeOpacity
  } else {
    headFade.style.opacity = 0
  }
  const ctx = { elapsed, dt, camera }
  tunnel.update(scrollProgress, ctx)
  head.update(scrollProgress, ctx)
  galaxy.update(scrollProgress, ctx)

  if (BLOOM_ENABLED) {
    bloomPass.strength += (bloomTarget(scrollProgress) - bloomPass.strength) * 0.12
  }

  composer.render()
  requestAnimationFrame(tick)
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
  composer.setSize(innerWidth, innerHeight)
  bloomPass.resolution.set(innerWidth, innerHeight)
})

/* ---------- Boot ---------- */
buildContent()
updateScroll()
swapCaption(CAPTIONS[0].text)
requestAnimationFrame(tick) // pass timestamp so lenis.raf() gets the real time
