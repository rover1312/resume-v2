import { logEntries } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function MissionLog() {
  return (
    <section id="missionlog" className="section" aria-label="Mission log — work experience">
      <div className="wrap">
        <h2 className="h2" style={{ '--idx-c': 'var(--cyan)' } as React.CSSProperties}>
          <span className="idx">02</span> MISSION LOG
        </h2>
        <p className="sub">// EVERY SYSTEM HAS A FLIGHT HISTORY. THESE ARE MINE.</p>

        <div className="timeline">
          {logEntries.map((e, i) => (
            <Entry key={e.company} entry={e} idx={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function Entry({
  entry,
  idx,
}: {
  entry: (typeof logEntries)[number]
  idx: number
}) {
  const ref = useReveal<HTMLDivElement>(idx * 80)

  return (
    <article ref={ref} className="log-item">
      <span className="log-node" aria-hidden />
      <div className="neu card log-card">
        <div className="log-head">
          <div>
            <h3 className="log-co">{entry.company}</h3>
            <p className="log-role">{entry.role}</p>
          </div>
          <span className={`chip neu-in-sm log-period${entry.current ? ' badge-current' : ''}`}>
            {entry.period}
          </span>
        </div>

        {entry.client && (
          <p className="log-client">
            CLIENT // <b style={{ color: 'var(--text-body)' }}>{entry.client}</b>
          </p>
        )}

        <ul className="log-list">
          {entry.bullets.map((b) => (
            <li key={b.slice(0, 24)}>{b}</li>
          ))}
        </ul>

        {entry.award && (
          <div className="log-tags">
            <span className="chip amber">★ {entry.award}</span>
          </div>
        )}

        {entry.tags && (
          <div className="log-tags">
            {entry.tags.map((t) => (
              <span key={t} className="chip static">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
