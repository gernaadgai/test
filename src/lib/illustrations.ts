/**
 * Drop-in illustration registry. Any file placed in src/assets/illustrations/
 * is picked up automatically by filename (no import statements needed) — e.g.
 * saving horse.png makes getIllustration('horse') return its URL.
 *
 * Recognised keys today:
 *   Animals   — horse, camel, sheep, goat, cow (matches Character['animal'])
 *   Hero world — ger, girl, boy, horse-hero, sky-bg
 *   Currency  — shagai
 *
 * Until a file exists for a given key, every consuming component falls back
 * to its current hand-drawn SVG — nothing breaks if only some assets land.
 */
const modules = import.meta.glob('/src/assets/illustrations/*.{png,webp,jpg,jpeg,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const REGISTRY: Record<string, string> = {}
for (const path in modules) {
  const name = path.split('/').pop()!.replace(/\.[^.]+$/, '')
  REGISTRY[name] = modules[path]
}

export function getIllustration(key: string): string | undefined {
  return REGISTRY[key]
}
