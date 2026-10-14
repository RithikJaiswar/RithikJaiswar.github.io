import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Hero scene — an abstract "Data → Analysis → Intelligence" network.
 *
 * - ~650 drifting particles (260 on mobile) forming a soft ellipsoid cloud
 * - static thin connections between nearby nodes
 * - 3 slowly rotating wireframe polyhedra as the geometric core
 * - pointer parallax on the whole group
 * - nodes gently repelled by the cursor (computed in the vertex shader → GPU-side)
 * - scroll nudges the camera back slightly
 *
 * All motion is cheap: one uniform update per frame, no per-frame CPU loops.
 */

type ParticleNetworkProps = {
  count: number
  active: boolean
}

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;
  uniform float uPixelRatio;
  uniform float uSize;

  attribute float aScale;
  attribute float aTint;
  attribute vec3 aDrift;

  varying float vTint;
  varying float vGlow;

  void main() {
    vec3 pos = position;

    // gentle continuous drift
    pos += aDrift * sin(uTime * 0.32 + aScale * 24.0);

    // subtle cursor reaction: nodes near the pointer ease away + brighten
    float d = distance(pos.xy, uPointer);
    float influence = smoothstep(2.2, 0.0, d);
    vec2 dir = normalize(pos.xy - uPointer + vec2(0.0001));
    pos.xy += dir * influence * 0.42;
    vGlow = influence;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    gl_PointSize = uSize * aScale * uPixelRatio * (12.0 / -mv.z);
    vTint = aTint;
  }
`

const fragmentShader = /* glsl */ `
  varying float vTint;
  varying float vGlow;

  void main() {
    // soft round sprite
    vec2 uv = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;

    float alpha = smoothstep(0.5, 0.06, dist);

    vec3 blue = vec3(0.31, 0.55, 1.0);
    vec3 cyan = vec3(0.22, 0.88, 0.88);
    vec3 violet = vec3(0.55, 0.36, 0.97);

    vec3 color = mix(blue, cyan, vTint);
    color = mix(color, violet, step(0.9, vTint));
    color += vGlow * 0.35;

    gl_FragColor = vec4(color, alpha * (0.55 + vGlow * 0.45));
  }
`

export function ParticleNetwork({ count, active }: ParticleNetworkProps) {
  const group = useRef<THREE.Group>(null)
  const core = useRef<THREE.Group>(null)

  const { positions, scales, tints, drifts, linePositions } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const scales = new Float32Array(count)
    const tints = new Float32Array(count)
    const drifts = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      // ellipsoid cloud, slightly flattened in y
      const u = Math.random()
      const v = Math.random()
      const theta = u * Math.PI * 2
      const phi = Math.acos(2 * v - 1)
      const r = Math.cbrt(Math.random()) * 4.6

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta) * 1.35
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72
      positions[i * 3 + 2] = r * Math.cos(phi) * 0.85

      scales[i] = 0.55 + Math.random() * 1.15
      tints[i] = Math.random()
      drifts[i * 3] = (Math.random() - 0.5) * 0.045
      drifts[i * 3 + 1] = (Math.random() - 0.5) * 0.045
      drifts[i * 3 + 2] = (Math.random() - 0.5) * 0.03
    }

    // Build connections once between nearby nodes (capped for performance).
    const maxSegments = count > 400 ? 1100 : 450
    const maxDist = 1.35
    const segs: number[] = []
    const maxAttempts = count * 6
    let attempts = 0

    while (segs.length / 6 < maxSegments && attempts < maxAttempts) {
      attempts++
      const a = Math.floor(Math.random() * count)
      const b = Math.floor(Math.random() * count)
      if (a === b) continue
      const dx = positions[a * 3] - positions[b * 3]
      const dy = positions[a * 3 + 1] - positions[b * 3 + 1]
      const dz = positions[a * 3 + 2] - positions[b * 3 + 2]
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
      if (d > maxDist) continue
      segs.push(
        positions[a * 3],
        positions[a * 3 + 1],
        positions[a * 3 + 2],
        positions[b * 3],
        positions[b * 3 + 1],
        positions[b * 3 + 2],
      )
    }

    return {
      positions,
      scales,
      tints,
      drifts,
      linePositions: new Float32Array(segs),
    }
  }, [count])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(999, 999) },
      uPixelRatio: { value: 1 },
      uSize: { value: 26 },
    }),
    [],
  )

  const target = useRef({ x: 0, y: 0 })
  const pointerTarget = useRef(new THREE.Vector2(999, 999))
  const maxScroll = useRef(1)

  useFrame((state, delta) => {
    if (!group.current) return
    const t = state.clock.elapsedTime

    uniforms.uTime.value = t
    uniforms.uPixelRatio.value = state.gl.getPixelRatio()

    if (active) {
      // pointer → scene-space target
      target.current.x = state.pointer.x * 3.4
      target.current.y = state.pointer.y * 1.9
      pointerTarget.current.set(target.current.x, target.current.y)
      uniforms.uPointer.value.lerp(pointerTarget.current, Math.min(1, delta * 3))

      // slow parallax rotation of the whole network
      const g = group.current
      g.rotation.y += ((state.pointer.x * 0.32) - g.rotation.y) * Math.min(1, delta * 1.6)
      g.rotation.x += ((-state.pointer.y * 0.18) - g.rotation.x) * Math.min(1, delta * 1.6)

      // gentle floating
      g.position.y = Math.sin(t * 0.4) * 0.12

      // core polyhedra keep their own slow spin
      if (core.current) {
        core.current.rotation.y += delta * 0.12
        core.current.rotation.x += delta * 0.05
      }

      // camera drift + scroll dolly
      maxScroll.current = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const scroll = Math.min(1, window.scrollY / maxScroll.current)
      state.camera.position.z = THREE.MathUtils.lerp(
        state.camera.position.z,
        7 + scroll * 2.4,
        Math.min(1, delta * 2),
      )
      state.camera.position.x = Math.sin(t * 0.12) * 0.25
      state.camera.position.y = Math.cos(t * 0.09) * 0.18
      state.camera.lookAt(0, 0, 0)
    }
  })

  return (
    <group ref={group}>
      {/* particles */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-aScale" args={[scales, 1]} />
          <bufferAttribute attach="attributes-aTint" args={[tints, 1]} />
          <bufferAttribute attach="attributes-aDrift" args={[drifts, 3]} />
        </bufferGeometry>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* connections */}
      <lineSegments frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          color="#4f8cff"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>

      {/* geometric core — subtle, never dominant */}
      <group ref={core} position={[0, 0, 0]}>
        <mesh>
          <icosahedronGeometry args={[1.45, 0]} />
          <meshBasicMaterial
            color="#38e1e1"
            wireframe
            transparent
            opacity={0.14}
            depthWrite={false}
          />
        </mesh>
        <mesh rotation={[0.6, 0.4, 0]}>
          <octahedronGeometry args={[2.5, 0]} />
          <meshBasicMaterial
            color="#8b5cf6"
            wireframe
            transparent
            opacity={0.07}
            depthWrite={false}
          />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.42, 24, 24]} />
          <meshBasicMaterial color="#4f8cff" transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  )
}
