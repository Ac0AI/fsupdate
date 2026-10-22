'use client'

import { CalendarDays, Check, ChevronLeft, ChevronRight, ChevronUp, Info, Minus, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type KeyboardEvent as TangentEvent,
  type PointerEvent as PekEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import Button from '@/components/atoms/Button'
import SiteChip from '@/components/atoms/Chip'
import { AVSTAND_MAX, AVSTAND_STEG, FLOORS, TOTAL, avstandText, harAvstand, type Avstand, type FonsterTyp } from './state'
import { addDays, fmtLongDate, fmtMonth, fmtShort, fmtWeekTitle, fmtWeekday, fromIso, isSelectable, isSlotPassed, maxDay, monthGrid, sameDay, slotsFor, startOfWeek, toIso, weekDays } from './datum'

/*
 * Byggstenar för arket och frågestegen, i sajtens tokens och atomer. Frågan
 * först, full bredd, Fortsätt fast i botten av arket. Marginaler ligger på
 * omslutande div:ar eftersom sajtens reset-css nollar margin på button.
 */

const noop = () => undefined

const DISABLED_VARS = { '--color-disabled-button-bg': '#E2E8F0', '--color-disabled-button-border': '#E2E8F0', '--color-disabled-button-color': '#475569' } as CSSProperties

export const STEG = ['Adresser', 'Bära ut', 'Bära in', 'Vad ska med', 'Städning', 'Sista detaljerna'] as const

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={clsx('text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-inactive-dark)]', className)}>{children}</p>
)

export const PrimaryButton = ({
  children,
  onClick,
  tone = 'navy',
  disabled,
  inactive,
  onInactiveClick,
  className,
  rounded,
}: {
  children: string
  onClick?: () => void
  tone?: 'orange' | 'navy' | 'outline' | 'ghost'
  disabled?: boolean
  /** Ser ut som disabled men går att trycka på: klicket går till onInactiveClick (visa vilken fråga som saknas, David 21 okt). */
  inactive?: boolean
  onInactiveClick?: () => void
  className?: string
  rounded?: boolean
}) => (
  // Grå knapp med läsbar text: sajtens disabled-variant läser färgerna från CSS-variabler, så de byts här.
  <div className={clsx('w-full', className, inactive && 'cursor-pointer')} style={disabled || inactive ? DISABLED_VARS : undefined} onClick={inactive ? onInactiveClick : undefined}>
    <Button
      variant={tone === 'orange' ? 'orange' : tone === 'navy' ? 'primary' : tone === 'outline' ? 'outline' : 'ghostInverted'}
      withFullWidth
      fontSize={16}
      disabled={disabled || inactive}
      onClick={onClick ?? noop}
      text={children}
      className={clsx('min-h-[48px]', rounded && '!rounded-xl', (disabled || inactive) && '!opacity-100 [-webkit-text-fill-color:#475569]', inactive && 'pointer-events-none')}
    />
  </div>
)

/** Grå Fortsätt: scrolla till första obesvarade frågan och låt den blinka grönt (David 21 okt, Nils runda 3). */
export const visaSaknadFraga = () => {
  const el = document.querySelector<HTMLElement>('[data-scroll] [data-kvar="1"]')
  if (!el) return
  el.scrollIntoView({ block: 'center', behavior: 'smooth' })
  el.style.transition = 'box-shadow 250ms ease'
  el.style.borderRadius = '12px'
  el.style.boxShadow = '0 0 0 4px #86EFAC'
  window.setTimeout(() => {
    el.style.boxShadow = '0 0 0 0 rgba(134,239,172,0)'
  }, 1200)
}

export const TextLink = ({ children, onClick, className, muted }: { children: ReactNode; onClick?: () => void; className?: string; muted?: boolean }) => (
  <button type="button" onClick={onClick} className={clsx('text-[14px] font-bold', muted ? 'text-[var(--color-inactive-dark)]' : 'text-[var(--color-secondary-main)]', className)}>
    {children}
  </button>
)

export const Chip = ({ children, selected, onClick, small, icon }: { children: ReactNode; selected?: boolean; onClick?: () => void; small?: boolean; icon?: ReactNode }) => (
  <SiteChip active={!!selected} onClick={onClick ?? noop} size={small ? 'sm' : 'md'}>
    {icon ? (
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden className="shrink-0">
          {icon}
        </span>
        {children}
      </span>
    ) : (
      children
    )}
  </SiteChip>
)

export const ChipRow = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap gap-2">{children}</div>

/** Ja/Nej och andra korta val som chips, samma vikt som övriga val (Nils 21 okt: de breda knapparna bröt hierarkin). */
export const ChoiceRow = <T extends string>({ options, value, onChange }: { options: [T, string][]; value?: T; onChange: (v: T) => void }) => (
  <ChipRow>
    {options.map(([v, label]) => (
      <Chip key={v} selected={value === v} onClick={() => onChange(v)}>
        {label}
      </Chip>
    ))}
  </ChipRow>
)

/**
 * Varför vi frågar: en i-ikon direkt efter frågan, ingen text (David 21 okt: "räcker med en tooltip").
 * Desktop visar bubblan vid hover, mobil vid tryck. Bubblan läggs under rubriken, från dess vänsterkant,
 * så rubriken måste vara relative. Texterna är stämda mot hjälpcentret.
 */
export const Why = ({ text }: { text: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <span className="group inline-block align-middle">
      <button
        type="button"
        aria-label="Varför frågar vi?"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setOpen(false)}
        className="ml-1 inline-flex h-6 w-6 items-center justify-center rounded-full align-middle text-[var(--color-inactive-dark)] hover:text-[var(--color-secondary-main)]"
      >
        <Info size={16} />
      </button>
      <span
        role="tooltip"
        className={clsx(
          'absolute left-0 top-full z-20 mt-1 w-[320px] max-w-full rounded-[var(--radius-main)] bg-[var(--color-text-main)] px-3 py-2 text-left text-[13px] font-normal leading-[18px] text-white shadow-[0_8px_24px_rgba(0,0,0,0.18)]',
          open ? 'block' : 'hidden md:group-hover:block',
        )}
      >
        {text}
      </span>
    </span>
  )
}

export const Section = ({ title, sub, why, children, className, badge, kvar }: { title: string; sub?: string; why?: string; children: ReactNode; className?: string; badge?: ReactNode; kvar?: boolean }) => (
  // data-kvar: frågan saknar svar, dit scrollar grå Fortsätt.
  <section className={className ?? 'mt-7'} data-kvar={kvar ? '1' : undefined}>
    <div className="flex items-start justify-between gap-3">
      <h2 className="relative text-[16px] font-bold leading-[22px] text-[var(--color-text-main)]">
        {title}
        {why && <Why text={why} />}
      </h2>
      {badge}
    </div>
    {sub && <p className="mt-0.5 text-[13px] leading-[18px] text-[var(--color-inactive-dark)]">{sub}</p>}
    <div className="mt-3">{children}</div>
  </section>
)

export const Field = ({ label, sub, children }: { label: string; sub?: string; children: ReactNode }) => (
  <div className="mt-4 first:mt-0">
    <p className="text-[14px] font-bold text-[var(--color-text-main)]">{label}</p>
    {sub && <p className="text-[12px] leading-[16px] text-[var(--color-inactive-dark)]">{sub}</p>}
    <div className="mt-2">{children}</div>
  </div>
)

export const SubCard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx('rounded-[var(--radius-main)] bg-[var(--color-secondary-extra-extra-light)] p-4', className)}>{children}</div>
)

export const InfoNote = ({ children }: { children: ReactNode }) => (
  <p className="mt-3 rounded-[var(--radius-main)] bg-[var(--color-secondary-extra-extra-light)] px-4 py-3 text-[14px] leading-[20px] text-[var(--color-text-main)]">{children}</p>
)

/** Grön pill: "Från din flytt", "Steg 1 sparat". */
export const GreenBadge = ({ children }: { children: ReactNode }) => (
  <span className="inline-flex h-6 shrink-0 items-center gap-1 rounded-full bg-[#DCFCE7] px-2 text-[12px] font-bold leading-4 text-[#15803D]">
    <Check size={13} strokeWidth={3} />
    {children}
  </span>
)

/** Adresserna som en resa: ring för Från, prick för stopp, grön punkt för Till och en streckad linje mellan dem. */
export const RouteCard = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={clsx('rounded-[var(--radius-main)] border border-[var(--color-inactive-main)] bg-white px-[16px] py-[4px]', className)}>{children}</div>
)

/*
 * Sajtens Tailwind-skala är inte 4 px per steg, så allt som ska linjera med
 * markören har px-värden. Markören står mitt på adressraden: 16 px etikett
 * plus halva 20 px-raden. Linjerna går ut i radens 12 px-padding så att de
 * möts mellan raderna.
 */
const ROUTE_MID = 26
const ROUTE_PAD = 12
const ROUTE_GAP = 3

export const RoutePoint = ({
  kind,
  label,
  value,
  action,
  children,
}: {
  kind: 'fran' | 'stopp' | 'till'
  label: string
  value?: string
  action?: ReactNode
  children?: ReactNode
}) => {
  const size = kind === 'stopp' ? 8 : 12
  // Ett stopp har bara etikett ovanför fältet, då står pricken mitt på etiketten.
  const markTop = (value ? ROUTE_MID : 8) - size / 2
  const line = 'absolute left-[5px] border-l-2 border-dashed border-[var(--color-inactive-grey-light)]'
  return (
    <div className="flex gap-[12px] py-[12px]">
      <span aria-hidden className="relative w-[12px] shrink-0">
        {kind !== 'fran' && <span className={line} style={{ top: -ROUTE_PAD, height: markTop - ROUTE_GAP + ROUTE_PAD }} />}
        {kind !== 'till' && <span className={line} style={{ top: markTop + size + ROUTE_GAP, bottom: -ROUTE_PAD }} />}
        <span
          className={clsx(
            'absolute rounded-full',
            kind === 'fran' && 'left-0 border-[3px] border-[var(--color-secondary-main)] bg-white',
            kind === 'stopp' && 'left-[2px] bg-[var(--color-secondary-main)]',
            kind === 'till' && 'left-0 bg-[var(--color-primary-main)] ring-[3px] ring-[var(--color-primary-border)]',
          )}
          style={{ top: markTop, width: size, height: size }}
        />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-end justify-between gap-[12px]">
          <span className="min-w-0">
            <span className="block text-[12px] leading-[16px] text-[var(--color-inactive-dark)]">{label}</span>
            {value && <span className="block truncate text-[16px] font-bold leading-[20px] text-[var(--color-text-main)]">{value}</span>}
          </span>
          {/* 44 px träffyta som inte puttar raden: negativ marginal på spannet, knappar nollställs av sajtens reset. */}
          {action && <span className="-my-[12px] flex h-[44px] shrink-0 items-center">{action}</span>}
        </div>
        {children}
      </div>
    </div>
  )
}

/** Rad med hämtad uppgift och Ändra, som adresserna och bostadstypen. */
export const InfoRow = ({ label, value, action, onAction, first }: { label: string; value: string; action?: string; onAction?: () => void; first?: boolean }) => (
  <div className={clsx('flex items-center justify-between gap-3 px-3.5 py-3', !first && 'border-t border-[var(--color-inactive-main)]')}>
    <span className="min-w-0">
      <span className="block text-[12px] leading-4 text-[var(--color-inactive-dark)]">{label}</span>
      <span className="block truncate text-[15px] font-bold leading-5 text-[var(--color-text-main)]">{value}</span>
    </span>
    {action && (
      <TextLink onClick={onAction} muted={!onAction}>
        {action}
      </TextLink>
    )}
  </div>
)

export const InfoCard = ({ children, className, kvar }: { children: ReactNode; className?: string; kvar?: boolean }) => (
  <div className={clsx('rounded-[var(--radius-main)] border border-[var(--color-inactive-main)] bg-[var(--color-secondary-extra-extra-light)]', className)} data-kvar={kvar ? '1' : undefined}>
    {children}
  </div>
)

/** Streckad "Lägg till"-ruta. */
export const AddCard = ({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex w-full items-center gap-3 rounded-[var(--radius-main)] border-[1.5px] border-dashed border-[var(--color-inactive-grey-light)] bg-white p-3 text-left"
  >
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-extra-extra-light)] text-[var(--color-secondary-main)]">
      <Plus size={18} />
    </span>
    <span className="min-w-0">
      <span className="block text-[15px] font-bold leading-5 text-[var(--color-secondary-main)]">{label}</span>
      <span className="block text-[13px] text-[var(--color-inactive-dark)]">{hint}</span>
    </span>
  </button>
)

/**
 * Ett tillagt utrymme eller föremål. Öppet medan kunden fyller i, Klar fäller
 * ihop det till en rad med Ändra (David 20 okt: "fäll ihop den när det är klar").
 */
export const ItemCard = ({
  title,
  onRemove,
  children,
  collapsed,
  summary,
  onDone,
  onEdit,
}: {
  title: string
  onRemove: () => void
  children: ReactNode
  collapsed?: boolean
  summary?: string
  onDone?: () => void
  onEdit?: () => void
}) => (
  <div
    className={clsx(
      'rounded-[var(--radius-main)] border-[1.5px] bg-white',
      collapsed ? 'border-[var(--color-inactive-main)] px-4 py-3' : 'border-[var(--color-secondary-main)] p-4',
    )}
  >
    <div className="flex items-center justify-between gap-3">
      <span className="flex min-w-0 items-center gap-2 text-[15px] font-bold text-[var(--color-secondary-main)]">
        {collapsed && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#15803D]">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
        <span className="truncate">{title}</span>
      </span>
      <span className="flex shrink-0 items-center gap-4">
        {collapsed && onEdit && <TextLink onClick={onEdit}>Ändra</TextLink>}
        <TextLink onClick={onRemove} muted>
          Ta bort
        </TextLink>
      </span>
    </div>
    {collapsed ? (
      summary && <p className="mt-1 text-[13px] leading-[18px] text-[var(--color-inactive-dark)]">{summary}</p>
    ) : (
      <>
        <div className="mt-3">{children}</div>
        {onDone && (
          <div className="mt-4">
            <PrimaryButton tone="outline" onClick={onDone}>
              Klar
            </PrimaryButton>
          </div>
        )}
      </>
    )}
  </div>
)

export const MoreLink = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-1 py-1 text-[14px] font-bold text-[var(--color-secondary-main)]">
    <Plus size={16} className="shrink-0" />
    {children}
  </button>
)

/** 16 px text, annars zoomar iOS när fältet fokuseras. */
export const TextField = ({
  value,
  onChange,
  placeholder,
  rows = 3,
  label,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  rows?: number
  label: string
}) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    aria-label={label}
    className="w-full rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] p-3 text-[16px] leading-[22px] text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-inactive-grey-light)] focus:border-[var(--color-secondary-main)]"
  />
)

export const TextInput = ({
  value,
  onChange,
  placeholder,
  label,
  type = 'text',
  autoFocus,
}: {
  value: string
  onChange: (v: string) => void
  placeholder: string
  label: string
  type?: 'text' | 'tel' | 'number'
  autoFocus?: boolean
}) => (
  <input
    type={type}
    autoFocus={autoFocus}
    inputMode={type === 'number' ? 'numeric' : type === 'tel' ? 'tel' : undefined}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label={label}
    className="h-12 w-full rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] bg-white px-3 text-[16px] text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-inactive-grey-light)] focus:border-[var(--color-secondary-main)]"
  />
)

export const Stepper = ({ value, onChange, min = 1, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
  <div className="flex items-center gap-1">
    <button
      type="button"
      aria-label="Färre"
      onClick={() => onChange(Math.max(min, value - 1))}
      className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[var(--color-inactive-main)] text-[var(--color-secondary-main)]"
    >
      <Minus size={16} />
    </button>
    <span className="w-8 text-center text-[16px] font-bold text-[var(--color-text-main)]">{value}</span>
    <button
      type="button"
      aria-label="Fler"
      onClick={() => onChange(Math.min(max, value + 1))}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-secondary-main)] text-white"
    >
      <Plus size={16} />
    </button>
  </div>
)

/** Kryssruta i kortform, för flerval som fönstertyper och tillval. */
export const CheckTile = ({
  label,
  hint,
  selected,
  onClick,
  icon,
  className,
}: {
  label: string
  hint?: string
  selected: boolean
  onClick: () => void
  icon?: ReactNode
  className?: string
}) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={clsx(
      'flex min-h-[60px] items-center gap-3 rounded-[var(--radius-main)] border-[1.5px] p-3 text-left transition-colors',
      selected ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-main)] bg-white',
      className,
    )}
  >
    {icon ? (
      <span className="shrink-0 text-[var(--color-secondary-main)]">{icon}</span>
    ) : (
      <span
        className={clsx(
          'flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px]',
          selected ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] text-white' : 'border-[var(--color-inactive-grey-light)]',
        )}
      >
        {selected && <Check size={14} strokeWidth={3} />}
      </span>
    )}
    <span className="min-w-0">
      <span className="block text-[15px] font-bold leading-5 text-[var(--color-text-main)]">{label}</span>
      {hint && <span className="block text-[12px] leading-4 text-[var(--color-inactive-dark)]">{hint}</span>}
    </span>
  </button>
)

/** Envalskort, som Lite/Normalt/Mycket. */
export const Tile = ({ label, hint, selected, onClick, icon }: { label: string; hint?: string; selected: boolean; onClick: () => void; icon?: ReactNode }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={clsx(
      'flex min-h-[72px] flex-col items-center justify-center gap-0.5 rounded-[var(--radius-main)] border-[1.5px] px-2 py-3 text-center transition-colors',
      selected ? 'border-2 border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-main)] bg-white',
    )}
  >
    {icon && <span className="text-[var(--color-secondary-main)]">{icon}</span>}
    <span className="text-[15px] font-bold leading-5 text-[var(--color-text-main)]">{label}</span>
    {hint && <span className="text-[12px] leading-4 text-[var(--color-inactive-dark)]">{hint}</span>}
  </button>
)

/** En rad BV till 7, exakt siffra som Harry lagrar. Fler öppnar ett sifferfält. */
export const FloorRow = ({ value, onChange, more, onMore }: { value?: string; onChange: (v: string) => void; more: boolean; onMore: () => void }) => (
  <div>
    <div className="flex h-[46px] w-full overflow-clip rounded-xl border-[1.5px] border-[var(--color-inactive-main)] bg-white" role="radiogroup" aria-label="Våningsplan">
      {FLOORS.map((f, i) => (
        <button
          key={f}
          type="button"
          role="radio"
          aria-checked={value === f}
          onClick={() => onChange(f)}
          className={clsx(
            'flex h-full min-w-0 flex-1 items-center justify-center text-[15px] transition-colors',
            i > 0 && 'border-l border-[var(--color-inactive-main)]',
            value === f ? 'bg-[var(--color-secondary-main)] font-bold text-white' : 'text-[var(--color-text-main)]',
          )}
        >
          {f}
        </button>
      ))}
    </div>
    <div className="mt-2.5 flex items-center justify-between">
      <TextLink onClick={onMore} className="text-[13px]">
        {more ? 'Tillbaka till raden' : 'Annan våning'}
      </TextLink>
      <button
        type="button"
        aria-pressed={value === 'vet-ej'}
        onClick={() => onChange('vet-ej')}
        className={clsx('text-[13px] font-bold', value === 'vet-ej' ? 'text-[var(--color-secondary-main)] underline underline-offset-4' : 'text-[var(--color-inactive-dark)]')}
      >
        Vet inte
      </button>
    </div>
  </div>
)

/** Streckikoner för fönstertyperna, de enda bilderna i stegen. */
export const WindowIcon = ({ type }: { type: FonsterTyp }) => {
  const s = { stroke: 'currentColor', strokeWidth: 1.75, fill: 'none' } as const
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      {type === 'fyrsidiga' && (
        <>
          <rect x="4" y="5" width="24" height="22" rx="1.5" {...s} />
          <line x1="16" y1="5" x2="16" y2="27" {...s} />
          <rect x="7.5" y="8.5" width="5" height="15" {...s} strokeWidth={1.5} />
          <rect x="19.5" y="8.5" width="5" height="15" {...s} strokeWidth={1.5} />
        </>
      )}
      {type === 'sprojsade' && (
        <>
          <rect x="4" y="5" width="24" height="22" rx="1.5" {...s} />
          <line x1="12" y1="5" x2="12" y2="27" {...s} strokeWidth={1.5} />
          <line x1="20" y1="5" x2="20" y2="27" {...s} strokeWidth={1.5} />
          <line x1="4" y1="12.3" x2="28" y2="12.3" {...s} strokeWidth={1.5} />
          <line x1="4" y1="19.7" x2="28" y2="19.7" {...s} strokeWidth={1.5} />
        </>
      )}
      {type === 'panorama' && (
        <>
          <rect x="2" y="8" width="28" height="16" rx="1.5" {...s} />
          <path d="M5 19 L11 14 L15 17 L21 12 L27 16" {...s} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="8" y1="27" x2="24" y2="27" {...s} strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
      {type === 'svaratkomliga' && (
        <>
          <rect x="10" y="3" width="12" height="10" rx="1.5" {...s} />
          <line x1="16" y1="3" x2="16" y2="13" {...s} strokeWidth={1.5} />
          <line x1="16" y1="29" x2="16" y2="18" {...s} strokeLinecap="round" />
          <path d="M12 22 L16 18 L20 22" {...s} strokeLinecap="round" strokeLinejoin="round" />
          <line x1="5" y1="29" x2="27" y2="29" {...s} strokeWidth={1.5} strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

export const CheckCircle = ({ size = 40 }: { size?: number }) => (
  <span className="flex shrink-0 items-center justify-center rounded-full bg-[#DCFCE7] text-[#16A34A]" style={{ width: size, height: size }}>
    <Check size={size * 0.5} strokeWidth={3} />
  </span>
)

/** Rubrikraden i arket efter Begär offert: bock, rubrik och pilen som stänger. */
export const StatusHead = ({ title, onClose }: { title: string; onClose: () => void }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-3">
      <CheckCircle />
      <span className="text-[15px] font-bold text-[var(--color-text-main)]">{title}</span>
    </span>
    <button type="button" onClick={onClose} aria-label="Stäng" className="flex h-11 w-11 items-center justify-center text-[var(--color-inactive-dark)]">
      <ChevronUp size={22} />
    </button>
  </div>
)

export const SheetHandle = () => <span className="mx-auto mb-2 mt-3 block h-1 w-10 shrink-0 rounded-full bg-[var(--color-inactive-grey-light)]/60 md:hidden" />

/* Fortsätt, "N frågor kvar" och foten. Mobil: fast i botten, centrerat. Desktop: knappen till vänster, texten bredvid. */
/* Mobil: bara knappen, och "2 frågor kvar" står i den tills steget är klart (David 20 okt: raderna under tog för mycket plats). Desktop: texten bredvid. */
const FrameFooter = ({ cta, left, foot, onNext }: { cta: string; left: number; foot: string; onNext: () => void }) => {
  const kvar = `${left} ${left === 1 ? 'fråga' : 'frågor'} kvar`
  // Mobil: en rad under knappen om att svaren sparas per steg (21 okt). Sista steget sparar vid Klar.
  const kort = cta === 'Klar' ? 'Sparas när du trycker Klar.' : 'Sparas när du går vidare.'
  return (
    <div className="md:flex md:items-center md:gap-5">
      <div className="md:hidden">
        <PrimaryButton onClick={onNext} inactive={left > 0} onInactiveClick={visaSaknadFraga}>
          {left > 0 ? kvar : cta}
        </PrimaryButton>
        <p className="mt-1.5 text-center text-[12px] leading-4 text-[var(--color-inactive-dark)]">{kort}</p>
      </div>
      <div className="hidden md:block md:w-[240px]">
        <PrimaryButton onClick={onNext} inactive={left > 0} onInactiveClick={visaSaknadFraga}>
          {cta}
        </PrimaryButton>
      </div>
      <div className="hidden md:block md:text-left">
        {left > 0 && <p className="text-[13px] font-bold text-[var(--color-secondary-main)]">{kvar}</p>}
        <p className="mt-0.5 text-[13px] text-[var(--color-inactive-dark)]">{foot}</p>
      </div>
    </div>
  )
}

/**
 * Ramen runt varje frågesteg: steg x av 6, Sparat-bocken, krysset, frågan,
 * och Fortsätt fast i botten. Fortsätt tänds när stegets knappfrågor har svar.
 * Mobil: arket. Desktop: en egen ruta ovanpå sidan, steglista till vänster,
 * frågan till höger, kroppen scrollar och Fortsätt står still. Klara steg går
 * att hoppa tillbaka till.
 */
export const Frame = ({
  step,
  title,
  sub,
  why,
  children,
  cta = 'Fortsätt',
  left = 0,
  foot = 'Svaren sparas när du går vidare.',
  savedBadge,
  done,
  onStep,
  onNext,
  onBack,
  onClose,
}: {
  step: number
  title: string
  sub?: string
  why?: string
  children: ReactNode
  cta?: string
  left?: number
  foot?: string
  savedBadge?: string | null
  /** Ett värde per steg: besvarat, så att desktop-listan visar bocken. */
  done?: boolean[]
  onStep?: (i: number) => void
  onNext: () => void
  /** Ett steg bakåt. Pilen ligger längst upp till vänster på alla bredder, krysset sparar och stänger (David 21 okt: man måste kunna backa). */
  onBack?: () => void
  onClose: () => void
}) => (
  <div className="flex h-full min-h-0 flex-1 flex-col bg-white">
    <div className={clsx('flex items-center justify-between pr-1 md:pt-3', onBack ? 'pl-1 md:px-3' : 'pl-4 md:px-6')}>
      <span className="flex items-center gap-1">
        {onBack && (
          <button type="button" onClick={onBack} aria-label="Tillbaka" className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-text-main)]">
            <ChevronLeft size={22} />
          </button>
        )}
        <span className="text-[13px] font-bold text-[var(--color-text-main)] md:text-[14px]">
          Steg {step + 1} av {TOTAL} · {STEG[step]}
        </span>
      </span>
      <span className="flex items-center gap-2">
        {savedBadge && <GreenBadge>{savedBadge}</GreenBadge>}
        <button type="button" onClick={onClose} aria-label="Spara och stäng" className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-inactive-dark)]">
          <X size={20} />
        </button>
      </span>
    </div>
    <ol className="flex gap-1 px-4 md:hidden" aria-hidden>
      {STEG.map((s, i) => (
        <li
          key={s}
          className={clsx(
            'h-1 flex-1 rounded-full',
            i < step ? 'bg-[var(--color-primary-main)]' : i === step ? 'bg-[var(--color-secondary-main)]' : 'bg-[var(--color-inactive-main)]',
          )}
        />
      ))}
    </ol>
    <div
      data-scroll
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-6 pt-4 md:grid md:grid-cols-[220px_minmax(0,1fr)] md:items-start md:gap-12 md:px-8 md:pb-8 md:pt-4"
    >
      <nav className="hidden md:sticky md:top-0 md:block" aria-label="Steg">
        <ol className="flex flex-col gap-1">
          {STEG.map((s, i) => {
            const state = i === step ? 'current' : done?.[i] ? 'done' : 'todo'
            return (
              <li key={s}>
                <button
                  type="button"
                  disabled={state === 'todo'}
                  onClick={() => onStep?.(i)}
                  className={clsx(
                    'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[14px]',
                    state === 'current'
                      ? 'bg-[var(--color-secondary-extra-extra-light)] font-bold text-[var(--color-text-main)]'
                      : state === 'done'
                        ? 'text-[var(--color-text-main)] hover:bg-[var(--color-inactive-quite-light)]'
                        : 'text-[var(--color-inactive-dark)] opacity-50',
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-bold',
                      state === 'done'
                        ? 'bg-[#DCFCE7] text-[#15803D]'
                        : state === 'current'
                          ? 'bg-[var(--color-secondary-main)] text-white'
                          : 'border border-[var(--color-inactive-main)] text-[var(--color-inactive-dark)]',
                    )}
                  >
                    {state === 'done' ? <Check size={14} strokeWidth={3} /> : i + 1}
                  </span>
                  {s}
                </button>
              </li>
            )
          })}
        </ol>
      </nav>
      <div className="min-w-0 md:max-w-[720px]">
        <h1 className="relative text-[19px]! font-bold leading-[24px]! text-[var(--color-text-main)] md:text-[24px]! md:leading-[30px]!">
          {title}
          {why && <Why text={why} />}
        </h1>
        {sub && <p className="mt-1 text-[13px] leading-[18px] text-[var(--color-inactive-dark)] md:text-[15px] md:leading-[22px]">{sub}</p>}
        {children}
      </div>
    </div>
    <div className="shrink-0 border-t border-[var(--color-inactive-main)] bg-white px-4 py-3 md:py-4 md:pl-[300px] md:pr-8">
      <FrameFooter cta={cta} left={left} foot={foot} onNext={onNext} />
    </div>
  </div>
)

/**
 * Veckoväljaren som i dag (WeeklyDatePicker i live): fält med flytande etikett,
 * en vecka i taget, helger och passerade dagar grå, max nästa vecka. Öppnas uppåt.
 */
export const WeekPicker = ({ value, onChange }: { value: Date; onChange: (d: Date) => void }) => {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(value)
  const root = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])
  const prevDisabled = startOfWeek(visible) <= startOfWeek(new Date())
  const nextDisabled = addDays(startOfWeek(visible), 7) > maxDay()
  const today = new Date()
  return (
    <div ref={root} className="relative w-full">
      <button
        type="button"
        data-picker-trigger
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={clsx(
          'relative flex h-11 w-full items-center rounded-lg border bg-white px-3 text-left',
          open ? 'border-[var(--color-primary-main)] ring-1 ring-[var(--color-primary-main)]' : 'border-[#CBD5E1]',
        )}
      >
        <span className="pointer-events-none absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-[var(--color-text-main)]">Välj datum</span>
        <span className="block min-w-0 flex-1 truncate text-[15px] font-medium text-[var(--color-text-main)]">{fmtShort(value)}</span>
      </button>
      {open && (
        <div role="dialog" aria-label="Välj datum" className="absolute bottom-full left-1/2 z-50 mb-2 w-[320px] -translate-x-1/2 rounded-lg bg-white p-4 shadow-xl">
          <div className="mb-4 flex items-center justify-between text-[var(--color-secondary-main)]">
            <button
              type="button"
              disabled={prevDisabled}
              aria-label="Förra veckan"
              onClick={() => setVisible((d) => addDays(d, -7))}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--color-primary-main)] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-[16px] font-bold" aria-live="polite">
              {fmtWeekTitle(visible)}
            </span>
            <button
              type="button"
              disabled={nextDisabled}
              aria-label="Nästa vecka"
              onClick={() => setVisible((d) => addDays(d, 7))}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full hover:bg-[var(--color-primary-main)] hover:text-white disabled:pointer-events-none disabled:opacity-30"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {weekDays(visible).map((day) => {
              const selected = sameDay(day, value)
              const disabled = !isSelectable(day)
              const isToday = sameDay(day, today)
              return (
                <div key={day.toISOString()} className="flex flex-col items-center gap-2">
                  <span className="text-[14px] font-medium capitalize text-[var(--color-secondary-main)]">{fmtWeekday(day)}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    aria-current={isToday ? 'date' : undefined}
                    onClick={() => {
                      onChange(day)
                      setOpen(false)
                    }}
                    className={clsx(
                      'inline-flex h-9 w-9 items-center justify-center rounded-full text-[14px]',
                      selected ? 'bg-[var(--color-primary-main)] font-bold text-white' : 'text-[var(--color-secondary-main)] hover:bg-[var(--color-primary-main)] hover:text-white',
                      isToday && !selected && 'ring-1 ring-[var(--color-secondary-main)]',
                      disabled && 'pointer-events-none text-[#94A3B8] opacity-50',
                    )}
                  >
                    {day.getDate()}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Tidsvalet på bekräftelsen: alla dagar som går att välja (vardagar från i morgon, högst nästa vecka) som
 * rutor, passen som knappar under. Inga gråa dagar, ingen veckobläddring, ingen rullgardin (David 22 okt:
 * tidsvalet satt ihop och såg risigt ut). Ett tryck på ett pass är valet, kortet stängs av föräldern.
 */
export const TidValjare = ({ dag, pass, onDag, onPass }: { dag: Date; pass?: string; onDag: (d: Date) => void; onPass: (p: string) => void }) => {
  const days: Date[] = []
  for (let d = addDays(new Date(), 1); d <= maxDay(); d = addDays(d, 1)) if (isSelectable(d)) days.push(d)
  const rubrik = 'text-[12px] font-bold uppercase leading-[16px] tracking-[0.1em] text-[#767678]'
  const ruta = (selected: boolean) =>
    clsx('border-2 transition-colors duration-150', selected ? 'border-[#214766] bg-[#214766] text-white' : 'border-[#E1E1E3] bg-white text-[#214766] hover:border-[#214766]')
  return (
    <div className="w-full text-left">
      <span className={clsx(rubrik, 'block')}>Dag</span>
      <div className="mt-2 grid grid-cols-5 gap-2">
        {days.map((day) => {
          const selected = sameDay(day, dag)
          return (
            <button key={day.toISOString()} type="button" aria-pressed={selected} onClick={() => onDag(day)} className={clsx('flex h-[56px] flex-col items-center justify-center rounded-[12px]', ruta(selected))}>
              <span className="text-[12px] capitalize leading-[16px]">{fmtWeekday(day)}</span>
              <span className="text-[16px] font-bold leading-[20px]">
                {day.getDate()}/{day.getMonth() + 1}
              </span>
            </button>
          )
        })}
      </div>
      <span className={clsx(rubrik, 'mt-4 block')}>Tid</span>
      <div className="mt-2 flex gap-2">
        {slotsFor(dag).map((p) => {
          const passed = isSlotPassed(p, dag)
          return (
            <button key={p} type="button" disabled={passed} aria-pressed={pass === p} onClick={() => onPass(p)} className={clsx('h-12 flex-1 rounded-full text-[15px] font-bold', ruta(pass === p), passed && 'pointer-events-none opacity-40')}>
              {p.replace('-', '–')}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/**
 * Bärsträckan som reglage i steg om fem meter (David 20 okt), med Vet inte
 * bredvid. Värdet står stort ovanför, reglaget är obesvarat tills det rörts.
 */
/**
 * Reglagen visar värdet medan tummen dras men sparar först när den släpps (Nils 21 okt:
 * nästa fråga dök upp och scrollade mitt i draget, och varje steg skrev till lagringen och laggade).
 * Släpps tummen utanför reglaget fångas det på fönstret. Ett tryck utan drag sparar läget det står i.
 */
const useSlapp = (onChange: (v: number) => void) => {
  const [drag, setDrag] = useState<number | null>(null)
  const senast = useRef<number | null>(null)
  const slapp = useCallback(
    (v: number) => {
      senast.current = null
      setDrag(null)
      onChange(v)
    },
    [onChange],
  )
  useEffect(() => {
    if (drag === null) return
    const upp = () => {
      if (senast.current !== null) slapp(senast.current)
    }
    window.addEventListener('pointerup', upp)
    window.addEventListener('pointercancel', upp)
    window.addEventListener('touchend', upp)
    return () => {
      window.removeEventListener('pointerup', upp)
      window.removeEventListener('pointercancel', upp)
      window.removeEventListener('touchend', upp)
    }
  }, [drag, slapp])
  const props = {
    onChange: (e: ChangeEvent<HTMLInputElement>) => {
      senast.current = Number(e.target.value)
      setDrag(senast.current)
    },
    onPointerUp: (e: PekEvent<HTMLInputElement>) => slapp(Number(e.currentTarget.value)),
    onKeyUp: (e: TangentEvent<HTMLInputElement>) => {
      if (senast.current !== null) slapp(Number(e.currentTarget.value))
    },
  }
  return { drag, props }
}

export const MeterSlider = ({ value, onChange }: { value: unknown; onChange: (v: Avstand) => void }) => {
  const svar = harAvstand(value) ? value : undefined
  const vetEj = svar === 'vet-ej'
  const tal = typeof svar === 'number' ? svar : 25
  const { drag, props } = useSlapp(onChange)
  const visat = drag ?? svar
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <span className={clsx('text-[22px] font-bold leading-7', visat === undefined ? 'text-[var(--color-inactive-dark)]' : 'text-[var(--color-text-main)]')}>
          {visat === undefined ? 'Dra för att välja' : avstandText(visat)}
        </span>
        <Chip small selected={vetEj} onClick={() => onChange('vet-ej')}>
          Vet inte
        </Chip>
      </div>
      <div className={clsx(vetEj && 'opacity-40')}>
        <input
          type="range"
          min={0}
          max={AVSTAND_MAX}
          step={AVSTAND_STEG}
          value={drag ?? tal}
          aria-label="Bärsträcka i meter"
          aria-valuetext={visat === undefined ? 'inget valt' : avstandText(visat)}
          {...props}
          className="mt-3 h-11 w-full cursor-pointer accent-[var(--color-secondary-main)]"
        />
      </div>
      <div className="flex justify-between text-[12px] text-[var(--color-inactive-dark)]" aria-hidden>
        <span>0 m</span>
        <span>50 m</span>
        <span>{AVSTAND_MAX} m eller mer</span>
      </div>
    </div>
  )
}

/** Reglage med fasta steg, värdet stort ovanför och etiketter under. Obesvarat tills det rörts. */
export const RangeSlider = ({
  value,
  min,
  max,
  step,
  onChange,
  text,
  ticks,
  label,
}: {
  value: unknown
  min: number
  max: number
  step: number
  onChange: (v: number) => void
  text: (v: number) => string
  ticks: string[]
  label: string
}) => {
  const svar = typeof value === 'number' ? value : undefined
  const { drag, props } = useSlapp(onChange)
  const visat = drag ?? svar
  return (
    <div>
      <span className={clsx('block text-[18px] font-bold leading-6', visat === undefined ? 'text-[var(--color-inactive-dark)]' : 'text-[var(--color-text-main)]')}>
        {visat === undefined ? 'Dra för att välja' : text(visat)}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={drag ?? svar ?? min}
        aria-label={label}
        aria-valuetext={visat === undefined ? 'inget valt' : text(visat)}
        {...props}
        className="mt-2 h-11 w-full cursor-pointer accent-[var(--color-secondary-main)]"
      />
      <div className="flex justify-between text-[12px] text-[var(--color-inactive-dark)]" aria-hidden>
        {ticks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </div>
  )
}

/**
 * Datumväljare för en dag längre fram, t.ex. städdagen: fältet är tomt tills
 * kunden valt, kalendern öppnar på flyttdagens månad med flyttdagen markerad
 * (David 20 okt: "lämna ej ifylld men poppa på movingdate när datepickern öppnas").
 */
export const DayPicker = ({
  value,
  start,
  min,
  label,
  placeholder,
  onChange,
  ringText = 'flyttdagen',
}: {
  value?: string
  start: string
  min?: string
  label: string
  placeholder: string
  onChange: (iso: string) => void
  ringText?: string
}) => {
  const [open, setOpen] = useState(false)
  const [visible, setVisible] = useState(() => fromIso(value ?? start))
  // Kalendern öppnas som en centrerad ruta över sidan, inte nedfälld under fältet (Nils 20 okt).
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  const flytt = fromIso(start)
  const minDag = min ? fromIso(min) : undefined
  const vald = value ? fromIso(value) : undefined
  const idag = new Date()
  return (
    <div className="relative w-full">
      <button
        type="button"
        data-day-trigger
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setVisible(fromIso(value ?? start))
          setOpen((o) => !o)
        }}
        className={clsx(
          'relative flex h-12 w-full items-center rounded-[var(--radius-main)] border-[1.5px] bg-white px-3 text-left',
          open ? 'border-[var(--color-secondary-main)]' : 'border-[var(--color-inactive-main)]',
        )}
      >
        {vald && <span className="pointer-events-none absolute -top-2.5 left-3 bg-white px-1 text-[12px] text-[var(--color-text-main)]">{label}</span>}
        <span className={clsx('block min-w-0 flex-1 truncate text-[16px]', vald ? 'font-bold text-[var(--color-text-main)]' : 'text-[var(--color-inactive-grey-light)]')}>
          {vald ? fmtLongDate(vald) : placeholder}
        </span>
        <CalendarDays size={20} className="shrink-0 text-[var(--color-secondary-main)]" aria-hidden />
      </button>
      {open &&
        createPortal(
          <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 p-4" onClick={() => setOpen(false)}>
            <div role="dialog" aria-label={label} onClick={(e) => e.stopPropagation()} className="w-full max-w-[360px] rounded-2xl bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between text-[var(--color-secondary-main)]">
                <button
                  type="button"
                  aria-label="Förra månaden"
                  onClick={() => setVisible((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-primary-main)] hover:text-white"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-[16px] font-bold capitalize" aria-live="polite">
                  {fmtMonth(visible)}
                </span>
                <button
                  type="button"
                  aria-label="Nästa månad"
                  onClick={() => setVisible((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-[var(--color-primary-main)] hover:text-white"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {['Mån', 'Tis', 'Ons', 'Tors', 'Fre', 'Lör', 'Sön'].map((v) => (
                  <span key={v} className="text-[12px] font-medium text-[var(--color-inactive-dark)]">
                    {v}
                  </span>
                ))}
                {monthGrid(visible).map((day, i) => {
                  if (!day) return <span key={`tom-${i}`} />
                  const disabled = (minDag && day < minDag) || day < new Date(idag.getFullYear(), idag.getMonth(), idag.getDate())
                  const selected = !!vald && sameDay(day, vald)
                  const arFlytt = sameDay(day, flytt)
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={disabled}
                      aria-label={fmtLongDate(day) + (arFlytt ? `, ${ringText}` : '')}
                      onClick={() => {
                        onChange(toIso(day))
                        setOpen(false)
                      }}
                      className={clsx(
                        'mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-[14px]',
                        selected
                          ? 'bg-[var(--color-primary-main)] font-bold text-white'
                          : 'text-[var(--color-secondary-main)] hover:bg-[var(--color-primary-main)] hover:text-white',
                        arFlytt && !selected && 'ring-2 ring-[var(--color-secondary-main)] font-bold',
                        disabled && 'pointer-events-none text-[#94A3B8] opacity-50',
                      )}
                    >
                      {day.getDate()}
                    </button>
                  )
                })}
              </div>
              <p className="mt-3 text-[12px] text-[var(--color-inactive-dark)]">
                Ringen är {ringText}, {fmtLongDate(flytt)}.
              </p>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}

/**
 * Reveal: nästa fråga visas först när den förra är svarad (Nils 20 okt:
 * luftigare och guidande, något händer efter varje svar). Tonar in och
 * glider upp, och scrollar sig i bild. Det som redan var svarat vid öppning
 * visas direkt utan rörelse.
 */
/** scrollOnMount: även ett kort som skapas direkt synligt (nytt utrymme efter Ja) scrollas till mitten (Nils pdf 20 okt). */
export const Reveal = ({ show, children, scrollOnMount }: { show: boolean; children: ReactNode; scrollOnMount?: boolean }) => {
  const [visible, setVisible] = useState(show)
  const ref = useRef<HTMLDivElement>(null)
  // Tonar in nästa fråga under den förra. När den just dykt upp (dold -> visad, inte vid öppning) scrollas den
  // till mitten en halv sekund senare, så att det inte rycker under tummen på ett reglage (Nils 20 okt: centrera nästa fråga).
  const forra = useRef<boolean | null>(null)
  // Flaggan nollas först när scrollen faktiskt körts, så att Reacts dubbla effekter i dev inte äter upp den.
  const vidMount = useRef(!!scrollOnMount)
  useEffect(() => {
    const nyss = (forra.current === false && show) || (vidMount.current && show)
    forra.current = show
    if (!show) {
      setVisible(false)
      return
    }
    const raf = requestAnimationFrame(() => setVisible(true))
    const t = nyss
      ? window.setTimeout(() => {
          vidMount.current = false
          const el = ref.current
          if (!el) return
          // Ett högt kort (utrymme eller föremål med Klar-knapp) läggs högst upp så att hela kortet syns,
          // en kort fråga centreras (Nils 21 okt: Klar hamnade under skärmen).
          const synlig = (el.closest('[data-scroll]') as HTMLElement | null)?.clientHeight ?? window.innerHeight
          el.scrollIntoView({ block: el.offsetHeight > synlig * 0.6 ? 'start' : 'center', behavior: 'smooth' })
        }, 450)
      : null
    return () => {
      cancelAnimationFrame(raf)
      if (t) window.clearTimeout(t)
    }
    // scrollOnMount läses bara vid första körningen, avsiktligt.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])
  if (!show) return null
  return (
    <div
      ref={ref}
      className={clsx('transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none', visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0')}
    >
      {children}
    </div>
  )
}
