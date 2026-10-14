import { useRef } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { GraduationCap, MapPin, Target, User } from 'lucide-react'
import { education, profile } from '../../data/site'
import { projects } from '../../data/projects'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal } from '../ui/Reveal'
import { Counter } from '../ui/Counter'
import { EASE } from '../../utils/animations'
import { cn } from '../../utils/cn'

const quickFacts = [
  { icon: MapPin, label: 'Based in', value: profile.location },
  { icon: Target, label: 'Focus', value: 'Data + AI' },
  { icon: User, label: 'Status', value: 'Fresher • Open to work' },
]

const stats = [
  { value: projects.length, label: 'Featured projects', suffix: '' },
  { value: 5, label: 'ML models compared', suffix: '' },
  { value: 2, label: 'Degrees completed', suffix: '' },
]

export function About() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const timelineInView = useInView(timelineRef, { once: true, margin: '-80px' })
  const reduced = useReducedMotion()

  return (
    <section id="about" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
          {/* ------------------------------ intro ------------------------------ */}
          <div>
            <SectionHeading
              eyebrow="About"
              title={
                <>
                  A fresher who turns raw data into{' '}
                  <span className="text-gradient-accent">decisions people can act on</span>.
                </>
              }
            />

            <Reveal delay={0.1}>
              <div className="mt-6 space-y-4 text-[0.97rem] leading-relaxed text-muted">
                <p>
                  I&apos;m Rithik Jaiswar — currently completing my Master of Computer Application while
                  building end-to-end data projects: SQL analysis, dashboards, machine learning models
                  and Generative AI applications.
                </p>
                <p>{profile.summaryLong}</p>
                <p className="text-fg/85">
                  My goal is an entry-level role where analytics, machine learning and modern AI meet
                  real business problems.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.16}>
              <dl className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {quickFacts.map((fact) => (
                  <div
                    key={fact.label}
                    className="glass rounded-xl px-4 py-3.5 transition-colors hover:border-line-strong"
                  >
                    <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] tracking-[0.2em] text-faint uppercase">
                      <fact.icon className="h-3 w-3" aria-hidden="true" />
                      {fact.label}
                    </dt>
                    <dd className="mt-1.5 text-sm font-medium text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          {/* --------------------------- stats panel --------------------------- */}
          <div className="lg:pt-14">
            <Reveal delay={0.08}>
              <div className="glass relative overflow-hidden rounded-3xl p-6 sm:p-8">
                <div
                  className="pointer-events-none absolute -top-24 -right-20 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.18),transparent_70%)] blur-2xl"
                  aria-hidden="true"
                />
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-mono text-[0.68rem] tracking-[0.26em] text-accent-2 uppercase">
                    Profile at a glance
                  </h3>
                  <GraduationCap className="h-4 w-4 text-faint" aria-hidden="true" />
                </div>

                <div className="mt-6 grid grid-cols-3 gap-4">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        <Counter value={stat.value} suffix={stat.suffix} />
                      </p>
                      <p className="mt-1 text-[0.72rem] leading-tight text-muted">{stat.label}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 space-y-3 border-t border-line pt-6">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-xs text-muted">Roles targeted</span>
                    <span className="text-right text-xs font-medium text-fg">
                      Data Analyst · Data Scientist · AI/ML · GenAI
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-xs text-muted">Core stack</span>
                    <span className="text-right font-mono text-xs font-medium text-fg">
                      Python · SQL · Scikit-learn · Power BI · LangChain
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="text-xs text-muted">Approach</span>
                    <span className="text-right text-xs font-medium text-fg">
                      Baselines first · validate honestly · communicate clearly
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------ timeline ------------------------------ */}
        <div ref={timelineRef} className="mt-16 lg:mt-20">
          <Reveal>
            <div className="mb-8 flex items-center gap-4">
              <h3 className="font-mono text-[0.68rem] tracking-[0.26em] text-accent-2 uppercase">
                Education journey
              </h3>
              <span className="h-px flex-1 bg-line" aria-hidden="true" />
            </div>
          </Reveal>

          <div className="relative overflow-x-auto pb-4 no-scrollbar">
            <div className="relative min-w-[46rem] px-1">
              {/* track */}
              <div className="absolute top-[7px] right-0 left-0 h-px bg-line" aria-hidden="true" />
              <motion.div
                className="absolute top-[7px] left-0 h-px bg-gradient-to-r from-accent via-accent-2 to-accent-3"
                initial={{ scaleX: 0 }}
                animate={timelineInView && !reduced ? { scaleX: 1 } : { scaleX: timelineInView ? 1 : 0 }}
                style={{ transformOrigin: 'left' }}
                transition={{ duration: 1.4, ease: EASE }}
                aria-hidden="true"
              />

              <ol className="relative grid grid-cols-3 gap-8">
                {[...education].reverse().map((item, i) => (
                  <li key={item.degree} className="pt-0">
                    <motion.div
                      initial={reduced ? false : { opacity: 0, y: 18 }}
                      animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.6, ease: EASE, delay: 0.25 + i * 0.25 }}
                    >
                      {/* node */}
                      <span
                        className="mb-5 block h-3.5 w-3.5 rounded-full border-2 border-accent bg-ink shadow-[0_0_0_4px_rgba(79,140,255,0.15)]"
                        aria-hidden="true"
                      />
                      <p className="font-mono text-xs font-semibold tracking-widest text-accent">
                        {item.period}
                      </p>
                      <h4 className="mt-2 text-lg font-semibold text-fg">{item.degree}</h4>
                      <p className="mt-1 text-sm text-muted">{item.school}</p>
                      <p className="mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-faint">
                        {item.focus}
                      </p>
                    </motion.div>
                  </li>
                ))}
                {/* current marker */}
                <li className="pt-0">
                  <motion.div
                    initial={reduced ? false : { opacity: 0, y: 18 }}
                    animate={timelineInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, ease: EASE, delay: 0.75 }}
                  >
                    <span
                      className="mb-5 block h-3.5 w-3.5 rounded-full border-2 border-accent-2 bg-ink shadow-[0_0_0_4px_rgba(56,225,225,0.15)]"
                      aria-hidden="true"
                    />
                    <p className="font-mono text-xs font-semibold tracking-widest text-accent-2">NOW</p>
                    <h4 className="mt-2 text-lg font-semibold text-fg">Building &amp; applying</h4>
                    <p className="mt-1 text-sm text-muted">Data + AI projects</p>
                    <p className={cn('mt-2.5 max-w-xs text-[0.82rem] leading-relaxed text-faint')}>
                      Shipping analytics, ML and GenAI projects while interviewing for entry-level
                      Data &amp; AI roles.
                    </p>
                  </motion.div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
