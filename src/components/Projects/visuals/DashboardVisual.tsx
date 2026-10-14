import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { demoCharts } from '../../../data/projects'
import { cn } from '../../../utils/cn'
import { EASE } from '../../../utils/animations'

/**
 * Animated mini dashboard used by the Retail Sales project card.
 * All four charts animate when the card enters the viewport.
 * Series are illustrative samples of the dashboard output.
 */

const BLUE = '#4f8cff'
const CYAN = '#38e1e1'
const VIOLET = '#8b5cf6'

function MiniShell({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-3.5">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <p className="font-mono text-[0.6rem] tracking-[0.2em] text-faint uppercase">{title}</p>
        {hint && <p className="text-[0.62rem] text-muted">{hint}</p>}
      </div>
      {children}
    </div>
  )
}

/* ------------------------------ revenue line ------------------------------ */
function RevenueTrend() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  const data = demoCharts.revenueTrend
  const w = 300
  const h = 96
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))

  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (w - 8) + 4
    const y = h - 10 - ((d.value - min) / (max - min)) * (h - 24)
    return { x, y, ...d }
  })

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1].x},${h} L${pts[0].x},${h} Z`

  return (
    <div ref={ref}>
      <MiniShell title="Revenue trend" hint={hover !== null ? `${data[hover].period} • ₹${data[hover].value}K` : '12 months'}>
        <svg viewBox={`0 0 ${w} ${h}`} className="h-24 w-full" role="img" aria-label="Monthly revenue trend chart">
          <defs>
            <linearGradient id="rev-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CYAN} stopOpacity="0.35" />
              <stop offset="100%" stopColor={CYAN} stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((t) => (
            <line key={t} x1={0} x2={w} y1={h * t} y2={h * t} stroke="rgba(255,255,255,0.06)" />
          ))}

          <motion.path
            d={area}
            fill="url(#rev-fill)"
            initial={reduced ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke={CYAN}
            strokeWidth={2}
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.6, ease: EASE }}
          />

          {pts.map((p, i) => (
            <g key={p.period}>
              {hover === i && (
                <circle cx={p.x} cy={p.y} r={4} fill="#06070a" stroke={CYAN} strokeWidth={2} />
              )}
              {/* hover targets */}
              <rect
                x={p.x - w / data.length / 2}
                y={0}
                width={w / data.length}
                height={h}
                fill="transparent"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
              />
            </g>
          ))}
        </svg>
      </MiniShell>
    </div>
  )
}

/* -------------------------------- churn donut ------------------------------ */
function ChurnDonut() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const churned = demoCharts.churn.find((c) => c.label === 'Churned')!.value
  const r = 34
  const c = 2 * Math.PI * r

  return (
    <div ref={ref}>
      <MiniShell title="Customer churn">
        <div className="flex items-center gap-4">
          <svg viewBox="0 0 90 90" className="h-24 w-24 shrink-0" role="img" aria-label={`Churn rate ${churned} percent`}>
            <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
            <motion.circle
              cx="45"
              cy="45"
              r={r}
              fill="none"
              stroke={VIOLET}
              strokeWidth="9"
              strokeLinecap="round"
              strokeDasharray={c}
              initial={reduced ? false : { strokeDashoffset: c }}
              animate={inView ? { strokeDashoffset: c - (churned / 100) * c } : {}}
              transition={{ duration: 1.3, ease: EASE, delay: 0.3 }}
              transform="rotate(-90 45 45)"
            />
            <text
              x="45"
              y="49"
              textAnchor="middle"
              className="fill-fg text-[15px] font-semibold"
              style={{ fontFamily: 'var(--font-sans)' }}
            >
              {churned}%
            </text>
          </svg>
          <ul className="space-y-2 text-[0.72rem]">
            {demoCharts.churn.map((slice, i) => (
              <li key={slice.label} className="flex items-center gap-2">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: i === 0 ? BLUE : VIOLET }}
                  aria-hidden="true"
                />
                <span className="text-muted">{slice.label}</span>
                <span className="ml-auto font-mono text-fg">{slice.value}%</span>
              </li>
            ))}
          </ul>
        </div>
      </MiniShell>
    </div>
  )
}

/* --------------------------- repeat purchase bars -------------------------- */
function RepeatPurchase() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const data = demoCharts.repeatRate
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div ref={ref}>
      <MiniShell title="Repeat purchase rate" hint="Quarterly">
        <div className="flex h-24 items-end justify-between gap-3 px-1">
          {data.map((d, i) => (
            <div key={d.period} className="flex flex-1 flex-col items-center gap-1.5">
              <span className="font-mono text-[0.6rem] text-muted">{d.value}%</span>
              <motion.div
                className="w-full rounded-md bg-gradient-to-t from-accent/30 to-accent"
                initial={reduced ? false : { height: 0 }}
                animate={inView ? { height: `${(d.value / max) * 64}px` } : {}}
                transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.12 }}
              />
              <span className="text-[0.6rem] text-faint">{d.period}</span>
            </div>
          ))}
        </div>
      </MiniShell>
    </div>
  )
}

/* ------------------------------- segments bars ----------------------------- */
function Segments() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const data = demoCharts.segments
  const max = Math.max(...data.map((d) => d.value))

  return (
    <div ref={ref}>
      <MiniShell title="Customer segments">
        <ul className="space-y-2.5 py-1">
          {data.map((d, i) => (
            <li key={d.label} className="flex items-center gap-3">
              <span className="w-16 shrink-0 text-[0.68rem] text-muted">{d.label}</span>
              <span className="h-2 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.span
                  className="block h-full rounded-full"
                  style={{
                    background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`,
                    opacity: 1 - i * 0.16,
                  }}
                  initial={reduced ? false : { width: 0 }}
                  animate={inView ? { width: `${(d.value / max) * 100}%` } : {}}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.1 }}
                />
              </span>
              <span className="w-8 shrink-0 text-right font-mono text-[0.66rem] text-fg">
                {d.value}%
              </span>
            </li>
          ))}
        </ul>
      </MiniShell>
    </div>
  )
}

export function DashboardVisual() {
  return (
    <div className={cn('grid grid-cols-1 gap-3 sm:grid-cols-2')}>
      <RevenueTrend />
      <ChurnDonut />
      <RepeatPurchase />
      <Segments />
      <p className="text-[0.62rem] leading-relaxed text-faint sm:col-span-2">
        Illustrative sample of the dashboard views; published figures come from the project dataset.
      </p>
    </div>
  )
}
