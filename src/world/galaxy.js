import * as THREE from 'three'
import { HEAD_Z } from './head.js'

/* The "mind" particle system — one Points cloud that morphs through states:
   BRAIN (forehead cluster) → DISSOLVE (soften, drift) →
   NEURAL BRAIN (glowing gold brain cloud) → fade, handing off to the
   Jarvis spearhead video beat in the HTML layer. */

const CENTER = new THREE.Vector3(0, -0.4, HEAD_Z + 1.5)

function sprite() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,240,215,0.9)')
  g.addColorStop(0.35, 'rgba(255,210,150,0.6)')
  g.addColorStop(1, 'rgba(255,180,100,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

function rand(i, s) {
  const x = Math.sin(i * 97.13 + s * 41.7) * 43758.5453
  return x - Math.floor(x)
}

export class Galaxy {
  constructor(parent, { particleScale = 1 } = {}) {
    this.parent = parent
    this.count = Math.floor(1900 * particleScale)
    this.group = new THREE.Group()
    this.group.position.copy(CENTER)
    this.group.visible = false
  }

  init() {
    const n = this.count
    this.brain = new Float32Array(n * 3)
    this.rain = new Float32Array(n * 3)
    this.neural = new Float32Array(n * 3)
    const colors = new Float32Array(n * 3)
    const pos = new Float32Array(n * 3)

    const gold = new THREE.Color(0xffb24d)
    const amber = new THREE.Color(0xff8a2a)
    const blue = new THREE.Color(0x6d92ff)

    for (let i = 0; i < n; i++) {
      const j = i * 3
      // BRAIN: small two-lobe brain SHELL inside the skull (airy → negative space)
      const bth = Math.acos(2 * rand(i, 1) - 1)
      const bph = rand(i, 2) * Math.PI * 2
      const bshell = 0.82 + 0.18 * rand(i, 3) // thin shell, not a solid blob
      let bx = Math.sin(bth) * Math.cos(bph) * 1.45 * bshell
      const by = Math.cos(bth) * 0.95 * bshell
      const bz = Math.sin(bth) * Math.sin(bph) * 1.15 * bshell
      bx += Math.sign(Math.cos(bph)) * 0.25 // two lobes
      this.brain[j] = bx
      this.brain[j + 1] = by
      this.brain[j + 2] = bz

      // DISSOLVE: gentle outward drift — soft scatter, not an explosion
      const dth = Math.acos(2 * rand(i, 4) - 1)
      const dph = rand(i, 5) * Math.PI * 2
      const rad = 2.2 + rand(i, 6) * 3.2
      this.rain[j] = Math.sin(dth) * Math.cos(dph) * rad
      this.rain[j + 1] = Math.cos(dth) * rad * 0.7 - rand(i, 7) * 1.2
      this.rain[j + 2] = Math.sin(dth) * Math.sin(dph) * rad

      // NEURAL BRAIN: two-lobe ellipsoid shell cloud
      const th = Math.acos(2 * rand(i, 7) - 1)
      const ph = rand(i, 8) * Math.PI * 2
      const rr = 0.55 + 0.45 * rand(i, 9)
      let nx = Math.sin(th) * Math.cos(ph) * 2.7 * rr
      const ny = Math.cos(th) * 1.7 * rr
      const nz = Math.sin(th) * Math.sin(ph) * 1.95 * rr
      nx += Math.sign(Math.cos(ph)) * 0.35 // hint of two lobes
      this.neural[j] = nx
      this.neural[j + 1] = ny - 0.2
      this.neural[j + 2] = nz

      // colour — gold/amber dominant, a few cool sparks
      const pick = rand(i, 10)
      const col = pick < 0.55 ? gold : pick < 0.8 ? amber : blue
      const b = 0.65 + rand(i, 11) * 0.5
      colors[j] = col.r * b
      colors[j + 1] = col.g * b
      colors[j + 2] = col.b * b

      pos[j] = this.brain[j]
      pos[j + 1] = this.brain[j + 1]
      pos[j + 2] = this.brain[j + 2]
    }

    const geo = new THREE.BufferGeometry()
    this.posAttr = new THREE.BufferAttribute(pos, 3)
    geo.setAttribute('position', this.posAttr)
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    this.mat = new THREE.PointsMaterial({
      size: 0.1,
      map: sprite(),
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false, // brain glows over the solid head surface
    })
    this.points = new THREE.Points(geo, this.mat)
    this.group.add(this.points)

    // neural connection web (uses the static NEURAL positions, fades in late)
    this._buildConnections()
    this.parent.add(this.group)
  }

  _buildConnections() {
    const n = this.count
    const verts = []
    const cols = []
    const maxPerPoint = 2
    const thresh = 0.85
    const gold = [1.0, 0.72, 0.32]
    // connect each point to a couple of near neighbours within a local index window
    for (let i = 0; i < n; i += 2) {
      let made = 0
      for (let k = 1; k <= 40 && made < maxPerPoint; k++) {
        const j = (i + k * 7) % n
        const dx = this.neural[i * 3] - this.neural[j * 3]
        const dy = this.neural[i * 3 + 1] - this.neural[j * 3 + 1]
        const dz = this.neural[i * 3 + 2] - this.neural[j * 3 + 2]
        if (dx * dx + dy * dy + dz * dz < thresh * thresh) {
          verts.push(this.neural[i * 3], this.neural[i * 3 + 1], this.neural[i * 3 + 2])
          verts.push(this.neural[j * 3], this.neural[j * 3 + 1], this.neural[j * 3 + 2])
          cols.push(...gold, ...gold)
          made++
        }
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
    this.linesMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.lines = new THREE.LineSegments(g, this.linesMat)
    this.group.add(this.lines)
  }

  update(progress, ctx) {
    const fadeIn = THREE.MathUtils.smoothstep(progress, 0.42, 0.50)
    this.group.visible = fadeIn > 0.001
    if (!this.group.visible) return

    // Compressed timeline: brain forms, dissolves gently, reforms as a neural
    // cloud, then the whole system fades — handing off to the Jarvis spearhead
    // video beat in the HTML layer (no explosion, no sunburst).
    const dissolve = THREE.MathUtils.smoothstep(progress, 0.55, 0.64) // brain → soft scatter
    const reform = THREE.MathUtils.smoothstep(progress, 0.64, 0.74)   // scatter → neural brain
    const eDissolve = 1 - Math.pow(1 - dissolve, 3)
    const eReform = reform * reform * (3 - 2 * reform)

    const arr = this.posAttr.array
    for (let i = 0; i < this.count; i++) {
      const j = i * 3
      let x = THREE.MathUtils.lerp(this.brain[j], this.rain[j], eDissolve)
      let y = THREE.MathUtils.lerp(this.brain[j + 1], this.rain[j + 1], eDissolve)
      let z = THREE.MathUtils.lerp(this.brain[j + 2], this.rain[j + 2], eDissolve)
      arr[j] = THREE.MathUtils.lerp(x, this.neural[j], eReform)
      arr[j + 1] = THREE.MathUtils.lerp(y, this.neural[j + 1], eReform)
      arr[j + 2] = THREE.MathUtils.lerp(z, this.neural[j + 2], eReform)
    }
    this.posAttr.needsUpdate = true

    // fades out cleanly by 0.80 — handing off to the Jarvis spearhead video beat
    const endFade = 1 - THREE.MathUtils.smoothstep(progress, 0.74, 0.80)
    this.mat.opacity = fadeIn * 0.65 * endFade
    this.mat.size = 0.08 + dissolve * 0.02
    // neural connections fade in with the reform, out with the rest
    this.linesMat.opacity =
      THREE.MathUtils.smoothstep(progress, 0.66, 0.71) * endFade * 0.5
    // gentle rotation only during neural-brain phase
    this.group.rotation.y = reform * Math.sin(ctx.elapsed * 0.2) * 0.3
  }
}
