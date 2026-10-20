'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { clsx } from 'clsx'
import { HOME, OFFERS, RECOMMENDED, dateStatus, firstPossible, kwhFor, longDate, offerById, priceFor, type HomeType, type OfferId } from './data'
import { ArrowRight, CheckCircle, ChevronDown, FramedField, Foot, Help, House, Lock, Logo, Pen, PenLarge, Pin, Shield, Steps, Title, fieldInput, press } from './ui'

export type ElState = {
  homeType: HomeType | null
  kvm: number
  kwh: number
  editHome: boolean
  compareOpen: boolean
  selected: OfferId
  readMore: boolean
  startDate: string
  facilityId: string
  apartment: string
  terminate: boolean
  endDate: string
  oldAddress: string
  touched: boolean
  accepted: boolean
  showMissing: boolean
  specOpen: boolean
  dateHelp: boolean
  aptHelp: boolean
}

export type ScreenProps = {
  s: ElState
  set: (patch: Partial<ElState>) => void
  go: (step: number) => void
}

const navy = 'text-[#214766]'

/* ---------- Skärm 1 · Priser ---------- */

const Intro = () => (
  <div className="flex flex-col gap-[10px]">
    <div role="heading" aria-level={1} className={clsx('text-[24px] leading-[30px] font-bold tracking-[0.32px]', navy)}>
      Elavtal
    </div>
    <p className={clsx('text-[16px] leading-[19.2px] font-bold tracking-[0.32px]', navy)}>Teckna nytt elavtal på 2 minuter. Vi säger upp ditt gamla åt dig, utan avgift.</p>
    <div className="flex items-center gap-[10px] pt-[4px]">
      <Shield />
      <p className="text-[12px] leading-[14.4px] font-bold tracking-[0.32px] text-black">Över 50 000 flyttar med oss varje år. Därför får du rabatter vi har förhandlat fram.</p>
    </div>
    <div className="flex items-center gap-[10px]">
      <Shield />
      <p className="text-[12px] leading-[14.4px] font-bold tracking-[0.32px] text-black">Inga bindningstider. Inga dolda avgifter.</p>
    </div>
  </div>
)

const Radio = ({ on }: { on: boolean }) => (
  <span className="flex size-11 shrink-0 items-center justify-center">
    <span className={clsx('size-[22px] rounded-full bg-white transition-[border] duration-200', on ? 'border-[7px] border-[#51C8B4]' : 'border-[2.4px] border-[#9F9FA1]')} />
  </span>
)

const Price = ({ value, size, tone }: { value: number; size: 'card' | 'row' | 'foot'; tone: 'mint' | 'navy' }) => {
  const color = tone === 'mint' ? 'text-[#51C8B4]' : 'text-[#214766]'
  const sizes = {
    card: ['pr-[6px] text-[24px] leading-[28.8px] tracking-[-1px]', 'text-[32px] leading-[38.4px] tracking-[-1px]', 'text-[14px] leading-[16.8px] tracking-[-1px]'],
    row: ['pr-[4px] text-[14px] leading-[17px] tracking-[-0.5px]', 'text-[20px] leading-6 tracking-[-1px]', 'text-[12px] leading-[14px] tracking-[-0.5px]'],
    foot: ['pr-[4px] text-[14px] leading-[17px] tracking-[-0.5px]', 'text-[22px] leading-[26px] tracking-[-1px]', 'text-[12px] leading-[14px] tracking-[-0.5px]'],
  }[size]
  return (
    <span className={clsx('flex items-baseline font-bold whitespace-nowrap', color)}>
      <span className={sizes[0]}>ca</span>
      <span className={sizes[1]}>{new Intl.NumberFormat('sv-SE').format(value)} kr</span>
      <span className={sizes[2]}>/mån</span>
    </span>
  )
}

const RecommendedCard = ({ s, set }: ScreenProps) => {
  const o = offerById(RECOMMENDED)
  const on = s.selected === RECOMMENDED
  return (
    <div
      className={clsx(
        'flex flex-col overflow-clip rounded-[10px] border-2 bg-white shadow-[0_4px_8px_#00000014] transition-[border-color] duration-200',
        on ? 'border-[#51C8B4]' : 'border-white',
      )}
    >
      <button
        type="button"
        onClick={() => set({ selected: RECOMMENDED })}
        aria-pressed={on}
        className={clsx('flex min-h-[42px] items-center justify-between bg-[#ECF9F7] px-[20px] py-[10px] text-left', press, 'active:scale-100')}
      >
        <span className="text-[14px] leading-[18px] font-bold tracking-[0.32px] text-[#1F6156]">Lägst pris för din bostad</span>
        {on ? <CheckCircle /> : <span className="size-[22px] rounded-full border-[2.4px] border-[#9F9FA1] bg-white" />}
      </button>
      <div role="presentation" onClick={() => set({ selected: RECOMMENDED })} className="cursor-pointer">
        <div className="flex px-[16px]">
          <div className="flex flex-1 flex-wrap items-center justify-between gap-[10px] border-b border-[#F2F2EF] py-[20px]">
            <Logo src={o.logo} alt={o.name} className="h-12 w-[160px]" />
            <span className={clsx('rounded-[8px] bg-[#DCEFFF] px-[15px] py-[10px] text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>{o.kind}</span>
          </div>
        </div>
        <div className="flex items-start justify-between gap-[8px] p-[20px]">
          <div className="flex flex-col items-start gap-[6px]">
            <span className="rounded-[8px] bg-[#9EE0D5] px-[15px] py-[10px] text-[14px] leading-[18px] font-bold tracking-[0.32px] whitespace-nowrap text-[#1F6156]">
              Rabatt i 12 mån
            </span>
            <span className={clsx('pt-[5px] text-[14px] leading-[18px] tracking-[0.32px]', navy)}>ingen bindningstid</span>
          </div>
          <div className="flex flex-col items-end">
            <span className={clsx('pb-[5px] text-[12px] leading-[18px] tracking-[0.32px]', navy)}>Uppskattad kostnad</span>
            <span className="pt-[4px]">
              <Price value={priceFor(o, s.kwh)} size="card" tone="mint" />
            </span>
            <span className="pt-[5px] text-[10px] leading-[18px] tracking-[0.32px] text-[#767678]">Inkl. moms · Elnät tillkommer</span>
          </div>
        </div>
        <div className="flex px-[20px] pb-[20px]">
          <div className="flex flex-1 flex-col rounded-[8px] bg-[#ECF9F7] p-[15px]">
            <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>ca 890 kr rabatt första året</span>
            <span className="text-[12px] leading-[18px] tracking-[0.32px] text-[#767678]">−8,75 öre/kWh + 0 kr i månadsavgift (ord. 39 kr)</span>
          </div>
        </div>
      </div>
      {s.readMore && (
        <div className="flex flex-col gap-[8px] px-[20px] pb-[15px] motion-safe:animate-[rise_.3s_ease-out_both]">
          <p className={clsx('text-[16px] leading-[20px] font-bold', navy)}>{o.about.header}</p>
          <p className={clsx('text-[14px] leading-[20px]', navy)}>{o.about.description}</p>
          <p className={clsx('pt-[8px] text-[14px] leading-[20px] font-bold', navy)}>Fördelar</p>
          <ul className="flex flex-col gap-[8px]">
            {o.about.benefits.map((b) => (
              <li key={b} className={clsx('flex items-center gap-[10px] text-[14px] leading-[18px]', navy)}>
                <CheckCircle size={18} stroke={1.8} />
                {b}
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-expanded={s.readMore}
        onClick={() => set({ readMore: !s.readMore })}
        className={clsx('flex h-11 shrink-0 items-center justify-center px-[20px] pb-[10px]', press)}
      >
        <span className="text-[15px] leading-[18px] font-bold tracking-[0.32px] text-[#112E46]">Läs mer</span>
        <ChevronDown up={s.readMore} />
      </button>
    </div>
  )
}

const others = OFFERS.filter((o) => o.id !== RECOMMENDED)

const Compare = ({ s, set }: ScreenProps) => {
  if (!s.compareOpen)
    return (
      <button
        type="button"
        aria-expanded={false}
        onClick={() => set({ compareOpen: true })}
        className={clsx('flex min-h-14 items-center gap-[12px] rounded-[10px] bg-white py-[12px] pr-[15px] pl-[20px] text-left shadow-[0_4px_8px_#00000014]', press)}
      >
        <span className="flex flex-1 flex-col gap-[8px]">
          <span className="text-[15px] leading-[18px] font-bold tracking-[0.32px] text-[#112E46]">Jämför med 3 andra elavtal</span>
          <span className="flex items-center gap-[14px] opacity-75">
            <Logo src="/images/el-demo/fortum.svg" alt="Fortum" className="h-[14px] w-14" />
            <Logo src="/images/el-demo/vattenfall.svg" alt="Vattenfall" className="h-[10px] w-16" />
            <Logo src="/images/el-demo/tibber.svg" alt="Tibber" className="h-[14px] w-10" />
          </span>
        </span>
        <span className="flex size-11 shrink-0 items-center justify-center">
          <ChevronDown />
        </span>
      </button>
    )
  return (
    <div id="el-compare" className="flex scroll-mt-[16px] flex-col gap-[10px]">
      <button type="button" aria-expanded onClick={() => set({ compareOpen: false })} className={clsx('flex min-h-11 items-center justify-between pl-[2px] text-left', press)}>
        <span className="text-[15px] leading-[18px] font-bold tracking-[0.32px] text-[#112E46]">Jämför med 3 andra elavtal</span>
        <span className="flex size-11 shrink-0 items-center justify-center">
          <ChevronDown up />
        </span>
      </button>
      {others.map((o, i) => {
        const on = s.selected === o.id
        return (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={on}
            onClick={() => set({ selected: o.id })}
            style={{ animationDelay: `${i * 40}ms` }}
            className={clsx(
              'flex items-center gap-[12px] rounded-[10px] border-2 bg-white py-[13px] pr-[13px] pl-[18px] text-left shadow-[0_4px_8px_#00000014] motion-safe:animate-[rise_.3s_ease-out_both]',
              on ? 'border-[#51C8B4]' : 'border-white',
              press,
            )}
          >
            <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
              <Logo src={o.logo} alt={o.name} className="h-6 w-[100px]" />
              <span className="text-[12px] leading-[16px] tracking-[0.32px] text-[#767678]">{o.compareSub}</span>
            </span>
            <Price value={priceFor(o, s.kwh)} size="row" tone={o.hasDiscount ? 'mint' : 'navy'} />
            <Radio on={on} />
          </button>
        )
      })}
    </div>
  )
}

const TYPES: HomeType[] = ['Lägenhet', 'Radhus', 'Villa']

const HomeEditor = ({ s, set }: ScreenProps) => {
  const [kvmDraft, setKvmDraft] = useState(String(s.kvm))
  return (
    <div className="flex flex-col rounded-[16px] bg-white p-[20px]">
      <div className="flex items-center gap-[8px] pb-[12px]">
        <Logo src="/images/el-demo/adress.svg" alt="" className="size-8" />
        <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>Adress</span>
      </div>
      <FramedField label="Adress">
        <input aria-label="Adress" className={fieldInput} defaultValue={`${HOME.street}, ${HOME.zip} ${HOME.city}`} />
      </FramedField>
      <div className="my-[20px] h-px shrink-0 bg-[#21476633] opacity-50" />
      <div className="flex items-center gap-[8px] pb-[12px]">
        <Logo src="/images/el-demo/boarea.svg" alt="" className="size-8" />
        <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>Storlek på bostaden</span>
      </div>
      <FramedField label="Boarea">
        <input
          aria-label="Boarea"
          inputMode="numeric"
          className={fieldInput}
          value={kvmDraft}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, '').slice(0, 4)
            setKvmDraft(v)
            const n = Number(v)
            if (n >= 10) set({ kvm: n, kwh: kwhFor(s.homeType ?? 'Lägenhet', n) })
          }}
        />
        <span className="text-[15px] leading-[18px] text-[#767678]">kvm</span>
      </FramedField>
      <div className="my-[20px] h-px shrink-0 bg-[#21476633] opacity-50" />
      <div className="flex items-center gap-[8px] pb-[12px]">
        <Logo src="/images/el-demo/bostadstyp.svg" alt="" className="size-8" />
        <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>Bostadstyp</span>
      </div>
      <div className="flex gap-[10px]" role="radiogroup" aria-label="Bostadstyp">
        {TYPES.map((t) => {
          const on = s.homeType === t
          return (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={on}
              onClick={() => set({ homeType: t, kwh: kwhFor(t, s.kvm), editHome: false })}
              className={clsx(
                'flex h-12 min-w-0 flex-1 items-center justify-center rounded-[8px] border',
                on ? 'border-[#214766] bg-[#DCEFFF]' : 'border-[#21476633] bg-white',
                press,
              )}
            >
              <span className={clsx('text-[15px] leading-[18px] tracking-[0.32px]', navy, on && 'font-bold')}>{t}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

const HomeCard = ({ s, set }: ScreenProps) => (
  <div className="relative flex flex-col rounded-[16px] bg-[#4C96D0] py-[15px] pr-[15px] pl-[20px]">
    <p className="pb-[10px] text-[18px] leading-[18px] font-bold tracking-[0.32px] text-white">Din bostad</p>
    <p className="flex items-center gap-[8px] pb-[4px] text-[15px] leading-[18px] font-bold tracking-[0.32px] text-white">
      <Pin />
      {HOME.street}
    </p>
    <p className="flex items-center gap-[8px] text-[15px] leading-[18px] font-bold tracking-[0.32px] text-white">
      <Logo src="/images/el-demo/boarea-vit.svg" alt="" className="h-[17px] w-[16px]" />
      {s.kvm} kvm
    </p>
    <p className="flex items-center gap-[8px] pt-[4px] text-[15px] leading-[18px] font-bold tracking-[0.32px] text-white">
      <House />
      {s.homeType}
    </p>
    <button
      type="button"
      aria-label="Ändra bostad"
      onClick={() => set({ editHome: true })}
      className={clsx('absolute top-[9px] right-[9px] flex size-11 items-center justify-center rounded-full', press)}
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-white">
        <Pen />
      </span>
    </button>
  </div>
)

const Consumption = ({ s, set }: ScreenProps) => {
  const [draft, setDraft] = useState(String(s.kwh))
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => setDraft(String(s.kwh)), [s.kwh])
  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )
  return (
    <div className="mt-[-10px] flex items-center justify-between gap-[12px] rounded-[16px] bg-white p-[20px]">
      <div className="flex flex-col gap-[4px]">
        <span className={clsx('text-[13px] leading-[16px] font-bold tracking-[0.32px]', navy)}>Beräknad elförbrukning</span>
        <span className="text-[11px] leading-[14px] tracking-[0.32px] text-[#2B567C]">Justera för mer exakt pris.</span>
      </div>
      <label className="flex items-end gap-[6px]">
        <span className="w-[70px] shrink-0 border-b-2 border-dashed border-[#3879AD] pb-[5px]">
          <input
            aria-label="Beräknad elförbrukning i kWh per år"
            inputMode="numeric"
            value={draft}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, 5)
              setDraft(v)
              /* Räknas om först när kunden slutat skriva, inte vid varje siffra. */
              if (timer.current) clearTimeout(timer.current)
              timer.current = setTimeout(() => {
                const n = Number(v)
                if (n >= 500) set({ kwh: n })
              }, 700)
            }}
            className="w-full bg-transparent text-center text-[22px]! leading-[26px]! font-bold! text-[#3879AD] outline-none"
          />
        </span>
        <span className="pb-[7px] text-[13px] leading-[16px] font-bold text-[#3879AD]">kWh/år</span>
      </label>
    </div>
  )
}

export const PriserScreen = (p: ScreenProps) => {
  const { s, go } = p
  const chosen = offerById(s.selected)
  if (!s.homeType)
    return (
      <>
        <div className="flex flex-col gap-[20px] px-[20px] pt-[15px] pb-10">
          <Steps n={1} />
          <Intro />
          <HomeEditor {...p} />
          <div className="flex flex-col gap-[20px]">
            <div className="flex items-center gap-[10px]">
              <Shield />
              <p className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>fyll i informationen om din bostad för att se ditt pris</p>
            </div>
            <div aria-hidden className="flex flex-col gap-[12px] rounded-[10px] bg-white p-[20px] opacity-60 shadow-[0_4px_8px_#00000014]">
              <div className="flex items-center justify-between">
                <Logo src="/images/el-demo/skekraft.svg" alt="" className="h-9 w-[120px] opacity-50" />
                <span className="h-[38px] w-24 rounded-[8px] bg-[#EEEEF0]" />
              </div>
              <div className="flex items-center justify-between">
                <span className="h-[38px] w-[130px] rounded-[8px] bg-[#EEEEF0]" />
                <span className="text-[32px] leading-[38px] font-bold tracking-[-1px] text-[#BEBEC0]">– kr</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  return (
    <>
      <div className="flex flex-col gap-[20px] px-[20px] pt-[15px] pb-6">
        <Steps n={1} />
        <Intro />
        <RecommendedCard {...p} />
        <Compare {...p} />
        {s.editHome ? <HomeEditor {...p} /> : <HomeCard {...p} />}
        <Consumption {...p} />
      </div>
      <Foot className="!flex-row items-center !gap-[12px]">
        <div className="flex min-w-0 flex-1 flex-col">
          <span className={clsx('truncate text-[12px] leading-[18px] tracking-[0.32px]', navy)}>{chosen.name}</span>
          <Price value={priceFor(chosen, s.kwh)} size="foot" tone={chosen.hasDiscount ? 'mint' : 'navy'} />
        </div>
        <button
          type="button"
          onClick={() => go(3)}
          className={clsx(
            'flex h-12 min-w-[180px] items-center justify-center gap-[10px] rounded-full border-2 border-[#214766] bg-[#214766] py-[10px] pr-6 pl-8 hover:bg-[#112E46]',
            press,
          )}
        >
          <span className="text-[16px] leading-[18.4px] font-bold tracking-[0.32px] whitespace-nowrap text-white">Välj elavtal</span>
          <ArrowRight />
        </button>
      </Foot>
    </>
  )
}

/* ---------- Skärm 2 · Detaljer ---------- */

const OfferHead = ({ id, pill }: { id: OfferId; pill: 14 | 16 }) => {
  const o = offerById(id)
  return (
    <div className="flex items-center justify-between gap-[8px] border-b border-[#F8FAF9] pb-[20px]">
      <Logo src={o.logo} alt={o.name} className="h-9 w-[120px]" />
      <span
        className={clsx(
          'rounded-[8px] bg-[#DCEFFF] px-[15px] py-[10px] leading-[18px] font-bold tracking-[0.32px] whitespace-nowrap',
          navy,
          pill === 16 ? 'text-[16px]' : 'text-[14px]',
        )}
      >
        {o.kind}
      </span>
    </div>
  )
}

const Label = ({ children, help, onHelp }: { children: React.ReactNode; help?: boolean; onHelp?: () => void }) => (
  <div className="flex items-center justify-between pt-[20px] pb-[15px]">
    <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>{children}</span>
    {onHelp && (
      <button type="button" aria-label="Mer information" aria-expanded={help} onClick={onHelp} className="-my-[10px] flex h-11 w-11 shrink-0 items-center justify-end">
        <Help />
      </button>
    )}
  </div>
)

const HelpText = ({ children }: { children: React.ReactNode }) => (
  <p className={clsx('rounded-[8px] bg-[#E8F0F8] px-[15px] py-[10px] text-[14px] leading-[18px] motion-safe:animate-[rise_.25s_ease-out_both]', navy)}>{children}</p>
)
const ErrorLine = ({ children }: { children: React.ReactNode }) => <p className="pt-[6px] text-[12px] leading-[16px] text-[#F25A43]">{children}</p>

const DateInput = ({ value, onChange, label, error, onHelp }: { value: string; onChange: (v: string) => void; label: string; error?: boolean; onHelp?: () => void }) => (
  <FramedField label={label} tone="date" error={error}>
    {/* Datumet skrivs som i Paper (2026-10-30) oavsett webbläsarens språk. Det riktiga datumfältet ligger osynligt ovanpå och öppnar kalendern. */}
    <span className="relative flex h-full min-w-0 flex-1 items-center">
      <span className={clsx('text-[16px] leading-[18px] tracking-[0.32px]', navy)}>{value}</span>
      <input
        type="date"
        aria-label={label}
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        onClick={(e) => {
          try {
            e.currentTarget.showPicker?.()
          } catch {
            // Äldre webbläsare saknar showPicker, då öppnar fältet sig självt
          }
        }}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      />
    </span>
    {onHelp ? (
      <button type="button" aria-label="Om startdatum" onClick={onHelp} className="-mr-[10px] flex size-11 shrink-0 items-center justify-center">
        <Help />
      </button>
    ) : null}
  </FramedField>
)

export const detailsValid = (s: ElState) => {
  const st = dateStatus(s.startDate)
  const dateOk = st === 'ok' || (st === 'facility' && /^735999\d{12}$/.test(s.facilityId))
  return dateOk && /^\d{4}$/.test(s.apartment) && (!s.terminate || !!s.endDate)
}

export const DetaljerScreen = ({ s, set, go }: ScreenProps) => {
  const st = dateStatus(s.startDate)
  const suggestion = firstPossible()
  const valid = detailsValid(s)
  const [aptBlurred, setAptBlurred] = useState(false)
  const aptError = (s.touched || aptBlurred) && !/^\d{4}$/.test(s.apartment)
  const facilityError =
    st === 'facility' && (s.touched || s.facilityId.length >= 18)
      ? !s.facilityId.startsWith('735999')
        ? "AnlägginingsID måste börja med '735999'"
        : s.facilityId.length !== 18
          ? 'AnlägginingsID måste vara 18 siffror.'
          : null
      : null
  return (
    <>
      <div className="flex flex-col px-[20px] pt-[15px] pb-6">
        <Steps n={2} />
        <Title onBack={() => go(0)}>Detaljer</Title>
        <div className="flex flex-col rounded-[10px] bg-white p-[20px] shadow-[0_4px_8px_#00000014]">
          <OfferHead id={s.selected} pill={16} />
          <Label>Välj startdatum för ditt nya elavtal</Label>
          <div className="flex flex-col gap-[10px]">
            <DateInput
              label="Välj datum"
              value={s.startDate}
              error={st === 'early' || (s.touched && st === 'empty')}
              onChange={(v) => set({ startDate: v })}
              onHelp={() => set({ dateHelp: !s.dateHelp })}
            />
            {s.dateHelp && <HelpText>Du kan välja ett datum inom 7 dagar, om du har din nya bostads anläggningsID.</HelpText>}
            {st === 'early' && (
              <div className="flex flex-col gap-[12px] rounded-[8px] bg-[#ECF9F7] px-[20px] py-[15px] text-[#123A33] motion-safe:animate-[rise_.3s_ease-out_both]">
                <p className="text-[15px] leading-[18px] font-bold tracking-[0.32px]">Behöver du el inom 3 arbetsdagar?</p>
                <p className="text-[15px] leading-[18px] tracking-[0.32px]">
                  Vi hinner tyvärr inte ordna elavtal som startar inom 3 arbetsdagar. Välj ett senare datum, eller ring oss så hjälper vi dig.
                </p>
                <button
                  type="button"
                  onClick={() => set({ startDate: suggestion })}
                  className={clsx('flex h-12 shrink-0 items-center justify-center rounded-full border-2 border-[#214766] bg-white hover:bg-[#F8FAF9]', press)}
                >
                  <span className={clsx('text-[16px] leading-[18.4px] font-bold tracking-[0.32px]', navy)}>Välj {suggestion}</span>
                </button>
                <div className="flex flex-col gap-[2px] text-[15px] leading-[18px] tracking-[0.32px]">
                  <p className="font-bold">Kontakta kundtjänst direkt:</p>
                  <p>
                    Telefon:{' '}
                    <a href="tel:0812008822" className="text-[#123A33]! no-underline! hover:underline!">
                      08-12 00 88 22
                    </a>{' '}
                    (vardagar 9:00-17:00)
                  </p>
                  <p>
                    E-post:{' '}
                    <a href="mailto:hej@flyttsmart.se" className="text-[#123A33]! no-underline! hover:underline!">
                      hej@flyttsmart.se
                    </a>
                  </p>
                </div>
              </div>
            )}
          </div>
          {st === 'facility' && (
            <>
              <Label>Fyll i bostadens anläggningsID</Label>
              <FramedField label="AnläggningsID" error={!!facilityError}>
                <input
                  aria-label="AnläggningsID"
                  inputMode="numeric"
                  className={fieldInput}
                  value={s.facilityId}
                  onChange={(e) => set({ facilityId: e.target.value.replace(/\D/g, '').slice(0, 18) })}
                />
              </FramedField>
              {facilityError ? (
                <ErrorLine>{facilityError}</ErrorLine>
              ) : (
                <p className="pt-[6px] text-[12px] leading-[16px] text-[#767678]">
                  Välj ett startdatum senare än 7 arbetsdagar från idag, så behöver du inte fylla i anläggningsID.
                </p>
              )}
            </>
          )}
          <Label help={s.aptHelp} onHelp={() => set({ aptHelp: !s.aptHelp })}>
            Fyll i bostadens lägenhetsnummer
          </Label>
          {s.aptHelp && (
            <div className="pb-[16px]">
              <HelpText>Ett lägenhetsnummer består av fyra siffror och används av Skatteverket för att identifiera lägenheter.</HelpText>
            </div>
          )}
          <FramedField label="Lägenhetsnummer" error={aptError}>
            <input
              aria-label="Lägenhetsnummer"
              inputMode="numeric"
              className={fieldInput}
              value={s.apartment}
              onBlur={() => setAptBlurred(true)}
              onChange={(e) => set({ apartment: e.target.value.replace(/\D/g, '').slice(0, 4) })}
            />
          </FramedField>
          {aptError && <ErrorLine>Lägenhetsnumret måste vara 4 siffror</ErrorLine>}
        </div>
        <div className="mt-[16px] flex flex-col rounded-[10px] bg-white p-[20px] shadow-[0_4px_8px_#00000014]">
          <label className="flex cursor-pointer items-start gap-[8px]">
            <input type="checkbox" className="peer sr-only" checked={s.terminate} onChange={(e) => set({ terminate: e.target.checked, endDate: s.endDate || s.startDate })} />
            <span className="ml-[-13px] flex h-6 w-11 shrink-0 items-start justify-center pt-px peer-focus-visible:[&>span]:ring-2 peer-focus-visible:[&>span]:ring-[#3879AD]">
              <span
                className={clsx(
                  'flex size-[18.4px] items-center justify-center rounded-[4px] transition-colors duration-150',
                  s.terminate ? 'bg-[#51C8B4]' : 'border-[2.4px] border-[#9F9FA1] bg-white',
                )}
              >
                {s.terminate && (
                  <svg width="12" height="9" viewBox="0 0 14 10" aria-hidden>
                    <path d="M1.5 5.2l3.6 3.3L12.5 1.5" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </span>
            <span className={clsx('ml-[-13px] flex-1 text-[16px] leading-[20px] tracking-[0.32px]', navy)}>Säg upp mitt nuvarande elavtal åt mig i samband med nyteckningen.</span>
          </label>
          {s.terminate && (
            <div className="flex flex-col motion-safe:animate-[rise_.3s_ease-out_both]">
              <Label>Välj datum då elavtalet avslutas</Label>
              <DateInput label="Välj datum" value={s.endDate} error={s.touched && !s.endDate} onChange={(v) => set({ endDate: v })} />
              <Label>Adress - nuvarande elavtal</Label>
              <FramedField label="Adress">
                <input aria-label="Adress - nuvarande elavtal" className={fieldInput} value={s.oldAddress} onChange={(e) => set({ oldAddress: e.target.value })} />
              </FramedField>
              <p className="pt-[12px] text-[12px] leading-[16px] text-[#767678]">
                Notera att vi kan bara hjälpa dig med uppsägningen om det är du personligen som står på elavtalet.
              </p>
            </div>
          )}
        </div>
      </div>
      <Foot>
        <button
          type="button"
          aria-disabled={!valid}
          onClick={() => (valid ? go(5) : set({ touched: true }))}
          className={clsx(
            'flex h-12 shrink-0 items-center justify-center gap-[10px] rounded-full border-2',
            valid ? 'border-[#214766] bg-[#214766] text-white hover:bg-[#112E46]' : 'border-[#EEEEF0] bg-[#EEEEF0] text-[#BEBEC0]',
            press,
          )}
        >
          <span className="text-[16px] leading-[18.4px] font-bold tracking-[0.32px]">Fortsätt</span>
          <ArrowRight size={18} width={1.6} />
        </button>
      </Foot>
    </>
  )
}

/* ---------- Skärm 3 · Sammanfattning ---------- */

const Row = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between gap-[12px] border-b border-[#3879AD33] py-[15px]">
    <span className={clsx('text-[16px] leading-[18px] tracking-[0.32px]', navy)}>{label}</span>
    <span className={clsx('text-right text-[16px] leading-[18px] font-bold tracking-[0.32px]', navy)}>{value}</span>
  </div>
)

const BlockRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-col border-b border-[#3879AD33] py-[15px]">
    <span className={clsx('pb-[4px] text-[16px] leading-[18px] font-bold tracking-[0.32px]', navy)}>{label}</span>
    <span className={clsx('text-[16px] leading-[18px] tracking-[0.32px]', navy)}>{value}</span>
  </div>
)

const BankIdIcon = ({ color = '#FFFFFF' }: { color?: string }) => (
  <span
    aria-hidden
    className="h-[22px] w-[25px] shrink-0"
    style={{
      backgroundColor: color,
      WebkitMask: 'url(/images/el-demo/bankid-vit.svg) center / 100% 100% no-repeat',
      mask: 'url(/images/el-demo/bankid-vit.svg) center / 100% 100% no-repeat',
    }}
  />
)

export const SammanfattningScreen = ({ s, set, go }: ScreenProps) => {
  const o = offerById(s.selected)
  const missing = s.showMissing && !s.accepted
  return (
    <>
      <div className="flex flex-col px-[20px] pt-[15px] pb-6">
        <Steps n={3} />
        <Title onBack={() => go(3)}>Sammanfattning</Title>
        <div className="flex flex-col rounded-[10px] bg-white p-[20px] shadow-[0_4px_8px_#00000014]">
          <OfferHead id={s.selected} pill={14} />
          <div className="flex items-center justify-between pt-[20px] pb-[5px]">
            <div role="heading" aria-level={2} className={clsx('text-[20px] leading-[22px] font-bold tracking-[0.32px]', navy)}>
              Bokningsdetaljer
            </div>
            <button type="button" aria-label="Ändra detaljer" onClick={() => go(3)} className={clsx('flex size-11 shrink-0 items-center justify-end', press)}>
              <PenLarge />
            </button>
          </div>
          <Row label="Uppskattad kostnad" value={`ca ${new Intl.NumberFormat('sv-SE').format(priceFor(o, s.kwh))} kr/mån`} />
          {o.discountRow && <Row label={o.discountRow.label} value={o.discountRow.value} />}
          <Row label="Bindningstid" value="Ingen" />
          <Row label="Startdatum - nytt elavtal" value={s.startDate} />
          <BlockRow label="Adress - nytt elavtal" value={`${HOME.street}, lgh ${s.apartment || '1102'}, ${HOME.zip} ${HOME.city}`} />
          {s.terminate && (
            <>
              <Row label="Slutdatum - nuvarande elavtal" value={s.endDate} />
              <BlockRow label="Adress - nuvarande elavtal" value={s.oldAddress} />
            </>
          )}
          <button
            type="button"
            aria-expanded={s.specOpen}
            onClick={() => set({ specOpen: !s.specOpen })}
            className={clsx('flex h-11 shrink-0 items-center justify-between pt-[10px] text-left', press)}
          >
            <span className="text-[15px] leading-[18px] font-bold tracking-[0.32px] text-[#112E46]">Prisspecifikation</span>
            <ChevronDown up={!s.specOpen} />
          </button>
          {s.specOpen && (
            <div className={clsx('mt-[20px] flex flex-col gap-[10px] rounded-[8px] bg-[#E8F0F8] p-[20px] motion-safe:animate-[rise_.25s_ease-out_both]', navy)}>
              <p className="text-[14px] leading-[18px] font-bold tracking-[0.32px]">Din elkostnad varierar</p>
              <p className="text-[14px] leading-[18px] tracking-[0.32px]">Kostnaden beror på elpris, inköpskostnader och din förbrukning. Elnätskostnad tillkommer.</p>
            </div>
          )}
        </div>
        <label id="el-terms" className="flex scroll-mt-24 cursor-pointer items-start gap-[10px] pt-[30px] pb-6">
          <input type="checkbox" className="peer sr-only" checked={s.accepted} onChange={(e) => set({ accepted: e.target.checked })} />
          <span
            className={clsx(
              'mt-[1px] flex size-[18.4px] shrink-0 items-center justify-center rounded-[4px] transition-colors duration-150 peer-focus-visible:ring-2 peer-focus-visible:ring-[#3879AD]',
              s.accepted ? 'bg-[#51C8B4]' : clsx('border-[2.4px] bg-white', missing ? 'border-[#F25A43]' : 'border-[#9F9FA1]'),
            )}
          >
            {s.accepted && (
              <svg width="12" height="9" viewBox="0 0 14 10" aria-hidden>
                <path d="M1.5 5.2l3.6 3.3L12.5 1.5" fill="none" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </span>
          <span className={clsx('flex-1 text-[14px] leading-[18px]', navy)}>
            {o.terms.map((seg, i) => (
              <span key={i} className={seg.b ? 'font-bold text-[#51C8B4]' : undefined}>
                {i > 0 ? ' ' : ''}
                {seg.t}
              </span>
            ))}
          </span>
        </label>
        <div className={clsx('rounded-[8px] bg-[#ECF9F7] py-[15px] pr-[15px] pl-[25px] text-[15px] leading-[18px]', navy)}>
          Avtalet tecknas direkt med {o.name} och gäller tillsvidare. Du har alltid <span className="font-bold text-[#51C8B4]">14 dagars ångerrätt.</span>
        </div>
        <div className="flex flex-col gap-[12px] px-[2px] pt-[5px]">
          <p className={clsx('text-[17px] leading-[22px] font-bold', navy)}>Ett bra val</p>
          <p className={clsx('flex items-center gap-[12px] text-[15px] leading-[20px]', navy)}>
            <CheckCircle stroke={1.8} />
            Obunden. Ingen bindningstid, byt när du vill
          </p>
          <p className={clsx('flex items-center gap-[12px] text-[15px] leading-[20px]', navy)}>
            <CheckCircle stroke={1.8} />
            {s.selected === RECOMMENDED ? 'Vårt bästa pris, med förhandlad rabatt' : 'Med förhandlad rabatt'}
          </p>
        </div>
      </div>
      <Foot>
        {missing && (
          <p role="alert" className="text-center text-[12px] leading-[16px] tracking-[0.32px] text-[#F25A43]">
            Kryssa i rutan för villkoren för att fortsätta
          </p>
        )}
        <button
          type="button"
          onClick={() => (s.accepted ? go(7) : set({ showMissing: true }))}
          className={clsx('flex h-12 shrink-0 items-center justify-center gap-[10px] rounded-full border-2 border-[#214766] bg-[#214766] hover:bg-[#112E46]', press)}
        >
          <BankIdIcon />
          <span className="text-[16px] leading-[18.4px] font-bold tracking-[0.32px] text-white">Teckna elavtal</span>
        </button>
        <p className="flex items-center justify-center gap-[6px]">
          <Lock />
          <span className="text-[13px] leading-[16px] text-[#4A6378]">Du signerar säkert med BankID</span>
        </p>
      </Foot>
    </>
  )
}

/* ---------- BankID och Klart (texterna från flyttsmart-next live) ---------- */

export const BankIdScreen = ({ go }: ScreenProps) => {
  const [signing, setSigning] = useState(false)
  useEffect(() => {
    if (!signing) return
    const t = setTimeout(() => go(8), 1800)
    return () => clearTimeout(t)
  }, [signing, go])
  return (
    <div className="flex flex-1 flex-col items-center px-[20px] pt-12 pb-10 text-center">
      <div role="heading" aria-level={1} className={clsx('pb-[12px] text-[24px] leading-[30px] font-bold tracking-[0.32px]', navy)}>
        Signera med BankID
      </div>
      <p className={clsx('pb-10 text-[16px] leading-[20px]', navy)}>Starta din BankID-applikation på din mobil.</p>
      <span
        aria-label={signing ? 'Väntar på BankID' : undefined}
        role={signing ? 'status' : undefined}
        className={clsx('mb-10 size-12 rounded-full border-4 border-[#DCEFFF] border-t-[#51C8B4]', 'motion-safe:animate-spin')}
      />
      <button
        type="button"
        disabled={signing}
        onClick={() => setSigning(true)}
        className={clsx('flex h-12 items-center justify-center gap-[10px] rounded-full border-2 border-[#214766] bg-white px-[52px] disabled:opacity-60', press)}
      >
        <BankIdIcon color="#000000" />
        <span className={clsx('text-[16px] leading-[18.4px] font-bold tracking-[0.32px]', navy)}>Starta BankID</span>
      </button>
      <button type="button" onClick={() => go(5)} className={clsx('mt-[16px] flex h-11 items-center px-[16px]', press)}>
        <span className={clsx('text-[16px] font-bold underline underline-offset-4', navy)}>Avbryt</span>
      </button>
    </div>
  )
}

export const KlartScreen = ({ s }: ScreenProps) => {
  const o = offerById(s.selected)
  const rows: [string, string][] = [
    ['Elavtal', o.choice],
    ['Startdatum', longDate(s.startDate)],
    ...(o.id === 'skekraft'
      ? ([
          ['Månadsavgiftsrabatt i 12 månader', '-39 kr/mån'],
          ['Elprisrabatt i 12 månader', '-8,75 öre/kWh'],
        ] as [string, string][])
      : []),
    ['Adress', `${HOME.street}, ${HOME.zip} ${HOME.city}`],
  ]
  return (
    <div className="flex flex-1 flex-col px-[16px] pt-6 pb-10">
      <div className="flex flex-col items-center rounded-[16px] bg-white p-[20px] shadow-[0_4px_8px_#00000014] motion-safe:animate-[rise_.4s_ease-out_both]">
        <div role="heading" aria-level={1} className={clsx('pb-6 text-center text-[24px] leading-[28px] font-black', navy)}>
          Grattis till ett aktivt val av<span className="text-[#51C8B4]"> elavtal!</span>
        </div>
        <div className="h-px w-full bg-[#E1E1E3]" />
        <p className={clsx('py-6 text-center text-[15px] font-bold', navy)}>Vi har tagit emot din beställning av elavtal från {o.name}.</p>
        <div className="flex w-full flex-col">
          {rows.map(([l, v]) => (
            <div key={l} className="flex items-center justify-between gap-[12px] border-b border-[#EEEEF0] py-[12px]">
              <span className={clsx('text-[15px] font-bold', navy)}>{l}</span>
              <span className={clsx('text-right text-[15px] whitespace-nowrap', navy)}>{v}</span>
            </div>
          ))}
        </div>
        <p className={clsx('w-full pt-[20px] text-left text-[15px]', navy)}>Du får en bekräftelse per mejl inom kort, med information om vad som händer nu.</p>
        <Link href="/demo/movepage" className={clsx('mt-6 flex h-12 items-center justify-center rounded-full border-2 border-[#214766] bg-white px-10 no-underline!', press)}>
          <span className={clsx('text-[16px] font-bold', navy)}>Till flyttsidan</span>
        </Link>
      </div>
    </div>
  )
}
