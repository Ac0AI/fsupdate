'use client'

import { Check, ChevronLeft, Minus, Plus, X } from 'lucide-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import Button from '@/components/atoms/Button'
import SiteChip from '@/components/atoms/Chip'
import Switch from '@/components/atoms/Switch'
import { TOTAL } from './state'

/*
 * Byggstenar för frågeskärmarna, i sajtens tokens och atomer. Upplägget är
 * Nils prototyp: frågan först, full bredd, Fortsätt fast i botten. Marginaler
 * ligger på omslutande div:ar eftersom sajtens reset-css nollar margin på button.
 */

const noop = () => undefined

export const STEG = ['Adresser', 'Bära ut', 'Bära in', 'Vad ska med', 'Städning', 'Sista detaljerna'] as const

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={clsx('text-[11px] font-bold uppercase tracking-[0.12em] text-[var(--color-inactive-dark)]', className)}>{children}</p>
)

export const PrimaryButton = ({
  children,
  onClick,
  tone = 'orange',
  disabled,
  className,
}: {
  children: string
  onClick?: () => void
  tone?: 'orange' | 'navy' | 'outline' | 'ghost'
  disabled?: boolean
  className?: string
}) => (
  <div className={clsx('w-full', className)}>
    <Button
      variant={tone === 'orange' ? 'orange' : tone === 'navy' ? 'primary' : tone === 'outline' ? 'outline' : 'ghostInverted'}
      withFullWidth
      fontSize={16}
      disabled={disabled}
      onClick={onClick ?? noop}
      text={children}
      className="min-h-[52px]"
    />
  </div>
)

export const TextLink = ({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) => (
  <button type="button" onClick={onClick} className={clsx('text-[14px] text-[var(--color-secondary-main)] underline underline-offset-4', className)}>
    {children}
  </button>
)

export const Chip = ({ children, selected, onClick, small }: { children: ReactNode; selected?: boolean; onClick?: () => void; small?: boolean }) => (
  <SiteChip active={!!selected} onClick={onClick ?? noop} size={small ? 'sm' : 'md'}>
    {children}
  </SiteChip>
)

export const ChipRow = ({ children }: { children: ReactNode }) => <div className="flex flex-wrap gap-2">{children}</div>

/** Två eller tre val som delar bredden, som Nils Ja/Nej-knappar. */
export const ChoiceRow = <T extends string>({ options, value, onChange }: { options: [T, string][]; value?: T; onChange: (v: T) => void }) => (
  <div className="flex gap-2">
    {options.map(([v, label]) => (
      <button
        key={v}
        type="button"
        aria-pressed={value === v}
        onClick={() => onChange(v)}
        className={clsx(
          'flex h-11 min-w-0 flex-1 items-center justify-center rounded-[var(--radius-button)] border-[1.5px] px-2 text-[15px] transition-colors',
          value === v ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] font-bold text-white' : 'border-[var(--color-inactive-main)] bg-white text-[var(--color-text-main)]',
        )}
      >
        {label}
      </button>
    ))}
  </div>
)

export const SwitchRow = ({ label, hint, on, onChange }: { label: string; hint?: string; on: boolean; onChange: (v: boolean) => void }) => (
  <button type="button" role="switch" aria-checked={on} onClick={() => onChange(!on)} className="flex w-full items-center justify-between gap-4 border-t border-[var(--color-inactive-main)] py-3 text-left first:border-t-0">
    <span className="min-w-0">
      <span className="block text-[15px] leading-[21px] text-[var(--color-text-main)]">{label}</span>
      {hint && <span className="block text-[13px] text-[var(--color-inactive-dark)]">{hint}</span>}
    </span>
    <span className="flex shrink-0 items-center gap-2 text-[13px] text-[var(--color-inactive-dark)]">
      {on ? 'Ja' : 'Nej'}
      <Switch on={on} />
    </span>
  </button>
)

export const Section = ({ title, sub, children, className }: { title: string; sub?: string; children: ReactNode; className?: string }) => (
  <section className={className ?? 'mt-7'}>
    <h2 className="text-[16px] font-bold leading-[22px] text-[var(--color-text-main)]">{title}</h2>
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

export const InfoNote = ({ children }: { children: ReactNode }) => <p className="mt-3 rounded-[var(--radius-main)] bg-[var(--color-secondary-extra-extra-light)] px-4 py-3 text-[14px] leading-[20px] text-[var(--color-text-main)]">{children}</p>

/** Streckad "Lägg till"-ruta, som Nils. */
export const AddCard = ({ label, hint, onClick }: { label: string; hint: string; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center gap-3 rounded-[var(--radius-main)] border-[1.5px] border-dashed border-[var(--color-inactive-grey-light)] bg-white p-3 text-left">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-extra-extra-light)] text-[var(--color-secondary-main)]">
      <Plus size={18} />
    </span>
    <span className="min-w-0">
      <span className="block text-[15px] font-bold leading-5 text-[var(--color-secondary-main)]">{label}</span>
      <span className="block text-[13px] text-[var(--color-inactive-dark)]">{hint}</span>
    </span>
  </button>
)

export const ItemCard = ({ title, onRemove, children }: { title: string; onRemove: () => void; children: ReactNode }) => (
  <div className="rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-secondary-main)] bg-white p-4">
    <div className="flex items-center justify-between gap-3">
      <span className="truncate text-[15px] font-bold text-[var(--color-secondary-main)]">{title}</span>
      <TextLink onClick={onRemove}>Ta bort</TextLink>
    </div>
    <div className="mt-3">{children}</div>
  </div>
)

export const MoreLink = ({ children, onClick }: { children: ReactNode; onClick: () => void }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-2 py-1 text-[14px] text-[var(--color-secondary-main)] underline underline-offset-4">
    <Plus size={16} className="shrink-0" />
    {children}
  </button>
)

/** 16 px text, annars zoomar iOS när fältet fokuseras. */
export const TextField = ({ value, onChange, placeholder, rows = 3, label }: { value: string; onChange: (v: string) => void; placeholder: string; rows?: number; label: string }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    aria-label={label}
    className="w-full rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] p-3 text-[16px] leading-[22px] text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-inactive-grey-light)] focus:border-[var(--color-secondary-main)]"
  />
)

export const TextInput = ({ value, onChange, placeholder, label }: { value: string; onChange: (v: string) => void; placeholder: string; label: string }) => (
  <input
    type="text"
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    aria-label={label}
    className="h-12 w-full rounded-[var(--radius-main)] border-[1.5px] border-[var(--color-inactive-main)] px-3 text-[16px] text-[var(--color-text-main)] outline-none placeholder:text-[var(--color-inactive-grey-light)] focus:border-[var(--color-secondary-main)]"
  />
)

export const Stepper = ({ value, onChange, min = 1, max = 99 }: { value: number; onChange: (v: number) => void; min?: number; max?: number }) => (
  <div className="flex items-center gap-1">
    <button type="button" aria-label="Färre" onClick={() => onChange(Math.max(min, value - 1))} className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--color-inactive-main)] text-[var(--color-secondary-main)]">
      <Minus size={16} />
    </button>
    <span className="w-8 text-center text-[16px] font-bold text-[var(--color-text-main)]">{value}</span>
    <button type="button" aria-label="Fler" onClick={() => onChange(Math.min(max, value + 1))} className="flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--color-inactive-main)] text-[var(--color-secondary-main)]">
      <Plus size={16} />
    </button>
  </div>
)

/** Kryssruta i kortform, för flerval som fönstertyper och tillval. */
export const CheckTile = ({ label, hint, selected, onClick, icon, className }: { label: string; hint?: string; selected: boolean; onClick: () => void; icon?: ReactNode; className?: string }) => (
  <button
    type="button"
    aria-pressed={selected}
    onClick={onClick}
    className={clsx('flex min-h-[64px] items-center gap-3 rounded-[var(--radius-main)] border-[1.5px] p-3 text-left transition-colors', selected ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-main)] bg-white', className)}
  >
    {icon ? (
      <span className={clsx('shrink-0', selected ? 'text-[var(--color-secondary-main)]' : 'text-[var(--color-inactive-dark)]')}>{icon}</span>
    ) : (
      <span className={clsx('flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px]', selected ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] text-white' : 'border-[var(--color-inactive-grey-light)]')}>{selected && <Check size={14} strokeWidth={3} />}</span>
    )}
    <span className="min-w-0">
      <span className="block text-[15px] font-bold leading-5 text-[var(--color-secondary-main)]">{label}</span>
      {hint && <span className="block text-[12px] leading-4 text-[var(--color-inactive-dark)]">{hint}</span>}
    </span>
  </button>
)

/** Envalskort med ikon, som Lite/Normalt/Mycket. */
export const Tile = ({ label, hint, selected, onClick, icon }: { label: string; hint?: string; selected: boolean; onClick: () => void; icon?: ReactNode }) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={clsx('flex min-h-[96px] flex-col items-center justify-center gap-1 rounded-[var(--radius-main)] border-[1.5px] px-2 py-4 text-center transition-colors', selected ? 'border-[var(--color-secondary-main)] bg-[var(--color-secondary-extra-extra-light)]' : 'border-[var(--color-inactive-main)] bg-white')}
  >
    {icon && <span className="text-[var(--color-secondary-main)]">{icon}</span>}
    <span className="mt-1 text-[15px] font-bold leading-5 text-[var(--color-secondary-main)]">{label}</span>
    {hint && <span className="text-[12px] leading-4 text-[var(--color-inactive-dark)]">{hint}</span>}
  </button>
)

export const GreenHead = ({ title, sub }: { title: string; sub: string }) => (
  <div className="bg-[var(--color-primary-dark)] px-5 pb-7 pt-8 text-white">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]">
      <Check size={20} strokeWidth={3} />
    </span>
    <h1 className="mt-5 text-[28px] font-bold leading-[34px] text-white">{title}</h1>
    <p className="mt-3 text-[16px] leading-[24px] text-white/90">{sub}</p>
  </div>
)

export const Timeline = ({ rows }: { rows: { when: string; what: string }[] }) => (
  <div className="px-5">
    <h2 className="text-[16px] font-bold text-[var(--color-text-main)]">Så här blir det nu</h2>
    <dl className="mt-2 grid grid-cols-[96px_1fr] gap-x-3 gap-y-2">
      {rows.map((r) => (
        <div key={r.when} className="contents">
          <dt className="text-[14px] font-bold leading-[20px] text-[var(--color-primary-dark)]">{r.when}</dt>
          <dd className="text-[15px] leading-[21px] text-[var(--color-text-main)]">{r.what}</dd>
        </div>
      ))}
    </dl>
  </div>
)

export const ContactBox = () => (
  <div className="mx-5 rounded-[var(--radius-main)] bg-[var(--color-secondary-extra-extra-light)] px-4 py-3">
    <p className="text-[15px] font-bold text-[var(--color-text-main)]">Vi finns med hela vägen</p>
    <p className="text-[13px] text-[var(--color-inactive-dark)]">Dyker frågor upp är det bara att ringa eller skriva till oss.</p>
  </div>
)

/**
 * Ramen runt varje frågeskärm: tillbaka, steg x av 6, krysset, frågan, och
 * Fortsätt fast i botten. Allt är frivilligt, så Fortsätt är aldrig låst.
 */
export const Frame = ({
  step,
  title,
  sub,
  children,
  cta = 'Fortsätt',
  ctaTone = 'navy',
  foot = 'Allt sparas direkt. Hoppa över det du inte vet.',
  onNext,
  onBack,
  onClose,
}: {
  step: number
  title: string
  sub?: string
  children: ReactNode
  cta?: string
  ctaTone?: 'navy' | 'orange'
  foot?: string
  onNext: () => void
  onBack: () => void
  onClose: () => void
}) => (
  <div className="flex flex-1 flex-col bg-white">
    <div className="flex items-center justify-between px-2 pt-1">
      <button type="button" onClick={onBack} aria-label="Tillbaka" className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-secondary-main)]">
        <ChevronLeft size={24} />
      </button>
      <span className="text-[13px] font-bold text-[var(--color-text-main)]">
        Steg {step + 1} av {TOTAL} · {STEG[step]}
      </span>
      <button type="button" onClick={onClose} aria-label="Stäng" className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--color-secondary-main)]">
        <X size={22} />
      </button>
    </div>
    <ol className="flex gap-1.5 px-4 pt-1" aria-hidden>
      {STEG.map((s, i) => (
        <li key={s} className={clsx('h-1 flex-1 rounded-full', i < step ? 'bg-[var(--color-primary-main)]' : i === step ? 'bg-[var(--color-secondary-main)]' : 'bg-[var(--color-inactive-main)]')} />
      ))}
    </ol>
    <div className="flex-1 px-4 pb-8 pt-6">
      <h1 className="text-[24px] font-bold leading-[30px] text-[var(--color-text-main)]">{title}</h1>
      {sub && <p className="mt-1 text-[15px] leading-[21px] text-[var(--color-inactive-dark)]">{sub}</p>}
      {children}
    </div>
    <div className="sticky bottom-0 z-10 border-t border-[var(--color-inactive-main)] bg-white px-4 pb-4 pt-3">
      <PrimaryButton tone={ctaTone} onClick={onNext}>
        {cta}
      </PrimaryButton>
      <p className="mt-2 text-center text-[12px] text-[var(--color-inactive-dark)]">{foot}</p>
    </div>
  </div>
)
