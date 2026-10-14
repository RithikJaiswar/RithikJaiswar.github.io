import { Download, Github, Linkedin } from 'lucide-react'
import { contact } from '../../data/site'
import { Button } from '../ui/Button'
import { Reveal } from '../ui/Reveal'

export function ResumeCTA() {
  return (
    <section aria-labelledby="resume-cta-title" className="relative py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] px-6 py-12 text-center sm:px-12 sm:py-16">
            {/* soft accents */}
            <div
              className="pointer-events-none absolute -top-32 left-1/4 h-64 w-64 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(79,140,255,0.22),transparent_70%)] blur-3xl"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -right-20 -bottom-24 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.18),transparent_70%)] blur-3xl"
              aria-hidden="true"
            />

            <p className="font-mono text-[0.7rem] tracking-[0.28em] text-accent-2 uppercase">
              Resume
            </p>
            <h2
              id="resume-cta-title"
              className="mx-auto mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-[2.6rem] lg:leading-[1.15]"
            >
              Let&apos;s build something useful with data.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              I&apos;m actively looking for entry-level opportunities in Data Analytics, Data Science,
              AI/ML, and Generative AI.
            </p>

            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Button
                href={contact.resume}
                size="lg"
                external
                icon={<Download className="h-4 w-4" aria-hidden="true" />}
              >
                Download Resume
              </Button>
              <Button
                href={contact.github}
                variant="outline"
                size="lg"
                external
                icon={<Github className="h-4 w-4" aria-hidden="true" />}
              >
                View GitHub
              </Button>
              <Button
                href={contact.linkedin}
                variant="outline"
                size="lg"
                external
                icon={<Linkedin className="h-4 w-4" aria-hidden="true" />}
              >
                Connect on LinkedIn
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
