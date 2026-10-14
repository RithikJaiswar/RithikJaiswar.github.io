import { lazy, Suspense, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, Download, Github, Linkedin, Sparkles } from 'lucide-react'
import { contact, profile } from '../../data/site'
import { Button } from '../ui/Button'
import { Counter } from '../ui/Counter'
import { EASE } from '../../utils/animations'
import { cn } from '../../utils/cn'

// Three.js is code-split out of the critical bundle.
const HeroScene = lazy(() => import('./HeroScene'))

const panelCn =
  'glass rounded-2xl px-4 py-3 backdrop-blur-md transition-colors duration-300 hover:border-line-strong'

export function Hero() {
  const reduced = useReducedMotion()
  const [sceneReady, setSceneReady] = useState(false)
  // The static shell in index.html already painted this content — don't
  // re-run the entrance animation (it would flash the hero text).
  const shellPainted =
    typeof document !== 'undefined' && document.documentElement.dataset.heroPainted === '1'

  // Mount the Three.js scene only after the first paint, once the browser is
  // idle — keeps the recruiter-facing content on the fastest possible path.
  useEffect(() => {
    let cancelled = false
    let timer = 0
    const mount = () => {
      if (!cancelled) setSceneReady(true)
    }
    const idleWin = window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number
    }
    if (typeof idleWin.requestIdleCallback === 'function') {
      idleWin.requestIdleCallback(mount, { timeout: 1200 })
    } else {
      timer = window.setTimeout(mount, 600)
    }
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [])

  const rise = (delay: number) =>
    reduced || shellPainted
      ? {}
      : {
          initial: { opacity: 0, y: 22, filter: 'blur(6px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.75, ease: EASE, delay },
        }

  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* 3D network — decorative enhancement behind the content */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <Suspense fallback={null}>{sceneReady && <HeroScene />}</Suspense>
        {/* readability gradients over the scene */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,7,10,0.72)_0%,rgba(6,7,10,0.25)_38%,rgba(6,7,10,0.55)_78%,var(--color-ink)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_15%_45%,rgba(6,7,10,0.85),transparent_70%)]" />
      </div>

      <div className="mx-auto grid min-h-[100svh] max-w-7xl grid-cols-1 items-center gap-10 px-5 pt-28 pb-20 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:pt-32 lg:pb-24">
        {/* ------------------------------- copy ------------------------------- */}
        <div className="max-w-2xl">
          <motion.div {...rise(0.05)} className="mb-6">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-muted backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="animate-pulse-dot absolute inline-flex h-full w-full rounded-full bg-accent-2" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-2/80" />
              </span>
              {profile.status}
            </span>
          </motion.div>

          <motion.h1
            {...rise(0.14)}
            className="text-[clamp(2.5rem,6.2vw,4.5rem)] leading-[1.04] font-semibold tracking-[-0.03em] text-fg"
          >
            Hi, I&apos;m <span className="text-gradient">{profile.name}</span>.
          </motion.h1>

          <motion.p
            {...rise(0.24)}
            className="mt-5 font-mono text-[0.82rem] tracking-[0.16em] text-accent-2 uppercase sm:text-[0.9rem]"
          >
            {profile.roles.join('  |  ')}
          </motion.p>

          <motion.p {...rise(0.32)} className="mt-6 text-xl leading-snug font-medium text-fg/90 sm:text-2xl">
            {profile.tagline}
          </motion.p>

          <motion.p {...rise(0.4)} className="mt-4 max-w-xl text-[0.95rem] leading-relaxed text-muted">
            {profile.summaryLong}
          </motion.p>

          <motion.div {...rise(0.5)} className="mt-8 flex flex-wrap items-center gap-3">
            <Button
              href="#projects"
              size="lg"
              icon={<ArrowDown className="h-4 w-4" aria-hidden="true" />}
            >
              View My Projects
            </Button>
            <Button
              href={contact.resume}
              variant="outline"
              size="lg"
              external
              icon={<Download className="h-4 w-4" aria-hidden="true" />}
            >
              Download Resume
            </Button>
          </motion.div>

          <motion.div {...rise(0.58)} className="mt-6 flex items-center gap-5">
            <a
              href={contact.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <Github className="h-4 w-4" aria-hidden="true" /> GitHub
            </a>
            <span className="h-3.5 w-px bg-line-strong" aria-hidden="true" />
            <a
              href={contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
            >
              <Linkedin className="h-4 w-4" aria-hidden="true" /> LinkedIn
            </a>
          </motion.div>
        </div>

        {/* ------------------------ floating data panel ------------------------ */}
        <motion.aside
          initial={reduced || shellPainted ? false : { opacity: 0, y: 30, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
          className="lg:justify-self-end"
          aria-label="Project highlights"
        >
          <div className="grid w-full max-w-md grid-cols-1 gap-3 sm:grid-cols-3 lg:w-[24rem] lg:grid-cols-1">
            <div className={cn(panelCn, 'group')}>
              <p className="font-mono text-[0.62rem] tracking-[0.3em] text-accent uppercase">Data</p>
              <p className="mt-1.5 text-2xl font-semibold text-fg">
                <Counter value={12} suffix="K+" />
              </p>
              <p className="text-xs text-muted">Records analysed</p>
            </div>
            <div className={cn(panelCn, 'group')}>
              <p className="font-mono text-[0.62rem] tracking-[0.3em] text-accent-2 uppercase">Model</p>
              <p className="mt-1.5 text-2xl font-semibold text-fg">
                <Counter value={86.41} decimals={2} suffix="%" />
              </p>
              <p className="text-xs text-muted">Best model accuracy</p>
            </div>
            <div className={cn(panelCn, 'group')}>
              <p className="font-mono text-[0.62rem] tracking-[0.3em] text-accent-3 uppercase">Analytics</p>
              <p className="mt-1.5 text-[0.95rem] leading-tight font-semibold text-fg">
                SQL · Python · Power BI
              </p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted">
                <Sparkles className="h-3 w-3 text-accent-2" aria-hidden="true" />
                Dashboards &amp; ML
              </p>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={reduced || shellPainted ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.6 }}
        aria-label="Scroll to About section"
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-faint transition-colors hover:text-muted md:flex"
      >
        <span className="font-mono text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
        <motion.span
          animate={reduced ? {} : { y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
        </motion.span>
      </motion.a>
    </section>
  )
}
