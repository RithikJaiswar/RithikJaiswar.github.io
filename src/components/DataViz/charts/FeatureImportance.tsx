import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { EASE } from '../../../utils/animations'

const features = [
  { name: 'Age', value: 0.92 },
  { name: 'Max heart rate', value: 0.84 },
  { name: 'Chest pain type', value: 0.77 },
  { name: 'ST depression', value: 0.68 },
  { name: 'Cholesterol', value: 0.54 },
  { name: 'Resting BP', value: 0.41 },
]

/**
 * Feature contribution view for the heart-disease model.
 * Ranking is illustrative of the evaluation notebook's analysis —
 * the only published numbers remain 86.41% accuracy / 0.88 F1.
 */
export function FeatureImportance() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const reduced = useReducedMotion()

  return (
    <div ref={ref} className="rounded-3xl border border-line bg-white/[0.02] p-5 sm:p-6">
      <p className="font-mono text-[0.62rem] tracking-[0.26em] text-accent-2 uppercase">
        Feature contribution
      </p>
      <p className="mt-1 text-sm text-muted">Relative influence in the winning model.</p>

      <ul className="mt-5 space-y-3">
        {features.map((f, i) => (
          <li key={f.name} className="flex items-center gap-3">
            <span className="w-28 shrink-0 truncate text-[0.78rem] text-muted">{f.name}</span>
            <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.span
                className="block h-full rounded-full bg-gradient-to-r from-accent via-accent-2 to-accent-3"
                initial={reduced ? false : { width: 0 }}
                animate={inView ? { width: `${f.value * 100}%` } : {}}
                transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.1 }}
              />
            </span>
            <span className="w-9 shrink-0 text-right font-mono text-[0.7rem] text-faint">
              {(f.value * 100).toFixed(0)}
            </span>
          </li>
        ))}
      </ul>

      <p className="mt-4 text-[0.68rem] leading-relaxed text-faint">
        Illustrative ranking of feature influence from the evaluation notebook — reported metrics are
        86.41% accuracy and 0.88 F1.
      </p>
    </div>
  )
}
