import type { Variants } from 'framer-motion'

/** Shared easing — smooth, product-like, never bouncy. */
export const EASE = [0.22, 1, 0.36, 1] as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 26, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.7, ease: EASE },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.6, ease: EASE } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: EASE } },
}

/** Stagger container for card grids. */
export const stagger = (delay = 0.08, staggerChildren = 0.08): Variants => ({
  hidden: {},
  visible: { transition: { delayChildren: delay, staggerChildren } },
})

/** Variant that also works when a parent orchestrates visibility. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.6, ease: EASE } },
}
