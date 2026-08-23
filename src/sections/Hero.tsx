import { ChevronDown } from 'lucide-react'
import { profile } from '../data/content'
import { scrollToSection } from '../lib/nav'
import { useMagnetic } from '../hooks/useMagnetic'
import { click as sfxClick } from '../lib/sfx'
import { useUI } from '../stores/ui'

export function Hero() {
  const primary = useMagnetic<HTMLButtonElement>(0.22)
  const ghost = useMagnetic<HTMLButtonElement>(0.22)
  const soundOn = useUI((s) => s.soundOn)

  const go = (id: string) => {
    if (soundOn) sfxClick()
    scrollToSection(id)
  }

  return (
    <section id="hero" className="section" aria-label="Intro">
      <div className="wrap">
        <div className="hero-inner">
          <p className="kicker">
            <b>// SYSTEM ONLINE</b> — MISSION CONTROL v2.6
          </p>
          <h1 className="hero-title">
            {profile.name}
            <span className="role-row" style={{ marginTop: 14 }}>
              {profile.roleLine.map((r, i) => (
                <span key={r} style={{ display: 'inline-flex', gap: 14 }}>
                  {i > 0 && <span className="sep">·</span>}
                  {r}
                </span>
              ))}
            </span>
          </h1>

          <p className="sub">{profile.tagline}</p>

          <span className="status-chip neu-in">
            <span className="led" aria-hidden />
            {profile.location}
          </span>

          <div className="cta-row">
            <button ref={primary} className="btn primary" onClick={() => go('missionlog')}>
              VIEW MISSION LOG
            </button>
            <button ref={ghost} className="btn" onClick={() => go('comms')}>
              OPEN COMMS
            </button>
          </div>
        </div>
      </div>
      <div className="scroll-hint" aria-hidden>
        SCROLL TO THROTTLE UP
        <ChevronDown size={15} />
      </div>
    </section>
  )
}
