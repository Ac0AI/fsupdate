'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import i18nConfig from 'i18nConfig'
import { useDemoUser } from '@/common/data/useDemoUser'
import { useToastContext } from '@/common/context/toast/toast.provider'
import {
  ADDONS, CLEAN_DAYS, DISTANCES, DWELLINGS, ELEVATORS, FLOORS, INFO, KEY_HANDLING, SECONDARY_KINDS, START_TIMES, STEP_TITLES,
  cleanArea, type Addon, type Cleaning, type QuoteRequest, type Residence, type Secondary,
} from './steps'
import {
  Card, Checkbox, Chevron, type Errors, ErrorText, Field, Foot, Hero, Info, Option, Pill, Primary, Radio, StepBar, Timeline, Toggle, YesNo,
  areaInput, errorBorder, focusFirstInvalid, scrollFlowToTop, useNoScrollAnchoring, press, rise, selectClass, textareaClass, pressSoft,
} from '../../_components/flow-ui'

const formatDate = (d: Date) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(d)
const weekday = (d: Date) => new Intl.DateTimeFormat('sv-SE', { weekday: 'long' }).format(d)
const isoDate = (d: Date) => new Intl.DateTimeFormat('sv-SE').format(d) // sv-SE ger yyyy-mm-dd, som <input type="date"> vill ha
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6
const digits = (s: string) => Number(s.replace(/\D/g, '')) || 0
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)

// Flyttdagen som kunden valt, eller null när vi ska föreslå.
const moveDay = (req: QuoteRequest, movingDate: Date): Date | null => {
  if (req.dateMode === 'fixed') return movingDate
  if (req.dateMode === 'custom' && req.customDate) return new Date(req.customDate)
  return null
}

// Det vi inte kan räkna utan. Allt annat får vara tomt, vi frågar om det behövs.
const residenceErrors = (res: Residence, prefix: 'from' | 'to'): Errors => {
  const e: Errors = {}
  if (!res.size) e[`${prefix}.size`] = 'Fyll i boarean så vi vet hur mycket som ska flyttas.'
  for (const s of res.secondaries) {
    if (!s.area) e[`${prefix}.secondary.${s.id}`] = 'Fyll i ungefär hur stor ytan är, eller ta bort den.'
    else if (!s.move && !s.clean) e[`${prefix}.secondary.${s.id}`] = 'Välj om ytan ska flyttas eller städas.'
  }
  if (res.hardAccess && !res.accessNote.trim()) e[`${prefix}.accessNote`] = 'Berätta kort vad som är krångligt, annars kan vi inte räkna rätt.'
  return e
}

const stepErrors = (step: number, req: QuoteRequest): Errors => {
  if (step === 0) return { ...residenceErrors(req.from, 'from'), ...residenceErrors(req.to, 'to') }
  if (step === 1) {
    const e: Errors = {}
    const today = isoDate(new Date())
    if (req.heavyItems && !req.heavyNote.trim()) e.heavyNote = 'Berätta vad som är tungt eller ömtåligt, så vi kan sätta rätt antal bärare.'
    if (req.valuables && !req.valuablesNote.trim()) e.valuablesNote = 'Berätta vad det är, så packas och försäkras det rätt.'
    if (req.dateMode === 'custom') {
      if (!req.customDate) e.customDate = 'Välj vilken dag du vill flytta.'
      else if (req.customDate < today) e.customDate = 'Den dagen har redan varit. Välj en dag framåt.'
    }
    if (req.addons.includes('moveclean') && req.cleaning.day === 'custom') {
      if (!req.cleaning.customDate) e.cleanDate = 'Välj vilken dag det ska städas.'
      else if (req.cleaning.customDate < today) e.cleanDate = 'Den dagen har redan varit. Välj en dag framåt.'
    }
    return e
  }
  return {}
}

const HERO_COPY = [
  'Berätta om bostäderna så tar din flyttkoordinator fram ett pris. Vi har fyllt i det vi redan vet.',
  'Hur mycket ska flyttas, och vill du ha hjälp med något mer?',
  'Din offert är på väg.',
]

const initialResidence = (street: string, city: string, size: number, overrides: Partial<Residence> = {}): Residence => ({
  street,
  city,
  dwelling: 'apartment',
  size,
  floor: 1,
  elevator: 'none',
  distance: 'd25',
  hardAccess: false,
  accessNote: '',
  outdoorFurniture: false,
  secondaries: [],
  ...overrides,
})

const DemoMovehelpFlow = () => {
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const { showToast } = useToastContext()
  const demoUser = useDemoUser()
  const move = demoUser.currentMove
  const movingDate = new Date(move.movingDate)

  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [req, setReq] = useState<QuoteRequest>({
    from: initialResidence(move.fromAddress.street, move.fromAddress.city, 68, {
      floor: 3,
      elevator: 'big',
      distance: 'd50',
      secondaries: [{ id: 1, kind: 'storage', area: 8, move: true, clean: true }],
    }),
    to: initialResidence(move.toAddress.street, move.toAddress.city, move.residenceSize, { dwelling: 'house', floor: 0 }),
    heavyItems: false,
    heavyNote: '',
    valuables: false,
    valuablesNote: '',
    volume: '',
    addons: ADDONS.filter((a) => a.defaultOn).map((a) => a.value),
    dateMode: 'fixed',
    customDate: '',
    startTime: 'morning',
    note: '',
    cleaning: { specialWindows: false, glazedBalcony: false, balconyArea: 0, sensitiveSurfaces: false, keys: 'present', keyNote: '', day: 'after', customDate: '' },
  })

  // Felen visas först när man försöker gå vidare, inte medan man fyller i.
  // Knappen är aldrig död: den säger i stället vad som saknas och scrollar dit.
  const [attempted, setAttempted] = useState<Record<number, boolean>>({})
  const errors = stepErrors(step, req)
  const shownErrors: Errors = attempted[step] ? errors : {}
  const hasShownErrors = Object.keys(shownErrors).length > 0

  const tryContinue = (next: () => void) => {
    if (Object.keys(errors).length === 0) {
      next()
      return
    }
    setAttempted((a) => ({ ...a, [step]: true }))
    focusFirstInvalid()
  }

  // Nytt steg börjar högst upp. På mobil står man annars kvar vid knappen
  // och ser inte att sidan bytt innehåll.
  const rootRef = useRef<HTMLDivElement>(null)
  useNoScrollAnchoring()
  const mounted = useRef(false)
  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    scrollFlowToTop(rootRef.current)
  }, [step])

  const patchResidence = (key: 'from' | 'to', patch: Partial<Residence>) => setReq((r) => ({ ...r, [key]: { ...r[key], ...patch } }))
  const patchCleaning = (patch: Partial<Cleaning>) => setReq((r) => ({ ...r, cleaning: { ...r.cleaning, ...patch } }))
  const toggleAddon = (a: Addon) => setReq((r) => ({ ...r, addons: r.addons.includes(a) ? r.addons.filter((x) => x !== a) : [...r.addons, a] }))
  const cleaning = req.addons.includes('moveclean')

  const send = () => {
    if (sending) return
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setStep(2)
      showToast('Skickat. Vi räknar på din flytt.', 'confirm')
    }, 900)
  }

  const backToMovepage = () => router.push(locale === i18nConfig.defaultLocale ? '/demo/movepage' : `/${locale}/demo/movepage`)
  const toElectricity = () => router.push(locale === i18nConfig.defaultLocale ? '/demo/electricity' : `/${locale}/demo/electricity`)

  return (
    <div ref={rootRef} className="min-h-[calc(100dvh-56px)] bg-[#F8FAF9] flex flex-col [overflow-anchor:none]">
      <StepBar step={step} titles={STEP_TITLES} hints={['2 min', '1 min', 'Pågår']} />
      <Hero title="Flytthjälp och städning" copy={HERO_COPY[step]} tone={step === 2 ? 'green' : 'blue'} />

      <div key={step} className={clsx('flex-1 w-full max-w-[818px] mx-auto px-4 py-4 md:py-6 flex flex-col gap-3.5', rise)}>
        {step === 0 && (
          <>
            <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:items-start">
              <div className={rise}>
                <ResidenceCard label="Flyttar från" prefix="from" origin res={req.from} errors={shownErrors} onChange={(p) => patchResidence('from', p)} />
              </div>
              <div className={clsx(rise, '[animation-delay:70ms]')}>
                <ResidenceCard label="Flyttar till" prefix="to" res={req.to} errors={shownErrors} onChange={(p) => patchResidence('to', p)} />
              </div>
            </div>
            <p className="text-xs leading-[17px] text-[#767678]">Adresser och tillträdesdatum kommer från din flytt. Boarea från Skatteverket.</p>
          </>
        )}

        {/* Mobil: en läsordning uppifrån och ned. Desktop: två kolumner där
            städkortet står under tillvalet som tänder det, och datumet står
            bredvid. Omslagen är genomskinliga (contents) på mobil så korten
            kan ordnas fritt, och blir riktiga kolumner på desktop. */}
        {step === 1 && (
          <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:items-start">
            <div className="contents md:flex md:flex-col md:gap-3.5 md:col-start-1">
              <div className={clsx('order-2 md:order-none', rise, '[animation-delay:70ms]')}>
                <Card>
                  <div className="flex items-baseline justify-between gap-3 pb-2">
                    <h3 className="text-[15px] font-bold text-[#214766]">Vill du ha hjälp med mer?</h3>
                    <span key={req.addons.length} className={clsx('text-xs font-semibold text-[#1F6156] animate-[pop_.3s_ease-out_both] motion-reduce:animate-none')}>
                      {req.addons.length === 0 ? 'Inget valt' : `${req.addons.length} valda`}
                    </span>
                  </div>
                  {ADDONS.map((a) => {
                    const on = req.addons.includes(a.value)
                    return (
                      <button
                        key={a.value}
                        type="button"
                        role="switch"
                        aria-checked={on}
                        onClick={() => toggleAddon(a.value)}
                        className={clsx('w-full flex items-center justify-between gap-3 py-[11px] border-t border-[#EEEEF0] text-left rounded-sm', press, 'active:bg-[#F8FAF9]')}
                      >
                        <span className="flex flex-col gap-px">
                          <span className="text-[13px] font-semibold text-[#214766]">{a.label}</span>
                          <span className="text-xs text-[#767678]">{a.hint}</span>
                        </span>
                        <Toggle on={on} />
                      </button>
                    )
                  })}
                </Card>
              </div>

              {cleaning && (
                <div className={clsx('order-3 md:order-none', rise)}>
                  <CleaningCard from={req.from} cleaning={req.cleaning} moveDate={moveDay(req, movingDate)} errors={shownErrors} onChange={patchCleaning} />
                </div>
              )}
            </div>

            <div className="contents md:flex md:flex-col md:gap-3.5 md:col-start-2">
              <div className={clsx('order-1 md:order-none', rise)}>
                <Card>
                  <h3 className="text-[15px] font-bold text-[#214766]">Något tungt eller ömtåligt?</h3>
                  <p className="text-[13px] leading-[19px] text-[#767678] mt-1">Över 80 kg räknas som tungt. Piano, kassaskåp, akvarium, sånt som behöver fler bärare.</p>
                  <div className="flex gap-1.5 mt-3">
                    <Pill active={!req.heavyItems} onClick={() => setReq((r) => ({ ...r, heavyItems: false }))}>
                      Nej
                    </Pill>
                    <Pill active={req.heavyItems} onClick={() => setReq((r) => ({ ...r, heavyItems: true }))}>
                      Ja, berätta
                    </Pill>
                  </div>
                  {req.heavyItems && (
                    <div className={clsx('mt-3 flex flex-col gap-1.5', rise)} data-invalid={shownErrors.heavyNote ? 'true' : undefined}>
                      <textarea
                        autoFocus
                        aria-invalid={!!shownErrors.heavyNote}
                        className={clsx(textareaClass, shownErrors.heavyNote && errorBorder)}
                        placeholder="T.ex. piano på våning 3, ingen hiss"
                        value={req.heavyNote}
                        onChange={(e) => setReq((r) => ({ ...r, heavyNote: e.target.value }))}
                      />
                      {shownErrors.heavyNote && <ErrorText>{shownErrors.heavyNote}</ErrorText>}
                    </div>
                  )}

                  {/* Bohag 2010 kräver att dyra föremål uppges i förväg. Samma kort
                      som det tunga: båda handlar om vad som är speciellt i bohaget. */}
                  <div className="mt-4 pt-3 border-t border-[#EEEEF0]">
                    <h3 className="text-[15px] font-bold text-[#214766] flex items-center gap-1">
                      Något värt över 30 000 kr?
                      <Info text={INFO.valuables} />
                    </h3>
                    <p className="text-[13px] leading-[19px] text-[#767678] mt-1">Konst, antikviteter, designmöbler. Så packas och försäkras det rätt.</p>
                    <div className="flex gap-1.5 mt-3">
                      <Pill active={!req.valuables} onClick={() => setReq((r) => ({ ...r, valuables: false }))}>
                        Nej
                      </Pill>
                      <Pill active={req.valuables} onClick={() => setReq((r) => ({ ...r, valuables: true }))}>
                        Ja, berätta
                      </Pill>
                    </div>
                    {req.valuables && (
                      <div className={clsx('mt-3 flex flex-col gap-1.5', rise)} data-invalid={shownErrors.valuablesNote ? 'true' : undefined}>
                        <textarea
                          autoFocus
                          aria-invalid={!!shownErrors.valuablesNote}
                          className={clsx(textareaClass, shownErrors.valuablesNote && errorBorder)}
                          placeholder="T.ex. en tavla och en flygel"
                          value={req.valuablesNote}
                          onChange={(e) => setReq((r) => ({ ...r, valuablesNote: e.target.value }))}
                        />
                        {shownErrors.valuablesNote && <ErrorText>{shownErrors.valuablesNote}</ErrorText>}
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className={clsx('order-4 md:order-none', rise, '[animation-delay:140ms]')}>
                <Card>
                  <h3 className="text-[15px] font-bold text-[#214766]">Vilken dag vill du ha flytthjälpen?</h3>
                  <div className="flex flex-col gap-2 mt-2.5">
                    <Radio
                      active={req.dateMode === 'fixed'}
                      onClick={() => setReq((r) => ({ ...r, dateMode: 'fixed' }))}
                      title={formatDate(movingDate)}
                      hint={`Tillträdesdagen · en ${weekday(movingDate)}`}
                    />
                    <Radio active={req.dateMode === 'flexible'} onClick={() => setReq((r) => ({ ...r, dateMode: 'flexible' }))} title="Flexibel, ge mig bästa pris" />
                    <Radio
                      active={req.dateMode === 'custom'}
                      onClick={() => setReq((r) => ({ ...r, dateMode: 'custom', customDate: r.customDate || isoDate(movingDate) }))}
                      title="Ett annat datum"
                      hint="Välj själv, så räknar vi på den dagen"
                    />
                  </div>
                  {req.dateMode === 'custom' && (
                    <div className={clsx('mt-3', rise)}>
                      <Field label="Vilken dag?" error={shownErrors.customDate}>
                        <input
                          type="date"
                          autoFocus
                          min={isoDate(new Date())}
                          aria-invalid={!!shownErrors.customDate}
                          className={clsx(areaInput, 'max-w-[220px] bg-white', shownErrors.customDate && errorBorder)}
                          value={req.customDate}
                          onChange={(e) => setReq((r) => ({ ...r, customDate: e.target.value }))}
                        />
                      </Field>
                      {req.customDate && !shownErrors.customDate && (
                        <p className="mt-1.5 text-xs leading-[17px] text-[#767678]">
                          {formatDate(new Date(req.customDate))}, en {weekday(new Date(req.customDate))}.
                          {isWeekend(new Date(req.customDate)) ? ' Helger kostar ofta mer, vardagar är billigare.' : ''}
                        </p>
                      )}
                    </div>
                  )}
                  <p className="text-xs leading-[17px] text-[#767678] mt-2.5">
                    Vardagar är ofta billigare än helger. Flexibel betyder att vi föreslår ett datum inom en vecka från tillträdet.
                  </p>

                  <Field label="Starttid" className="mt-3 pt-3 border-t border-[#EEEEF0]">
                    <div className="grid grid-cols-2 gap-1.5">
                      {START_TIMES.map((t) => (
                        <Option key={t.value} active={req.startTime === t.value} onClick={() => setReq((r) => ({ ...r, startTime: t.value }))} label={t.label} hint={t.hint} />
                      ))}
                    </div>
                  </Field>
                </Card>
              </div>

              <div className={clsx('order-5 md:order-none', rise, '[animation-delay:210ms]')}>
                <Card>
                  <h3 className="text-[15px] font-bold text-[#214766]">Något mer vi bör veta?</h3>
                  <p className="text-[13px] leading-[19px] text-[#767678] mt-1">Parkering, portkod, tider som inte funkar. Allt som hjälper oss räkna rätt.</p>
                  <textarea
                    className={clsx(textareaClass, 'mt-3')}
                    placeholder="Skriv fritt, eller lämna tomt"
                    value={req.note}
                    onChange={(e) => setReq((r) => ({ ...r, note: e.target.value }))}
                  />
                  <Field label="Vet du ungefär hur många kubik?" info={INFO.volume} className="mt-3">
                    <input
                      type="text"
                      inputMode="numeric"
                      className={clsx(areaInput, 'max-w-[140px]')}
                      placeholder="m³"
                      value={req.volume ? `${req.volume} m³` : ''}
                      onChange={(e) => setReq((r) => ({ ...r, volume: e.target.value.replace(/\D/g, '') }))}
                    />
                  </Field>
                </Card>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full md:max-w-[560px] md:mx-auto flex flex-col gap-3.5">
            <WaitingStep req={req} movingDate={movingDate} onEdit={() => setStep(0)} onNext={toElectricity} />
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#EEEEF0]">
        <div className="w-full max-w-[818px] mx-auto px-4 py-4 flex flex-col gap-2.5 md:items-center">
          {step === 0 && (
            <>
              <Primary onClick={() => tryContinue(() => setStep(1))}>Till sista steget</Primary>
              {hasShownErrors ? (
                <Foot tone="error">Något saknas i underlaget. Fyll i det markerade så räknar vi rätt.</Foot>
              ) : (
                <Foot>Kostnadsfritt och inte bindande. Du bestämmer när förslaget kommer.</Foot>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <Primary onClick={() => tryContinue(send)} loading={sending}>
                {sending ? 'Skickar' : 'Begär offert'}
              </Primary>
              {hasShownErrors ? (
                <Foot tone="error">Något saknas ovan. Fyll i det markerade så vi kan räkna rätt.</Foot>
              ) : (
                <Foot>Vi sammanställer och skickar ett förslag. Inget är bokat förrän du godkänt det.</Foot>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <Primary onClick={backToMovepage}>Tillbaka till checklistan</Primary>
              <Foot>Du får SMS när offerten är skickad.</Foot>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- flödets egna delar ---------- */

/**
 * Bostadstypen står först eftersom den styr resten: lägenhet får hissfrågan,
 * villa och radhus får utemöblerna i stället. Biytorna står sist, de är en
 * lista som växer och ska inte trycka ned fälten under sig.
 */
const ResidenceCard = ({
  label,
  prefix,
  origin,
  res,
  errors,
  onChange,
}: {
  label: string
  prefix: 'from' | 'to'
  origin?: boolean
  res: Residence
  errors: Errors
  onChange: (p: Partial<Residence>) => void
}) => {
  const err = (key: string) => errors[`${prefix}.${key}`]
  const apartment = res.dwelling === 'apartment'
  const patchSecondary = (id: number, p: Partial<Secondary>) => onChange({ secondaries: res.secondaries.map((s) => (s.id === id ? { ...s, ...p } : s)) })
  const addSecondary = () => onChange({ secondaries: [...res.secondaries, { id: Date.now(), kind: 'storage', area: 0, move: true, clean: true }] })
  const removeSecondary = (id: number) => onChange({ secondaries: res.secondaries.filter((s) => s.id !== id) })

  return (
    <Card>
      {/* Adressen är kortets rubrik, etiketten ovanför säger vilken av de två
          det är. Linjen under skiljer rubriken från fälten. */}
      <div className="flex flex-col gap-1 pb-3 border-b border-[#EEEEF0]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#767678]">{label}</span>
        <span className="text-[18px] leading-6 font-bold text-[#214766] tracking-[-0.01em]">
          {res.street}, {res.city}
        </span>
      </div>

      <Field label="Bostadstyp" className="mt-3">
        <div className="flex gap-1.5">
          {DWELLINGS.map((d) => (
            <Pill key={d.value} active={res.dwelling === d.value} onClick={() => onChange({ dwelling: d.value })}>
              {d.label}
            </Pill>
          ))}
        </div>
      </Field>

      <div className="flex gap-1.5 mt-3">
        <Field label="Boarea" invalid={!!err('size')}>
          <input
            type="text"
            inputMode="numeric"
            aria-invalid={!!err('size')}
            className={clsx(areaInput, err('size') && errorBorder)}
            placeholder="m²"
            value={res.size ? `${res.size} m²` : ''}
            onChange={(e) => onChange({ size: digits(e.target.value) })}
          />
        </Field>
        <Field label="Våning">
          <select className={selectClass} value={res.floor} onChange={(e) => onChange({ floor: Number(e.target.value) })}>
            {FLOORS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </Field>
      </div>
      {err('size') && <ErrorText className="mt-1.5">{err('size')}</ErrorText>}

      {apartment ? (
        <Field label="Hiss" className="mt-3">
          <div className="grid grid-cols-2 gap-1.5">
            {ELEVATORS.map((e) => (
              <Pill key={e.value} active={res.elevator === e.value} onClick={() => onChange({ elevator: e.value })}>
                {e.label}
              </Pill>
            ))}
          </div>
        </Field>
      ) : (
        origin && (
          <Field label="Utemöbler som ska med?" info={INFO.outdoor} className="mt-3">
            <div className={clsx('flex gap-1.5', rise)}>
              <Pill active={!res.outdoorFurniture} onClick={() => onChange({ outdoorFurniture: false })}>
                Nej
              </Pill>
              <Pill active={res.outdoorFurniture} onClick={() => onChange({ outdoorFurniture: true })}>
                Ja
              </Pill>
            </div>
          </Field>
        )
      )}

      <Field label="Från porten till där bilen kan stå" info={INFO.distance} className="mt-3">
        <select className={selectClass} value={res.distance} onChange={(e) => onChange({ distance: e.target.value as Residence['distance'] })}>
          {DISTANCES.map((d) => (
            <option key={d.value} value={d.value}>
              {d.label}
            </option>
          ))}
        </select>
      </Field>

      <label
        data-invalid={err('accessNote') ? 'true' : undefined}
        className={clsx(
          'mt-3 flex flex-col gap-2.5 rounded-lg px-3.5 py-3 border cursor-pointer transition-colors duration-200 motion-reduce:transition-none',
          err('accessNote') ? 'bg-[#FFF5F5] border-[var(--color-error-red)]' : res.hardAccess ? 'bg-[#F4FCFA] border-[#51C8B4]' : 'bg-transparent border-transparent hover:bg-[#F8FAF9]',
        )}
      >
        <span className="flex items-start gap-3">
          <input type="checkbox" className="sr-only" checked={res.hardAccess} onChange={(e) => onChange({ hardAccess: e.target.checked })} />
          <Checkbox checked={res.hardAccess} />
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-medium text-[#214766] flex items-center gap-1">
              Det är krångligt att komma fram här
              <Info text={INFO.access} />
            </span>
          </span>
        </span>
        {res.hardAccess && (
          <>
            <textarea
              autoFocus
              aria-invalid={!!err('accessNote')}
              className={clsx(textareaClass, rise, err('accessNote') && errorBorder)}
              placeholder="Gårdshus, bilen får inte in på gården. Ca 40 m från gatan."
              value={res.accessNote}
              onChange={(e) => onChange({ accessNote: e.target.value })}
            />
            {err('accessNote') && <ErrorText>{err('accessNote')}</ErrorText>}
          </>
        )}
      </label>

      {origin && (
        <div className="mt-3 pt-3 border-t border-[#EEEEF0] flex flex-col gap-1.5">
          <span className="text-xs text-[#767678] flex items-center gap-1">
            Förråd, garage eller vind
            <Info text={INFO.secondary} />
          </span>
          {res.secondaries.map((s) => (
            <SecondaryRow key={s.id} s={s} error={err(`secondary.${s.id}`)} onChange={(p) => patchSecondary(s.id, p)} onRemove={() => removeSecondary(s.id)} />
          ))}
          <button
            type="button"
            onClick={addSecondary}
            className={clsx('self-start min-h-11 -my-1 flex items-center gap-1.5 text-[13px] font-semibold text-[#214766] rounded-sm', press, pressSoft)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            {res.secondaries.length ? 'Lägg till en till' : 'Lägg till biyta'}
          </button>
        </div>
      )}
    </Card>
  )
}

/** En biyta: vad det är, hur stor, och om den ska flyttas eller städas. */
const SecondaryRow = ({ s, error, onChange, onRemove }: { s: Secondary; error?: string; onChange: (p: Partial<Secondary>) => void; onRemove: () => void }) => (
  <div
    data-invalid={error ? 'true' : undefined}
    className={clsx('flex flex-col gap-2 rounded-lg border p-2.5', rise, error ? 'bg-[#FFF5F5] border-[var(--color-error-red)]' : 'bg-[#F8FAF9] border-[#EEEEF0]')}
  >
    <div className="flex gap-1.5 items-center">
      <select aria-label="Typ av biyta" className={clsx(selectClass, 'basis-0 grow min-w-0')} value={s.kind} onChange={(e) => onChange({ kind: e.target.value as Secondary['kind'] })}>
        {SECONDARY_KINDS.map((k) => (
          <option key={k.value} value={k.value}>
            {k.label}
          </option>
        ))}
      </select>
      <input
        type="text"
        inputMode="numeric"
        aria-label="Yta i kvadratmeter"
        aria-invalid={!!error}
        className={clsx(areaInput, 'basis-[92px] w-[92px] grow-0 shrink-0', error && errorBorder)}
        placeholder="m²"
        value={s.area ? `${s.area} m²` : ''}
        onChange={(e) => onChange({ area: digits(e.target.value) })}
      />
      <button
        type="button"
        aria-label="Ta bort biytan"
        onClick={onRemove}
        className={clsx('w-11 h-11 -mr-2 shrink-0 flex items-center justify-center rounded-full text-[#767678] hover:text-[#214766] hover:bg-white', press)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
    <div className="flex gap-1.5">
      <Pill active={s.move} multi onClick={() => onChange({ move: !s.move })}>
        Flyttas
      </Pill>
      <Pill active={s.clean} multi onClick={() => onChange({ clean: !s.clean })}>
        Städas
      </Pill>
    </div>
    {error && <ErrorText>{error}</ErrorText>}
  </div>
)

/**
 * Visas bara när flyttstädning är påslagen, direkt under tillvalet. Städytan
 * räknas fram från från-adressen, kunden ska inte behöva addera själv.
 */
const CleaningCard = ({
  from,
  cleaning,
  moveDate,
  errors,
  onChange,
}: {
  from: Residence
  cleaning: Cleaning
  moveDate: Date | null
  errors: Errors
  onChange: (p: Partial<Cleaning>) => void
}) => {
  const extra = from.secondaries.some((s) => s.clean && s.area > 0)
  // Förslaget följer flyttdagen: städ dagen efter, när bostaden är tom.
  const dayHint = (value: Cleaning['day']) => {
    if (value === 'after') return moveDate ? `${formatDate(addDays(moveDate, 1))} · vanligast, bostaden är tom` : 'Vanligast. Bostaden är tom.'
    if (value === 'same') return moveDate ? formatDate(moveDate) : undefined
    return 'Välj själv'
  }
  return (
    <Card>
      <h3 className="text-[15px] font-bold text-[#214766]">Flyttstädningen</h3>
      <p className="text-[13px] leading-[19px] text-[#767678] mt-1">
        {cleanArea(from)} m² städyta, {from.street}. {extra ? 'Boarean plus biytorna som ska städas.' : 'Boarean.'} Med städgaranti.
      </p>

      <div className="mt-3">
        <YesNo label="Specialfönster" info={INFO.windows} value={cleaning.specialWindows} onChange={(v) => onChange({ specialWindows: v })} />
        <YesNo label="Inglasad balkong" value={cleaning.glazedBalcony} onChange={(v) => onChange({ glazedBalcony: v })} />
        {cleaning.glazedBalcony && (
          <div className={clsx('pb-2.5', rise)}>
            <Field label="Ungefär hur stor är balkongen?">
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                className={clsx(areaInput, 'max-w-[140px]')}
                placeholder="m²"
                value={cleaning.balconyArea ? `${cleaning.balconyArea} m²` : ''}
                onChange={(e) => onChange({ balconyArea: digits(e.target.value) })}
              />
            </Field>
          </div>
        )}
        <YesNo label="Känsliga ytor" info={INFO.surfaces} value={cleaning.sensitiveSurfaces} onChange={(v) => onChange({ sensitiveSurfaces: v })} />
      </div>

      <Field label="Nyckelhantering" info={INFO.keys} className="mt-3 pt-3 border-t border-[#EEEEF0]">
        <div className="grid grid-cols-2 gap-1.5">
          {KEY_HANDLING.map((k) => (
            <Pill key={k.value} active={cleaning.keys === k.value} onClick={() => onChange({ keys: k.value })}>
              {k.label}
            </Pill>
          ))}
        </div>
      </Field>
      {cleaning.keys === 'absent' && (
        <div className={clsx('mt-2.5', rise)}>
          <Field label="Var lämnar du nyckeln?">
            <input
              type="text"
              autoFocus
              className={areaInput}
              placeholder="T.ex. i brevlådan eller hos grannen"
              value={cleaning.keyNote}
              onChange={(e) => onChange({ keyNote: e.target.value })}
            />
          </Field>
        </div>
      )}

      <Field label="När ska det städas?" className="mt-3">
        <div className="flex flex-col gap-2">
          {CLEAN_DAYS.map((d) => (
            <Radio
              key={d.value}
              active={cleaning.day === d.value}
              onClick={() => onChange({ day: d.value, customDate: d.value === 'custom' ? cleaning.customDate || (moveDate ? isoDate(addDays(moveDate, 1)) : '') : cleaning.customDate })}
              title={d.title}
              hint={dayHint(d.value)}
            />
          ))}
        </div>
      </Field>
      {cleaning.day === 'custom' && (
        <div className={clsx('mt-3', rise)}>
          <Field label="Vilken dag?" error={errors.cleanDate}>
            <input
              type="date"
              autoFocus
              min={isoDate(new Date())}
              aria-invalid={!!errors.cleanDate}
              className={clsx(areaInput, 'max-w-[220px] bg-white', errors.cleanDate && errorBorder)}
              value={cleaning.customDate}
              onChange={(e) => onChange({ customDate: e.target.value })}
            />
          </Field>
        </div>
      )}
    </Card>
  )
}

const WaitingStep = ({ req, movingDate, onEdit, onNext }: { req: QuoteRequest; movingDate: Date; onEdit: () => void; onNext: () => void }) => {
  const now = new Date()
  const time = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' }).format(now)
  const addonLabels = ADDONS.filter((a) => req.addons.includes(a.value)).map((a) => a.label.toLowerCase())
  return (
    <>
      <div className={rise}>
        <Card>
          <div className="flex items-center gap-3">
            <Image
              src="https://ik.imagekit.io/flyttsmart/Marketing/Nina_IPgqu3hJB.jpg?tr=w-88,h-88,fo-face"
              alt="Nina Fredriksson"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover shrink-0"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-[#214766]">Nina Fredriksson</span>
              <span className="text-[13px] text-[#767678]">Din flyttkoordinator</span>
            </span>
          </div>
          <p className={clsx('mt-3 rounded-[12px_12px_12px_2px] bg-[#EAF2F8] px-3.5 py-3 text-[13px] leading-5 text-[#214766]', rise, '[animation-delay:350ms]')}>
            Hej! Jag har fått dina uppgifter och räknar på flytten från {req.from.street}. Du får ett förslag senast i morgon förmiddag. Har du frågor är det
            bara att skriva här.
          </p>
        </Card>
      </div>

      <div className={clsx(rise, '[animation-delay:120ms]')}>
        <Card>
          <Timeline
            items={[
              { state: 'done', title: 'Uppgifter skickade', hint: `I dag ${time} · bekräftelse på mejl` },
              { state: 'current', title: 'Vi tar fram förslaget', hint: 'Senast i morgon förmiddag · du får SMS' },
              { state: 'todo', title: 'Du godkänner eller frågar', hint: 'Förslaget gäller i två veckor' },
            ]}
          />
        </Card>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className={clsx('w-full text-left rounded-[10px] bg-white border border-[#EEEEF0] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-[#214766]/40', press, pressSoft, rise, '[animation-delay:200ms]')}
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-[#214766]">Dina svar</span>
          <span className="text-[13px] text-[#767678]">
            {req.from.street} → {req.to.street} · {req.dateMode === 'fixed' ? formatDate(movingDate) : req.dateMode === 'custom' && req.customDate ? formatDate(new Date(req.customDate)) : 'flexibelt datum'}
            {addonLabels.length ? ` · ${addonLabels.join(', ')}` : ''}
          </span>
        </span>
        <Chevron />
      </button>

      <button
        type="button"
        onClick={onNext}
        className={clsx('w-full text-left rounded-[10px] bg-[#FFF1E5] border border-[#FFD4B3] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-[#F5A623]', press, pressSoft, rise, '[animation-delay:280ms]')}
      >
        <span className="w-10 h-10 rounded-full bg-[#FFA65F] shrink-0 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden>
            <path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#214766" />
          </svg>
        </span>
        <span className="flex-1 flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-[#214766]">Näst på tur: elavtal</span>
          <span className="text-[13px] text-[#214766]">Tre minuter. Tänd lampa när du kommer, till bra pris.</span>
        </span>
        <span className="shrink-0 h-9 px-3.5 rounded-full bg-[#214766] text-white text-[13px] font-semibold flex items-center gap-1">
          Börja
          <Chevron color="#fff" size={14} />
        </span>
      </button>
    </>
  )
}

export default DemoMovehelpFlow
