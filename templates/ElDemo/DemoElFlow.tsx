'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import { clsx } from 'clsx'
import { useDemoUser } from '@/common/data/useDemoUser'
import { BASE_KWH, HOME, RECOMMENDED, dateStatus, defaultStart, tooEarlyExample } from './data'
import { BankIdScreen, DetaljerScreen, KlartScreen, PriserScreen, SammanfattningScreen, type ElState, type ScreenProps } from './screens'
import { ArrowLeft, press } from './ui'

const STEPS = ['Priser', 'Bostadstyp saknas', 'Jämför öppet', 'Detaljer', 'För tidigt datum', 'Sammanfattning', 'Rutan ej ikryssad', 'BankID', 'Klart']
const LAST = STEPS.length - 1
/** Vilken skärm varje demosteg visar. Steg med samma skärm är olika lägen av den. */
const SCREEN = [0, 0, 0, 1, 1, 2, 2, 3, 4]

const initial = (oldAddress: string): ElState => ({
  homeType: 'Lägenhet',
  kvm: HOME.kvm,
  kwh: BASE_KWH,
  editHome: false,
  compareOpen: false,
  selected: RECOMMENDED,
  readMore: false,
  startDate: defaultStart(),
  facilityId: '',
  apartment: '1102',
  terminate: false,
  endDate: '',
  oldAddress,
  touched: false,
  accepted: false,
  showMissing: false,
  specOpen: false,
  dateHelp: false,
  aptHelp: false,
})

/** Läget varje demoknapp ska visa, som skärmarna i Paper. */
const preset = (step: number, s: ElState): Partial<ElState> => {
  const ok = dateStatus(s.startDate) === 'ok' ? s.startDate : defaultStart()
  switch (step) {
    case 0:
      return { homeType: s.homeType ?? 'Lägenhet', compareOpen: false, editHome: false }
    case 1:
      return { homeType: null, compareOpen: false, editHome: false }
    case 2:
      return { homeType: s.homeType ?? 'Lägenhet', compareOpen: true, editHome: false }
    case 3:
      return { startDate: ok, touched: false }
    case 4:
      return { startDate: tooEarlyExample() }
    case 5:
      return { startDate: ok, accepted: true, showMissing: false }
    case 6:
      return { startDate: ok, accepted: false, showMissing: true }
    default:
      return { startDate: ok, accepted: true, showMissing: false }
  }
}

/** Demosteget som stämmer med läget, så att demoraden följer med när man klickar runt. */
const variantOf = (screen: number, s: ElState) => {
  if (screen === 0) return !s.homeType ? 1 : s.compareOpen ? 2 : 0
  if (screen === 1) return dateStatus(s.startDate) === 'early' ? 4 : 3
  if (screen === 2) return s.showMissing && !s.accepted ? 6 : 5
  return screen === 3 ? 7 : 8
}

/**
 * Det nya elflödet, ritat i Paper på sidan "El · mätbar och tumvänlig (20 okt)".
 * Tre steg (Priser, Detaljer, Sammanfattning) plus BankID och Klart. Ren
 * frontend: inga anrop, allt ligger i komponentens state. ?s=n öppnar läge n.
 */
const DemoElFlow = () => {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const search = useSearchParams()
  const demoUser = useDemoUser()
  const step = Math.min(LAST, Math.max(0, Number(search.get('s') ?? 0) || 0))
  const screen = SCREEN[step]

  const from = demoUser.currentMove?.fromAddress
  const oldAddress = from?.street ? `${from.street}${from.zip ? `, ${from.zip}` : ''}${from.city ? ` ${from.city}` : ''}` : ''
  const [s, setState] = useState<ElState>(() => {
    const base = initial(oldAddress)
    return { ...base, ...preset(step, base) }
  })
  const set = useCallback((patch: Partial<ElState>) => setState((prev) => ({ ...prev, ...patch })), [])
  const scrollTarget = useRef<string | null>(step === 2 ? 'el-compare' : step === 6 ? 'el-terms' : null)
  const lastScreen = useRef<number | null>(null)

  const url = useCallback(
    (n: number) => {
      const prefix = params?.locale && params.locale !== 'sv' ? `/${params.locale}` : ''
      return n === 0 ? `${prefix}/demo/el` : `${prefix}/demo/el?s=${n}`
    },
    [params?.locale],
  )
  const go = useCallback((n: number) => router.push(url(n), { scroll: false }), [router, url])

  const jump = (n: number) => {
    setState((prev) => ({ ...prev, ...preset(n, prev) }))
    scrollTarget.current = n === 2 ? 'el-compare' : n === 6 ? 'el-terms' : null
    go(n)
  }

  const restart = () => {
    const base = initial(oldAddress)
    setState(base)
    lastScreen.current = null
    go(0)
  }

  /* Ny skärm börjar högst upp. Byte av läge inom samma skärm scrollar inte, utom till målet (jämförelsen, rutan). */
  useEffect(() => {
    if (lastScreen.current !== screen) {
      const html = document.documentElement
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
      html.style.scrollBehavior = prev
      lastScreen.current = screen
    }
    const target = scrollTarget.current
    if (!target) return
    const id = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ block: target === 'el-terms' ? 'center' : 'start', behavior: 'smooth' })
      scrollTarget.current = null
    })
    return () => cancelAnimationFrame(id)
  })

  /* Demoraden följer läget: väljer man bostadstyp blir det Priser, ett för tidigt datum blir För tidigt datum, osv. */
  useEffect(() => {
    if (screen > 2) return
    const v = variantOf(screen, s)
    if (v !== step) router.replace(url(v), { scroll: false })
  }, [s, screen, step, router, url])

  /* Teckna utan kryss: raden vid knappen och sidan scrollar till rutan. */
  const setWithScroll = useCallback(
    (patch: Partial<ElState>) => {
      if (patch.showMissing) scrollTarget.current = 'el-terms'
      set(patch)
    },
    [set],
  )

  const props: ScreenProps = { s, set: setWithScroll, go }
  const Screen = [PriserScreen, DetaljerScreen, SammanfattningScreen, BankIdScreen, KlartScreen][screen]

  return (
    <div className="flex min-h-[calc(100dvh-52px)] w-full flex-1 flex-col bg-[#E7ECF0]">
      <nav aria-label="Demo" className="flex w-full items-center gap-1 overflow-x-auto bg-[var(--color-secondary-dark)] px-3 py-2 text-white">
        <span className="shrink-0 pr-1 text-[11px] font-bold tracking-[0.1em] text-white/60 uppercase">Demo</span>
        {STEPS.map((label, i) => (
          <button
            key={label}
            type="button"
            onClick={() => jump(i)}
            className={clsx(
              'h-8 shrink-0 rounded-full px-3 text-[12px] whitespace-nowrap',
              i === step ? 'bg-white font-bold text-[var(--color-secondary-main)]' : 'text-white/85 hover:bg-white/10',
            )}
          >
            {i} · {label}
          </button>
        ))}
        <button type="button" onClick={restart} className="h-8 shrink-0 rounded-full px-3 text-[12px] text-white/70 hover:bg-white/10">
          Börja om
        </button>
      </nav>
      <div className="flex w-full flex-1 flex-col bg-[#F8FAF9] md:mx-auto md:my-6 md:min-h-[780px] md:max-w-[430px] md:flex-none md:overflow-clip md:rounded-[28px] md:border md:border-[#D5DDE5] md:shadow-[0_12px_40px_rgba(33,71,102,0.12)]">
        {screen < 3 && (
          <div className="flex h-[38px] shrink-0 items-center bg-[#3879AD] px-[9px]">
            <button
              type="button"
              aria-label="Tillbaka"
              onClick={() => (screen === 0 ? router.push('/demo/movepage') : go(screen === 1 ? 0 : 3))}
              className={clsx('flex size-11 items-center justify-center rounded-full', press)}
            >
              <ArrowLeft />
            </button>
          </div>
        )}
        <Screen key={screen} {...props} />
      </div>
    </div>
  )
}

export default DemoElFlow
