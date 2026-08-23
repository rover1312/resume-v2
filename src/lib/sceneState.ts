import * as THREE from 'three'

/**
 * Mutable scene state shared between DOM (sliders, hover lists)
 * and the three.js render loop — avoids React re-renders per frame.
 */
export const sceneState = {
  /** overall scroll progress 0..1 */
  p: 0,
  /** continuous section coordinate 0..(SECTIONS-1) written by CameraRig */
  f: 0,
  /** hangar explode slider 0..1 (DOM input) */
  explode: 0,
  /** explode value after zone-weighting, consumed by Drone parts */
  explodeFinal: 0,
  /** hovered PCB trace index (-1 = none), set from OpenSource steps list */
  trace: -1,
  /** drone world position, updated every frame for FPV chase cam */
  dronePos: new THREE.Vector3(),
}
