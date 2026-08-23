import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI } from '../../stores/ui'
import { getPalette } from '../../lib/palette'
import { ZONE_STEP, N_SECTIONS } from './poses'
import { sceneState } from '../../lib/sceneState'

/** Landing pad + beacons in the final zone. */
export function LandingPad() {
  const theme = useUI((s) => s.theme)
  const pal = useMemo(() => getPalette(theme), [theme])
  const group = useRef<THREE.Group>(null!)
  const ring = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const w = Math.min(1, Math.max(0, 1 - Math.abs(sceneState.f - (N_SECTIONS - 1)) / 1.1))
    g.visible = w > 0.02
    if (!g.visible) return
    const t = state.clock.elapsedTime
    const s = 0.6 + 0.4 * w
    g.scale.setScalar(s)
    const r = ring.current
    if (r) {
      const m = r.material as THREE.MeshStandardMaterial
      m.emissiveIntensity = 0.5 + 0.45 * Math.sin(t * 2.2)
    }
  })

  return (
    <group ref={group} position={[0, -(N_SECTIONS - 1) * ZONE_STEP - 1.82, 0]}>
      <mesh>
        <circleGeometry args={[1.7, 48]} />
        <meshStandardMaterial color={pal.frameDark} roughness={0.7} metalness={0.3} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <torusGeometry args={[1.52, 0.035, 10, 64]} />
        <meshStandardMaterial color={pal.accent} emissive={pal.accent} emissiveIntensity={0.8} />
      </mesh>
      {[0, 1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2 + Math.PI / 4
        return (
          <mesh key={i} position={[Math.cos(a) * 1.52, 0.03, Math.sin(a) * 1.52]}>
            <sphereGeometry args={[0.05, 10, 10]} />
            <meshStandardMaterial color={pal.amber} emissive={pal.amber} emissiveIntensity={0.9} />
          </mesh>
        )
      })}
      {/* H marking */}
      <group position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh>
          <planeGeometry args={[0.08, 0.62]} />
          <meshBasicMaterial color={pal.metal} transparent opacity={0.55} />
        </mesh>
        <mesh position={[-0.16, 0, 0]}>
          <planeGeometry args={[0.24, 0.08]} />
          <meshBasicMaterial color={pal.metal} transparent opacity={0.55} />
        </mesh>
        <mesh position={[0.16, 0, 0]}>
          <planeGeometry args={[0.24, 0.08]} />
          <meshBasicMaterial color={pal.metal} transparent opacity={0.55} />
        </mesh>
      </group>
    </group>
  )
}
