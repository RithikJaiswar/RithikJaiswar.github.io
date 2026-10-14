import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'framer-motion'
import {
  BarChart3,
  BrainCircuit,
  Database,
  Eraser,
  Gauge,
  MessagesSquare,
  Search,
  type LucideIcon,
} from 'lucide-react'
import { processSteps } from '../../data/site'
import { SectionHeading } from '../ui/SectionHeading'
import { Stagger, StaggerItem } from '../ui/Reveal'
import { cn } from '../../utils/cn'

const icons: Record<string, LucideIcon> = {
  '01': Search,
  '02': Database,
  '03': Eraser,
  '04': BarChart3,
  '05': BrainCircuit,
  '06': Gauge,
  '07': MessagesSquare,
}

/**
 * "How I Work" — the 7-step analysis workflow, laid out horizontally on
 * desktop and stacked on mobile. A scroll-linked progress line fills as
 * the section passes through the viewport.
 */
export function Process() {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 55%'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.4 })

  return (
    <section id="experience" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Experience"
          title={
            <>
              How I <span className="text-gradient-accent">work</span>.
            </>
          }
          description="I'm a fresher without formal work experience yet — so here is the exact process behind every project above, from question to communication."
        />

        <div ref={ref} className="relative mt-14">
          {/* progress rail (desktop) */}
          <div
            className="absolute top-[26px] right-0 left-0 hidden h-px bg-line lg:block"
            aria-hidden="true"
          />
          <motion.div
            className="absolute top-[26px] left-0 hidden h-px origin-left bg-gradient-to-r from-accent via-accent-2 to-accent-3 lg:block"
            style={{ scaleX: reduced ? 1 : progress }}
            aria-hidden="true"
          />

          <Stagger className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-7 lg:gap-3" staggerChildren={0.1}>
            {processSteps.map((step) => {
              const Icon = icons[step.id]
              return (
                <StaggerItem key={step.id}>
                  <article className="group relative flex h-full flex-col rounded-2xl border border-line bg-white/[0.02] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:bg-white/[0.045]">
                    <div className="flex items-center justify-between">
                      <span className="grid h-9 w-9 place-items-center rounded-xl border border-line bg-[#0b0e15] text-accent transition-colors group-hover:border-accent/50 group-hover:bg-accent group-hover:text-ink">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <span className="font-mono text-[0.7rem] font-semibold text-faint transition-colors group-hover:text-accent-2">
                        {step.id}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[0.95rem] font-semibold text-fg">{step.title}</h3>
                    <p className="mt-1.5 text-[0.76rem] leading-relaxed text-muted">{step.text}</p>
                  </article>
                </StaggerItem>
              )
            })}
          </Stagger>

          {/* mobile step indicator */}
          <p className={cn('mt-4 text-center font-mono text-[0.65rem] text-faint lg:hidden')}>
            01 → 07 • Understand to Communicate
          </p>
        </div>
      </div>
    </section>
  )
}
