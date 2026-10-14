import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Floating "dataset" cubes for the "I Speak Data." section.
 * One InstancedMesh (a single draw call) of ~90 cubes that:
 *  - float and rotate gently
 *  - sway away from the cursor
 *  - spread apart slightly as the user scrolls (the dataset "unpacks")
 */

const CUBE_COUNT = 90

export default function DataObjects({ active }: { active: boolean }) {
  const mesh = useRef<THREE.InstancedMesh>(null)

  const seeds = useMemo(
    () =>
      Array.from({ length: CUBE_COUNT }, () => ({
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 7,
        z: (Math.random() - 0.5) * 6 - 1,
        scale: 0.12 + Math.random() * 0.4,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 0.6,
        tone: Math.random(),
      })),
    [],
  )

  const dummy = useMemo(() => new THREE.Object3D(), [])
  const color = useMemo(() => new THREE.Color(), [])
  const pointerTarget = useMemo(() => new THREE.Vector2(0, 0), [])
  const scrollRef = useRef(0)

  useFrame((state, delta) => {
    if (!mesh.current || !active) return
    const t = state.clock.elapsedTime

    const doc = document.documentElement
    const max = Math.max(1, doc.scrollHeight - window.innerHeight)
    scrollRef.current = window.scrollY / max
    const spread = 1 + scrollRef.current * 0.5

    pointerTarget.set(state.pointer.x * 2.2, state.pointer.y * 1.4)

    for (let i = 0; i < CUBE_COUNT; i++) {
      const s = seeds[i]
      const x = s.x * spread
      const y = s.y * spread + Math.sin(t * s.speed + s.phase) * 0.35
      const z = s.z + Math.cos(t * s.speed * 0.7 + s.phase) * 0.25

      // subtle reaction to the cursor
      const dx = x - pointerTarget.x
      const dy = y - pointerTarget.y
      const d = Math.sqrt(dx * dx + dy * dy)
      const push = d < 3 ? (3 - d) * 0.18 : 0

      dummy.position.set(x + (dx / (d || 1)) * push, y + (dy / (d || 1)) * push, z)
      dummy.rotation.set(t * s.spin * 0.4 + s.phase, t * s.spin, s.phase)
      dummy.scale.setScalar(s.scale)
      dummy.updateMatrix()
      mesh.current.setMatrixAt(i, dummy.matrix)

      color.setHSL(0.58 - s.tone * 0.12, 0.75, 0.45 + s.tone * 0.2)
      mesh.current.setColorAt(i, color)
    }

    mesh.current.instanceMatrix.needsUpdate = true
    if (mesh.current.instanceColor) mesh.current.instanceColor.needsUpdate = true

    // slow camera parallax
    state.camera.position.x = THREE.MathUtils.lerp(
      state.camera.position.x,
      state.pointer.x * 0.5,
      Math.min(1, delta * 1.5),
    )
    state.camera.position.y = THREE.MathUtils.lerp(
      state.camera.position.y,
      state.pointer.y * 0.3,
      Math.min(1, delta * 1.5),
    )
    state.camera.lookAt(0, 0, 0)
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[undefined, undefined, CUBE_COUNT]}
      frustumCulled={false}
      raycast={() => null}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial transparent opacity={0.5} toneMapped={false} />
    </instancedMesh>
  )
}
