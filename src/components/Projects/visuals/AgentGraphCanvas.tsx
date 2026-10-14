import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion } from 'framer-motion'
import { GitBranch } from 'lucide-react'
import { useWebGLSupport } from '../../../hooks/useWebGL'
import { useDeviceTier } from '../../../hooks/useDeviceTier'
import { agentNodes } from '../../../data/projects'

const AgentGraph = lazy(() => import('../../../scenes/AgentGraph'))

/** Static, accessible fallback when WebGL is unavailable. */
function StaticWorkflow() {
  return (
    <ol className="flex h-full flex-col justify-center gap-1.5 px-4 py-4">
      {agentNodes.map((node, i) => (
        <li key={node.id} className="flex items-center gap-2 text-[0.72rem]">
          <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 font-mono text-[0.5rem] text-accent">
            {i + 1}
          </span>
          <span className="font-medium text-fg">{node.label}</span>
          {i < agentNodes.length - 1 && <span className="text-faint">→</span>}
        </li>
      ))}
    </ol>
  )
}

/**
 * Small, self-contained 3D canvas for the Multi AI Research Agent card.
 * Pauses rendering when scrolled out of view; falls back gracefully.
 */
export function AgentGraphCanvas() {
  const supported = useWebGLSupport()
  const tier = useDeviceTier()
  const [visible, setVisible] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [ready, setReady] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      ([e]) => {
        setVisible(e.isIntersecting)
        // mount once near the viewport, then keep the canvas alive
        if (e.isIntersecting) setMounted(true)
      },
      { threshold: 0.05, rootMargin: '200px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!supported) return <StaticWorkflow />

  // Defer mounting (and downloading) the 3D scene until the card approaches
  // the viewport — keeps startup cost off the critical path.
  if (!mounted) {
    return (
      <div ref={wrapRef} className="relative grid h-full min-h-[16rem] w-full place-items-center">
        <div className="flex flex-col items-center gap-2" aria-hidden="true">
          <GitBranch className="h-5 w-5 animate-pulse text-accent" />
          <p className="font-mono text-[0.6rem] tracking-[0.24em] text-faint uppercase">
            Hover a node
          </p>
        </div>
      </div>
    )
  }

  return (
    <div ref={wrapRef} className="relative h-full min-h-[16rem] w-full">
      <Canvas
        dpr={[1, tier === 'mobile' ? 1.3 : 1.6]}
        camera={{ position: [0, 0, 9.5], fov: 45 }}
        frameloop={visible ? 'always' : 'never'}
        gl={{ antialias: true, alpha: true }}
        onCreated={() => setReady(true)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <AgentGraph />
        </Suspense>
      </Canvas>

      <AnimatePresence>
        {!ready && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 grid place-items-center"
            aria-hidden="true"
          >
            <GitBranch className="h-5 w-5 animate-pulse text-accent" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
