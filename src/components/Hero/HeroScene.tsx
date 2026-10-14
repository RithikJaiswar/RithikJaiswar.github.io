import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Activity } from 'lucide-react'
import { ParticleNetwork } from '../../scenes/ParticleNetwork'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useWebGLSupport } from '../../hooks/useWebGL'

/**
 * Wraps the R3F canvas:
 * - lazy-loaded (Three.js lives in its own async chunk)
 * - subtle loading shimmer until the first frame renders
 * - pauses rendering when scrolled out of view
 * - graceful static fallback when WebGL is unavailable / motion reduced
 */

function StaticSceneFallback() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute top-1/2 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.22),transparent_65%)] blur-2xl" />
      <div className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(56,225,225,0.16),transparent_65%)] blur-2xl" />
      <svg
        className="absolute top-1/2 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 opacity-60"
        viewBox="0 0 400 400"
        fill="none"
      >
        <g stroke="rgba(79,140,255,0.35)" strokeWidth="1">
          <path d="M90 210 L150 130 L230 160 L300 110" />
          <path d="M150 130 L170 250 L260 280 L300 190" />
          <path d="M230 160 L260 280" />
          <path d="M90 210 L170 250" />
          <path d="M300 110 L300 190" />
        </g>
        <g fill="#4f8cff">
          <circle cx="90" cy="210" r="5" />
          <circle cx="150" cy="130" r="7" />
          <circle cx="230" cy="160" r="5" />
          <circle cx="300" cy="110" r="6" />
          <circle cx="170" cy="250" r="5" />
          <circle cx="260" cy="280" r="6" />
          <circle cx="300" cy="190" r="5" />
        </g>
        <g fill="#38e1e1">
          <circle cx="205" cy="205" r="9" />
        </g>
      </svg>
    </div>
  )
}

function SceneLoader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="absolute inset-0 grid place-items-center"
      aria-hidden="true"
    >
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border border-line" />
          <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-accent" />
        </div>
        <p className="flex items-center gap-2 font-mono text-[0.68rem] tracking-widest text-faint uppercase">
          <Activity className="h-3 w-3 animate-pulse text-accent-2" />
          Loading data layer
        </p>
      </div>
    </motion.div>
  )
}

export default function HeroScene() {
  const supported = useWebGLSupport()
  const reduced = useReducedMotion()
  const tier = useDeviceTier()
  const [ready, setReady] = useState(false)
  const [inView, setInView] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)

  // Pause the render loop when the hero scrolls off screen (GPU savings).
  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.01,
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!supported) return <StaticSceneFallback />

  const particleCount = tier === 'mobile' ? 240 : 640

  return (
    <div ref={wrapRef} className="absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, tier === 'mobile' ? 1.5 : 1.8]}
        camera={{ position: [0, 0, 7], fov: 48 }}
        frameloop={!inView ? 'never' : reduced ? 'demand' : 'always'}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <ParticleNetwork count={particleCount} active={!reduced} />
        </Suspense>
      </Canvas>

      <AnimatePresence>{!ready && <SceneLoader key="loader" />}</AnimatePresence>
    </div>
  )
}
