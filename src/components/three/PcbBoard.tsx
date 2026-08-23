import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI } from '../../stores/ui'
import { getPalette } from '../../lib/palette'
import { ZONE_STEP, N_SECTIONS } from './poses'
import { sceneState } from '../../lib/sceneState'

const ZONE = -(4 * ZONE_STEP)

interface TraceSeg {
  pos: [number, number, number]
  size: [number, number, number]
}

/** Manhattan-routed trace segments (on-board surface y ≈ 0.05) */
const TRACES: TraceSeg[][] = [
  // step 0: FC UART → ESP32
  [
    { pos: [0.28, 0.055, -0.25], size: [0.55, 0.012, 0.03] },
    { pos: [-0.02, 0.055, -0.13], size: [0.03, 0.012, 0.27] },
    { pos: [-0.2, 0.055, -0.01], size: [0.4, 0.012, 0.03] },
  ],
  // step 1: ESP32 → antenna pin
  [
    { pos: [-0.72, 0.055, 0.32], size: [0.03, 0.012, 0.34] },
    { pos: [-0.86, 0.055, 0.62], size: [0.3, 0.012, 0.03] },
  ],
  // step 2: ESP32 → camera connector pads
  [
    { pos: [-0.3, 0.055, 0.38], size: [0.6, 0.012, 0.03] },
    { pos: [0.16, 0.055, 0.52], size: [0.03, 0.012, 0.3] },
    { pos: [0.75, 0.055, 0.66], size: [1.2, 0.012, 0.03] },
  ],
  // step 3: FC → OSD test pad
  [
    { pos: [0.85, 0.055, -0.45], size: [0.7, 0.012, 0.03] },
    { pos: [1.19, 0.055, -0.2], size: [0.03, 0.012, 0.52] },
    { pos: [1.02, 0.055, 0.06], size: [0.36, 0.012, 0.03] },
  ],
]

export function PcbBoard() {
  const theme = useUI((s) => s.theme)
  const pal = useMemo(() => getPalette(theme), [theme])
  const group = useRef<THREE.Group>(null!)
  const statusLed = useRef<THREE.MeshStandardMaterial>(null!)

  const mats = useMemo(
    () => ({
      board: new THREE.MeshStandardMaterial({ color: pal.board, roughness: 0.55, metalness: 0.25 }),
      copper: new THREE.MeshStandardMaterial({ color: pal.metal, roughness: 0.35, metalness: 0.8 }),
      dark: new THREE.MeshStandardMaterial({ color: pal.frameDark, roughness: 0.5, metalness: 0.3 }),
      shield: new THREE.MeshStandardMaterial({ color: pal.metal, roughness: 0.3, metalness: 0.9 }),
      trace: TRACES.map(
        () =>
          new THREE.MeshStandardMaterial({
            color: pal.accent,
            emissive: pal.accent,
            emissiveIntensity: 0.15,
          }),
      ),
    }),
    [pal],
  )

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const w = Math.min(1, Math.max(0, 1 - Math.abs(sceneState.f - 4) / 1.2))
    g.visible = w > 0.02
    if (!g.visible) return

    const t = state.clock.elapsedTime
    g.scale.setScalar(0.65 + 0.35 * w)
    g.rotation.y = -0.42 + Math.sin(t * 0.4) * 0.04 * w

    for (let i = 0; i < mats.trace.length; i++) {
      const active = sceneState.trace === i
      const idlePulse = Math.pow(Math.max(0, Math.sin(t * 1.5 - i * 0.95)), 3)
      const m = mats.trace[i]
      m.emissiveIntensity = THREE.MathUtils.lerp(0.12 + 0.55 * idlePulse, 1.6, active ? 1 : 0)
    }

    if (statusLed.current) {
      // LED cheat-sheet nod: fast blink while connecting, solid when ready
      const phase = Math.floor(t % 4)
      statusLed.current.emissiveIntensity = phase < 2 ? (Math.sin(t * 12) > 0 ? 1.4 : 0.05) : 1.2
    }
  })

  return (
    <group ref={group} position={[2.15, ZONE + 0.35, -0.6]} rotation={[0.1, -0.42, 0.04]} visible={false}>
      {/* board slab */}
      <mesh>
        <boxGeometry args={[2.9, 0.1, 1.95]} />
        <primitive object={mats.board} attach="material" />
      </mesh>

      {/* ESP32-C3 module + shield */}
      <group position={[-0.62, 0.11, 0.18]}>
        <mesh>
          <boxGeometry args={[0.68, 0.1, 0.44]} />
          <primitive object={mats.dark} attach="material" />
        </mesh>
        <mesh position={[0, 0.065, 0]}>
          <boxGeometry args={[0.58, 0.035, 0.34]} />
          <primitive object={mats.shield} attach="material" />
        </mesh>
        {/* status LED */}
        <mesh position={[0.26, 0.055, 0.14]}>
          <sphereGeometry args={[0.028, 10, 10]} />
          <meshStandardMaterial ref={statusLed} color={pal.accent} emissive={pal.accent} emissiveIntensity={1} />
        </mesh>
        {/* antenna pin */}
        <mesh position={[-0.3, 0.08, -0.14]}>
          <cylinderGeometry args={[0.022, 0.022, 0.09, 8]} />
          <primitive object={mats.copper} attach="material" />
        </mesh>
      </group>

      {/* FC (Betaflight flight controller) */}
      <group position={[0.58, 0.1, -0.28]}>
        <mesh>
          <boxGeometry args={[0.54, 0.08, 0.54]} />
          <meshStandardMaterial color="#11151b" roughness={0.45} metalness={0.35} />
        </mesh>
      </group>

      {/* USB-C */}
      <mesh position={[-0.62, 0.09, 0.92]}>
        <boxGeometry args={[0.28, 0.07, 0.16]} />
        <primitive object={mats.shield} attach="material" />
      </mesh>

      {/* caps */}
      {[
        [-1.05, 0.09, -0.55],
        [0.1, 0.09, 0.62],
        [1.05, 0.09, -0.62],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.05, 0.05, 0.12, 10]} />
          <primitive object={mats.copper} attach="material" />
        </mesh>
      ))}

      {/* traces */}
      {TRACES.map((segs, ti) =>
        segs.map((s, si) => (
          <mesh key={`${ti}-${si}`} position={s.pos}>
            <boxGeometry args={s.size} />
            <primitive object={mats.trace[ti]} attach="material" />
          </mesh>
        )),
      )}
    </group>
  )
}
