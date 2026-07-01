import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

/* Glowing WIREFRAME-mesh head (translucent), brain glowing inside.
   Reads on the dark background of the mind beat; dissolves as the brain
   bursts into the galaxy. Lives at HEAD_Z on the forward corridor. */

export const HEAD_Z = -110


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
    // clean topology lines (EdgesGeometry @ 15° avoids triangle-fill circles on eyes/mouth)
    this.wireMat = new THREE.LineBasicMaterial({
      color: 0x1a2535,
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
        const wire = new THREE.LineSegments(new THREE.EdgesGeometry(geo, 15), this.wireMat)
        const nodes = new THREE.Points(geo, this.nodesMat) // glowing network nodes at vertices
        holder.add(surf, wire, nodes)

        const scale = 6.4 / size.y
        holder.scale.setScalar(scale)
        holder.position.y = -3.0 // bottom-grounded — head visible, neck fades at edge
        this.holder = holder
        this.group.add(holder)
        this.loaded = true
      },
      undefined,
      (e) => console.warn('head load failed', e)
    )

    this.parent.add(this.group)
  }

  update(progress, ctx) {
    const fadeIn = THREE.MathUtils.smoothstep(progress, 0.3, 0.42)
    const fadeOut = 1 - THREE.MathUtils.smoothstep(progress, 0.64, 0.72)
    const vis = fadeIn * fadeOut
    this.group.visible = vis > 0.001
    if (!this.loaded || !this.group.visible) return

    const { elapsed } = ctx
    this.surfMat.opacity = vis * 0.72
    this.wireMat.opacity = vis * 0.52
    this.nodesMat.opacity = 0

    // Cinematic slow yaw + subtle nod
    this.holder.rotation.y = Math.sin(elapsed * 0.28) * 0.38
    this.holder.rotation.x = Math.cos(elapsed * 0.18) * 0.06

    // Breathing scale layered on top of the fade-in scale
    const breathe = 1 + Math.sin(elapsed * 0.72) * 0.018
    this.group.scale.setScalar(THREE.MathUtils.lerp(0.82, 1, fadeOut) * breathe)
  }
}
