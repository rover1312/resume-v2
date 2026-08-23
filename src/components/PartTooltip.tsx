import { useEffect, useRef, useState } from 'react'
import { useUI } from '../stores/ui'
import { PART_DEFS, type PartId } from '../components/three/partDefs'

/** DOM tooltip following the cursor when a drone part is hovered in 3D. */
export function PartTooltip() {
  const [info, setInfo] = useState<{ label: string; detail: string } | null>(null)
  const pos = useRef({ x: 0, y: 0 })
  const elRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let raf = 0
    const onMove = (e: PointerEvent) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
    }
    const loop = () => {
      const el = elRef.current
      if (el) {
        el.style.transform = `translate(${pos.current.x + 18}px, ${pos.current.y + 16}px)`
      }
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    const onHover = (e: Event) => {
      const id = (e as CustomEvent<string | null>).detail as PartId | null
      if (!id) setInfo(null)
      else {
        const def = PART_DEFS[id]
        if (def) setInfo({ label: def.label, detail: def.detail })
      }
    }
    window.addEventListener('fd-part-hover', onHover)
    return () => window.removeEventListener('fd-part-hover', onHover)
  }, [])

  if (!info) return null

  return (
    <div ref={elRef} className="ptool" style={{ left: 0, top: 0 }}>
      <div className="t-label">{info.label}</div>
      <div className="t-detail">{info.detail}</div>
    </div>
  )
}
