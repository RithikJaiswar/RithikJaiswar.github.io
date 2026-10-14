import { useEffect, useState } from 'react'

/** Detects WebGL support once, safely (never throws on locked-down browsers). */
export function useWebGLSupport(): boolean {
  const [supported, setSupported] = useState<boolean>(true)

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl =
        canvas.getContext('webgl2') ??
        canvas.getContext('webgl') ??
        canvas.getContext('experimental-webgl')
      setSupported(Boolean(gl))
    } catch {
      setSupported(false)
    }
  }, [])

  return supported
}
