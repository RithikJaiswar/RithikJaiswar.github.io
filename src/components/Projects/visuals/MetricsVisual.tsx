import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { Counter } from '../../ui/Counter'
import { EASE } from '../../../utils/animations'

const ACCURACY = 86.41
const F1 = 0.88
const MODELS = ['Logistic Regression', 'Decision Tree', 'SVM', 'KNN', 'Naive Bayes']

/**
 * Interactive metrics panel for the Heart Disease project.
 * Only the published results are shown (86.41% accuracy, 0.88 F1) —
 * no fabricated per-model numbers.
 */
export function MetricsVisual() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const reduced = useReducedMotion()

  const r = 52
  const circumference = 2 * Math.PI * r

  return (
    <div ref={ref} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {/* accuracy gauge */}
      <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
        <p className="font-mono text-[0.6rem] tracking-[0.2em] text-faint uppercase">
          Logistic Regression accuracy
        </p>
        <div className="mt-2 flex items-center gap-4">
          <div className="relative h-28 w-28 shrink-0">
          <svg viewBox="0 0 130 130" className="h-28 w-28" role="img" aria-label="Model accuracy 86.41 percent">
            <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth="10" />
            <motion.circle
              cx="65"
              cy="65"
              r={r}
              fill="none"
              stroke="url(#acc-grad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={reduced ? false : { strokeDashoffset: circumference }}
              animate={inView ? { strokeDashoffset: circumference * (1 - ACCURACY / 100) } : {}}
              transition={{ duration: 1.6, ease: EASE, delay: 0.25 }}
              transform="rotate(-90 65 65)"
            />
            <defs>
              <linearGradient id="acc-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4f8cff" />
                <stop offset="100%" stopColor="#38e1e1" />
              </linearGradient>
            </defs>
          </svg>
          <span className="absolute inset-0 grid place-items-center text-xl font-semibold text-fg">
            <Counter value={ACCURACY} decimals={2} suffix="%" duration={1.6} />
          </span>
          </div>
          <div className="space-y-2 text-[0.74rem] text-muted">
            <p className="flex items-center justify-between gap-3">
              <span>F1 Score</span>
              <span className="font-mono font-semibold text-fg">
                <Counter value={F1} decimals={2} duration={1.4} />
              </span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span>Models compared</span>
              <span className="font-mono font-semibold text-fg">{MODELS.length}</span>
            </p>
            <p className="flex items-center justify-between gap-3">
              <span>Validation</span>
              <span className="font-mono font-semibold text-fg">k-fold CV</span>
            </p>
          </div>
        </div>
      </div>

      {/* F1 + model list */}
      <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
        <p className="font-mono text-[0.6rem] tracking-[0.2em] text-faint uppercase">F1 score</p>
        <div className="mt-3">
          <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-accent-3 to-accent"
              initial={reduced ? false : { width: 0 }}
              animate={inView ? { width: `${F1 * 100}%` } : {}}
              transition={{ duration: 1.3, ease: EASE, delay: 0.4 }}
            />
          </div>
          <p className="mt-1.5 font-mono text-[0.66rem] text-faint">0.88 / 1.00</p>
        </div>

        <ul className="mt-4 space-y-1.5">
          {MODELS.map((model, i) => {
            const best = model === 'Logistic Regression'
            return (
              <motion.li
                key={model}
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.45, delay: 0.5 + i * 0.09 }}
                className={`flex items-center justify-between gap-3 rounded-lg border px-3 py-1.5 text-[0.74rem] transition-colors ${
                  best
                    ? 'border-accent/40 bg-accent/10 text-fg'
                    : 'border-line bg-white/[0.02] text-muted'
                }`}
              >
                <span>{model}</span>
                <span className={best ? 'font-mono text-accent' : 'font-mono text-faint'}>
                  {best ? 'BEST' : '—'}
                </span>
              </motion.li>
            )
          })}
        </ul>
      </div>

      <p className="text-[0.62rem] leading-relaxed text-faint sm:col-span-2">
        Reported results: Logistic Regression — 86.41% accuracy, 0.88 F1. Other models were compared
        during evaluation; their individual metrics are not published here.
      </p>
    </div>
  )
}
