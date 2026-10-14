import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { demoCharts } from '../../../data/projects'
import { EASE } from '../../../utils/animations'

const COLORS = ['#4f8cff', '#38e1e1', '#8b5cf6', '#f59e0b']

/** Customer segmentation donut with hover highlight. */
export function SegmentChart() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  const [active, setActive] = useState<number | null>(null)

  const data = demoCharts.segments
  const total = data.reduce((s, d) => s + d.value, 0)
  const r = 62
  const circumference = 2 * Math.PI * r

  let offsetAcc = 0
  const arcs = data.map((d, i) => {
    const fraction = d.value / total
    const arc = {
      ...d,
      dash: fraction * circumference,
      gap: circumference - fraction * circumference,
      rotation: offsetAcc * 360,
      color: COLORS[i % COLORS.length],
      index: i,
    }
    offsetAcc += fraction
    return arc
  })

  return (
    <div ref={ref} className="rounded-3xl border border-line bg-white/[0.02] p-5 sm:p-6">
      <p className="font-mono text-[0.62rem] tracking-[0.26em] text-accent-2 uppercase">
        Customer segmentation
      </p>
      <p className="mt-1 text-sm text-muted">Behavioural segments from the retail analysis.</p>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row">
        <svg viewBox="0 0 160 160" className="h-40 w-40 shrink-0" role="img" aria-label="Customer segmentation donut chart">
          <g transform="rotate(-90 80 80)">
            {arcs.map((arc) => (
              <motion.circle
                key={arc.label}
                cx="80"
                cy="80"
                r={r}
                fill="none"
                stroke={arc.color}
                strokeWidth={active === arc.index ? 24 : 18}
                strokeDasharray={`${arc.dash} ${arc.gap}`}
                strokeDashoffset={0}
                opacity={active === null || active === arc.index ? 1 : 0.35}
                transform={`rotate(${arc.rotation} 80 80)`}
                initial={reduced ? false : { strokeDasharray: `0 ${circumference}` }}
                animate={
                  inView
                    ? { strokeDasharray: `${arc.dash} ${arc.gap}` }
                    : {}
                }
                transition={{ duration: 1.1, ease: EASE, delay: 0.15 + arc.index * 0.12 }}
                onMouseEnter={() => setActive(arc.index)}
                onMouseLeave={() => setActive(null)}
                style={{ transition: 'stroke-width 0.2s, opacity 0.2s' }}
              />
            ))}
          </g>
          <text x="80" y="76" textAnchor="middle" className="fill-fg" style={{ fontSize: 24, fontWeight: 600 }}>
            {active !== null ? `${data[active].value}%` : '4'}
          </text>
          <text x="80" y="95" textAnchor="middle" className="fill-faint" style={{ fontSize: 10 }}>
            {active !== null ? data[active].label : 'segments'}
          </text>
        </svg>

        <ul className="w-full space-y-2.5">
          {arcs.map((arc) => (
            <li key={arc.label}>
              <button
                type="button"
                onMouseEnter={() => setActive(arc.index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(arc.index)}
                onBlur={() => setActive(null)}
                className={`flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition-colors ${
                  active === arc.index ? 'bg-white/[0.06]' : ''
                }`}
                aria-label={`${arc.label} ${arc.value}% of customers`}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: arc.color }} aria-hidden="true" />
                <span className="text-[0.82rem] text-muted">{arc.label}</span>
                <span className="ml-auto font-mono text-[0.8rem] font-medium text-fg">{arc.value}%</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-4 text-[0.68rem] text-faint">
        Illustrative segment split from the analysis notebook; segment rules are documented in the repo.
      </p>
    </div>
  )
}
