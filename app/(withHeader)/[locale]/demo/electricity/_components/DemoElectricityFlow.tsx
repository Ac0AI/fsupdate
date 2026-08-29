'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import i18nConfig from 'i18nConfig'
import { useDemoUser } from '@/common/data/useDemoUser'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useToastContext } from '@/common/context/toast/toast.provider'
import { Modal, ModalContent, ModalTitle } from '@/components/molecules/Modal'
import { Card, Check, Checkbox, Chevron, type Errors, ErrorText, Field, Foot, Hero, Pill, Primary, Radio, StepBar, Toggle, areaInput, errorBorder, focusFirstInvalid, scrollFlowToTop, useNoScrollAnchoring, press, pressSoft, rise } from '../../_components/flow-ui'
import { APARTMENTS, OFFERS, STEP_HINTS, STEP_TITLES, type Offer, type OfferId, type ResidenceType, estimateKwh, formatKr, formatOre, monthlyCost } from './offers'

const formatDate = (d: Date) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(d)
const formatDateYear = (d: Date) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
const formatTime = (d: Date) => new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' }).format(d)
const isoDate = (d: Date) => new Intl.DateTimeFormat('sv-SE').format(d)
const formatKwh = (n: number) => new Intl.NumberFormat('sv-SE').format(n)

type Residence = { size: number; type: ResidenceType }
type Details = { startMode: 'movein' | 'custom'; customDate: string; terminate: boolean; apartment: string; apartmentManual: string }
type Contact = { email: string; phone: string }

const HERO_COPY = [
  'Vi har hämtat adressen från din flytt. Här är avtalen som gäller där.',
  'Vi vet vart du flyttar. Nu behöver vi bara veta när avtalet ska börja gälla.',
  'Läs igenom innan du signerar. Det här är allt som händer.',
  'Öppna BankID på din mobil och signera. Vi väntar här.',
  'Fullmakten är signerad. Nu sköter vi resten åt dig.',
]

// Samma rytm som en riktig signering: BankID öppnas, man skriver under,
// backend bekräftar. Lång nog att skärmen hinner läsas.
const FAKE_SIGN_MS = 2600

const detailErrors = (d: Details): Errors => {
  const e: Errors = {}
  if (d.startMode === 'custom') {
    if (!d.customDate) e.customDate = 'Välj vilken dag avtalet ska börja gälla.'
    else if (d.customDate < isoDate(new Date())) e.customDate = 'Den dagen har redan varit. Välj en dag framåt.'
  }
  if (!d.apartment) e.apartment = 'Välj din lägenhet i listan, så hamnar avtalet på rätt anläggning.'
  else if (d.apartment === 'manual' && !/^\d{4}$/.test(d.apartmentManual)) e.apartment = 'Lägenhetsnumret har fyra siffror, till exempel 1101.'
  return e
}

const summaryErrors = (accepted: boolean, contact: Contact, editing: boolean): Errors => {
  const e: Errors = {}
  if (editing) {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact.email)) e.email = 'Fyll i en e-postadress som fungerar, dit skickar vi bekräftelsen.'
    if (contact.phone.replace(/\D/g, '').length < 8) e.phone = 'Fyll i ett telefonnummer så leverantören kan nå dig.'
  }
  if (!accepted) e.accepted = 'Bocka i att du godkänner villkoren, annars kan vi inte teckna avtalet.'
  return e
}

const DemoElectricityFlow = () => {
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const { showToast } = useToastContext()
  const { activitiesList, skipChecklistItem } = useChecklistContext()
  const demoUser = useDemoUser()
  const move = demoUser.currentMove
  const moveIn = new Date(move.movingDate)
  const pathTo = (p: string) => (locale === i18nConfig.defaultLocale ? p : `/${locale}${p}`)

  const [step, setStep] = useState(0)
  const [residence, setResidence] = useState<Residence>({ size: move.residenceSize, type: (move.residenceType as ResidenceType) || 'apartment' })
  const [editingResidence, setEditingResidence] = useState(false)
  const [chosenId, setChosenId] = useState<OfferId>('skekraft')
  const [othersOpen, setOthersOpen] = useState(false)
  const [termsOpen, setTermsOpen] = useState(false)
  const [details, setDetails] = useState<Details>({ startMode: 'movein', customDate: '', terminate: true, apartment: '', apartmentManual: '' })
  const [contact, setContact] = useState<Contact>({ email: demoUser.contact.email, phone: demoUser.contact.phone })
  const [editingContact, setEditingContact] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [poaOpen, setPoaOpen] = useState(false)
  const [signedAt, setSignedAt] = useState<Date | null>(null)
  const [attempted, setAttempted] = useState<Record<number, boolean>>({})
  const signTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const kwh = estimateKwh(residence.size, residence.type)
  const chosen = OFFERS.find((o) => o.id === chosenId) as Offer
  const recommended = OFFERS[0]
  const others = OFFERS.filter((o) => o.id !== recommended.id)
  const priced = OFFERS.map((o) => ({ ...o, monthly: monthlyCost(o, kwh) }))
  const cheapest = Math.min(...priced.map((o) => o.monthly))
  const dearest = Math.max(...priced.map((o) => o.monthly))
  const otherPrices = priced.filter((o) => o.id !== recommended.id).map((o) => o.monthly)
  const startDate = details.startMode === 'custom' && details.customDate ? new Date(details.customDate) : moveIn
  const apartmentNumber = details.apartment === 'manual' ? details.apartmentManual : details.apartment

  const errors: Errors = step === 1 ? detailErrors(details) : step === 2 ? summaryErrors(accepted, contact, editingContact) : {}
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

  // Steg 4: väntan på BankID. Avbryter man händer ingenting.
  useEffect(() => {
    if (step !== 3) return
    signTimer.current = setTimeout(() => {
      const now = new Date()
      setSignedAt(now)
      setStep(4)
      showToast('Signerat. Vi sköter resten.', 'confirm')
      const item = activitiesList.find((a) => a.type === 'power')
      if (item) skipChecklistItem('power', item.id, false)
    }, FAKE_SIGN_MS)
    return () => clearTimeout(signTimer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step])

  const goBackToMovepage = () => router.push(pathTo('/demo/movepage'))

  return (
    <div ref={rootRef} className="min-h-[calc(100dvh-56px)] bg-[#F8FAF9] flex flex-col [overflow-anchor:none]">
      <StepBar step={step} titles={STEP_TITLES} hints={STEP_HINTS} label={step === 4 ? 'Klart · 5 av 5' : undefined} />
      <Hero
        eyebrow={step === 4 ? 'Klart · 5 av 5' : `Steg ${step + 1} av ${STEP_TITLES.length} · ${STEP_TITLES[step]}`}
        title="Elavtal"
        copy={HERO_COPY[step]}
        tone={step === 4 ? 'green' : 'blue'}
        back={{ label: 'Tillbaka till flyttsidan', onClick: goBackToMovepage }}
      >
        {step === 0 && (
          <div className={clsx('mt-2 rounded-[10px] bg-white p-3.5 flex flex-col gap-3 md:max-w-[560px]', rise)}>
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#214766]">
                  {move.toAddress.street} · {residence.size} kvm
                </span>
                <span className="text-[13px] text-[#767678]">
                  {residence.type === 'house' ? 'Hus' : 'Lägenhet'} · {formatKwh(kwh)} kWh per år
                </span>
              </div>
              <button type="button" onClick={() => setEditingResidence((v) => !v)} className={clsx('text-[13px] font-semibold text-[#214766] underline underline-offset-2 rounded px-1 py-2', press)}>
                {editingResidence ? 'Klar' : 'Ändra'}
              </button>
            </div>
            {editingResidence && (
              <div className={clsx('flex flex-wrap gap-1.5 pt-3 border-t border-[#EEEEF0]', rise)}>
                <Field label="Boarea">
                  <input
                    type="text"
                    inputMode="numeric"
                    className={areaInput}
                    placeholder="m²"
                    value={residence.size ? `${residence.size} m²` : ''}
                    onChange={(e) => setResidence((r) => ({ ...r, size: Number(e.target.value.replace(/\D/g, '')) || 0 }))}
                  />
                </Field>
                <Field label="Bostadstyp">
                  <div className="flex gap-1.5">
                    <Pill active={residence.type === 'apartment'} onClick={() => setResidence((r) => ({ ...r, type: 'apartment' }))}>
                      Lägenhet
                    </Pill>
                    <Pill active={residence.type === 'house'} onClick={() => setResidence((r) => ({ ...r, type: 'house' }))}>
                      Hus
                    </Pill>
                  </div>
                </Field>
                <p className="basis-full text-xs leading-4 text-[#767678]">Förbrukningen räknas om direkt. Du kan alltid justera den senare.</p>
              </div>
            )}
          </div>
        )}
      </Hero>

      <div key={step} className={clsx('flex-1 w-full max-w-[818px] mx-auto px-4 py-4 md:py-6 flex flex-col gap-3.5', rise)}>
        {step === 0 && (
          <div className="w-full md:max-w-[560px] md:mx-auto flex flex-col gap-3.5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#1F6156]">
              <Shield />
              Inga bindningstider. Byt när du vill.
            </div>

            {/* Förslaget: ett avtal, med skälen. Resten ligger bakom en rad. */}
            <div className={clsx('rounded-[12px] bg-white border-2 p-4 flex flex-col gap-3.5 transition-colors duration-200', chosenId === recommended.id ? 'border-[#51C8B4]' : 'border-[#EEEEF0]')}>
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#1F6156]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#51C8B4]" />
                Billigast för din förbrukning
              </div>
              <div className="flex items-end justify-between gap-3">
                <div className="flex flex-col gap-1.5">
                  <Logo offer={recommended} />
                  <span className="text-[13px] text-[#767678]">
                    {recommended.kind} · ingen bindningstid
                  </span>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-[28px] leading-8 font-black tracking-[-0.02em] text-[#214766]">{formatKr(monthlyCost(recommended, kwh))}</span>
                  <span className="text-xs text-[#767678]">per månad, uppskattat</span>
                </div>
              </div>
              <ul className="flex flex-col gap-1.5">
                <Why>{formatKr((dearest - cheapest) * 12)} billigare per år än det dyraste avtalet på din adress</Why>
                {recommended.feeFreeMonths > 0 && <Why>Ingen månadsavgift första året, värde {formatKr(recommended.monthlyFee * recommended.feeFreeMonths)}</Why>}
                <Why>Ingen bindningstid, {recommended.notice}</Why>
              </ul>
              <ComparePrice offer={recommended} />
              <button type="button" onClick={() => setTermsOpen((v) => !v)} aria-expanded={termsOpen} className={clsx('flex items-center justify-between gap-3 text-[13px] font-semibold text-[#214766] rounded px-1 py-2 -mx-1', press)}>
                Villkor och avtalssammanfattning
                <Chevron direction={termsOpen ? 'down' : 'right'} />
              </button>
              {termsOpen && (
                <div className={clsx('flex flex-col', rise)}>
                  <ContractRows offer={recommended} startDate={startDate} />
                </div>
              )}
              {chosenId !== recommended.id && (
                <button type="button" onClick={() => setChosenId(recommended.id)} className={clsx('h-10 rounded-full border border-[#214766] text-[13px] font-semibold text-[#214766] bg-white hover:bg-[#F4FCFA]', press)}>
                  Välj {recommended.name} i stället
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOthersOpen((v) => !v)}
              aria-expanded={othersOpen}
              className={clsx('w-full text-left rounded-[10px] bg-white border border-[#EEEEF0] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-[#214766]/40', press, pressSoft)}
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#214766]">{othersOpen ? 'Andra avtal på din adress' : `Visa ${others.length} andra avtal`}</span>
                <span className="text-[13px] text-[#767678]">
                  Från {formatKr(Math.min(...otherPrices))} till {formatKr(Math.max(...otherPrices))} per månad
                </span>
              </span>
              <Chevron direction={othersOpen ? 'down' : 'right'} />
            </button>

            {othersOpen && (
              <div className={clsx('flex flex-col gap-2', rise)}>
                {priced
                  .filter((o) => o.id !== recommended.id)
                  .map((o) => {
                    const active = chosenId === o.id
                    return (
                      <button
                        key={o.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setChosenId(o.id)}
                        className={clsx(
                          'w-full text-left rounded-[10px] bg-white border-2 px-3.5 py-3 flex items-center justify-between gap-3',
                          press,
                          pressSoft,
                          active ? 'border-[#51C8B4] bg-[#F4FCFA]' : 'border-[#EEEEF0] hover:border-[#214766]/40',
                        )}
                      >
                        <span className="flex flex-col gap-1">
                          <Logo offer={o} small />
                          <span className="text-[13px] text-[#767678]">
                            {o.kind} · {formatOre(o.comparePrice)}
                          </span>
                        </span>
                        <span className="flex items-center gap-2.5">
                          <span className="text-[17px] font-bold text-[#214766]">{formatKr(o.monthly)}</span>
                          <span className={clsx('w-5 h-5 rounded-full flex items-center justify-center transition-colors duration-200', active ? 'bg-[#51C8B4]' : 'border-[1.9px] border-[#9F9FA1] bg-white')}>{active && <Check size={12} pop />}</span>
                        </span>
                      </button>
                    )
                  })}
                <p className="text-xs leading-[17px] text-[#767678]">Jämförpris vid 5 000 kWh/år, inklusive påslag, elcertifikat och moms. Elnätsavgift ingår inte. Månadskostnaden är uppskattad för {formatKwh(kwh)} kWh/år vid dagens spotpris.</p>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="w-full md:max-w-[560px] md:mx-auto flex flex-col gap-3.5">
            <Card className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="w-[22px] h-[22px] rounded-full bg-[#51C8B4] flex items-center justify-center shrink-0">
                  <Check size={12} />
                </span>
                <span className="flex flex-col gap-1">
                  <Logo offer={chosen} small />
                  <span className="text-[13px] text-[#767678]">
                    {formatKr(monthlyCost(chosen, kwh))} per månad · {chosen.kind.toLowerCase()}
                  </span>
                </span>
              </div>
              <button type="button" onClick={() => setStep(0)} className={clsx('text-[13px] font-semibold text-[#214766] underline underline-offset-2 rounded px-1 py-2', press)}>
                Byt
              </button>
            </Card>

            <Card>
              <h3 className="text-[15px] font-bold text-[#214766]">När ska avtalet börja gälla?</h3>
              <div className="flex flex-col gap-2 mt-2.5">
                <Radio active={details.startMode === 'movein'} onClick={() => setDetails((d) => ({ ...d, startMode: 'movein' }))} title={formatDate(moveIn)} hint="Dagen du får tillträde" />
                <Radio
                  active={details.startMode === 'custom'}
                  onClick={() => setDetails((d) => ({ ...d, startMode: 'custom', customDate: d.customDate || isoDate(moveIn) }))}
                  title="Ett annat datum"
                />
              </div>
              {details.startMode === 'custom' && (
                <div className={clsx('mt-3', rise)}>
                  <Field label="Vilken dag?" error={shownErrors.customDate}>
                    <input
                      type="date"
                      autoFocus
                      min={isoDate(new Date())}
                      aria-invalid={!!shownErrors.customDate}
                      className={clsx(areaInput, 'max-w-[220px] bg-white', shownErrors.customDate && errorBorder)}
                      value={details.customDate}
                      onChange={(e) => setDetails((d) => ({ ...d, customDate: e.target.value }))}
                    />
                  </Field>
                </div>
              )}
            </Card>

            <Card>
              <button type="button" role="switch" aria-checked={details.terminate} onClick={() => setDetails((d) => ({ ...d, terminate: !d.terminate }))} className={clsx('w-full flex items-center justify-between gap-3 text-left rounded-sm', press)}>
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold text-[#214766]">Vi säger upp ditt gamla avtal</span>
                  <span className="text-[13px] leading-[19px] text-[#767678]">
                    {details.terminate ? `Sker automatiskt den ${formatDate(startDate)}. Du behöver inte höra av dig till din nuvarande leverantör.` : 'Du säger upp det själv. Se till att det slutar samma dag som det nya börjar.'}
                  </span>
                </span>
                <Toggle on={details.terminate} />
              </button>
              <div className="flex items-start gap-2 mt-3 pt-3 border-t border-[#EEEEF0] text-xs leading-4 text-[#767678]">
                <Info />
                Gäller om du står på det nuvarande avtalet. Gör du inte det hör vi av oss och löser det.
              </div>
            </Card>

            <Card>
              <h3 className="text-[15px] font-bold text-[#214766]">Vilken lägenhet är din?</h3>
              <p className="text-[13px] leading-[19px] text-[#767678] mt-1">
                Vi hittade {APARTMENTS.length} lägenheter på {move.toAddress.street}. Numret står på din dörr eller i hyresavtalet.
              </p>
              <div className="mt-3">
                <Field label="Lägenhetsnummer" error={shownErrors.apartment}>
                  <div className="flex gap-1.5">
                    <select
                      aria-invalid={!!shownErrors.apartment}
                      className={clsx(areaInput, 'bg-white max-w-[220px]', shownErrors.apartment && errorBorder)}
                      value={details.apartment}
                      onChange={(e) => setDetails((d) => ({ ...d, apartment: e.target.value }))}
                    >
                      <option value="">Välj</option>
                      {APARTMENTS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                      <option value="manual">Mitt nummer finns inte med</option>
                    </select>
                    {details.apartment === 'manual' && (
                      <input
                        type="text"
                        inputMode="numeric"
                        autoFocus
                        maxLength={4}
                        placeholder="1101"
                        aria-invalid={!!shownErrors.apartment}
                        className={clsx(areaInput, 'max-w-[120px]', rise, shownErrors.apartment && errorBorder)}
                        value={details.apartmentManual}
                        onChange={(e) => setDetails((d) => ({ ...d, apartmentManual: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                      />
                    )}
                  </div>
                </Field>
              </div>
              <p className="text-xs leading-4 text-[#767678] mt-2.5">Behövs bara när vi inte redan har anläggnings-ID för bostaden.</p>
            </Card>
          </div>
        )}

        {step === 2 && (
          <div className="w-full md:max-w-[560px] md:mx-auto flex flex-col gap-3.5">
            <Card>
              <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#EEEEF0]">
                <Logo offer={chosen} />
                <span className="text-[13px] font-semibold text-[#214766]">{chosen.kind}</span>
              </div>
              <ContractRows offer={chosen} startDate={startDate} onEditDate={() => setStep(1)} address={`${move.toAddress.street} · lgh ${apartmentNumber}`} onEditAddress={() => setStep(1)} terminate={details.terminate} />
              <div className="mt-3">
                <ComparePrice offer={chosen} />
              </div>
            </Card>

            <Card>
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-0.5 min-w-0">
                  <span className="text-[15px] font-bold text-[#214766]">{demoUser.profile.fullName}</span>
                  {!editingContact && (
                    <span className="text-[13px] text-[#767678] truncate">
                      {contact.email} · {contact.phone}
                    </span>
                  )}
                </div>
                <button type="button" onClick={() => setEditingContact((v) => !v)} className={clsx('text-[13px] font-semibold text-[#214766] underline underline-offset-2 rounded px-1 py-2 shrink-0', press)}>
                  {editingContact ? 'Klar' : 'Ändra'}
                </button>
              </div>
              {editingContact && (
                <div className={clsx('flex flex-col gap-3 mt-3', rise)}>
                  <Field label="E-post" error={shownErrors.email}>
                    <input type="email" autoFocus aria-invalid={!!shownErrors.email} className={clsx(areaInput, shownErrors.email && errorBorder)} value={contact.email} onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))} />
                  </Field>
                  <Field label="Telefon" error={shownErrors.phone}>
                    <input type="tel" aria-invalid={!!shownErrors.phone} className={clsx(areaInput, shownErrors.phone && errorBorder)} value={contact.phone} onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))} />
                  </Field>
                </div>
              )}
            </Card>

            <label
              data-invalid={shownErrors.accepted ? 'true' : undefined}
              className={clsx(
                'flex flex-col gap-2 rounded-lg px-3.5 py-3 border cursor-pointer transition-colors duration-200 motion-reduce:transition-none',
                shownErrors.accepted ? 'bg-[#FFF5F5] border-[var(--color-error-red)]' : accepted ? 'bg-[#F4FCFA] border-[#51C8B4]' : 'bg-white border-[#EEEEF0] hover:border-[#214766]/40',
              )}
            >
              <span className="flex items-start gap-3">
                <input type="checkbox" className="sr-only" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} />
                <Checkbox checked={accepted} />
                <span className="text-[13px] leading-[19px] text-[#214766]">
                  Jag godkänner {chosen.name}s <span className="font-semibold underline underline-offset-2">allmänna avtalsvillkor</span>
                  {chosen.creditCheck ? ', att en sedvanlig kreditprövning görs,' : ''} och bekräftar uppgifterna ovan.
                </span>
              </span>
              {shownErrors.accepted && <ErrorText>{shownErrors.accepted}</ErrorText>}
            </label>

            <div className="rounded-[10px] bg-[#EAF6F3] border border-[#9EE0D5] px-3.5 py-3.5 flex flex-col gap-2">
              <p className="text-[13px] leading-[19px] font-semibold text-[#1F6156]">
                Du signerar en fullmakt som ger Flyttsmart rätt att säga upp ditt nuvarande elavtal och teckna nytt med {chosen.name}.
              </p>
              <p className="text-xs leading-4 text-[#1F6156]">Du har 14 dagars ångerrätt och kan när som helst återkalla fullmakten.</p>
              <button type="button" onClick={() => setPoaOpen(true)} className={clsx('flex items-center justify-between gap-3 text-[13px] font-semibold text-[#1F6156] underline underline-offset-2 rounded px-1 py-2 -mx-1', press)}>
                Visa fullmakten i sin helhet
                <Chevron />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full md:max-w-[560px] md:mx-auto flex flex-col items-center gap-5 py-6 text-center">
            <span className="relative flex h-20 w-20 items-center justify-center">
              <span className="absolute inset-0 rounded-full bg-[#51C8B4]/25 animate-ping motion-reduce:hidden" />
              <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-[0_6px_20px_rgba(1,22,39,0.12)]">
                <BankIdMark />
              </span>
            </span>
            <div className="flex flex-col gap-1.5">
              <p className="text-[17px] font-bold text-[#214766]">Skriv under i BankID</p>
              <p className="text-[13px] leading-[19px] text-[#767678] max-w-[330px]">
                I appen står fullmakten du signerar: att Flyttsmart får säga upp ditt nuvarande elavtal, teckna nytt med {chosen.name} och hämta anläggningsuppgifter. Giltig 6 månader.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[13px] font-semibold text-[#214766]">
              <span className="w-2 h-2 rounded-full bg-[#214766] animate-pulse motion-reduce:animate-none" />
              Väntar på signering
            </div>
          </div>
        )}

        {step === 4 && signedAt && (
          <div className="w-full md:max-w-[560px] md:mx-auto flex flex-col gap-3.5">
            <div className="flex items-center gap-3.5">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#51C8B4] motion-safe:animate-[pop_.5s_var(--ease-spring)_both]">
                <Check size={28} />
              </span>
              <p className="text-[20px] leading-6 font-black tracking-[-0.01em] text-[#214766]">Klart, vi tar över härifrån</p>
            </div>
            <Card className="flex flex-col">
              <Row label="Ny leverantör" value={chosen.name} />
              <Row label="Avtalet börjar gälla" value={formatDate(startDate)} />
              <Row label="Gamla avtalet" value={details.terminate ? `Vi säger upp det ${formatDate(startDate)}` : 'Du säger upp det själv'} />
              <Row label="Fullmakt signerad" value={`${formatDate(signedAt)} ${formatTime(signedAt)}`} last />
            </Card>
            <button
              type="button"
              onClick={() => router.push(pathTo('/demo/broadband'))}
              className={clsx('w-full text-left rounded-[10px] bg-[#FFF1E5] border border-[#FFD4B3] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-[#F5A623]', press, pressSoft, rise, '[animation-delay:200ms]')}
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-[15px] font-bold text-[#214766]">Näst på tur: bredband</span>
                <span className="text-[13px] text-[#214766]">Tar ungefär lika lång tid</span>
              </span>
              <Chevron />
            </button>
          </div>
        )}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#EEEEF0]">
        <div className="w-full max-w-[818px] mx-auto px-4 py-4 flex flex-col gap-2.5 md:items-center">
          {step === 0 && (
            <>
              <Primary onClick={() => setStep(1)}>Välj {chosen.name}</Primary>
              <Foot>Du signerar först i steg 4. Inget bindande händer nu.</Foot>
            </>
          )}
          {step === 1 && (
            <>
              <Primary onClick={() => tryContinue(() => setStep(2))}>Fortsätt till sammanfattning</Primary>
              {hasShownErrors ? <Foot tone="error">Något saknas ovan. Fyll i det markerade så kan vi teckna avtalet.</Foot> : <Foot>Du signerar först i steg 4. Inget bindande händer nu.</Foot>}
            </>
          )}
          {step === 2 && (
            <>
              <Primary onClick={() => tryContinue(() => setStep(3))}>Signera fullmakt med BankID</Primary>
              {hasShownErrors ? <Foot tone="error">Något saknas ovan. Godkänn villkoren och kolla dina uppgifter.</Foot> : <Foot>Själva signaturen sker i BankID-appen.</Foot>}
            </>
          )}
          {step === 3 && (
            <>
              <Primary variant="outline" onClick={() => setStep(2)}>
                Avbryt signeringen
              </Primary>
              <Foot>Avbryter du händer ingenting. Fullmakten gäller först när du skrivit under.</Foot>
            </>
          )}
          {step === 4 && (
            <>
              <Primary onClick={goBackToMovepage}>Tillbaka till flyttsidan</Primary>
              <Foot>Fullmakt och signaturbevis ligger under Bokningar.</Foot>
            </>
          )}
        </div>
      </div>

      <Modal open={poaOpen} onOpenChange={setPoaOpen}>
        <ModalContent bottomSheet withCloseButton bigCloseButton setShowModal={setPoaOpen}>
          <ModalTitle>
            <span className="text-[17px] font-bold text-[#214766]">Fullmakten</span>
          </ModalTitle>
          <div className="flex flex-col gap-4 text-[13px] leading-[19px] text-[#214766] max-h-[70vh] overflow-y-auto pr-1">
            <p className="text-[15px] font-bold">Fullmakt avseende elavtal och leverantörsbyte</p>
            <PoaSection title="Fullmaktsgivare">
              {demoUser.profile.fullName} · {String(demoUser.profile.pno).slice(0, 8)}-••••
              <br />
              {move.toAddress.street}, lgh {apartmentNumber || '····'}, {move.toAddress.zip.slice(0, 3)} {move.toAddress.zip.slice(3)} {move.toAddress.city}
            </PoaSection>
            <PoaSection title="Fullmaktstagare">
              Flyttsmart Sverige AB · 559218-5846
              <br />
              Sankt Eriksterrassen 72B, 112 34 Stockholm
            </PoaSection>
            <PoaSection title="Fullmakten ger rätt att">
              <ul className="flex flex-col gap-1">
                <Why>Säga upp mitt nuvarande elavtal</Why>
                <Why>Teckna nytt elavtal med {chosen.name}</Why>
                <Why>Inhämta anläggningsuppgifter från elnätsföretaget</Why>
              </ul>
            </PoaSection>
            <PoaSection title="Avtalet som tecknas">
              <div className="flex flex-col">
                <Row label="Elhandlare" value={chosen.name} />
                <Row label="Påslag" value={formatOre(chosen.markup).replace('öre/kWh', 'öre/kWh')} />
                <Row label="Månadsavgift" value={chosen.feeFreeMonths > 0 ? `0 kr i ${chosen.feeFreeMonths} mån, sedan ${formatKr(chosen.monthlyFee)}` : `${formatKr(chosen.monthlyFee)} per månad`} />
                <Row label="Bindningstid" value="Ingen" />
                <Row label="Startdatum" value={formatDateYear(startDate)} last />
              </div>
            </PoaSection>
            <PoaSection title="Giltighet och återkallelse">Fullmakten gäller i 6 månader från signering och kan återkallas när som helst. Du har dessutom 14 dagars ångerrätt på elavtalet.</PoaSection>
            <p className="text-xs leading-4 text-[#767678]">Samma text signeras i BankID-appen och finns i fullmakts-PDFen. Dokument-ID visas efter signering.</p>
            <Primary onClick={() => setPoaOpen(false)}>Stäng</Primary>
          </div>
        </ModalContent>
      </Modal>
    </div>
  )
}

/* ---------- flödets egna delar ---------- */

const Logo = ({ offer, small }: { offer: Offer; small?: boolean }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src={offer.logo} alt={offer.name} width={small ? Math.round(offer.logoWidth * 0.8) : offer.logoWidth} className="h-auto block" style={{ width: small ? Math.round(offer.logoWidth * 0.8) : offer.logoWidth }} />
)

const Why = ({ children }: { children: React.ReactNode }) => (
  <li className="flex items-start gap-2 text-[13px] leading-[19px] text-[#214766]">
    <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#51C8B4] shrink-0" />
    <span>{children}</span>
  </li>
)

const ComparePrice = ({ offer }: { offer: Offer }) => (
  <div className="rounded-lg bg-[#F8FAF9] px-3.5 py-3 flex flex-col gap-1">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] text-[#767678]">Jämförpris vid 5 000 kWh/år</span>
      <span className="text-[15px] font-bold text-[#214766]">{formatOre(offer.comparePrice)}</span>
    </div>
    <span className="text-xs leading-4 text-[#767678]">Inklusive påslag, elcertifikat och moms. Elnätsavgift ingår inte.</span>
  </div>
)

const ContractRows = ({
  offer,
  startDate,
  address,
  terminate,
  onEditDate,
  onEditAddress,
}: {
  offer: Offer
  startDate: Date
  address?: string
  terminate?: boolean
  onEditDate?: () => void
  onEditAddress?: () => void
}) => (
  <div className="flex flex-col">
    <Row label="Påslag" value={formatOre(offer.markup)} />
    <Row label="Månadsavgift" value={offer.feeFreeMonths > 0 ? `0 kr i ${offer.feeFreeMonths} mån, sedan ${formatKr(offer.monthlyFee)}` : `${formatKr(offer.monthlyFee)} per månad`} />
    <Row label="Spotpris" value="Tillkommer per förbrukning" />
    <Row label="Bindningstid" value={`Ingen · ${offer.notice}`} />
    <Row label="Börjar gälla" value={formatDate(startDate)} onEdit={onEditDate} last={!address} />
    {address && <Row label="Adress" value={address} onEdit={onEditAddress} />}
    {address && <Row label="Gamla avtalet" value={terminate ? `Vi säger upp det ${formatDate(startDate)}` : 'Du säger upp det själv'} last />}
  </div>
)

const Row = ({ label, value, onEdit, last }: { label: string; value: string; onEdit?: () => void; last?: boolean }) => (
  <div className={clsx('flex items-center justify-between gap-3 py-2.5', !last && 'border-b border-[#EEEEF0]')}>
    <span className="text-[13px] text-[#767678] shrink-0">{label}</span>
    <span className="flex items-center gap-3 min-w-0">
      <span className="text-[13px] font-semibold text-[#214766] text-right truncate">{value}</span>
      {onEdit && (
        <button type="button" onClick={onEdit} className={clsx('text-[13px] font-semibold text-[#214766] underline underline-offset-2 rounded px-1 py-1.5 shrink-0', press)}>
          Ändra
        </button>
      )}
    </span>
  </div>
)

const PoaSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#767678]">{title}</span>
    <div>{children}</div>
  </div>
)

const Shield = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
    <path d="M12 2.5 4 5.5v6c0 5 3.4 8.6 8 10 4.6-1.4 8-5 8-10v-6l-8-3Z" fill="none" stroke="#1F6156" strokeWidth="2" strokeLinejoin="round" />
    <path d="m8.5 12 2.3 2.3L15.5 9.6" fill="none" stroke="#1F6156" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Info = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0 mt-px" aria-hidden>
    <circle cx="12" cy="12" r="9" fill="none" stroke="#767678" strokeWidth="2" />
    <path d="M12 11v5M12 8v.5" stroke="#767678" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const BankIdMark = () => (
  <svg width="34" height="30" viewBox="0 0 23 20" aria-hidden>
    <path d="M6.5 16.9c.7 0 1.3.3 1.1.8h-3l.5-2.2h1c.2 0 .4-.1.5-.3.4-.6.9-1.2 1.3-1.8h-1l.6-2.6c.5-2.2 1.9-3.6 4.2-3.6 1.5 0 2.5.6 2.3 1.7-.1.7-.6 1.2-1.4 1.6l1.1.1c1.4.2 1.9 1 1.7 2.2-.3 1.5-1.8 2.5-3.9 2.5H9.2l-.6 2.4h-2c.1-.3.1-.6-.1-.8Zm5.7-6c.9 0 1.5-.4 1.6-1 .1-.5-.3-.8-1-.8H12l-.4 1.8h.6Zm-.9 3.6c1 0 1.7-.4 1.8-1.1.1-.6-.3-1-1.1-1h-.9l-.5 2.1h.7ZM3.1 20l1.5-6.6h2.1c1.2 0 1.8.6 1.5 1.8-.3 1.2-1.2 1.8-2.5 1.8h-.4L4.8 20H3.1Zm2.5-4.4c.5 0 .9-.2 1-.6.1-.4-.1-.6-.6-.6h-.4l-.3 1.2h.3ZM17.5 20l1.5-6.6h2c1.8 0 2.7 1 2.3 2.8l-.2 1c-.4 1.8-1.6 2.8-3.4 2.8h-2.2Zm2-1.4h.4c.8 0 1.2-.4 1.4-1.3l.2-1c.2-.9-.1-1.3-.9-1.3h-.3l-.8 3.6Z" fill="#183E4F" />
  </svg>
)

export default DemoElectricityFlow
