import { useEffect, useState } from 'react'
import { bootLines } from '../data/content'
import { useUI } from '../stores/ui'

export function BootOverlay() {
  const setBooted = useUI((s) => s.setBooted)
  const reduced = useUI((s) => s.reducedMotion)
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (reduced) {
      setCount(bootLines.length)
      const t = window.setTimeout(finish, 450)
      return () => window.clearTimeout(t)
    }
    if (count >= bootLines.length) {
      const t = window.setTimeout(finish, 420)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => setCount((c) => c + 1), 150)
    return () => window.clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, reduced])

  function finish() {
    setDone(true)
    setBooted(true)
    document.body.classList.remove('no-scroll')
    window.setTimeout(() => {
      const el = document.getElementById('boot-overlay')
      el?.remove()
    }, 600)
  }

  useEffect(() => {
    document.body.classList.add('no-scroll')
    return () => document.body.classList.remove('no-scroll')
  }, [])

  useEffect(() => {
    const skip = () => finish()
    window.addEventListener('keydown', skip, { once: true })
    return () => window.removeEventListener('keydown', skip)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div id="boot-overlay" className={`boot${done ? ' done' : ''}`} onClick={finish}>
      <div className="boot-box" role="status" aria-label="System booting">
        {bootLines.slice(0, count).map((l, idx) => {
          const m = l.match(/^([^\.]+)(\.{3,}.*)$/)
          return (
            <div key={l} className="boot-line">
              <span>{m ? m[1] : l}</span>
              {m && <span className="ok">{m[2]}</span>}
              {idx === count - 1 && count < bootLines.length && <span className="caret" />}
            </div>
          )
        })}
        <div className="boot-skip">
          <button className="chip" onClick={finish}>
            SKIP ▸
          </button>
        </div>
      </div>
    </div>
  )
}
