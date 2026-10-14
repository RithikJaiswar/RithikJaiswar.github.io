import { Check, ExternalLink, Github, Sparkles } from 'lucide-react'
import { lazy, Suspense } from 'react'
import type { Project } from '../../data/projects'
import { cn } from '../../utils/cn'
import { DashboardVisual } from './visuals/DashboardVisual'
import { MetricsVisual } from './visuals/MetricsVisual'
import { StockVisual } from './visuals/StockVisual'
import { PipelineVisual } from './visuals/PipelineVisual'

// The 3D graph pulls in the Three.js runtime — keep it out of the main bundle.
const AgentGraphCanvas = lazy(() =>
  import('./visuals/AgentGraphCanvas').then((m) => ({ default: m.AgentGraphCanvas })),
)

const accentBorder: Record<Project['accent'], string> = {
  blue: 'hover:border-accent/40',
  cyan: 'hover:border-accent-2/40',
  violet: 'hover:border-accent-3/40',
}

const accentText: Record<Project['accent'], string> = {
  blue: 'text-accent',
  cyan: 'text-accent-2',
  violet: 'text-accent-3',
}

function ProjectVisual({ project }: { project: Project }) {
  switch (project.visual) {
    case 'dashboard':
      return <DashboardVisual />
    case 'metrics':
      return <MetricsVisual />
    case 'stock':
      return <StockVisual />
    case 'agent':
      return (
        <Suspense
          fallback={
            <div className="grid min-h-[16rem] place-items-center" aria-hidden="true">
              <span className="font-mono text-[0.6rem] tracking-[0.24em] text-faint uppercase">
                Loading 3D graph
              </span>
            </div>
          }
        >
          <AgentGraphCanvas />
        </Suspense>
      )
    case 'pipeline':
      return <PipelineVisual />
  }
}

type ProjectCardProps = {
  project: Project
  onOpen: () => void
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const previewFeatures = project.features.slice(0, 4)
  const remaining = project.features.length - previewFeatures.length

  return (
    <article
      className={cn(
        'glass group flex h-full flex-col rounded-3xl p-5 transition-all duration-400 sm:p-6',
        'hover:-translate-y-1.5 hover:border-white/[0.16]',
        accentBorder[project.accent],
      )}
    >
        {/* header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className={cn('font-mono text-[0.65rem] tracking-[0.3em]', accentText[project.accent])}>
              PROJECT {project.index}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight text-fg sm:text-[1.35rem]">
              {project.title}
            </h3>
          </div>
          <span
            className="hidden shrink-0 rounded-full border border-line bg-white/[0.03] px-2.5 py-1 font-mono text-[0.6rem] text-faint sm:block"
            aria-hidden="true"
          >
            {project.visual === 'agent' ? '3D GRAPH' : 'LIVE VIZ'}
          </span>
        </div>

        <p className="mt-2.5 text-[0.88rem] leading-relaxed text-muted">{project.headline}</p>

        {/* tech chips */}
        <ul className="mt-3.5 flex flex-wrap gap-1.5" aria-label="Technologies used">
          {project.tech.map((t) => (
            <li
              key={t}
              className="rounded-md border border-line bg-white/[0.03] px-2 py-1 font-mono text-[0.65rem] text-muted transition-colors group-hover:border-line-strong"
            >
              {t}
            </li>
          ))}
        </ul>

        {/* visual preview */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-[#0a0d13]/80 p-3 transition-colors duration-300 group-hover:border-line-strong">
          <ProjectVisual project={project} />
        </div>

        {/* results */}
        <dl className="mt-5 grid grid-cols-3 gap-2">
          {project.results.map((r) => (
            <div key={r.label} className="rounded-xl border border-line bg-white/[0.02] px-2.5 py-2">
              <dt className="font-mono text-[0.55rem] tracking-widest text-faint uppercase">
                {r.label}
              </dt>
              <dd className="mt-0.5 truncate text-[0.9rem] font-semibold text-fg">{r.value}</dd>
              {r.sub && <dd className="truncate text-[0.6rem] text-muted">{r.sub}</dd>}
            </div>
          ))}
        </dl>

        {/* key functionality */}
        <ul className="mt-5 space-y-1.5">
          {previewFeatures.map((f) => (
            <li key={f} className="flex items-start gap-2 text-[0.8rem] leading-snug text-muted">
              <Check className={cn('mt-0.5 h-3.5 w-3.5 shrink-0', accentText[project.accent])} aria-hidden="true" />
              {f}
            </li>
          ))}
          {remaining > 0 && (
            <li className="pl-5.5 font-mono text-[0.68rem] text-faint">
              +{remaining} more in details
            </li>
          )}
        </ul>

        {/* actions */}
        <div className="mt-auto flex flex-wrap items-center gap-2.5 pt-6">
          <button
            type="button"
            onClick={onOpen}
            aria-label={`View details for ${project.title}`}
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong bg-white/[0.05] px-4 text-[0.78rem] font-medium text-fg transition-all hover:border-accent/60 hover:bg-white/[0.09]"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
            View details
          </button>
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[0.78rem] text-muted transition-all hover:border-line-strong hover:text-fg"
          >
            <Github className="h-3.5 w-3.5" aria-hidden="true" />
            GitHub
          </a>
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line px-4 text-[0.78rem] text-muted transition-all hover:border-line-strong hover:text-fg"
            >
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              Live demo
            </a>
          )}
        </div>
      </article>
  )
}
