import { FolderGit2, Briefcase, Mail, Phone, ExternalLink, Send } from 'lucide-react'
import { channels, profile } from '../data/content'
import { useReveal } from '../hooks/useReveal'
import { useMagnetic } from '../hooks/useMagnetic'
import type { ChannelId } from '../data/content'

const ICONS: Record<ChannelId, React.ReactNode> = {
  email: <Mail size={19} />,
  linkedin: <Briefcase size={19} />,
  github: <FolderGit2 size={19} />,
  trailhead: <ExternalLink size={19} />,
  phone: <Phone size={19} />,
}

const CHANNEL_COLOR: Record<ChannelId, string> = {
  email: 'var(--accent)',
  linkedin: 'var(--cyan)',
  github: 'var(--text-hi)',
  trailhead: 'var(--violet)',
  phone: 'var(--amber)',
}

export function Comms() {
  const head = useReveal<HTMLHeadingElement>()
  const grid = useReveal<HTMLDivElement>(90)
  const cta = useMagnetic<HTMLAnchorElement>(0.18)

  return (
    <section id="comms" className="section" aria-label="Contact">
      <div className="wrap">
        <h2 ref={head} className="h2" style={{ '--idx-c': 'var(--violet)' } as React.CSSProperties}>
          <span className="idx">06</span> COMMS
        </h2>
        <p className="sub">// FREQUENCIES OPEN. TOUCH DOWN AND SAY HELLO.</p>

        <div ref={grid} className="comm-grid">
          {channels.map((c) => (
            <a
              key={c.id}
              className="neu card hoverable comm-card"
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              style={{ '--ic': CHANNEL_COLOR[c.id] } as React.CSSProperties}
            >
              <span className="comm-icon neu-in">{ICONS[c.id]}</span>
              <span>
                <span className="comm-label">{c.label}</span>
                <span className="comm-value" style={{ display: 'block' }}>
                  {c.value}
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="cta-big">
          <a ref={cta} className="btn primary" href={`mailto:${profile.email}`}>
            <Send size={16} /> TRANSMIT MESSAGE
          </a>
        </div>

        <footer className="foot">
          <span>© {new Date().getFullYear()} RISHAVH SHUKLA</span>
          <a href="./resume.txt" target="_blank" rel="noreferrer" style={{ color: 'var(--cyan)' }}>
            RESUME.TXT // DATA EXPORT
          </a>
          <span>REACT + THREE.JS — HANDCRAFTED</span>
          <span>PRESS [F] FOR FPV MODE</span>
        </footer>
      </div>
    </section>
  )
}
