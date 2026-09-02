'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'

const ITEMS = ['Elavtal tecknat', 'Bredband inkopplat', 'Flytthjälp bokad', 'Flyttstädning bokad', 'Flyttanmälan skickad', 'Hemförsäkring flyttad']

// Ett varv: raderna bockas av en i taget, Nina skriver, hennes svar står kvar
// en stund, sedan tonar listan ut och en ny flytt börjar. Fas 0–6 är antal
// klara rader, 7 skriver Nina, 8 visar svaret, 9 tonar ut.
const STEP_MS = 700
const DELAYS: Record<number, number> = { 6: 600, 7: 1200, 8: 3400, 9: 550 }

const AnimatedDashboard = () => {
  const [phase, setPhase] = useState(0)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPhase(8)
      return
    }
    let timer: ReturnType<typeof setTimeout>
    const schedule = (p: number) => {
      timer = setTimeout(() => {
        const next = p >= 9 ? 0 : p + 1
        if (next === 0) setCycle((c) => c + 1)
        setPhase(next)
        schedule(next)
      }, DELAYS[p] ?? STEP_MS)
    }
    schedule(0)
    return () => clearTimeout(timer)
  }, [])

  const done = Math.min(phase, 6)
  const allDone = phase >= 6

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

      <div key={cycle} className={clsx('flex-1 flex flex-col transition-opacity duration-500', phase === 9 && 'opacity-0')}>
        {/* Adresser och räknare */}
        <div className="bg-white rounded-xl px-4 py-3 mb-3 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[12px] font-bold text-[#214766]">Din flytt</p>
            <span
              className={clsx(
                'text-[10px] font-semibold rounded-full px-2 py-0.5 transition-colors duration-300',
                allDone ? 'bg-[#51c8b4] text-[#214766]' : 'bg-[#F4FCFA] text-[#1F6156]',
              )}
            >
              {allDone ? 'Allt klart' : `${done} av ${ITEMS.length} klart`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Från</p>
              <p className="text-[11px] text-[#214766] font-medium leading-tight">Bondegatan 21,</p>
              <p className="text-[11px] text-[#214766] font-medium leading-tight">Stockholm</p>
            </div>
            <svg className="w-4 h-4 text-[#51c8b4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <div className="flex-1 min-w-0 text-right">
              <p className="text-[9px] text-[#214766]/50 font-semibold uppercase">Till</p>
              <p className="text-[11px] text-[#214766] font-medium leading-tight">Solrosvägen 4,</p>
              <p className="text-[11px] text-[#214766] font-medium leading-tight">Nacka</p>
            </div>
          </div>
        </div>

        {/* Checklistan */}
        <div className="flex-1 flex flex-col gap-[5px] overflow-hidden">
          {ITEMS.map((label, i) => {
            const checked = i < done
            return (
              <div
                key={label}
                className={clsx(
                  'flex items-center gap-3 rounded-xl px-4 py-[14px] shadow-[0_1px_3px_rgba(0,0,0,0.04)] bg-white',
                  checked && 'animate-[dash-row_.7s_ease-out_both]',
                )}
              >
                <span
                  className={clsx(
                    'w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors duration-300',
                    checked ? 'bg-[#51c8b4] border-[#51c8b4] animate-[dash-pop_.5s_cubic-bezier(.2,.9,.3,1.3)_both]' : 'border-[#d4dbe0]',
                  )}
                >
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="#214766" strokeWidth={3.5}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                      className="transition-[stroke-dashoffset] duration-300 delay-150 [stroke-dasharray:24]"
                      style={{ strokeDashoffset: checked ? 0 : 24 }}
                    />
                  </svg>
                </span>
                <span className={clsx('text-[13px] font-medium transition-colors duration-300', checked ? 'text-[#214766]' : 'text-[#214766]/55')}>{label}</span>
              </div>
            )
          })}
        </div>

        {/* Nina: först kontaktkort, sedan skriver hon, sedan står svaret kvar */}
        <div className="bg-white rounded-xl px-4 py-3.5 mt-2 shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex items-start gap-3 min-h-[68px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://ik.imagekit.io/flyttsmart/Marketing/Nina_IPgqu3hJB.jpg?tr=w-96,h-96,fo-face"
            alt="Nina Fredriksson"
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-bold text-[#214766]">Nina, din koordinator</p>
            {phase < 7 && <p className="text-[10px] leading-tight text-[#214766]/55 mt-0.5">Svarar i chatten, på mejl och i telefon</p>}
            {phase === 7 && (
              <span className="inline-flex items-center gap-1 h-6 px-2.5 mt-1 rounded-full rounded-tl-sm bg-[#EAF2F8]" aria-label="Nina skriver">
                <span className="w-1.5 h-1.5 rounded-full bg-[#214766]/50 animate-[dash-dot_1s_ease-in-out_infinite]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#214766]/50 animate-[dash-dot_1s_ease-in-out_.15s_infinite]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[#214766]/50 animate-[dash-dot_1s_ease-in-out_.3s_infinite]" />
              </span>
            )}
            {phase >= 8 && (
              <p className="inline-block text-[11px] leading-[15px] text-[#214766] bg-[#EAF2F8] rounded-xl rounded-tl-sm px-2.5 py-1.5 mt-1 animate-[dash-pop_.35s_ease-out_both]">
                Allt är bokat. Jag hör av mig om något ändras.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnimatedDashboard
