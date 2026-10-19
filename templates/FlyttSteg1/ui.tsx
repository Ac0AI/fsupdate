'use client'

import { Check, X } from 'lucide-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'
import Button from '@/components/atoms/Button'
import SiteChip from '@/components/atoms/Chip'

/*
 * Färger och knappar kommer från sajtens egna tokens och atomer, så prototypen
 * ser ut som appen i dag. Marginaler ligger på omslutande div:ar: sajtens
 * reset-css nollar margin på button, så mt-* direkt på knappar försvinner.
 */

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
      onClick={onClick ?? (() => undefined)}
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
  <SiteChip active={!!selected} onClick={onClick ?? (() => undefined)} size={small ? 'sm' : 'md'}>
    {children}
  </SiteChip>
)

export const JaNejRow = ({ label, value, onChange }: { label: string; value?: 'ja' | 'nej'; onChange: (v: 'ja' | 'nej') => void }) => (
  <div className="flex items-center justify-between gap-3 border-t border-[var(--color-inactive-main)] py-2 first:border-t-0">
    <span className="text-[15px] leading-[21px] text-[var(--color-text-main)]">{label}</span>
    <div className="flex w-[124px] shrink-0 gap-1">
      <SiteChip size="sm" active={value === 'nej'} onClick={() => onChange('nej')}>
        Nej
      </SiteChip>
      <SiteChip size="sm" active={value === 'ja'} onClick={() => onChange('ja')}>
        Ja
      </SiteChip>
    </div>
  </div>
)

export const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className={clsx('relative h-7 w-12 shrink-0 rounded-full transition-colors', on ? 'bg-[var(--color-primary-main)]' : 'bg-[var(--color-inactive-grey-light)]')}
  >
    <span className={clsx('absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all', on ? 'left-[23px]' : 'left-[3px]')} />
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

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-label="Stäng" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--color-secondary-extra-extra-light)]">
    <X size={20} className="text-[var(--color-secondary-main)]" />
  </button>
)

/** Överst i frågorna: att svaren sparas, och efter första svaret vad som just sparades. */
export const SavedStatus = ({ children }: { children?: ReactNode }) =>
  children ? (
    <div className="flex min-w-0 items-center gap-2 rounded-full bg-[var(--color-primary-dark)] px-3 py-1.5 text-[12px] font-bold text-white">
      <Check size={14} strokeWidth={3} className="shrink-0" />
      <span className="truncate">{children}</span>
    </div>
  ) : (
    <div className="flex min-w-0 items-center gap-2 text-[13px] font-bold text-[var(--color-primary-dark)]">
      <Check size={16} strokeWidth={3} className="shrink-0" />
      <span className="truncate">Dina svar sparas direkt</span>
    </div>
  )

export const Sheet = ({ step, total, title, sub, children }: { step: number; total: number; title: string; sub?: string; children: ReactNode }) => (
  <div className="bg-white px-5 pb-8 pt-5">
    <div className="flex items-center justify-between">
      <Eyebrow>{step === total ? 'Sista frågan' : `Fråga ${step} av ${total}`}</Eyebrow>
      <span className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <i key={i} className={clsx('block h-1 w-5 rounded-full', i < step ? 'bg-[var(--color-primary-main)]' : 'bg-[var(--color-inactive-main)]')} />
        ))}
      </span>
    </div>
    <h1 className="mt-4 text-[24px] font-bold leading-[30px] text-[var(--color-text-main)]">{title}</h1>
    {sub && <p className="mt-1 text-[15px] text-[var(--color-inactive-dark)]">{sub}</p>}
    {children}
  </div>
)

export const FieldLabel = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <div className="mb-2">
    <p className="text-[15px] font-bold text-[var(--color-text-main)]">{children}</p>
    {sub && <p className="text-[13px] text-[var(--color-inactive-dark)]">{sub}</p>}
  </div>
)
