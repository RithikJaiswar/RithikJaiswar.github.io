import { useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { Html, Line } from '@react-three/drei'
import * as THREE from 'three'
import { agentNodes } from '../data/projects'

/**
 * Interactive 3D node graph for the Multi AI Research Agent project.
 *
 * Layout: a left-to-right pipeline of 6 nodes with a feedback edge
 * from the critic back to the research agent (the review loop).
 * Hovering a node reveals its responsibility and gently pushes
 * neighbouring nodes away; the whole graph drifts slowly.
 */

type NodeDef = (typeof agentNodes)[number] & { pos: [number, number, number] }

const layout: NodeDef[] = [
  { ...agentNodes[0], pos: [-4.6, 0, 0] },
  { ...agentNodes[1], pos: [-2.6, 1.25, 0.4] },
  { ...agentNodes[2], pos: [-0.4, 1.25, -0.3] },
  { ...agentNodes[3], pos: [1.7, 0.1, 0.3] },
  { ...agentNodes[4], pos: [3.5, -1.15, 0] },
  { ...agentNodes[5], pos: [5.4, 0.4, -0.2] },
]

const edges: Array<[number, number]> = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [4, 1], // critique loop back to research
]

const accent = new THREE.Color('#4f8cff')
const accentHot = new THREE.Color('#38e1e1')

function GraphNode({
  node,
  index,
  hovered,
  onHover,
  reduced,
}: {
  node: NodeDef
  index: number
  hovered: boolean
  onHover: (id: string | null) => void
  reduced: boolean
}) {
  const mesh = useRef<THREE.Mesh>(null)
  const base = useMemo(() => new THREE.Vector3(...node.pos), [node.pos])

  useFrame((state) => {
    if (!mesh.current) return
    const t = state.clock.elapsedTime

    if (!reduced) {
      mesh.current.position.y = base.y + Math.sin(t * 0.7 + index) * 0.12
      mesh.current.rotation.y += 0.004
    }

    // neighbours subtly react to the hovered node
    const targetScale = hovered ? 1.28 : 1
    mesh.current.scale.lerp(
      new THREE.Vector3(targetScale, targetScale, targetScale),
      0.12,
    )
  })

  return (
    <group
      position={node.pos}
      onPointerOver={(e) => {
        e.stopPropagation()
        onHover(node.id)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        onHover(null)
        document.body.style.cursor = ''
      }}
    >
      <mesh ref={mesh}>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshBasicMaterial
          color={hovered ? accentHot : accent}
          wireframe={!hovered}
          transparent
          opacity={hovered ? 0.95 : 0.75}
        />
      </mesh>
      <mesh scale={0.16}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color="#38e1e1" transparent opacity={0.9} />
      </mesh>

      <Html
        center
        distanceFactor={9}
        position={[0, index % 2 === 0 ? -1 : 1.05, 0]}
        zIndexRange={[20, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`whitespace-nowrap rounded-md border px-2 py-1 text-center transition-colors ${
            hovered
              ? 'border-[#38e1e1]/60 bg-[#0d111a]/95'
              : 'border-white/10 bg-[#0d111a]/80'
          }`}
        >
          <p
            className={`text-[11px] font-semibold tracking-tight ${
              hovered ? 'text-[#38e1e1]' : 'text-[#e7eaf0]'
            }`}
          >
            {node.label}
          </p>
          {hovered && (
            <p className="mt-0.5 max-w-[190px] text-[10px] leading-snug text-[#98a1b6]">
              {node.role}
            </p>
          )}
        </div>
      </Html>
    </group>
  )
}

export default function AgentGraph() {
  const [hovered, setHovered] = useState<string | null>(null)
  const group = useRef<THREE.Group>(null)
  const reduced = useReducedMotion() ?? false

  const linePairs = useMemo(
    () =>
      edges.map(([a, b]) => ({
        points: [new THREE.Vector3(...layout[a].pos), new THREE.Vector3(...layout[b].pos)],
        hot: a === 4 && b === 1,
      })),
    [],
  )

  useFrame((state, delta) => {
    if (!group.current || reduced) return
    const t = state.clock.elapsedTime
    // slow drift + pointer parallax
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      state.pointer.x * 0.22,
      Math.min(1, delta * 1.5),
    )
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -state.pointer.y * 0.12,
      Math.min(1, delta * 1.5),
    )
    group.current.position.y = Math.sin(t * 0.35) * 0.1
  })

  return (
    <group ref={group}>
      {linePairs.map((pair, i) => (
        <Line
          key={i}
          points={pair.points}
          color={pair.hot ? '#8b5cf6' : '#4f8cff'}
          lineWidth={pair.hot ? 1.4 : 1.2}
          dashed={!pair.hot}
          dashSize={0.18}
          gapSize={0.14}
          transparent
          opacity={hovered ? 0.35 : 0.55}
        />
      ))}

      {layout.map((node, i) => (
        <GraphNode
          key={node.id}
          node={node}
          index={i}
          hovered={hovered === node.id}
          onHover={setHovered}
          reduced={reduced}
        />
      ))}
    </group>
  )
}
