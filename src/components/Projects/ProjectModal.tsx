import { useEffect, useRef, lazy, Suspense } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { AlertTriangle, ExternalLink, Github, Layers, ListChecks, Network, X, Zap } from 'lucide-react'
import type { Project } from '../../data/projects'
import { EASE } from '../../utils/animations'
import { DashboardVisual } from './visuals/DashboardVisual'
import { MetricsVisual } from './visuals/MetricsVisual'
import { StockVisual } from './visuals/StockVisual'
import { PipelineVisual } from './visuals/PipelineVisual'

const AgentGraphCanvas = lazy(() =>
  import('./visuals/AgentGraphCanvas').then((m) => ({ default: m.AgentGraphCanvas })),
)

function Section({ icon: Icon, title, children }: { icon: typeof Layers; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-line bg-white/[0.02] p-5">
      <h4 className="mb-3 flex items-center gap-2 font-mono text-[0.66rem] tracking-[0.24em] text-accent-2 uppercase">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </h4>
      {children}
    </section>
  )
}

type ProjectModalProps = {
  project: Project | null
  onClose: () => void
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const reduced = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Escape closes, body scroll locks, focus moves into the dialog.
  useEffect(() => {
    if (!project) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      // simple focus containment
      if (e.key === 'Tab' && panelRef.current) {
        const focusables = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        )
        if (focusables.length === 0) return
        const first = focusables[0]
        const last = focusables[focusables.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    const t = setTimeout(() => closeRef.current?.focus(), 60)

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      clearTimeout(t)
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-[70] flex items-start justify-center overflow-y-auto p-4 sm:p-6 md:items-center">
          {/* backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* dialog */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 34, scale: 0.97, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.98, filter: 'blur(4px)' }}
            transition={{ duration: reduced ? 0 : 0.45, ease: EASE }}
            className="relative my-4 w-full max-w-4xl rounded-3xl border border-line-strong bg-[#0a0d14]/95 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            {/* header */}
            <header className="sticky top-0 z-10 flex items-start justify-between gap-4 rounded-t-3xl border-b border-line bg-[#0a0d14]/90 px-5 py-4 backdrop-blur-xl sm:px-7">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.3em] text-accent uppercase">
                  Project {project.index}
                </p>
                <h3
                  id="project-modal-title"
                  className="mt-1 text-xl font-semibold tracking-tight text-fg sm:text-2xl"
                >
                  {project.title}
                </h3>
              </div>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close project details"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </header>

            <div className="space-y-5 px-5 py-6 sm:px-7">
              {/* visual */}
              <div className="overflow-hidden rounded-2xl border border-line bg-[#0a0d13]/80 p-4">
                {project.visual === 'dashboard' && <DashboardVisual />}
                {project.visual === 'metrics' && <MetricsVisual />}
                {project.visual === 'stock' && <StockVisual />}
                {project.visual === 'pipeline' && <PipelineVisual />}
                {project.visual === 'agent' && (
                  <div className="min-h-[18rem]">
                    <p className="mb-1 font-mono text-[0.6rem] tracking-[0.2em] text-faint uppercase">
                      Agent workflow — hover a node
                    </p>
                    <Suspense
                      fallback={
                        <div className="grid min-h-[16rem] place-items-center" aria-hidden="true">
                          <span className="font-mono text-[0.6rem] text-faint">Loading graph…</span>
                        </div>
                      }
                    >
                      <AgentGraphCanvas />
                    </Suspense>
                    <ol className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                      {project.workflow.map((w, i) => (
                        <li key={w.title} className="flex gap-2 text-[0.72rem] text-muted">
                          <span className="font-mono text-accent">{String(i + 1).padStart(2, '0')}</span>
                          <span>
                            <span className="text-fg">{w.title}</span> — {w.text}
                          </span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>

              {/* problem + solution */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Section icon={AlertTriangle} title="Problem">
                  <p className="text-[0.88rem] leading-relaxed text-muted">{project.problem}</p>
                </Section>
                <Section icon={Zap} title="Solution">
                  <p className="text-[0.88rem] leading-relaxed text-muted">{project.solution}</p>
                </Section>
              </div>

              {/* architecture */}
              <Section icon={Network} title="Architecture">
                <ol className="space-y-2.5">
                  {project.architecture.map((step, i) => (
                    <li key={step} className="flex gap-3 text-[0.86rem] leading-relaxed text-muted">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 font-mono text-[0.58rem] text-accent">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </Section>

              {/* workflow + features */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Section icon={Layers} title="Workflow">
                  <ol className="space-y-2.5">
                    {project.workflow.map((step, i) => (
                      <li key={step.title} className="text-[0.86rem] leading-relaxed">
                        <span className="font-mono text-[0.68rem] text-accent-2">
                          {String(i + 1).padStart(2, '0')}
                        </span>{' '}
                        <span className="font-medium text-fg">{step.title}</span>
                        <p className="mt-0.5 text-muted">{step.text}</p>
                      </li>
                    ))}
                  </ol>
                </Section>

                <Section icon={ListChecks} title="Key functionality">
                  <ul className="space-y-2">
                    {project.features.map((f) => (
                      <li key={f} className="flex gap-2.5 text-[0.86rem] leading-relaxed text-muted">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-2" aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </Section>
              </div>

              {/* results + stack */}
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <Section icon={Zap} title="Results">
                  <dl className="space-y-3">
                    {project.results.map((r) => (
                      <div key={r.label} className="flex items-baseline justify-between gap-4">
                        <dt className="text-[0.84rem] text-muted">
                          {r.label}
                          {r.sub && <span className="block text-[0.72rem] text-faint">{r.sub}</span>}
                        </dt>
                        <dd className="font-mono text-lg font-semibold text-fg">{r.value}</dd>
                      </div>
                    ))}
                  </dl>
                </Section>

                <Section icon={Layers} title="Tech stack">
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded-lg border border-line bg-white/[0.03] px-3 py-1.5 font-mono text-[0.72rem] text-fg"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </Section>
              </div>

              {project.disclaimer && (
                <p className="flex items-start gap-2 rounded-2xl border border-accent-3/30 bg-accent-3/[0.07] px-4 py-3 text-[0.8rem] text-accent-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {project.disclaimer}
                </p>
              )}

              {/* links */}
              <div className="flex flex-wrap gap-3 border-t border-line pt-5">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-fg px-6 text-sm font-medium text-ink transition-transform hover:scale-[1.02]"
                >
                  <Github className="h-4 w-4" aria-hidden="true" />
                  View on GitHub
                </a>
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong px-6 text-sm text-fg transition-all hover:border-accent/60"
                  >
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    Live demo
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line px-6 text-sm text-muted transition-colors hover:text-fg"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
