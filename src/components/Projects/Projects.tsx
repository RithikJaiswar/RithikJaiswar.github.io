import { useState } from 'react'
import { projects, type Project } from '../../data/projects'
import { SectionHeading } from '../ui/SectionHeading'
import { Stagger, StaggerItem } from '../ui/Reveal'
import { ProjectCard } from './ProjectCard'
import { ProjectModal } from './ProjectModal'

export function Projects() {
  const [open, setOpen] = useState<Project | null>(null)

  return (
    <section id="projects" className="section-pad relative">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Featured projects"
          title={
            <>
              Real problems, end-to-end <span className="text-gradient">data &amp; AI</span> solutions.
            </>
          }
          description="Each project runs the full path from raw data to a usable outcome — analysis, modelling, evaluation and communication. Open any card for the full breakdown."
        />

        <Stagger className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2" staggerChildren={0.1}>
          {projects.map((project) => (
            <StaggerItem key={project.id} className="h-full">
              <ProjectCard project={project} onOpen={() => setOpen(project)} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  )
}
