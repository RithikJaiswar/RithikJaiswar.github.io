import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { Reveal } from './Reveal'

type SectionHeadingProps = {
  eyebrow: string
  title: ReactNode
  description?: string
  align?: 'left' | 'center'
  id?: string
}

/** Consistent section header: small mono eyebrow → large title → muted lede. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  id,
}: SectionHeadingProps) {
  return (
    <div className={cn('max-w-3xl', align === 'center' && 'mx-auto text-center')}>
      <Reveal>
        <p
          className={cn(
            'mb-4 font-mono text-[0.72rem] font-medium uppercase tracking-[0.28em] text-accent-2',
            align === 'center' && 'text-center',
          )}
        >
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.06} blur>
        <h2
          id={id}
          className="text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.12]"
        >
          {title}
        </h2>
      </Reveal>
      {description && (
        <Reveal delay={0.12}>
          <p
            className={cn(
              'mt-5 text-base leading-relaxed text-muted sm:text-lg',
              align === 'center' && 'mx-auto',
            )}
          >
            {description}
          </p>
        </Reveal>
      )}
    </div>
  )
}
