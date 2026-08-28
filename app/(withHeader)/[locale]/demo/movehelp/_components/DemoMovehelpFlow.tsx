'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import i18nConfig from 'i18nConfig'
import { demoUser } from '@/common/data/demoMovepage'
import { useToastContext } from '@/common/context/toast/toast.provider'
import { ADDONS, DISTANCES, ELEVATORS, STEP_TITLES, type Addon, type QuoteRequest, type Residence } from './steps'

const formatDate = (d: Date) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(d)
const weekday = (d: Date) => new Intl.DateTimeFormat('sv-SE', { weekday: 'long' }).format(d)
const isoDate = (d: Date) => new Intl.DateTimeFormat('sv-SE').format(d) // sv-SE ger yyyy-mm-dd, som <input type="date"> vill ha
const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6

// Samma mjuka övergång på allt som går att trycka på, så att flödet känns som
// en app och inte som ett formulär. Tryck ger en liten nedskalning, val tonas in.
const press =
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51C8B4] focus-visible:ring-offset-2'
const rise = 'animate-[rise_.35s_ease-out_both] motion-reduce:animate-none'

type Errors = Record<string, string>

// Det Nina inte kan räkna utan. Allt annat får vara tomt, hon frågar om det behövs.
const residenceErrors = (res: Residence, prefix: 'from' | 'to', origin: boolean): Errors => {
  const e: Errors = {}
  if (!res.size) e[`${prefix}.size`] = 'Fyll i boarean så Nina vet hur mycket som ska flyttas.'
  if (origin && res.secondaryArea > 0 && !res.secondaryMove && !res.secondaryClean) e[`${prefix}.secondary`] = 'Välj om biytan ska flyttas eller städas, eller sätt den till 0.'
  if (res.hardAccess && !res.accessNote.trim()) e[`${prefix}.accessNote`] = 'Berätta kort vad som är krångligt, annars kan Nina inte räkna rätt.'
  return e
}

const stepErrors = (step: number, req: QuoteRequest): Errors => {
  if (step === 0) return { ...residenceErrors(req.from, 'from', true), ...residenceErrors(req.to, 'to', false) }
  if (step === 1) {
    const e: Errors = {}
    if (req.heavyItems && !req.heavyNote.trim()) e.heavyNote = 'Berätta vad som är tungt eller ömtåligt, så Nina kan sätta rätt antal bärare.'
    if (req.dateMode === 'custom') {
      if (!req.customDate) e.customDate = 'Välj vilken dag du vill flytta.'
      else if (req.customDate < isoDate(new Date())) e.customDate = 'Den dagen har redan varit. Välj en dag framåt.'
    }
    return e
  }
  return {}
}

const initialResidence = (street: string, city: string, size: number, overrides: Partial<Residence> = {}): Residence => ({
  street,
  city,
  size,
  secondaryArea: 0,
  secondaryMove: true,
  secondaryClean: true,
  floor: 1,
  elevator: 'none',
  distance: 'near',
  hardAccess: false,
  accessNote: '',
  ...overrides,
})

const DemoMovehelpFlow = () => {
  const router = useRouter()
  const { locale } = useParams<{ locale: string }>()
  const { showToast } = useToastContext()
  const move = demoUser.currentMove
  const movingDate = new Date(move.movingDate)

  const [step, setStep] = useState(0)
  const [sending, setSending] = useState(false)
  const [req, setReq] = useState<QuoteRequest>({
    from: initialResidence(move.fromAddress.street, move.fromAddress.city, 68, { floor: 3, elevator: 'big', secondaryArea: 8 }),
    to: initialResidence(move.toAddress.street, move.toAddress.city, move.residenceSize, { floor: 1, distance: 'medium' }),
    heavyItems: false,
    heavyNote: '',
    addons: ADDONS.filter((a) => a.defaultOn).map((a) => a.value),
    dateMode: 'fixed',
    customDate: '',
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
    window.setTimeout(() => {
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      first?.querySelector<HTMLElement>('input, textarea')?.focus({ preventScroll: true })
    }, 0)
  }

  // Nytt steg börjar högst upp. På mobil står man annars kvar vid knappen
  // och ser inte att sidan bytt innehåll.
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const patchResidence = (key: 'from' | 'to', patch: Partial<Residence>) => setReq((r) => ({ ...r, [key]: { ...r[key], ...patch } }))
  const toggleAddon = (a: Addon) => setReq((r) => ({ ...r, addons: r.addons.includes(a) ? r.addons.filter((x) => x !== a) : [...r.addons, a] }))

  const send = () => {
    if (sending) return
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      setStep(2)
      showToast('Skickat. Nina räknar på din flytt.', 'confirm')
    }, 900)
  }

  const backToMovepage = () => router.push(locale === i18nConfig.defaultLocale ? '/demo/movepage' : `/${locale}/demo/movepage`)
  const toElectricity = () => router.push(locale === i18nConfig.defaultLocale ? '/demo/electricity' : `/${locale}/demo/electricity`)

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
      <StepBar step={step} />
      <Hero step={step} />

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

        {step === 1 && (
          <div className="flex flex-col gap-3.5 md:grid md:grid-cols-2 md:grid-rows-[auto_auto] md:items-start">
            <div className={clsx(rise, 'md:col-start-2 md:row-start-1')}>
              <Card>
                <h3 className="text-[15px] font-bold text-[#214766]">Något tungt eller ömtåligt?</h3>
                <p className="text-[13px] leading-[19px] text-[#767678] mt-1">Piano, kassaskåp, akvarium. Sånt som behöver fler bärare.</p>
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
              </Card>
            </div>

            <div className={clsx(rise, '[animation-delay:70ms] md:col-start-1 md:row-start-1 md:row-span-2')}>
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
                      className={clsx('w-full flex items-center justify-between gap-3 py-[11px] border-t border-[#EEEEF0] text-left rounded-sm', press, 'active:scale-100 active:bg-[#F8FAF9]')}
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

            <div className={clsx(rise, '[animation-delay:140ms] md:col-start-2 md:row-start-2')}>
              <Card>
                <h3 className="text-[15px] font-bold text-[#214766]">När vill du flytta?</h3>
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
                    hint="Välj själv, så räknar Nina på den dagen"
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
                  Vardagar är ofta billigare än helger. Flexibel betyder att Nina föreslår ett datum inom en vecka från tillträdet.
                </p>
              </Card>
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
              <Primary onClick={() => tryContinue(() => setStep(1))}>Fortsätt till bohaget</Primary>
              {hasShownErrors ? (
                <Foot tone="error">Något saknas i underlaget. Fyll i det markerade så räknar Nina rätt.</Foot>
              ) : (
                <Foot>Kostnadsfritt och inte bindande. Du bestämmer när förslaget kommer.</Foot>
              )}
            </>
          )}
          {step === 1 && (
            <>
              <Primary onClick={() => tryContinue(send)} loading={sending}>
                {sending ? 'Skickar till Nina' : 'Skicka till Nina'}
              </Primary>
              {hasShownErrors ? (
                <Foot tone="error">Något saknas ovan. Fyll i det markerade så Nina kan räkna rätt.</Foot>
              ) : (
                <Foot>Nina sammanställer och skickar ett förslag. Inget är bokat förrän du godkänt det.</Foot>
              )}
            </>
          )}
          {step === 2 && (
            <>
              <Primary onClick={backToMovepage}>Tillbaka till checklistan</Primary>
              <Foot>Du får SMS när Nina skickat offerten.</Foot>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- byggstenar ---------- */

const StepBar = ({ step }: { step: number }) => (
  <div className="bg-white border-b border-[#EEEEF0]">
    <div className="w-full max-w-[818px] mx-auto px-4 py-4 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-bold text-[#214766]">
          Steg {step + 1} av 3 · {STEP_TITLES[step]}
        </span>
        <span className="text-xs text-[#767678] shrink-0">{['2 min', '1 min', 'Pågår'][step]}</span>
      </div>
      <div className="flex gap-1.5">
        {STEP_TITLES.map((_, i) => (
          <span
            key={i}
            className={clsx(
              'flex-1 h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none',
              i < step ? 'bg-[#51C8B4]' : i === step ? 'bg-[#214766]' : 'bg-[#EEEEF0]',
            )}
          />
        ))}
      </div>
    </div>
  </div>
)

const Hero = ({ step }: { step: number }) => {
  const copy = [
    'Berätta om bostäderna så tar din flyttkoordinator fram ett pris. Vi har fyllt i det vi redan vet.',
    'Hur mycket ska flyttas, och vill du ha hjälp med något mer?',
    'Din offert är på väg.',
  ][step]
  return (
    <div className={clsx('transition-colors duration-700 motion-reduce:transition-none', step === 2 ? 'bg-[#1F6156]' : 'bg-[#3879AD]')}>
      <div className="w-full max-w-[818px] mx-auto px-4 pt-5 pb-6 md:pt-9 md:pb-8 flex flex-col gap-2.5">
        <h1 className="text-[32px] md:text-[42px] font-black tracking-[-0.02em] leading-9 md:leading-[48px] text-white">Flytthjälp och städning</h1>
        <p key={step} className={clsx('text-[15px] md:text-[18px] leading-[21px] md:leading-[25px] text-white max-w-[330px] md:max-w-[560px]', rise)}>
          {copy}
        </p>
      </div>
    </div>
  )
}

const areaInput = 'w-full h-11 rounded-[5px] border-[1.9px] border-[#76767666] px-3 text-base text-[#000000B3] focus:outline-none focus:border-[#51C8B4] transition-colors'
const textareaClass = 'w-full min-h-[72px] rounded-[5px] border-[1.9px] border-[#76767666] px-3 py-2.5 text-base leading-[21px] text-[#000000B3] bg-white focus:outline-none focus:border-[#51C8B4] transition-colors'
const errorBorder = 'border-[var(--color-error-red)] focus:border-[var(--color-error-red)]'

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
}) => (
  <Card>
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#767678]">{label}</span>
      <span className="text-[15px] font-bold text-[#214766]">
        {res.street}, {res.city}
      </span>
    </div>

    <div className="flex flex-wrap gap-1.5 mt-3">
      <Field label="Boarea" invalid={!!errors[`${prefix}.size`]}>
        <input
          type="text"
          inputMode="numeric"
          aria-invalid={!!errors[`${prefix}.size`]}
          className={clsx(areaInput, errors[`${prefix}.size`] && errorBorder)}
          placeholder="m²"
          value={res.size ? `${res.size} m²` : ''}
          onChange={(e) => onChange({ size: Number(e.target.value.replace(/\D/g, '')) || 0 })}
        />
      </Field>
      {origin && (
        <Field label="Biyta">
          <input
            type="text"
            inputMode="numeric"
            className={areaInput}
            placeholder="0 m²"
            value={res.secondaryArea ? `${res.secondaryArea} m²` : ''}
            onChange={(e) => onChange({ secondaryArea: Number(e.target.value.replace(/\D/g, '')) || 0 })}
          />
        </Field>
      )}
      <Field label="Våning">
        <select
          className={clsx(areaInput, 'bg-white')}
          value={res.floor}
          onChange={(e) => onChange({ floor: Number(e.target.value) })}
        >
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((f) => (
            <option key={f} value={f}>
              {f === 0 ? 'Bottenvåning' : f}
            </option>
          ))}
        </select>
      </Field>
      {errors[`${prefix}.size`] && <ErrorText className="basis-full">{errors[`${prefix}.size`]}</ErrorText>}
    </div>

    {origin && (
      <Field label="Förråd, garage eller vind" hint="Biytan ska" className="mt-3" error={errors[`${prefix}.secondary`]}>
        {res.secondaryArea > 0 ? (
          <div className={clsx('flex gap-1.5', rise)}>
            <Pill active={res.secondaryMove} onClick={() => onChange({ secondaryMove: !res.secondaryMove })} multi>
              Flyttas
            </Pill>
            <Pill active={res.secondaryClean} onClick={() => onChange({ secondaryClean: !res.secondaryClean })} multi>
              Städas
            </Pill>
          </div>
        ) : (
          <span className="text-[13px] leading-[19px] text-[#767678]">Ingen biyta angiven. Fyll i om det finns ett förråd som ska tömmas eller städas.</span>
        )}
      </Field>
    )}

    <Field label="Hiss" className="mt-3">
      <div className="flex gap-1.5">
        {ELEVATORS.map((e) => (
          <Pill key={e.value} active={res.elevator === e.value} onClick={() => onChange({ elevator: e.value })}>
            {e.label}
          </Pill>
        ))}
      </div>
    </Field>

    <Field label="Från porten till där bilen kan stå" className="mt-3">
      <div className="flex gap-1.5">
        {DISTANCES.map((d) => {
          const active = res.distance === d.value
          return (
            <button
              key={d.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange({ distance: d.value })}
              className={clsx(
                'flex-1 flex flex-col items-center gap-px py-[7px] px-1 rounded-lg border',
                press,
                active ? 'bg-[#214766] border-[#214766]' : 'bg-white border-[#EEEEF0] hover:border-[#214766]/40',
              )}
            >
              <span className={clsx('text-[13px] transition-colors duration-200', active ? 'text-white font-semibold' : 'text-[#214766]')}>{d.label}</span>
              <span className={clsx('text-xs leading-[14px] transition-colors duration-200', active ? 'text-white/80' : 'text-[#767678]')}>{d.hint}</span>
            </button>
          )
        })}
      </div>
    </Field>

    <label
      data-invalid={errors[`${prefix}.accessNote`] ? 'true' : undefined}
      className={clsx(
        'mt-3 flex flex-col gap-2.5 rounded-lg px-3.5 py-3 border cursor-pointer transition-colors duration-200 motion-reduce:transition-none',
        errors[`${prefix}.accessNote`]
          ? 'bg-[#FFF5F5] border-[var(--color-error-red)]'
          : res.hardAccess
            ? 'bg-[#F4FCFA] border-[#51C8B4]'
            : 'bg-[#F8FAF9] border-[#EEEEF0] hover:border-[#214766]/40',
      )}
    >
      <span className="flex items-start gap-3">
        <input type="checkbox" className="sr-only" checked={res.hardAccess} onChange={(e) => onChange({ hardAccess: e.target.checked })} />
        <Checkbox checked={res.hardAccess} />
        <span className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-[#214766]">Det är krångligt att komma fram här</span>
          {!res.hardAccess && (
            <span className="text-xs leading-4 text-[#767678]">Smal trappa, ingen lastplats, gårdshus, bom. Vet du inte, lämna den av. Nina frågar om det behövs.</span>
          )}
        </span>
      </span>
      {res.hardAccess && (
        <>
          <textarea
            autoFocus
            aria-invalid={!!errors[`${prefix}.accessNote`]}
            className={clsx(textareaClass, rise, errors[`${prefix}.accessNote`] && errorBorder)}
            placeholder="Gårdshus, bilen får inte in på gården. Ca 40 m från gatan."
            value={res.accessNote}
            onChange={(e) => onChange({ accessNote: e.target.value })}
          />
          {errors[`${prefix}.accessNote`] && <ErrorText>{errors[`${prefix}.accessNote`]}</ErrorText>}
        </>
      )}
    </label>
  </Card>
)

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
              { state: 'current', title: 'Nina tar fram förslaget', hint: 'Senast i morgon förmiddag · du får SMS' },
              { state: 'todo', title: 'Du godkänner eller frågar', hint: 'Förslaget gäller i två veckor' },
            ]}
          />
        </Card>
      </div>

      <button
        type="button"
        onClick={onEdit}
        className={clsx('w-full text-left rounded-[10px] bg-white border border-[#EEEEF0] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-[#214766]/40', press, rise, '[animation-delay:200ms]')}
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
        className={clsx('w-full text-left rounded-[10px] bg-[#FFF1E5] border border-[#FFD4B3] px-3.5 py-3.5 flex items-center justify-between gap-3 hover:border-[#F5A623]', press, rise, '[animation-delay:280ms]')}
      >
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-[#214766]">Näst på tur: elavtal</span>
          <span className="text-[13px] text-[#214766]">Tre minuter. Tänd lampa när du kommer, till bra pris.</span>
        </span>
        <Chevron />
      </button>
    </>
  )
}

const Timeline = ({ items }: { items: { state: 'done' | 'current' | 'todo'; title: string; hint: string }[] }) => (
  <div className="flex flex-col">
    {items.map((it, i) => (
      <div key={it.title} className={clsx('flex items-start gap-3', i < items.length - 1 && 'pb-3.5')}>
        <div className="flex flex-col items-center gap-1 shrink-0 w-[22px]">
          {it.state === 'done' && (
            <span className="w-[22px] h-[22px] rounded-full bg-[#51C8B4] flex items-center justify-center animate-[pop_.45s_cubic-bezier(.2,.9,.3,1.3)_both] motion-reduce:animate-none">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {it.state === 'current' && (
            <span className="relative w-[22px] h-[22px]">
              <span className="absolute inset-0 rounded-full bg-[#214766]/30 animate-ping motion-reduce:hidden" />
              <span className="absolute inset-0 rounded-full border-[6px] border-[#214766] bg-white" />
            </span>
          )}
          {it.state === 'todo' && <span className="w-[22px] h-[22px] rounded-full border-2 border-[#EEEEF0] bg-white" />}
          {i < items.length - 1 && <span className={clsx('w-0.5 h-[22px]', it.state === 'done' ? 'bg-[#51C8B4]' : 'bg-[#EEEEF0]')} />}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={clsx('text-[13px] font-semibold', it.state === 'todo' ? 'text-[#767678]' : 'text-[#214766]')}>{it.title}</span>
          <span className="text-xs text-[#767678]">{it.hint}</span>
        </div>
      </div>
    ))}
  </div>
)

const Card = ({ children }: { children: React.ReactNode }) => <div className="rounded-[10px] bg-white border border-[#EEEEF0] p-4">{children}</div>

const Field = ({ label, hint, error, invalid, className, children }: { label: string; hint?: string; error?: string; invalid?: boolean; className?: string; children: React.ReactNode }) => (
  <div className={clsx('flex-1 flex flex-col gap-1.5', className)} data-invalid={error || invalid ? 'true' : undefined}>
    <span className="text-xs text-[#767678]">
      {label}
      {hint && <span className="text-[#214766] font-semibold"> · {hint}</span>}
    </span>
    {children}
    {error && <ErrorText>{error}</ErrorText>}
  </div>
)

const ErrorText = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span role="alert" className={clsx('text-xs leading-4 font-semibold text-[var(--color-error-red)]', rise, className)}>
    {children}
  </span>
)

const Pill = ({ active, multi, onClick, children }: { active: boolean; multi?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={clsx(
      'flex-1 h-10 rounded-full text-[13px] flex items-center justify-center gap-1.5 border',
      press,
      active ? 'bg-[#214766] border-[#214766] text-white font-semibold' : 'bg-white border-[#EEEEF0] text-[#214766] hover:border-[#214766]/40',
    )}
  >
    {multi && active && (
      <svg width="12" height="12" viewBox="0 0 24 24" className="animate-[pop_.25s_ease-out_both] motion-reduce:animate-none">
        <path d="M5 13l4 4L19 7" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
    {children}
  </button>
)

const Radio = ({ active, onClick, title, hint }: { active: boolean; onClick: () => void; title: string; hint?: string }) => (
  <button
    type="button"
    role="radio"
    aria-checked={active}
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left border-2',
      press,
      active ? 'border-[#51C8B4] bg-[#F4FCFA]' : 'border-[#76767666] bg-white hover:border-[#214766]/40',
    )}
  >
    <span
      className={clsx(
        'w-5 h-5 rounded-full shrink-0 bg-white transition-[border-width,border-color] duration-200 ease-out motion-reduce:transition-none',
        active ? 'border-[6px] border-[#51C8B4]' : 'border-[1.9px] border-[#9F9FA1]',
      )}
    />
    <span className="flex flex-col gap-px">
      <span className={clsx('text-[15px] text-[#214766]', active && 'font-bold')}>{title}</span>
      {hint && <span className="text-[13px] text-[#767678]">{hint}</span>}
    </span>
  </button>
)

const Toggle = ({ on }: { on: boolean }) => (
  <span className={clsx('w-11 h-[26px] p-[3px] rounded-full shrink-0 flex items-center transition-colors duration-200 ease-out motion-reduce:transition-none', on ? 'bg-[#51C8B4]' : 'bg-[#D9DBDF]')}>
    <span
      className={clsx(
        'w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out motion-reduce:transition-none',
        on && 'translate-x-[18px]',
      )}
    />
  </span>
)

const Checkbox = ({ checked }: { checked: boolean }) => (
  <span
    className={clsx(
      'w-[22px] h-[22px] rounded shrink-0 mt-px flex items-center justify-center transition-colors duration-200 ease-out motion-reduce:transition-none',
      checked ? 'bg-[#51C8B4]' : 'bg-white border-[3px] border-[#9F9FA1]',
    )}
  >
    {checked && (
      <svg width="13" height="13" viewBox="0 0 24 24" className="animate-[pop_.25s_ease-out_both] motion-reduce:animate-none">
        <path d="M5 13l4 4L19 7" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
)

const Chevron = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
    <path d="M9 5l7 7-7 7" fill="none" stroke="#214766" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const Primary = ({ loading, onClick, children }: { loading?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    aria-busy={loading}
    className={clsx(
      'w-full md:max-w-[420px] min-h-11 rounded-full px-6 py-3 text-[15px] font-bold border-2 border-[#214766] bg-[#214766] text-white flex items-center justify-center gap-2.5',
      press,
      'active:scale-[0.985] hover:bg-[#1A3A54] hover:border-[#1A3A54]',
      loading && 'opacity-80 pointer-events-none',
    )}
  >
    {loading && (
      <svg width="18" height="18" viewBox="0 0 24 24" className="animate-spin motion-reduce:animate-none">
        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )}
    {children}
  </button>
)

const Foot = ({ tone, children }: { tone?: 'error'; children: React.ReactNode }) => (
  <p className={clsx('text-center text-xs leading-4', tone === 'error' ? 'font-semibold text-[var(--color-error-red)]' : 'text-[#767678]')}>{children}</p>
)

export default DemoMovehelpFlow
