'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { useDemoUser } from '@/common/data/useDemoUser'
import { setFlyttSteg1 } from '@/common/utils/demoNavigation'
import MovePage from '@/templates/MovePage'
import { answeredCount, useDemoState } from './state'
import { AdresserScreen, BaraInScreen, BaraUtScreen, BohagScreen, BokatScreen, NummerScreen, OffertCard, OffertScreen, SaljareScreen, SistaScreen, SparatScreen, StadScreen, TidScreen, type Home, type ScreenProps } from './screens'

const STEPS = ['Flyttsidan', 'Begär offert', 'Välj tid', 'Numret', 'Samtal bokat', 'Adresser', 'Bära ut', 'Bära in', 'Vad ska med', 'Städning', 'Sista detaljerna', 'Allt sparat', 'Säljaren']
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

/**
 * Prototyp av flyttflödet steg 1, utan pris. Dagens flyttsida är ingången och
 * dagens ark (Begär offert, ringtid, nummer) är orört. Skillnaden börjar efter
 * Ja!: bekräftelsen stannar kvar och bjuder in till sex frivilliga steg i
 * samma ark. Varje steg sparas direkt. Ren frontend, inget lämnar webbläsaren.
 */
const DemoFlyttFlow = () => {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const search = useSearchParams()
  const demoUser = useDemoUser()
  const { answers, update, reset, loaded } = useDemoState()
  const [savedBadge, setSavedBadge] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const badgeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const step = Math.min(LAST, Math.max(0, Number(search.get('s') ?? 0) || 0))

  useEffect(() => {
    setFlyttSteg1(true)
    setMounted(true)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
  }, [step])

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
      cleanDayLong: longDay(move.movingDate, 1),
      firstName: demoUser.profile?.firstName || 'Anna',
    }
  }, [demoUser])

  const props: ScreenProps = { a: answers, update, go, next, home, savedBadge }

  // Som komponent, inte funktionsanrop: skärmarna har egna hooks och får inte dela DemoFlyttFlows hook-ordning.
  const Screen = [null, OffertScreen, TidScreen, NummerScreen, BokatScreen, AdresserScreen, BaraUtScreen, BaraInScreen, BohagScreen, StadScreen, SistaScreen, SparatScreen, SaljareScreen][step]
  const inSheet = step > 0 && step < SALJARE

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
    <div className="flex min-h-[calc(100dvh-52px)] flex-1 flex-col bg-[#E8EDF0]">
      {demoBar}
      {step === SALJARE ? (
        <div className="flex w-full flex-1 flex-col bg-white md:mx-auto md:my-6 md:max-w-[430px] md:flex-none md:overflow-clip md:rounded-[28px] md:shadow-[0_12px_40px_rgba(33,71,102,0.12)]">{Screen && <Screen key={step} {...props} />}</div>
      ) : (
        <>
          {loaded && answers.samtal && step === 0 && (
            <div className="mx-auto w-full max-w-[640px] px-4 pt-4">
              <OffertCard {...props} />
            </div>
          )}
          <MovePage completedBookings={[]} />
          {/* Portal, annars fastnar fixed i demons animerade ram. */}
          {inSheet &&
            mounted &&
            createPortal(
              <div className="fixed inset-0 z-50 flex flex-col justify-end" role="dialog" aria-modal>
                <button type="button" aria-label="Stäng" className="flex-1 bg-black/30" onClick={() => go(0)} />
                <div className="mx-auto flex max-h-[90dvh] w-full max-w-[430px] flex-col overflow-clip rounded-t-[20px] bg-white shadow-[0_-4px_24px_rgba(0,0,0,0.15)]">{Screen && <Screen key={step} {...props} />}</div>
              </div>,
              document.body,
            )}
        </>
      )}
    </div>
  )
}

export default DemoFlyttFlow
