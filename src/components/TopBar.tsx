import { useRef } from 'react'
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react'
import { useUI } from '../stores/ui'
import { toggle as sfxToggle } from '../lib/sfx'

export function TopBar() {
  const theme = useUI((s) => s.theme)
  const toggleTheme = useUI((s) => s.toggleTheme)
  const soundOn = useUI((s) => s.soundOn)
  const toggleSound = useUI((s) => s.toggleSound)
  const scrollPct = useUI((s) => s.scrollPct)
  const toggleFpv = useUI((s) => s.toggleFpv)
  const clicks = useRef(0)
  const timer = useRef(0)

  const onBrandClick = () => {
    clicks.current += 1
    window.clearTimeout(timer.current)
    if (clicks.current >= 3) {
      clicks.current = 0
      toggleFpv()
      return
    }
    timer.current = window.setTimeout(() => {
      clicks.current = 0
    }, 700)
  }

  return (
    <header className="hud-top">
      <button className="brand" onClick={onBrandClick} aria-label="FLIGHTDECK — triple-click toggles FPV mode">
        <span className="dot" aria-hidden />
        RS//FLIGHTDECK
      </button>

      <div className="top-controls">
        <span className="alt-readout" aria-live="off">
          ALT <b>{String(Math.round(scrollPct * 3.2)).padStart(3, '0')}</b> M · {String(scrollPct).padStart(3, '0')}%
        </span>

        <button
          className="icon-btn"
          aria-pressed={soundOn}
          aria-label={soundOn ? 'Mute UI sounds' : 'Enable UI sounds'}
          onClick={() => {
            toggleSound()
            if (!soundOn) sfxToggle()
          }}
        >
          {soundOn ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>

        <button
          className="rocker"
          role="switch"
          aria-checked={theme === 'dark'}
          aria-label="Dark mode"
          onClick={toggleTheme}
        >
          <span className="knob">{theme === 'dark' ? <Moon size={13} /> : <Sun size={13} />}</span>
        </button>
      </div>
    </header>
  )
}
