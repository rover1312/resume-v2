import { useEffect } from 'react'
import { useUI } from '../stores/ui'

/** Tracks prefers-reduced-motion into the store. */
export function useReducedMotionSync() {
  const setReducedMotion = useUI((s) => s.setReducedMotion)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const apply = () => setReducedMotion(mq.matches)
    apply()
    mq.addEventListener('change', apply)
    return () => mq.removeEventListener('change', apply)
  }, [setReducedMotion])
}
