import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { sceneState } from '../../lib/sceneState'
import { useUI } from '../../stores/ui'
import { evalPose, type EvaluatedPose } from './poses'

const _pose: EvaluatedPose = {
  cam: new THREE.Vector3(),
  look: new THREE.Vector3(),
  ap: new THREE.Vector3(),
  s: 1,
  ry: 0,
}

export function CameraRig() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const lookRef = useRef(new THREE.Vector3(0, 0.15, 0))
  const fovRef = useRef(44)

  useFrame((state, dt) => {
    const reduced = useUI.getState().reducedMotion
    const fpv = useUI.getState().fpvMode

    const p = sceneState.p
    const f = Math.min(6, Math.max(0, p * 6))
    sceneState.f = f
    evalPose(f, _pose)

    let lam = reduced ? 100 : 2.8

    if (fpv) {
      // chase-cam just behind and above the drone
      _pose.cam.set(
        sceneState.dronePos.x,
        sceneState.dronePos.y + 0.5,
        sceneState.dronePos.z + 2.4,
      )
      _pose.look.set(sceneState.dronePos.x, sceneState.dronePos.y - 0.05, sceneState.dronePos.z - 6)
      lam = reduced ? 100 : 4.2
    }

    const c = camera.position
    c.x = THREE.MathUtils.damp(c.x, _pose.cam.x, lam, dt)
    c.y = THREE.MathUtils.damp(c.y, _pose.cam.y, lam, dt)
    c.z = THREE.MathUtils.damp(c.z, _pose.cam.z, lam, dt)

    const l = lookRef.current
    l.x = THREE.MathUtils.damp(l.x, _pose.look.x, lam + 0.4, dt)
    l.y = THREE.MathUtils.damp(l.y, _pose.look.y, lam + 0.4, dt)
    l.z = THREE.MathUtils.damp(l.z, _pose.look.z, lam + 0.4, dt)
    camera.lookAt(l)

    const fovT = fpv ? 82 : 44
    if (Math.abs(fovRef.current - fovT) > 0.05) {
      fovRef.current = THREE.MathUtils.damp(fovRef.current, fovT, 3.2, dt)
      camera.fov = fovRef.current
      camera.updateProjectionMatrix()
    }

    if (fpv && !reduced) {
      const t = state.clock.elapsedTime
      camera.rotateZ(Math.sin(t * 0.7) * 0.03)
      camera.position.y += Math.sin(t * 9.3) * 0.006
    }
  })

  return null
}
