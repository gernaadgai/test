import { useSettingsStore } from '../store/useSettingsStore'

let ctx: AudioContext | null = null

function getCtx() {
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new AC()
  }
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function tone(freq: number, startOffset: number, duration: number, gainPeak = 0.08, type: OscillatorType = 'sine') {
  const c = getCtx()
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  const start = c.currentTime + startOffset
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(gainPeak, start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

function play(fn: () => void) {
  if (!useSettingsStore.getState().soundEnabled) return
  try {
    fn()
  } catch {
    // audio not available (autoplay policy, unsupported browser) — fail silently
  }
}

export const sound = {
  tap: () => play(() => tone(720, 0, 0.08, 0.05, 'triangle')),
  pop: () => play(() => tone(880, 0, 0.1, 0.07, 'triangle')),
  scanBeep: () => play(() => tone(500, 0, 0.06, 0.05, 'square')),
  unlock: () =>
    play(() => {
      tone(523, 0, 0.14, 0.07)
      tone(659, 0.08, 0.16, 0.07)
      tone(784, 0.16, 0.22, 0.08)
    }),
  success: () =>
    play(() => {
      tone(659, 0, 0.16, 0.07)
      tone(880, 0.1, 0.22, 0.08)
    }),
  complete: () =>
    play(() => {
      tone(523, 0, 0.16, 0.07)
      tone(659, 0.12, 0.16, 0.07)
      tone(784, 0.24, 0.16, 0.07)
      tone(1047, 0.36, 0.32, 0.09)
    }),
}
