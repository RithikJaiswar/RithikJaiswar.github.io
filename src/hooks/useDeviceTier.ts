import { useEffect, useState } from 'react'

export type DeviceTier = 'mobile' | 'desktop'

/**
 * Returns the current device tier so 3D scenes can reduce particle
 * counts and disable expensive effects on small / low-power devices.
 * Updates on resize (orientation changes, responsive testing).
 */
export function useDeviceTier(): DeviceTier {
  const [tier, setTier] = useState<DeviceTier>(() => {
    if (typeof window === 'undefined') return 'desktop'
    return window.matchMedia('(max-width: 768px)').matches ? 'mobile' : 'desktop'
  })

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const onChange = () => setTier(mq.matches ? 'mobile' : 'desktop')
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return tier
}
