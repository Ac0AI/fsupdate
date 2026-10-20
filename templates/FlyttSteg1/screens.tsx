'use client'

import { useState } from 'react'
import { ArrowDownToLine, ArrowUpToLine, Archive, Boxes, Car, MoreHorizontal, Package, Sun, Trash2, Truck, Warehouse, Wrench } from 'lucide-react'
import clsx from 'clsx'
import GoogleColor from '@/public/images/GoogleColor.svg'
import GoogleStar from '@/public/images/GoogleStar.svg'
import {
  avstandText,
  harAvstand,
  BIYTA_KVM,
  BIYTA_LABEL,
  BOHAG_LABEL,
  BOSTADSTYP_LABEL,
  FLOORS,
  FONSTER_LABEL,
  BIYTA_KVM_MAX,
  biytaKvmText,
  fulltText,
  HISS_LABEL,
  PASS,
  STAD_MER,
  TILLVAL_LABEL,
  TOTAL,
  VARDE,
  VIKT,
  answeredCount,
  answeredQuestions,
  newId,
  questionsLeft,
  samtalText,
  type AdressSvar,
  type Answers,
  type BiytaTyp,
  type Bohag,
  type Bostadstyp,
  type FonsterTyp,
  type Hiss,
  type JaNejVet,
  type Tillval,
} from './state'
import { AddCard, CheckCircle, CheckTile, Chip, ChipRow, ChoiceRow, Eyebrow, Field, FloorRow, Frame, GreenBadge, InfoCard, InfoNote, InfoRow as Row, ItemCard, MoreLink, PrimaryButton, STEG, Section, SheetHandle, StatusHead, Stepper, SubCard, TextField, TextInput, TextLink, Tile, DayPicker, MeterSlider, RangeSlider, Reveal, WeekPicker, WindowIcon } from './ui'
import { ChevronDown } from './LiveMovePage'
import { canCallNow, fmtLong, fmtLongDate, fromIso, hideMorning, isSlotPassed, nextSelectable } from './datum'

export type Home = { from: string; to: string; fromKvm: number; toKvm: number; moveDay: string; moveDayLong: string; moveDateFull: string; moveDateIso: string; cleanDayLong: string; firstName: string }

export type ScreenProps = {
  a: Answers
  update: (patch: Partial<Answers> | ((prev: Answers) => Partial<Answers>)) => void
  go: (step: number) => void
  /** Fortsätt från ett frågesteg: sparar, visar Sparat-bocken och går vidare. */
  next: (from: number) => void
  home: Home
  savedBadge?: string | null
}

/* Stegen i demoraden: 0 flyttsidan, 1–4 dagens ark, 5–10 frågorna, 11 allt sparat, 12 säljaren */
const FIRST = 5
const DONE = 11
const SALJARE = 12
const ORD = ['en', 'två', 'tre', 'fyra', 'fem', 'sex']
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
/* Fast mellanslag före sista ordet, så att husnumret inte hamnar ensamt på en rad. */
const nb = (s: string) => s.replace(/ (\S+)$/, ' $1')

export const nextUnanswered = (a: Answers) => {
  const i = questionsLeft(a).findIndex((x) => x > 0)
  return i === -1 ? FIRST : FIRST + i
}

/* Morgondagen som sajten skriver den: "torsdag 23/10". */
const nextDay = () => {
  const d = new Date()
  d.setDate(d.getDate() + (d.getDay() === 5 ? 3 : d.getDay() === 6 ? 2 : 1))
  const weekday = new Intl.DateTimeFormat('sv-SE', { weekday: 'long' }).format(d)
  return `${weekday} ${d.getDate()}/${d.getMonth() + 1}`
}

/* Arket på mobil. På desktop (inuti Flytthjälp-kortet) en centrerad kolumn, som live. */
const Sheet = ({ children }: { children: React.ReactNode }) => (
  <div className="flex h-full min-h-0 flex-col bg-white md:h-auto">
    <SheetHandle />
    <div className="min-h-0 flex-1 overflow-y-auto md:mx-auto md:w-full md:max-w-[560px] md:overflow-visible md:py-2">{children}</div>
  </div>
)

/* 1 · Arket i dag: Begär offert */
export const OffertScreen = ({ go }: ScreenProps) => (
  <Sheet>
    <div className="px-6 pb-8 pt-4 text-center">
      <h1 className="mx-auto max-w-[30ch] text-[18px] font-bold leading-[26px] text-[var(--color-text-main)]">Professionell flytthjälp – enkelt och prisvärt</h1>
      <div className="mx-auto mt-6 max-w-[320px]">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--color-inactive-main)] bg-white px-3 py-1.5 shadow-sm">
          <GoogleColor width={22} height={22} aria-hidden />
          <span className="text-[18px] font-bold tracking-tight text-[var(--color-inactive-super-dark)]">4,7</span>
          <span className="flex items-center gap-0.5" aria-label="5 av 5">
            {[0, 1, 2, 3, 4].map((i) => (
              <GoogleStar key={i} width={16} height={16} aria-hidden />
            ))}
          </span>
          <span className="text-[14px] text-[var(--color-inactive-dark)]">(1 900)</span>
        </span>
        <p className="mt-1 text-[14px] text-[var(--color-inactive-dark)]">Över 250 000 nöjda flyttare</p>
        <ul className="mt-4 flex flex-col gap-3 text-left">
          {['En flyttkoordinator går igenom din flytt', 'Du får offert med fast förmånligt pris, inga dolda avgifter', 'En kontaktperson, erfarna flyttproffs & nöjd-kundgaranti'].map((t, i) => (
            <li key={t} className="flex items-start gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-main)] text-[14px] font-bold text-white">{i + 1}</span>
              <span className="pt-1 text-[14px] leading-[19px] text-[var(--color-text-main)]">{t}</span>
            </li>
          ))}
        </ul>
        <PrimaryButton className="mt-8" rounded onClick={() => go(2)}>
          Begär offert
        </PrimaryButton>
        <p className="mt-2 text-[14px] font-bold text-[var(--color-inactive-grey-light)]">Kostnadsfritt och ej bindande</p>
      </div>
    </div>
  </Sheet>
)

const VadHanderNu = () => (
  <SubCard className="mt-6">
    <p className="text-[16px] font-bold text-[var(--color-text-main)]">Vad händer nu?</p>
    <ol className="mt-2 list-decimal space-y-1 pl-5 text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
      <li>Vi ringer dig på önskad tid för att gå igenom din flytt</li>
      <li>Redan under samtalet får du en skräddarsydd offert</li>
      <li>Du bestämmer själv om du vill boka – du binder dig inte till något</li>
    </ol>
  </SubCard>
)

/* 2 · Arket i dag: välj när vi ska ringa */
export const TidScreen = ({ a, update, go }: ScreenProps) => {
  const [date, setDate] = useState<Date>(() => nextSelectable())
  const pick = (pass: string) => {
    update({ samtal: { dag: fmtLong(date), pass } })
    go(3)
  }
  const nu = canCallNow(date)
  const slots = PASS.filter(([pass]) => !(hideMorning(date) && (pass === '08-10' || pass === '10-12')))
  return (
    <Sheet>
      <div className="px-4 pb-6">
        <StatusHead title="Offert begärd!" onClose={() => go(0)} />
        <VadHanderNu />
        <InfoCard className="mt-4 px-3 pb-4 pt-3">
          <p className="text-[14px] leading-[19px] text-[var(--color-text-main)]">Vi ringer dig {a.samtal ? samtalText(a.samtal) : 'snart'}.</p>
          <p className="mt-1 text-[12px] text-[var(--color-inactive-dark)]">Finns det någon tid du önskar bli uppringd?</p>
          {/* Som live: Ring mig nu under kontorstid i dag, annars Jag är flexibel. */}
          <button type="button" onClick={() => pick(nu ? 'nu' : 'flexibel')} className="mt-5 flex w-full items-center justify-between rounded-lg border border-[var(--color-inactive-main)] bg-white px-4 py-3 text-left">
            <span className="text-[16px] font-bold text-[var(--color-text-main)]">{nu ? 'Ring mig nu' : 'Jag är flexibel'}</span>
            <span className="text-[20px] text-[var(--color-inactive-grey-light)]">›</span>
          </button>
          <div className="mt-9">
            <WeekPicker value={date} onChange={setDate} />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {slots.map(([pass, sub]) => {
              const passed = isSlotPassed(pass, date)
              return (
                <button key={pass} type="button" disabled={passed} onClick={() => pick(pass)} className={clsx('rounded-lg border border-[var(--color-inactive-main)] bg-white px-2 py-3 text-center', passed && 'opacity-40')}>
                  <span className="block text-[16px] font-bold text-[var(--color-text-main)]">{pass}</span>
                  <span className="block text-[12px] text-[var(--color-inactive-super-dark)]">{sub}</span>
                </button>
              )
            })}
          </div>
        </InfoCard>
        <div className="mt-2 flex justify-center">
          <TextLink muted className="p-3 text-[18px]" onClick={() => go(0)}>
            Avbryt
          </TextLink>
        </div>
      </div>
    </Sheet>
  )
}

/* 3 · Arket i dag: bekräfta numret. Ja! bokar samtalet och skapar Opportunityn. */
export const NummerScreen = ({ a, update, go }: ScreenProps) => {
  const [edit, setEdit] = useState(false)
  const [tel, setTel] = useState(a.telefon)
  const samtal = a.samtal ?? { dag: nextDay(), pass: '13-15' }
  return (
    <Sheet>
      <div className="px-4 pb-6">
        <StatusHead title="Offert begärd!" onClose={() => go(0)} />
        <InfoCard className="mt-6 p-3">
          <p className="text-[14px] leading-[19px] text-[var(--color-text-main)]">Vi ringer dig {samtalText(samtal)}.</p>
        </InfoCard>
        <div className="mt-4 rounded-xl bg-[var(--color-secondary-extra-extra-light)] px-4 pb-4 pt-6 text-center">
          <h2 className="text-[16px] font-bold text-[var(--color-text-main)]">{edit ? 'Ange ditt telefonnummer' : 'Bekräfta ditt nummer'}</h2>
          <div className="mt-4">
            {edit ? (
              <div className="mx-auto max-w-[220px]">
                <TextInput type="tel" value={tel} onChange={setTel} placeholder="070-123 45 67" label="Telefonnummer" />
              </div>
            ) : (
              <p className="text-[20px] font-bold text-[var(--color-text-main)]">{a.telefon}</p>
            )}
          </div>
          <div className="mt-5 flex flex-col gap-3">
            {edit ? (
              <>
                <PrimaryButton
                  rounded
                  disabled={!tel.trim()}
                  onClick={() => {
                    update({ telefon: tel })
                    setEdit(false)
                  }}
                >
                  Spara
                </PrimaryButton>
                <PrimaryButton rounded tone="outline" onClick={() => setEdit(false)}>
                  Avbryt
                </PrimaryButton>
              </>
            ) : (
              <>
                <PrimaryButton
                  rounded
                  onClick={() => {
                    update({ samtal })
                    go(4)
                  }}
                >
                  Ja!
                </PrimaryButton>
                <PrimaryButton rounded tone="outline" onClick={() => setEdit(true)}>
                  Ändra nummer
                </PrimaryButton>
              </>
            )}
          </div>
        </div>
        <div className="mt-2 flex justify-center">
          <TextLink muted className="p-3 text-[18px]" onClick={() => go(0)}>
            Avbryt
          </TextLink>
        </div>
      </div>
    </Sheet>
  )
}

/* 4 · Nytt: bekräftelsen stannar kvar och bjuder in till frågorna */
export const BokatScreen = ({ a, go }: ScreenProps) => (
  <Sheet>
    <div className="px-4 pb-6">
      <StatusHead title="Samtal bokat!" onClose={() => go(0)} />
      <InfoCard className="mt-6 flex items-center gap-3 p-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-extra-extra-light)]">
          <svg width="20" height="26" viewBox="158 0 26 33" fill="none" aria-hidden>
            <path fillRule="evenodd" clipRule="evenodd" d="M183 25.1625C183 25.1625 168.602 23.5171 165.065 19.8486C161.528 16.1801 161.528 10.2324 165.065 6.5639C168.602 2.89537 174.338 2.89537 177.876 6.5639C181.413 10.2324 183 25.1625 183 25.1625ZM171.289 17.2059C169.087 17.2059 167.303 15.3553 167.303 13.0726C167.303 10.79 169.087 8.9394 171.289 8.9394C173.49 8.9394 175.274 10.79 175.274 13.0726C175.274 15.3553 173.49 17.2059 171.289 17.2059Z" fill="#51C8B4" />
            <path fillRule="evenodd" clipRule="evenodd" d="M162.746 10.6764C162.752 10.7063 162.757 10.736 162.762 10.7658C163.166 9.30573 163.939 7.92722 165.081 6.77921C168.616 3.22626 174.347 3.22626 177.881 6.77921C178.85 7.75294 179.672 9.54572 180.355 11.6356C180.588 10.8302 180.712 9.97867 180.712 9.09793C180.712 4.07332 176.66 0 171.661 0C167.531 0 164.046 2.78126 162.961 6.58231L159.362 8.69235L162.746 10.6764ZM175.64 26.5466C172.232 25.8443 168.539 24.883 165.832 23.6441C168.433 27.976 171.661 32.025 171.661 32.025C171.661 32.025 173.573 29.6265 175.64 26.5466Z" fill="#214766" />
          </svg>
        </span>
        <p className="text-[14px] font-bold leading-[19px] text-[var(--color-text-main)]">Vi ringer dig {samtalText(a.samtal)}</p>
      </InfoCard>
      <div className="mt-4 rounded-xl border border-[var(--color-inactive-main)] bg-[var(--color-secondary-extra-extra-light)] px-4 pb-4 pt-6 text-center">
        <h2 className="text-[18px] font-bold leading-6 text-[var(--color-text-main)]">Berätta mer om din flytt</h2>
        <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">Då vet vi hur det ser ut hos dig och ringer med priset klart. Det tar ett par minuter, allt sparas direkt och du kan sluta när du vill.</p>
        <PrimaryButton className="mt-5" rounded onClick={() => go(nextUnanswered(a))}>
          Berätta om flytten
        </PrimaryButton>
        <div className="mt-4">
          <TextLink muted onClick={() => go(0)}>
            Senare, vi frågar i samtalet
          </TextLink>
        </div>
      </div>
    </div>
  </Sheet>
)

/* Ramen runt stegen. Krysset sparar det som är svarat och stänger arket. */
const Q = ({ p, idx, title, sub, children, cta, foot, onNext }: { p: ScreenProps; idx: number; title: string; sub?: string; children: React.ReactNode; cta?: string; foot?: string; onNext?: () => void }) => {
  const { a, go, next, savedBadge } = p
  const lefts = questionsLeft(a)
  const answered = answeredQuestions(a)
  const step = idx - FIRST
  const done = STEG.map((_, i) => i < step || (lefts[i] === 0 && answered[i]))
  return (
    <Frame step={step} title={title} sub={sub} cta={cta} foot={foot} left={lefts[step]} savedBadge={savedBadge} done={done} onStep={(i) => go(FIRST + i)} onNext={onNext ?? (() => next(idx))} onClose={() => go(0)}>
      {children}
    </Frame>
  )
}

const JA_NEJ: ['ja' | 'nej', string][] = [
  ['ja', 'Ja'],
  ['nej', 'Nej'],
]
const JA_NEJ_VET: [JaNejVet, string][] = [
  ['ja', 'Ja'],
  ['nej', 'Nej'],
  ['vet-ej', 'Vet inte'],
]
/* Små ikoner på steg 4 (David 20 okt i Paper: "Lägg in små ikoner"). */
const BOHAG_IKON: Record<Bohag, React.ReactNode> = { lite: <Package size={22} />, normalt: <Boxes size={22} />, mycket: <Truck size={22} /> }
const BIYTA_IKON: Record<BiytaTyp, React.ReactNode> = {
  kallare: <ArrowDownToLine size={14} />,
  vind: <ArrowUpToLine size={14} />,
  forrad: <Archive size={14} />,
  garage: <Car size={14} />,
  uterum: <Sun size={14} />,
  annat: <MoreHorizontal size={14} />,
}

/* 5 · Adresser */
export const AdresserScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const setStopp = (i: number, v: string) => update((prev) => ({ stopp: prev.stopp.map((s, j) => (j === i ? v : s)) }))
  return (
    <Q p={p} idx={FIRST} title="Stämmer adresserna?" sub="Hämtade från din flytt. Ändra om något inte stämmer.">
      <InfoCard className="mt-5">
        <Row label="Från" value={`${home.from}, Uppsala`} action="Ändra" first />
        {a.stopp.map((s, i) => (
          <div key={i} className="border-t border-[var(--color-inactive-main)] px-3.5 py-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] leading-4 text-[var(--color-inactive-dark)]">Stopp {i + 1}</span>
              <TextLink muted className="text-[13px]" onClick={() => update((prev) => ({ stopp: prev.stopp.filter((_, j) => j !== i) }))}>
                Ta bort
              </TextLink>
            </div>
            <div className="mt-1">
              <TextInput value={s} onChange={(v) => setStopp(i, v)} placeholder="Adress, t.ex. ett förråd eller magasin" label={`Stopp ${i + 1}`} />
            </div>
          </div>
        ))}
        <Row label="Till" value={`${home.to}, Uppsala`} action="Ändra" />
      </InfoCard>
      <div className="mt-3">
        <MoreLink onClick={() => update((prev) => ({ stopp: [...prev.stopp, ''] }))}>{a.stopp.length ? 'Lägg till ett stopp till' : 'Lägg till ett stopp på vägen'}</MoreLink>
      </div>
      <Section title="Flyttar du ut och in samma dag?" sub="Om inte ordnar vi tillfällig förvaring däremellan.">
        <ChipRow>
          {JA_NEJ_VET.map(([v, label]) => (
            <Chip key={v} selected={a.sammaDag === v} onClick={() => update({ sammaDag: v })}>
              {label}
            </Chip>
          ))}
        </ChipRow>
        {a.sammaDag === 'nej' && <InfoNote>Vi förvarar sakerna tills du kan flytta in. Säljaren räknar in förvaringen i priset.</InfoNote>}
      </Section>
    </Q>
  )
}

/* 6 och 7 · Bära ut, bära in. Våning och hiss frågas bara för lägenhet. */

const BaraScreen = ({ side, ...p }: ScreenProps & { side: 'fran' | 'till' }) => {
  const { a, update, home } = p
  const s = a[side]
  const set = (patch: Partial<AdressSvar>) => update((prev) => ({ [side]: { ...prev[side], ...patch } }))
  const [more, setMore] = useState(!!s.vaning && !FLOORS.includes(s.vaning) && s.vaning !== 'vet-ej')
  const [edit, setEdit] = useState(false)
  const ut = side === 'fran'
  const lagenhet = s.bostadstyp === 'lagenhet'
  const kvm = s.kvm ?? String(ut ? home.fromKvm : home.toKvm)
  // Byte av bostadstyp nollar det som bara gäller lägenhet. Samma typ igen rör inget.
  const valjTyp = (t: Bostadstyp) => set(t === s.bostadstyp ? {} : { bostadstyp: t, vaning: undefined, vaningFranFlytten: false, hiss: undefined })
  // Reveal: en fråga i taget inom steget. Nästa visas när den förra är svarad, det förifyllda räknas som svarat.
  const vaningKlar = !lagenhet || !!s.vaning
  const hissKlar = !lagenhet || !!s.hiss
  // Det som redan är svarat stannar kvar även om en tidigare fråga ändras.
  const visaHiss = lagenhet && (vaningKlar || !!s.hiss)
  const visaAvstand = (vaningKlar && hissKlar) || harAvstand(s.avstand)
  const visaFramkomlighet = (visaAvstand && harAvstand(s.avstand)) || !!s.framkomlighet
  return (
    <Q p={p} idx={ut ? FIRST + 1 : FIRST + 2} title={ut ? `Utflytt från ${nb(home.from)}` : `Inflytt till ${nb(home.to)}`} sub={ut ? 'Vi har fyllt i det vi redan vet om din flytt. Ändra om något inte stämmer.' : 'Bostadstypen är hämtad från din flytt. Samma frågor för den nya bostaden.'}>
      {edit ? (
        <InfoCard className="mt-5 p-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[12px] leading-4 text-[var(--color-inactive-dark)]">Bostadstyp</span>
            <TextLink className="text-[13px]" onClick={() => setEdit(false)}>
              Klar
            </TextLink>
          </div>
          <div className="mt-2">
            <ChipRow>
              {(Object.keys(BOSTADSTYP_LABEL) as Bostadstyp[]).map((t) => (
                <Chip key={t} selected={s.bostadstyp === t} onClick={() => valjTyp(t)}>
                  {BOSTADSTYP_LABEL[t]}
                </Chip>
              ))}
            </ChipRow>
          </div>
          <div className="mt-3">
            <span className="text-[12px] leading-4 text-[var(--color-inactive-dark)]">Boarea i m²</span>
            <div className="mt-1 w-40">
              <TextInput type="number" value={kvm} onChange={(v) => set({ kvm: v })} placeholder="62" label="Boarea i m²" />
            </div>
          </div>
        </InfoCard>
      ) : (
        <InfoCard className="mt-5">
          <Row label="Bostadstyp" value={`${BOSTADSTYP_LABEL[s.bostadstyp]} · ${kvm || '?'} m²`} action="Ändra" onAction={() => setEdit(true)} first />
        </InfoCard>
      )}
      {lagenhet && (
        <>
          <Section title="Vilket våningsplan ligger lägenheten på?" badge={s.vaningFranFlytten && s.vaning ? <GreenBadge>Från din flytt</GreenBadge> : undefined}>
            {more ? (
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <TextInput type="number" value={s.vaning && !FLOORS.includes(s.vaning) && s.vaning !== 'vet-ej' ? s.vaning : ''} onChange={(v) => set({ vaning: v, vaningFranFlytten: false })} placeholder="T.ex. 9 eller -1" label="Våning" />
                </div>
                <TextLink
                  className="text-[13px]"
                  onClick={() => {
                    setMore(false)
                    set({ vaning: undefined })
                  }}
                >
                  Tillbaka till raden
                </TextLink>
              </div>
            ) : (
              <FloorRow value={s.vaning} onChange={(v) => set({ vaning: v, vaningFranFlytten: false })} more={more} onMore={() => setMore(true)} />
            )}
          </Section>
          <Reveal show={visaHiss}>
            <Section title="Finns det hiss?" sub="Stor hiss rymmer sex personer eller fler.">
              <ChipRow>
                {(Object.keys(HISS_LABEL) as Hiss[]).map((h) => (
                  <Chip key={h} selected={s.hiss === h} onClick={() => set({ hiss: h })}>
                    {HISS_LABEL[h]}
                  </Chip>
                ))}
              </ChipRow>
            </Section>
          </Reveal>
        </>
      )}
      <Reveal show={visaAvstand}>
        <Section title={ut ? 'Hur långt bär vi till flyttbilen?' : 'Hur långt bär vi från flyttbilen?'} sub={ut ? 'Från dörren till närmaste plats bilen kan stå. Ungefärligt räcker.' : 'Från närmaste plats bilen kan stå till dörren. Ungefärligt räcker.'}>
          <MeterSlider value={s.avstand} onChange={(v) => set({ avstand: v })} />
        </Section>
      </Reveal>
      <Reveal show={visaFramkomlighet}>
        <Section title="Hur är framkomligheten?" sub={lagenhet ? 'Innergård, smal trapp, bom eller trång gata. Hoppa över om det är fritt fram.' : 'Grusväg, smal infart, trappor i trädgården. Hoppa över om det är fritt fram.'}>
          <TextInput value={s.framkomlighet} onChange={(v) => set({ framkomlighet: v })} placeholder={lagenhet ? 'T.ex. innergård, smal trapp' : 'T.ex. grusväg eller smal infart'} label="Framkomlighet" />
        </Section>
      </Reveal>
    </Q>
  )
}

export const BaraUtScreen = (p: ScreenProps) => <BaraScreen side="fran" {...p} />
export const BaraInScreen = (p: ScreenProps) => <BaraScreen side="till" {...p} />

/* 8 · Vad ska med */
export const BohagScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const setBiyta = (id: string, patch: Partial<Answers['biytor'][number]>) => update((prev) => ({ biytor: prev.biytor.map((b) => (b.id === id ? { ...b, ...patch } : b)) }))
  const setSak = (id: string, patch: Partial<Answers['saker'][number]>) => update((prev) => ({ saker: prev.saker.map((s) => (s.id === id ? { ...s, ...patch } : s)) }))
  // Ett kort är öppet tills kunden trycker Klar, sedan en rad med Ändra. Klar finns först när allt är ifyllt.
  const [klara, setKlara] = useState<Set<string>>(() => new Set())
  const markera = (id: string, klar: boolean) =>
    setKlara((prev) => {
      const n = new Set(prev)
      if (klar) n.add(id)
      else n.delete(id)
      return n
    })
  const biytaKlar = (b: Answers['biytor'][number]) => !!b.typ && typeof b.kvm === 'number' && typeof b.fullt === 'number'
  const sakKlar = (s: Answers['saker'][number]) => !!s.vad.trim() && !!s.vikt && !!s.varde
  const nyBiyta = () => update((prev) => ({ biytor: [...prev.biytor, { id: newId() }] }))
  const nySak = () => update((prev) => ({ saker: [...prev.saker, { id: newId(), vad: '' }] }))
  return (
    <Q p={p} idx={FIRST + 3} title="Hur mycket ska med?" sub={`Jämfört med ett vanligt hem på ${home.fromKvm} m².`}>
      <div className="mt-5 grid grid-cols-3 gap-2">
        {(
          [
            ['lite', 'Lite', 'Få möbler och lådor'],
            ['normalt', 'Normalt', 'Som ett vanligt hem'],
            ['mycket', 'Mycket', 'Fullt i alla rum'],
          ] as [Bohag, string, string][]
        ).map(([v, label, hint]) => (
          <Tile key={v} label={label} hint={hint} selected={a.bohag === v} onClick={() => update({ bohag: v })} icon={BOHAG_IKON[v]} />
        ))}
      </div>
      <Section title="Har du saker i förråd eller annat utrymme utöver boarean?">
        <ChoiceRow
          options={JA_NEJ}
          value={a.biytaSvar}
          onChange={(v) => {
            if (v === 'ja' && a.biytor.length === 0) nyBiyta()
            else update({ biytaSvar: v, biytor: v === 'ja' ? a.biytor : [] })
            if (v === 'ja') update({ biytaSvar: v })
          }}
        />
        {a.biytaSvar === 'ja' && (
          <div className="mt-3 flex flex-col gap-3">
            {a.biytor.map((b, i) => (
              <ItemCard
                key={b.id}
                title={b.typ ? BIYTA_LABEL[b.typ] : `Utrymme ${i + 1}`}
                onRemove={() => update((prev) => ({ biytor: prev.biytor.filter((x) => x.id !== b.id) }))}
                collapsed={klara.has(b.id) && biytaKlar(b)}
                summary={[typeof b.kvm === 'number' ? biytaKvmText(b.kvm) : null, typeof b.fullt === 'number' ? fulltText(b.fullt).toLowerCase() : null].filter(Boolean).join(' · ')}
                onDone={biytaKlar(b) ? () => markera(b.id, true) : undefined}
                onEdit={() => markera(b.id, false)}
              >
                <Field label="Vilket utrymme?">
                  <ChipRow>
                    {(Object.keys(BIYTA_LABEL) as BiytaTyp[]).map((t) => (
                      <Chip key={t} small selected={b.typ === t} onClick={() => setBiyta(b.id, { typ: t })} icon={BIYTA_IKON[t]}>
                        {BIYTA_LABEL[t]}
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
                <Field label="Ungefär hur stort?">
                  <RangeSlider value={b.kvm} min={5} max={BIYTA_KVM_MAX} step={5} onChange={(v) => setBiyta(b.id, { kvm: v })} text={biytaKvmText} ticks={['5 m²', '25 m²', '50 m² eller mer']} label="Storlek i kvadratmeter" />
                </Field>
                <Field label="Hur fullt är det?">
                  <RangeSlider value={b.fullt} min={25} max={100} step={25} onChange={(v) => setBiyta(b.id, { fullt: v })} text={fulltText} ticks={['En fjärdedel', 'Halvfullt', 'Trekvart', 'Fullt']} label="Hur fullt utrymmet är" />
                </Field>
              </ItemCard>
            ))}
            <AddCard label="Lägg till ett utrymme till" hint="Vind, källare, garage eller förråd" onClick={nyBiyta} />
          </div>
        )}
      </Section>
      <Section title="Har du föremål som kräver tunga lyft eller är extra ömtåliga?">
        <ChoiceRow
          options={JA_NEJ}
          value={a.sakerSvar}
          onChange={(v) => {
            if (v === 'ja' && a.saker.length === 0) nySak()
            else update({ sakerSvar: v, saker: v === 'ja' ? a.saker : [] })
            if (v === 'ja') update({ sakerSvar: v })
          }}
        />
        {a.sakerSvar === 'ja' && (
          <div className="mt-3 flex flex-col gap-3">
            {a.saker.map((s, i) => (
              <ItemCard
                key={s.id}
                title={s.vad || `Föremål ${i + 1}`}
                onRemove={() => update((prev) => ({ saker: prev.saker.filter((x) => x.id !== s.id) }))}
                collapsed={klara.has(s.id) && sakKlar(s)}
                summary={[s.vikt, s.varde].filter(Boolean).join(' · ')}
                onDone={sakKlar(s) ? () => markera(s.id, true) : undefined}
                onEdit={() => markera(s.id, false)}
              >
                <Field label="Vad är det?">
                  <TextInput value={s.vad} onChange={(v) => setSak(s.id, { vad: v })} placeholder="T.ex. piano eller marmorbord" label="Vad är det?" />
                </Field>
                <Field label="Ungefärlig vikt">
                  <ChipRow>
                    {VIKT.map((v) => (
                      <Chip key={v} small selected={s.vikt === v} onClick={() => setSak(s.id, { vikt: v })}>
                        {v}
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
                <Field label="Ungefärligt värde" sub="Värdefulla föremål kan behöva extra försäkring under flytten.">
                  <ChipRow>
                    {VARDE.map((v) => (
                      <Chip key={v} small selected={s.varde === v} onClick={() => setSak(s.id, { varde: v })}>
                        {v}
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
              </ItemCard>
            ))}
            <AddCard label="Lägg till ett föremål till" hint="Så tar flyttfirman med rätt utrustning" onClick={nySak} />
          </div>
        )}
      </Section>
      <Section title="Har du utemöbler som ska med?" sub="Från balkong, altan eller trädgård.">
        <ChoiceRow options={JA_NEJ} value={a.utemobler} onChange={(v) => update({ utemobler: v })} />
      </Section>
    </Q>
  )
}

/* 9 · Städning */
const FONSTER_FRAGA: Record<FonsterTyp, string> = {
  fyrsidiga: 'fyrsidiga',
  sprojsade: 'spröjsade',
  panorama: 'panoramafönster',
  svaratkomliga: 'svåråtkomliga',
}

export const StadScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const valda = Object.keys(a.fonster) as FonsterTyp[]
  const toggleFonster = (t: FonsterTyp) =>
    update((prev) => {
      const fonster = { ...prev.fonster }
      if (fonster[t]) delete fonster[t]
      else fonster[t] = 1
      return { fonster, fonsterInga: false }
    })
  const toggleStadMer = (m: string) => update((prev) => ({ stadMer: prev.stadMer.includes(m) ? prev.stadMer.filter((x) => x !== m) : [...prev.stadMer, m] }))
  return (
    <Q p={p} idx={FIRST + 4} title="Flyttstädning">
      <Section title="Vill du ha pris på flyttstädning också?" sub="Nöjd-kund-garanti: anmärkningar vid besiktningen åtgärdas kostnadsfritt." className="mt-4">
        <ChoiceRow options={JA_NEJ} value={a.stad} onChange={(v) => update({ stad: v })} />
        {a.stad === 'nej' && <InfoNote>Då räknar vi bara på flytthjälpen. Städ går att lägga till när som helst före flytten.</InfoNote>}
      </Section>
      {a.stad === 'ja' && (
        <>
          <Section title="Vad ska städas?">
            <div className="grid grid-cols-2 gap-2">
              <Tile label="Boarean" hint={`${home.fromKvm} m²`} selected={a.stadYta === 'boyta'} onClick={() => update({ stadYta: 'boyta', stadMer: [], stadMerKvm: undefined })} />
              <Tile label="Mer än boarean" hint="Källare, förråd, garage" selected={a.stadYta === 'mer'} onClick={() => update({ stadYta: 'mer' })} />
            </div>
            {a.stadYta === 'mer' && (
              <SubCard className="mt-3">
                <Field label="Vad mer ska städas?">
                  <ChipRow>
                    {STAD_MER.map((m) => (
                      <Chip key={m} small selected={a.stadMer.includes(m)} onClick={() => toggleStadMer(m)}>
                        {m}
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
                <Field label="Ungefär hur många m² extra?">
                  <ChipRow>
                    {BIYTA_KVM.map((k) => (
                      <Chip key={k} small selected={a.stadMerKvm === k} onClick={() => update({ stadMerKvm: k })}>
                        {k} m²
                      </Chip>
                    ))}
                  </ChipRow>
                </Field>
              </SubCard>
            )}
          </Section>
          <Section title="Har du inglasad balkong?">
            <ChoiceRow options={JA_NEJ} value={a.balkong} onChange={(v) => update({ balkong: v })} />
            {a.balkong === 'ja' && (
              <SubCard className="mt-3">
                <Field label="Hur stor är den?" sub="Liten under 6 m², mellan 6–8 m², stor över 8 m².">
                  <ChoiceRow
                    options={[
                      ['liten', 'Liten'],
                      ['mellan', 'Mellan'],
                      ['stor', 'Stor'],
                    ]}
                    value={a.balkongStorlek}
                    onChange={(v) => update({ balkongStorlek: v })}
                  />
                </Field>
                <Field label="Inglasning">
                  <ChoiceRow
                    options={[
                      ['halv', 'Halv'],
                      ['hel', 'Hel'],
                    ]}
                    value={a.balkongGlas}
                    onChange={(v) => update({ balkongGlas: v })}
                  />
                </Field>
              </SubCard>
            )}
          </Section>
          <Section title="Har du fönster som tar extra tid att putsa?" sub="Välj de typer som finns, sedan hur många.">
            <div className="flex flex-col gap-2">
              {(Object.keys(FONSTER_LABEL) as FonsterTyp[]).map((t) => (
                <CheckTile key={t} label={FONSTER_LABEL[t][0]} hint={FONSTER_LABEL[t][1]} selected={!!a.fonster[t]} onClick={() => toggleFonster(t)} icon={<WindowIcon type={t} />} />
              ))}
              <button
                type="button"
                aria-pressed={a.fonsterInga}
                onClick={() => update({ fonsterInga: !a.fonsterInga, fonster: {} })}
                className={clsx('flex h-11 w-full items-center justify-center rounded-[var(--radius-button)] border-[1.5px] text-[15px] transition-colors', a.fonsterInga ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] font-bold text-white' : 'border-[var(--color-inactive-main)] bg-white text-[var(--color-text-main)]')}
              >
                Inga sådana fönster
              </button>
            </div>
            {valda.length > 0 && (
              <SubCard className="mt-3">
                {valda.map((t) => (
                  <div key={t} className="flex items-center justify-between gap-3 py-1.5">
                    <span className="text-[14px] font-bold text-[var(--color-text-main)]">Antal {FONSTER_FRAGA[t]}</span>
                    <Stepper value={a.fonster[t] ?? 1} onChange={(n) => update((prev) => ({ fonster: { ...prev.fonster, [t]: n } }))} />
                  </div>
                ))}
              </SubCard>
            )}
          </Section>
          <Section title="Finns det känsliga ytor?" sub="Natursten, oljade golv eller högglansluckor.">
            <ChoiceRow options={JA_NEJ} value={a.kansliga} onChange={(v) => update({ kansliga: v })} />
            {a.kansliga === 'ja' && (
              <div className="mt-3">
                <TextField value={a.kansligaText} onChange={(v) => update({ kansligaText: v })} placeholder="Vilka ytor och var? T.ex. marmorgolv i badrummet" label="Känsliga ytor" />
              </div>
            )}
          </Section>
        </>
      )}
    </Q>
  )
}

/* 10 · Sista detaljerna. Starttiden hör till bokningen och frågas inte här. */
const TILLVAL_IKON: Record<Tillval, React.ReactNode> = {
  packhjalp: <Package size={24} />,
  lador: <Boxes size={24} />,
  bortforsling: <Trash2 size={24} />,
  montering: <Wrench size={24} />,
  forvaring: <Warehouse size={24} />,
}

export const SistaScreen = (p: ScreenProps) => {
  const { a, update, go, home } = p
  const toggleTillval = (t: Tillval) => update((prev) => ({ tillval: prev.tillval.includes(t) ? prev.tillval.filter((x) => x !== t) : [...prev.tillval, t] }))
  return (
    <Q
      p={p}
      idx={FIRST + 5}
      title="Sista detaljerna"
      cta="Klar"
      foot="Allt sparas direkt. Tillvalen är frivilliga."
      onNext={() => {
        update({ sent: true })
        go(DONE)
      }}
    >
      <InfoCard className="mt-5">
        <div className="px-3.5 py-3">
          <span className="block text-[12px] leading-4 text-[var(--color-inactive-dark)]">Flyttdag</span>
          <span className="block text-[15px] font-bold leading-5 text-[var(--color-text-main)]">{cap(home.moveDayLong)}</span>
          <span className="block text-[12px] leading-4 text-[var(--color-inactive-dark)]">Datumet från din flytt. Vill du byta dag säger du det i samtalet.</span>
        </div>
      </InfoCard>
      {a.stad === 'ja' && (
        <Section title="Vilken dag vill du ha flyttstädningen?" sub="Oftast dagen efter flytten, när bostaden är tömd.">
          <DayPicker value={a.stadDag} start={home.moveDateIso} min={home.moveDateIso} label="Städdag" placeholder="Välj dag" onChange={(iso) => update({ stadDag: iso })} />
        </Section>
      )}
      <Section title="Vill du ha något av det här?">
        <div className="flex flex-col gap-2">
          {(Object.keys(TILLVAL_LABEL) as Tillval[]).map((t) => (
            <CheckTile key={t} label={TILLVAL_LABEL[t][0]} hint={TILLVAL_LABEL[t][1]} selected={a.tillval.includes(t)} onClick={() => toggleTillval(t)} icon={TILLVAL_IKON[t]} />
          ))}
        </div>
      </Section>
      <Section title="Bra att veta inför flytten">
        <TextField value={a.ovrigt} onChange={(v) => update({ ovrigt: v })} placeholder="Önskemål om flytten, t.ex. ömtåliga saker eller speciella omständigheter" label="Bra att veta" />
      </Section>
    </Q>
  )
}

const vaningText = (v?: string) => (v === 'vet-ej' ? 'våning: vet inte' : v === 'BV' ? 'bottenvåning' : v ? `våning ${v}` : null)

const adressLine = (label: string, s: AdressSvar) => {
  const lagenhet = s.bostadstyp === 'lagenhet'
  const parts = [BOSTADSTYP_LABEL[s.bostadstyp].toLowerCase(), lagenhet ? vaningText(s.vaning) : null, lagenhet && s.hiss ? HISS_LABEL[s.hiss].toLowerCase().replace('vet inte', 'hiss: vet inte') : null, harAvstand(s.avstand) ? (s.avstand === 'vet-ej' ? 'bärsträcka: vet inte' : `${avstandText(s.avstand)} att bära`) : null, s.framkomlighet || null].filter(Boolean)
  return `${label}: ${parts.join(', ')}`
}

export const answerLines = (a: Answers, home: Home): string[] => {
  const L: (string | null)[] = []
  a.stopp.filter(Boolean).forEach((s, i) => L.push(`Stopp ${i + 1}: ${s}`))
  if (a.sammaDag) L.push(a.sammaDag === 'ja' ? 'Flyttar in samma dag' : a.sammaDag === 'nej' ? 'Flyttar inte in samma dag, behöver förvaring' : 'Samma dag: vet inte')
  L.push(adressLine(home.from, a.fran), adressLine(home.to, a.till))
  if (a.bohag) L.push(`${BOHAG_LABEL[a.bohag]}, ${home.fromKvm} m²`)
  if (a.biytaSvar === 'nej') L.push('Inga utrymmen utöver boarean')
  a.biytor.forEach((b) => L.push(`${b.typ ? BIYTA_LABEL[b.typ] : 'Utrymme'}${typeof b.kvm === 'number' ? ` ${biytaKvmText(b.kvm)}` : ''}${typeof b.fullt === 'number' ? `, ${fulltText(b.fullt).toLowerCase()}` : ''}`))
  if (a.sakerSvar === 'nej') L.push('Inga tunga eller ömtåliga föremål')
  a.saker.forEach((s) => L.push(`${s.vad || 'Föremål'}${s.vikt ? `, ${s.vikt}` : ''}${s.varde ? `, värde ${s.varde}` : ''}`))
  if (a.utemobler) L.push(a.utemobler === 'ja' ? 'Utemöbler ska med' : 'Inga utemöbler')
  if (a.stad === 'nej') L.push('Ingen flyttstädning')
  if (a.stad === 'ja') {
    const mer = a.stadYta === 'mer' ? ` + ${a.stadMer.map((m) => m.toLowerCase()).join(', ') || 'mer'}${a.stadMerKvm ? ` ${a.stadMerKvm} m²` : ''}` : ''
    L.push(`Flyttstäd${a.stadDag ? ` ${fmtLongDate(fromIso(a.stadDag))}` : ''}: boarean ${home.fromKvm} m²${mer}`)
    if (a.balkong === 'ja') L.push(`Inglasad balkong${a.balkongStorlek ? `, ${a.balkongStorlek}` : ''}${a.balkongGlas ? `, ${a.balkongGlas === 'hel' ? 'helinglasad' : 'halvinglasad'}` : ''}`)
    const f = (Object.keys(a.fonster) as FonsterTyp[]).map((t) => `${FONSTER_LABEL[t][0].toLowerCase()} ×${a.fonster[t]}`)
    if (f.length) L.push(`Fönster: ${f.join(', ')}`)
    else if (a.fonsterInga) L.push('Inga specialfönster')
    if (a.kansliga === 'ja') L.push(`Känsliga ytor: ${a.kansligaText || 'ja'}`)
  }
  if (a.tillval.length) L.push(`Vill ha pris på ${a.tillval.map((t) => TILLVAL_LABEL[t][0].toLowerCase()).join(', ')}`)
  if (a.ovrigt) L.push(a.ovrigt)
  return L.filter((x): x is string => !!x)
}

/* 11 · Allt sparat */
export const SparatScreen = ({ a, go, home }: ScreenProps) => {
  const lines = answerLines(a, home)
  return (
    <Sheet>
      <div className="px-4 pb-6 pt-4 text-center">
        <div className="flex justify-center">
          <CheckCircle size={56} />
        </div>
        <h1 className="mt-4 text-[20px] font-bold leading-[26px] text-[var(--color-text-main)]">Tack, allt är sparat</h1>
        <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">Vi ringer dig {samtalText(a.samtal)} och har priset klart. Vill du ändra något gör du det på flyttsidan fram till samtalet.</p>
        <PrimaryButton className="mt-6" onClick={() => go(0)}>
          Tillbaka till flyttsidan
        </PrimaryButton>
        <div className="mt-4">
          <TextLink onClick={() => go(FIRST)}>Ändra mina svar</TextLink>
        </div>
        <div className="mt-6 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4 text-left">
          <Eyebrow>Dina svar</Eyebrow>
          <ul className="mt-2 space-y-1 text-[14px] leading-[21px] text-[var(--color-inactive-dark)]">
            {lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </div>
    </Sheet>
  )
}

/* 12 · Säljaren ringer med svaren framför sig */
export const SaljareScreen = ({ a, home }: ScreenProps) => {
  const n = answeredCount(a)
  const left = questionsLeft(a).reduce((x, y) => x + y, 0)
  const lines = answerLines(a, home)
  return (
    <div className="bg-[var(--color-inactive-quite-light)] px-4 py-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">{home.firstName} Andersson</p>
            <p className="text-[13px] text-[var(--color-inactive-dark)]">Demomäklaren · flytt {home.moveDay}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-accent-lighter)] px-3 py-1 text-[12px] font-bold text-[var(--color-accent-dark-main)]">
            {n} av {TOTAL} steg
          </span>
        </div>
        <div className="mt-4 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">{a.samtal ? `Samtal bokat ${samtalText(a.samtal)}` : 'Inget samtal bokat'}</p>
          <p className="text-[13px] text-[var(--color-inactive-dark)]">
            Flytthjälp{a.stad === 'ja' ? ' och flyttstäd' : ''}. {a.sent ? 'Alla steg klara.' : left > 0 ? `${left} frågor kvar att ställa i samtalet.` : 'Kunden har inte börjat svara.'} Svaren ligger på Opportunityn, guiden hoppar över det som redan är svarat.
          </p>
        </div>
        <Eyebrow className="mt-5">Kundens svar</Eyebrow>
        <ul className="mt-2 space-y-1 text-[14px] leading-[20px] text-[var(--color-secondary-main)]">
          {lines.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
        <Eyebrow className="mt-5">Öppna så här</Eyebrow>
        <p className="mt-2 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4 text-[15px] leading-[22px] text-[var(--color-secondary-main)]">
          Hej {home.firstName}, det är Nina på Flyttsmart. Jag ser att du begärt offert på flytten till {home.to.split(' ')[0]}
          {n > 0 ? ' och berättat om flytten' : ''}. Jag har {a.sent ? 'bara ett par saker att stämma av' : 'några frågor till'}, sedan har jag ett pris till dig.
        </p>
      </div>
    </div>
  )
}

/* Kortet i listan när samtalet är bokat, som live: bock, Flytthjälp, Offert på väg, och vägen in till frågorna. */
export const OffertCard = ({ a, go }: ScreenProps) => {
  const n = answeredCount(a)
  return (
    <div className="mb-3 flex w-full flex-col rounded-[8px] border-2 border-white bg-white p-3 shadow-[0_4px_8px_rgba(0,0,0,0.08)]">
      <div className="flex w-full items-start justify-between">
        <div className="flex min-w-0 gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center sm:h-10 sm:w-10">
            <CheckCircle size={36} />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="activity-title pb-1 text-[15px] font-bold leading-4 text-[var(--color-text-main)] md:text-[18px]">Flytthjälp</span>
              <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[12px] font-bold text-[#15803D]">Offert på väg</span>
              <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
            </div>
            <p className="text-[13px] text-[#626263] md:text-[15px]">Vi ringer dig {samtalText(a.samtal)}</p>
          </div>
        </div>
        <button type="button" aria-label="Ändra tid" onClick={() => go(2)} className="ml-3 mt-1 shrink-0 text-[var(--color-inactive-grey-light)]">
          <ChevronDown />
        </button>
      </div>
      <div className="mt-3 w-full border-t border-[var(--color-inactive-main)] pt-3 md:pl-[52px]">
        {a.sent ? (
          <>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--color-text-main)] md:text-[15px]">
              <GreenBadge>Dina svar är sparade</GreenBadge>
              Vi har priset klart när vi ringer.
            </p>
            <PrimaryButton className="mt-2.5 md:w-[260px]" tone="outline" onClick={() => go(DONE)}>
              Ändra svar
            </PrimaryButton>
          </>
        ) : (
          <>
            <p className="text-[13px] leading-[18px] text-[var(--color-text-main)] md:text-[15px] md:leading-[22px]">{n === 0 ? 'Berätta mer om din flytt innan samtalet, så ringer vi med priset klart. Det tar ett par minuter.' : `${cap(ORD[n - 1])} av sex steg sparade. Fortsätt när du vill, allt sparas direkt.`}</p>
            <PrimaryButton className="mt-2.5 md:w-[260px]" onClick={() => go(nextUnanswered(a))}>
              {n === 0 ? 'Berätta om flytten' : 'Fortsätt berätta'}
            </PrimaryButton>
          </>
        )}
      </div>
    </div>
  )
}

export const SALJARE_STEP = SALJARE
