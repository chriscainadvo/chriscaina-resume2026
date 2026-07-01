import * as THREE from 'three'

/* Very pale, soft, slowly-drifting colour blobs sitting far behind the tiles.
   Non-distracting ambient background that follows the camera. */

function blobTexture(color) {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, color)
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const t = new THREE.CanvasTexture(c)
  t.colorSpace = THREE.SRGBColorSpace
  return t
}

const BLOBS = [
  { color: 'rgba(150,180,255,0.55)', x: -10, y: 5, size: 46, sx: 0.05, sy: 0.04 },
  { color: 'rgba(255,200,170,0.5)', x: 11, y: -6, size: 40, sx: 0.04, sy: 0.06 },
  { color: 'rgba(200,180,255,0.45)', x: 2, y: 9, size: 52, sx: 0.06, sy: 0.03 },
]

function sparkTexture() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,240,210,1)')
  g.addColorStop(0.4, 'rgba(255,200,130,0.6)')
  g.addColorStop(1, 'rgba(255,180,110,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

export class Backdrop {
  constructor(parent) {
    this.parent = parent
    this.group = new THREE.Group()
    this.blobs = []
  }

  init() {
    // ambient drifting sparks — only read on the dark beats (additive), so the
    // black is never plain. Spread in a wide box that follows the camera.
    const N = 220
    const pos = new Float32Array(N * 3)
    for (let i = 0; i < N; i++) {
      pos[i * 3] = (Math.sin(i * 12.9) * 0.5 + 0.5 - 0.5) * 60
      pos[i * 3 + 1] = (Math.sin(i * 78.2) * 0.5 + 0.5 - 0.5) * 40
      pos[i * 3 + 2] = (Math.sin(i * 37.7) * 0.5 + 0.5 - 0.5) * 50
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    this.sparksMat = new THREE.PointsMaterial({
      size: 0.4,
      map: sparkTexture(),
      color: 0xffd9a0,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.sparks = new THREE.Points(g, this.sparksMat)
    this.group.add(this.sparks)

    BLOBS.forEach((b) => {
      const mat = new THREE.MeshBasicMaterial({
        map: blobTexture(b.color),
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
        depthTest: false,
        blending: THREE.NormalBlending,
      })
      const mesh = new THREE.Mesh(new THREE.PlaneGeometry(b.size, b.size), mat)
      mesh.position.set(b.x, b.y, 0)
      mesh.renderOrder = -10
      mesh.userData = { ...b }
      this.blobs.push(mesh)
      this.group.add(mesh)
    })
    this.parent.add(this.group)
  }

  update(camera, elapsed) {
    // always sit far behind the camera's current position
    this.group.position.set(camera.position.x, camera.position.y, camera.position.z - 60)
    if (this.sparks) {
      this.sparksMat.opacity = 0.4 + Math.sin(elapsed * 0.8) * 0.15 // twinkle
      this.sparks.rotation.y = elapsed * 0.02
    }
    this.blobs.forEach((m) => {
      const u = m.userData
      m.position.x = u.x + Math.sin(elapsed * u.sx) * 4
      m.position.y = u.y + Math.cos(elapsed * u.sy) * 3
    })
  }
}
