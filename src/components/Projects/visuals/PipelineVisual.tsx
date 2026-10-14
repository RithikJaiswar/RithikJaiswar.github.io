import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Check } from 'lucide-react'
import { pipelineSteps } from '../../../data/projects'
import { EASE } from '../../../utils/animations'
import { cn } from '../../../utils/cn'

/**
 * RAG pipeline for the AI Video Summarizer:
 * Video → Audio → Transcription → Chunking → Embeddings → Vector Store → RAG → AI Summary
 * Animates in sequence and lets the user focus a stage to read its responsibility.
 */
export function PipelineVisual() {
  const reduced = useReducedMotion()

  return (
    <div className="rounded-2xl border border-line bg-white/[0.02] p-4">
      <p className="font-mono text-[0.6rem] tracking-[0.2em] text-faint uppercase">
        Retrieval pipeline
      </p>

      <ol className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {pipelineSteps.map((step, i) => (
          <motion.li
            key={step.id}
            initial={reduced ? false : { opacity: 0, y: 14, filter: 'blur(4px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, ease: EASE, delay: i * 0.12 }}
            className="group relative rounded-xl border border-line bg-[#0b0e14] p-3 transition-all duration-300 hover:border-accent/40 hover:bg-white/[0.04]"
            tabIndex={0}
          >
            <div className="flex items-center gap-2">
              <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-accent/40 bg-accent/10 text-[0.6rem] font-semibold text-accent transition-colors group-hover:bg-accent group-hover:text-ink">
                {i + 1}
              </span>
              <p className="truncate text-[0.8rem] font-medium text-fg">{step.label}</p>
              {i === pipelineSteps.length - 1 && (
                <Check className="ml-auto h-3.5 w-3.5 text-accent-2" aria-hidden="true" />
              )}
            </div>
            <p className="mt-1.5 text-[0.66rem] leading-snug text-muted opacity-80 transition-opacity group-hover:opacity-100">
              {step.role}
            </p>

            {/* connector */}
            {i < pipelineSteps.length - 1 && (
              <ArrowRight
                className={cn(
                  'absolute top-1/2 -right-[13px] hidden h-3.5 w-3.5 -translate-y-1/2 text-faint lg:block',
                  (i + 1) % 4 !== 0 && 'lg:block',
                )}
                aria-hidden="true"
              />
            )}
          </motion.li>
        ))}
      </ol>

      <p className="mt-3 text-[0.62rem] text-faint">
        Each stage is deterministic: the summary is generated only from retrieved transcript context.
      </p>
    </div>
  )
}
