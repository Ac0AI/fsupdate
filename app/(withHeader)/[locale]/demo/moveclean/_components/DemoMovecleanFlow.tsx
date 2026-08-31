'use client'

import { useEffect, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { useParams, useRouter } from 'next/navigation'
import i18nConfig from 'i18nConfig'
import { useToastContext } from '@/common/context/toast/toast.provider'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useDemoUser } from '@/common/data/useDemoUser'
import { writeDemoSession } from '@/common/data/demoPersona'
import {
  Card,
  ErrorText,
  Field,
  Foot,
  Hero,
  Primary,
  StepBar,
  Timeline,
  areaInput,
  errorBorder,
  focusFirstInvalid,
  scrollFlowToTop,
  selectClass,
  useNoScrollAnchoring,
  press,
  pressSoft,
  rise,
} from '../../_components/flow-ui'

/**
 * Flyttstädning som hyllvara: fast pris efter RUT räknat på ytan, bokas
 * direkt i två steg. Flytten erbjuds i flödet (regel 5 på artboarden
 * Flyttsidan · regler), aldrig som paketval före.
 */

const STEP_TITLES = ['Städningen', 'Bekräfta', 'Klart'] as const
const STEP_HINTS = ['2 min', '30 sek', 'Avklarat'] as const
const HERO_TITLE = ['Berätta om städningen', 'Bekräfta bokningen', 'Städningen är bokad']
const HERO_COPY = [
  'Fast pris efter RUT, räknat på ytan. Fönsterputs, ugn och persienner ingår, och städgarantin gäller alltid.',
  'Kolla att allt stämmer. Inget dras nu.',
  'Bekräftelsen kommer via SMS. Vi matchar ett kvalitetskontrollerat städteam till din dag.',
]

const SECONDARY_KINDS = [
  { value: 'storage', label: 'Förråd' },
  { value: 'garage', label: 'Garage' },
  { value: 'attic', label: 'Vind' },
] as const

type Secondary = { id: number; kind: string; area: number }

// Prismodell för demon: baspris till 60 kvm, sedan per kvadrat. Efter RUT.
const price = (kvm: number, secondaries: Secondary[]) => {
  const extra = secondaries.reduce((sum, s) => sum + s.area, 0)
  const raw = 2995 + Math.max(0, kvm - 60) * 45 + extra * 35
  return Math.round(raw / 10) * 10
}

const formatKr = (n: number) => `${new Intl.NumberFormat('sv-SE').format(n)} kr`
const FAKE_BOOK_MS = 900

const DemoMovecleanFlow = () => {
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const { showToast } = useToastContext()
  const { activitiesList, skipChecklistItem } = useChecklistContext()
  const demoUser = useDemoUser()
  const move = demoUser.currentMove
  const pathTo = (p: string) => (locale === i18nConfig.defaultLocale ? p : `/${locale}${p}`)

  // Städdagen är oftast dagen efter flytten, när bostaden är tom.
  const dayAfterMove = (() => {
    const d = new Date(move.movingDate)
    d.setDate(d.getDate() + 1)
    return d.toISOString().slice(0, 10)
  })()

  const [step, setStep] = useState(0)
  const [booking, setBooking] = useState(false)
  const [kvm, setKvm] = useState<number>(move.fromResidenceSize ?? 0)
  const [secondaries, setSecondaries] = useState<Secondary[]>([])
  const [day, setDay] = useState(dayAfterMove)
  const [attempted, setAttempted] = useState(false)

  const rootRef = useRef<HTMLDivElement>(null)
  useNoScrollAnchoring()
  useEffect(() => {
    scrollFlowToTop(rootRef.current)
  }, [step])

  const errors: Record<string, string> = {}
  if (!kvm) errors.kvm = 'Fyll i boarean så priset blir rätt.'
  if (!day) errors.day = 'Välj vilken dag vi ska städa.'
  else if (day < new Date().toISOString().slice(0, 10)) errors.day = 'Dagen har redan varit. Välj en framåt.'
  for (const s of secondaries) if (!s.area) errors[`sec.${s.id}`] = 'Fyll i ytan, eller ta bort raden.'
  const shown = attempted ? errors : {}

  const total = price(kvm || 0, secondaries)

  const toConfirm = () => {
    setAttempted(true)
    if (Object.keys(errors).length) {
      focusFirstInvalid()
      return
    }
    setStep(1)
  }

  const book = () => {
    if (booking) return
    setBooking(true)
    window.setTimeout(() => {
      // Bokningen lever i demosessionen: flyttsidan tänder elkortets 100 kr-krok på den.
      writeDemoSession({ cleanBooked: true })
      const item = activitiesList.find((a) => a.type === 'moveclean')
      if (item) skipChecklistItem('moveclean', item.id, false)
      showToast('Bokat. Städgarantin gäller.', 'confirm')
      setBooking(false)
      setStep(2)
    }, FAKE_BOOK_MS)
  }

  const backToMovepage = () => router.push(pathTo('/demo/movepage'))

  const patchSec = (id: number, p: Partial<Secondary>) => setSecondaries((list) => list.map((s) => (s.id === id ? { ...s, ...p } : s)))

  return (
    <div ref={rootRef} className="min-h-[calc(100dvh-56px)] bg-[#F8FAF9] flex flex-col [overflow-anchor:none]">
      <StepBar step={step} titles={STEP_TITLES} hints={STEP_HINTS} label={step === 2 ? 'Klart · 3 av 3' : undefined} />
      <Hero
        eyebrow={step === 2 ? 'Flyttstädning · Klart' : `Flyttstädning · Steg ${step + 1} av 3`}
        title={HERO_TITLE[step]}
        copy={HERO_COPY[step]}
        tone={step === 2 ? 'green' : 'blue'}
        back={{ label: 'Tillbaka till flyttsidan', onClick: backToMovepage }}
      />

      <div key={step} className={clsx('flex-1 w-full max-w-[818px] mx-auto px-4 py-4 md:py-6 flex flex-col gap-3.5', rise)}>
        {step === 0 && (
          <>
            <div className="flex flex-col gap-3.5 md:grid md:grid-cols-[1fr_320px] md:items-start">
              <Card className="flex flex-col gap-4">
                <div>
                  <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#767678]">Städas</div>
                  <div className="text-[17px] font-black text-[#214766] mt-0.5">
                    {move.fromAddress.street}, {move.fromAddress.city}
                  </div>
                </div>
                <Field label="Boarea" hint="Från Skatteverket. Ändra om den inte stämmer." error={shown.kvm}>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={kvm || ''}
                    onChange={(e) => setKvm(Number(e.target.value))}
                    className={clsx(areaInput, 'max-w-[140px] bg-white', shown.kvm && errorBorder)}
                    aria-label="Boarea i kvadratmeter"
                  />
                </Field>
                <div className="flex flex-col gap-2">
                  <span className="text-xs text-[#767678]">Förråd, garage eller vind som också ska städas</span>
                  {secondaries.map((s) => (
                    <div key={s.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <select value={s.kind} onChange={(e) => patchSec(s.id, { kind: e.target.value })} className={clsx(selectClass, 'flex-1 min-w-0')} aria-label="Typ av biyta">
                          {SECONDARY_KINDS.map((k) => (
                            <option key={k.value} value={k.value}>
                              {k.label}
                            </option>
                          ))}
                        </select>
                        <input
                          type="number"
                          inputMode="numeric"
                          placeholder="m²"
                          value={s.area || ''}
                          onChange={(e) => patchSec(s.id, { area: Number(e.target.value) })}
                          className={clsx(areaInput, 'w-[90px] bg-white', shown[`sec.${s.id}`] && errorBorder)}
                          aria-label="Biytans storlek i kvadratmeter"
                        />
                        <button
                          type="button"
                          onClick={() => setSecondaries((l) => l.filter((x) => x.id !== s.id))}
                          className={clsx('min-h-11 min-w-11 flex items-center justify-center text-[#767678] hover:text-[#214766] rounded-sm', press)}
                          aria-label="Ta bort biytan"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                            <path d="M7 7l10 10M17 7L7 17" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                      {shown[`sec.${s.id}`] && <ErrorText>{shown[`sec.${s.id}`]}</ErrorText>}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setSecondaries((l) => [...l, { id: Date.now(), kind: 'storage', area: 0 }])}
                    className={clsx('self-start min-h-11 -my-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#214766] rounded-sm', press, pressSoft)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    </svg>
                    {secondaries.length ? 'Lägg till en till' : 'Lägg till biyta'}
                  </button>
                </div>
                <Field label="Städdag" hint="Dagen efter flytten är vanligast, då är bostaden tom." error={shown.day} className="pt-3 border-t border-[#EEEEF0]">
                  <input
                    type="date"
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    className={clsx(areaInput, 'max-w-[220px] bg-white', shown.day && errorBorder)}
                    aria-label="Städdag"
                  />
                </Field>
              </Card>
              <div className="flex flex-col gap-3.5">
                <Card className="flex flex-col gap-2">
                  <div className="text-[11px] font-bold tracking-[0.12em] uppercase text-[#767678]">Fast pris</div>
                  <div className="text-[32px] font-black text-[#214766] leading-9 tabular-nums">{formatKr(total)}</div>
                  <div className="text-[13px] text-[#767678]">Efter RUT-avdrag. Vi sköter avdraget.</div>
                  <div className="flex flex-col gap-1 pt-2 border-t border-[#EEEEF0] text-[13px] text-[#214766]">
                    <span>Bostad {kvm || 0} m²</span>
                    {secondaries
                      .filter((s) => s.area > 0)
                      .map((s) => (
                        <span key={s.id}>
                          {SECONDARY_KINDS.find((k) => k.value === s.kind)?.label} {s.area} m²
                        </span>
                      ))}
                    <span>Fönsterputs, ugn och persienner ingår</span>
                    <span className="font-semibold">Med städgaranti: godkänd besiktning eller omstädning</span>
                  </div>
                </Card>
                <Card className="flex flex-col gap-2">
                  <div className="text-[15px] font-black text-[#214766]">Ska något flyttas också?</div>
                  <p className="text-[13px] leading-[18px] text-[#767678]">Vi tar med flytten i samma offert. Städet behåller sitt fasta pris.</p>
                  <button
                    type="button"
                    onClick={() => router.push(pathTo('/demo/movehelp'))}
                    className={clsx(
                      'self-start min-h-10 px-4 rounded-full border-2 border-[#214766] bg-white text-[13px] font-bold text-[#214766] hover:bg-[#F4FCFA]',
                      press,
                      'motion-safe:active:scale-[0.97]',
                    )}
                  >
                    Lägg till flytthjälp
                  </button>
                </Card>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 pt-1">
              <Primary onClick={toConfirm}>Till bekräftelsen</Primary>
              {Object.keys(shown).length ? (
                <Foot tone="error">Något saknas i underlaget. Fyll i det markerade.</Foot>
              ) : (
                <Foot>Fast pris, inget dras nu. Du kan omboka eller avboka i appen.</Foot>
              )}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <Card className="flex flex-col gap-3">
              {[
                ['Städas', `${move.fromAddress.street}, ${move.fromAddress.city}`],
                [
                  'Yta',
                  `${kvm} m²${
                    secondaries.filter((s) => s.area > 0).length
                      ? ` + ${secondaries
                          .filter((s) => s.area > 0)
                          .map((s) => `${SECONDARY_KINDS.find((k) => k.value === s.kind)?.label?.toLowerCase()} ${s.area} m²`)
                          .join(', ')}`
                      : ''
                  }`,
                ],
                ['Städdag', new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date(day))],
                ['Pris', `${formatKr(total)} efter RUT-avdrag, fast`],
                ['Garanti', 'Godkänd besiktning eller omstädning'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-4 border-b border-[#EEEEF0] last:border-0 pb-2.5 last:pb-0">
                  <span className="text-[13px] text-[#767678] shrink-0">{k}</span>
                  <span className="text-[14px] font-semibold text-[#214766] text-right">{v}</span>
                </div>
              ))}
            </Card>
            <div className="flex flex-col items-center gap-2 pt-1">
              <Primary onClick={book} loading={booking}>
                {booking ? 'Bokar…' : 'Boka städningen'}
              </Primary>
              <Foot>Inget dras nu. Bekräftelsen kommer via SMS.</Foot>
              <button type="button" onClick={() => setStep(0)} className={clsx('min-h-11 text-[13px] font-semibold text-[#214766] underline underline-offset-2 rounded-sm', press)}>
                Ändra något
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <Card>
              <Timeline
                items={[
                  { state: 'done', title: 'Bokningen mottagen', hint: 'Bekräftelse via SMS nu' },
                  { state: 'current', title: 'Vi matchar städteamet', hint: 'Kvalitetskontrollerat, med städgaranti' },
                  {
                    state: 'todo',
                    title: `Städdag ${new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(new Date(day))}`,
                    hint: 'Godkänd besiktning eller omstädning',
                  },
                ]}
              />
            </Card>
            <Card className="flex items-center gap-4">
              <div className="flex flex-col gap-1 flex-1">
                <div className="text-[15px] font-black text-[#214766]">Näst på tur: elavtal</div>
                <p className="text-[13px] leading-[18px] text-[#767678]">Teckna nu: 100 kr rabatt på städet. Tre minuter, tänd lampa när du kommer.</p>
              </div>
              <button
                type="button"
                onClick={() => router.push(pathTo('/demo/electricity'))}
                className={clsx('shrink-0 min-h-10 px-4 rounded-full bg-[#214766] text-[13px] font-bold text-white hover:bg-[#1A3A54]', press, 'motion-safe:active:scale-[0.97]')}
              >
                Visa mitt förslag
              </button>
            </Card>
            <div className="flex flex-col items-center gap-2 pt-1">
              <Primary variant="outline" onClick={backToMovepage}>
                Tillbaka till checklistan
              </Primary>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DemoMovecleanFlow
