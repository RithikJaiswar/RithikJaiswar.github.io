import { Hero } from '../components/Hero/Hero'
import { About } from '../components/About/About'
import { Skills } from '../components/Skills/Skills'
import { Projects } from '../components/Projects/Projects'
import { DataVisualization } from '../components/DataViz/DataVisualization'
import { Process } from '../components/Process/Process'
import { ResumeCTA } from '../components/ResumeCTA/ResumeCTA'
import { Contact } from '../components/Contact/Contact'

export function Home() {
  return (
    <main id="main-content">
      <Hero />
      <About />
      <Skills />
      <Projects />
      <DataVisualization />
      <Process />
      <ResumeCTA />
      <Contact />
    </main>
  )
}
