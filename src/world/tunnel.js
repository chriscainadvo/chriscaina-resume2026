import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { TOOLS, makeLogoTexture } from '../logos.js'

const GOLDEN = Math.PI * (3 - Math.sqrt(5)) // even angular spread
const WHITE = new THREE.Color('#ffffff')

/* Pale tool-tile field the camera flies through.
   Tiles are spread WIDE with lots of space, drift gently, and fly PAST the
   viewer (full opacity until they pass) — no dizzy swirl, no transmission lag.
   Tiles recycle from back to front → endless, smooth. */

const COUNT = 58
const DEPTH = 82 // tighter band → always-populated view, no empty stretches
const SPREAD = 6.0 // how wide tiles spread off the flight axis
const SPIN = 0.06 // gentle spiral / kaleidoscope rotation of the whole field
const TRAVEL = DEPTH * 2.6 // camera travel across the whole scroll

// deterministic pseudo-random so layout is stable across reloads
function rand(i, salt) {
  const x = Math.sin(i * 127.1 + salt * 311.7) * 43758.5453
  return x - Math.floor(x)
}

export class Tunnel {
  constructor(parent, { particleScale = 1 } = {}) {
    this.parent = parent
    this.group = new THREE.Group()
    this.tiles = []
    this.count = Math.round(COUNT * (particleScale < 1 ? 0.6 : 1))
    this._camZ = 0
  }

  init() {
    const geo = new RoundedBoxGeometry(1.8, 1.8, 0.42, 6, 0.28) // thicker → visible edges

    for (let i = 0; i < this.count; i++) {
      const tool = TOOLS[i % TOOLS.length]

      // tile tinted with the tool's brand color, paled to match the vibe
      // matte plastic / microchip tile (no glass, not bright)
      const mat = new THREE.MeshStandardMaterial({
        color: 0x8a99ad,
        roughness: 0.78,
        metalness: 0.05,
        transparent: true,
        opacity: 1,
        envMapIntensity: 0.14,
      })
      const tile = new THREE.Mesh(geo, mat)

      // logo = its original brand color, paled toward white
      const brand = new THREE.Color(tool.hex)
      const logoColor = '#' + brand.clone().lerp(WHITE, 0.45).getHexString()

      const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(1.12, 1.12), // a bit smaller
        new THREE.MeshBasicMaterial({
          map: makeLogoTexture(tool, logoColor),
          transparent: true,
          opacity: 1,
          depthWrite: false,
        })
      )
      logo.position.z = 0.22
      tile.add(logo)

      // even "sunflower" placement → balanced coverage (no left-blank/right-heavy)
      const angle = i * GOLDEN
      const radius = 1.5 + Math.sqrt((i + 0.5) / this.count) * SPREAD
      tile.userData = {
        baseAngle: angle,
        radius,
        worldZ: -((i + 0.5) / this.count) * DEPTH, // evenly spaced in depth
        logo,
        bob: rand(i, 3) * Math.PI * 2,
        bobAmp: 0.1 + rand(i, 4) * 0.18,
        scale: 0.85 + rand(i, 5) * 0.7,
        tiltX: 0.18 + rand(i, 6) * 0.18, // tilt to reveal the tile's edges
        tiltY: (rand(i, 7) - 0.5) * 0.7,
      }
      tile.scale.setScalar(tile.userData.scale)
      this.tiles.push(tile)
      this.group.add(tile)
    }

    this.ambient = new THREE.AmbientLight(0xffffff, 0.5)
    this.key = new THREE.DirectionalLight(0xffffff, 0.95)
    this.key.position.set(-5, 6, 8)
    this.fill = new THREE.DirectionalLight(0xcadcff, 0.3)
    this.fill.position.set(6, -2, 4)
    this.group.add(this.ambient, this.key, this.fill)

    this.parent.add(this.group)
  }

  // smooth forward dolly (lerp kills scroll stutter)
  updateCamera(progress, camera, elapsed) {
    const target = -progress * TRAVEL
    this._camZ += (target - this._camZ) * 0.12
    camera.position.x = Math.sin(elapsed * 0.08) * 0.1
    camera.position.y = Math.cos(elapsed * 0.06) * 0.08
    camera.position.z = this._camZ
    camera.lookAt(camera.position.x, camera.position.y, this._camZ - 10)
  }

  update(progress, ctx) {
    const { elapsed, camera } = ctx

    // fade the whole tunnel out once we leave Beat A
    const tFade = 1 - THREE.MathUtils.smoothstep(progress, 0.26, 0.33)
    this.group.visible = tFade > 0.001
    if (!this.group.visible) return

    const camZ = camera.position.z
    const spin = elapsed * SPIN

    this.tiles.forEach((t) => {
      const u = t.userData

      // recycle along z (both directions), hidden by the far fade
      if (u.worldZ > camZ + 4) u.worldZ -= DEPTH * Math.ceil((u.worldZ - (camZ + 4)) / DEPTH)
      else if (u.worldZ < camZ - DEPTH - 4) u.worldZ += DEPTH
      const z = u.worldZ

      const a = u.baseAngle + spin
      t.position.set(
        Math.cos(a) * u.radius,
        Math.sin(a) * u.radius + Math.sin(elapsed * 0.5 + u.bob) * u.bobAmp,
        z
      )
      t.lookAt(camera.position.x, camera.position.y, camera.position.z) // face the viewer
      t.rotateX(u.tiltX) // then tilt so the edges/depth read
      t.rotateY(u.tiltY)

      // fly-past fade: stay FULL until ~1u from passing, gentle fade-in from far
      const dz = z - camZ // negative = ahead
      let op = 0
      if (dz <= 0) {
        const dist = -dz
        const near = THREE.MathUtils.smoothstep(dist, 0.0, 1.1) // pass-through
        const far = 1 - THREE.MathUtils.smoothstep(dist, DEPTH - 42, DEPTH - 8)
        op = near * far
      }
      t.material.opacity = op * tFade
      u.logo.material.opacity = op * 0.95 * tFade
    })
  }
}
