import { useEffect, useRef } from 'react'
import { Crosshair } from 'lucide-react'
import { useUI } from '../stores/ui'

/** OSD-style overlay shown during FPV easter-egg mode. */
export function FpvOverlay() {
  const fpvMode = useUI((s) => s.fpvMode)
  const tRef = useRef<HTMLSpanElement | null>(null)

  useEffect(() => {
    if (!fpvMode) return
    const start = Date.now()
    const id = window.setInterval(() => {
      if (tRef.current) {
        const s = Math.floor((Date.now() - start) / 1000)
        const mm = String(Math.floor(s / 60)).padStart(2, '0')
        const ss = String(s % 60).padStart(2, '0')
        tRef.current.textContent = `REC ${mm}:${ss}`
      }
    }, 1000)
    return () => window.clearInterval(id)
  }, [fpvMode])

  if (!fpvMode) return null

  const corner: React.CSSProperties = { position: 'fixed' }

  return (
    <>
      <div className="fpv-badge" style={{ ...corner, top: 74, left: 24 }}>
        <span className="rec" aria-hidden />
        <span ref={tRef}>REC 00:00</span>
      </div>
      <div className="fpv-badge" style={{ ...corner, top: 74, right: 24 }}>
        BAT 87%
      </div>
      <div className="fpv-corner" style={{ ...corner, top: 64, left: 16, borderTop: '2px solid', borderLeft: '2px solid' }} aria-hidden />
      <div className="fpv-corner" style={{ ...corner, top: 64, right: 16, borderTop: '2px solid', borderRight: '2px solid' }} aria-hidden />
      <div className="fpv-corner" style={{ ...corner, bottom: 52, left: 16, borderBottom: '2px solid', borderLeft: '2px solid' }} aria-hidden />
      <div className="fpv-corner" style={{ ...corner, bottom: 52, right: 16, borderBottom: '2px solid', borderRight: '2px solid' }} aria-hidden />
      <div className="fpv-crosshair" aria-hidden>
        <Crosshair size={30} strokeWidth={1.4} />
      </div>
      <div className="fpv-hint">FPV MODE — PRESS ESC OR TRIPLE-CLICK LOGO TO EXIT</div>
    </>
  )
}
