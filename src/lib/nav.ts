type ScrollToTarget = string | number | HTMLElement

interface LenisLike {
  scrollTo: (target: ScrollToTarget, opts?: Record<string, unknown>) => void
  destroy: () => void
}

export const lenisRef: { current: LenisLike | null } = { current: null }

export function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (lenisRef.current) {
    lenisRef.current.scrollTo(el, { duration: 1.4 })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}
