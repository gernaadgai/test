import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { X, ScanLine, PartyPopper, Sparkles, Check, ChevronRight } from 'lucide-react'
import { ScreenHeader } from '../components/ScreenHeader'
import { AnimalIcon } from '../components/AnimalIcon'
import { CharacterBuddy } from '../components/CharacterBuddy'
import { ConfettiBurst } from '../components/ConfettiBurst'
import { CHARACTERS } from '../data/characters'
import { getCollection } from '../data/collections'
import { getBadge } from '../data/badges'
import { useCollectionStore } from '../store/useCollectionStore'
import { sound } from '../lib/sound'
import { ShareButton } from '../components/ShareButton'
import type { ShareCardConfig } from '../lib/shareCard'

type Phase = 'pick' | 'scanning' | 'revealed' | 'complete'

export function ScanScreen() {
  const navigate = useNavigate()
  const unlockedIds = useCollectionStore((s) => s.unlockedCharacterIds)
  const unlockCharacter = useCollectionStore((s) => s.unlockCharacter)
  const receiveDuplicate = useCollectionStore((s) => s.receiveDuplicate)

  const locked = useMemo(() => CHARACTERS.filter((c) => !unlockedIds.includes(c.id)), [unlockedIds])
  const owned = useMemo(() => CHARACTERS.filter((c) => unlockedIds.includes(c.id)), [unlockedIds])
  const isDuplicateRun = locked.length === 0
  const pickList = isDuplicateRun ? owned : locked

  const [targetId, setTargetId] = useState(pickList[0]?.id ?? '')
  const [phase, setPhase] = useState<Phase>('pick')
  const [completedCollection, setCompletedCollection] = useState<string | null>(null)
  const [duplicateAdded, setDuplicateAdded] = useState(false)
  const [discovered, setDiscovered] = useState(false)

  const character = CHARACTERS.find((c) => c.id === targetId)
  const collection = character ? getCollection(character.collectionId) : undefined

  if (pickList.length === 0) {
    return (
      <div className="px-5">
        <ScreenHeader titleMn="Скан" titleEn="Scan" back />
        <div className="rounded-3xl bg-paper border border-forest/10 p-8 text-center mt-4">
          <p className="text-4xl mb-3">🎉</p>
          <p className="font-display font-extrabold text-lg text-forest">Одоохондоо скандах зүйлгүй</p>
          <p className="text-sm text-ink-soft/60 mt-2">Эхний GER NAADGAI цуглуулгаа аваад скандаж эхэл.</p>
        </div>
      </div>
    )
  }

  function startScan() {
    setPhase('scanning')
    setDuplicateAdded(false)
    setDiscovered(false)
    sound.scanBeep()
    setTimeout(() => {
      setPhase('revealed')
      sound.unlock()
    }, 1600)
  }

  function addToCollection() {
    if (!character) return
    if (isDuplicateRun) {
      receiveDuplicate(character.id)
      sound.pop()
      setDuplicateAdded(true)
      return
    }
    const result = unlockCharacter(character.id)
    if (result.completedCollectionId) {
      setCompletedCollection(result.completedCollectionId)
      setPhase('complete')
    } else {
      sound.success()
      setDiscovered(true)
    }
  }

  const isSpecial = character?.rarity === 'legendary' || character?.rarity === 'rare'
  const discoveryShareConfig: ShareCardConfig | null = character
    ? {
        kind: isSpecial ? 'special-discovery' : 'discovery',
        accent: character.accent,
        animal: character.animal,
        badgeMn: isSpecial ? 'Онцгой нээлт' : 'Шинэ нээлт',
        titleMn: character.nameMn,
        titleEn: character.nameEn,
        metaMn: collection ? `${collection.nameMn} · #${String(character.number).padStart(2, '0')}` : undefined,
        bodyMn: character.factMn,
      }
    : null

  return (
    <div className="min-h-dvh flex flex-col">
      <div className="flex items-center justify-between px-5 pt-6">
        <div>
          <p className="font-display font-extrabold text-lg text-forest">Цуглуулга Олох</p>
          <p className="text-[11px] text-ink-soft/45">Scan a Collectible</p>
        </div>
        <button onClick={() => navigate(-1)} className="w-9 h-9 rounded-full bg-paper border border-forest/10 flex items-center justify-center">
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 px-5 mt-4">
        {phase === 'pick' && (
          <div>
            <p className="text-sm font-medium text-ink-soft/70 mb-3">
              {isDuplicateRun
                ? 'Бүх цуглуулга олдлоо! Дахин скандаж шинэ хайрцгаас халтаас олохыг туршиж үзье:'
                : 'Загвар туршилт — аль физик QR кодыг скандах вэ?'}
            </p>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {pickList.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setTargetId(c.id)}
                  className={`rounded-2xl p-3 flex flex-col items-center gap-1 border-2 transition-colors ${
                    targetId === c.id ? 'border-terracotta bg-terracotta/10' : 'border-forest/10 bg-paper'
                  }`}
                >
                  <AnimalIcon animal={c.animal} className="w-10 h-10" lineColor={c.accent} bodyColor="#FFF9ED" />
                  <span className="text-[10px] font-bold text-center leading-tight">{c.nameMn}</span>
                </button>
              ))}
            </div>

            <div className="rounded-[28px] border-4 border-dashed border-forest/25 aspect-square flex flex-col items-center justify-center gap-3 bg-forest/5">
              <ScanLine size={40} className="text-forest/50" />
              <p className="text-xs text-ink-soft/50 px-8 text-center font-medium">GER NAADGAI хайрцаг доторх QR кодыг чиглүүл</p>
            </div>

            <button
              onClick={startScan}
              className="w-full mt-6 rounded-2xl bg-terracotta text-cream font-display font-extrabold py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
            >
              QR СКАНДАХ
            </button>
          </div>
        )}

        {phase === 'scanning' && character && (
          <div className="rounded-[28px] border-4 border-forest/25 aspect-square relative overflow-hidden bg-forest/5 flex items-center justify-center">
            <p className="text-sm font-semibold text-ink-soft/50">Скандаж байна: {character.qrCode}…</p>
            <motion.div
              className="absolute left-3 right-3 h-1 rounded-full bg-terracotta shadow-[0_0_12px_rgba(196,90,60,0.7)]"
              animate={{ top: ['8%', '92%', '8%'] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="absolute inset-4 border-2 border-terracotta/40 rounded-2xl" />
          </div>
        )}

        {phase === 'revealed' && character && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: -25 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            className="relative rounded-[28px] overflow-hidden border-2"
            style={{ borderColor: `${character.accent}35`, background: `linear-gradient(180deg, ${character.accent}1a, #FFFEFA 55%)` }}
          >
            {!duplicateAdded && !discovered && <ConfettiBurst colors={[character.accent, '#E7B85C', '#FFFEFA']} />}

            <div className="flex items-center justify-between px-6 pt-5">
              <span className="font-display font-extrabold text-xs tracking-wide text-forest">GER NAADGAI</span>
              {discovered && !isDuplicateRun && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-[10px] font-bold uppercase tracking-wide text-forest flex items-center gap-1"
                >
                  ✦ НЭЭГДЛЭЭ ✦
                </motion.span>
              )}
            </div>

            <div className="flex flex-col items-center text-center px-8 pt-2 pb-8">
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta flex items-center gap-1.5 mt-2"
              >
                <Sparkles size={14} />{' '}
                {isDuplicateRun
                  ? 'ЭНЭ АЛЬ ХЭДИЙН БАЙНА!'
                  : character.rarity === 'legendary' || character.rarity === 'rare'
                    ? 'ОНЦГОЙ НЭЭЛТ!'
                    : 'ШИНЭ НЭЭЛТ!'}
              </motion.p>
              <motion.div
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
                className="w-32 h-32 rounded-full flex items-center justify-center my-4 border-4"
                style={{ backgroundColor: `${character.accent}22`, borderColor: `${character.accent}30` }}
              >
                <CharacterBuddy
                  animal={character.animal}
                  state={discovered || duplicateAdded ? 'celebrating' : isDuplicateRun ? 'idle' : 'excited'}
                  size={104}
                  lineColor={character.accent}
                />
              </motion.div>
              <h2 className="font-display font-extrabold text-2xl" style={{ color: character.accent }}>{character.nameMn}</h2>
              <p className="text-xs text-ink-soft/50">{character.nameEn}</p>
              <p className="text-xs font-bold text-ink-soft/60 mt-2 uppercase tracking-wide">
                {collection?.nameMn} · #{String(character.number).padStart(2, '0')}
              </p>

              {!isDuplicateRun && (
                <div className="rounded-xl bg-gold/12 px-4 py-3 mt-4">
                  <p className="text-xs text-ink-soft/70 italic leading-relaxed">"{character.factMn}"</p>
                </div>
              )}
              {isDuplicateRun && (
                <p className="text-xs font-medium text-ink-soft/60 mt-2 max-w-[220px]">Халтаас хувь — үлдээж болно, эсвэл NAADGAI оноогоор солино.</p>
              )}

              {isDuplicateRun ? (
                <div className="w-full mt-6">
                  {duplicateAdded ? (
                    <button
                      onClick={() => navigate('/market/exchange')}
                      className="w-full rounded-2xl bg-terracotta text-cream font-display font-extrabold py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
                    >
                      ХАЛТААС СОЛИЛЦОХ →
                    </button>
                  ) : (
                    <button
                      onClick={addToCollection}
                      className="w-full rounded-2xl bg-forest text-cream font-display font-extrabold py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
                    >
                      ХАЛТААСАНД НЭМЭХ
                    </button>
                  )}
                </div>
              ) : (
                <div className="w-full mt-6 flex flex-col gap-2.5">
                  <div className="flex gap-2.5">
                    <button
                      onClick={addToCollection}
                      disabled={discovered}
                      className={`flex-1 flex items-center justify-center gap-1.5 rounded-2xl py-4 font-display font-extrabold text-sm shadow-[var(--shadow-pop)] transition-transform ${
                        discovered ? 'bg-forest/20 text-forest cursor-default' : 'bg-forest text-cream active:scale-[0.98]'
                      }`}
                    >
                      {discovered ? (
                        <>
                          <Check size={16} /> НЭЭГДСЭН
                        </>
                      ) : (
                        'ЦУГЛУУЛГАДАА НЭМЭХ'
                      )}
                    </button>
                    {discoveryShareConfig && (
                      <div className="flex-1">
                        <ShareButton
                          variant="solid"
                          accent={character.accent}
                          label="ХУВААЛЦАХ"
                          className="w-full !py-4"
                          config={discoveryShareConfig}
                        />
                      </div>
                    )}
                  </div>
                  {discovered && (
                    <button
                      onClick={() => navigate(`/collection/${character.id}`)}
                      className="w-full flex items-center justify-center gap-1 text-xs font-bold text-forest/70 py-1.5"
                    >
                      Дүрээ харах <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {phase === 'complete' && completedCollection && (
          <CompletionCelebration collectionId={completedCollection} onDone={() => navigate('/collection')} />
        )}
      </div>
    </div>
  )
}

function CompletionCelebration({ collectionId, onDone }: { collectionId: string; onDone: () => void }) {
  const collection = getCollection(collectionId)

  useEffect(() => {
    sound.complete()
  }, [])

  if (!collection) return null
  const badge = getBadge(collection.completionReward.badgeId)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="relative rounded-[28px] p-8 flex flex-col items-center text-center bg-gradient-to-b from-gold/25 to-terracotta/15"
    >
      <ConfettiBurst count={26} />
      <motion.div animate={{ rotate: [0, -8, 8, -8, 0] }} transition={{ duration: 1, repeat: Infinity, repeatDelay: 1 }}>
        <PartyPopper size={40} className="text-terracotta" />
      </motion.div>
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-terracotta mt-3">ЦУГЛУУЛГА БҮРДЛЭЭ!</p>
      <h2 className="font-display font-extrabold text-2xl text-forest mt-1">{collection.completionReward.titleMn}</h2>
      <p className="text-xs text-ink-soft/50 mt-0.5">{collection.completionReward.titleEn}</p>
      <p className="text-sm font-medium text-ink-soft/70 mt-3 leading-relaxed">{collection.completionReward.description}</p>

      {badge && (
        <div className="flex flex-col items-center gap-1 mt-5 bg-paper rounded-2xl px-6 py-4 border border-gold/40">
          <span className="text-3xl">{badge.icon}</span>
          <span className="font-display font-extrabold text-xs text-forest">{badge.nameMn}</span>
        </div>
      )}

      <div className="w-full flex flex-col gap-3 mt-6">
        <ShareButton
          variant="solid"
          accent="#B85C45"
          label="Амжилтаа Хуваалц"
          config={
            {
              kind: 'collection-complete',
              accent: '#B85C45',
              badgeMn: 'Цуглуулга бүрдлээ',
              titleMn: collection.completionReward.titleMn,
              titleEn: collection.completionReward.titleEn,
              metaMn: collection.nameMn,
            } satisfies ShareCardConfig
          }
        />
        <button
          onClick={onDone}
          className="w-full rounded-2xl bg-forest text-cream font-display font-extrabold py-4 shadow-[var(--shadow-pop)] active:scale-[0.98] transition-transform"
        >
          ЦУГЛУУЛГАА ХАРАХ
        </button>
      </div>
    </motion.div>
  )
}
