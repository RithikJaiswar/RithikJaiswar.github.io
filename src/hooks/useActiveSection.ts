import { useEffect, useState } from 'react'

/**
 * Tracks which section is currently in the reading zone so the navbar
 * can highlight it. Uses IntersectionObserver (cheap, no scroll jank).
 */
export function useActiveSection(ids: readonly string[]): string {
  const [active, setActive] = useState<string>(ids[0] ?? '')

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const visible = new Map<string, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0)
        }
        let bestId = ids[0] ?? ''
        let bestRatio = -1
        for (const id of ids) {
          const ratio = visible.get(id) ?? 0
          if (ratio > bestRatio) {
            bestRatio = ratio
            bestId = id
          }
        }
        // Keep the first section highlighted when near the very top.
        if (window.scrollY < 80) {
          bestId = ids[0] ?? bestId
        }
        setActive(bestId)
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.9], rootMargin: '-72px 0px -35% 0px' },
    )

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [ids])

  return active
}
