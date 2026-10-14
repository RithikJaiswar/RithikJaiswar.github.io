import { useState } from 'react'
import { Info } from 'lucide-react'

type Cell = {
  row: string
  col: string
  value: number
  label: string
  text: string
}

/**
 * Normalised confusion matrix layout — percentages per actual class,
 * consistent with the reported 86.41% accuracy. Hover/focus a cell to
 * read what it means.
 */
const cells: Cell[] = [
  {
    row: 'Actual: No',
    col: 'Predicted: No',
    value: 87,
    label: 'True Negative',
    text: 'Correctly identified patients without heart disease.',
  },
  {
    row: 'Actual: No',
    col: 'Predicted: Yes',
    value: 13,
    label: 'False Positive',
    text: 'Healthy patients incorrectly flagged as at risk.',
  },
  {
    row: 'Actual: Yes',
    col: 'Predicted: No',
    value: 14,
    label: 'False Negative',
    text: 'At-risk patients missed by the model — the costly error.',
  },
  {
    row: 'Actual: Yes',
    col: 'Predicted: Yes',
    value: 86,
    label: 'True Positive',
    text: 'Correctly identified patients with heart disease.',
  },
]

export function ConfusionMatrix() {
  const [active, setActive] = useState<Cell | null>(null)

  return (
    <div className="rounded-3xl border border-line bg-white/[0.02] p-5 sm:p-6">
      <p className="font-mono text-[0.62rem] tracking-[0.26em] text-accent-2 uppercase">
        Confusion matrix
      </p>
      <p className="mt-1 text-sm text-muted">Hover a cell to see what it means.</p>

      <div className="mt-5 grid grid-cols-[auto_1fr_1fr] gap-2 text-center">
        <div />
        <p className="font-mono text-[0.6rem] tracking-widest text-faint uppercase">Pred. No</p>
        <p className="font-mono text-[0.6rem] tracking-widest text-faint uppercase">Pred. Yes</p>

        {['Actual: No', 'Actual: Yes'].map((rowLabel, r) => (
          <div key={rowLabel} className="contents">
            <p className="flex items-center pr-1 font-mono text-[0.6rem] tracking-widest whitespace-nowrap text-faint uppercase">
              {rowLabel}
            </p>
            {cells.slice(r * 2, r * 2 + 2).map((cell) => {
              const good = cell.label.startsWith('True')
              const isActive = active?.label === cell.label && active?.row === cell.row
              return (
                <button
                  key={cell.label}
                  type="button"
                  onMouseEnter={() => setActive(cell)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(cell)}
                  onBlur={() => setActive(null)}
                  aria-label={`${cell.row}, ${cell.col}: ${cell.value}% — ${cell.label}`}
                  className={`rounded-xl border px-3 py-5 transition-all duration-200 ${
                    good
                      ? 'border-accent-2/30 bg-accent-2/12 hover:border-accent-2/60'
                      : 'border-accent-3/30 bg-accent-3/12 hover:border-accent-3/60'
                  } ${isActive ? 'scale-[1.03] shadow-lg' : ''}`}
                >
                  <span className={`block font-mono text-2xl font-semibold ${good ? 'text-accent-2' : 'text-accent-3'}`}>
                    {cell.value}%
                  </span>
                  <span className="mt-0.5 block text-[0.62rem] text-muted">{cell.label}</span>
                </button>
              )
            })}
          </div>
        ))}
      </div>

      <p className="mt-4 flex items-start gap-2 text-[0.74rem] leading-relaxed text-muted" aria-live="polite">
        <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-faint" aria-hidden="true" />
        {active ? (
          <>
            <span className="text-fg">{active.label}</span> — {active.text}
          </>
        ) : (
          <>
            Normalised layout (%) consistent with the reported{' '}
            <span className="font-mono text-fg">86.41%</span> accuracy.
          </>
        )}
      </p>
    </div>
  )
}
