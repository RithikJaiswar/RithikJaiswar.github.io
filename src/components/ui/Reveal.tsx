import { motion, useReducedMotion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'
import { EASE } from '../../utils/animations'

type RevealProps = {
  children: ReactNode
  className?: string
  delay?: number
  y?: number
  /** blur-to-focus effect (slightly more expensive, use sparingly) */
  blur?: boolean
  once?: boolean
}

/**
 * Scroll reveal wrapper. Content stays fully readable when
 * prefers-reduced-motion is set — it simply appears.
 */
export function Reveal({ children, className, delay = 0, y = 24, blur = false, once = true }: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  const hidden: Variants['hidden'] = {
    opacity: 0,
    y,
    ...(blur ? { filter: 'blur(8px)' } : {}),
  }

  return (
    <motion.div
      className={cn(className)}
      initial={hidden}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once, margin: '-60px 0px -60px 0px' }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Staggered container: wrap children with <StaggerItem/> inside.
 */
export function Stagger({
  children,
  className,
  delay = 0,
  staggerChildren = 0.08,
}: {
  children: ReactNode
  className?: string
  delay?: number
  staggerChildren?: number
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px 0px -60px 0px' }}
      variants={{
        hidden: {},
        visible: { transition: { delayChildren: delay, staggerChildren } },
      }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}
