export type PartId =
  | 'frame'
  | 'motors'
  | 'props'
  | 'canopy'
  | 'battery'
  | 'cam'
  | 'stack'
  | 'vtx'
  | 'leds'

export interface PartDef {
  label: string
  detail: string
}

export const PART_DEFS: Record<PartId, PartDef> = {
  frame: { label: 'AIRFRAME', detail: '5-INCH TRUE-X · CARBON TWILL PLATES' },
  motors: { label: 'MOTORS', detail: '2207 · 1750KV · ANODIZED BELLS' },
  props: { label: 'PROPS', detail: '5×4.3×3 TRI-BLADE · COLOR LOCK NUTS' },
  canopy: { label: 'CANOPY', detail: 'MOLDED POD · TOP PLATE' },
  battery: { label: 'BATTERY', detail: '6S 1300MAH LIPO · STRAP' },
  cam: { label: 'FPV CAM / AIR UNIT', detail: 'O3 · ADJ TILT 32° — SHUTTERLINK TARGET' },
  stack: { label: 'FC + 4-IN-1 ESC', detail: 'SOFT-MOUNTED STACK · GROMMETS' },
  vtx: { label: 'VTX + RX ANTENNAS', detail: '5.8GHZ VIDEO · DUAL RX TUBES · BEEPER' },
  leds: { label: 'TAIL LED BAR', detail: 'STATUS PATTERNS · NAV LIGHTS' },
}

export function emitPartHover(id: PartId | null) {
  window.dispatchEvent(new CustomEvent('fd-part-hover', { detail: id }))
}
