'use client'

import { Fragment, useLayoutEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useIntercom } from 'react-use-intercom'
import { clsx } from 'clsx'
import i18nConfig from 'i18nConfig'
import { useDemoUser } from '@/common/data/useDemoUser'
import type { DemoAddress } from '@/common/data/demoPersona'
import { ADDONS, CLEAN_DAYS, DISTANCES, DWELLINGS, ELEVATORS, FLOORS, KEY_HANDLING, SECONDARY_KINDS, START_TIMES, STEP_TITLES,
  cleanArea, type Addon, type Cleaning, type QuoteRequest, type Residence, type Secondary, HEAVY_KINDS, type HeavyKind } from './steps'
import { Card, Chevron, type Errors, ErrorText, Field, Foot, Hero, MoreLink, Option, Pill, Primary, Radio, StepBar, Timeline, Toggle, areaInput, errorBorder, focusFirstInvalid, scrollFlowToTop, useNoScrollAnchoring, press, rise, selectClass, textareaClass, pressSoft, pressScale } from '../../_components/flow-ui'

const formatDate = (d: Date) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(d)
const weekday = (d: Date) => new Intl.DateTimeFormat('sv-SE', { weekday: 'long' }).format(d)
const isoDate = (d: Date) => new Intl.DateTimeFormat('sv-SE').format(d) // sv-SE ger yyyy-mm-dd, som <input type="date"> vill ha
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6
const digits = (s: string) => Number(s.replace(/\D/g, '')) || 0

// Flyttdagen som kunden valt, eller null när vi ska föreslå.
const moveDay = (req: QuoteRequest, movingDate: Date): Date | null => {
  if (req.dateMode === 'fixed') return movingDate
  if (req.dateMode === 'custom' && req.customDate) return new Date(req.customDate)
  return null
}

// Det vi inte kan räkna utan. Allt annat får vara tomt, vi frågar om det behövs.
const residenceErrors = (res: Residence, prefix: 'from' | 'to'): Errors => {
  const e: Errors = {}
  // Boarean styr volym och städyta, och bara på adressen man flyttar från.
  // Dit man flyttar kostar bärsträckan (våning, hiss, avstånd), inte kvadratmetrarna.
  if (prefix === 'from' && !res.size) e[`${prefix}.size`] = 'Fyll i boarean så vi vet hur mycket som ska flyttas.'
  if (res.dwelling === 'apartment' && res.floor < 0) e[`${prefix}.floor`] = 'Välj våning.'
  if (res.dwelling === 'apartment' && !res.elevator) e[`${prefix}.elevator`] = 'Välj hiss. Vet ej går bra.'
  if (!res.distance) e[`${prefix}.distance`] = 'Välj bärsträcka. Vet ej går bra.'
  if (prefix === 'from' && res.dwelling !== 'apartment' && res.outdoorFurniture === null) e[`${prefix}.outdoor`] = 'Svara ja eller nej, så räknar vi rätt plats i bilen.'
  if (res.hardAccess === null) e[`${prefix}.access`] = 'Svara ja eller nej, så räknar vi rätt.'
  if (res.hardAccess && !res.accessNote.trim()) e[`${prefix}.accessNote`] = 'Berätta kort vad som är krångligt, annars kan vi inte räkna rätt.'
  if (prefix === 'from') {
    if (res.hasSecondaries === null) e[`${prefix}.secondaries`] = 'Svara ja eller nej, så ingen yta glöms bort.'
    else if (res.hasSecondaries && res.secondaries.length === 0) e[`${prefix}.secondaries`] = 'Lägg till minst en yta, eller svara nej.'
  }
  for (const s of res.secondaries) {
    if (!s.area) e[`${prefix}.secondary.${s.id}`] = 'Fyll i ungefär hur stor ytan är, eller ta bort den.'
    else if (!s.move && !s.clean) e[`${prefix}.secondary.${s.id}`] = 'Välj om ytan ska flyttas eller städas.'
  }
  return e
}

const stepErrors = (step: number, req: QuoteRequest, movingDate: Date): Errors => {
  if (step === 0) return { ...residenceErrors(req.from, 'from'), ...residenceErrors(req.to, 'to') }
  if (step === 1) {
    const e: Errors = {}
    const today = isoDate(new Date())
    if (req.heavyKinds.length === 0) e.heavy = 'Välj vad som finns, eller Nej, inget sådant.'
    else if (req.heavyKinds.includes('other') && !req.heavyNote.trim()) e.heavyNote = 'Berätta vad det är och ungefär hur tungt.'
    if (req.addons.includes('moveclean')) {
      const c = req.cleaning
      if (!(c.specialWindows || c.glazedBalcony || c.sensitiveSurfaces || c.nothingSpecial)) e.cleanDetails = 'Välj vad som finns i bostaden, eller Inget av det här.'
    }
    if (req.dateMode === 'custom') {
      if (!req.customDate) e.customDate = 'Välj vilken dag du vill flytta.'
      else if (req.customDate < today) e.customDate = 'Den dagen har redan varit. Välj en dag framåt.'
    }
    if (req.addons.includes('moveclean') && req.cleaning.day === 'custom') {
      const move = moveDay(req, movingDate)
      if (!req.cleaning.customDate) e.cleanDate = 'Välj vilken dag det ska städas.'
      else if (req.cleaning.customDate < today) e.cleanDate = 'Den dagen har redan varit. Välj en dag framåt.'
      else if (move && req.cleaning.customDate > isoDate(move)) e.cleanDate = 'Städningen kan inte ligga efter flyttdagen. Välj flyttdagen eller en dag innan.'
    }
    return e
  }
  return {}
}

// Rubriken säger var du är. Tjänstens namn och stegräknaren står som rad ovanför.
const HERO_TITLE = ['Berätta om bostäderna', 'Vad ska med, och när?', 'Din offert är på väg']
const HERO_COPY = [
  // Vi-form i flödet; Nina kliver fram först på väntesidan, som koordinatorn kunden får.
  'Du slipper ringa runt och jaga offerter. Vi har fyllt i det vi redan vet, du fyller i resten. Sen räknar vi på din flytt.',
  'Vi har lagt ett förslag utifrån din flytt. Slå av det du inte vill ha.',
  // Steg 3 har ingen ingress: Ninas bubbla och tidslinjen säger det direkt under.
  '',
]

const initialResidence = (street: string, city: string, size: number, overrides: Partial<Residence> = {}): Residence => ({
  street,
  city,
  dwelling: 'apartment',
  size,
  floor: 1,
  elevator: 'none',
  distance: 'd25',
  hardAccess: null,
  accessNote: '',
  outdoorFurniture: null,
  hasSecondaries: null,
  secondaries: [],
  ...overrides,
})

const DemoMovehelpFlow = () => {
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const demoUser = useDemoUser()
  const move = demoUser.currentMove
  // Köparens från-adress kommer från SPAR utan våning och hiss, säljarens från mäklaren med dem.
  const soldHome: DemoAddress = move.fromAddress
  const movingDate = new Date(move.movingDate)

  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)
  const [moreAddons, setMoreAddons] = useState(false)
  const [noteOpen, setNoteOpen] = useState(false)
  const [req, setReq] = useState<QuoteRequest>({
    from: initialResidence(move.fromAddress.street, move.fromAddress.city, 68, {
      // Våning och hiss förvalda när mäklarsystemet skickat dem, annars måste kunden svara.
      // Bärsträckan vet ingen annan än kunden.
      floor: soldHome.floor ?? -1,
      elevator: soldHome.elevator ?? '',
      distance: '',
      // Biyta vet vi inget om från mäklaren. Kunden lägger till förråd, garage eller vind själv.
      secondaries: [],
    }),
    to: initialResidence(move.toAddress.street, move.toAddress.city, move.residenceSize, { dwelling: 'house', floor: -1, elevator: '', distance: '' }),
    heavyItems: false,
    heavyKinds: [],
    heavyNote: '',
    valuables: false,
    valuablesNote: '',
    addons: ADDONS.filter((a) => a.defaultOn).map((a) => a.value),
    dateMode: 'fixed',
    customDate: '',
    // Förvalt "spelar ingen roll": inget att ångra, och koordinatorn föreslår.
    startTime: 'any',
    note: '',
    cleaning: { specialWindows: false, glazedBalcony: false, balconyArea: 0, sensitiveSurfaces: false, nothingSpecial: false, keys: 'present', keyNote: '', day: 'same', customDate: '' },
  })

  // Felen visas först när man försöker gå vidare, inte medan man fyller i.
  // Knappen är aldrig död: den säger i stället vad som saknas och scrollar dit.
  const [attempted, setAttempted] = useState<Record<number, boolean>>({})
  const errors = stepErrors(step, req, movingDate)
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
  const toggleHeavy = (k: HeavyKind) =>
    setReq((r) => {
      const heavyKinds = k === 'none' ? ['none' as HeavyKind] : r.heavyKinds.includes(k) ? r.heavyKinds.filter((x) => x !== k) : [...r.heavyKinds.filter((x) => x !== 'none'), k]
      return { ...r, heavyKinds, heavyItems: heavyKinds.some((x) => x !== 'none') }
    })
  const cleaning = req.addons.includes('moveclean')
  // Städraden bär sina egna fakta när städningen är på, i stället för en lös rad under.
  const cleanHint = `Städgaranti · ${cleanArea(req.from)} m² · ${req.cleaning.day === 'same' ? 'samma dag som flytten' : 'dagen du valt'}`

  const send = () => {
    if (sending) return
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setStep(2)
    }, 900)
  }

  const backToMovepage = () => router.push(locale === i18nConfig.defaultLocale ? '/demo/movepage' : `/${locale}/demo/movepage`)

  const addonRow = (a: (typeof ADDONS)[number]) => {
    const on = req.addons.includes(a.value)
    return (
      <button
        key={a.value}
        type="button"
        role="switch"
        aria-checked={on}
        onClick={() => toggleAddon(a.value)}
        className={clsx('w-full flex items-center justify-between gap-3 py-[11px] border-t border-[var(--color-inactive-main)] text-left rounded-sm', press, 'active:bg-[var(--color-background-default)]')}
      >
        <span className="flex flex-col gap-px">
          <span className="text-[13px] font-semibold text-[var(--color-text-main)]">{a.label}</span>
          <span className="text-xs text-[var(--color-inactive-extra-dark)]">{a.value === 'moveclean' && on ? cleanHint : a.hint}</span>
        </span>
        <Toggle on={on} />
      </button>
    )
  }


  return (
    <div ref={rootRef} className="min-h-[calc(100dvh-56px)] bg-[var(--color-background-default)] flex flex-col [overflow-anchor:none]">
      <StepBar step={step} titles={STEP_TITLES} hints={['', '', '']} contentClassName="max-w-[640px]" />
      <Hero
        eyebrow="Flytthjälp och städning"
        title={HERO_TITLE[step]}
        copy={HERO_COPY[step]}
        tone={step === 2 ? 'green' : 'blue'}
        contentClassName="max-w-[640px]"
        back={step === 2 ? undefined : step === 1 ? { label: 'Tillbaka till bostäderna', onClick: () => setStep(0) } : { label: 'Tillbaka till flyttsidan', onClick: backToMovepage }}
      >
      </Hero>

      <div key={step} className={clsx('flex-1 w-full max-w-[640px] mx-auto px-4 py-4 md:py-6 flex flex-col gap-3.5', rise)}>
        {step === 0 && (
          <div className="flex flex-col gap-3.5 w-full max-w-[640px] mx-auto">
            <div className={rise}>
              <ResidenceCard label="Flyttar från" prefix="from" origin res={req.from} errors={shownErrors} onChange={(p) => patchResidence('from', p)} />
            </div>
            <div className={clsx(rise, '[animation-delay:70ms]')}>
              <ResidenceCard label="Flyttar till" prefix="to" res={req.to} errors={shownErrors} onChange={(p) => patchResidence('to', p)} />
            </div>
          </div>
        )}

        {/* En kolumn på alla bredder, i en läsordning: tungt, flyttdagen, tillvalen
            (med städdetaljerna infällda under toggeln som tänder dem), övrigt. */}
        {step === 1 && (
          <div className="flex flex-col gap-3.5 w-full max-w-[640px] mx-auto">
            {/* Rekommendationen: packhjälp och flyttstädning på, resten bakom en länk. */}
            <div className={rise}>
              <Card>
                <h3 className="text-[15px] font-bold text-[var(--color-text-main)]">Vårt förslag</h3>
                <p className="text-[13px] leading-[19px] text-[var(--color-inactive-extra-dark)] mt-2 pb-2">Priset kommer i offerten, efter rutavdrag.</p>
                <div className="flex items-center justify-between gap-3 py-[11px] border-t border-[var(--color-inactive-main)]">
                  <span className="flex flex-col gap-px">
                    <span className="text-[13px] font-semibold text-[var(--color-text-main)]">Flytthjälp</span>
                    <span className="text-xs text-[var(--color-inactive-extra-dark)]">Bärare, bil och försäkring</span>
                  </span>
                  <span className="text-xs font-semibold text-[var(--color-primary-dark)]">Ingår</span>
                </div>
                {ADDONS.filter((a) => a.value === 'packing' || a.value === 'moveclean').map(addonRow)}
                {cleaning && (
                  <div className={clsx('pb-3', rise)}>
                    <CleaningCard from={req.from} cleaning={req.cleaning} moveDate={moveDay(req, movingDate)} errors={shownErrors} onChange={patchCleaning} />
                  </div>
                )}
                {moreAddons || ADDONS.some((a) => a.kind === 'chip' && req.addons.includes(a.value)) ? (
                  <>
                    <p className="pt-3 pb-1 text-[13px] font-semibold text-[var(--color-text-main)]">Fler tjänster</p>
                    {ADDONS.filter((a) => a.value !== 'packing' && a.value !== 'moveclean').map(addonRow)}
                  </>
                ) : (
                  <div className="pt-2 border-t border-[var(--color-inactive-main)]">
                    <MoreLink plus onClick={() => setMoreAddons(true)}>Lägg till fler tjänster</MoreLink>
                  </div>
                )}
                {/* Övrigt är en rad i förslaget, hopfälld tills kunden har något att säga. */}
                <div className="pt-2 border-t border-[var(--color-inactive-main)]">
                  {noteOpen || req.note ? (
                    <div className={clsx('pt-1', rise)}>
                      <Field label="Något mer vi bör veta?">
                        <textarea className={textareaClass} autoFocus placeholder="Parkering, portkod, tider som inte funkar" value={req.note} onChange={(e) => setReq((r) => ({ ...r, note: e.target.value }))} />
                      </Field>
                    </div>
                  ) : (
                    <MoreLink plus onClick={() => setNoteOpen(true)}>
                      Lägg till portkod eller parkering
                    </MoreLink>
                  )}
                </div>
              </Card>
            </div>

            {/* Flyttdagen är ett påstående med en tyst ändra-länk, inte en fråga kunden redan fått svar på. */}
            <div className={clsx(rise, '[animation-delay:70ms]')}>
              <Card>
                {!dateOpen && req.dateMode === 'fixed' ? (
                  <>
                    <h3 className="text-[15px] font-bold text-[var(--color-text-main)]">Vi räknar på {formatDate(movingDate)}</h3>
                    <p className="text-[13px] leading-[19px] text-[var(--color-inactive-extra-dark)] mt-1">Tillträdesdagen, en {weekday(movingDate)}.</p>
                    <MoreLink className="mt-3" onClick={() => setDateOpen(true)}>
                      Ändra dag eller starttid
                    </MoreLink>
                  </>
                ) : (
                  <>
                    <h3 className="text-[15px] font-bold text-[var(--color-text-main)]">Vilken dag vill du ha flytthjälpen?</h3>
                    <div className="flex flex-col gap-2 mt-2.5">
                    <Radio
                      active={req.dateMode === 'fixed'}
                      onClick={() => setReq((r) => ({ ...r, dateMode: 'fixed' }))}
                      title={formatDate(movingDate)}
                      hint={`Tillträdesdagen · en ${weekday(movingDate)}`}
                    />
                    <Radio
                      active={req.dateMode === 'flexible'}
                      onClick={() => setReq((r) => ({ ...r, dateMode: 'flexible' }))}
                      title="Flexibel dag"
                      hint="Vi föreslår en dag inom en vecka från tillträdet"
                    />
                    <Radio
                      active={req.dateMode === 'custom'}
                      onClick={() => setReq((r) => ({ ...r, dateMode: 'custom', customDate: r.customDate || isoDate(movingDate) }))}
                      title="Ett annat datum"
                      hint="Välj själv"
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
                        <p className="mt-1.5 text-xs leading-[17px] text-[var(--color-inactive-dark)]">
                          {formatDate(new Date(req.customDate))}, en {weekday(new Date(req.customDate))}.
                          {isWeekend(new Date(req.customDate)) ? ' Helger kostar ofta mer, vardagar är billigare.' : ''}
                        </p>
                      )}
                    </div>
                  )}
                    <Field label="Starttid" className="mt-3">
                      <div className={clsx('grid grid-cols-2 gap-1.5', rise)}>
                        {START_TIMES.map((t) => (
                          <Option key={t.value} active={req.startTime === t.value} onClick={() => setReq((r) => ({ ...r, startTime: t.value }))} label={t.label} hint={t.hint} />
                        ))}
                      </div>
                    </Field>
                  </>
                )}
              </Card>
            </div>

            <div className={clsx(rise, '[animation-delay:100ms]')}>
              <Card>
                <h3 className="text-[15px] font-bold text-[var(--color-text-main)]">Något tungt, ömtåligt eller värdefullt?</h3>
                <p className="text-[13px] leading-[19px] text-[var(--color-inactive-extra-dark)] mt-1">Över 80 kg eller värt över 30 000 kr? Då sätter vi fler bärare och tar med det i försäkringen.</p>
                <div className="flex flex-col gap-1.5 mt-3" data-invalid={shownErrors.heavy ? 'true' : undefined}>
                  <div className="flex flex-wrap gap-1.5">
                    {HEAVY_KINDS.map((k) => (
                      <Pill key={k.value} multi className="flex-none" active={req.heavyKinds.includes(k.value)} onClick={() => toggleHeavy(k.value)}>
                        {k.label}
                      </Pill>
                    ))}
                  </div>
                  {shownErrors.heavy && <ErrorText>{shownErrors.heavy}</ErrorText>}
                </div>
                {req.heavyKinds.includes('other') && (
                  <textarea
                    className={clsx(textareaClass, 'mt-3', rise, shownErrors.heavyNote && errorBorder)}
                    aria-invalid={!!shownErrors.heavyNote}
                    autoFocus
                    placeholder="Vad är det och ungefär hur tungt?"
                    value={req.heavyNote}
                    onChange={(e) => setReq((r) => ({ ...r, heavyNote: e.target.value }))}
                  />
                )}
              </Card>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full flex flex-col gap-3.5">
            <WaitingStep req={req} movingDate={movingDate} onEdit={() => setStep(0)} onOpen={backToMovepage} />
          </div>
        )}
      </div>

      {/* Steg 3 är ett kvitto utan sticky-knapp: utgången är en länk under Dina svar. */}
      {step !== 2 && (
      <div className="sticky bottom-0 bg-white border-t border-[var(--color-inactive-main)]">
        <div className="w-full max-w-[640px] mx-auto px-4 py-4 flex flex-col gap-2.5 md:items-center">
          {step === 0 && (
            <>
              <Primary onClick={() => tryContinue(() => setStep(1))}>Fortsätt</Primary>
              {hasShownErrors ? (
                <Foot tone="error">Något saknas i underlaget. Fyll i det markerade så räknar vi rätt.</Foot>
              ) : (
                <Foot>Kostnadsfritt och inte bindande.</Foot>
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
                <Foot>
                  Offerten kommer senast nästa vardag före lunch. Inget är bokat förrän du sagt ja ·{' '}
                  <Link href="/terms" className="underline underline-offset-2 hover:text-[var(--color-text-main)]">
                    Villkor
                  </Link>
                </Foot>
              )}
            </>
          )}
        </div>
      </div>
      )}
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
  const newSecondary = (): Secondary => ({ id: Date.now(), kind: 'storage', area: 0, move: true, clean: true })
  const addSecondary = () => onChange({ hasSecondaries: true, secondaries: [...res.secondaries, newSecondary()] })
  const removeSecondary = (id: number) => onChange({ secondaries: res.secondaries.filter((s) => s.id !== id) })

  return (
    <Card>
      {/* Adressen är kortets rubrik, etiketten ovanför säger vilken av de två
          det är. Linjen under skiljer rubriken från fälten. */}
      <div className="flex flex-col gap-1 pb-3 border-b border-[var(--color-inactive-main)]">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-inactive-dark)]">{label}</span>
        <span className="text-[18px] leading-6 font-bold text-[var(--color-text-main)] tracking-[-0.01em]">
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

      {/* Boarean frågas bara där man flyttar från: den styr volym och städyta.
          Våningen frågas bara i lägenhet, villa och radhus har ingen. Det som
          blir ensamt i raden håller sin halva. */}
      {origin && (
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
          <div className="flex-1" aria-hidden="true" />
        </div>
      )}
      {err('size') && <ErrorText className="mt-1.5">{err('size')}</ErrorText>}

      {apartment && (
        <Field label="Våning" className="mt-3" error={err('floor')}>
          <div className="grid grid-cols-6 gap-1.5">
            {FLOORS.map((f) => (
              <Pill key={f.value} active={res.floor === f.value} onClick={() => onChange({ floor: f.value })}>
                {f.label}
              </Pill>
            ))}
          </div>
        </Field>
      )}

      {apartment ? (
        <Field label="Hiss" className="mt-3" error={err('elevator')}>
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
          <Field label="Utemöbler, grill eller studsmatta som ska med?" className="mt-3" error={err('outdoor')}>
            <div className={clsx('flex gap-1.5', rise)}>
              <Pill active={res.outdoorFurniture === true} onClick={() => onChange({ outdoorFurniture: true })}>
                Ja
              </Pill>
              <Pill active={res.outdoorFurniture === false} onClick={() => onChange({ outdoorFurniture: false })}>
                Nej
              </Pill>
            </div>
          </Field>
        )
      )}

      {/* Sex korta värden: piller som Hiss, inte en rullista. Då är Våning den
          enda nativa listan i kortet, där den hör hemma. */}
      <Field label="Bärsträcka, från porten till där bilen kan stå" className="mt-3" error={err('distance')}>
        <div className="grid grid-cols-3 gap-1.5">
          {DISTANCES.map((d) => (
            <Pill key={d.value} active={res.distance === d.value} onClick={() => onChange({ distance: d.value })}>
              {d.label}
            </Pill>
          ))}
        </div>
      </Field>

      {/* Inget hopfällt: varje fråga kräver ett aktivt svar, även nej. Annars glöms
          det som kostar mest att upptäcka på flyttdagen. */}
      <Field label="Trång gata, bom eller ingen plats för lastbilen?" className="mt-3" error={err('access')}>
        <div className="flex gap-1.5">
          <Pill active={res.hardAccess === true} onClick={() => onChange({ hardAccess: true })}>
            Ja
          </Pill>
          <Pill active={res.hardAccess === false} onClick={() => onChange({ hardAccess: false, accessNote: '' })}>
            Nej
          </Pill>
        </div>
        {res.hardAccess && (
          <div className={clsx('flex flex-col gap-1.5', rise)} data-invalid={err('accessNote') ? 'true' : undefined}>
            <textarea
              autoFocus
              aria-invalid={!!err('accessNote')}
              className={clsx(textareaClass, err('accessNote') && errorBorder)}
              placeholder="Gårdshus, bilen får inte in på gården. Ca 40 m från gatan."
              value={res.accessNote}
              onChange={(e) => onChange({ accessNote: e.target.value })}
            />
            {err('accessNote') && <ErrorText>{err('accessNote')}</ErrorText>}
          </div>
        )}
      </Field>

      {origin && (
        <Field label="Förråd, garage eller vind som ska tömmas eller städas?" className="mt-3" error={err('secondaries')}>
          <div className="flex gap-1.5">
            <Pill active={res.hasSecondaries === true} onClick={() => onChange({ hasSecondaries: true, secondaries: res.secondaries.length ? res.secondaries : [newSecondary()] })}>
              Ja
            </Pill>
            <Pill active={res.hasSecondaries === false} onClick={() => onChange({ hasSecondaries: false, secondaries: [] })}>
              Nej
            </Pill>
          </div>
          {res.hasSecondaries && (
            <div className={clsx('flex flex-col gap-1.5', rise)}>
              {res.secondaries.map((s) => (
                <SecondaryRow key={s.id} s={s} error={err(`secondary.${s.id}`)} onChange={(p) => patchSecondary(s.id, p)} onRemove={() => removeSecondary(s.id)} />
              ))}
              <button
                type="button"
                onClick={addSecondary}
                className={clsx('self-start min-h-11 -my-1 flex items-center gap-1.5 text-[13px] font-semibold text-[var(--color-text-main)] rounded-sm', press, pressSoft)}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
                  <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Lägg till en till
              </button>
            </div>
          )}
        </Field>
      )}
    </Card>
  )
}

/** En biyta: vad det är, hur stor, och om den ska flyttas eller städas. */
const SecondaryRow = ({ s, error, onChange, onRemove }: { s: Secondary; error?: string; onChange: (p: Partial<Secondary>) => void; onRemove: () => void }) => (
  <div
    data-invalid={error ? 'true' : undefined}
    className={clsx('flex flex-col gap-2 rounded-lg border p-2.5', rise, error ? 'bg-[var(--color-inactive-super-light)] border-[var(--color-error-red)]' : 'bg-[var(--color-background-default)] border-[var(--color-inactive-main)]')}
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
        className={clsx('w-11 h-11 -mr-2 shrink-0 flex items-center justify-center rounded-full text-[var(--color-inactive-dark)] hover:text-[var(--color-text-main)] hover:bg-white', press)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
    <div className="flex gap-1.5">
      <Pill multi active={s.move} onClick={() => onChange({ move: !s.move })}>
        Flyttas
      </Pill>
      <Pill multi active={s.clean} onClick={() => onChange({ clean: !s.clean })}>
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
  // Bostaden lämnas städad, så städningen ligger aldrig efter flyttdagen.
  // Förslaget är flyttdagen: bärarna först, städarna efter.
  const dayHint = (value: Cleaning['day']) => {
    if (value === 'same') return moveDate ? `${formatDate(moveDate)} · bärarna först, städarna efter` : 'Efter att bärarna är klara'
    return 'Välj själv, senast flyttdagen'
  }
  return (
    <div>
      {/* Ytan står redan i raden ovanför; bara biytorna är ny information. */}
      {extra && <p className="text-[13px] leading-[19px] text-[var(--color-inactive-extra-dark)]">{cleanArea(from)} m² städyta inklusive biytorna som ska städas.</p>}

      <Field label="Något av det här i bostaden?" className={extra ? 'mt-3' : undefined} error={errors.cleanDetails}>
        <div className="flex flex-wrap gap-1.5">
          <Pill multi className="flex-none" active={cleaning.specialWindows} onClick={() => onChange({ specialWindows: !cleaning.specialWindows, nothingSpecial: false })}>
            Spröjs eller takfönster
          </Pill>
          <Pill multi className="flex-none" active={cleaning.glazedBalcony} onClick={() => onChange({ glazedBalcony: !cleaning.glazedBalcony, nothingSpecial: false })}>
            Inglasad balkong
          </Pill>
          <Pill multi className="flex-none" active={cleaning.sensitiveSurfaces} onClick={() => onChange({ sensitiveSurfaces: !cleaning.sensitiveSurfaces, nothingSpecial: false })}>
            Marmor eller obehandlat trä
          </Pill>
          <Pill multi className="flex-none" active={cleaning.nothingSpecial} onClick={() => onChange({ nothingSpecial: true, specialWindows: false, glazedBalcony: false, sensitiveSurfaces: false, balconyArea: 0 })}>
            Inget av det här
          </Pill>
        </div>
      </Field>
      <div>
        {cleaning.glazedBalcony && (
          <div className={clsx('pt-3', rise)}>
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
      </div>

      <Field label="Hur kommer städarna in?" className="mt-3 pt-3 border-t border-[var(--color-inactive-main)]">
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
              onClick={() => onChange({ day: d.value, customDate: d.value === 'custom' ? cleaning.customDate || (moveDate ? isoDate(moveDate) : '') : cleaning.customDate })}
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
              max={moveDate ? isoDate(moveDate) : undefined}
              aria-invalid={!!errors.cleanDate}
              className={clsx(areaInput, 'max-w-[220px] bg-white', errors.cleanDate && errorBorder)}
              value={cleaning.customDate}
              onChange={(e) => onChange({ customDate: e.target.value })}
            />
          </Field>
        </div>
      )}
    </div>
  )
}

const WaitingStep = ({ req, movingDate, onEdit, onOpen }: { req: QuoteRequest; movingDate: Date; onEdit: () => void; onOpen: () => void }) => {
  // Brandguidens Block 1: "Undrar du något hör du av dig i chatten." Kanalen står
  // direkt under Ninas bubbla, så löftet "säg till" har en knapp.
  const { show: openChat } = useIntercom()
  const now = new Date()
  const time = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' }).format(now)
  const addonLabels = ADDONS.filter((a) => req.addons.includes(a.value)).map((a) => a.label.toLowerCase())
  return (
    <>
      <div className={rise}>
        <Card>
          <div className="flex items-center gap-3">
            <Image
              src="https://ik.imagekit.io/flyttsmart/Marketing/Nina_IPgqu3hJB.jpg?tr=w-64,h-64,fo-face"
              alt="Nina Fredriksson"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <span className="flex flex-col gap-0.5">
              <span className="text-[15px] font-bold text-[var(--color-text-main)]">Nina Fredriksson</span>
              <span className="text-[13px] text-[var(--color-inactive-dark)]">Din flyttkoordinator</span>
            </span>
          </div>
          <p className={clsx('mt-3 rounded-[12px_12px_12px_2px] bg-[var(--color-secondary-extra-extra-light)] px-3.5 py-3 text-[13px] leading-[19px] text-[var(--color-text-main)]', rise, '[animation-delay:350ms]')}>
            Jag räknar på din flytt från {req.from.street} nu. Vill du lägga till eller ändra något, skriv till mig här så tar jag det direkt.
          </p>
          <button
            type="button"
            onClick={() => openChat()}
            className={clsx('mt-4 min-h-11 px-4 rounded-full border border-[var(--color-secondary-main)] bg-white text-[13px] font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-background-default)]', press, pressScale)}
          >
            Öppna chatten
          </button>
        </Card>
      </div>

      <div className={clsx(rise, '[animation-delay:120ms]')}>
        <Card>
          <Timeline
            items={[
              { state: 'done', title: 'Uppgifter skickade', hint: `I dag ${time} · bekräftelse på mejl` },
              { state: 'current', title: 'Vi tar fram din offert', hint: 'Senast nästa vardag före lunch · du får SMS' },
              { state: 'todo', title: 'Du godkänner eller ändrar', hint: 'Inget är bokat förrän du sagt ja' },
            ]}
          />
        </Card>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className={clsx('w-full text-left rounded-[10px] bg-white border border-[var(--color-inactive-main)] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-(--color-secondary-main)/40', press, pressSoft, rise, '[animation-delay:200ms]')}
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-[var(--color-text-main)]">Dina svar</span>
          <span className="text-[13px] text-[var(--color-inactive-dark)]">
            {req.from.street} → {req.to.street}{'\u00a0· '}{req.dateMode === 'fixed' ? formatDate(movingDate) : req.dateMode === 'custom' && req.customDate ? formatDate(new Date(req.customDate)) : 'flexibelt datum'}
            {'\u00a0· '}flytthjälp{addonLabels.length ? `, ${addonLabels.join(', ')}` : ''}
          </span>
        </span>
        <Chevron />
      </button>

      <div className={clsx('flex justify-center pt-1', rise, '[animation-delay:260ms]')}>
        <MoreLink onClick={onOpen}>Öppna flyttsidan</MoreLink>
      </div>
    </>
  )
}

export default DemoMovehelpFlow
