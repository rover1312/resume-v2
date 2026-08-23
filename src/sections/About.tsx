import { aboutStats } from '../data/content'
import { useReveal } from '../hooks/useReveal'

export function About() {
  const head = useReveal<HTMLHeadingElement>()
  const copy = useReveal<HTMLDivElement>(90)
  const stats = useReveal<HTMLDivElement>(180)

  return (
    <section id="about" className="section" aria-label="Who am I">
      <div className="wrap">
        <h2 ref={head} className="h2">
          <span className="idx">01</span> WHO AM I
        </h2>

        <div className="about-grid">
          <div ref={copy} className="about-copy">
            <p>
              I'm an engineer who lives on <b>both sides of the firmware boundary</b>. By day I ship
              enterprise Salesforce platforms — currently at ArcelorMittal, where I joined as the
              first developer on the Salesforce team. Off-hours I've spent{' '}
              <b>10+ years designing, soldering and flying FPV drones</b>.
            </p>
            <p>
              That dual life is the point: understanding steel-plant data models and LiPo voltage
              curves teaches the same lesson — <b>systems fail at their edges</b>, and the person who
              has taken both apart fixes them fastest. I'm now open-sourcing what my workshop
              produces.
            </p>
          </div>

          <div ref={stats} className="stat-grid">
            {aboutStats.map((s) => (
              <div key={s.label} className="neu stat-tile">
                <div className="stat-num">{s.num}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
