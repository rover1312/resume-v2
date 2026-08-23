import { lazy, Suspense, useEffect } from 'react'
import Lenis from 'lenis'
import { useUI } from './stores/ui'
import { lenisRef } from './lib/nav'
import { useReducedMotionSync } from './hooks/useReducedMotionSync'
import { useJourneyObserver } from './components/HudRail'
import { HudRail } from './components/HudRail'
import { TopBar } from './components/TopBar'
import { CursorRing } from './components/CursorRing'
import { FpvOverlay } from './components/FpvOverlay'
import { BootOverlay } from './components/BootOverlay'
import { PartTooltip } from './components/PartTooltip'
import { Hero } from './sections/Hero'
import { About } from './sections/About'
import { MissionLog } from './sections/MissionLog'
import { Hangar } from './sections/Hangar'
import { OpenSource } from './sections/OpenSource'
import { Systems } from './sections/Systems'
import { Comms } from './sections/Comms'

const Scene = lazy(() => import('./components/three/Scene'))

export default function App() {
  const booted = useUI((s) => s.booted)
  const toggleFpv = useUI((s) => s.toggleFpv)

  useReducedMotionSync()
  useJourneyObserver()

  // smooth scrolling
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    const lenis = new Lenis({ duration: 1.15, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    lenisRef.current = lenis
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  // FPV easter egg: [f] toggles, Esc exits
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      if (e.key.toLowerCase() === 'f') toggleFpv()
      if (e.key === 'Escape' && useUI.getState().fpvMode) toggleFpv()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [toggleFpv])

  return (
    <>
      <a className="skip-link btn sm" href="#about">
        Skip to content
      </a>

      <div className="scene-host" aria-hidden>
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </div>
      <div className="vignette" aria-hidden />

      <TopBar />
      <HudRail />
      <PartTooltip />
      <CursorRing />
      <FpvOverlay />
      {!booted && <BootOverlay />}

      <main id="main">
        <Hero />
        <About />
        <MissionLog />
        <Hangar />
        <OpenSource />
        <Systems />
        <Comms />
      </main>
    </>
  )
}
