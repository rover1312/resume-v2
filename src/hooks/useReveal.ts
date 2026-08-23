import { useEffect, useRef } from 'react'

/** Adds .in class when the element first scrolls into view. */
export function useReveal<T extends HTMLElement>(delayMs = 0) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.classList.add('reveal')
    el.style.setProperty('--rd', `${delayMs}ms`)

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('in')
            io.disconnect()
          }
        }
      },
      { threshold: 0.15 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delayMs])

  return ref
}
