'use client'

import { useCallback, useEffect, useMemo } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { useDemoUser } from '@/common/data/useDemoUser'
import { setFlyttSteg1 } from '@/common/utils/demoNavigation'
import MovePage from '@/templates/MovePage'
import { answeredCount, useDemoState } from './state'
import { AdresserScreen, BaraInScreen, BaraUtScreen, BohagScreen, KlartScreen, RequestedCard, SaljareScreen, SistaScreen, SmsScreen, SparatScreen, StadScreen, type Home, type ScreenProps } from './screens'

const STEPS = ['Flyttsidan', 'Klart', 'Adresser', 'Bära ut', 'Bära in', 'Vad ska med', 'Städning', 'Sista detaljerna', 'Allt sparat', 'Sms:et', 'Säljaren']
const LAST = STEPS.length - 1

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
const longDay = (iso: string) => {
  const d = parse(iso)
  if (!d) return 'fredag 30 oktober'
  return new Intl.DateTimeFormat('sv-SE', { weekday: 'long', day: 'numeric', month: 'long' }).format(d)
}

/**
 * Prototyp av flyttflödet steg 1, utan pris: dagens flyttsida är ingången,
 * Begär pris skapar en Opportunity, sedan sex frivilliga steg med samma
 * frågor som Nils prototyp och Harrys guide. Allt sparas direkt, säljaren
 * ringer med priset. Ren frontend, inget lämnar webbläsarens session.
 */
const DemoFlyttFlow = () => {
  const router = useRouter()
  const params = useParams<{ locale: string }>()
  const search = useSearchParams()
  const demoUser = useDemoUser()
  const { answers, update, reset, loaded } = useDemoState()

  const step = Math.min(LAST, Math.max(0, Number(search.get('s') ?? 0) || 0))

  useEffect(() => {
    setFlyttSteg1(true)
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

  const home: Home = useMemo(() => {
    const move = demoUser.currentMove
    return {
      from: move.fromAddress?.street || 'Storgatan 12',
      to: move.toAddress?.street || 'nya adressen',
      fromKvm: move.fromResidenceSize || 62,
      moveDay: shortDay(move.movingDate),
      moveDayLong: longDay(move.movingDate),
      cleanDay: shortDay(move.movingDate, 1),
      firstName: demoUser.profile?.firstName || 'Anna',
    }
  }, [demoUser])

  const props: ScreenProps = { a: answers, update, go, home }

  // Som komponent, inte funktionsanrop: skärmarna har egna hooks och får inte dela DemoFlyttFlows hook-ordning.
  const Screen = [null, KlartScreen, AdresserScreen, BaraUtScreen, BaraInScreen, BohagScreen, StadScreen, SistaScreen, SparatScreen, SmsScreen, SaljareScreen][step]

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
      {step === 0 ? (
        <>
          {loaded && answers.requested && (
            <div className="mx-auto w-full max-w-[640px] px-4 pt-4">
              <RequestedCard {...props} />
            </div>
          )}
          <MovePage completedBookings={[]} />
        </>
      ) : (
        <div className="flex w-full flex-1 flex-col bg-white md:mx-auto md:my-6 md:max-w-[430px] md:flex-none md:overflow-clip md:rounded-[28px] md:shadow-[0_12px_40px_rgba(33,71,102,0.12)]">{Screen && <Screen key={step} {...props} />}</div>
      )}
    </div>
  )
}

export default DemoFlyttFlow
