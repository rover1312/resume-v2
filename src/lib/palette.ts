import * as THREE from 'three'

export type ThemeName = 'dark' | 'light'

export interface Palette {
  bg: number
  gridA: number
  gridB: number
  frame: number
  frameDark: number
  metal: number
  accent: number
  amber: number
  particle: number
  board: number
}

const DARK: Palette = {
  bg: new THREE.Color('#24282f').getHex(),
  gridA: new THREE.Color('#3a4250').getHex(),
  gridB: new THREE.Color('#2a303a').getHex(),
  frame: new THREE.Color('#39404c').getHex(),
  frameDark: new THREE.Color('#262c34').getHex(),
  metal: new THREE.Color('#5b6673').getHex(),
  accent: new THREE.Color('#4ade80').getHex(),
  amber: new THREE.Color('#fbbf24').getHex(),
  particle: new THREE.Color('#4ade80').getHex(),
  board: new THREE.Color('#1d2733').getHex(),
}

const LIGHT: Palette = {
  bg: new THREE.Color('#e6e9ef').getHex(),
  gridA: new THREE.Color('#c2c9d4').getHex(),
  gridB: new THREE.Color('#d9dee6').getHex(),
  frame: new THREE.Color('#55606e').getHex(),
  frameDark: new THREE.Color('#454f5c').getHex(),
  metal: new THREE.Color('#8d97a5').getHex(),
  accent: new THREE.Color('#16a34a').getHex(),
  amber: new THREE.Color('#d97706').getHex(),
  particle: new THREE.Color('#16a34a').getHex(),
  board: new THREE.Color('#c8d1da').getHex(),
}

export function getPalette(theme: ThemeName): Palette {
  return theme === 'light' ? LIGHT : DARK
}
