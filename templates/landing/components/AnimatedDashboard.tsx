'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

// Berättelsen i mockupen: en rekommendation i taget, ett tryck på Säg ja,
// raden landar i klart-listan och Nina hör av sig däremellan. Loopen har
// ingen omstart: listan visar de tre senaste och nästa förslag kommer alltid.
const SERVICES = [
  { name: 'Elavtal', detail: 'Rörligt pris utan påslag', done: 'Elavtal tecknat', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
  {
    name: 'Bredband',
    detail: 'Fiber, inkopplat till inflytt',
    done: 'Bredband inkopplat',
    icon: 'M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0',
  },
  { name: 'Flytthjälp', detail: '23 september kl 08, tre bärare', done: 'Flytthjälp bokad', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4', nina: 'Flytthjälpen är bokad. Jag ringer firman dagen innan.' },
  {
    name: 'Flyttstädning',
    detail: '22 september, med städgaranti',
    done: 'Flyttstädning bokad',
    icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z',
  },
  {
    name: 'Flyttanmälan',
    detail: 'Skatteverket, från 23 september',
    done: 'Flyttanmälan skickad',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    name: 'Hemförsäkring',
    detail: 'Flyttas till Solrosvägen 4',
    done: 'Hemförsäkring flyttad',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
    nina: 'Allt är klart. Hör av dig om något ändras.',
  },
]

type Stage = 'enter' | 'press' | 'done' | 'leave'
const STAGE_MS: Record<Stage, number> = { enter: 1500, press: 220, done: 800, leave: 320 }

const AnimatedDashboard = () => {
  const [idx, setIdx] = useState(0)
  const [stage, setStage] = useState<Stage>('enter')
  const [doneList, setDoneList] = useState<{ id: number; label: string }[]>([
    { id: -4, label: 'Flytthjälp bokad' },
    { id: -3, label: 'Flyttstädning bokad' },
    { id: -2, label: 'Flyttanmälan skickad' },
    { id: -1, label: 'Hemförsäkring flyttad' },
  ])
  const [nina, setNina] = useState<string | null>(null)
  const [still, setStill] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setStill(true)
      return
    }
    let timer: ReturnType<typeof setTimeout>
    let ninaTimer: ReturnType<typeof setTimeout>
    let i = 0
    let tick = 0
    const run = (s: Stage) => {
      setStage(s)
      timer = setTimeout(() => {
        if (s === 'enter') return run('press')
        if (s === 'press') return run('done')
        if (s === 'done') return run('leave')
        // leave: raden landar i listan, nästa förslag kommer
        const service = SERVICES[i]
        tick += 1
        const id = tick
        setDoneList((list) => [...list, { id, label: service.done }].slice(-4))
        if (service.nina) {
          setNina(service.nina)
          clearTimeout(ninaTimer)
          ninaTimer = setTimeout(() => setNina(null), 3200)
        }
        i = (i + 1) % SERVICES.length
        setIdx(i)
        run('enter')
      }, STAGE_MS[s])
    }
    run('enter')
    return () => {
      clearTimeout(timer)
      clearTimeout(ninaTimer)
    }
  }, [])

  const s = SERVICES[idx]
  const said = stage === 'done' || stage === 'leave'

  return (
    <div className="animated-dashboard absolute inset-0 flex flex-col bg-[#f8faf9] pt-12 px-3 pb-3">
      {/* Statusrad */}
      <div className="absolute top-0 left-0 right-0 h-11 flex items-center justify-between px-6 pt-1">
        <span className="text-[12px] font-semibold text-[#214766] tracking-tight">9:41</span>
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

      {/* Adresser */}
      <div className="bg-white rounded-xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
        <p className="text-[12px] font-bold text-[#214766] mb-2">Din flytt</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Från</p>
            <p className="text-[11px] text-[#214766] font-medium leading-tight">Bondegatan 21, Stockholm</p>
          </div>
          <svg className="w-4 h-4 text-[#FFA65F] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <div className="flex-1 min-w-0 text-right">
            <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Till</p>
            <p className="text-[11px] text-[#214766] font-medium leading-tight">Solrosvägen 4, Nacka</p>
          </div>
        </div>
      </div>

      {/* Nästa förslag: ett i taget, med ett Säg ja som trycks */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#214766]/55 mt-4 mb-1.5 px-1">Nästa steg</p>
      <div
        key={idx}
        className={clsx(
          'bg-white rounded-xl px-4 py-3.5 shadow-[0_2px_10px_rgba(33,71,102,0.08)] border border-[#EEEEF0]',
          !still && (stage === 'leave' ? 'animate-[dash-out_.32s_ease-in_both]' : 'animate-[dash-in_.4s_ease-out_both]'),
        )}
      >
        <div className="flex items-center gap-3">
          <span className="w-9 h-9 rounded-full bg-[#EAF2F8] flex items-center justify-center flex-shrink-0">
            <svg className="w-[18px] h-[18px] text-[#214766]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
            </svg>
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-bold text-[#214766]">{s.name}</p>
              <span className="text-[9px] font-semibold text-[#1F6156] bg-[#F4FCFA] rounded-full px-1.5 py-px">Vårt förslag</span>
            </div>
            <p className="text-[11px] text-[#214766]/70 leading-snug mt-0.5">{s.detail}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={clsx(
              'h-9 flex-1 rounded-full flex items-center justify-center gap-1.5 text-[12px] font-bold transition-[transform,background-color,color] duration-200',
              said ? 'bg-[#51C8B4] text-[#214766]' : 'bg-[#FFA65F] text-[#214766]',
              stage === 'press' && 'scale-95',
            )}
          >
            {said && (
              <svg className="w-3.5 h-3.5 animate-[dash-pop_.35s_ease-out_both]" viewBox="0 0 24 24" fill="none" stroke="#214766" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            )}
            {said ? 'Klart' : 'Säg ja'}
          </span>
          <span className="text-[11px] text-[#214766]/60 px-2">Ändra</span>
        </div>
      </div>

      {/* Klart-listan: de tre senaste, nya rader landar underifrån */}
      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#214766]/55 mt-4 mb-1.5 px-1">Klart</p>
      <div className="flex flex-col gap-[5px]">
        {doneList.map((d) => (
          <div key={d.id} className={clsx('flex items-center gap-3 bg-white rounded-xl px-4 py-[11px] shadow-[0_1px_3px_rgba(0,0,0,0.04)]', !still && d.id > 0 && 'animate-[dash-in_.4s_ease-out_both]')}>
            <span className="w-[18px] h-[18px] rounded-full bg-[#51c8b4] flex items-center justify-center flex-shrink-0">
              <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#214766" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <span className="text-[12px] font-medium text-[#214766]">{d.label}</span>
          </div>
        ))}
      </div>

      {/* Nina: kontaktkort som blir ett meddelande när hon har något att säga */}
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
            <p className="text-[10px] text-[#214766]/50">{nina ? 'nu' : 'din koordinator'}</p>
          </div>
          {nina ? (
            <p key={nina} className="inline-block text-[11px] leading-[15px] text-[#214766] bg-[#EAF2F8] rounded-xl rounded-tl-sm px-2.5 py-1.5 mt-1 animate-[dash-in_.35s_ease-out_both]">
              {nina}
            </p>
          ) : (
            <p className="text-[10px] leading-tight text-[#214766]/55 mt-0.5">Svarar i chatten, på mejl och i telefon</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnimatedDashboard
