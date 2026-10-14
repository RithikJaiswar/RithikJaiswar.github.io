import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { skillCategories, type SkillCategory } from '../../data/skills'
import { SectionHeading } from '../ui/SectionHeading'
import { Stagger, StaggerItem } from '../ui/Reveal'
import { cn } from '../../utils/cn'
import { EASE } from '../../utils/animations'

const accentStyles: Record<SkillCategory['accent'], { chip: string; glow: string; text: string }> = {
  blue: {
    chip: 'text-accent border-accent/30 bg-accent/10',
    glow: 'shadow-[0_18px_50px_-24px_rgba(79,140,255,0.7)]',
    text: 'text-accent',
  },
  cyan: {
    chip: 'text-accent-2 border-accent-2/30 bg-accent-2/10',
    glow: 'shadow-[0_18px_50px_-24px_rgba(56,225,225,0.65)]',
    text: 'text-accent-2',
  },
  violet: {
    chip: 'text-accent-3 border-accent-3/30 bg-accent-3/10',
    glow: 'shadow-[0_18px_50px_-24px_rgba(139,92,246,0.7)]',
    text: 'text-accent-3',
  },
}

function SkillCard({ category }: { category: SkillCategory }) {
  const [open, setOpen] = useState<string | null>(null)
  const reduced = useReducedMotion()
  const styles = accentStyles[category.accent]
  const Icon = category.icon

  return (
    <article
      className={cn(
        'glass group relative flex h-full flex-col rounded-3xl p-6 transition-all duration-400',
        'hover:-translate-y-1.5 hover:border-white/[0.16]',
        styles.glow,
      )}
    >
      {/* icon + title */}
      <div className="flex items-center gap-3">
        <span
          className={cn(
            'grid h-10 w-10 place-items-center rounded-xl border transition-transform duration-400',
            'group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:rotate-3',
            styles.chip,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <h3 className="text-base font-semibold tracking-tight text-fg">{category.title}</h3>
      </div>

      <p className="mt-3 text-[0.85rem] leading-relaxed text-muted">{category.blurb}</p>

      <ul className="mt-5 flex flex-wrap gap-2">
        {category.skills.map((skill) => {
          const isOpen = open === skill.name
          return (
            <li key={skill.name} className="relative">
              <button
                type="button"
                onMouseEnter={() => setOpen(skill.name)}
                onMouseLeave={() => setOpen(null)}
                onFocus={() => setOpen(skill.name)}
                onBlur={() => setOpen(null)}
                onClick={() => setOpen(isOpen ? null : skill.name)}
                aria-describedby={isOpen ? `tip-${category.id}-${skill.name.replace(/\s+/g, '-')}` : undefined}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-[0.78rem] transition-all duration-200',
                  isOpen
                    ? 'border-white/[0.22] bg-white/[0.08] text-fg'
                    : 'border-line bg-white/[0.03] text-muted hover:border-line-strong hover:text-fg',
                )}
              >
                {skill.name}
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.span
                    id={`tip-${category.id}-${skill.name.replace(/\s+/g, '-')}`}
                    role="tooltip"
                    initial={reduced ? false : { opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={reduced ? { opacity: 0 } : { opacity: 0, y: 4, scale: 0.98 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="absolute bottom-full left-1/2 z-30 mb-2 w-56 -translate-x-1/2 rounded-xl border border-line-strong bg-[#0d111a] px-3 py-2 text-left text-[0.75rem] leading-snug text-fg shadow-2xl"
                  >
                    {skill.hint}
                    <span
                      className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-line-strong bg-[#0d111a]"
                      aria-hidden="true"
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function Skills() {
  return (
    <section id="skills" className="section-pad relative">
      {/* faint grid backdrop */}
      <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Skills"
          title={
            <>
              The toolkit behind the <span className="text-gradient">work</span>.
            </>
          }
          description="Hover (or tap) any skill to see what I actually do with it — no subjective percentage bars."
        />

        <Stagger className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerChildren={0.09}>
          {skillCategories.map((category) => (
            <StaggerItem key={category.id} className="h-full">
              <SkillCard category={category} />
            </StaggerItem>
          ))}

          {/* closing tile — quick callout instead of an empty grid cell */}
          <StaggerItem className="h-full">
            <div className="flex h-full flex-col justify-between rounded-3xl border border-dashed border-line bg-white/[0.015] p-6">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.28em] text-accent uppercase">
                  Always learning
                </p>
                <p className="mt-3 text-lg leading-snug font-semibold text-fg">
                  Experimenting with agents, evaluation pipelines and decision-focused dashboards.
                </p>
              </div>
              <p className="mt-6 font-mono text-[0.7rem] text-faint">
                Python · SQL · Scikit-learn · LangChain · Power BI
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
