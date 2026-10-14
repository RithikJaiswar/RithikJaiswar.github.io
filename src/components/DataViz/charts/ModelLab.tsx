import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Info } from 'lucide-react'
import { EASE } from '../../../utils/animations'
import { cn } from '../../../utils/cn'

const ACCURACY = 86.41
const F1 = 0.88

type ModelInfo = {
  name: string
  type: string
  note: string
  accuracy: number | null
  f1: number | null
}

const models: ModelInfo[] = [
  {
    name: 'Logistic Regression',
    type: 'Linear classifier',
    note: 'Best performing model — chosen for its accuracy and interpretability.',
    accuracy: ACCURACY,
    f1: F1,
  },
  {
    name: 'Decision Tree',
    type: 'Tree-based classifier',
    note: 'Compared during evaluation; captures non-linear splits with clear rules.',
    accuracy: null,
    f1: null,
  },
  {
    name: 'SVM',
    type: 'Margin-based classifier',
    note: 'Compared during evaluation; strong on high-dimensional feature spaces.',
    accuracy: null,
    f1: null,
  },
  {
    name: 'KNN',
    type: 'Instance-based classifier',
    note: 'Compared during evaluation; distance-driven neighbourhood voting.',
    accuracy: null,
    f1: null,
  },
  {
    name: 'Naive Bayes',
    type: 'Probabilistic classifier',
    note: 'Compared during evaluation; fast probabilistic baseline.',
    accuracy: null,
    f1: null,
  },
]

/**
 * Model selector: switching the model updates the metrics panel.
 * Only Logistic Regression has published metrics — the others are shown
 * honestly as "not published" rather than fabricated.
 */
export function ModelLab() {
  const [selected, setSelected] = useState(0)
  const reduced = useReducedMotion()
  const model = models[selected]

  return (
    <div className="rounded-3xl border border-line bg-white/[0.02] p-5 sm:p-6">
      <p className="font-mono text-[0.62rem] tracking-[0.26em] text-accent-2 uppercase">
        Model performance
      </p>
      <p className="mt-1 text-sm text-muted">Select a model to inspect its reported metrics.</p>

      {/* selector */}
      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Select a classification model">
        {models.map((m, i) => (
          <button
            key={m.name}
            type="button"
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[0.74rem] transition-all duration-200',
              selected === i
                ? 'border-accent/60 bg-accent/15 text-fg shadow-[0_8px_24px_-12px_rgba(79,140,255,0.8)]'
                : 'border-line bg-white/[0.02] text-muted hover:border-line-strong hover:text-fg',
            )}
          >
            {m.name}
          </button>
        ))}
      </div>

      {/* detail panel */}
      <motion.div
        key={model.name}
        initial={reduced ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mt-5 rounded-2xl border border-line bg-[#0b0e15] p-5"
        aria-live="polite"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-fg">{model.name}</h3>
            <p className="font-mono text-[0.68rem] text-faint">{model.type}</p>
          </div>
          {model.accuracy !== null && (
            <span className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-[0.62rem] tracking-widest text-accent">
              BEST MODEL
            </span>
          )}
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
            <dt className="font-mono text-[0.56rem] tracking-widest text-faint uppercase">Accuracy</dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-fg">
              {model.accuracy !== null ? `${model.accuracy.toFixed(2)}%` : '—'}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
            <dt className="font-mono text-[0.56rem] tracking-widest text-faint uppercase">F1 Score</dt>
            <dd className="mt-1 font-mono text-xl font-semibold text-fg">
              {model.f1 !== null ? model.f1.toFixed(2) : '—'}
            </dd>
          </div>
          <div className="rounded-xl border border-line bg-white/[0.02] px-3 py-2.5">
            <dt className="font-mono text-[0.56rem] tracking-widest text-faint uppercase">Status</dt>
            <dd className="mt-1 text-[0.9rem] font-semibold text-fg">
              {model.accuracy !== null ? 'Reported' : 'Not published'}
            </dd>
          </div>
        </dl>

        {/* accuracy bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-[0.68rem] text-muted">
            <span>Reported accuracy</span>
            <span className="font-mono">{model.accuracy !== null ? `${model.accuracy}%` : 'n/p'}</span>
          </div>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/[0.06]">
            {model.accuracy !== null ? (
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-accent to-accent-2"
                initial={reduced ? false : { width: 0 }}
                animate={{ width: `${model.accuracy}%` }}
                transition={{ duration: 1, ease: EASE }}
              />
            ) : (
              <div
                className="h-full w-full rounded-full opacity-40"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(135deg, rgba(255,255,255,0.16) 0 6px, transparent 6px 12px)',
                }}
              />
            )}
          </div>
        </div>

        <p className="mt-4 flex items-start gap-2 text-[0.76rem] leading-relaxed text-muted">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden="true" />
          {model.note}
          {model.accuracy === null &&
            ' Individual metrics for this model are intentionally not published.'}
        </p>
      </motion.div>
    </div>
  )
}
