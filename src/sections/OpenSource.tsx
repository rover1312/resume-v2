import { FolderGit2, ExternalLink } from 'lucide-react'
import { ossFlagship, ossSteps, sideProjects } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { sceneState } from '../lib/sceneState'

export function OpenSource() {
  const head = useReveal<HTMLHeadingElement>()
  const card = useReveal<HTMLDivElement>(90)
  const steps = useReveal<HTMLDivElement>(160)
  const grid = useReveal<HTMLDivElement>(220)

  return (
    <section id="opensource" className="section" aria-label="Open source projects">
      <div className="wrap">
        <h2 ref={head} className="h2" style={{ '--idx-c': 'var(--accent)' } as React.CSSProperties}>
          <span className="idx">04</span> OPEN SOURCE
        </h2>
        <p className="sub">// NEW CHAPTER — BUILDING IN PUBLIC.</p>

        <div className="os-grid">
          <div ref={card} className="neu card" style={{ padding: 26 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700 }}>
              {ossFlagship.name}
            </h3>
            <p
              className="mono"
              style={{ color: 'var(--accent)', fontSize: 11, letterSpacing: '0.1em', marginTop: 7 }}
            >
              {ossFlagship.sub}
            </p>
            <p style={{ color: 'var(--text-body)', fontSize: 13.5, lineHeight: 1.7, marginTop: 14 }}>
              {ossFlagship.desc}
            </p>

            <div className="log-tags">
              {ossFlagship.meta.map((m) => (
                <span key={m} className="chip static">
                  {m}
                </span>
              ))}
            </div>

            <a
              className="btn primary sm"
              href={ossFlagship.repoUrl}
              target="_blank"
              rel="noreferrer"
              style={{ marginTop: 20 }}
            >
              <FolderGit2 size={15} /> VIEW REPOSITORY
            </a>
          </div>

          <div>
            <p className="sg-title" style={{ marginBottom: 4 }}>
              SIGNAL PATH — HOVER TO TRACE
            </p>
            <div ref={steps} className="os-steps">
              {ossSteps.map((s, i) => (
                <div
                  key={s.title}
                  className="step neu-in"
                  tabIndex={0}
                  onMouseEnter={() => (sceneState.trace = i)}
                  onMouseLeave={() => (sceneState.trace = -1)}
                  onFocus={() => (sceneState.trace = i)}
                  onBlur={() => (sceneState.trace = -1)}
                >
                  <span className="n">0{i}</span>
                  <span className="t">
                    <b>{s.title}</b> — {s.desc}
                  </span>
                </div>
              ))}
            </div>
            <p className="hp-hint" style={{ marginTop: 12 }}>
              ▸ THE BOARD FLOATS BESIDE YOU — TRACES LIGHT UP AS YOU HOVER
            </p>
          </div>
        </div>

        <div ref={grid} className="proj-grid">
          {sideProjects.map((p) => {
            const inner = (
              <>
                <h4>{p.name}</h4>
                <p>{p.desc}</p>
                <span className="link-row">
                  {p.url ? (
                    <>
                      <FolderGit2 size={13} /> REPO <ExternalLink size={11} />
                    </>
                  ) : (
                    'INTERNAL BUILD'
                  )}
                </span>
              </>
            )
            return p.url ? (
              <a key={p.name} className="neu card hoverable proj-card" href={p.url} target="_blank" rel="noreferrer">
                {inner}
              </a>
            ) : (
              <div key={p.name} className="neu card proj-card pe">
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
