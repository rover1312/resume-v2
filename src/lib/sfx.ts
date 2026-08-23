let ctx: AudioContext | null = null

function ac(): AudioContext | null {
  try {
    if (!ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      ctx = new AC()
    }
    if (ctx.state === 'suspended') void ctx.resume()
    return ctx
  } catch {
    return null
  }
}

function blip(freq: number, dur: number, type: OscillatorType, gain: number) {
  const c = ac()
  if (!c) return
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  g.gain.setValueAtTime(gain, c.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start()
  osc.stop(c.currentTime + dur)
}

export function click() {
  blip(1800, 0.06, 'square', 0.035)
}

export function tick() {
  blip(1100, 0.045, 'square', 0.03)
}

export function toggle() {
  blip(700, 0.09, 'triangle', 0.05)
}
