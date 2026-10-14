import { useRef, useState } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { demoCharts } from '../../../data/projects'
import { EASE } from '../../../utils/animations'

/**
 * Stock-style chart: actual history vs model prediction.
 * Hovering the chart shows a tooltip for the nearest point.
 */
export function StockVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()
  const [hover, setHover] = useState<number | null>(null)

  const actual = demoCharts.stock
  const predicted = demoCharts.stockPredicted
  const w = 560
  const h = 200
  const all = [...actual, ...predicted]
  const max = Math.max(...all)
  const min = Math.min(...all)

  const toPoints = (series: readonly number[]) =>
    series.map((v, i) => {
      const x = (i / (series.length - 1)) * (w - 30) + 20
      const y = h - 26 - ((v - min) / (max - min)) * (h - 52)
      return { x, y, v }
    })

  const actualPts = toPoints(actual)
  const predPts = toPoints(predicted)

  const toPath = (pts: readonly { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const actualPath = toPath(actualPts)
  const predPath = toPath(predPts)
  const areaPath = `${actualPath} L${actualPts[actualPts.length - 1].x},${h - 14} L${actualPts[0].x},${h - 14} Z`

  return (
    <div ref={ref} className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-[0.6rem] tracking-[0.2em] text-faint uppercase">
          Historical price vs predicted trend
        </p>
        <div className="flex items-center gap-4 text-[0.66rem]">
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-0.5 w-4 rounded bg-accent-2" aria-hidden="true" /> Actual
          </span>
          <span className="flex items-center gap-1.5 text-muted">
            <span className="h-0.5 w-4 rounded bg-accent-3" aria-hidden="true" /> Predicted
          </span>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${w} ${h}`}
          className="w-full"
          role="img"
          aria-label="Line chart comparing historical price with predicted trend"
          onMouseLeave={() => setHover(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const relX = ((e.clientX - rect.left) / rect.width) * w
            const idx = Math.round(((relX - 20) / (w - 30)) * (actual.length - 1))
            setHover(idx >= 0 && idx < actual.length ? idx : null)
          }}
        >
          <defs>
            <linearGradient id="stock-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38e1e1" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#38e1e1" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0.2, 0.4, 0.6, 0.8].map((t) => (
            <line
              key={t}
              x1={10}
              x2={w - 10}
              y1={h * t}
              y2={h * t}
              stroke="rgba(255,255,255,0.055)"
            />
          ))}

          <motion.path
            d={areaPath}
            fill="url(#stock-fill)"
            initial={reduced ? false : { opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.9 }}
          />
          <motion.path
            d={predPath}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="6 5"
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
          />
          <motion.path
            d={actualPath}
            fill="none"
            stroke="#38e1e1"
            strokeWidth={2.4}
            strokeLinecap="round"
            initial={reduced ? false : { pathLength: 0 }}
            animate={inView ? { pathLength: 1 } : {}}
            transition={{ duration: 1.8, ease: EASE, delay: 0.2 }}
          />

          {hover !== null && (
            <g>
              <line
                x1={actualPts[hover].x}
                x2={actualPts[hover].x}
                y1={14}
                y2={h - 14}
                stroke="rgba(255,255,255,0.2)"
                strokeDasharray="3 4"
              />
              <circle cx={actualPts[hover].x} cy={actualPts[hover].y} r={4.5} fill="#06070a" stroke="#38e1e1" strokeWidth={2} />
              <circle cx={predPts[hover].x} cy={predPts[hover].y} r={3.5} fill="#06070a" stroke="#8b5cf6" strokeWidth={2} />
            </g>
          )}

          <text x={20} y={h - 3} className="fill-faint" style={{ fontSize: 10 }}>
            T₀
          </text>
          <text x={w - 40} y={h - 3} className="fill-faint" style={{ fontSize: 10 }}>
            Tₙ
          </text>
        </svg>

        {/* tooltip */}
        <div
          className={`pointer-events-none absolute top-2 rounded-lg border border-line-strong bg-[#0d111a] px-2.5 py-1.5 text-[0.66rem] shadow-xl transition-opacity ${
            hover !== null ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: hover !== null ? `${(actualPts[hover].x / w) * 100}%` : '0%',
            transform: 'translateX(-50%)',
          }}
          aria-hidden="true"
        >
          <p className="font-mono text-fg">
            {hover !== null ? `Day ${hover + 1}` : ''}
          </p>
          <p className="text-accent-2">
            {hover !== null ? `Actual  $${actual[hover]}` : ''}
          </p>
          <p className="text-accent-3">
            {hover !== null ? `Predicted  $${predicted[hover]}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {[
          { k: 'Approaches', v: 'ML vs LSTM' },
          { k: 'Split', v: 'Chronological' },
          { k: 'Output', v: 'Direction only' },
        ].map((m) => (
          <div key={m.k} className="rounded-xl border border-line bg-white/[0.02] px-3 py-2">
            <p className="font-mono text-[0.58rem] tracking-widest text-faint uppercase">{m.k}</p>
            <p className="mt-0.5 text-[0.78rem] font-medium text-fg">{m.v}</p>
          </div>
        ))}
      </div>

      <p className="mt-3 flex items-start gap-2 rounded-xl border border-accent-3/30 bg-accent-3/[0.07] px-3 py-2 text-[0.7rem] text-accent-3">
        <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <strong className="font-semibold">For educational purposes only — not financial advice.</strong>
        {' '}Curve shapes are illustrative of the model-comparison notebook.
      </p>
    </div>
  )
}
