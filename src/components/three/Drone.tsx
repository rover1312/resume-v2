import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI } from '../../stores/ui'
import { getPalette } from '../../lib/palette'
import { sceneState } from '../../lib/sceneState'
import { evalPose, explodeWeight } from './poses'
import { emitPartHover, type PartId } from './partDefs'
import { makeCarbonTexture } from '../../lib/carbon'
import { tick as sfxTick } from '../../lib/sfx'

interface Explodable {
  key: string
  part: PartId
  base: [number, number, number]
  dir: [number, number, number]
}

const ARM_ANGLES = [45, 135, 225, 315].map((d) => (d * Math.PI) / 180)
const MOTOR_R = 1.38

const EXPL: Explodable[] = [
  { key: 'frame', part: 'frame', base: [0, -0.04, 0], dir: [0, -1, 0] },
  { key: 'stack', part: 'stack', base: [0, 0.11, 0], dir: [0, 0.55, -0.1] },
  { key: 'canopy', part: 'canopy', base: [0, 0.26, 0], dir: [0, 1, 0] },
  { key: 'battery', part: 'battery', base: [0, 0.42, 0.14], dir: [0, 1, 0.22] },
  { key: 'cam', part: 'cam', base: [0, 0.16, 0.74], dir: [0, 0.3, 1] },
  { key: 'vtx', part: 'vtx', base: [0, 0.16, -0.56], dir: [0, 0.7, -0.8] },
]
ARM_ANGLES.forEach((a, i) => {
  const dx = Math.cos(a)
  const dz = Math.sin(a)
  EXPL.push({
    key: `motor${i}`,
    part: 'motors',
    base: [dx * MOTOR_R, 0.05, dz * MOTOR_R],
    dir: [dx * 0.55, 0.35, dz * 0.55],
  })
  EXPL.push({
    key: `prop${i}`,
    part: 'props',
    base: [dx * MOTOR_R, 0.17, dz * MOTOR_R],
    dir: [dx * 0.75, 1.15, dz * 0.75],
  })
})

export function Drone() {
  const theme = useUI((s) => s.theme)
  const booted = useUI((s) => s.booted)
  const pal = useMemo(() => getPalette(theme), [theme])
  const carbon = useMemo(makeCarbonTexture, [])

  const root = useRef<THREE.Group>(null!)
  const refs = useRef<Record<string, THREE.Object3D>>({})
  const propRefs = useRef<THREE.Object3D[]>([])
  const shadowMat = useRef<THREE.MeshStandardMaterial>(null!)

  const bp = useRef(new THREE.Vector3(2.3, 0.25, -0.5))
  const yawUser = useRef(0)
  const pitchUser = useRef(0)
  const rpm = useRef(0)
  const pulse = useRef(0)
  const hoverPart = useRef<PartId | null>(null)
  const [, force] = useState(0)

  const reg = (key: string) => (o: THREE.Object3D | null) => {
    if (o) refs.current[key] = o
  }

  /* ---------- interaction: drag-orbit + hover ---------- */
  useEffect(() => {
    let dragging = false
    let lx = 0
    let ly = 0

    const down = (e: PointerEvent) => {
      if (!hoverPart.current) return // only grab when actually over the quad
      dragging = true
      lx = e.clientX
      ly = e.clientY
      document.body.style.cursor = 'grabbing'
    }
    const move = (e: PointerEvent) => {
      if (!dragging) return
      const reduced = useUI.getState().reducedMotion
      if (reduced) return
      yawUser.current += (e.clientX - lx) * 0.006
      pitchUser.current = THREE.MathUtils.clamp(
        pitchUser.current + (e.clientY - ly) * 0.0035,
        -0.45,
        0.45,
      )
      lx = e.clientX
      ly = e.clientY
    }
    const up = () => {
      dragging = false
      document.body.style.cursor = hoverPart.current ? 'pointer' : ''
    }
    window.addEventListener('pointerdown', down)
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
    return () => {
      window.removeEventListener('pointerdown', down)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
      document.body.style.cursor = ''
    }
  }, [])

  function bind(part: PartId) {
    return {
      onPointerOver: (e: { stopPropagation: () => void }) => {
        e.stopPropagation()
        hoverPart.current = part
        emitPartHover(part)
        document.body.style.cursor = 'grab'
        force((n) => n + 1)
      },
      onPointerOut: () => {
        hoverPart.current = null
        emitPartHover(null)
        document.body.style.cursor = ''
        force((n) => n + 1)
      },
      onClick: () => {
        pulse.current = 1
        if (useUI.getState().soundOn) sfxTick()
      },
    }
  }

  useFrame((state, dt) => {
    const reduced = useUI.getState().reducedMotion
    const t = state.clock.elapsedTime
    const g = root.current
    if (!g) return

    const { ap, s, ry } = evalPose(sceneState.f)

    const lam = reduced ? 100 : 3
    bp.current.x = THREE.MathUtils.damp(bp.current.x, ap.x, lam, dt)
    bp.current.y = THREE.MathUtils.damp(bp.current.y, ap.y, lam, dt)
    bp.current.z = THREE.MathUtils.damp(bp.current.z, ap.z, lam, dt)
    const bob = reduced ? 0 : Math.sin(t * 1.7) * 0.045 * (booted ? 1 : 0.35)
    g.position.set(bp.current.x, bp.current.y + bob, bp.current.z)
    const sc = THREE.MathUtils.damp(g.scale.x, s, lam, dt)
    g.scale.setScalar(sc * (1 - pulse.current * 0.05))

    yawUser.current = THREE.MathUtils.damp(yawUser.current, 0, reduced ? 100 : 0.12, dt)
    pitchUser.current = THREE.MathUtils.damp(pitchUser.current, 0, reduced ? 100 : 1.4, dt)
    const idleSway = reduced ? 0 : Math.sin(t * 0.32) * 0.06
    g.rotation.y = ry + yawUser.current + idleSway
    g.rotation.x = pitchUser.current

    pulse.current = Math.max(0, pulse.current - dt * 4)

    sceneState.dronePos.copy(g.position)

    // exploded view (weighted to the hangar zone)
    const ex = sceneState.explode * explodeWeight(sceneState.f)
    sceneState.explodeFinal = ex

    for (const e of EXPL) {
      const o = refs.current[e.key]
      if (!o) continue
      const lift = hoverPart.current === e.part && !reduced ? 0.055 : 0
      o.position.set(
        e.base[0] + e.dir[0] * ex,
        e.base[1] + e.dir[1] * ex + lift,
        e.base[2] + e.dir[2] * ex,
      )
    }

    // props spin-up after boot; slow-down at the landing pad
    const padFactor = Math.min(1, Math.max(0, (sceneState.f - 5.6) / 0.6))
    const target = booted ? (reduced ? 8 : 30) * (1 - padFactor * 0.85) : 0
    rpm.current = THREE.MathUtils.damp(rpm.current, target, 1.3, dt)
    for (let i = 0; i < propRefs.current.length; i++) {
      const p = propRefs.current[i]
      if (p) p.rotation.y += (i % 2 ? -1 : 1) * rpm.current * dt
    }

    if (shadowMat.current) {
      shadowMat.current.opacity = 0.16 + ex * 0.04 - Math.min(0.08, Math.abs(bob))
    }
  })

  const mats = useMemo(
    () => ({
      carbon: new THREE.MeshStandardMaterial({
        map: carbon,
        color: '#ffffff',
        roughness: 0.52,
        metalness: 0.35,
        flatShading: true,
      }),
      frame: new THREE.MeshStandardMaterial({ color: pal.frame, roughness: 0.5, metalness: 0.35, flatShading: true }),
      dark: new THREE.MeshStandardMaterial({ color: pal.frameDark, roughness: 0.55, metalness: 0.3, flatShading: true }),
      metal: new THREE.MeshStandardMaterial({ color: pal.metal, roughness: 0.32, metalness: 0.85, flatShading: true }),
      accent: new THREE.MeshStandardMaterial({ color: pal.accent, emissive: pal.accent, emissiveIntensity: 0.5, roughness: 0.4 }),
      amber: new THREE.MeshStandardMaterial({ color: pal.amber, emissive: pal.amber, emissiveIntensity: 0.45, roughness: 0.4 }),
      anodized: new THREE.MeshStandardMaterial({ color: '#e8862e', roughness: 0.35, metalness: 0.75, flatShading: true }),
      cyanLed: new THREE.MeshStandardMaterial({ color: '#38bdf8', emissive: '#38bdf8', emissiveIntensity: 0.9, roughness: 0.3 }),
      disc: new THREE.MeshStandardMaterial({ color: pal.accent, transparent: true, opacity: 0.14, depthWrite: false }),
      blade: new THREE.MeshStandardMaterial({ color: pal.frameDark, roughness: 0.45, flatShading: true }),
    }),
    [pal, carbon],
  )

  return (
    <group ref={root} position={[2.3, 0.25, -0.5]} rotation={[0, -0.5, 0]}>
      {/* grab sphere (drag orbit) */}
      <mesh>
        <sphereGeometry args={[1.62, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} colorWrite={false} />
      </mesh>

      {/* ===== FRAME: carbon bottom plate + arms + colored standoffs ===== */}
      <group ref={reg('frame')} {...bind('frame')}>
        <mesh material={mats.carbon}>
          <boxGeometry args={[1.06, 0.07, 1.06]} />
        </mesh>
        {ARM_ANGLES.map((a, i) => (
          <group key={i} rotation={[0, -a, 0]}>
            <mesh position={[MOTOR_R * 0.62, -0.02, 0]} material={mats.carbon}>
              <boxGeometry args={[MOTOR_R * 1.24, 0.055, 0.19]} />
            </mesh>
            {/* motor mount pad */}
            <mesh position={[MOTOR_R, 0.02, 0]} material={mats.dark}>
              <cylinderGeometry args={[0.16, 0.16, 0.03, 14]} />
            </mesh>
          </group>
        ))}
        {[
          [-0.44, -0.44],
          [0.44, -0.44],
          [-0.44, 0.44],
          [0.44, 0.44],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], 0.13, p[1]]} material={i % 2 ? mats.anodized : mats.metal}>
            <cylinderGeometry args={[0.024, 0.024, 0.34, 6]} />
          </mesh>
        ))}
      </group>

      {/* ===== FC + 4-IN-1 ESC STACK (soft-mounted) ===== */}
      <group ref={reg('stack')} {...bind('stack')}>
        <mesh material={mats.dark}>
          <boxGeometry args={[0.68, 0.05, 0.68]} />
        </mesh>
        <mesh position={[0, 0.055, 0]} material={mats.frame}>
          <boxGeometry args={[0.56, 0.05, 0.56]} />
        </mesh>
        {/* UART jumper block */}
        <mesh position={[0.2, 0.09, 0.18]} material={mats.amber}>
          <boxGeometry args={[0.1, 0.03, 0.06]} />
        </mesh>
        {/* big electrolytic cap */}
        <mesh position={[-0.24, 0.1, -0.22]} material={mats.metal}>
          <cylinderGeometry args={[0.035, 0.035, 0.08, 10]} />
        </mesh>
        {/* soft-mount grommets */}
        {[
          [-0.28, -0.28],
          [0.28, -0.28],
          [-0.28, 0.28],
          [0.28, 0.28],
        ].map((p, i) => (
          <mesh key={i} position={[p[0], 0.02, p[1]]} material={mats.accent}>
            <cylinderGeometry args={[0.03, 0.038, 0.05, 8]} />
          </mesh>
        ))}
      </group>

      {/* ===== CANOPY: carbon top plate + painted pod + nose stripe ===== */}
      <group ref={reg('canopy')} {...bind('canopy')}>
        <mesh material={mats.carbon}>
          <boxGeometry args={[0.82, 0.05, 0.82]} />
        </mesh>
        <mesh position={[0, 0.11, -0.08]} rotation={[-0.09, 0, 0]} material={mats.frame}>
          <boxGeometry args={[0.46, 0.16, 0.58]} />
        </mesh>
        <mesh position={[0, 0.115, 0.21]} rotation={[-0.09, 0, 0]} material={mats.anodized}>
          <boxGeometry args={[0.47, 0.04, 0.05]} />
        </mesh>
      </group>

      {/* ===== BATTERY + STRAP + BUCKLE ===== */}
      <group ref={reg('battery')} {...bind('battery')}>
        <mesh material={mats.dark}>
          <boxGeometry args={[0.44, 0.15, 0.82]} />
        </mesh>
        <mesh material={mats.frame}>
          <boxGeometry args={[0.46, 0.17, 0.07]} />
        </mesh>
        <mesh position={[0, 0, 0.19]} material={mats.metal}>
          <boxGeometry args={[0.48, 0.06, 0.03]} />
        </mesh>
      </group>

      {/* ===== FPV CAM / AIR UNIT (adjustable tilt mount) ===== */}
      <group ref={reg('cam')} {...bind('cam')}>
        {[-0.17, 0.17].map((x) => (
          <mesh key={x} position={[x, 0, 0.02]} rotation={[0.32, 0, 0]} material={mats.frame}>
            <boxGeometry args={[0.02, 0.2, 0.14]} />
          </mesh>
        ))}
        <mesh position={[0, 0, 0.04]} rotation={[0.32, 0, 0]} material={mats.dark}>
          <boxGeometry args={[0.3, 0.22, 0.1]} />
        </mesh>
        <mesh position={[0, 0.015, 0.1]} rotation={[Math.PI / 2 - 0.32, 0, 0]} material={mats.metal}>
          <cylinderGeometry args={[0.055, 0.06, 0.06, 16]} />
        </mesh>
        <mesh position={[0, 0.017, 0.132]} rotation={[Math.PI / 2 - 0.32, 0, 0]}>
          <cylinderGeometry args={[0.034, 0.034, 0.008, 16]} />
          <meshStandardMaterial color="#0a1626" emissive="#38bdf8" emissiveIntensity={0.35} roughness={0.1} metalness={0.2} />
        </mesh>
      </group>

      {/* ===== MOTORS (anodized bells) + PROPS ===== */}
      {ARM_ANGLES.map((a, i) => {
        const dx = Math.cos(a)
        const dz = Math.sin(a)
        return (
          <group key={`mp${i}`}>
            <group ref={reg(`motor${i}`)} {...bind('motors')}>
              {/* stator / base */}
              <mesh position={[0, -0.05, 0]} material={mats.dark}>
                <cylinderGeometry args={[0.12, 0.135, 0.09, 12]} />
              </mesh>
              {/* anodized bell */}
              <mesh material={mats.anodized}>
                <cylinderGeometry args={[0.145, 0.13, 0.1, 14]} />
              </mesh>
              {/* bell top cap */}
              <mesh position={[0, 0.065, 0]} material={mats.metal}>
                <cylinderGeometry args={[0.1, 0.11, 0.03, 14]} />
              </mesh>
            </group>
            <group
              ref={(o) => {
                if (o) propRefs.current[i] = o
                reg(`prop${i}`)(o)
              }}
              position={[dx * MOTOR_R, 0.17, dz * MOTOR_R]}
              {...bind('props')}
            >
              <mesh material={mats.disc}>
                <cylinderGeometry args={[0.56, 0.56, 0.006, 20]} />
              </mesh>
              {[0, 1].map((b) => (
                <mesh key={b} rotation={[b ? 0.14 : -0.14, b ? Math.PI : 0, 0]} material={mats.blade}>
                  <boxGeometry args={[1.02, 0.012, 0.055]} />
                </mesh>
              ))}
              {/* colored prop nut */}
              <mesh material={i % 2 ? mats.accent : mats.amber}>
                <cylinderGeometry args={[0.036, 0.036, 0.026, 8]} />
              </mesh>
            </group>
          </group>
        )
      })}

      {/* ===== VTX + RX ANTENNA TUBES + BEEPER ===== */}
      <group ref={reg('vtx')} {...bind('vtx')}>
        <mesh material={mats.frame}>
          <boxGeometry args={[0.36, 0.09, 0.24]} />
        </mesh>
        {/* VTX antenna tube */}
        <mesh position={[-0.1, 0.16, -0.08]} rotation={[-0.85, 0, 0.15]} material={mats.metal}>
          <cylinderGeometry args={[0.018, 0.022, 0.5, 8]} />
        </mesh>
        <mesh position={[-0.19, 0.34, -0.24]} material={mats.dark}>
          <sphereGeometry args={[0.03, 8, 8]} />
        </mesh>
        {/* dual RX antennas */}
        <mesh position={[0.1, 0.12, -0.05]} rotation={[-0.5, 0, -0.55]} material={mats.metal}>
          <cylinderGeometry args={[0.008, 0.01, 0.4, 6]} />
        </mesh>
        <mesh position={[0.17, 0.2, -0.14]} rotation={[-0.5, 0, -0.35]} material={mats.metal}>
          <cylinderGeometry args={[0.008, 0.01, 0.4, 6]} />
        </mesh>
        {/* beeper */}
        <mesh position={[0, 0.075, 0]} rotation={[Math.PI / 2, 0, 0]} material={mats.dark}>
          <cylinderGeometry args={[0.045, 0.045, 0.05, 10]} />
        </mesh>
      </group>

      {/* ===== TAIL LED BAR + NAV LIGHTS ===== */}
      <group ref={reg('leds')} {...bind('leds')}>
        <mesh position={[0, -0.02, -0.98]} material={mats.cyanLed}>
          <boxGeometry args={[0.52, 0.03, 0.025]} />
        </mesh>
        <mesh position={[Math.cos(2.62) * MOTOR_R, -0.02, Math.sin(2.62) * MOTOR_R]} material={mats.amber}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>
        <mesh position={[Math.cos(3.67) * MOTOR_R, -0.02, Math.sin(3.67) * MOTOR_R]} material={mats.accent}>
          <sphereGeometry args={[0.035, 8, 8]} />
        </mesh>
      </group>

      {/* blob shadow */}
      <mesh position={[0, -1.52, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[1.05, 24]} />
        <meshStandardMaterial ref={shadowMat} color="#000000" transparent opacity={0.16} depthWrite={false} />
      </mesh>
    </group>
  )
}


