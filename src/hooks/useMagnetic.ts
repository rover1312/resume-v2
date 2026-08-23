import { useEffect, useRef } from 'react'

/**
 * Magnetic hover: element drifts toward the cursor while nearby.
 * Disabled on touch devices and when reduced motion is preferred.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28, radius = 60) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    const loop = () => {
      cx += (tx - cx) * 0.18
      cy += (ty - cy) * 0.18
      el.style.transform =
        Math.abs(cx) + Math.abs(cy) > 0.05 ? `translate(${cx.toFixed(2)}px, ${cy.toFixed(2)}px)` : ''
      raf = requestAnimationFrame(loop)
    }

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const mx = e.clientX - (r.left + r.width / 2)
      const my = e.clientY - (r.top + r.height / 2)
      const dist = Math.hypot(mx, my)
      if (dist < radius + Math.max(r.width, r.height) / 2) {
        tx = mx * strength
        ty = my * strength
      } else {
        tx = 0
        ty = 0
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [strength, radius])

  return ref
}
