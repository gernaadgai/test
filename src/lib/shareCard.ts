import type { AnimalId } from '../types'

export type ShareFormat = 'square' | 'story' | 'post'
export type ShareKind = 'discovery' | 'special-discovery' | 'collection-complete' | 'journey' | 'story-unlocked' | 'game-unlocked'

export interface ShareCardConfig {
  kind: ShareKind
  accent: string
  animal?: AnimalId
  badgeMn: string
  titleMn: string
  titleEn: string
  metaMn?: string
  bodyMn?: string
}

const FORMAT_SIZE: Record<ShareFormat, { w: number; h: number }> = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
  post: { w: 1080, h: 1350 },
}

const ANIMAL_EMOJI: Record<AnimalId, string> = {
  horse: '🐎',
  camel: '🐫',
  sheep: '🐑',
  goat: '🐐',
  cow: '🐄',
  mouse: '🐭',
  ox: '🐂',
  tiger: '🐯',
  rabbit: '🐰',
  dragon: '🐉',
  snake: '🐍',
  monkey: '🐒',
  rooster: '🐓',
  dog: '🐶',
  pig: '🐷',
}

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace('#', '')
  const r = parseInt(h.substring(0, 2), 16)
  const g = parseInt(h.substring(2, 4), 16)
  const b = parseInt(h.substring(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function drawMountains(ctx: CanvasRenderingContext2D, w: number, h: number, baseY: number, color: string, amplitude: number) {
  ctx.beginPath()
  ctx.moveTo(0, baseY)
  const peaks = 6
  for (let i = 0; i <= peaks; i++) {
    const x = (w / peaks) * i
    const y = baseY - (i % 2 === 0 ? amplitude : amplitude * 0.55) - (Math.sin(i) * amplitude * 0.15)
    ctx.lineTo(x, y)
  }
  ctx.lineTo(w, h)
  ctx.lineTo(0, h)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

async function ensureFonts() {
  try {
    await document.fonts.load('800 100px "Montserrat"')
    await document.fonts.load('600 40px "Montserrat"')
    await document.fonts.ready
  } catch {
    // web font API unsupported — canvas will fall back to system fonts
  }
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const test = line ? `${line} ${word}` : word
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = test
    }
  }
  if (line) lines.push(line)
  return lines
}

export async function renderShareCard(config: ShareCardConfig, format: ShareFormat): Promise<HTMLCanvasElement> {
  await ensureFonts()
  const { w, h } = FORMAT_SIZE[format]
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas

  const cream = '#FFF9ED'
  const paper = '#FFFEFA'
  const ink = '#493A30'

  // sky gradient
  const sky = ctx.createLinearGradient(0, 0, 0, h)
  sky.addColorStop(0, hexToRgba(config.accent, 0.35))
  sky.addColorStop(0.55, cream)
  sky.addColorStop(1, '#F4E5C6')
  ctx.fillStyle = sky
  ctx.fillRect(0, 0, w, h)

  // sun glow
  ctx.beginPath()
  ctx.arc(w * 0.78, h * 0.16, w * 0.14, 0, Math.PI * 2)
  ctx.fillStyle = hexToRgba('#F1D08D', 0.5)
  ctx.fill()

  // mountains
  drawMountains(ctx, w, h, h * 0.62, hexToRgba('#A9DFF0', 0.55), h * 0.09)
  drawMountains(ctx, w, h, h * 0.68, hexToRgba('#9DBB72', 0.8), h * 0.07)

  // ground band
  ctx.fillStyle = hexToRgba(config.accent, 0.12)
  ctx.fillRect(0, h * 0.7, w, h * 0.3)

  // top wordmark
  ctx.textAlign = 'left'
  ctx.fillStyle = ink
  ctx.font = '800 44px "Montserrat", sans-serif'
  ctx.fillText('GER NAADGAI', w * 0.08, h * 0.09)
  ctx.font = '600 24px "Montserrat", sans-serif'
  ctx.fillStyle = hexToRgba(ink, 0.55)
  ctx.fillText('MONGOLIA IN YOUR HANDS', w * 0.08, h * 0.09 + 34)

  // badge pill
  ctx.font = '700 26px "Montserrat", sans-serif'
  const badgeText = config.badgeMn.toUpperCase()
  const badgeWidth = ctx.measureText(badgeText).width + 64
  const badgeX = w / 2 - badgeWidth / 2
  const badgeY = h * 0.17
  ctx.beginPath()
  const radius = 30
  ctx.moveTo(badgeX + radius, badgeY)
  ctx.arcTo(badgeX + badgeWidth, badgeY, badgeX + badgeWidth, badgeY + 60, radius)
  ctx.arcTo(badgeX + badgeWidth, badgeY + 60, badgeX, badgeY + 60, radius)
  ctx.arcTo(badgeX, badgeY + 60, badgeX, badgeY, radius)
  ctx.arcTo(badgeX, badgeY, badgeX + badgeWidth, badgeY, radius)
  ctx.closePath()
  ctx.fillStyle = config.accent
  ctx.fill()
  ctx.fillStyle = paper
  ctx.textAlign = 'center'
  ctx.fillText(badgeText, w / 2, badgeY + 40)

  // medallion
  const medallionR = Math.min(w * 0.2, h * 0.16)
  const medallionY = badgeY + 60 + 56 + medallionR
  ctx.beginPath()
  ctx.arc(w / 2, medallionY, medallionR, 0, Math.PI * 2)
  ctx.fillStyle = hexToRgba(config.accent, 0.16)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(w / 2, medallionY, medallionR - 18, 0, Math.PI * 2)
  ctx.fillStyle = paper
  ctx.fill()
  ctx.font = `${Math.floor(medallionR * 1.1)}px serif`
  ctx.textBaseline = 'middle'
  ctx.fillText(config.animal ? ANIMAL_EMOJI[config.animal] : '✨', w / 2, medallionY + medallionR * 0.05)
  ctx.textBaseline = 'alphabetic'

  // title
  let y = medallionY + medallionR + 90
  ctx.fillStyle = ink
  ctx.font = '800 72px "Montserrat", sans-serif'
  const titleLines = wrapText(ctx, config.titleMn, w * 0.82)
  for (const line of titleLines) {
    ctx.fillText(line, w / 2, y)
    y += 82
  }

  ctx.font = '500 34px "Montserrat", sans-serif'
  ctx.fillStyle = hexToRgba(ink, 0.55)
  ctx.fillText(config.titleEn, w / 2, y + 6)
  y += 60

  if (config.metaMn) {
    ctx.font = '600 30px "Montserrat", sans-serif'
    ctx.fillStyle = hexToRgba(ink, 0.7)
    ctx.fillText(config.metaMn, w / 2, y + 20)
    y += 60
  }

  if (config.bodyMn) {
    ctx.font = '500 30px "Montserrat", sans-serif'
    ctx.fillStyle = hexToRgba(ink, 0.65)
    const bodyLines = wrapText(ctx, config.bodyMn, w * 0.72)
    let by = y + 40
    for (const line of bodyLines.slice(0, 3)) {
      ctx.fillText(line, w / 2, by)
      by += 42
    }
  }

  // footer ornament
  ctx.font = '600 26px "Montserrat", sans-serif'
  ctx.fillStyle = hexToRgba(ink, 0.4)
  ctx.fillText('ger-naadgai.mn', w / 2, h * 0.955)

  return canvas
}

export function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), 'image/png'))
}
