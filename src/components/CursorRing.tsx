import { useEffect, useRef } from 'react'

/** Soft ring cursor that expands over interactive targets. Desktop only. */
export function CursorRing() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let x = -100
    let y = -100
    let tx = x
    let ty = y
    let raf = 0

    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      const t = e.target as HTMLElement | null
      const hit = t?.closest('a, button, input, [role="switch"], [data-cursor]')
      el.classList.toggle('big', !!hit)
    }

    const loop = () => {
      x += (tx - x) * 0.22
      y += (ty - y) * 0.22
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <div ref={ref} className="cursor-ring" aria-hidden />
}
