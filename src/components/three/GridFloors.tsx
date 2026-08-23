import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useUI } from '../../stores/ui'
import { getPalette } from '../../lib/palette'
import { N_SECTIONS, ZONE_STEP } from './poses'

export function GridFloors() {
  const theme = useUI((s) => s.theme)
  const pal = useMemo(() => getPalette(theme), [theme])

  const floors = useMemo(() => {
    const arr: number[] = []
    for (let k = 0; k < N_SECTIONS; k++) arr.push(-k * ZONE_STEP - 1.9)
    return arr
  }, [])

  return (
    <>
      {floors.map((y, i) => (
        <GridFloor key={i} y={y} pal={pal} />
      ))}
    </>
  )
}

function GridFloor({ y, pal }: { y: number; pal: ReturnType<typeof getPalette> }) {
  const ref = useRef<THREE.GridHelper>(null!)

  useEffect(() => {
    const g = ref.current
    if (!g) return
    const mat = g.material as THREE.Material & { opacity: number }
    mat.transparent = true
    mat.opacity = 0.22
    mat.depthWrite = false
  }, [])

  return (
    <gridHelper
      ref={ref}
      args={[54, 54, pal.gridA, pal.gridB]}
      position={[0, y, 0]}
    />
  )
}
