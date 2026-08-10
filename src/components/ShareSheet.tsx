import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Download, Share2, Loader2 } from 'lucide-react'
import { renderShareCard, canvasToBlob, type ShareCardConfig, type ShareFormat } from '../lib/shareCard'
import { sound } from '../lib/sound'

interface Props {
  open: boolean
  onClose: () => void
  config: ShareCardConfig
}

const FORMATS: { id: ShareFormat; labelMn: string; labelEn: string }[] = [
  { id: 'square', labelMn: 'Дөрвөлжин', labelEn: 'Square' },
  { id: 'post', labelMn: 'Пост', labelEn: 'Post' },
  { id: 'story', labelMn: 'Сторис', labelEn: 'Story' },
]

export function ShareSheet({ open, onClose, config }: Props) {
  const [format, setFormat] = useState<ShareFormat>('square')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const canCancel = useRef(false)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    canCancel.current = false
    setLoading(true)
    renderShareCard(config, format).then((canvas) => {
      if (cancelled) return
      setPreviewUrl(canvas.toDataURL('image/png'))
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [open, format, config])

  async function handleSave() {
    const canvas = await renderShareCard(config, format)
    const blob = await canvasToBlob(canvas)
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `ger-naadgai-${config.kind}-${format}.png`
    a.click()
    URL.revokeObjectURL(url)
    sound.success()
  }

  async function handleNativeShare() {
    const canvas = await renderShareCard(config, format)
    const blob = await canvasToBlob(canvas)
    if (!blob) return
    const file = new File([blob], `ger-naadgai-${config.kind}.png`, { type: 'image/png' })
    const nav = navigator as Navigator & { canShare?: (data: { files: File[] }) => boolean; share?: (data: ShareData) => Promise<void> }
    if (nav.canShare && nav.canShare({ files: [file] }) && nav.share) {
      try {
        await nav.share({ files: [file], title: 'GER NAADGAI', text: config.titleMn })
        sound.success()
      } catch {
        // user cancelled the native share sheet — no-op
      }
    } else {
      handleSave()
    }
  }

  const nativeShareAvailable = typeof navigator !== 'undefined' && 'share' in navigator

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-ink/55 flex items-end justify-center z-50">
          <motion.div
            initial={{ y: 300 }}
            animate={{ y: 0 }}
            exit={{ y: 300 }}
            transition={{ type: 'spring', stiffness: 240, damping: 26 }}
            className="w-full max-w-[480px] bg-paper rounded-t-[28px] p-6 pb-8 max-h-[88vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-display font-extrabold text-base text-forest">Нээлтээ Хуваалц</p>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-cream-dark flex items-center justify-center">
                <X size={16} />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-cream-dark/40 flex items-center justify-center mb-4" style={{ aspectRatio: format === 'story' ? '9/16' : format === 'post' ? '4/5' : '1/1' }}>
              {loading || !previewUrl ? (
                <Loader2 size={28} className="text-forest/40 animate-spin" />
              ) : (
                <img src={previewUrl} alt="Share preview" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="flex gap-2 mb-5">
              {FORMATS.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFormat(f.id)}
                  className={`flex-1 rounded-full py-2 text-xs font-bold transition-colors ${
                    format === f.id ? 'bg-forest text-cream' : 'bg-cream-dark text-ink-soft/60'
                  }`}
                >
                  {f.labelMn}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display font-extrabold text-sm border-2 border-forest/15 text-forest active:scale-[0.98] transition-transform"
              >
                <Download size={17} /> Хадгалах
              </button>
              {nativeShareAvailable && (
                <button
                  onClick={handleNativeShare}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl py-3.5 font-display font-extrabold text-sm text-cream bg-terracotta active:scale-[0.98] transition-transform"
                >
                  <Share2 size={17} /> Хуваалцах
                </button>
              )}
            </div>
            <p className="text-[11px] text-ink-soft/40 text-center mt-4">
              Зурагт хувийн мэдээлэл ороогүй болно — зөвхөн дүр болон брэндийн зураг.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
