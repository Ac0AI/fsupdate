'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import BankId from '@/public/images/BankId.svg'

// Berättelsen i mockupen, "så enkelt är det": inbjudan, BankID, hela flytten
// ligger färdig, ett tryck på Få det gjort och allt blir klart på några
// sekunder, Nina hör av sig, och slutbilden med fördelarna och Flyttsmart står
// kvar. Spelas en gång. Mäklarbyrån är påhittad, adresserna är demopersonans.
const BROKER = { agent: 'Erik Lind', office: 'Solhöjdens Mäklarbyrå' }
const MOVE = { from: 'Storgatan 12, Stockholm', to: 'Ekvägen 8, Göteborg', toShort: 'Ekvägen 8', date: '23 september' }

const SERVICES = [
  { name: 'Elavtal', detail: 'Rörligt pris utan påslag', done: 'Elavtal tecknat', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  {
    name: 'Bredband',
    detail: 'Fiber, klart till inflytt',
    done: 'Bredband beställt',
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  },
  {
    name: 'Hemförsäkring',
    detail: 'Flyttas till Ekvägen 8',
    done: 'Hemförsäkring flyttad',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  { name: 'Flytthjälp', detail: '23 september, tre bärare', done: 'Flytthjälp bokad', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  {
    name: 'Flyttstädning',
    detail: '22 september, städgaranti',
    done: 'Flyttstädning bokad',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    name: 'Adressändring',
    detail: 'Skatteverket, från 23 september',
    done: 'Adressändring skickad',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
]

type AllSub = 'enter' | 'idle' | 'press' | 'work' | 'complete'
type Frame =
  | { k: 'invite'; sub: 'in' | 'press' }
  | { k: 'bankid'; sub: 'idle' | 'press' | 'wait' | 'ok' }
  | { k: 'all'; sub: AllSub; done: number }
  | { k: 'nina' }
  | { k: 'brand' }

type Step = Frame & { ms: number }

const TIMELINE: Step[] = [
  { k: 'invite', sub: 'in', ms: 2600 },
  { k: 'invite', sub: 'press', ms: 240 },
  { k: 'bankid', sub: 'idle', ms: 900 },
  { k: 'bankid', sub: 'press', ms: 220 },
  { k: 'bankid', sub: 'wait', ms: 1100 },
  { k: 'bankid', sub: 'ok', ms: 800 },
  { k: 'all', sub: 'enter', done: 0, ms: 900 },
  { k: 'all', sub: 'idle', done: 0, ms: 1100 },
  { k: 'all', sub: 'press', done: 0, ms: 220 },
  ...SERVICES.map((_, i): Step => ({ k: 'all', sub: 'work', done: i + 1, ms: 200 })),
  { k: 'all', sub: 'complete', done: SERVICES.length, ms: 1900 },
  { k: 'nina', ms: 2600 },
  // Slutbilden står kvar, ingen tid
  { k: 'brand', ms: 0 },
]

// Stillbilden vid reduced motion: slutbilden.
const STILL: Frame = { k: 'brand' }


const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#214766" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const StatusBar = ({ showTime, dark = false }: { showTime: boolean; dark?: boolean }) => (
  <div className={clsx('absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 pt-1 z-10', dark ? 'text-white' : 'text-[#214766]')}>
    <span className={clsx('text-[12px] font-semibold tracking-tight', !showTime && 'invisible')}>16:24</span>
    <div className="flex items-center gap-1.5">
      <svg className="w-4 h-3" viewBox="0 0 16 12" fill="currentColor">
        <rect x="0" y="8" width="3" height="4" rx="0.5" />
        <rect x="4.5" y="5.5" width="3" height="6.5" rx="0.5" />
        <rect x="9" y="3" width="3" height="9" rx="0.5" />
        <rect x="13.5" y="0" width="2.5" height="12" rx="0.5" opacity="0.35" />
      </svg>
      <svg className="w-6 h-3" viewBox="0 0 25 12" fill="none">
        <rect x="0.5" y="0.5" width="21" height="11" rx="3" stroke="currentColor" opacity="0.45" />
        <rect x="2" y="2" width="15" height="8" rx="1.5" fill="currentColor" />
        <path d="M23 4v4c1-.3 1.7-1 1.7-2S24 4.3 23 4z" fill="currentColor" opacity="0.45" />
      </svg>
    </div>
  </div>
)

// Låsskärmen: klockan och en notis från mäklaren
const Invite = ({ pressed }: { pressed: boolean }) => (
  <div className="flex flex-col flex-1 pt-8">
    <p className="text-[64px] font-bold text-[#214766] leading-none tracking-tight text-center">16:24</p>
    <p className="text-[13px] font-medium text-[#214766]/60 text-center mt-2">Måndag 2 september</p>
    <div
      className={clsx(
        'mt-10 bg-white rounded-2xl px-3.5 py-3 shadow-[0_2px_12px_rgba(33,71,102,0.12)] flex gap-3 transition-transform duration-200',
        pressed && 'scale-[0.97]',
      )}
    >
      <span className="w-9 h-9 rounded-[10px] bg-[#214766] flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 11l9-8 9 8M5 9.5V20h14V9.5" />
        </svg>
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#214766]/55">Flyttsmart</p>
          <p className="text-[10px] text-[#214766]/45">nu</p>
        </div>
        <p className="text-[13px] font-bold text-[#214766] mt-0.5">Du har blivit inbjuden till Flyttsmart.</p>
        <p className="text-[11px] text-[#214766]/75 leading-snug mt-0.5">
          {BROKER.agent} på {BROKER.office} har förberett din flytt till {MOVE.toShort}.
        </p>
      </div>
    </div>
  </div>
)

// Inloggningen: en knapp som trycks, BankID öppnas, namnet kommer tillbaka
const Login = ({ sub }: { sub: 'idle' | 'press' | 'wait' | 'ok' }) => (
  <div className="flex flex-col flex-1 justify-center px-2 pb-20">
    <p className="text-[24px] font-bold text-[#214766] leading-tight">Din flytt är förberedd.</p>
    <p className="text-[13px] text-[#214766]/70 leading-snug mt-2">{BROKER.office} har lagt in adresserna och tillträdet. Logga in så ser du allt.</p>
    <div
      className={clsx(
        'mt-6 h-12 rounded-full flex items-center justify-center gap-2 text-[13px] font-bold text-[#214766] transition-[transform,background-color] duration-200',
        sub === 'ok' ? 'bg-[#51C8B4]' : sub === 'wait' ? 'bg-[#EAF2F8]' : 'bg-[#FFA65F]',
        sub === 'press' && 'scale-95',
      )}
    >
      {sub === 'wait' && (
        <>
          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#214766" strokeWidth="3" opacity="0.2" />
            <path d="M21 12a9 9 0 00-9-9" stroke="#214766" strokeWidth="3" strokeLinecap="round" />
          </svg>
          Öppnar BankID
        </>
      )}
      {sub === 'ok' && (
        <>
          <Check className="w-4 h-4 animate-[dash-pop_.35s_ease-out_both]" />
          Anna Berg
        </>
      )}
      {(sub === 'idle' || sub === 'press') && (
        <>
          Logga in med BankID
          <BankId className="w-5 h-5" />
        </>
      )}
    </div>
  </div>
)

// Flytten som mäklaren skickat över: adresser och tillträde
const MoveCard = () => (
  <div className="bg-white rounded-xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[12px] font-bold text-[#214766]">Din flytt</p>
      <span className="text-[9px] font-semibold text-[#1F6156] bg-[#F4FCFA] rounded-full px-1.5 py-px">Från din mäklare</span>
    </div>
    <div className="flex items-center gap-2">
      <div className="flex-1 min-w-0">
        <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Från</p>
        <p className="text-[11px] text-[#214766] font-medium leading-tight">{MOVE.from}</p>
      </div>
      <svg className="w-4 h-4 text-[#FFA65F] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Till</p>
        <p className="text-[11px] text-[#214766] font-medium leading-tight">{MOVE.to}</p>
      </div>
    </div>
    <p className="text-[10px] text-[#214766]/60 mt-2 pt-2 border-t border-[#EEEEF0]">Tillträde {MOVE.date}</p>
  </div>
)

// En rad per del av flytten: förslag tills den blir klar
const Row = ({ service, done, delay, still }: { service: (typeof SERVICES)[number]; done: boolean; delay: number; still: boolean }) => (
  <div
    className={clsx('flex items-center gap-3 bg-white rounded-xl px-3.5 h-[42px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]', !still && 'animate-[dash-in_.4s_ease-out_both]')}
    style={{ animationDelay: `${delay}ms` }}
  >
    <span
      className={clsx(
        'w-[26px] h-[26px] rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200',
        done ? 'bg-[#51C8B4]' : 'bg-[#EAF2F8]',
      )}
    >
      {done ? (
        <Check className={clsx('w-3 h-3', !still && 'animate-[dash-pop_.35s_ease-out_both]')} />
      ) : (
        <svg className="w-3.5 h-3.5 text-[#214766]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
        </svg>
      )}
    </span>
    {done ? (
      <span className="text-[12px] font-medium text-[#214766]">{service.done}</span>
    ) : (
      <span className="flex flex-col min-w-0">
        <span className="text-[12px] font-bold text-[#214766] leading-[14px]">{service.name}</span>
        <span className="text-[10px] text-[#214766]/60 leading-[13px] truncate">{service.detail}</span>
      </span>
    )}
  </div>
)

// Nina: kontaktkort som blir ett meddelande när hon har något att säga
const NinaCard = ({ message, still }: { message: string | null; still: boolean }) => (
  <div className="mt-auto bg-white rounded-xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-start gap-3 min-h-[64px]">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="https://ik.imagekit.io/flyttsmart/Marketing/Nina_IPgqu3hJB.jpg?tr=w-96,h-96,fo-face"
      alt="Nina Fredriksson"
      className="w-9 h-9 rounded-full object-cover flex-shrink-0"
    />
    <div className="flex-1 min-w-0">
      <div className="flex items-baseline gap-1.5">
        <p className="text-[12px] font-bold text-[#214766]">Nina</p>
        <p className="text-[10px] text-[#214766]/50">{message ? 'nu' : 'din koordinator'}</p>
      </div>
      {message ? (
        <p className={clsx('inline-block text-[11px] leading-[15px] text-[#214766] bg-[#EAF2F8] rounded-xl rounded-tl-sm px-2.5 py-1.5 mt-1', !still && 'animate-[dash-in_.35s_ease-out_both]')}>
          {message}
        </p>
      ) : (
        <p className="text-[10px] leading-tight text-[#214766]/55 mt-0.5">Hör av dig när du vill</p>
      )}
    </div>
  </div>
)

// Flyttsidan: kortet från mäklaren, hela flytten som förslag, ett Ja, allt klart
const Home = ({ f, still }: { f: Frame; still: boolean }) => {
  const sub: AllSub = f.k === 'all' ? f.sub : 'complete'
  const done = f.k === 'all' ? f.done : SERVICES.length
  const complete = sub === 'complete'
  const stagger = (i: number) => (sub === 'enter' ? 80 + i * 70 : 0)
  return (
    <>
      <MoveCard />
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#214766]/55 mt-3 mb-1.5 px-1">
        {complete ? 'Klart' : 'Vårt förslag · hela flytten'}
      </p>
      <div className="flex flex-col gap-[5px]">
        {SERVICES.map((s, i) => (
          <Row key={s.name} service={s} done={i < done} delay={stagger(i)} still={still} />
        ))}
      </div>
      <div
        className={clsx(
          'mt-3 h-10 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#214766] transition-[transform,background-color] duration-200',
          complete ? 'bg-[#51C8B4]' : sub === 'work' ? 'bg-[#EAF2F8]' : 'bg-[#FFA65F]',
          sub === 'press' && 'scale-95',
          !still && 'animate-[dash-in_.4s_ease-out_both]',
        )}
        style={{ animationDelay: `${stagger(SERVICES.length)}ms` }}
      >
        {complete && <Check className={clsx('w-3.5 h-3.5', !still && 'animate-[dash-pop_.35s_ease-out_both]')} />}
        {complete ? 'Allt klart' : sub === 'work' ? 'Ordnar allt' : 'Få det gjort'}
      </div>
      <NinaCard message={f.k === 'nina' ? 'Allt är bokat. Jag ringer dagen innan flytten.' : null} still={still} />
    </>
  )
}

// Slutbilden: Ninas bekräftelse i appens röst. Det som kommer med datum och tid, det
// som är klart med status i grått, första kvällen i nya hemmet, Nina som avslut. Står kvar.
const BLOCKS: { title: string; rows: { name: string; value: string }[]; done?: boolean }[] = [
  {
    title: 'Kommer',
    rows: [
      { name: 'Flyttstädning', value: '22 sep, kl 8' },
      { name: 'Flytthjälp', value: '23 sep, kl 8, tre bärare' },
    ],
  },
  {
    title: 'Klart',
    done: true,
    rows: [
      { name: 'Elavtal', value: 'Tecknat' },
      { name: 'Bredband', value: 'Beställt' },
      { name: 'Hemförsäkring', value: 'Flyttad' },
      { name: 'Adressändring', value: 'Skickad' },
    ],
  },
]

const Brand = ({ still }: { still: boolean }) => {
  const rise = !still && 'animate-[dash-in_.4s_ease-out_both]'
  const at = (ms: number) => (still ? undefined : { animationDelay: `${ms}ms` })
  let n = 0
  return (
    <div className="flex flex-col flex-1 px-1 pt-2 pb-2">
      <p className={clsx('text-[26px] font-bold text-[#214766] leading-[1.12] tracking-tight', rise)} style={at(100)}>
        Allt är bokat, Anna.
      </p>

      <div className="mt-5 flex flex-col gap-4">
        {BLOCKS.map((b) => (
          <div key={b.title} className="flex flex-col">
            <p className={clsx('text-[11px] font-semibold uppercase tracking-[0.1em] text-[#214766]/70 mb-1', rise)} style={at(300 + n++ * 55)}>
              {b.title}
            </p>
            {b.rows.map((r) => (
              <div key={r.name} className={clsx('flex items-baseline justify-between gap-3 h-[30px]', rise)} style={at(300 + n++ * 55)}>
                <span className="text-[14px] font-semibold text-[#214766]">{r.name}</span>
                <span className={clsx('text-[13px] text-right', b.done ? 'text-[#214766]/55' : 'text-[#214766]')}>{r.value}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/brand/inflyttad-888.webp"
        alt="Första kvällen i nya hemmet"
        width={296}
        height={148}
        className={clsx('mt-5 w-full h-[176px] object-cover rounded-2xl', rise)}
        style={at(850)}
      />

      <div className={clsx('mt-auto pt-3 flex items-start gap-2.5', rise)} style={at(950)}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://ik.imagekit.io/flyttsmart/Marketing/Nina_IPgqu3hJB.jpg?tr=w-96,h-96,fo-face"
          alt="Nina Fredriksson"
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
        <span className="flex flex-col min-w-0">
          <span className="text-[12px] text-[#214766]">
            <span className="font-bold">Nina Fredriksson</span>
            <span className="text-[#214766]/70"> · din koordinator</span>
          </span>
          <span className="text-[14px] font-medium text-[#214766] leading-snug mt-1">Jag ringer dig dagen innan flytten. Hör av dig om något ändras.</span>
        </span>
      </div>
    </div>
  )
}

const AnimatedDashboard = () => {
  const [fi, setFi] = useState(0)
  const [still, setStill] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true)
      return
    }
    if (fi >= TIMELINE.length - 1) return
    const timer = setTimeout(() => setFi((i) => i + 1), TIMELINE[fi].ms)
    return () => clearTimeout(timer)
  }, [fi])

  const f: Frame = still ? STILL : TIMELINE[fi]
  const scene = f.k === 'invite' ? 'invite' : f.k === 'bankid' ? 'bankid' : f.k === 'brand' ? 'brand' : 'home'

  return (
    <div className="animated-dashboard absolute inset-0 flex flex-col bg-[#f8faf9] pt-12 px-3 pb-3">
      <StatusBar showTime={scene !== 'invite'} />
      <div
        key={scene}
        className={clsx('flex flex-col flex-1 min-h-0', !still && 'animate-[dash-in_.4s_ease-out_both]')}
      >
        {f.k === 'invite' && <Invite pressed={f.sub === 'press'} />}
        {f.k === 'bankid' && <Login sub={f.sub} />}
        {scene === 'home' && <Home f={f} still={still} />}
        {scene === 'brand' && <Brand still={still} />}
      </div>
    </div>
  )
}

export default AnimatedDashboard
