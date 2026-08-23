import { useEffect, useRef } from 'react'
import { SECTIONS } from '../data/content'
import { useUI } from '../stores/ui'
import { scrollToSection } from '../lib/nav'
import { sceneState } from '../lib/sceneState'

export function HudRail() {
  const active = useUI((s) => s.activeSection)

  return (
    <nav className="rail" aria-label="Flight path">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={`rail-dot${active === s.id ? ' active' : ''}`}
          aria-label={s.label}
          aria-current={active === s.id ? 'true' : undefined}
          onClick={() => scrollToSection(s.id)}
        >
          <span className="lbl">{s.label}</span>
        </button>
      ))}
    </nav>
  )
}

/** Observes sections and reports the active one + scroll % into the store. */
export function useJourneyObserver() {
  const setActive = useUI((s) => s.setActiveSection)
  const setPct = useUI((s) => s.setScrollPct)

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (e): e is HTMLElement => !!e,
    )
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 },
    )
    els.forEach((el) => io.observe(el))

    let raf = 0
    let lastPct = -1
    const onScrollFrame = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      sceneState.p = p
      const pct = Math.round(p * 100)
      if (pct !== lastPct) {
        lastPct = pct
        setPct(pct)
      }
      raf = requestAnimationFrame(onScrollFrame)
    }
    raf = requestAnimationFrame(onScrollFrame)

    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [setActive, setPct])
}

/** Small helper hook for components that need a stable section list ref. */
export function useRailLabels() {
  return useRef(SECTIONS.map((s) => s.label))
}
