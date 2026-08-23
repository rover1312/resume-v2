import * as THREE from 'three'

export const N_SECTIONS = 7
export const ZONE_STEP = 11

export interface Pose {
  cam: [number, number, number]
  look: [number, number, number]
  /** drone anchor */
  ap: [number, number, number]
  s: number
  ry: number
}

export const POSES: Pose[] = [
  // 0 hero / tarmac
  { cam: [0, 0, 9], look: [-0.6, 0.15, 0], ap: [2.3, 0.25, -0.5], s: 1, ry: -0.5 },
  // 1 who am i
  { cam: [0.4, -ZONE_STEP, 8.8], look: [-0.2, -ZONE_STEP + 0.1, 0], ap: [2.9, -ZONE_STEP + 0.75, -3.5], s: 0.72, ry: 0.5 },
  // 2 mission log
  { cam: [-0.3, -2 * ZONE_STEP, 9], look: [0.2, -2 * ZONE_STEP + 0.1, 0], ap: [-3.1, -2 * ZONE_STEP + 1.1, -4], s: 0.62, ry: -0.2 },
  // 3 hangar (exploded view stage)
  { cam: [0, -3 * ZONE_STEP, 7.4], look: [0.4, -3 * ZONE_STEP + 0.2, 0], ap: [2.2, -3 * ZONE_STEP + 0.9, -1], s: 1.05, ry: 0.65 },
  // 4 open source (pcb stage)
  { cam: [0, -4 * ZONE_STEP, 8.6], look: [0.5, -4 * ZONE_STEP + 0.1, 0], ap: [-2.9, -4 * ZONE_STEP + 0.8, -3], s: 0.6, ry: 0.35 },
  // 5 systems
  { cam: [0.2, -5 * ZONE_STEP, 9.2], look: [-0.2, -5 * ZONE_STEP + 0.1, 0], ap: [2.8, -5 * ZONE_STEP + 0.7, -2.5], s: 0.66, ry: -0.6 },
  // 6 comms / landing pad
  { cam: [0, -6 * ZONE_STEP + 1.4, 10], look: [0, -6 * ZONE_STEP, 0], ap: [0, -6 * ZONE_STEP + 0.13, 0], s: 0.92, ry: 0 },
]

export interface EvaluatedPose {
  cam: THREE.Vector3
  look: THREE.Vector3
  ap: THREE.Vector3
  s: number
  ry: number
}

const tmpA: Pose = { cam: [0, 0, 0], look: [0, 0, 0], ap: [0, 0, 0], s: 1, ry: 0 }

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function evalPose(f: number, out?: EvaluatedPose): EvaluatedPose {
  const o =
    out ??
    ({
      cam: new THREE.Vector3(),
      look: new THREE.Vector3(),
      ap: new THREE.Vector3(),
      s: 1,
      ry: 0,
    } as EvaluatedPose)

  const clamped = Math.min(N_SECTIONS - 1, Math.max(0, f))
  const i = Math.min(N_SECTIONS - 2, Math.floor(clamped))
  let t = clamped - i
  t = t * t * (3 - 2 * t)

  const a = POSES[i]
  const b = POSES[i + 1]

  o.cam.set(lerp(a.cam[0], b.cam[0], t), lerp(a.cam[1], b.cam[1], t), lerp(a.cam[2], b.cam[2], t))
  o.look.set(
    lerp(a.look[0], b.look[0], t),
    lerp(a.look[1], b.look[1], t),
    lerp(a.look[2], b.look[2], t),
  )
  void tmpA
  o.ap.set(lerp(a.ap[0], b.ap[0], t), lerp(a.ap[1], b.ap[1], t), lerp(a.ap[2], b.ap[2], t))
  o.s = lerp(a.s, b.s, t)
  o.ry = lerp(a.ry, b.ry, t)
  return o
}

/** zone weight for the exploded-view interaction around section 3 */
export function explodeWeight(f: number) {
  return Math.min(1, Math.max(0, 1 - Math.abs(f - 3) / 1.15))
}
