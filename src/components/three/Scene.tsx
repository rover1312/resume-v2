import { Suspense, useMemo } from 'react'
import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { useUI } from '../../stores/ui'
import { getPalette } from '../../lib/palette'
import { CameraRig } from './CameraRig'
import { Drone } from './Drone'
import { Particles } from './Particles'
import { GridFloors } from './GridFloors'
import { LandingPad } from './LandingPad'
import { PcbBoard } from './PcbBoard'

export default function Scene() {
  const theme = useUI((s) => s.theme)
  const pal = useMemo(() => getPalette(theme), [theme])

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 44, near: 0.1, far: 140, position: [0, 0, 9] }}
      style={{ touchAction: 'pan-y' }}
    >
      <color attach="background" args={[pal.bg]} />
      <fog attach="fog" args={[pal.bg, 11, 44]} />

      <hemisphereLight args={[pal.gridA, pal.frameDark, 1.05]} />
      <directionalLight position={[6, 9, 7]} intensity={1.25} />
      <directionalLight position={[-5, 3, -6]} intensity={0.35} />
      <ambientLight intensity={0.28} />

      <CameraRig />
      <GridFloors />
      <Particles />
      <LandingPad />
      <PcbBoard />

      <Suspense fallback={null}>
        <Drone />
      </Suspense>
    </Canvas>
  )
}
