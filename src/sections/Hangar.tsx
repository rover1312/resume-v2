import { useState } from 'react'
import { sceneState } from '../lib/sceneState'
import { useReveal } from '../hooks/useReveal'
import { tick as sfxTick } from '../lib/sfx'
import { useUI } from '../stores/ui'

const PART_CHIPS = ['FRAME', 'MOTORS', 'PROPS', 'FC STACK', 'AIR UNIT', 'VTX', 'LIPO']

export function Hangar() {
  const [val, setVal] = useState(0)
  const head = useReveal<HTMLHeadingElement>()
  const copy = useReveal<HTMLDivElement>(90)
  const panel = useReveal<HTMLDivElement>(180)
  const soundOn = useUI((s) => s.soundOn)

  return (
    <section id="hangar" className="section" aria-label="The hangar — drones and electronics">
      <div className="wrap">
        <h2 ref={head} className="h2" style={{ '--idx-c': 'var(--violet)' } as React.CSSProperties}>
          <span className="idx">03</span> THE HANGAR
        </h2>

        <div ref={copy} style={{ maxWidth: 560 }}>
          <p className="sub">
            10+ years of solder smoke, carbon fiber and crash-tested physics. I design, build, tune
            and repair FPV quads — and I'll tear down (and usually fix) just about anything with a
            PCB inside. The bench teaches what meetings can't.
          </p>
        </div>

        <div ref={panel}>
          <div className="neu card hangar-panel">
            <div className="hp-head">
              <span>AIRFRAME // EXPLODED VIEW</span>
              <span className="hp-val">{String(val).padStart(3, '0')}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={val}
              className="range"
              aria-label="Explode airframe"
              onChange={(e) => {
                const v = Number(e.target.value)
                setVal(v)
                sceneState.explode = v / 100
              }}
              onPointerUp={() => soundOn && sfxTick()}
            />
            <p className="hp-hint">▸ DRAG THE SLIDER — THE QUAD COMES APART IN THE HANGAR BAY</p>
          </div>

          <div className="parts-row" aria-hidden>
            {PART_CHIPS.map((c) => (
              <span key={c} className="chip static">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
