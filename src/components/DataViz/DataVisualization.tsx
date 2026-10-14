import { Suspense, lazy } from 'react'
import { SectionHeading } from '../ui/SectionHeading'
import { Reveal, Stagger, StaggerItem } from '../ui/Reveal'

// Floating 3D datasets pull in the Three.js runtime — keep them lazy.
const DataObjectsCanvas = lazy(() =>
  import('./DataObjectsCanvas').then((m) => ({ default: m.DataObjectsCanvas })),
)
import { RevenueExplorer } from './charts/RevenueExplorer'
import { SegmentChart } from './charts/SegmentChart'
import { ModelLab } from './charts/ModelLab'
import { ConfusionMatrix } from './charts/ConfusionMatrix'
import { FeatureImportance } from './charts/FeatureImportance'

/**
 * "I Speak Data." — a dedicated, visually distinct section proving
 * data literacy: interactive charts, not screenshots.
 */
export function DataVisualization() {
  return (
    <section id="data-viz" className="section-pad relative overflow-hidden">
      {/* floating 3D datasets behind the header */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[26rem]" aria-hidden="true">
        <Suspense fallback={null}>
          <DataObjectsCanvas />
        </Suspense>
      </div>

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="Data visualization"
          title={
            <>
              I Speak <span className="text-gradient">Data.</span>
            </>
          }
          description="Charts I build for projects — interactive, honest about what is measured, and readable at a glance. Hover the charts; switch the models."
          align="center"
        />

        <Stagger className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3" staggerChildren={0.08}>
          <StaggerItem className="lg:col-span-2">
            <RevenueExplorer />
          </StaggerItem>

          <StaggerItem>
            <div className="h-full">
              <SegmentChart />
            </div>
          </StaggerItem>

          <StaggerItem className="lg:col-span-2">
            <ModelLab />
          </StaggerItem>

          <StaggerItem>
            <div className="h-full">
              <ConfusionMatrix />
            </div>
          </StaggerItem>

          <StaggerItem className="lg:col-span-2">
            <FeatureImportance />
          </StaggerItem>

          <StaggerItem>
            <div className="flex h-full flex-col justify-between rounded-3xl border border-dashed border-line bg-white/[0.015] p-6">
              <div>
                <p className="font-mono text-[0.62rem] tracking-[0.26em] text-accent uppercase">
                  Reading the data
                </p>
                <p className="mt-3 text-lg leading-snug font-semibold text-fg">
                  Every chart answers a question — trend, mix, or model quality.
                </p>
                <p className="mt-3 text-[0.82rem] leading-relaxed text-muted">
                  Numbers that are not published are marked as such instead of invented. That is how
                  analysis should be reported.
                </p>
              </div>
              <Reveal delay={0.1}>
                <p className="mt-6 font-mono text-[0.68rem] text-faint">
                  pandas • matplotlib • Power BI • scikit-learn
                </p>
              </Reveal>
            </div>
          </StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}
