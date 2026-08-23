import { useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI } from '../../stores/ui'
import { getPalette } from '../../lib/palette'

const COUNT = 260
const BOX = new THREE.Vector3(30, 74, 26)

export function Particles() {
  const theme = useUI((s) => s.theme)
  const pal = useMemo(() => getPalette(theme), [theme])
  const pointsRef = useRef<THREE.Points>(null!)
  const { camera } = useThree()

  const geo = useMemo(() => {
    const arr = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * BOX.x
      arr[i * 3 + 1] = (Math.random() - 0.5) * BOX.y
      arr[i * 3 + 2] = (Math.random() - 0.5) * BOX.z
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    return g
  }, [])

  const mat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: pal.particle,
        size: 0.05,
        transparent: true,
        opacity: theme === 'dark' ? 0.5 : 0.4,
        depthWrite: false,
        blending: theme === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending,
      }),
    [pal, theme],
  )

  useFrame((state, dt) => {
    const reduced = useUI.getState().reducedMotion
    const pts = pointsRef.current
    if (!pts) return
    // follow the descending camera so the field feels endless
    pts.position.y = camera.position.y + Math.sin(state.clock.elapsedTime * 0.05) * 1.5
    if (!reduced) pts.rotation.y += dt * 0.012
  })

  return <points ref={pointsRef} geometry={geo} material={mat} frustumCulled={false} />
}
