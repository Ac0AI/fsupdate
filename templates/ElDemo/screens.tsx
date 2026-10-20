'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { clsx } from 'clsx'
import {
  HOME,
  OFFERS,
  RECOMMENDED,
  compareLevel,
  previousMonthName,
  PRICE_SPEC,
  SPOT_ORE,
  CERT_ORE,
  priceSpecTotals,
  savings,
  kwhDiscountFor,
  type CompareLevel,
  type Offer,
  compareNote,
  comparePrice,
  formatOre,
  dateStatus,
  firstPossible,
  kwhFor,
  longDate,
  offerById,
  priceFor,
  type HomeType,
  type OfferId,
} from './data'
import { ArrowRight, CheckCircle, ChevronDown, FramedField, Foot, Help, Logo, Pin, Shell, Shield, Steps, Title, fieldInput, press } from './ui'

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
  specOpen: boolean
  dateHelp: boolean
  aptHelp: boolean
}

export type ScreenProps = {
  s: ElState
  set: (patch: Partial<ElState>) => void
  go: (step: number) => void
  /** Nätägaren på den nya adressen, null när den saknas (?natagare=0). */
  grid: string | null
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
      <p className="text-[12px] leading-[14.4px] font-bold tracking-[0.32px] text-black">
        Över 50 000 flyttar med oss varje år. Därför får du rabatter du inte hittar någon annanstans.
      </p>
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

const LEVELS: CompareLevel[] = [2000, 5000, 20000]

/**
 * Jämförpris vid alla tre nivåer, som live ProviderDetails (lagkrav). Kundens
 * nivå är fetstilad. Siffrorna är exempel, se comparePrice i data.ts.
 */
const ComparisonTable = ({ o, kwh }: { o: Offer; kwh: number }) => {
  const mine = compareLevel(kwh)
  const month = previousMonthName()
  return (
    <div className={clsx('mt-[8px] flex flex-col rounded-[8px] bg-[#F8FAF9] p-[15px]', navy)}>
      <p className="pb-[4px] text-[15px] leading-[20px] font-bold">Jämförpris – första året</p>
      <p className="pb-[12px] text-[14px] leading-[18px]">{o.hasDiscount ? 'Inklusive moms och kampanjrabatt.' : 'Inklusive moms.'}</p>
      {LEVELS.map((l) => (
        <div
          key={l}
          className={clsx(
            'flex items-center justify-between gap-[12px] border-b border-[#3879AD33] py-[8px] text-[14px] leading-[18px] last-of-type:border-b-0',
            l === mine && 'font-bold',
          )}
        >
          <span>{new Intl.NumberFormat('sv-SE').format(l)} kWh/år</span>
          <span className="whitespace-nowrap">{formatOre(comparePrice(o, l))} öre/kWh</span>
        </div>
      ))}
      <p className="pt-[8px] text-[12px] leading-[16px] text-[#767678] italic">
        {month}, SE3. Månadsavgiften är {o.firstYearFee} kr första året. Elnätskostnad tillkommer.
      </p>
      <p className="pt-[4px] text-[12px] leading-[16px] text-[#767678] italic">Baseras på {month.toLowerCase()} månads elpris. Elnätsavgifter ingår ej.</p>
    </div>
  )
}

const About = ({ o, kwh, className }: { o: Offer; kwh: number; className?: string }) => (
  <div className={clsx('flex flex-col gap-[8px] motion-safe:animate-[rise_.3s_ease-out_both]', className)}>
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
    <ComparisonTable o={o} kwh={kwh} />
  </div>
)

const ReadMoreButton = ({ open, onClick }: { open: boolean; onClick: () => void }) => (
  <button type="button" aria-expanded={open} onClick={onClick} className={clsx('flex h-11 shrink-0 items-center justify-center px-[20px] pb-[10px]', press)}>
    <span className="text-[15px] leading-[18px] font-bold tracking-[0.32px] text-[#112E46]">Läs mer</span>
    <ChevronDown up={open} />
  </button>
)

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
        <div className="flex flex-col gap-[4px] px-[20px] pb-[8px]">
          <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>
            Jämförpris {formatOre(comparePrice(o, compareLevel(s.kwh)))} öre/kWh ({new Intl.NumberFormat('sv-SE').format(compareLevel(s.kwh))} kWh/år)
          </span>
          <span className="text-[12px] leading-[16px] tracking-[0.32px] text-[#767678]">{compareNote(o)}</span>
        </div>
      </div>
      {s.readMore && <About o={o} kwh={s.kwh} className="px-[20px] pb-[15px]" />}
      <ReadMoreButton open={s.readMore} onClick={() => set({ readMore: !s.readMore })} />
    </div>
  )
}

const others = OFFERS.filter((o) => o.id !== RECOMMENDED)

const CompareRow = ({ o, i, s, set }: { o: Offer; i: number; s: ElState; set: ScreenProps['set'] }) => {
  const [open, setOpen] = useState(false)
  const on = s.selected === o.id
  return (
    <div
      style={{ animationDelay: `${i * 40}ms` }}
      className={clsx(
        'flex flex-col rounded-[10px] border-2 bg-white shadow-[0_4px_8px_#00000014] motion-safe:animate-[rise_.3s_ease-out_both]',
        on ? 'border-[#51C8B4]' : 'border-white',
      )}
    >
      <button
        type="button"
        role="radio"
        aria-checked={on}
        onClick={() => set({ selected: o.id })}
        className={clsx('flex items-center gap-[12px] rounded-[8px] py-[13px] pr-[13px] pl-[18px] text-left', press)}
      >
        <span className="flex min-w-0 flex-1 flex-col gap-[6px]">
          <Logo src={o.logo} alt={o.name} className="h-6 w-[100px]" />
          <span className="text-[12px] leading-[16px] tracking-[0.32px] text-[#767678]">{o.compareSub}</span>
          <span className="text-[12px] leading-[16px] tracking-[0.32px] text-[#767678]">Jämförpris {`${formatOre(comparePrice(o, compareLevel(s.kwh)))}\u00a0öre/kWh`}</span>
        </span>
        <Price value={priceFor(o, s.kwh)} size="row" tone={o.hasDiscount ? 'mint' : 'navy'} />
        <Radio on={on} />
      </button>
      {open && <About o={o} kwh={s.kwh} className="px-[18px] pb-[12px]" />}
      <ReadMoreButton open={open} onClick={() => setOpen(!open)} />
    </div>
  )
}

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
      {others.map((o, i) => (
        <CompareRow key={o.id} o={o} i={i} s={s} set={set} />
      ))}
    </div>
  )
}

const TYPES: HomeType[] = ['Lägenhet', 'Radhus', 'Villa']
const fmtNum = (n: number) => new Intl.NumberFormat('sv-SE').format(n)

/** Bostaden som en kompakt rad ovanför elavtalen. Får texten inte plats på en rad bryts den efter adressen. */
const Bolt = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden className="shrink-0">
    <path d="M9 1.5L3 9h4.5L7 14.5 13 7H8.5L9 1.5z" fill="none" stroke="#51C8B4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HomeRow = ({ s, set, grid }: ScreenProps) => (
  <div className="flex flex-col rounded-[10px] bg-white shadow-[0_4px_8px_#00000014]">
    <div className="flex items-center gap-[10px] py-[12px] pr-[4px] pl-[16px]">
      <Pin color="#214766" />
      <p className={clsx('@container min-w-0 flex-1 text-[14px] leading-[20px]', navy)}>
        <span>{HOME.street}</span>
        <span className="hidden @min-[330px]:inline"> · </span>
        <span className="block @min-[330px]:inline">
          {s.homeType} · <b>{s.kvm}</b> kvm · <b>{fmtNum(s.kwh)}</b> kWh/år
        </span>
      </p>
      <button type="button" onClick={() => set({ editHome: true })} className={clsx('flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[8px] px-[12px]', press)}>
        <span className="text-[14px] leading-[18px] font-bold text-[#3879AD]">Ändra</span>
      </button>
    </div>
    {/* Nätägaren från samma GRID_OWNER som Klart. Saknas den gäller fallbacken. */}
    <p className={clsx('flex items-start gap-[10px] border-t border-[#EEEEF0] py-[10px] pr-[16px] pl-[16px] text-[13px] leading-[18px]', navy)}>
      <span className="pt-[1px]">
        <Bolt />
      </span>
      <span>
        {grid ? (
          <>
            Elnätet här är <b>{grid}</b>, det ordnar vi åt dig. Välj ditt elavtal nedan.
          </>
        ) : (
          'Elnätet ordnar vi åt dig. Välj ditt elavtal nedan.'
        )}
      </span>
    </p>
  </div>
)

/** Läge 1: bostadstypen saknas och raden blir en fråga (Paper 1B, "Bostadstyp · fråga"). Ett val visar priserna. */
const HomeQuestion = ({ s, set }: ScreenProps) => (
  <div className="flex flex-col gap-[14px] rounded-[10px] bg-white p-[20px] shadow-[0_4px_8px_#00000014]">
    <div className="flex flex-col gap-[4px]">
      <p className={clsx('text-[16px] leading-[20px] font-bold tracking-[0.32px]', navy)}>Vilken typ av bostad?</p>
      <p className="text-[13px] leading-[16px] tracking-[0.32px] text-[#2B567C]">
        {HOME.street}, {s.kvm} kvm. Det styr förbrukningen och priset.
      </p>
    </div>
    <div className="flex flex-col gap-[10px]" role="radiogroup" aria-label="Bostadstyp">
      {TYPES.map((t) => (
        <button
          key={t}
          type="button"
          role="radio"
          aria-checked={false}
          onClick={() => set({ homeType: t, kwh: kwhFor(t, s.kvm) })}
          className={clsx('flex h-12 w-full shrink-0 items-center justify-center rounded-[8px] border border-[#21476633] bg-white hover:border-[#214766]', press)}
        >
          <span className={clsx('text-[15px] leading-[18px] tracking-[0.32px]', navy)}>{t}</span>
        </button>
      ))}
    </div>
    <button type="button" onClick={() => set({ editHome: true })} className={clsx('flex min-h-11 items-center self-start', press)}>
      <span className="text-[14px] leading-[18px] font-bold tracking-[0.32px] text-[#3879AD]">Ändra adress eller boarea</span>
    </button>
  </div>
)

/** Bottenarket bakom Ändra. Via portal, annars fastnar fixed i demons animerade ram. */
const HomeSheet = ({ s, set }: ScreenProps) => {
  const [type, setType] = useState<HomeType>(s.homeType ?? 'Lägenhet')
  const [kvm, setKvm] = useState(String(s.kvm))
  const [kwh, setKwh] = useState(String(s.kwh))
  const [mounted, setMounted] = useState(false)
  const close = () => set({ editHome: false })
  useEffect(() => {
    setMounted(true)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && set({ editHome: false })
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [set])
  /* Ändras typ eller boarea räknas förbrukningen om. Kunden kan sedan justera den själv. */
  const reestimate = (t: HomeType, k: string) => Number(k) >= 10 && setKwh(String(kwhFor(t, Number(k))))
  const kvmOk = Number(kvm) >= 10
  const kwhOk = Number(kwh) >= 500
  const save = () => kvmOk && kwhOk && set({ homeType: type, kvm: Number(kvm), kwh: Number(kwh), editHome: false })
  if (!mounted) return null
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end min-[1024px]:items-center min-[1024px]:justify-center min-[1024px]:p-[24px]"
      role="dialog"
      aria-modal
      aria-labelledby="el-home-title"
    >
      <button type="button" aria-label="Stäng" className="absolute inset-0 bg-black/30" onClick={close} />
      <div className="relative mx-auto flex max-h-[90dvh] w-full max-w-[430px] flex-col overflow-y-auto rounded-t-[20px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.15)] motion-safe:animate-[rise_.3s_ease-out_both] min-[1024px]:max-w-[520px] min-[1024px]:rounded-[20px]">
        <div className="flex items-center justify-between py-[8px] pr-[8px] pl-[20px]">
          <p id="el-home-title" className={clsx('text-[18px] leading-[22px] font-bold tracking-[0.32px]', navy)}>
            Din bostad
          </p>
          <button type="button" aria-label="Stäng" onClick={close} className={clsx('flex size-11 items-center justify-center rounded-full', press)}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M4 4l10 10M14 4L4 14" stroke="#214766" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col px-[20px] pb-[20px]">
          <p className={clsx('pt-[8px] pb-[12px] text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>Bostadstyp</p>
          <div className="flex gap-[10px]" role="radiogroup" aria-label="Bostadstyp">
            {TYPES.map((t) => {
              const on = type === t
              return (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => {
                    setType(t)
                    reestimate(t, kvm)
                  }}
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
          <p className={clsx('pt-[24px] pb-[15px] text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>Storlek på bostaden</p>
          <FramedField label="Boarea" error={!kvmOk}>
            <input
              aria-label="Boarea"
              inputMode="numeric"
              className={fieldInput}
              value={kvm}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 4)
                setKvm(v)
                reestimate(type, v)
              }}
            />
            <span className="text-[15px] leading-[18px] text-[#767678]">kvm</span>
          </FramedField>
          <p className={clsx('pt-[24px] pb-[15px] text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>Beräknad elförbrukning</p>
          <FramedField label="Förbrukning" error={!kwhOk}>
            <input
              aria-label="Beräknad elförbrukning"
              inputMode="numeric"
              className={fieldInput}
              value={kwh}
              onChange={(e) => setKwh(e.target.value.replace(/\D/g, '').slice(0, 5))}
            />
            <span className="text-[15px] leading-[18px] whitespace-nowrap text-[#767678]">kWh/år</span>
          </FramedField>
          <p className="pt-[8px] text-[12px] leading-[16px] tracking-[0.32px] text-[#2B567C]">Justera för mer exakt pris.</p>
        </div>
        <div className="sticky bottom-0 border-t border-[#EEEEF0] bg-white px-[20px] pt-[15px] pb-[max(25px,env(safe-area-inset-bottom))]">
          <button
            type="button"
            aria-disabled={!kvmOk || !kwhOk}
            onClick={save}
            className={clsx(
              'flex h-12 w-full items-center justify-center rounded-full border-2',
              kvmOk && kwhOk ? 'border-[#214766] bg-[#214766] hover:bg-[#112E46]' : 'border-[#EEEEF0] bg-[#EEEEF0]',
              press,
            )}
          >
            <span className={clsx('text-[16px] leading-[18.4px] font-bold tracking-[0.32px]', kvmOk && kwhOk ? 'text-white' : 'text-[#BEBEC0]')}>Spara</span>
          </button>
        </div>
      </div>
    </div>,
    document.body,
  )
}

/** Desktop: kortet Ditt val i högerkolumnen, med valt avtal, pris, jämförpris och stegets knapp. */
const DittVal = ({ o, kwh, children }: { o: Offer; kwh: number; children: React.ReactNode }) => (
  <div className="flex flex-col gap-[16px] rounded-[10px] bg-white p-[20px] shadow-[0_4px_8px_#00000014]">
    <p className={clsx('text-[16px] leading-[20px] font-bold tracking-[0.32px]', navy)}>Ditt val</p>
    <div className="flex items-center justify-between gap-[12px]">
      <Logo src={o.logo} alt={o.name} className="h-9 w-[120px]" />
      <div className="flex flex-col items-end">
        <span className={clsx('pb-[2px] text-[12px] leading-[18px] tracking-[0.32px]', navy)}>Beräknad månadskostnad</span>
        <Price value={priceFor(o, kwh)} size="card" tone={o.hasDiscount ? 'mint' : 'navy'} />
      </div>
    </div>
    <div className="flex flex-col gap-[4px] border-t border-[#3879AD33] pt-[12px]">
      <span className={clsx('text-[14px] leading-[18px] font-bold tracking-[0.32px]', navy)}>
        Jämförpris {formatOre(comparePrice(o, compareLevel(kwh)))} öre/kWh ({new Intl.NumberFormat('sv-SE').format(compareLevel(kwh))} kWh/år)
      </span>
      <span className="text-[12px] leading-[16px] tracking-[0.32px] text-[#767678]">{compareNote(o)}</span>
    </div>
    {children}
  </div>
)

/** En enda fråga från live (MOVESUMMARY question3): två avtal vid flytt. Övriga frågor finns i Intercom-chatten. */
const TwoContracts = () => (
  <details className="group rounded-[10px] bg-white shadow-[0_4px_8px_#00000014]">
    <summary
      className={clsx('flex! min-h-14 cursor-pointer list-none items-center justify-between gap-[12px] py-[12px] pr-[15px] pl-[20px] [&::-webkit-details-marker]:hidden', navy)}
    >
      <span className="text-[15px] leading-[20px] font-bold tracking-[0.32px]">Vilka elavtal behöver jag teckna till min nya bostad?</span>
      <span className="flex size-11 shrink-0 items-center justify-center transition-transform duration-200 group-open:rotate-180">
        <ChevronDown />
      </span>
    </summary>
    <div className={clsx('flex flex-col gap-[8px] px-[20px] pb-[16px] text-[14px] leading-[20px]', navy)}>
      <p>För att få tillgång till el i ditt nya hem behöver du teckna två olika avtal:</p>
      <ul className="flex list-disc flex-col gap-[4px] pl-[20px]">
        <li>Elnätsavtal, så att elen når fram till bostaden</li>
        <li>Elhandelsavtal, för din löpande elförbrukning</li>
      </ul>
      <p>När du fixar elen på Flyttsmart får du välja mellan flera förslag på elhandelsavtal. Vi har tagit fram de bästa alternativen på din nya adress och pressat priserna.</p>
      <p>
        Du tecknar samtidigt ett elnätsavtal med den leverantör som äger elnätet i ditt nya bostadsområde. Här kan du med andra ord inte välja mellan olika leverantörer. Du behöver
        inte kontakta leverantören – vi löser det åt dig.
      </p>
    </div>
  </details>
)

export const PriserScreen = (p: ScreenProps) => {
  const { s, go } = p
  const chosen = offerById(s.selected)
  if (!s.homeType)
    return (
      <Shell>
        <div className="flex flex-col gap-[20px] px-[20px] pt-[15px] pb-10 min-[1024px]:px-0">
          <Steps n={1} />
          <Intro />
          <HomeQuestion {...p} />
          {s.editHome && <HomeSheet {...p} />}
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
      </Shell>
    )
  return (
    <>
      <Shell
        side={
          <DittVal o={chosen} kwh={s.kwh}>
            <button
              type="button"
              onClick={() => go(3)}
              className={clsx('flex h-12 w-full items-center justify-center gap-[10px] rounded-full border-2 border-[#214766] bg-[#214766] hover:bg-[#112E46]', press)}
            >
              <span className="text-[16px] leading-[18.4px] font-bold tracking-[0.32px] whitespace-nowrap text-white">Välj elavtal</span>
              <ArrowRight />
            </button>
          </DittVal>
        }
      >
        <div className="flex flex-col gap-[20px] px-[20px] pt-[15px] pb-6 min-[1024px]:px-0">
          <Steps n={1} />
          <Intro />
          <HomeRow {...p} />
          <RecommendedCard {...p} />
          <Compare {...p} />
          <TwoContracts />
        </div>
      </Shell>
      {s.editHome && <HomeSheet {...p} />}
      <Foot className="!flex-row items-center !gap-[12px] min-[1024px]:hidden">
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
  const fortsatt = (
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
  )
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
      <Shell
        side={
          <DittVal o={offerById(s.selected)} kwh={s.kwh}>
            {fortsatt}
          </DittVal>
        }
      >
        <div className="flex flex-col px-[20px] pt-[15px] pb-6 min-[1024px]:px-0">
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
              <span className={clsx('ml-[-13px] flex-1 text-[16px] leading-[20px] tracking-[0.32px]', navy)}>
                Säg upp mitt nuvarande elavtal åt mig i samband med nyteckningen.
              </span>
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
      </Shell>
      <Foot className="min-[1024px]:hidden">{fortsatt}</Foot>
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

const SpecRow = ({ label, value, tone = 'normal', note }: { label: string; value: string; tone?: 'normal' | 'bold' | 'mint'; note?: string }) => (
  <div className="flex flex-col border-b border-[#EEEEF0] py-[8px]">
    <div className={clsx('flex items-start justify-between gap-[12px] text-[14px] leading-[18px]', tone === 'mint' ? 'text-[#1F6156]' : navy, tone === 'bold' && 'font-bold')}>
      <span>{label}</span>
      <span className="text-right whitespace-nowrap">{value}</span>
    </div>
    {note && <span className="pt-[2px] text-[12px] leading-[16px] text-[#767678] italic">{note}</span>}
  </div>
)

/** Prisspecifikationen som live: elpriset i öre/kWh, momsen, rabatten och månadsavgiften. Exempelsiffror, se PRICE_SPEC i data.ts. */
const PriceSpecTable = ({ id, kwh }: { id: OfferId; kwh: number }) => {
  const sp = PRICE_SPEC[id]
  const kd = kwhDiscountFor(id, kwh)
  const t = priceSpecTotals(id)
  const ore = (n: number) => `${formatOre(n)} öre/kWh`
  return (
    <div className="flex flex-col pt-[12px]">
      <p className={clsx('pb-[4px] text-[15px] leading-[20px] font-bold', navy)}>Elpris</p>
      <SpecRow label={`Rörligt elpris (spotpris), ${previousMonthName()} SE3`} value={ore(SPOT_ORE)} note="Priset varierar varje månad." />
      <SpecRow label="Rörligt påslag" value={ore(sp.markup)} />
      <SpecRow label="Elcertifikat" value={ore(CERT_ORE)} />
      <SpecRow label="Moms (25 %)" value={ore(t.vat)} />
      <SpecRow label="Elpris inkl. moms" value={ore(t.total)} tone="bold" />
      {kd && (
        <SpecRow
          label={`Elprisrabatt, ${kd.months} mån`}
          value={`−${ore(kd.ore)}`}
          tone="mint"
          note={kd.byUsage ? `Rabatten beror på din förbrukning, ${new Intl.NumberFormat('sv-SE').format(kwh)} kWh/år.` : undefined}
        />
      )}
      <p className={clsx('pt-[16px] pb-[4px] text-[15px] leading-[20px] font-bold', navy)}>Månadsavgift</p>
      <div className="flex flex-col border-b border-[#EEEEF0] py-[8px]">
        <div className={clsx('flex items-start justify-between gap-[12px] text-[14px] leading-[18px]', navy)}>
          <span>Månadsavgift</span>
          <span className="font-bold whitespace-nowrap">{sp.feeDiscount ? Math.max(0, sp.fee - sp.feeDiscount.kr) : sp.fee} kr/mån</span>
        </div>
        {sp.feeDiscount && (
          <>
            <span className="pt-[4px] text-[14px] leading-[18px] text-[#1F6156]">Första {sp.feeDiscount.months} månaderna.</span>
            <span className="text-[14px] leading-[18px] text-[#767678]">Därefter {sp.fee} kr/mån inkl. moms.</span>
          </>
        )}
      </div>
      <p className="pt-[10px] text-[12px] leading-[16px] text-[#767678]">Alla belopp inklusive moms.</p>
    </div>
  )
}

const shortDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'short' }).format(new Date(y, (m || 1) - 1, d || 1)).replace('.', '')
}

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

/** Fullmakten, med texten från live (STEP4SUMMARY.poaPopup*). Via portal som arket Din bostad. */
const PoaSheet = ({ name, onClose }: { name: string; onClose: () => void }) => {
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])
  if (!mounted) return null
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end min-[1024px]:items-center min-[1024px]:justify-center min-[1024px]:p-[24px]"
      role="dialog"
      aria-modal
      aria-labelledby="el-poa-title"
    >
      <button type="button" aria-label="Stäng" className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div
        className={clsx(
          'relative mx-auto flex max-h-[90dvh] w-full max-w-[430px] flex-col overflow-y-auto rounded-t-[20px] bg-white pb-[max(25px,env(safe-area-inset-bottom))] shadow-[0_-4px_24px_rgba(0,0,0,0.15)] motion-safe:animate-[rise_.3s_ease-out_both] min-[1024px]:max-w-[520px] min-[1024px]:rounded-[20px]',
          navy,
        )}
      >
        <div className="flex items-center justify-between py-[8px] pr-[8px] pl-[20px]">
          <p id="el-poa-title" className="text-[18px] leading-[22px] font-bold tracking-[0.32px]">
            Fullmakt
          </p>
          <button type="button" aria-label="Stäng" onClick={onClose} className={clsx('flex size-11 items-center justify-center rounded-full', press)}>
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
              <path d="M4 4l10 10M14 4L4 14" stroke="#214766" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="flex flex-col gap-[10px] px-[20px] text-[14px] leading-[20px]">
          <p className="font-bold">Härmed befullmäktigar jag “Fullmaktsgivaren”, {name} och Flyttsmart Sverige AB “Fullmaktstagarna” att för min räkning:</p>
          <ul className="flex list-disc flex-col gap-[8px] pl-[20px]">
            <li>
              Inhämta anläggningsuppgifter som är registrerade på mitt personnummer, avsluta eventuellt nuvarande elnätsavtal samt teckna elnätsavtal för den adress jag uppgivit
              att jag ska flytta till.
            </li>
            <li>Emotta uppgifter om anläggnings-id för den nya adressen.</li>
            <li>
              Inhämta information från mitt nuvarande elhandelsbolag om första möjliga startdatum för ett nytt elavtal samt säga upp mitt befintliga avtal och teckna nytt
              elhandelsavtal.
            </li>
            <li>Fullmakten är gällande från att jag trycker på knappen “Gå vidare” och gäller i 12 månader därefer.</li>
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  )
}

export const SammanfattningScreen = ({ s, set, go }: ScreenProps) => {
  const o = offerById(s.selected)
  const [poaOpen, setPoaOpen] = useState(false)
  const saved = savings(o.id, s.kwh)
  const sign = (
    <>
      {/* Samtycket i foten i stället för en kryssruta: att signera är att godkänna (David 20/10). */}
      <p className={clsx('text-center text-[12px] leading-[16px] tracking-[0.32px] text-[#2B567C]')}>
        {o.terms.map((seg, i) => (
          <span key={i}>
            {i > 0 ? ' ' : ''}
            {seg.t === 'fullmakt' ? (
              <button type="button" onClick={() => setPoaOpen(true)} className="font-bold text-[#51C8B4] underline-offset-2 hover:underline">
                fullmakt
              </button>
            ) : (
              <span className={seg.b ? 'font-bold text-[#51C8B4]' : undefined}>{seg.t}</span>
            )}
          </span>
        ))}{' '}
        <span className="whitespace-nowrap">14 dagars ångerrätt.</span>
      </p>
      <button
        type="button"
        onClick={() => go(6)}
        className={clsx('flex h-12 shrink-0 items-center justify-center gap-[10px] rounded-full border-2 border-[#214766] bg-[#214766] hover:bg-[#112E46]', press)}
      >
        <BankIdIcon />
        <span className="text-[16px] leading-[18.4px] font-bold tracking-[0.32px] text-white">Teckna elavtal</span>
      </button>
    </>
  )
  return (
    <>
      <Shell side={<div className="flex flex-col gap-[12px] rounded-[10px] bg-white p-[20px] shadow-[0_4px_8px_#00000014]">{sign}</div>}>
        <div className="flex flex-col px-[20px] pt-[15px] pb-6 min-[1024px]:px-0">
          <Steps n={3} />
          <Title onBack={() => go(3)}>Sammanfattning</Title>
          {/* Bekräftelsen först: valet, priset och varför det är bra. Detaljerna på en rad. */}
          <div className="flex flex-col overflow-clip rounded-[10px] border-2 border-[#51C8B4] bg-white shadow-[0_4px_8px_#00000014]">
            <div className="flex min-h-[42px] items-center justify-between bg-[#ECF9F7] px-[20px] py-[10px]">
              <span className="text-[14px] leading-[18px] font-bold tracking-[0.32px] text-[#1F6156]">Ett bra val</span>
              <CheckCircle />
            </div>
            <div className="flex flex-col px-[20px] pt-[20px]">
              <div className="flex items-center justify-between gap-[12px]">
                <Logo src={o.logo} alt={o.name} className="h-9 w-[120px]" />
                <div className="flex flex-col items-end">
                  <span className={clsx('pb-[2px] text-[12px] leading-[18px] tracking-[0.32px]', navy)}>Beräknad månadskostnad</span>
                  <Price value={priceFor(o, s.kwh)} size="card" tone={o.hasDiscount ? 'mint' : 'navy'} />
                </div>
              </div>
              <div className="flex flex-col gap-[10px] pt-[16px] pb-[16px]">
                <p className={clsx('flex items-center gap-[12px] text-[15px] leading-[20px]', navy)}>
                  <CheckCircle stroke={1.8} />
                  Ingen bindningstid
                </p>
                {/* Bara påståenden som stämmer: avtal utan rabatt (Tibber) får ingen rabattrad. */}
                {saved && (
                  <p className={clsx('flex items-start gap-[12px] text-[15px] leading-[20px]', navy)}>
                    <CheckCircle stroke={1.8} />
                    <span className="min-w-0">
                      {s.selected === RECOMMENDED ? (
                        <>
                          Vårt bästa pris, <b className="whitespace-nowrap">ca {new Intl.NumberFormat('sv-SE').format(saved.kr)} kr</b> rabatt {saved.period}
                        </>
                      ) : (
                        <>
                          <b className="whitespace-nowrap">Ca {new Intl.NumberFormat('sv-SE').format(saved.kr)} kr</b> rabatt {saved.period}
                        </>
                      )}
                    </span>
                  </p>
                )}
              </div>
              <div className="flex items-center justify-between gap-[8px] border-t border-[#3879AD33] py-[6px]">
                <div className={clsx('min-w-0 text-[15px] leading-[20px]', navy)}>
                  <p>
                    <span className="whitespace-nowrap">Startar {shortDate(s.startDate)}</span> ·{' '}
                    <span className="whitespace-nowrap">
                      {HOME.street}, lgh {s.apartment || '1102'}
                    </span>
                  </p>
                  {s.terminate && s.endDate && <p className="text-[13px] leading-[18px] text-[#2B567C]">Säg upp nuvarande elavtal {shortDate(s.endDate)}</p>}
                </div>
                <button
                  type="button"
                  onClick={() => go(3)}
                  className={clsx('-mr-[12px] flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-[8px] px-[12px]', press)}
                >
                  <span className="text-[14px] leading-[18px] font-bold text-[#3879AD]">Ändra</span>
                </button>
              </div>
              <div className="flex flex-col border-t border-[#3879AD33] pb-[10px]">
                <button
                  type="button"
                  aria-expanded={s.specOpen}
                  onClick={() => set({ specOpen: !s.specOpen })}
                  className={clsx('flex h-11 shrink-0 items-center justify-between text-left', press)}
                >
                  <span className="text-[15px] leading-[18px] font-bold tracking-[0.32px] text-[#112E46]">Prisspecifikation</span>
                  <ChevronDown up={s.specOpen} />
                </button>
                {s.specOpen && (
                  <div className="flex flex-col pb-[10px] motion-safe:animate-[rise_.25s_ease-out_both]">
                    <Row label="Uppskattad kostnad" value={`ca ${new Intl.NumberFormat('sv-SE').format(priceFor(o, s.kwh))} kr/mån`} />
                    <PriceSpecTable id={o.id} kwh={s.kwh} />
                    <div className={clsx('mt-[15px] flex flex-col gap-[10px] rounded-[8px] bg-[#E8F0F8] p-[20px]', navy)}>
                      <p className="text-[14px] leading-[18px] font-bold tracking-[0.32px]">Din elkostnad varierar</p>
                      <p className="text-[14px] leading-[18px] tracking-[0.32px]">Kostnaden beror på elpris, inköpskostnader och din förbrukning. Elnätskostnad tillkommer.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Shell>
      <Foot className="min-[1024px]:hidden">{sign}</Foot>
      {poaOpen && <PoaSheet name={o.name} onClose={() => setPoaOpen(false)} />}
    </>
  )
}

/* ---------- BankID och Klart (texterna från flyttsmart-next live) ---------- */

/**
 * BankID-steget med live-texterna (common.json BANKID och Avbryt). Inget går vidare av sig
 * självt: kunden trycker på BankID-ytan eller knappen, ser spinnern en kort stund som när
 * appen bekräftar, och hamnar på Klart.
 */
export const BankIdScreen = ({ go }: ScreenProps) => {
  const [signing, setSigning] = useState(false)
  useEffect(() => {
    if (!signing) return
    const t = setTimeout(() => go(7), 1200)
    return () => clearTimeout(t)
  }, [signing, go])
  const sign = () => setSigning(true)
  return (
    <div className="flex flex-1 flex-col items-center px-[20px] pt-12 pb-10 text-center min-[1024px]:mx-auto min-[1024px]:w-full min-[1024px]:max-w-[560px]">
      <div role="heading" aria-level={1} className={clsx('pb-[12px] text-[24px] leading-[30px] font-bold tracking-[0.32px]', navy)}>
        Signera med BankID
      </div>
      <p className={clsx('pb-[32px] text-[16px] leading-[20px]', navy)}>Starta din BankID-applikation på din mobil.</p>
      <button
        type="button"
        onClick={sign}
        disabled={signing}
        aria-label="Starta BankID"
        className={clsx(
          'mb-[32px] flex size-[120px] items-center justify-center rounded-[16px] border-2 border-[#DCEFFF] bg-white shadow-[0_4px_8px_#00000014] hover:border-[#214766]',
          press,
        )}
      >
        {signing ? (
          <span role="status" aria-label="Väntar på BankID" className="size-12 rounded-full border-4 border-[#DCEFFF] border-t-[#51C8B4] motion-safe:animate-spin" />
        ) : (
          <span
            aria-hidden
            className="h-[62px] w-[70px]"
            style={{
              backgroundColor: '#214766',
              WebkitMask: 'url(/images/el-demo/bankid-vit.svg) center / 100% 100% no-repeat',
              mask: 'url(/images/el-demo/bankid-vit.svg) center / 100% 100% no-repeat',
            }}
          />
        )}
      </button>
      <button
        type="button"
        disabled={signing}
        onClick={sign}
        className={clsx(
          'flex h-12 w-full max-w-[350px] items-center justify-center gap-[10px] rounded-full border-2 border-[#214766] bg-[#214766] px-[24px] hover:bg-[#112E46] disabled:opacity-60',
          press,
        )}
      >
        <BankIdIcon />
        <span className="text-[16px] leading-[18.4px] font-bold tracking-[0.32px] text-white">Starta BankID</span>
      </button>
      <button type="button" onClick={() => go(5)} className={clsx('mt-[16px] flex h-11 items-center px-[16px]', press)}>
        <span className={clsx('text-[16px] font-bold underline underline-offset-4', navy)}>Avbryt</span>
      </button>
    </div>
  )
}

export const KlartScreen = ({ s, grid }: ScreenProps) => {
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
    <div className="flex flex-1 flex-col px-[16px] pt-6 pb-10 min-[1024px]:mx-auto min-[1024px]:w-full min-[1024px]:max-w-[560px]">
      <div className="flex flex-col items-center rounded-[16px] bg-white p-[20px] shadow-[0_4px_8px_#00000014] motion-safe:animate-[rise_.4s_ease-out_both]">
        <div role="heading" aria-level={1} className={clsx('pb-6 text-center text-[24px] leading-[28px] font-black', navy)}>
          Grattis till ett riktigt smart val av<span className="text-[#51C8B4]"> elavtal!</span>
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
        <div className="flex w-full flex-col pt-[24px] text-left">
          <p className={clsx('pb-[14px] text-[16px] leading-[20px] font-bold', navy)}>Det här händer nu</p>
          <ol className="flex flex-col">
            {[
              'Du får en bekräftelse på mejl inom kort.',
              `Vi ordnar elnätet${grid ? ` hos ${grid}` : ''} till din nya adress med fullmakten${s.terminate ? ' och säger upp ditt nuvarande elavtal' : ''}.`,
              `Elen är på från ${longDate(s.startDate)}. Vi skickar ett sms när allt är klart.`,
            ].map((text, i, all) => (
              <li key={i} className="flex gap-[12px]">
                <span className="flex flex-col items-center">
                  <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#ECF9F7] text-[12px] leading-none font-bold text-[#1F6156]">{i + 1}</span>
                  {i < all.length - 1 && <span aria-hidden className="w-px flex-1 bg-[#9EE0D5]" />}
                </span>
                <span className={clsx('pt-[2px] text-[15px] leading-[20px]', navy, i < all.length - 1 && 'pb-[16px]')}>{text}</span>
              </li>
            ))}
          </ol>
          <p className="pt-[14px] text-[14px] leading-[18px] text-[#2B567C]">Du behöver inte göra något mer.</p>
        </div>
        <Link href="/demo/movepage" className={clsx('mt-6 flex h-12 items-center justify-center rounded-full border-2 border-[#214766] bg-white px-10 no-underline!', press)}>
          <span className={clsx('text-[16px] font-bold', navy)}>Till flyttsidan</span>
        </Link>
      </div>
    </div>
  )
}
