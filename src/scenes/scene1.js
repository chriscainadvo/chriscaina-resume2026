import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

/* Frosted-glass app-icon tiles floating on cream.
   The camera dollies FORWARD through the field — tiles grow and whoosh
   past the viewer, then the scene clears into the next chapter. */

const CARDS = [
  'C', 'G', '✳', '◆', 'N', 'Z', '▲', '●', '∞', 'A', 'S', 'π', 'R', '◈',
]

// scattered field: spread across x/y and deep in z so the dolly flies through
const LAYOUT = [
  [-3.2, 1.8, 1.5], [2.6, 2.2, -1], [0.3, -2.4, 0.4], [-2.4, -1.6, -3.5],
  [3.4, -0.6, -2.2], [-1.0, 2.6, -5.5], [1.8, -2.8, -6.5], [-3.6, 0.2, -8],
  [2.9, 1.4, -9.5], [-1.6, -2.0, -12], [1.2, 2.4, -14], [-2.8, 1.0, -17],
  [2.2, -1.4, -20], [0.0, 0.6, -24],
]

function makeGlyphTexture(symbol) {
  const size = 512
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d')
  ctx.clearRect(0, 0, size, size)
  ctx.fillStyle = '#ffffff'
  ctx.font = '700 250px Syne, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.shadowColor = 'rgba(255,255,255,0.5)'
  ctx.shadowBlur = 18
  ctx.fillText(symbol, size / 2, size / 2 + 8)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

export class Scene1Tools {
  constructor(parent) {
    this.parent = parent
    this.group = new THREE.Group()
    this.tiles = []
  }

  init() {
    const geo = new RoundedBoxGeometry(2.2, 2.2, 0.32, 6, 0.34)

    CARDS.forEach((sym, i) => {
      const [x, y, z] = LAYOUT[i] || [0, 0, -i * 2]

      // frosted glass tile — muted blue-grey, translucent, soft reflections
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0xb9c6d8,
        metalness: 0.0,
        roughness: 0.28,
        transmission: 0.82,
        thickness: 0.8,
        ior: 1.35,
        clearcoat: 0.6,
        clearcoatRoughness: 0.3,
        transparent: true,
        opacity: 1,
        envMapIntensity: 1.1,
      })
      const tile = new THREE.Mesh(geo, glassMat)
      tile.position.set(x, y, z)
      tile.rotation.set((Math.random() - 0.5) * 0.4, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.2)

      // white logo glyph just in front of the tile face
      const glyphMat = new THREE.MeshBasicMaterial({
        map: makeGlyphTexture(sym),
        transparent: true,
        opacity: 0.95,
        depthWrite: false,
      })
      const glyph = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.5), glyphMat)
      glyph.position.z = 0.2
      tile.add(glyph)

      tile.userData = {
        baseY: y,
        baseZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.4,
        amp: 0.12 + Math.random() * 0.18,
        spin: (Math.random() - 0.5) * 0.2,
        glyph,
      }
      this.tiles.push(tile)
      this.group.add(tile)
    })

    // soft fills (env map does most of the lighting work)
    this.key = new THREE.DirectionalLight(0xffffff, 1.1)
    this.key.position.set(-4, 6, 8)
    this.fill = new THREE.DirectionalLight(0xbcd0ff, 0.6)
    this.fill.position.set(6, -2, 4)
    this.ambient = new THREE.AmbientLight(0xffffff, 0.6)
    this.group.add(this.key, this.fill, this.ambient)

    this.parent.add(this.group)
  }

  // camera flies forward through the tile field
  updateCamera(local, camera, elapsed) {
    const z = THREE.MathUtils.lerp(11, -30, local)
    camera.position.x = Math.sin(elapsed * 0.2) * 0.25
    camera.position.y = Math.cos(elapsed * 0.16) * 0.18
    camera.position.z = z
    camera.lookAt(camera.position.x, camera.position.y, z - 10)
  }

  update(local, ctx) {
    const { elapsed, camera } = ctx
    this.group.visible = ctx.active || local < 0.999

    this.tiles.forEach((t) => {
      const u = t.userData
      t.position.y = u.baseY + Math.sin(elapsed * u.speed + u.phase) * u.amp
      t.rotation.y += u.spin * 0.004
      t.rotation.z = Math.sin(elapsed * 0.25 + u.phase) * 0.05

      // distance-based fade: appear from depth, whoosh + fade as camera passes
      const camZ = camera.position.z
      const dz = t.position.z - camZ // negative once behind camera
      let op = 1
      if (dz > 0) op = 0 // behind camera → invisible
      else {
        const dist = -dz
        const near = THREE.MathUtils.smoothstep(dist, 0.5, 3.5) // fade out as it passes
        const far = 1 - THREE.MathUtils.smoothstep(dist, 26, 34) // fade in from far
        op = near * far
      }
      t.material.opacity = op
      u.glyph.material.opacity = op * 0.95
    })

    // whole scene fades out at the very end of its range
    const exit = 1 - THREE.MathUtils.smoothstep(local, 0.9, 1.0)
    this.group.traverse((o) => {
      if (o.isMesh && exit < 1) o.material.opacity = Math.min(o.material.opacity, exit)
    })
  }
}
