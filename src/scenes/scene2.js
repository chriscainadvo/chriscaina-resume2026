import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/* Chrome human head with a glowing golden particle brain.
   "Real intelligence isn't trained. It's felt." */

const HEAD_Z = -42 // sits deep along the forward-dolly corridor

function circleSprite() {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.3, 'rgba(255,220,150,0.9)')
  g.addColorStop(1, 'rgba(255,180,60,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  const t = new THREE.CanvasTexture(c)
  return t
}

export class Scene2Head {
  constructor(parent, opts = {}) {
    this.parent = parent
    this.particleScale = opts.particleScale ?? 1
    this.group = new THREE.Group()
    this.group.position.set(0, 0, HEAD_Z)
    this.group.visible = false
    this.loaded = false
    this.headMat = null
    this.brain = null
  }

  init() {
    // ---- chrome material ----
    this.headMat = new THREE.MeshStandardMaterial({
      color: 0x9aa0a8,
      metalness: 1.0,
      roughness: 0.14,
      envMapIntensity: 1.5,
      transparent: true,
      opacity: 0,
    })

    new GLTFLoader().load(
      '/models/head.glb',
      (gltf) => {
        const root = gltf.scene
        let mesh = null
        root.traverse((o) => {
          if (o.isMesh) mesh = o
        })
        if (!mesh) return
        mesh.material = this.headMat

        // normalize size + center
        const box = new THREE.Box3().setFromObject(mesh)
        const size = new THREE.Vector3()
        const center = new THREE.Vector3()
        box.getSize(size)
        box.getCenter(center)
        const target = 5.4
        const scale = target / size.y
        mesh.position.sub(center) // center at origin
        const holder = new THREE.Group()
        holder.add(mesh)
        holder.scale.setScalar(scale)
        holder.position.y = -0.4
        this.head = holder
        this.group.add(holder)

        this._buildBrain(size.y * scale)
        this.loaded = true
      },
      undefined,
      (err) => console.warn('head model failed to load', err)
    )

    // ---- cinematic lights (warm rim left, cool rim right) ----
    this.warm = new THREE.PointLight(0xff8a3d, 0, 30)
    this.warm.position.set(-6, 4, 6)
    this.cool = new THREE.PointLight(0x3b73e8, 0, 30)
    this.cool.position.set(7, -2, 5)
    this.top = new THREE.DirectionalLight(0xfff0e0, 0)
    this.top.position.set(0, 8, 4)
    this.group.add(this.warm, this.cool, this.top)

    this.parent.add(this.group)
  }

  _buildBrain(headHeight) {
    const count = Math.floor(900 * this.particleScale)
    const positions = new Float32Array(count * 3)
    const crownY = headHeight * 0.16 // hug the top of the skull
    for (let i = 0; i < count; i++) {
      // points clustered over the upper skull as a glowing cap
      const theta = Math.acos(THREE.MathUtils.lerp(0.45, 1, Math.random())) // bias hard to top
      const phi = Math.random() * Math.PI * 2
      const r = 1.35 * (0.65 + Math.random() * 0.4)
      positions[i * 3] = Math.sin(theta) * Math.cos(phi) * r
      positions[i * 3 + 1] = crownY + Math.cos(theta) * r * 1.05
      positions[i * 3 + 2] = Math.sin(theta) * Math.sin(phi) * r * 0.9
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    this.brainMat = new THREE.PointsMaterial({
      size: 0.13,
      map: circleSprite(),
      color: 0xffc34d,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    this.brain = new THREE.Points(geo, this.brainMat)
    this.head.add(this.brain)
  }

  updateCamera(local, camera, elapsed) {
    const e = THREE.MathUtils.smoothstep(local, 0, 1)
    camera.position.x = Math.sin(elapsed * 0.18) * 0.3
    camera.position.y = Math.cos(elapsed * 0.14) * 0.2
    camera.position.z = THREE.MathUtils.lerp(-30, -36, e)
    camera.lookAt(0, 0.4, HEAD_Z)
  }

  update(local, ctx) {
    const { elapsed } = ctx
    this.group.visible = ctx.active || (local > 0 && local < 1)
    if (!this.loaded) return

    // fade in 0->0.18, hold, fade out 0.85->1
    const fadeIn = THREE.MathUtils.smoothstep(local, 0.0, 0.18)
    const fadeOut = 1 - THREE.MathUtils.smoothstep(local, 0.85, 1.0)
    const vis = fadeIn * fadeOut

    this.headMat.opacity = vis
    this.brainMat.opacity = vis * (0.65 + Math.sin(elapsed * 2.2) * 0.25)
    this.warm.intensity = vis * 3.4
    this.cool.intensity = vis * 2.4
    this.top.intensity = vis * 1.2

    // slow rotation + brain shimmer
    if (this.head) this.head.rotation.y = Math.sin(elapsed * 0.15) * 0.35
    if (this.brain) {
      this.brain.rotation.y += 0.0025
      this.brainMat.size = 0.12 + Math.sin(elapsed * 1.6) * 0.02
    }
  }
}
