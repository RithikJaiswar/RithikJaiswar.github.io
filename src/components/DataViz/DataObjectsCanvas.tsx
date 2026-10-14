import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useWebGLSupport } from '../../hooks/useWebGL'
import { useDeviceTier } from '../../hooks/useDeviceTier'
import { useReducedMotion } from 'framer-motion'

const DataObjects = lazy(() => import('../../scenes/DataObjects'))

/**
 * Decorative 3D layer behind the "I Speak Data." heading.
 * Pauses when scrolled out of view; skipped when WebGL is unavailable
 * or the user prefers reduced motion.
 */
export function DataObjectsCanvas() {
  const supported = useWebGLSupport()
  const reduced = useReducedMotion()
  const tier = useDeviceTier()
  const [inView, setInView] = useState(true)
  const wrapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.01 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  if (!supported || reduced) return null

  return (
    <div ref={wrapRef} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <Canvas
        dpr={[1, tier === 'mobile' ? 1.2 : 1.5]}
        camera={{ position: [0, 0, 10], fov: 45 }}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: false, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <DataObjects active={inView} />
        </Suspense>
      </Canvas>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_45%,transparent_20%,var(--color-ink)_100%)]" />
    </div>
  )
}
