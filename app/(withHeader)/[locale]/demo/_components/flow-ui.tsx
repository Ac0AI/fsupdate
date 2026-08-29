'use client'

import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'

/**
 * Byggstenarna för tjänsteflödena under /demo. Samma stegrad, hero, kort och
 * reglage i flytthjälp, el och de som kommer, så att flödena känns som en app
 * och inte som fem olika formulär. Ritade i Paper under Web · Appen.
 */

// Samma mjuka övergång på allt som går att trycka på. Tryck ger en liten
// nedskalning, val tonas in.
export const press =
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-out motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#51C8B4] focus-visible:ring-offset-2'
// Små reglage (piller, knappar) sjunker ihop tydligt. Hela rader och kort får
// bara en antydan, annars ser det ut som att rutan hoppar.
export const pressScale = 'motion-safe:active:scale-[0.97]'
export const pressSoft = 'motion-safe:active:scale-[0.99]'
export const rise = 'animate-[rise_.35s_ease-out_both] motion-reduce:animate-none'

export const areaInput =
  'w-full h-11 rounded-[5px] border-[1.9px] border-[#76767666] px-3 text-base text-[#000000B3] focus:outline-none focus:border-[#51C8B4] transition-colors'
export const textareaClass =
  'w-full min-h-[72px] rounded-[5px] border-[1.9px] border-[#76767666] px-3 py-2.5 text-base leading-[21px] text-[#000000B3] bg-white focus:outline-none focus:border-[#51C8B4] transition-colors'
export const errorBorder = 'border-[var(--color-error-red)] focus:border-[var(--color-error-red)]'
// Samma ram som textfälten, med systemets egen pil. Bakgrunden måste sättas,
// annars ärver select en grå ton på iOS.
export const selectClass = clsx(areaInput, 'bg-white')

export type Errors = Record<string, string>

export const StepBar = ({ step, titles, hints, label }: { step: number; titles: readonly string[]; hints: readonly string[]; label?: string }) => (
  <div className="bg-white border-b border-[#EEEEF0]">
    <div className="w-full max-w-[818px] mx-auto px-4 py-4 flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[13px] font-bold text-[#214766]">{label ?? `Steg ${step + 1} av ${titles.length} · ${titles[step]}`}</span>
        <span className="text-xs text-[#767678] shrink-0">{hints[step]}</span>
      </div>
      <div className="flex gap-1.5">
        {titles.map((_, i) => (
          <span
            key={i}
            className={clsx(
              'flex-1 h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none',
              i < step || label ? 'bg-[#51C8B4]' : i === step ? 'bg-[#214766]' : 'bg-[#EEEEF0]',
            )}
          />
        ))}
      </div>
    </div>
  </div>
)

export const Hero = ({
  title,
  copy,
  tone = 'blue',
  back,
  children,
}: {
  title: string
  copy: string
  tone?: 'blue' | 'green'
  back?: { label: string; onClick: () => void }
  children?: React.ReactNode
}) => (
  <div className={clsx('transition-colors duration-700 motion-reduce:transition-none', tone === 'green' ? 'bg-[#1F6156]' : 'bg-[#3879AD]')}>
    <div className="w-full max-w-[818px] mx-auto px-4 pt-5 pb-6 md:pt-9 md:pb-8 flex flex-col gap-2.5">
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className={clsx('self-start -my-2 min-h-11 flex items-center gap-2 text-[13px] leading-[18px] text-white/90 hover:text-white rounded-sm', press)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {back.label}
        </button>
      )}
      <h1 className="text-[32px] md:text-[42px] font-black tracking-[-0.02em] leading-9 md:leading-[48px] text-white">{title}</h1>
      <p key={copy} className={clsx('text-[15px] md:text-[18px] leading-[21px] md:leading-[25px] text-white max-w-[330px] md:max-w-[560px]', rise)}>
        {copy}
      </p>
      {children}
    </div>
  </div>
)

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={clsx('rounded-[10px] bg-white border border-[#EEEEF0] p-4', className)}>{children}</div>
)

export const Field = ({ label, hint, info, error, invalid, className, children }: { label: string; hint?: string; info?: string; error?: string; invalid?: boolean; className?: string; children: React.ReactNode }) => (
  <div className={clsx('flex-1 flex flex-col gap-1.5', className)} data-invalid={error || invalid ? 'true' : undefined}>
    <span className="text-xs text-[#767678] flex items-center gap-1">
      <span>
        {label}
        {hint && <span className="text-[#214766] font-semibold"> · {hint}</span>}
      </span>
      {info && <Info text={info} />}
    </span>
    {children}
    {error && <ErrorText>{error}</ErrorText>}
  </div>
)

export const ErrorText = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <span role="alert" className={clsx('text-xs leading-4 font-semibold text-[var(--color-error-red)]', rise, className)}>
    {children}
  </span>
)

export const Pill = ({ active, multi, small, onClick, children }: { active: boolean; multi?: boolean; small?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={clsx(
      'flex-1 rounded-full text-[13px] flex items-center justify-center gap-1.5 border whitespace-nowrap',
      small ? 'h-9 px-2' : 'h-10',
      press,
      pressScale,
      active ? 'bg-[#214766] border-[#214766] text-white font-semibold' : 'bg-white border-[#EEEEF0] text-[#214766] hover:border-[#214766]/40',
    )}
  >
    {multi && active && <Check size={12} />}
    {children}
  </button>
)

export const Radio = ({ active, onClick, title, hint }: { active: boolean; onClick: () => void; title: string; hint?: string }) => (
  <button
    type="button"
    role="radio"
    aria-checked={active}
    onClick={onClick}
    className={clsx(
      'w-full flex items-center gap-3 px-3.5 py-3 rounded-lg text-left border-2',
      press,
      pressSoft,
      active ? 'border-[#51C8B4] bg-[#F4FCFA]' : 'border-[#76767666] bg-white hover:border-[#214766]/40',
    )}
  >
    <span
      className={clsx(
        'w-5 h-5 rounded-full shrink-0 bg-white transition-[border-width,border-color] duration-200 ease-out motion-reduce:transition-none',
        active ? 'border-[6px] border-[#51C8B4]' : 'border-[1.9px] border-[#9F9FA1]',
      )}
    />
    <span className="flex flex-col gap-px">
      <span className={clsx('text-[15px] text-[#214766]', active && 'font-bold')}>{title}</span>
      {hint && <span className="text-[13px] text-[#767678]">{hint}</span>}
    </span>
  </button>
)

/**
 * Tvåradigt val: etikett och en liten förklaring. För svar som behöver en
 * definition för att vara entydiga, som starttider.
 */
export const Option = ({ active, onClick, label, hint }: { active: boolean; onClick: () => void; label: string; hint: string }) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={clsx(
      'flex-1 flex flex-col items-center gap-px py-[7px] px-1 rounded-lg border',
      press,
      pressScale,
      active ? 'bg-[#214766] border-[#214766]' : 'bg-white border-[#EEEEF0] hover:border-[#214766]/40',
    )}
  >
    <span className={clsx('text-[13px] transition-colors duration-200', active ? 'text-white font-semibold' : 'text-[#214766]')}>{label}</span>
    <span className={clsx('text-xs leading-[14px] transition-colors duration-200', active ? 'text-white/80' : 'text-[#767678]')}>{hint}</span>
  </button>
)

/** En fråga med Nej och Ja till höger. Radas på varandra som tillvalen. */
export const YesNo = ({ label, info, value, onChange }: { label: string; info?: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between gap-3 py-2 border-t border-[#EEEEF0]">
    <span className="text-[13px] font-semibold text-[#214766] flex items-center gap-1">
      {label}
      {info && <Info text={info} />}
    </span>
    <div className="flex gap-1 w-[124px] shrink-0">
      <Pill small active={!value} onClick={() => onChange(false)}>
        Nej
      </Pill>
      <Pill small active={value} onClick={() => onChange(true)}>
        Ja
      </Pill>
    </div>
  </div>
)

/**
 * Förklaring bakom en i-ikon. Mus: visas vid hovring, klick låser fast den.
 * Fingrar: ett tryck öppnar, nästa stänger, liksom tryck utanför och Escape.
 * Bubblan ritas i en portal med fast position: korten och kolumnerna har
 * egna staplingskontexter (rise-animationen sätter transform), så en vanlig
 * absolut bubbla hamnar under grannkortet på desktop. Den hoppar åt vänster
 * om den annars sticker ut i högerkanten, och uppåt nära underkanten.
 * Träffytan är 44 px fast ikonen är 16, så den går att träffa med tumme.
 */
const BUBBLE_W = 264
const BUBBLE_H = 110

export const Info = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left?: number; right?: number } | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const id = useId()

  useLayoutEffect(() => {
    if (!open || !ref.current) {
      setPos(null)
      return
    }
    const r = ref.current.getBoundingClientRect()
    const flipX = r.left + BUBBLE_W > window.innerWidth - 16
    const flipY = r.bottom + BUBBLE_H > window.innerHeight - 16
    setPos({
      ...(flipY ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
      ...(flipX ? { right: window.innerWidth - r.right } : { left: r.left }),
    })
  }, [open])

  // Fast position följer inte med när sidan rullar. Stäng i stället.
  useEffect(() => {
    if (!open) return
    const close = () => {
      setOpen(false)
      setPinned(false)
    }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false)
        setPinned(false)
      }
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setPinned(false)
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label="Mer information"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && !pinned && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => !pinned && setOpen(false)}
        onClick={() => {
          const next = !pinned
          setPinned(next)
          setOpen(next)
        }}
        className="w-11 h-11 -my-[14px] -mx-2.5 flex items-center justify-center rounded-full text-[#9F9FA1] hover:text-[#214766] transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <circle cx="12" cy="12" r="10" fill="currentColor" />
          <path d="M12 10.5v6.5M12 7.2v.3" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </button>
      {open &&
        pos &&
        createPortal(
          <span
            role="tooltip"
            id={id}
            style={pos}
            className="fixed z-50 w-max max-w-[264px] rounded-lg bg-[#011627] px-3 py-2 text-xs font-normal normal-case tracking-normal leading-[17px] text-white shadow-[0_6px_20px_rgba(1,22,39,0.25)] animate-[rise_.2s_ease-out_both] motion-reduce:animate-none"
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  )
}

export const Toggle = ({ on }: { on: boolean }) => (
  <span className={clsx('w-11 h-[26px] p-[3px] rounded-full shrink-0 flex items-center transition-colors duration-200 ease-out motion-reduce:transition-none', on ? 'bg-[#51C8B4]' : 'bg-[#D9DBDF]')}>
    <span
      className={clsx(
        'w-5 h-5 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)] transition-transform duration-200 ease-out motion-reduce:transition-none',
        on && 'translate-x-[18px]',
      )}
    />
  </span>
)

export const Checkbox = ({ checked }: { checked: boolean }) => (
  <span
    className={clsx(
      'w-[22px] h-[22px] rounded shrink-0 mt-px flex items-center justify-center transition-colors duration-200 ease-out motion-reduce:transition-none',
      checked ? 'bg-[#51C8B4]' : 'bg-white border-2 border-[#9F9FA1]',
    )}
  >
    {checked && <Check size={13} pop />}
  </span>
)

export const Check = ({ size = 12, color = '#fff', pop }: { size?: number; color?: string; pop?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={clsx(pop && 'animate-[pop_.25s_ease-out_both] motion-reduce:animate-none')}>
    <path d="M5 13l4 4L19 7" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Chevron = ({ direction = 'right', color = '#214766', size = 18 }: { direction?: 'right' | 'down'; color?: string; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={clsx('shrink-0 transition-transform duration-200', direction === 'down' && 'rotate-90')} aria-hidden>
    <path d="M9 5l7 7-7 7" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export const Primary = ({
  variant = 'solid',
  loading,
  onClick,
  children,
}: {
  variant?: 'solid' | 'outline'
  loading?: boolean
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    onClick={onClick}
    aria-busy={loading}
    className={clsx(
      'w-full md:max-w-[420px] min-h-11 rounded-full px-6 py-3 text-[15px] font-bold border-2 border-[#214766] flex items-center justify-center gap-2.5',
      press,
      'motion-safe:active:scale-[0.985]',
      variant === 'solid' ? 'bg-[#214766] text-white hover:bg-[#1A3A54] hover:border-[#1A3A54]' : 'bg-white text-[#214766] hover:bg-[#F4FCFA]',
      loading && 'opacity-80 pointer-events-none',
    )}
  >
    {loading && (
      <svg width="18" height="18" viewBox="0 0 24 24" className="animate-spin motion-reduce:animate-none" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="3" />
        <path d="M21 12a9 9 0 0 0-9-9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </svg>
    )}
    {children}
  </button>
)

export const Foot = ({ tone, children }: { tone?: 'error'; children: React.ReactNode }) => (
  <p className={clsx('text-center text-xs leading-4', tone === 'error' ? 'font-semibold text-[var(--color-error-red)]' : 'text-[#767678]')}>{children}</p>
)

export const Timeline = ({ items }: { items: { state: 'done' | 'current' | 'todo'; title: string; hint: string }[] }) => (
  <div className="flex flex-col">
    {items.map((it, i) => (
      <div key={it.title} className={clsx('flex items-start gap-3', i < items.length - 1 && 'pb-3.5')}>
        <div className="flex flex-col items-center gap-1 shrink-0 w-[22px]">
          {it.state === 'done' && (
            <span className="w-[22px] h-[22px] rounded-full bg-[#51C8B4] flex items-center justify-center animate-[pop_.45s_cubic-bezier(.2,.9,.3,1.3)_both] motion-reduce:animate-none">
              <Check size={12} />
            </span>
          )}
          {it.state === 'current' && (
            <span className="relative w-[22px] h-[22px]">
              <span className="absolute inset-0 rounded-full bg-[#214766]/30 animate-ping motion-reduce:hidden" />
              <span className="absolute inset-0 rounded-full border-[6px] border-[#214766] bg-white" />
            </span>
          )}
          {it.state === 'todo' && <span className="w-[22px] h-[22px] rounded-full border-2 border-[#EEEEF0] bg-white" />}
          {i < items.length - 1 && <span className={clsx('w-0.5 h-[22px]', it.state === 'done' ? 'bg-[#51C8B4]' : 'bg-[#EEEEF0]')} />}
        </div>
        <div className="flex flex-col gap-0.5">
          <span className={clsx('text-[13px] font-semibold', it.state === 'todo' ? 'text-[#767678]' : 'text-[#214766]')}>{it.title}</span>
          <span className="text-xs text-[#767678]">{it.hint}</span>
        </div>
      </div>
    ))}
  </div>
)

// Sidan scrollar till första felet och sätter fokus där. Knappen är aldrig död:
// den säger vad som saknas i stället.
export const focusFirstInvalid = () => {
  // Två bildrutor så felraderna hunnit ritas och sidan fått sin nya höjd,
  // annars avbryts den mjuka scrollen halvvägs av layoutskiftet.
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() => {
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      first?.querySelector<HTMLElement>('input, textarea, select')?.focus({ preventScroll: true })
    }),
  )
}

// Nytt steg börjar högst upp. globals.css sätter scroll-behavior: smooth på
// html, vilket gör varje programmatisk scroll till en animation som nästa
// anrop avbryter. Därför stängs den av under själva hoppet.
export const scrollFlowToTop = (root: HTMLElement | null) => {
  const reset = () => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    let node: HTMLElement | null = root
    while (node) {
      if (node.scrollTop > 0) node.scrollTop = 0
      node = node.parentElement
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    html.style.scrollBehavior = previous
  }
  reset()
  window.requestAnimationFrame(reset)
}

// Chromes scrollförankring håller kvar sidfoten på samma plats när ett steg
// byts ut, och flyttar tillbaka scrollen efter att vi nollat den. Stäng av den
// på dokumentet så länge ett flöde är monterat.
export const useNoScrollAnchoring = () => {
  useEffect(() => {
    const html = document.documentElement
    const previous = html.style.overflowAnchor
    html.style.overflowAnchor = 'none'
    return () => {
      html.style.overflowAnchor = previous
    }
  }, [])
}
