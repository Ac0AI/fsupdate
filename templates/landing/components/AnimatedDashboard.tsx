'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import BankId from '@/public/images/BankId.svg'

// Berättelsen i mockupen, "så enkelt är det": mäklaren bjuder in, BankID,
// flytten är redan ifylld, tre förslag som får ett Ja i taget, och Nina
// säger att allt är bokat. Sedan börjar den om. Mäklarbyrån är påhittad,
// adresserna är demopersonans (Storgatan 12 till Ekvägen 8).
const BROKER = { agent: 'Erik Lind', office: 'Solhöjdens Mäklarbyrå' }
const MOVE = { from: 'Storgatan 12, Stockholm', to: 'Ekvägen 8, Göteborg', toShort: 'Ekvägen 8', date: '23 september' }

const SERVICES = [
  { name: 'Flytthjälp', detail: '23 september kl 08, tre bärare', done: 'Flytthjälp bokad', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  {
    name: 'Flyttstädning',
    detail: '22 september, med städgaranti',
    done: 'Flyttstädning bokad',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  { name: 'Elavtal', detail: 'Rörligt pris utan påslag', done: 'Elavtal tecknat', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
]

type Frame =
  | { k: 'invite'; sub: 'in' | 'press' }
  | { k: 'bankid'; sub: 'idle' | 'press' | 'wait' | 'ok' }
  | { k: 'prepared' }
  | { k: 'card'; i: number; sub: 'enter' | 'press' | 'done' | 'leave' }
  | { k: 'nina' }
  | { k: 'fade' }

type Step = Frame & { ms: number }

const TIMELINE: Step[] = [
  { k: 'invite', sub: 'in', ms: 2600 },
  { k: 'invite', sub: 'press', ms: 240 },
  { k: 'bankid', sub: 'idle', ms: 900 },
  { k: 'bankid', sub: 'press', ms: 220 },
  { k: 'bankid', sub: 'wait', ms: 1100 },
  { k: 'bankid', sub: 'ok', ms: 800 },
  { k: 'prepared', ms: 2200 },
  ...SERVICES.flatMap((_, i): Step[] => [
    { k: 'card', i, sub: 'enter', ms: 1500 },
    { k: 'card', i, sub: 'press', ms: 220 },
    { k: 'card', i, sub: 'done', ms: 800 },
    { k: 'card', i, sub: 'leave', ms: 320 },
  ]),
  { k: 'nina', ms: 3200 },
  { k: 'fade', ms: 400 },
]

// Stillbilden vid reduced motion: andra förslaget, med det första redan klart.
const STILL: Frame = { k: 'card', i: 1, sub: 'enter' }

const Check = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="#214766" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

const StatusBar = ({ showTime }: { showTime: boolean }) => (
  <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 pt-1">
    <span className={clsx('text-[12px] font-semibold text-[#214766] tracking-tight', !showTime && 'invisible')}>9:41</span>
    <div className="flex items-center gap-1.5 text-[#214766]">
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
    <p className="text-[64px] font-bold text-[#214766] leading-none tracking-tight text-center">9:41</p>
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
        <p className="text-[13px] font-bold text-[#214766] mt-0.5">Din mäklare har bjudit in dig</p>
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

// Flytten som mäklaren skickat över: adresser och tillträde, inget att fylla i
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

// Ett förslag i taget, med ett Ja som trycks
const ProposalCard = ({ service, sub, still }: { service: (typeof SERVICES)[number]; sub: 'enter' | 'press' | 'done' | 'leave'; still: boolean }) => {
  const said = sub === 'done' || sub === 'leave'
  return (
    <div
      className={clsx(
        'bg-white rounded-xl px-4 py-3.5 shadow-[0_2px_10px_rgba(33,71,102,0.08)] border border-[#EEEEF0]',
        !still && (sub === 'leave' ? 'animate-[dash-out_.32s_ease-in_both]' : 'animate-[dash-in_.4s_ease-out_both]'),
      )}
    >
      <div className="flex items-center gap-3">
        <span className="w-9 h-9 rounded-full bg-[#EAF2F8] flex items-center justify-center flex-shrink-0">
          <svg className="w-[18px] h-[18px] text-[#214766]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
          </svg>
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#214766]">{service.name}</p>
          <p className="text-[11px] text-[#214766]/70 leading-snug mt-0.5">{service.detail}</p>
        </div>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span
          className={clsx(
            'h-9 flex-1 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-bold text-[#214766] transition-[transform,background-color] duration-200',
            said ? 'bg-[#51C8B4]' : 'bg-[#FFA65F]',
            sub === 'press' && 'scale-95',
          )}
        >
          {said && <Check className="w-3.5 h-3.5 animate-[dash-pop_.35s_ease-out_both]" />}
          {said ? 'Klart' : 'Ja'}
        </span>
        <span className="text-[11px] text-[#214766]/60 px-2">Ändra</span>
      </div>
    </div>
  )
}

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
        <p className="text-[10px] leading-tight text-[#214766]/55 mt-0.5">Svarar i chatten, på mejl och i telefon</p>
      )}
    </div>
  </div>
)

// Flyttsidan: kortet från mäklaren, förslagen ett i taget, klart-listan, Nina
const Home = ({ f, still }: { f: Frame; still: boolean }) => {
  const doneCount = f.k === 'card' ? f.i : f.k === 'nina' || f.k === 'fade' ? SERVICES.length : 0
  const talking = f.k === 'nina' || f.k === 'fade'
  return (
    <>
      <MoveCard />
      {f.k === 'prepared' && (
        <p className={clsx('text-[12px] font-medium text-[#214766]/60 mt-3 px-1', !still && 'animate-[dash-in_.4s_ease-out_.6s_both]')}>Inget att fylla i.</p>
      )}
      {f.k === 'card' && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#214766]/55 mt-4 mb-1.5 px-1">
            Vårt förslag · {f.i + 1} av {SERVICES.length}
          </p>
          <ProposalCard key={f.i} service={SERVICES[f.i]} sub={f.sub} still={still} />
        </>
      )}
      {doneCount > 0 && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#214766]/55 mt-4 mb-1.5 px-1">Klart</p>
          <div className="flex flex-col gap-[5px]">
            {SERVICES.slice(0, doneCount).map((s, j) => (
              <div
                key={s.name}
                className={clsx(
                  'flex items-center gap-3 bg-white rounded-xl px-4 py-[11px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]',
                  !still && j === doneCount - 1 && 'animate-[dash-in_.4s_ease-out_both]',
                )}
              >
                <span className="w-[18px] h-[18px] rounded-full bg-[#51c8b4] flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 [&>path]:stroke-[3.5]" />
                </span>
                <span className="text-[12px] font-medium text-[#214766]">{s.done}</span>
              </div>
            ))}
          </div>
        </>
      )}
      <NinaCard message={talking ? 'Allt är bokat. Jag ringer dagen innan flytten.' : null} still={still} />
    </>
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
    const timer = setTimeout(() => setFi((i) => (i + 1) % TIMELINE.length), TIMELINE[fi].ms)
    return () => clearTimeout(timer)
  }, [fi])

  const f: Frame = still ? STILL : TIMELINE[fi]
  const scene = f.k === 'invite' ? 'invite' : f.k === 'bankid' ? 'bankid' : 'home'

  return (
    <div className="animated-dashboard absolute inset-0 flex flex-col bg-[#f8faf9] pt-12 px-3 pb-3">
      <StatusBar showTime={scene !== 'invite'} />
      <div
        key={scene}
        className={clsx('flex flex-col flex-1 min-h-0', !still && (f.k === 'fade' ? 'animate-[dash-out_.4s_ease-in_both]' : 'animate-[dash-in_.4s_ease-out_both]'))}
      >
        {f.k === 'invite' && <Invite pressed={f.sub === 'press'} />}
        {f.k === 'bankid' && <Login sub={f.sub} />}
        {scene === 'home' && <Home f={f} still={still} />}
      </div>
    </div>
  )
}

export default AnimatedDashboard
