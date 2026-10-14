import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { demoCharts } from '../../../data/projects'
import { EASE } from '../../../utils/animations'

/**
 * Interactive revenue chart — hover (or focus + arrow keys) to inspect a month.
 * Ships a visually hidden data table for screen readers.
 */
export function RevenueExplorer() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()
  const [idx, setIdx] = useState<number | null>(null)

  const data = demoCharts.revenueTrend
  const w = 560
  const h = 210
  const max = Math.max(...data.map((d) => d.value))
  const min = Math.min(...data.map((d) => d.value))

  const pts = data.map((d, i) => ({
    x: (i / (data.length - 1)) * (w - 60) + 40,
    y: h - 40 - ((d.value - min) / (max - min)) * (h - 80),
    ...d,
  }))

  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const area = `${line} L${pts[pts.length - 1].x},${h - 30} L${pts[0].x},${h - 30} Z`

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    setIdx((prev) => {
      const base = prev ?? -1
      const next = e.key === 'ArrowRight' ? base + 1 : base - 1
      return Math.max(0, Math.min(data.length - 1, next))
    })
  }

  return (
    <div ref={ref} className="rounded-3xl border border-line bg-white/[0.02] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="font-mono text-[0.62rem] tracking-[0.26em] text-accent-2 uppercase">
            Revenue trend
          </p>
          <p className="mt-1 text-sm text-muted">
            {idx !== null ? (
              <>
                <span className="font-medium text-fg">{data[idx].period}</span> — ₹{data[idx].value}K
              </>
            ) : (
              'Hover or use ← → to inspect a month'
            )}
          </p>
        </div>
        <div className="rounded-full border border-line bg-white/[0.03] px-3 py-1 font-mono text-[0.65rem] text-faint">
          peak ₹{max}K
        </div>
      </div>

      <div
        tabIndex={0}
        role="slider"
        aria-label="Revenue by month"
        aria-valuemin={1}
        aria-valuemax={data.length}
        aria-valuenow={(idx ?? 0) + 1}
        aria-valuetext={idx !== null ? `${data[idx].period}: ₹${data[idx].value}K` : 'No month selected'}
        onKeyDown={onKeyDown}
        onBlur={() => setIdx(null)}
        className="rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
      >
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          onMouseLeave={() => setIdx(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const relX = ((e.clientX - rect.left) / rect.width) * w
            const i = Math.round(((relX - 40) / (w - 60)) * (data.length - 1))
            setIdx(i >= 0 && i < data.length ? i : null)
          }}
        >
          <defs>
            <linearGradient id="explorer-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines + y labels */}
          {[0, 0.5, 1].map((t) => {
            const y = h - 30 - t * (h - 80)
            const val = Math.round(min + t * (max - min))
            return (
              <g key={t}>
                <line x1={40} x2={w - 20} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />
                <text x={8} y={y + 4} className="fill-faint" style={{ fontSize: 10 }}>
                  {val}K
                </text>
              </g>
            )
          })}

          <motion.path
            d={area}
            fill="url(#explorer-fill)"
            initial={reduced ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5 }}
          />
          <motion.path
            d={line}
            fill="none"
            stroke="#4f8cff"
            strokeWidth={2.5}
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.7, ease: EASE }}
          />

          {/* interactive markers */}
          {pts.map((p, i) => (
            <g key={p.period}>
              <circle
                cx={p.x}
                cy={p.y}
                r={idx === i ? 5.5 : 3}
                fill={idx === i ? '#06070a' : '#4f8cff'}
                stroke={idx === i ? '#38e1e1' : 'transparent'}
                strokeWidth={2}
                className="transition-all"
              />
              {idx === i && (
                <line
                  x1={p.x}
                  x2={p.x}
                  y1={20}
                  y2={h - 30}
                  stroke="rgba(56,225,225,0.45)"
                  strokeDasharray="3 5"
                />
              )}
              <text
                x={p.x}
                y={h - 12}
                textAnchor="middle"
                className={idx === i ? 'fill-fg' : 'fill-faint'}
                style={{ fontSize: 9 }}
              >
                {p.period}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* screen-reader alternative */}
      <table className="sr-only">
        <caption>Monthly revenue (illustrative sample)</caption>
        <thead>
          <tr>
            <th scope="col">Month</th>
            <th scope="col">Revenue</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.period}>
              <th scope="row">{d.period}</th>
              <td>₹{d.value}K</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
