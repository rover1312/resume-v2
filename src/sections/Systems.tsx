import { useState } from 'react'
import { Cpu, BrainCircuit, CircuitBoard, Wrench, Users, ShieldCheck } from 'lucide-react'
import { certs, education, interests, skillGroups } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { tick as sfxTick } from '../lib/sfx'
import { useUI } from '../stores/ui'

const ICONS = [Cpu, BrainCircuit, CircuitBoard, Wrench, Users]
const ICON_COLORS = [
  'var(--accent)',
  'var(--violet)',
  'var(--cyan)',
  'var(--amber)',
  'var(--text-mid)',
]

export function Systems() {
  const head = useReveal<HTMLHeadingElement>()
  const body = useReveal<HTMLDivElement>(90)
  const ground = useReveal<HTMLDivElement>(160)
  const soundOn = useUI((s) => s.soundOn)
  const [on, setOn] = useState<Set<string>>(new Set())

  const flip = (k: string) => {
    setOn((prev) => {
      const n = new Set(prev)
      if (n.has(k)) n.delete(k)
      else n.add(k)
      return n
    })
    if (soundOn) sfxTick()
  }

  return (
    <section id="systems" className="section" aria-label="Systems — skills and certifications">
      <div className="wrap">
        <h2 ref={head} className="h2" style={{ '--idx-c': 'var(--cyan)' } as React.CSSProperties}>
          <span className="idx">05</span> SYSTEMS
        </h2>
        <p className="sub">// PAYLOAD MANIFEST — TAP A MODULE TO ARM IT.</p>

        <div ref={body} className="skills-block">
          {skillGroups.map((g, gi) => {
            const Icon = ICONS[gi % ICONS.length]
            return (
              <div key={g.title}>
                <p
                  className="sg-title"
                  style={{ '--gi': ICON_COLORS[gi % ICON_COLORS.length] } as React.CSSProperties}
                >
                  <Icon size={14} /> {g.title}
                </p>
                <div className="skill-chips">
                  {g.skills.map((s) => (
                    <button
                      key={s}
                      className={`chip${on.has(g.title + s) ? ' on' : ''}`}
                      aria-pressed={on.has(g.title + s)}
                      onClick={() => flip(g.title + s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        <div ref={ground} style={{ maxWidth: 860 }}>
          <div className="sg-title" style={{ marginTop: 34, '--gi': 'var(--violet)' } as React.CSSProperties}>
            <ShieldCheck size={14} /> CERTIFICATIONS
          </div>
          <div className="skill-chips">
            {certs.map((c) => (
              <span key={c} className="chip static violet">
                {c}
              </span>
            ))}
          </div>

          <div className="ground-grid">
            <div className="neu card ground-card">
              <p className="g-k">GROUND SCHOOL</p>
              <p className="g-v">
                <b>{education.school}</b>
                <br />
                {education.detail}
              </p>
            </div>
            <div className="neu card ground-card">
              <p className="g-k">RECOGNITION</p>
              <p className="g-v">
                <b>★ Diamond in the Rough</b> — Cognizant, 2023
              </p>
              <p className="g-v" style={{ marginTop: 10 }}>
                Off-duty: {interests.join(' · ').toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
