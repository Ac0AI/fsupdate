'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { clsx } from 'clsx'
import i18nConfig from 'i18nConfig'
import { demoUser } from '@/common/data/demoMovepage'
import { ADDONS, DISTANCES, ELEVATORS, STEP_TITLES, type Addon, type QuoteRequest, type Residence } from './steps'

const formatDate = (d: Date) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long' }).format(d)
const weekday = (d: Date) => new Intl.DateTimeFormat('sv-SE', { weekday: 'long' }).format(d)

const initialResidence = (street: string, city: string, size: number, overrides: Partial<Residence> = {}): Residence => ({
  street,
  city,
  size,
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
  const move = demoUser.currentMove
  const movingDate = new Date(move.movingDate)

  const [step, setStep] = useState(0)
  const [req, setReq] = useState<QuoteRequest>({
    from: initialResidence(move.fromAddress.street, move.fromAddress.city, 68, { floor: 3, elevator: 'big' }),
    to: initialResidence(move.toAddress.street, move.toAddress.city, move.residenceSize, { floor: 1, distance: 'medium' }),
    heavyItems: false,
    heavyNote: '',
    addons: ADDONS.filter((a) => a.defaultOn).map((a) => a.value),
    dateMode: 'fixed',
  })

  const patchResidence = (key: 'from' | 'to', patch: Partial<Residence>) => setReq((r) => ({ ...r, [key]: { ...r[key], ...patch } }))
  const toggleAddon = (a: Addon) => setReq((r) => ({ ...r, addons: r.addons.includes(a) ? r.addons.filter((x) => x !== a) : [...r.addons, a] }))

  const backToMovepage = () => router.push(locale === i18nConfig.defaultLocale ? '/demo/movepage' : `/${locale}/demo/movepage`)

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col">
      <StepBar step={step} />
      <Hero step={step} />

      <div className="flex-1 w-full max-w-[560px] mx-auto px-4 py-4 flex flex-col gap-3.5">
        {step === 0 && (
          <>
            <ResidenceCard label="Flyttar från" res={req.from} onChange={(p) => patchResidence('from', p)} />
            <ResidenceCard label="Flyttar till" res={req.to} onChange={(p) => patchResidence('to', p)} />
            <p className="text-xs leading-[17px] text-[#767678]">Adresser och tillträdesdatum kommer från din flytt. Boarea från Skatteverket.</p>
          </>
        )}

        {step === 1 && (
          <>
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
                <textarea
                  className="mt-3 w-full min-h-[72px] rounded-[5px] border-[1.9px] border-[#76767666] px-3 py-2.5 text-base leading-[21px] text-[#000000B3] focus:outline-none focus:border-[#51C8B4]"
                  placeholder="T.ex. piano på våning 3, ingen hiss"
                  value={req.heavyNote}
                  onChange={(e) => setReq((r) => ({ ...r, heavyNote: e.target.value }))}
                />
              )}
            </Card>

            <Card>
              <h3 className="text-[15px] font-bold text-[#214766] pb-2">Vill du ha hjälp med mer?</h3>
              {ADDONS.map((a) => {
                const on = req.addons.includes(a.value)
                return (
                  <button
                    key={a.value}
                    type="button"
                    onClick={() => toggleAddon(a.value)}
                    className="w-full flex items-center justify-between gap-3 py-[11px] border-t border-[#EEEEF0] text-left"
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
              </div>
              <p className="text-xs leading-[17px] text-[#767678] mt-2.5">
                Vardagar är ofta billigare än helger. Flexibel betyder att Nina föreslår ett datum inom en vecka från tillträdet.
              </p>
            </Card>
          </>
        )}

        {step === 2 && <WaitingStep req={req} movingDate={movingDate} onEdit={() => setStep(0)} />}
      </div>

      <div className="sticky bottom-0 bg-white border-t border-[#EEEEF0] px-4 py-4 flex flex-col gap-2.5">
        {step === 0 && (
          <>
            <Primary onClick={() => setStep(1)}>Fortsätt till bohaget</Primary>
            <Foot>Kostnadsfritt och inte bindande. Du bestämmer när förslaget kommer.</Foot>
          </>
        )}
        {step === 1 && (
          <>
            <Primary onClick={() => setStep(2)}>Skicka till Nina</Primary>
            <Foot>Nina sammanställer och skickar ett förslag. Inget är bokat förrän du godkänt det.</Foot>
          </>
        )}
        {step === 2 && (
          <>
            <Primary onClick={backToMovepage}>Till min offert</Primary>
            <Foot>Du får SMS när Nina skickat den. Offerten landar på din flyttsida.</Foot>
          </>
        )}
      </div>
    </div>
  )
}

/* ---------- byggstenar ---------- */

const StepBar = ({ step }: { step: number }) => (
  <div className="bg-white border-b border-[#EEEEF0] px-4 py-4 flex flex-col gap-2">
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[13px] font-bold text-[#214766]">
        Steg {step + 1} av 3 · {STEP_TITLES[step]}
      </span>
      <span className="text-xs text-[#767678] shrink-0">{['2 min', '1 min', 'Pågår'][step]}</span>
    </div>
    <div className="flex gap-1.5">
      {STEP_TITLES.map((_, i) => (
        <span key={i} className={clsx('flex-1 h-1 rounded-full', i < step ? 'bg-[#51C8B4]' : i === step ? 'bg-[#214766]' : 'bg-[#EEEEF0]')} />
      ))}
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
    <div className={clsx('px-4 pt-5 pb-6 flex flex-col gap-2.5', step === 2 ? 'bg-[#1F6156]' : 'bg-[#3879AD]')}>
      <h1 className="text-[32px] font-black tracking-[-0.02em] leading-9 text-white">Flytthjälp och städning</h1>
      <p className="text-[15px] leading-[21px] text-white max-w-[330px]">{copy}</p>
    </div>
  )
}

const ResidenceCard = ({ label, res, onChange }: { label: string; res: Residence; onChange: (p: Partial<Residence>) => void }) => (
  <Card>
    <div className="flex items-center justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#767678]">{label}</span>
        <span className="text-[15px] font-bold text-[#214766]">
          {res.street}, {res.city}
        </span>
      </div>
    </div>

    <div className="flex gap-2 mt-3">
      <Field label="Boarea">
        <input
          type="text"
          inputMode="numeric"
          className="w-full h-11 rounded-[5px] border-[1.9px] border-[#76767666] px-3 text-base text-[#000000B3] focus:outline-none focus:border-[#51C8B4]"
          value={`${res.size} m²`}
          onChange={(e) => onChange({ size: Number(e.target.value.replace(/\D/g, '')) || 0 })}
        />
      </Field>
      <Field label="Våning">
        <select
          className="w-full h-11 rounded-[5px] border-[1.9px] border-[#76767666] px-3 text-base text-[#000000B3] bg-white focus:outline-none focus:border-[#51C8B4]"
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
    </div>

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
              onClick={() => onChange({ distance: d.value })}
              className={clsx(
                'flex-1 flex flex-col items-center gap-px py-[7px] px-1 rounded-lg border',
                active ? 'bg-[#214766] border-[#214766]' : 'bg-white border-[#EEEEF0]',
              )}
            >
              <span className={clsx('text-[13px]', active ? 'text-white font-semibold' : 'text-[#214766]')}>{d.label}</span>
              <span className={clsx('text-xs leading-[14px]', active ? 'text-white/80' : 'text-[#767678]')}>{d.hint}</span>
            </button>
          )
        })}
      </div>
    </Field>

    <label
      className={clsx(
        'mt-3 flex flex-col gap-2.5 rounded-lg px-3.5 py-3 border cursor-pointer',
        res.hardAccess ? 'bg-[#F4FCFA] border-[#51C8B4]' : 'bg-[#F8FAF9] border-[#EEEEF0]',
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
        <textarea
          className="w-full min-h-[72px] rounded-[5px] border-[1.9px] border-[#76767666] px-3 py-2.5 text-base leading-[21px] text-[#000000B3] bg-white focus:outline-none focus:border-[#51C8B4]"
          placeholder="Gårdshus, bilen får inte in på gården. Ca 40 m från gatan."
          value={res.accessNote}
          onChange={(e) => onChange({ accessNote: e.target.value })}
        />
      )}
    </label>
  </Card>
)

const WaitingStep = ({ req, movingDate, onEdit }: { req: QuoteRequest; movingDate: Date; onEdit: () => void }) => {
  const now = new Date()
  const time = new Intl.DateTimeFormat('sv-SE', { hour: '2-digit', minute: '2-digit' }).format(now)
  const addonLabels = ADDONS.filter((a) => req.addons.includes(a.value)).map((a) => a.label.toLowerCase())
  return (
    <>
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
        <p className="mt-3 rounded-[12px_12px_12px_2px] bg-[#EAF2F8] px-3.5 py-3 text-[13px] leading-5 text-[#214766]">
          Hej! Jag har fått dina uppgifter och räknar på flytten från {req.from.street}. Du får ett förslag senast i morgon förmiddag. Har du frågor är det
          bara att skriva här.
        </p>
      </Card>

      <Card>
        <Timeline
          items={[
            { state: 'done', title: 'Uppgifter skickade', hint: `I dag ${time} · bekräftelse på mejl` },
            { state: 'current', title: 'Nina tar fram förslaget', hint: 'Senast i morgon förmiddag · du får SMS' },
            { state: 'todo', title: 'Du godkänner eller frågar', hint: 'Förslaget gäller i två veckor' },
          ]}
        />
      </Card>

      <button type="button" onClick={onEdit} className="w-full text-left rounded-[10px] bg-white border border-[#EEEEF0] px-3.5 py-3.5 flex items-center justify-between gap-3">
        <span className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-[#214766]">Dina svar</span>
          <span className="text-[13px] text-[#767678]">
            {req.from.street} → {req.to.street} · {req.dateMode === 'fixed' ? formatDate(movingDate) : 'flexibelt datum'}
            {addonLabels.length ? ` · ${addonLabels.join(', ')}` : ''}
          </span>
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
            <span className="w-[22px] h-[22px] rounded-full bg-[#51C8B4] flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24">
                <path d="M5 13l4 4L19 7" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          )}
          {it.state === 'current' && <span className="w-[22px] h-[22px] rounded-full border-[6px] border-[#214766] bg-white" />}
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

const Field = ({ label, className, children }: { label: string; className?: string; children: React.ReactNode }) => (
  <div className={clsx('flex-1 flex flex-col gap-1.5', className)}>
    <span className="text-xs text-[#767678]">{label}</span>
    {children}
  </div>
)

const Pill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'flex-1 h-10 rounded-full text-[13px] flex items-center justify-center',
      active ? 'bg-[#214766] text-white font-semibold' : 'bg-white border border-[#EEEEF0] text-[#214766]',
    )}
  >
    {children}
  </button>
)

const Radio = ({ active, onClick, title, hint }: { active: boolean; onClick: () => void; title: string; hint?: string }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left',
      active ? 'border-2 border-[#51C8B4] bg-[#F4FCFA]' : 'border-[1.9px] border-[#76767666] bg-white',
    )}
  >
    <span className={clsx('w-5 h-5 rounded-full shrink-0 bg-white', active ? 'border-[6px] border-[#51C8B4]' : 'border-[1.9px] border-[#9F9FA1]')} />
    <span className="flex flex-col gap-px">
      <span className={clsx('text-[15px] text-[#214766]', active && 'font-bold')}>{title}</span>
      {hint && <span className="text-[13px] text-[#767678]">{hint}</span>}
    </span>
  </button>
)

const Toggle = ({ on }: { on: boolean }) => (
  <span className={clsx('w-11 h-[26px] p-[3px] rounded-full shrink-0 flex items-center', on ? 'bg-[#51C8B4] justify-end' : 'bg-[#EEEEF0] justify-start')}>
    <span className="w-5 h-5 rounded-full bg-white" />
  </span>
)

const Checkbox = ({ checked }: { checked: boolean }) => (
  <span className={clsx('w-[22px] h-[22px] rounded shrink-0 mt-px flex items-center justify-center', checked ? 'bg-[#51C8B4]' : 'bg-white border-[3px] border-[#9F9FA1]')}>
    {checked && (
      <svg width="13" height="13" viewBox="0 0 24 24">
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

const Primary = ({ variant = 'solid', onClick, children }: { variant?: 'solid' | 'outline'; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    onClick={onClick}
    className={clsx(
      'w-full min-h-11 rounded-full px-6 py-3 text-[15px] font-bold border-2 border-[#214766] transition-colors',
      variant === 'solid' ? 'bg-[#214766] text-white' : 'bg-white text-[#214766]',
    )}
  >
    {children}
  </button>
)

const Foot = ({ children }: { children: React.ReactNode }) => <p className="text-center text-xs leading-4 text-[#767678]">{children}</p>

export default DemoMovehelpFlow
