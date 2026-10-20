'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { useDemoUser } from '@/common/data/useDemoUser'
import useResponsive from '@/common/hooks/useResponsive'
import { setFlyttSteg1 } from '@/common/utils/demoNavigation'
import { answeredCount, useDemoState } from './state'
import LiveMovePage from './LiveMovePage'
import {
  AdresserScreen,
  BaraInScreen,
  BaraUtScreen,
  BohagScreen,
  BokatScreen,
  NummerScreen,
  OffertCard,
  OffertenScreen,
  OffertScreen,
  SaljareScreen,
  SistaScreen,
  SparatScreen,
  StadScreen,
  TidScreen,
  nextUnanswered,
  type Home,
  type ScreenProps,
} from './screens'

const STEPS = ['Flyttsidan', 'Begär offert', 'Välj tid', 'Numret', 'Samtal bokat', 'Adresser', 'Bära ut', 'Bära in', 'Vad ska med', 'Städning', 'Sista detaljerna', 'Allt sparat', 'Säljaren', 'Offerten']
const LAST = STEPS.length - 1
const FIRST_QUESTION = 5
const SALJARE = 12

const parse = (iso: string, plusDays = 0) => {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return null
  d.setDate(d.getDate() + plusDays)
  return d
}
const shortDay = (iso: string, plusDays = 0) => {
  const d = parse(iso, plusDays)
  if (!d) return plusDays ? 'lör 31 okt' : 'fre 30 okt'
  return new Intl.DateTimeFormat('sv-SE', { weekday: 'short', day: 'numeric', month: 'short' }).format(d).replace('.', '')
}
const longDay = (iso: string, plusDays = 0) => {
  const d = parse(iso, plusDays)
  if (!d) return plusDays ? 'lördag 31 oktober' : 'fredag 30 oktober'
  return new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
}
/** YYYY-MM-DD lokalt, för städdagens kalender. */
const isoDate = (iso: string) => {
  const d = parse(iso) ?? new Date(2026, 9, 30)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

/* Som flyttsidans blå ruta skriver datumet: "10 november 2026". */
const fullDate = (iso: string) => {
  const d = parse(iso)
  if (!d) return '30 oktober 2026'
  return new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(d)
}

/**
 * Prototyp av flyttflödet steg 1, utan pris. Ingången är dagens flyttsida
 * (LiveMovePage, byggd från live-koden) och dagens tre skärmar är orörda.
 * Skillnaden börjar efter Ja!: bekräftelsen stannar kvar och bjuder in till
 * sex steg som sparas direkt. På mobil ligger allt i ett ark ovanpå sidan, på
 * desktop inuti Flytthjälp-kortet, som live gör i dag. Ren frontend.
 */
const DemoFlyttFlow = () => {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const search = useSearchParams()
  const demoUser = useDemoUser()
  const { answers, update, reset, loaded } = useDemoState()
  const { isTabletPortraitOrGreater: desktop } = useResponsive()
  const [savedBadge, setSavedBadge] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  /* Mobil helskärm: panelen följer den synliga vyn så att iOS-tangentbordet inte skjuter upp sidan bakom (Nils 20 okt). */
  const [vy, setVy] = useState<{ top: number; height: number } | null>(null)
  const badgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const step = Math.min(LAST, Math.max(0, Number(search.get('s') ?? 0) || 0))
  const inSheet = step > 0 && step < SALJARE
  /* Desktop: dagens skärmar och Samtal bokat ligger i Flytthjälp-kortet som live. Frågestegen får en egen ruta ovanpå sidan. */
  const dialog = desktop && step >= FIRST_QUESTION && step < SALJARE
  const inline = inSheet && desktop && !dialog
  /* Mobil: de sex frågestegen tar hela skärmen (David 20 okt i Paper: "Låt denna ta hela skärmen?"). Arket behålls för dagens skärmar, Samtal bokat och Allt sparat. */
  const helskarm = !desktop && step >= FIRST_QUESTION && step < FIRST_QUESTION + 6

  useEffect(() => {
    setFlyttSteg1(true)
    setMounted(true)
  }, [])

  /* Desktop: nytt steg börjar högst upp i kortet. Flyttsidan och Säljaren börjar högst upp på sidan. */
  useEffect(() => {
    if (inline) document.getElementById('flytt-inline')?.scrollIntoView({ block: 'start', behavior: 'instant' as ScrollBehavior })
    else if (!inSheet) window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [step, inline, inSheet])

  useEffect(() => {
    if (!helskarm) return
    const v = window.visualViewport
    const html = document.documentElement
    const forra = html.style.overflow
    html.style.overflow = 'hidden'
    if (!v) return () => void (html.style.overflow = forra)
    const upd = () => setVy({ top: v.offsetTop, height: v.height })
    upd()
    v.addEventListener('resize', upd)
    v.addEventListener('scroll', upd)
    return () => {
      v.removeEventListener('resize', upd)
      v.removeEventListener('scroll', upd)
      html.style.overflow = forra
      setVy(null)
    }
  }, [helskarm])
  /* Tangentbordet uppe: visuella vyn är klart lägre än fönstret. Då täcker panelen exakt det som syns. */
  const tangentbord = helskarm && vy && vy.height < window.innerHeight - 150
  const panelStyle = tangentbord ? { top: vy.top, height: vy.height, bottom: 'auto' } : undefined

  const go = useCallback(
    (s: number) => {
      const prefix = params?.locale && params.locale !== 'sv' ? `/${params.locale}` : ''
      router.push(s === 0 ? `${prefix}/demo/flytt` : `${prefix}/demo/flytt?s=${s}`)
    },
    [params?.locale, router],
  )

  /* Fortsätt: visa "Steg n sparat" på nästa steg i ett par sekunder. */
  const next = useCallback(
    (from: number) => {
      setSavedBadge(`Steg ${from - FIRST_QUESTION + 1} sparat`)
      if (badgeTimer.current) clearTimeout(badgeTimer.current)
      badgeTimer.current = setTimeout(() => setSavedBadge(null), 2500)
      go(from + 1)
    },
    [go],
  )

  const home: Home = useMemo(() => {
    const move = demoUser.currentMove
    return {
      from: move.fromAddress?.street || 'Storgatan 12',
      to: move.toAddress?.street || 'nya adressen',
      fromKvm: move.fromResidenceSize || 62,
      toKvm: 78,
      moveDay: shortDay(move.movingDate),
      moveDayLong: longDay(move.movingDate),
      moveDateFull: fullDate(move.movingDate),
      moveDateIso: isoDate(move.movingDate),
      cleanDayLong: longDay(move.movingDate, 1),
      firstName: demoUser.profile?.firstName || 'Anna',
    }
  }, [demoUser])

  const props: ScreenProps = { a: answers, update, go, next, home, savedBadge }

  // Som komponent, inte funktionsanrop: skärmarna har egna hooks och får inte dela DemoFlyttFlows hook-ordning.
  const Screen = [null, OffertScreen, TidScreen, NummerScreen, BokatScreen, AdresserScreen, BaraUtScreen, BaraInScreen, BohagScreen, StadScreen, SistaScreen, SparatScreen, SaljareScreen, OffertenScreen][step]
  const screen = Screen ? <Screen key={step} {...props} /> : null
  const card = loaded && answers.samtal ? <OffertCard {...props} /> : null

  const demoBar = (
    <nav aria-label="Demo" className="flex w-full items-center gap-1 overflow-x-auto bg-[var(--color-secondary-dark)] px-3 py-2 text-white">
      <span className="shrink-0 pr-1 text-[11px] font-bold uppercase tracking-[0.1em] text-white/60">Demo</span>
      {STEPS.map((label, i) => (
        <button key={label} type="button" onClick={() => go(i)} className={clsx('h-8 shrink-0 rounded-full px-3 text-[12px] whitespace-nowrap', i === step ? 'bg-white font-bold text-[var(--color-secondary-main)]' : 'text-white/85 hover:bg-white/10')}>
          {i} · {label}
        </button>
      ))}
      <button
        type="button"
        onClick={() => {
          reset()
          go(0)
        }}
        className="h-8 shrink-0 rounded-full px-3 text-[12px] text-white/70 hover:bg-white/10"
      >
        Börja om{loaded && answeredCount(answers) > 0 ? ` (${answeredCount(answers)} steg)` : ''}
      </button>
    </nav>
  )

  return (
    <div className="flex min-h-[calc(100dvh-52px)] flex-1 flex-col bg-[#E7ECF0]">
      {demoBar}
      {step >= SALJARE ? (
        <div className="flex w-full flex-1 flex-col bg-white md:mx-auto md:my-6 md:max-w-[430px] md:flex-none md:overflow-clip md:rounded-[28px] md:shadow-[0_12px_40px_rgba(33,71,102,0.12)]">{screen}</div>
      ) : (
        <>
          <LiveMovePage home={home} inline={inline ? screen : null} card={card} onOffer={() => go(answers.samtal ? nextUnanswered(answers) : 1)} />
          {/* Mobil: arket. Desktop: frågestegen i en egen ruta. Via portal, annars fastnar fixed i demons animerade ram. */}
          {inSheet &&
            mounted &&
            (!desktop || dialog) &&
            createPortal(
              <div className={clsx('fixed inset-x-0 bottom-0 z-50 flex flex-col', helskarm ? 'top-[52px]' : 'top-0', dialog ? 'items-center justify-center p-6' : 'justify-end')} style={panelStyle} role="dialog" aria-modal>
                {!helskarm && <button type="button" aria-label="Stäng" className={clsx('absolute inset-0', dialog ? 'bg-black/40' : 'bg-black/30')} onClick={() => go(0)} />}
                <div className={clsx('relative flex w-full flex-col overflow-clip bg-white', dialog ? 'max-h-[88dvh] max-w-[840px] rounded-2xl shadow-[0_24px_64px_rgba(0,0,0,0.25)]' : helskarm ? 'h-full' : 'mx-auto max-h-[90dvh] max-w-[430px] rounded-t-[20px] shadow-[0_-4px_24px_rgba(0,0,0,0.15)]')}>{screen}</div>
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  )
}

export default DemoFlyttFlow
