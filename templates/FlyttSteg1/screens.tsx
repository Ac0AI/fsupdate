'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import { ArrowDownToLine, ArrowUpToLine, Archive, Boxes, CalendarDays, Car, Check, Fence, MoreHorizontal, Package, Sun, Trash2, Truck, Warehouse, Wrench, X } from 'lucide-react'
import clsx from 'clsx'
import GoogleColor from '@/public/images/GoogleColor.svg'
import GoogleStar from '@/public/images/GoogleStar.svg'
import {
  avstandText,
  harAvstand,
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
  FRAMKOMLIGHET_LABEL,
  type Framkomlighet,
  VANINGAR,
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
import {
  AddCard,
  CheckCircle,
  CheckTile,
  Chip,
  ChipRow,
  ChoiceRow,
  Eyebrow,
  Field,
  FloorRow,
  Frame,
  GreenBadge,
  InfoCard,
  InfoNote,
  InfoRow as Row,
  RouteCard,
  RoutePoint,
  ItemCard,
  MoreLink,
  PrimaryButton,
  STEG,
  Section,
  SheetHandle,
  StatusHead,
  Stepper,
  SubCard,
  TextField,
  TextInput,
  TextLink,
  Tile,
  DayPicker,
  MeterSlider,
  RangeSlider,
  Reveal,
  WeekPicker,
  WindowIcon,
} from './ui'
import { useDemoUser } from '@/common/data/useDemoUser'
import { writeDemoSession, type DemoAddress } from '@/common/data/demoPersona'
import { ChevronDown } from './LiveMovePage'
import { canCallNow, fmtLong, fmtLongDate, fromIso, hideMorning, isSlotPassed, nextSelectable, slotsFor, toIso } from './datum'

export type Home = {
  from: string
  to: string
  fromKvm: number
  /** Okänd tills kunden fyller i den. */
  toKvm?: number
  moveDay: string
  moveDayLong: string
  moveDateFull: string
  moveDateIso: string
  cleanDayLong: string
  firstName: string
  lastName: string
}

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
const OFFERTEN = 13
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
export const OffertScreen = ({ go, update }: ScreenProps) => {
  /* Begär offert skapar Opportunityn direkt och visar bekräftelsen med löftet: svar inom två arbetsdagar (David–Nils 21 okt). */
  const begar = () => {
    update({ samtal: { dag: '', pass: '2d' } })
    go(4)
  }
  return (
    <Sheet>
      {/* Som dagens kort på desktop: en centrerad spalt, punkterna vänsterställda i spalten, bred knapp (David 21 okt). */}
      <div className="px-6 pb-8 pt-4 text-center md:px-8 md:pb-10 md:pt-6">
        <h1 className="mx-auto max-w-[30ch] text-[18px]! font-bold leading-[26px]! text-[var(--color-text-main)] md:max-w-none md:text-[24px]! md:leading-[30px]!">
          Professionell flytthjälp, enkelt och prisvärt
        </h1>
        <div className="mt-5">
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
        </div>
        <ul className="mx-auto mt-6 flex max-w-[320px] flex-col gap-3 text-left md:max-w-[440px]">
          {[
            'Vi kontaktar dig och går igenom din flytt',
            'Du får offert med fast förmånligt pris, inga dolda avgifter',
            'En kontaktperson, erfarna flyttproffs & nöjd-kundgaranti',
          ].map((t, i) => (
            <li key={t} className="flex items-start gap-2">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-main)] text-[14px] font-bold text-white">{i + 1}</span>
              <span className="pt-1 text-[14px] leading-[19px] text-[var(--color-text-main)]">{t}</span>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-8 max-w-[320px] md:max-w-[440px]">
          <PrimaryButton rounded onClick={begar}>
            Begär offert
          </PrimaryButton>
          <p className="mt-2 text-center text-[14px] font-bold text-[var(--color-inactive-grey-light)]">Kostnadsfritt och ej bindande</p>
        </div>
      </div>
    </Sheet>
  )
}

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
          <button
            type="button"
            onClick={() => pick(nu ? 'nu' : 'flexibel')}
            className="mt-5 flex w-full items-center justify-between rounded-lg border border-[var(--color-inactive-main)] bg-white px-4 py-3 text-left"
          >
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
                <button
                  key={pass}
                  type="button"
                  disabled={passed}
                  onClick={() => pick(pass)}
                  className={clsx('rounded-lg border border-[var(--color-inactive-main)] bg-white px-2 py-3 text-center', passed && 'opacity-40')}
                >
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

/* 4 · Nytt: bekräftelsen direkt efter Begär offert (David 20 okt). Tiden är förvald, numret förifyllt, båda går att ändra på plats. */
const AVBRYT_SKAL = ['Har hittat en firma', 'Flyttar själv', 'Vill inte bli kontaktad', 'Annat']
export const BokatScreen = ({ a, update, go }: ScreenProps) => {
  const [andraTid, setAndraTid] = useState(false)
  const [andraNr, setAndraNr] = useState(false)
  const [tel, setTel] = useState(a.telefon)
  const [avbryt, setAvbryt] = useState(false)
  const [date, setDate] = useState<Date>(() => (a.samtal?.iso ? fromIso(a.samtal.iso) : nextSelectable()))
  // Öppnas skärmen direkt från demoraden finns ingen bokning: lägg löftet så att texten stämmer.
  useEffect(() => {
    if (a.samtal) return
    update({ samtal: { dag: '', pass: '2d' } })
  }, [a.samtal, update])
  // Löftet är två arbetsdagar utan klockslag. Kunden kan välja ett tvåtimmarspass från i morgon, och den tiden prioriteras (21 okt).
  const vald = !!a.samtal && a.samtal.pass !== '2d'
  const slots = slotsFor(date)
  const valj = (pass: string) => {
    update({ samtal: { dag: fmtLong(date), pass, iso: toIso(date) } })
    setAndraTid(false)
  }
  return (
    <Sheet>
      <div className="px-4 pb-6 pt-1 md:px-2 md:pb-2">
        {/* Bocken och stängknappen på en rad, rubriken under, allt i samma vänsterkant på alla bredder. En bock i rad med en tvåradig rubrik hängde i luften på desktop (David 21 okt). */}
        <div className="flex items-start justify-between md:gap-4">
          <span className="mt-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
            <Check size={18} strokeWidth={3} />
          </span>
          <button
            type="button"
            aria-label="Stäng"
            onClick={() => go(0)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--color-inactive-dark)]"
          >
            <X size={20} />
          </button>
        </div>
        <h1 className="mt-2 text-[20px]! font-bold leading-[26px]! text-[var(--color-text-main)] md:text-[22px]! md:leading-[28px]!">
          {vald ? `Tack! Vi ringer dig ${samtalText(a.samtal)}.` : 'Tack! Vi hör av oss inom två arbetsdagar.'}
        </h1>
        <p className="mt-2 max-w-[46ch] text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
          {vald ? 'Samtalet tar inte mer än tio minuter.' : 'Vi tar fram rätt underlag för din flytt och tittar på lediga flyttbilar, så att du får ett bra erbjudande.'}
        </p>
        {/* Telefonen som en rad, inte en låda: kunden ska förstå att vi kontaktar dem, inte stanna vid numret (David 21 okt). */}
        {andraNr ? (
          <div className="mt-3 flex items-end gap-3 md:max-w-[400px]">
            <div className="max-w-[220px] flex-1">
              <TextInput type="tel" value={tel} onChange={setTel} placeholder="070-123 45 67" label="Telefonnummer" />
            </div>
            <TextLink
              className="mb-3 text-[14px]"
              onClick={() => {
                if (tel.trim()) update({ telefon: tel.trim() })
                setAndraNr(false)
              }}
            >
              Spara
            </TextLink>
          </div>
        ) : (
          <p className="mt-3 text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
            Vi kontaktar dig på <span className="font-bold text-[var(--color-text-main)]">{a.telefon}</span>.{' '}
            <TextLink muted className="text-[14px]" onClick={() => setAndraNr(true)}>
              Ändra
            </TextLink>
          </p>
        )}
        {/* Huvud-CTA: ett eget kort så att det tar mest plats på skärmen (David 21 okt). */}
        <InfoCard className="mt-5 px-4 pb-4 pt-4 md:max-w-[420px]">
          <h2 className="text-[17px] font-bold leading-[22px] text-[var(--color-text-main)]">Få din offert snabbare</h2>
          <p className="mt-1 max-w-[46ch] text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
            Berätta lite om flytten redan nu, så har vi offerten klar när vi hör av oss. Det tar ett par minuter och du kan fortsätta senare.
          </p>
          <PrimaryButton className="mt-4" onClick={() => go(nextUnanswered(a))}>
            Berätta om flytten
          </PrimaryButton>
        </InfoCard>
        {/* En riktig knapp, inte en länk i texten (Nils 21 okt: "Ändra tid är inte tydlig knapp"). */}
        <button
          type="button"
          aria-expanded={andraTid}
          onClick={() => setAndraTid((v) => !v)}
          className="mt-5 inline-flex h-10 items-center gap-2 rounded-[var(--radius-button)] border-[1.5px] border-[var(--color-secondary-main)] bg-white px-4 text-[14px] font-bold text-[var(--color-secondary-main)]"
        >
          <CalendarDays size={16} />
          {andraTid ? 'Stäng' : vald ? 'Ändra tid' : 'Välj en tid som passar dig'}
        </button>
        {andraTid && (
          <InfoCard className="mt-3 px-3 pb-4 pt-3 md:max-w-[400px]">
            <p className="text-[13px] leading-[18px] text-[var(--color-inactive-dark)]">Vi ringer inom det pass du väljer. Samtalet tar inte mer än tio minuter.</p>
            <div className="mt-3">
              <WeekPicker value={date} onChange={setDate} />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {slots.map((pass) => {
                const passed = isSlotPassed(pass, date)
                const vald = a.samtal?.pass === pass && a.samtal?.iso === toIso(date)
                return (
                  <button
                    key={pass}
                    type="button"
                    disabled={passed}
                    onClick={() => valj(pass)}
                    className={clsx(
                      'h-11 rounded-lg border bg-white text-[15px] font-bold text-[var(--color-text-main)]',
                      vald ? 'border-2 border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-main)]',
                      passed && 'opacity-40',
                    )}
                  >
                    {pass}
                  </button>
                )
              })}
            </div>
          </InfoCard>
        )}
        <p className="mt-3 text-[13px] leading-[18px] text-[var(--color-inactive-dark)]">
          Är det brådskande? Ring oss på <span className="font-bold text-[var(--color-text-main)]">08-12 00 88 22</span>, vardagar 9–17.
        </p>
        <div className="mt-4 text-center text-[13px] text-[var(--color-inactive-grey-light)] md:text-left">
          {avbryt ? (
            <div className="rounded-lg bg-[var(--color-inactive-quite-light)] p-3 text-left">
              <p className="text-[14px] font-bold text-[var(--color-text-main)]">Varför vill du inte ha offert?</p>
              <div className="mt-2">
                <ChipRow>
                  {AVBRYT_SKAL.map((r) => (
                    <Chip
                      key={r}
                      small
                      onClick={() => {
                        update({ samtal: undefined })
                        go(0)
                      }}
                    >
                      {r}
                    </Chip>
                  ))}
                </ChipRow>
              </div>
            </div>
          ) : (
            <>
              Vill du inte ha offert?{' '}
              <TextLink muted className="text-[13px]" onClick={() => setAvbryt(true)}>
                Avbryt
              </TextLink>
            </>
          )}
        </div>
      </div>
    </Sheet>
  )
}

/* Ramen runt stegen. Krysset sparar det som är svarat och stänger arket. */
const Q = ({
  p,
  idx,
  title,
  sub,
  why,
  children,
  cta,
  foot,
  onNext,
}: {
  p: ScreenProps
  idx: number
  title: string
  sub?: string
  why?: string
  children: React.ReactNode
  cta?: string
  foot?: string
  onNext?: () => void
}) => {
  const { a, go, next, savedBadge } = p
  const lefts = questionsLeft(a)
  const answered = answeredQuestions(a)
  const step = idx - FIRST
  const done = STEG.map((_, i) => i < step || (lefts[i] === 0 && answered[i]))
  return (
    <Frame
      step={step}
      title={title}
      sub={sub}
      why={why}
      cta={cta}
      foot={foot}
      left={lefts[step]}
      savedBadge={savedBadge}
      done={done}
      onStep={(i) => go(FIRST + i)}
      onNext={onNext ?? (() => next(idx))}
      onBack={() => go(idx - 1)}
      onClose={() => go(0)}
    >
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
  balkong: <Fence size={14} />,
  annat: <MoreHorizontal size={14} />,
}

/* En ruta för hela adressen, öppen med markören i direkt (Nils 21 okt). Sajtens adressförslag fyller den medan kunden skriver. */
const AdressRuta = ({ address, onSave }: { address: DemoAddress; onSave: (a: DemoAddress) => void }) => {
  const [text, setText] = useState([address.street, [address.zip, address.city].filter(Boolean).join(' ')].filter(Boolean).join(', '))
  const spara = () => {
    const [gata, ...rest] = text.split(',').map((s) => s.trim())
    const m = rest.join(' ').match(/^(\d{3}\s?\d{2})?\s*(.*)$/)
    onSave({ ...address, street: gata || address.street, zip: m?.[1] || address.zip, city: m?.[2] || address.city })
  }
  return (
    <div>
      <TextInput autoFocus value={text} onChange={setText} placeholder="Gatuadress, postnummer och ort" label="Adress" />
      <div className="mt-2 flex justify-end">
        <button type="button" onClick={spara} className="h-10 rounded-[var(--radius-button)] bg-[var(--color-secondary-main)] px-5 text-[14px] font-bold text-white">
          Spara
        </button>
      </div>
    </div>
  )
}

/* 5 · Adresser */
export const AdresserScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const move = useDemoUser().currentMove
  const [andra, setAndra] = useState<'fran' | 'till' | null>(null)
  // Stoppet skrivs i ett fält med Klar, sedan en rad med Ändra (Nils 21 okt: saknade klar/spara).
  const [stoppEdit, setStoppEdit] = useState<number | null>(null)
  const setStopp = (i: number, v: string) => update((prev) => ({ stopp: prev.stopp.map((s, j) => (j === i ? v : s)) }))
  const taBortStopp = (i: number) => {
    update((prev) => ({ stopp: prev.stopp.filter((_, j) => j !== i) }))
    setStoppEdit(null)
  }
  return (
    <Q p={p} idx={FIRST} title="Stämmer adresserna?" sub="Hämtade från din flytt. Ändra om något inte stämmer." foot="Svaren sparas när du går vidare. Vet du inte, välj Vet inte.">
      <RouteCard className="mt-5">
        <RoutePoint
          kind="fran"
          label="Från"
          value={`${home.from}, ${move.fromAddress.city}`}
          action={
            andra === 'fran' ? undefined : (
              <TextLink className="h-[44px]" onClick={() => setAndra('fran')}>
                Ändra
              </TextLink>
            )
          }
        >
          {andra === 'fran' && (
            <div className="mt-2">
              <AdressRuta
                address={move.fromAddress}
                onSave={(adr) => {
                  writeDemoSession({ fromAddress: adr })
                  setAndra(null)
                }}
              />
            </div>
          )}
        </RoutePoint>
        {a.stopp.map((s, i) => {
          const oppen = stoppEdit === i || !s.trim()
          return (
            <RoutePoint
              key={i}
              kind="stopp"
              label={`Stopp ${i + 1}`}
              value={oppen ? undefined : s}
              action={
                <span className="flex items-center gap-4">
                  {!oppen && (
                    <TextLink className="h-[44px]" onClick={() => setStoppEdit(i)}>
                      Ändra
                    </TextLink>
                  )}
                  <TextLink muted className="h-[44px] text-[13px]" onClick={() => taBortStopp(i)}>
                    Ta bort
                  </TextLink>
                </span>
              }
            >
              {oppen && (
                <div className="mt-1">
                  <TextInput autoFocus value={s} onChange={(v) => setStopp(i, v)} placeholder="Adress, och vad som ska hämtas eller lämnas där" label={`Stopp ${i + 1}`} />
                  <div className="mt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => (s.trim() ? setStoppEdit(null) : taBortStopp(i))}
                      className="h-10 rounded-[var(--radius-button)] bg-[var(--color-secondary-main)] px-5 text-[14px] font-bold text-white"
                    >
                      Klar
                    </button>
                  </div>
                </div>
              )}
            </RoutePoint>
          )
        })}
        <RoutePoint
          kind="till"
          label="Till"
          value={`${home.to}, ${move.toAddress.city}`}
          action={
            andra === 'till' ? undefined : (
              <TextLink className="h-[44px]" onClick={() => setAndra('till')}>
                Ändra
              </TextLink>
            )
          }
        >
          {andra === 'till' && (
            <div className="mt-2">
              <AdressRuta
                address={move.toAddress}
                onSave={(adr) => {
                  writeDemoSession({ toAddress: adr })
                  setAndra(null)
                }}
              />
            </div>
          )}
        </RoutePoint>
      </RouteCard>
      <div className="mt-3">
        <MoreLink
          onClick={() => {
            setStoppEdit(a.stopp.length)
            update((prev) => ({ stopp: [...prev.stopp, ''] }))
          }}
        >{a.stopp.length ? 'Lägg till ett stopp till' : 'Lägg till ett stopp på vägen'}</MoreLink>
      </div>
      <Section title="Flyttar du ut och in samma dag?" kvar={!a.sammaDag} sub="Om inte ordnar vi tillfällig förvaring däremellan." why="Flyttar du inte in samma dag behöver sakerna förvaras däremellan. Magasinering är ett tillval som vi kan ta med i offerten.">
        <ChipRow>
          {JA_NEJ_VET.map(([v, label]) => (
            <Chip key={v} selected={a.sammaDag === v} onClick={() => update({ sammaDag: v })}>
              {label}
            </Chip>
          ))}
        </ChipRow>
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
  // Hinderfältet har Klar och blir en rad med Ändra, som adress och stopp (David 21 okt: klar saknas).
  const [hinderEdit, setHinderEdit] = useState(false)
  const ut = side === 'fran'
  const lagenhet = s.bostadstyp === 'lagenhet'
  const hus = s.bostadstyp === 'radhus' || s.bostadstyp === 'villa'
  const kantKvm = ut ? home.fromKvm : home.toKvm
  const kvm = s.kvm ?? (kantKvm ? String(kantKvm) : '')
  // Byte av bostadstyp nollar det som bara gäller lägenhet. Samma typ igen rör inget.
  const valjTyp = (t: Bostadstyp) =>
    set(t === s.bostadstyp ? {} : { bostadstyp: t, bostadstypFranFlytten: false, vaning: undefined, vaningFranFlytten: false, hiss: undefined, hissFranFlytten: false })
  // Saknas bostadstypen (nya bostaden: mäklaren skickar bara adressen) är kortet öppet som första fråga.
  const oppen = edit || !s.bostadstyp
  // Reveal: en fråga i taget inom steget. Nästa visas när den förra är svarad, det förifyllda räknas som svarat.
  const vaningKlar = !lagenhet || !!s.vaning
  const hissKlar = !lagenhet || !!s.hiss
  // Det som redan är svarat stannar kvar även om en tidigare fråga ändras.
  const visaHiss = lagenhet && (vaningKlar || !!s.hiss)
  const vaningarKlar = !hus || !!s.vaningar
  const visaAvstand = (!!s.bostadstyp && vaningKlar && hissKlar && vaningarKlar) || harAvstand(s.avstand)
  const visaFramkomlighet = (visaAvstand && harAvstand(s.avstand)) || !!s.framkomlighetVal
  return (
    <Q
      p={p}
      idx={ut ? FIRST + 1 : FIRST + 2}
      title={ut ? `Utflytt från ${nb(home.from)}` : `Inflytt till ${nb(home.to)}`}
      sub={ut ? 'Vi har fyllt i det vi redan vet om din flytt. Ändra om något inte stämmer.' : 'Samma frågor för den nya bostaden.'}
      foot="Svaren sparas när du går vidare. Vet du inte, välj Vet inte."
    >
      {oppen ? (
        <InfoCard className="mt-5 p-3.5" kvar={!s.bostadstyp}>
          <div className="flex items-center justify-between">
            <span className={clsx(s.bostadstyp ? 'text-[12px] leading-4 text-[var(--color-inactive-dark)]' : 'text-[15px] font-bold leading-5 text-[var(--color-text-main)]')}>
              {s.bostadstyp ? 'Bostadstyp' : 'Vilken typ av bostad är det?'}
            </span>
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
            <span className="text-[12px] leading-4 text-[var(--color-inactive-dark)]">{ut ? 'Boarea i m²' : 'Boarea i m², om du vet den'}</span>
            <div className="mt-1 w-40">
              <TextInput type="number" value={kvm} onChange={(v) => set({ kvm: v })} placeholder={ut ? '62' : 'T.ex. 78'} label="Boarea i m²" />
            </div>
          </div>
          {/* Klar som riktig knapp, inte en länk i hörnet (Nils 21 okt: otydlig och gömd, kortet stängdes aldrig). */}
          {s.bostadstyp && (
            <div className="mt-4">
              <PrimaryButton tone="outline" onClick={() => setEdit(false)}>
                Klar
              </PrimaryButton>
            </div>
          )}
        </InfoCard>
      ) : (
        <InfoCard className="mt-5">
          <Row label="Bostadstyp" value={`${s.bostadstyp ? BOSTADSTYP_LABEL[s.bostadstyp] : ''}${kvm ? ` · ${kvm} m²` : ''}`} action="Ändra" onAction={() => setEdit(true)} first />
        </InfoCard>
      )}
      {lagenhet && (
        <>
          <Section title="Vilket våningsplan ligger lägenheten på?" kvar={!s.vaning} why="Hiss och antal trappor påverkar priset. Trappor tar tid och avgör hur många som bär." badge={s.vaningFranFlytten && s.vaning ? <GreenBadge>Från din flytt</GreenBadge> : undefined}>
            {more ? (
              <div className="flex items-center gap-3">
                <div className="w-32">
                  <TextInput
                    type="number"
                    value={s.vaning && !FLOORS.includes(s.vaning) && s.vaning !== 'vet-ej' ? s.vaning : ''}
                    onChange={(v) => set({ vaning: v, vaningFranFlytten: false })}
                    placeholder="T.ex. 9 eller -1"
                    label="Våning"
                  />
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
            <Section title="Finns det hiss?" kvar={!s.hiss} sub="Stor hiss rymmer fem personer eller fler." badge={s.hissFranFlytten && s.hiss ? <GreenBadge>Från din flytt</GreenBadge> : undefined}>
              <ChipRow>
                {(Object.keys(HISS_LABEL) as Hiss[]).map((h) => (
                  <Chip key={h} selected={s.hiss === h} onClick={() => set({ hiss: h, hissFranFlytten: false })}>
                    {HISS_LABEL[h]}
                  </Chip>
                ))}
              </ChipRow>
            </Section>
          </Reveal>
        </>
      )}
      {hus && (
        <Section title="Hur många våningar har huset?" kvar={!s.vaningar} sub="Räkna med källare och inredd vind om vi ska bära där." why="Fler våningar betyder mer bärande inomhus innan sakerna når bilen.">
          <ChipRow>
            {VANINGAR.map((v) => (
              <Chip key={v} selected={s.vaningar === v} onClick={() => set({ vaningar: v })}>
                {v}
              </Chip>
            ))}
          </ChipRow>
        </Section>
      )}
      <Reveal show={visaAvstand}>
        <Section
          title="Hur nära dörren kan flyttbilen stå?" kvar={!harAvstand(s.avstand)}
          why="Avståndet till parkeringen påverkar priset. Sträckan mellan dörren och bilen går vi många gånger."
          sub="Avståndet från dörren till närmaste plats bilen kan stå. Ungefärligt räcker."
        >
          <MeterSlider value={s.avstand} onChange={(v) => set({ avstand: v })} />
        </Section>
      </Reveal>
      <Reveal show={visaFramkomlighet}>
        <Section
          title="Är det lätt att komma fram med flyttbil och personal?" kvar={!s.framkomlighetVal}
          why="Kan bilen inte komma nära bostaden tar flytten längre tid. Flyttfirman vill veta det i förväg för att planera rätt."
          sub={lagenhet ? 'Hinder kan vara innergård, smal trapp, bom eller trång gata.' : 'Hinder kan vara grusväg, smal infart eller trappor i trädgården.'}
        >
          <ChipRow>
            {(Object.keys(FRAMKOMLIGHET_LABEL) as Framkomlighet[]).map((v) => (
              <Chip
                key={v}
                selected={s.framkomlighetVal === v}
                onClick={() => {
                  set({ framkomlighetVal: v, framkomlighet: v === 'hinder' ? s.framkomlighet : '' })
                  setHinderEdit(v === 'hinder')
                }}
              >
                {FRAMKOMLIGHET_LABEL[v]}
              </Chip>
            ))}
          </ChipRow>
          <Reveal show={s.framkomlighetVal === 'hinder'}>
            {hinderEdit || !s.framkomlighet.trim() ? (
              <div className="mt-3">
                <TextInput
                  autoFocus
                  value={s.framkomlighet}
                  onChange={(v) => set({ framkomlighet: v })}
                  placeholder={lagenhet ? 'Vad är det för hinder? T.ex. innergård, smal trapp' : 'Vad är det för hinder? T.ex. grusväg, smal infart'}
                  label="Hinder"
                />
                <div className="mt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setHinderEdit(false)}
                    className="h-10 rounded-[var(--radius-button)] bg-[var(--color-secondary-main)] px-5 text-[14px] font-bold text-white"
                  >
                    Klar
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-3 rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] bg-white px-4 py-3">
                <span className="min-w-0 truncate text-[14px] text-[var(--color-text-main)]">{s.framkomlighet}</span>
                <TextLink onClick={() => setHinderEdit(true)}>Ändra</TextLink>
              </div>
            )}
          </Reveal>
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
  const setBiyta = (id: string, patch: Partial<Answers['biytor'][number]>) =>
    update((prev) => ({ biytor: prev.biytor.map((b) => (b.id === id ? { ...b, ...('klar' in patch ? {} : { klar: false }), ...patch } : b)) }))
  const setSak = (id: string, patch: Partial<Answers['saker'][number]>) =>
    update((prev) => ({ saker: prev.saker.map((s) => (s.id === id ? { ...s, ...('klar' in patch ? {} : { klar: false }), ...patch } : s)) }))
  // Ett kort är öppet tills kunden trycker Klar, sedan en rad med Ändra. Klar finns först när allt är ifyllt,
  // och ett öppet kort räknas som obesvarat så att Fortsätt väntar (David–Nils 20 okt).
  const biytaKlar = (b: Answers['biytor'][number]) => !!b.typ && typeof b.kvm === 'number' && typeof b.fullt === 'number'
  const sakKlar = (s: Answers['saker'][number]) => !!s.vad.trim() && !!s.vikt && !!s.varde
  // Senast skapade kortet scrollas till mitten när det dyker upp (Nils pdf 20 okt: autoscroll vid Ja på tunga lyft).
  const nytt = useRef<string | null>(null)
  const nyBiyta = () => {
    const id = newId()
    nytt.current = id
    update((prev) => ({ biytor: [...prev.biytor, { id }] }))
  }
  const nySak = () => {
    const id = newId()
    nytt.current = id
    update((prev) => ({ saker: [...prev.saker, { id, vad: '' }] }))
  }
  return (
    <Q p={p} idx={FIRST + 3} title="Hur mycket ska med?" sub={`Jämfört med ett vanligt hem på ${home.fromKvm} m².`} why="Flyttfirman räknar i kubikmeter: en tvåa på 50–60 m² brukar vara 25–30 m³. Volymen avgör bilstorlek och hur många som bär, så vi vill veta om du har mer eller mindre än normalt.">
      <div className="mt-5 grid grid-cols-3 gap-2" data-kvar={!a.bohag ? '1' : undefined}>
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
      <Reveal show={!!a.bohag || !!a.biytaSvar}>
        <Section title="Har du saker i förråd eller annat utrymme utöver boarean?" kvar={!a.biytaSvar || (a.biytaSvar === 'ja' && (a.biytor.length === 0 || a.biytor.some((b) => !b.klar)))} why="Det som ligger i förråd, vind eller källare syns inte i boarean men ska också med i bilen. Berätta ungefär hur stort och hur fullt det är, så får flyttfirman en bild av bohaget.">
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
                <Reveal key={b.id} show scrollOnMount={b.id === nytt.current}>
                  <ItemCard
                    title={b.typ ? BIYTA_LABEL[b.typ] : `Utrymme ${i + 1}`}
                    onRemove={() =>
                      update((prev) => {
                        const rest = prev.biytor.filter((x) => x.id !== b.id)
                        // Sista kortet bort = svaret blir Nej, annars står kunden i ett tomt läge (Nils 21 okt).
                        return rest.length ? { biytor: rest } : { biytor: rest, biytaSvar: 'nej' }
                      })
                    }
                    collapsed={!!b.klar && biytaKlar(b)}
                    summary={[typeof b.kvm === 'number' ? biytaKvmText(b.kvm) : null, typeof b.fullt === 'number' ? fulltText(b.fullt).toLowerCase() : null]
                      .filter(Boolean)
                      .join(' · ')}
                    onDone={biytaKlar(b) ? () => setBiyta(b.id, { klar: true }) : undefined}
                    onEdit={() => setBiyta(b.id, { klar: false })}
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
                      <RangeSlider
                        value={b.kvm}
                        min={5}
                        max={BIYTA_KVM_MAX}
                        step={5}
                        onChange={(v) => setBiyta(b.id, { kvm: v })}
                        text={biytaKvmText}
                        ticks={['5 m²', '25 m²', '50 m² eller mer']}
                        label="Storlek i kvadratmeter"
                      />
                    </Field>
                    <Field label="Hur fullt är det?">
                      <ChipRow>
                        {[25, 50, 75, 100].map((f) => (
                          <Chip key={f} small selected={b.fullt === f} onClick={() => setBiyta(b.id, { fullt: f })}>
                            {fulltText(f)}
                          </Chip>
                        ))}
                      </ChipRow>
                    </Field>
                  </ItemCard>
                </Reveal>
              ))}
              <AddCard label="Lägg till ett utrymme till" hint="Vind, källare, garage eller förråd" onClick={nyBiyta} />
            </div>
          )}
        </Section>
      </Reveal>
      <Reveal show={a.biytaSvar === 'nej' || (a.biytaSvar === 'ja' && a.biytor.length > 0 && a.biytor.every((b) => b.klar)) || !!a.sakerSvar}>
        <Section title="Har du föremål som kräver tunga lyft eller är extra ömtåliga?" kvar={!a.sakerSvar || (a.sakerSvar === 'ja' && (a.saker.length === 0 || a.saker.some((x) => !x.klar)))} why="Föremål över 80 kg kan kräva fler som bär eller särskild utrustning, och det påverkar pris och planering. Värdefulla föremål över ungefär 30 000 kr behöver vi veta om i förväg, så att flytten förbereds rätt och du har fullt försäkringsskydd. Annars kan ersättningen begränsas enligt branschvillkoren Bohag 2010.">
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
                <Reveal key={s.id} show scrollOnMount={s.id === nytt.current}>
                  <ItemCard
                    title={s.vad || `Föremål ${i + 1}`}
                    onRemove={() =>
                      update((prev) => {
                        const rest = prev.saker.filter((x) => x.id !== s.id)
                        return rest.length ? { saker: rest } : { saker: rest, sakerSvar: 'nej' }
                      })
                    }
                    collapsed={!!s.klar && sakKlar(s)}
                    summary={[s.vikt, s.varde].filter(Boolean).join(' · ')}
                    onDone={sakKlar(s) ? () => setSak(s.id, { klar: true }) : undefined}
                    onEdit={() => setSak(s.id, { klar: false })}
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
                </Reveal>
              ))}
              <AddCard label="Lägg till ett föremål till" hint="Så tar flyttfirman med rätt utrustning" onClick={nySak} />
            </div>
          )}
        </Section>
      </Reveal>
      <Reveal show={a.sakerSvar === 'nej' || (a.sakerSvar === 'ja' && a.saker.length > 0 && a.saker.every((x) => x.klar)) || a.utemobler !== undefined}>
        <Section title="Har du utemöbler som ska med?" kvar={a.utemobler === undefined} sub="T.ex. balkongmöbler, loungegrupp, grill, parasoll eller krukor." why="Utemöbler räknas inte in i boarean men tar plats i bilen, så vi vill veta om de ska med.">
          <ChoiceRow options={JA_NEJ} value={a.utemobler} onChange={(v) => update({ utemobler: v })} />
        </Section>
      </Reveal>
    </Q>
  )
}

/* 9 · Städning */

export const StadScreen = (p: ScreenProps) => {
  const { a, update, home } = p
  const setYta = (id: string, patch: Partial<Answers['stadYtor'][number]>) =>
    update((prev) => ({ stadYtor: prev.stadYtor.map((y) => (y.id === id ? { ...y, ...('klar' in patch ? {} : { klar: false }), ...patch } : y)) }))
  const ytaKlar = (y: Answers['stadYtor'][number]) => !!y.typ && typeof y.kvm === 'number'
  const nytt = useRef<string | null>(null)
  const nyYta = () => {
    const id = newId()
    nytt.current = id
    update((prev) => ({ stadYtor: [...prev.stadYtor, { id }] }))
  }
  const setAntal = (t: FonsterTyp, n: number) =>
    update((prev) => {
      const fonster = { ...prev.fonster }
      if (n <= 0) delete fonster[t]
      else fonster[t] = n
      return { fonster, fonsterInga: false }
    })
  // Reveal: en fråga i taget även här (Nils 21 okt). Det som redan är svarat stannar kvar.
  const ytorKlara = a.stadYta === 'boyta' || (a.stadYta === 'mer' && a.stadYtor.length > 0 && a.stadYtor.every((y) => y.klar))
  const visaBalkong = ytorKlara || a.balkong !== undefined
  const balkongSvarad = !!a.balkongStorlek && !!a.balkongGlas
  const balkongKlar = a.balkong === 'nej' || (a.balkong === 'ja' && balkongSvarad)
  const visaFonster = (visaBalkong && balkongKlar) || Object.keys(a.fonster).length > 0 || a.fonsterInga
  const fonsterKlara = Object.keys(a.fonster).length > 0 || a.fonsterInga
  const visaKansliga = (visaFonster && fonsterKlara) || a.kansliga !== undefined
  // Balkongkortet stänger sig när båda frågorna är svarade, Ändra öppnar det igen (Nils 21 okt).
  const [balkongOppen, setBalkongOppen] = useState(false)
  const [kansligaEdit, setKansligaEdit] = useState(false)
  const balkongText = [a.balkongStorlek === 'liten' ? 'Liten' : a.balkongStorlek === 'mellan' ? 'Mellan' : 'Stor', a.balkongGlas === 'hel' ? 'helinglasad' : 'halvinglasad'].join(
    ' · ',
  )
  return (
    <Q p={p} idx={FIRST + 4} title="Flyttstädning">
      <Section title="Vill du ha pris på flyttstädning också?" kvar={!a.stad} sub="Nöjd-kund-garanti: anmärkningar vid besiktningen åtgärdas kostnadsfritt." className="mt-4">
        <ChoiceRow options={JA_NEJ} value={a.stad} onChange={(v) => update({ stad: v })} />
        {a.stad === 'nej' && <InfoNote>Då räknar vi bara på flytthjälpen. Städ går att lägga till när som helst före flytten.</InfoNote>}
      </Section>
      {a.stad === 'ja' && (
        <>
          <Section title="Vad ska städas?" kvar={!a.stadYta || (a.stadYta === 'mer' && (a.stadYtor.length === 0 || a.stadYtor.some((y) => !y.klar)))} why="Priset på flyttstädning utgår från bostadens totala yta.">
            <div className="grid grid-cols-2 gap-2">
              <Tile label="Boarean" hint={`${home.fromKvm} m²`} selected={a.stadYta === 'boyta'} onClick={() => update({ stadYta: 'boyta', stadYtor: [] })} />
              <Tile
                label="Mer än boarean"
                hint="Källare, förråd, garage"
                selected={a.stadYta === 'mer'}
                onClick={() => {
                  if (a.stadYta !== 'mer' && a.stadYtor.length === 0) nyYta()
                  update({ stadYta: 'mer' })
                }}
              />
            </div>
            {a.stadYta === 'mer' && (
              <div className="mt-3 flex flex-col gap-3">
                {a.stadYtor.map((y, i) => (
                  <Reveal key={y.id} show scrollOnMount={y.id === nytt.current}>
                    <ItemCard
                      title={y.typ ? BIYTA_LABEL[y.typ] : `Utrymme ${i + 1}`}
                      onRemove={() =>
                        update((prev) => {
                          const rest = prev.stadYtor.filter((x) => x.id !== y.id)
                          return rest.length ? { stadYtor: rest } : { stadYtor: rest, stadYta: undefined }
                        })
                      }
                      collapsed={!!y.klar && ytaKlar(y)}
                      summary={typeof y.kvm === 'number' ? biytaKvmText(y.kvm) : undefined}
                      onDone={ytaKlar(y) ? () => setYta(y.id, { klar: true }) : undefined}
                      onEdit={() => setYta(y.id, { klar: false })}
                    >
                      <Field label="Vilket utrymme?">
                        <ChipRow>
                          {(Object.keys(BIYTA_LABEL) as BiytaTyp[]).map((t) => (
                            <Chip key={t} small selected={y.typ === t} onClick={() => setYta(y.id, { typ: t })} icon={BIYTA_IKON[t]}>
                              {BIYTA_LABEL[t]}
                            </Chip>
                          ))}
                        </ChipRow>
                      </Field>
                      <Field label="Ungefär hur stort?">
                        <RangeSlider
                          value={y.kvm}
                          min={5}
                          max={BIYTA_KVM_MAX}
                          step={5}
                          onChange={(v) => setYta(y.id, { kvm: v })}
                          text={biytaKvmText}
                          ticks={['5 m²', '25 m²', '50 m² eller mer']}
                          label="Storlek"
                        />
                      </Field>
                    </ItemCard>
                  </Reveal>
                ))}
                <AddCard label="Lägg till ett utrymme till" hint="Källare, förråd eller garage som ska städas" onClick={nyYta} />
              </div>
            )}
          </Section>
          <Reveal show={visaBalkong}>
            <Section title="Har du inglasad balkong?" kvar={!a.balkong} why="Balkongens yta räknas in i städytan. Glaset på en inglasad balkong putsas som fönster och kostar extra.">
              <ChoiceRow options={JA_NEJ} value={a.balkong} onChange={(v) => update({ balkong: v })} />
              {a.balkong === 'ja' && balkongSvarad && !balkongOppen && (
                <div className="mt-3 flex items-center justify-between gap-3 rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] bg-white px-4 py-3">
                  <span className="flex min-w-0 items-center gap-2 text-[14px] text-[var(--color-text-main)]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
                      <Check size={12} strokeWidth={3} />
                    </span>
                    <span className="truncate">{balkongText}</span>
                  </span>
                  <TextLink onClick={() => setBalkongOppen(true)}>Ändra</TextLink>
                </div>
              )}
              {a.balkong === 'ja' && (!balkongSvarad || balkongOppen) && (
                <Reveal show scrollOnMount>
                  <SubCard className="mt-3">
                    <Field label="Hur stor är den?" sub="Liten under 6 m², mellan 6–8 m², stor över 8 m².">
                      <ChoiceRow
                        options={[
                          ['liten', 'Liten'],
                          ['mellan', 'Mellan'],
                          ['stor', 'Stor'],
                        ]}
                        value={a.balkongStorlek}
                        onChange={(v) => {
                          update({ balkongStorlek: v })
                          if (a.balkongGlas) setBalkongOppen(false)
                        }}
                      />
                    </Field>
                    <Field label="Inglasning">
                      <ChoiceRow
                        options={[
                          ['halv', 'Halv'],
                          ['hel', 'Hel'],
                        ]}
                        value={a.balkongGlas}
                        onChange={(v) => {
                          update({ balkongGlas: v })
                          if (a.balkongStorlek) setBalkongOppen(false)
                        }}
                      />
                    </Field>
                  </SubCard>
                </Reveal>
              )}
            </Section>
          </Reveal>
          <Reveal show={visaFonster}>
            <Section title="Har du fönster som tar extra tid att putsa?" kvar={Object.keys(a.fonster).length === 0 && !a.fonsterInga} sub="Ange antal per typ, eller välj att det inte finns några." why="Vanlig fönsterputs ingår. Fönster med flera bågar, spröjs, stora glaspartier eller som är svåra att nå tar längre tid och räknas som extra.">
              <div className="flex flex-col gap-2">
                {(Object.keys(FONSTER_LABEL) as FonsterTyp[]).map((t) => {
                  const n = a.fonster[t] ?? 0
                  return (
                    <div
                      key={t}
                      className={clsx(
                        'flex items-center gap-3 rounded-[var(--radius-main)] border-[1.5px] bg-white py-2 pl-3 pr-2',
                        n > 0 ? 'border-[var(--color-secondary-main)]' : 'border-[var(--color-inactive-main)]',
                      )}
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center text-[var(--color-secondary-main)]">
                        <WindowIcon type={t} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[15px] font-bold leading-5 text-[var(--color-text-main)]">{FONSTER_LABEL[t][0]}</span>
                        <span className="block text-[12px] leading-4 text-[var(--color-inactive-dark)]">{FONSTER_LABEL[t][1]}</span>
                      </span>
                      <Stepper value={n} min={0} onChange={(v) => setAntal(t, v)} />
                    </div>
                  )
                })}
                {/* Chip som övriga val, inte en rad som ser ut som ett fönsterkort (David 21 okt). */}
                <ChipRow>
                  <Chip selected={a.fonsterInga} onClick={() => update({ fonsterInga: !a.fonsterInga, fonster: {} })}>
                    Inga sådana fönster
                  </Chip>
                </ChipRow>
              </div>
            </Section>
          </Reveal>
          <Reveal show={visaKansliga}>
            <Section title="Finns det känsliga ytor?" kvar={!a.kansliga} sub="T.ex. parkett, marmor, oljat trä, natursten eller lackade luckor." why="Ytor som kräver anpassad rengöring för att undvika skador. Städfirman vill veta det i förväg.">
              <ChoiceRow
                options={JA_NEJ}
                value={a.kansliga}
                onChange={(v) => {
                  update({ kansliga: v })
                  setKansligaEdit(v === 'ja')
                }}
              />
              <Reveal show={a.kansliga === 'ja'}>
                {kansligaEdit || !a.kansligaText.trim() ? (
                  <div className="mt-3">
                    <TextField
                      value={a.kansligaText}
                      onChange={(v) => update({ kansligaText: v })}
                      placeholder="Vilka ytor och var? T.ex. marmorgolv i badrummet"
                      label="Känsliga ytor"
                    />
                    <div className="mt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setKansligaEdit(false)}
                        className="h-10 rounded-[var(--radius-button)] bg-[var(--color-secondary-main)] px-5 text-[14px] font-bold text-white"
                      >
                        Klar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 flex items-center justify-between gap-3 rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] bg-white px-4 py-3">
                    <span className="min-w-0 truncate text-[14px] text-[var(--color-text-main)]">{a.kansligaText}</span>
                    <TextLink onClick={() => setKansligaEdit(true)}>Ändra</TextLink>
                  </div>
                )}
              </Reveal>
            </Section>
          </Reveal>
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
      foot="Tillvalen är frivilliga. Svaren sparas när du trycker Klar."
      onNext={() => {
        update({ sent: true })
        go(DONE)
      }}
    >
      <Section title="Vilken dag vill du flytta?" kvar={!a.flyttDag} sub={`Tillträdet är ${home.moveDayLong}. Välj dagen du vill flytta.`} why="Dagen avgör vilka flyttfirmor som är lediga. Vardagar är oftast billigare än helger.">
        <DayPicker value={a.flyttDag} start={home.moveDateIso} label="Flyttdag" placeholder="Välj dag" onChange={(iso) => update({ flyttDag: iso })} ringText="tillträdesdagen" />
      </Section>
      {a.stad === 'ja' && (
        <Section title="Vilken dag vill du ha flyttstädningen?" kvar={!a.stadDag} sub="Oftast dagen efter flytten, när bostaden är tömd." why="Är du inte hemma när det städas behöver städfirman veta hur de kommer in. Det tar vi i samtalet.">
          <DayPicker
            value={a.stadDag}
            start={a.flyttDag ?? home.moveDateIso}
            min={a.flyttDag ?? home.moveDateIso}
            label="Städdag"
            placeholder="Välj dag"
            onChange={(iso) => update({ stadDag: iso })}
            ringText={a.flyttDag ? 'flyttdagen' : 'tillträdesdagen'}
          />
        </Section>
      )}
      <Section title="Något annat vi bör veta?" sub="Önskemål eller sådant som påverkar flytten.">
        <TextField
          value={a.ovrigt}
          onChange={(v) => update({ ovrigt: v })}
          placeholder="T.ex. ömtåliga saker, parkering eller tider som inte passar"
          label="Något annat vi bör veta"
        />
      </Section>
      <Section title="Vill du ha hjälp med något mer?" sub="Kryssa i så tar vi med det i offerten." why="Flyttlådor: räkna med ungefär 0,8 lådor per kvadratmeter boarea. Att låna dem ingår i flytten, hemleverans kostar extra. Vid bortforsling ger återbruk RUT-avdrag, återvinning gör det inte.">
        <div className="flex flex-col gap-2">
          {(Object.keys(TILLVAL_LABEL) as Tillval[]).map((t) => (
            <CheckTile key={t} label={TILLVAL_LABEL[t][0]} hint={TILLVAL_LABEL[t][1]} selected={a.tillval.includes(t)} onClick={() => toggleTillval(t)} icon={TILLVAL_IKON[t]} />
          ))}
        </div>
      </Section>
    </Q>
  )
}

const vaningText = (v?: string) => (v === 'vet-ej' ? 'våning: vet inte' : v === 'BV' ? 'bottenvåning' : v ? `våning ${v}` : null)

const adressLine = (label: string, s: AdressSvar) => {
  const lagenhet = s.bostadstyp === 'lagenhet'
  const parts = [
    s.bostadstyp ? BOSTADSTYP_LABEL[s.bostadstyp].toLowerCase() : 'bostadstyp ej svarad',
    lagenhet ? vaningText(s.vaning) : null,
    lagenhet && s.hiss ? HISS_LABEL[s.hiss].toLowerCase().replace('vet inte', 'hiss: vet inte') : null,
    harAvstand(s.avstand) ? (s.avstand === 'vet-ej' ? 'bärsträcka: vet inte' : `${avstandText(s.avstand)} att bära`) : null,
    s.framkomlighetVal === 'hinder' ? s.framkomlighet || 'hinder på vägen' : s.framkomlighetVal === 'vet-ej' ? 'framkomlighet: vet inte' : s.framkomlighetVal === 'god' ? 'inga hinder' : null,
  ].filter(Boolean)
  return `${label}: ${parts.join(', ')}`
}

export const answerLines = (a: Answers, home: Home): string[] => {
  const L: (string | null)[] = []
  a.stopp.filter(Boolean).forEach((s, i) => L.push(`Stopp ${i + 1}: ${s}`))
  if (a.sammaDag) L.push(a.sammaDag === 'ja' ? 'Flyttar in samma dag' : a.sammaDag === 'nej' ? 'Flyttar inte in samma dag, behöver förvaring' : 'Samma dag: vet inte')
  L.push(adressLine(home.from, a.fran), adressLine(home.to, a.till))
  if (a.bohag) L.push(`${BOHAG_LABEL[a.bohag]}, ${home.fromKvm} m²`)
  if (a.flyttDag) L.push(`Flytt ${fmtLongDate(fromIso(a.flyttDag))}`)
  if (a.biytaSvar === 'nej') L.push('Inga utrymmen utöver boarean')
  a.biytor.forEach((b) =>
    L.push(
      `${b.typ ? BIYTA_LABEL[b.typ] : 'Utrymme'}${typeof b.kvm === 'number' ? ` ${biytaKvmText(b.kvm)}` : ''}${typeof b.fullt === 'number' ? `, ${fulltText(b.fullt).toLowerCase()}` : ''}`,
    ),
  )
  if (a.sakerSvar === 'nej') L.push('Inga tunga eller ömtåliga föremål')
  a.saker.forEach((s) => L.push(`${s.vad || 'Föremål'}${s.vikt ? `, ${s.vikt}` : ''}${s.varde ? `, värde ${s.varde}` : ''}`))
  if (a.utemobler) L.push(a.utemobler === 'ja' ? 'Utemöbler ska med' : 'Inga utemöbler')
  if (a.stad === 'nej') L.push('Ingen flyttstädning')
  if (a.stad === 'ja') {
    const mer =
      a.stadYta === 'mer'
        ? ` + ${
            a.stadYtor
              .filter((y) => y.typ)
              .map((y) => `${(y.typ ? BIYTA_LABEL[y.typ] : '').toLowerCase()}${typeof y.kvm === 'number' ? ` ${y.kvm} m²` : ''}`)
              .join(', ') || 'mer'
          }`
        : ''
    L.push(`Flyttstäd${a.stadDag ? ` ${fmtLongDate(fromIso(a.stadDag))}` : ''}: boarean ${home.fromKvm} m²${mer}`)
    if (a.balkong === 'ja')
      L.push(`Inglasad balkong${a.balkongStorlek ? `, ${a.balkongStorlek}` : ''}${a.balkongGlas ? `, ${a.balkongGlas === 'hel' ? 'helinglasad' : 'halvinglasad'}` : ''}`)
    const f = (Object.keys(a.fonster) as FonsterTyp[]).map((t) => `${FONSTER_LABEL[t][0].toLowerCase()} ×${a.fonster[t]}`)
    if (f.length) L.push(`Fönster: ${f.join(', ')}`)
    else if (a.fonsterInga) L.push('Inga specialfönster')
    if (a.kansliga === 'ja') L.push(`Känsliga ytor: ${a.kansligaText || 'ja'}`)
  }
  if (a.tillval.length) L.push(`Vill ha pris på ${a.tillval.map((t) => TILLVAL_LABEL[t][0].toLowerCase()).join(', ')}`)
  if (a.ovrigt) L.push(a.ovrigt)
  return L.filter((x): x is string => !!x)
}

/* Sammanfattningen på Allt sparat: svaren grupperade per steg med etikett och värde, så kunden hittar och kan ändra rätt sak (David 21 okt). */
export type SvarRad = { label: string; value: string }
export type SvarGrupp = { step: number; title: string; rows: SvarRad[] }

const adressRows = (s: AdressSvar, kvm?: number): SvarRad[] => {
  const lagenhet = s.bostadstyp === 'lagenhet'
  const yta = s.kvm || kvm
  const rows: (SvarRad | null)[] = [
    { label: 'Bostad', value: s.bostadstyp ? `${BOSTADSTYP_LABEL[s.bostadstyp]}${yta ? ` · ${yta} m²` : ''}` : 'Ej svarat' },
    lagenhet && s.vaning ? { label: 'Våning', value: s.vaning === 'vet-ej' ? 'Vet inte' : s.vaning === 'BV' ? 'Bottenvåning' : s.vaning } : null,
    !lagenhet && s.vaningar ? { label: 'Våningar', value: s.vaningar } : null,
    lagenhet && s.hiss ? { label: 'Hiss', value: HISS_LABEL[s.hiss] } : null,
    harAvstand(s.avstand) ? { label: 'Bärsträcka', value: s.avstand === 'vet-ej' ? 'Vet inte' : avstandText(s.avstand) } : null,
    s.framkomlighetVal
      ? { label: 'Framkomlighet', value: s.framkomlighetVal === 'hinder' ? s.framkomlighet || 'Det finns hinder' : FRAMKOMLIGHET_LABEL[s.framkomlighetVal] }
      : null,
  ]
  return rows.filter((r): r is SvarRad => !!r)
}

export const answerGroups = (a: Answers, home: Home): SvarGrupp[] => {
  const adresser: SvarRad[] = [
    { label: 'Från', value: home.from },
    { label: 'Till', value: home.to },
    ...a.stopp.filter(Boolean).map((s, i) => ({ label: `Stopp ${i + 1}`, value: s })),
  ]
  if (a.sammaDag) adresser.push({ label: 'Samma dag', value: a.sammaDag === 'ja' ? 'Ja' : a.sammaDag === 'nej' ? 'Nej, behöver förvaring' : 'Vet inte' })

  const med: SvarRad[] = []
  if (a.bohag) med.push({ label: 'Bohag', value: `${BOHAG_LABEL[a.bohag]} · ${home.fromKvm} m²` })
  if (a.biytaSvar === 'nej') med.push({ label: 'Biytor', value: 'Inga utöver boarean' })
  a.biytor.forEach((b) =>
    med.push({
      label: b.typ ? BIYTA_LABEL[b.typ] : 'Utrymme',
      value:
        [typeof b.kvm === 'number' ? biytaKvmText(b.kvm) : null, typeof b.fullt === 'number' ? fulltText(b.fullt).toLowerCase() : null].filter(Boolean).join(', ') || 'Ska med',
    }),
  )
  if (a.sakerSvar === 'nej') med.push({ label: 'Tungt eller ömtåligt', value: 'Inget' })
  a.saker.forEach((s) => med.push({ label: s.vad || 'Föremål', value: [s.vikt, s.varde ? `värde ${s.varde}` : null].filter(Boolean).join(', ') || 'Ska med' }))
  if (a.utemobler) med.push({ label: 'Utemöbler', value: a.utemobler === 'ja' ? 'Ska med' : 'Inga' })

  const stad: SvarRad[] = []
  if (a.stad === 'nej') stad.push({ label: 'Flyttstädning', value: 'Nej' })
  if (a.stad === 'ja') {
    const mer = a.stadYtor.filter((y) => y.typ).map((y) => `${(y.typ ? BIYTA_LABEL[y.typ] : '').toLowerCase()}${typeof y.kvm === 'number' ? ` ${y.kvm} m²` : ''}`)
    stad.push({ label: 'Flyttstädning', value: `Boarean ${home.fromKvm} m²${a.stadYta === 'mer' ? ` + ${mer.join(', ') || 'mer'}` : ''}` })
    if (a.balkong === 'ja')
      stad.push({
        label: 'Inglasad balkong',
        value: [a.balkongStorlek, a.balkongGlas ? (a.balkongGlas === 'hel' ? 'helinglasad' : 'halvinglasad') : null].filter(Boolean).join(', ') || 'Ja',
      })
    const f = (Object.keys(a.fonster) as FonsterTyp[]).map((t) => `${FONSTER_LABEL[t][0]} ×${a.fonster[t]}`)
    if (f.length) stad.push({ label: 'Fönster', value: f.join(', ') })
    else if (a.fonsterInga) stad.push({ label: 'Fönster', value: 'Inga specialfönster' })
    if (a.kansliga === 'ja') stad.push({ label: 'Känsliga ytor', value: a.kansligaText || 'Ja' })
  }

  const sista: SvarRad[] = []
  if (a.flyttDag) sista.push({ label: 'Flyttdag', value: fmtLongDate(fromIso(a.flyttDag)) })
  if (a.stad === 'ja' && a.stadDag) sista.push({ label: 'Städdag', value: fmtLongDate(fromIso(a.stadDag)) })
  if (a.tillval.length) sista.push({ label: 'Pris på', value: a.tillval.map((t) => TILLVAL_LABEL[t][0]).join(', ') })
  if (a.ovrigt) sista.push({ label: 'Övrigt', value: a.ovrigt })

  return [
    { step: 0, title: 'Adresser', rows: adresser },
    { step: 1, title: `Bära ut · ${home.from}`, rows: adressRows(a.fran, home.fromKvm) },
    { step: 2, title: `Bära in · ${home.to}`, rows: adressRows(a.till, home.toKvm) },
    { step: 3, title: 'Vad ska med', rows: med },
    { step: 4, title: 'Städning', rows: stad },
    { step: 5, title: 'Sista detaljerna', rows: sista },
  ].filter((g) => g.rows.length)
}

/* 11 · Allt sparat */
export const SparatScreen = ({ a, go, home }: ScreenProps) => {
  const groups = answerGroups(a, home)
  // Egen scroll här: på desktop ligger sidan i ett kort med fast höjd (gick inte att scrolla, David 21 okt), på mobil i arket.
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto overscroll-contain bg-white">
      <SheetHandle />
      <div className="mx-auto w-full max-w-[560px] px-4 pb-6 pt-4 text-center md:py-6">
        <div className="flex justify-center">
          <CheckCircle size={56} />
        </div>
        <h1 className="mt-4 text-[20px] font-bold leading-[26px] text-[var(--color-text-main)]">Tack, allt är sparat</h1>
        <p className="mx-auto mt-2 max-w-[300px] text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
          Vi kontaktar dig {samtalText(a.samtal)} och har priset klart. Vill du ändra något gör du det på flyttsidan fram till samtalet.
        </p>
        <PrimaryButton className="mt-6" onClick={() => go(0)}>
          Tillbaka till flyttsidan
        </PrimaryButton>
        {/* En enda Ändra, inte en per grupp (David 21 okt). Öppnar steg 1 med svaren ifyllda. */}
        <PrimaryButton tone="outline" className="mt-3" onClick={() => go(FIRST)}>
          Ändra mina svar
        </PrimaryButton>
        <Eyebrow className="mt-7 text-left">Dina svar</Eyebrow>
        <div className="mt-2 overflow-hidden rounded-xl border border-[var(--color-inactive-main)] bg-white text-left">
          {groups.map((g, i) => (
            <section key={g.title} className={clsx('px-4 pb-3 pt-2', i > 0 && 'border-t border-[var(--color-inactive-main)]')}>
              <h2 className="py-2 text-[14px] font-bold leading-5 text-[var(--color-text-main)]">{g.title}</h2>
              <dl className="grid grid-cols-[minmax(92px,max-content)_1fr] gap-x-4 gap-y-1 text-[14px] leading-5">
                {g.rows.map((r, j) => (
                  <Fragment key={j}>
                    <dt className="text-[var(--color-inactive-dark)]">{r.label}</dt>
                    <dd className="min-w-0 break-words text-[var(--color-text-main)]">{r.value}</dd>
                  </Fragment>
                ))}
              </dl>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}

/* 12 · Säljaren ringer med svaren framför sig */
export const SaljareScreen = ({ a, home, update }: ScreenProps) => {
  const n = answeredCount(a)
  const left = questionsLeft(a).reduce((x, y) => x + y, 0)
  const lines = answerLines(a, home)
  return (
    <div className="bg-[var(--color-inactive-quite-light)] px-4 py-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">
              {home.firstName} {home.lastName}
            </p>
            {/* Kundens valda flyttdag om den finns, annars tillträdesdagen. */}
            <p className="text-[13px] text-[var(--color-inactive-dark)]">Demomäklaren · flytt {a.flyttDag ? fmtLongDate(fromIso(a.flyttDag)) : home.moveDayLong}</p>
          </div>
          <span className="shrink-0 rounded-full bg-[var(--color-accent-lighter)] px-3 py-1 text-[12px] font-bold text-[var(--color-accent-dark-main)]">
            {n} av {TOTAL} steg
          </span>
        </div>
        <div className="mt-4 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <p className="text-[18px] font-bold text-[var(--color-secondary-main)]">{a.samtal ? (a.samtal.pass === '2d' ? 'Lovat: svar inom två arbetsdagar' : `Samtal bokat ${samtalText(a.samtal)}`) : 'Inget samtal bokat'}</p>
          <p className="text-[13px] text-[var(--color-inactive-dark)]">
            Flytthjälp{a.stad === 'ja' ? ' och flyttstäd' : ''}.{' '}
            {n === 0 ? 'Kunden har inte börjat svara.' : left > 0 ? `${left} frågor kvar att ställa i samtalet.` : 'Alla frågor besvarade.'} Svaren ligger på Opportunityn, guiden hoppar
            över det som redan är svarat.
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
        <Eyebrow className="mt-5">Efter samtalet</Eyebrow>
        <p className="mt-2 text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
          När offerten skickas låses kundens svar och kortet på flyttsidan länkar till offerten i stället för till frågorna.
        </p>
        <PrimaryButton className="mt-3" tone={a.offertSkickad ? 'outline' : 'navy'} onClick={() => update({ offertSkickad: !a.offertSkickad })}>
          {a.offertSkickad ? 'Ta tillbaka offerten (demo)' : 'Skicka offerten (demo)'}
        </PrimaryButton>
        <p className="mt-4 text-[14px] leading-[20px] text-[var(--color-inactive-dark)]">
          Manuell hantering i Harry låser också kundens svar medan vi väntar på leverantören. Kortet säger att vi prissätter förfrågan.
        </p>
        <PrimaryButton className="mt-3" tone={a.manuell ? 'outline' : 'navy'} onClick={() => update({ manuell: !a.manuell })}>
          {a.manuell ? 'Avsluta manuell hantering (demo)' : 'Manuell hantering, väntar på leverantör (demo)'}
        </PrimaryButton>
      </div>
    </div>
  )
}

/* 13 · Offerten: dit kortet länkar när offerten är skickad. Platshållare för dagens offertsida. */
export const OffertenScreen = ({ a, go, home }: ScreenProps) => {
  const stad = a.stad === 'ja'
  return (
    <div className="bg-[var(--color-inactive-quite-light)] px-4 py-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
        <Eyebrow>Offert</Eyebrow>
        <h1 className="mt-1 text-[22px]! font-bold leading-[28px]! text-[var(--color-text-main)]">Din flytt {a.flyttDag ? fmtLongDate(fromIso(a.flyttDag)) : home.moveDayLong}</h1>
        <p className="mt-1 text-[14px] text-[var(--color-inactive-dark)]">
          {home.from} till {home.to}. Gäller i sju dagar.
        </p>
        <div className="mt-5 rounded-xl bg-[var(--color-secondary-extra-extra-light)] p-4">
          <div className="flex items-center justify-between text-[15px] text-[var(--color-text-main)]">
            <span>Flytthjälp{a.tillval.includes('packhjalp') ? ' med packhjälp' : ''}</span>
            <span className="font-bold">{a.tillval.includes('packhjalp') ? '14 900 kr' : '11 450 kr'}</span>
          </div>
          {stad && (
            <div className="mt-2 flex items-center justify-between text-[15px] text-[var(--color-text-main)]">
              <span>Flyttstädning {home.fromKvm} m²</span>
              <span className="font-bold">3 900 kr</span>
            </div>
          )}
          <div className="mt-3 border-t border-[var(--color-inactive-main)] pt-3 text-[12px] text-[var(--color-inactive-dark)]">
            Priser efter RUT. Fast pris, inga dolda avgifter.
          </div>
        </div>
        <PrimaryButton className="mt-5" onClick={() => go(0)}>
          Boka flytten
        </PrimaryButton>
        <div className="mt-3 text-center">
          <TextLink muted onClick={() => go(0)}>
            Tillbaka till flyttsidan
          </TextLink>
        </div>
        <p className="mt-5 text-[12px] leading-[16px] text-[var(--color-inactive-dark)]">
          Platshållare i demon: skarpt visas dagens offertsida. Svaren från frågorna är låsta när offerten är skickad, ändringar görs med säljaren.
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
              <span className="rounded-full bg-[#DCFCE7] px-2 py-0.5 text-[12px] font-bold text-[#15803D]">{a.offertSkickad ? 'Offert skickad' : 'Offert på väg'}</span>
              <span className="inline-block h-2 w-2 rounded-full bg-[#22C55E]" />
            </div>
            <p className="text-[13px] text-[#626263] md:text-[15px]">
              {a.offertSkickad ? 'Skickad till din mejl och här på flyttsidan' : a.manuell ? 'Vi återkommer med pris' : `Vi kontaktar dig ${samtalText(a.samtal)}`}
            </p>
          </div>
        </div>
        <button type="button" aria-label="Ändra tid" onClick={() => go(4)} className="ml-3 mt-1 shrink-0 text-[var(--color-inactive-grey-light)]">
          <ChevronDown />
        </button>
      </div>
      <div className="mt-3 w-full border-t border-[var(--color-inactive-main)] pt-3 md:pl-[52px]">
        {a.offertSkickad ? (
          <>
            <p className="text-[13px] leading-[18px] text-[var(--color-text-main)] md:text-[15px] md:leading-[22px]">
              Din offert är klar. Priset gäller i sju dagar, boka direkt eller ring oss om du har frågor.
            </p>
            <PrimaryButton className="mt-2.5 md:w-[260px]" onClick={() => go(OFFERTEN)}>
              Se offert
            </PrimaryButton>
          </>
        ) : a.manuell ? (
          <p className="text-[13px] leading-[18px] text-[var(--color-text-main)] md:text-[15px] md:leading-[22px]">
            Vi prissätter din förfrågan just nu. Dina svar är låsta så länge, ring oss om något ändras.
          </p>
        ) : a.sent ? (
          <>
            <p className="flex flex-wrap items-center gap-2 text-[13px] text-[var(--color-text-main)] md:text-[15px]">
              <GreenBadge>Dina svar är sparade</GreenBadge>
              Vi har priset klart när vi hör av oss.
            </p>
            <PrimaryButton className="mt-2.5 md:w-[260px]" tone="outline" onClick={() => go(DONE)}>
              Ändra svar
            </PrimaryButton>
          </>
        ) : (
          <>
            <p className="text-[13px] leading-[18px] text-[var(--color-text-main)] md:text-[15px] md:leading-[22px]">
              {n === 0
                ? 'Berätta mer om din flytt innan samtalet, så ringer vi med priset klart. Det tar ett par minuter.'
                : `${cap(ORD[n - 1])} av sex steg sparade. Fortsätt när du vill.`}
            </p>
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
export const OFFERTEN_STEP = OFFERTEN
