import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/* Glowing WIREFRAME-mesh head (translucent), brain glowing inside.
   Reads on the dark background of the mind beat; dissolves as the brain
   bursts into the galaxy. Lives at HEAD_Z on the forward corridor. */

export const HEAD_Z = -110

function glowTexture() {
  const s = 256
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(255,235,200,0.9)')
  g.addColorStop(0.4, 'rgba(255,180,110,0.5)')
  g.addColorStop(1, 'rgba(255,150,90,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

function dotTexture() {
  const s = 64
  const c = document.createElement('canvas')
  c.width = c.height = s
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2)
  g.addColorStop(0, 'rgba(220,240,255,1)')
  g.addColorStop(0.4, 'rgba(160,210,255,0.7)')
  g.addColorStop(1, 'rgba(120,180,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, s, s)
  return new THREE.CanvasTexture(c)
}

export class Head {
  constructor(parent) {
    this.parent = parent
    this.group = new THREE.Group()
    this.group.position.set(0, 0, HEAD_Z)
    this.group.visible = false
    this.loaded = false
  }

  init() {
    // smooth shaded light-grey head (studio-lit by the HDR env) like the topology ref
    this.surfMat = new THREE.MeshStandardMaterial({
      color: 0xccd2da,
      roughness: 0.85,
      metalness: 0.0,
      envMapIntensity: 1.1,
      transparent: true,
      opacity: 0,
    })
    // subtle topology lines over the surface
    this.wireMat = new THREE.LineBasicMaterial({
      color: 0x6b7686,
      transparent: true,
      opacity: 0,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })
    // nodes removed (kept as a no-op so update refs don't break)
    this.nodesMat = new THREE.PointsMaterial({ size: 0.001, transparent: true, opacity: 0, depthWrite: false })

    new GLTFLoader().load(
      '/models/head.glb', // dense head mesh → fine wireframe
      (gltf) => {
        let mesh = null
        gltf.scene.traverse((o) => {
          if (o.isMesh) mesh = o
        })
        if (!mesh) return
        const geo = mesh.geometry
        geo.center()
        geo.computeVertexNormals() // smooth shading
        geo.computeBoundingBox()
        const size = new THREE.Vector3()
        geo.boundingBox.getSize(size)
        console.log('[HEAD] size', size.x.toFixed(2), size.y.toFixed(2), size.z.toFixed(2))

        const holder = new THREE.Group()
        const surf = new THREE.Mesh(geo, this.surfMat)
        const wire = new THREE.LineSegments(new THREE.WireframeGeometry(geo), this.wireMat)
        const nodes = new THREE.Points(geo, this.nodesMat) // glowing network nodes at vertices
        holder.add(surf, wire, nodes)

        const scale = 6.4 / size.y
        holder.scale.setScalar(scale)
        holder.position.y = -6.5 // planted at bottom — only crown shows above lower edge
        this.holder = holder
        this.group.add(holder)
        this.loaded = true
      },
      undefined,
      (e) => console.warn('head load failed', e)
    )

    // warm halo behind the head (gentle; intensifies toward the burst)
    this.glow = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.MeshBasicMaterial({
        map: glowTexture(),
        color: 0xffb070,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        depthTest: false,
      })
    )
    this.glow.position.set(0, 1.5, -4)
    this.glow.renderOrder = -5
    this.group.add(this.glow)

    this.parent.add(this.group)
  }

  update(progress, ctx) {
    const fadeIn = THREE.MathUtils.smoothstep(progress, 0.3, 0.42)
    const fadeOut = 1 - THREE.MathUtils.smoothstep(progress, 0.64, 0.72)
    const vis = fadeIn * fadeOut
    // warm halo only around the burst (pure black before that)
    const glowVis = THREE.MathUtils.smoothstep(progress, 0.56, 0.66) * (1 - THREE.MathUtils.smoothstep(progress, 0.72, 0.86))
    this.glow.material.opacity = glowVis * 0.18
    this.group.visible = vis > 0.001 || glowVis > 0.001
    if (!this.loaded || !this.group.visible) return

    // smooth grey head, subtle topology overlay (clean, not creepy)
    this.surfMat.opacity = vis * 0.42
    this.wireMat.opacity = vis * 0.22
    this.nodesMat.opacity = 0
    this.group.scale.setScalar(THREE.MathUtils.lerp(0.82, 1, fadeOut))
    // no turning — the camera zooms toward the face instead
  }
}
