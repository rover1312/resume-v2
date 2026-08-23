import * as THREE from 'three'

/** Procedural carbon-fiber twill weave texture (no assets needed). */
export function makeCarbonTexture(): THREE.CanvasTexture {
  const s = 128
  const c = document.createElement('canvas')
  c.width = c.height = s
  const g = c.getContext('2d')!

  g.fillStyle = '#101317'
  g.fillRect(0, 0, s, s)

  const cells = 8
  const cell = s / cells
  for (let y = 0; y < cells; y++) {
    for (let x = 0; x < cells; x++) {
      const horiz = (x + y) % 2 === 0
      g.fillStyle = horiz ? '#1d222a' : '#161b21'
      g.fillRect(x * cell, y * cell, cell, cell)

      // woven strand highlights
      for (let i = 0; i < 4; i++) {
        g.fillStyle = horiz ? 'rgba(148,163,184,0.10)' : 'rgba(148,163,184,0.05)'
        if (horiz) g.fillRect(x * cell + 1, y * cell + i * (cell / 4) + 1, cell - 2, cell / 8)
        else g.fillRect(x * cell + i * (cell / 4) + 1, y * cell + 1, cell / 8, cell - 2)
      }
    }
  }

  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  t.repeat.set(2.5, 2.5)
  t.anisotropy = 4
  return t
}
