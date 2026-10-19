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

/** Stillbild av kartan bakom frågorna, i våra färger. */
export const MapBackdrop = ({ children }: { children?: ReactNode }) => (
  <div className="relative h-[260px] overflow-clip bg-[#E6ECEF]">
    <svg viewBox="0 0 390 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="390" height="260" fill="#E6ECEF" />
      <rect x="0" y="215" width="390" height="45" fill="#C9D9E3" />
      <rect x="20" y="40" width="120" height="100" rx="6" fill="#D6E2D8" />
      <rect x="250" y="120" width="140" height="80" rx="6" fill="#D6E2D8" />
      <g stroke="#F6F8F9" strokeWidth="14" strokeLinecap="round">
        <path d="M-10 180 L400 160" />
        <path d="M70 -10 L120 270" />
        <path d="M280 -10 L250 270" />
        <path d="M-10 90 L400 60" />
      </g>
      <path d="M96 150 C 170 110, 220 70, 300 52" stroke="#214766" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
      <circle cx="96" cy="150" r="9" fill="#214766" />
      <circle cx="96" cy="150" r="4" fill="#fff" />
      <path d="M300 52 m-12 -2 a12 12 0 1 1 24 0 c0 9 -12 20 -12 20 s-12 -11 -12 -20 z" fill="#51C8B4" />
      <circle cx="300" cy="50" r="4" fill="#fff" />
      <g fontFamily="inherit" fontSize="11" fill="#767678">
        <text x="14" y="188">Storgatan</text>
        <text x="300" y="112">Ekvägen</text>
      </g>
      <rect x="196" y="78" width="62" height="22" rx="11" fill="#214766" />
      <text x="227" y="93" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="700">
        12 km
      </text>
      <rect x="108" y="118" width="40" height="18" rx="9" fill="#fff" />
      <text x="128" y="131" fontSize="10" fill="#214766" textAnchor="middle" fontWeight="700">
        Från
      </text>
      <rect x="275" y="12" width="36" height="18" rx="9" fill="#fff" />
      <text x="293" y="25" fontSize="10" fill="#214766" textAnchor="middle" fontWeight="700">
        Till
      </text>
    </svg>
    {children}
  </div>
)

export const SavedPill = ({ small, big }: { small: string; big: string }) => (
  <div className="absolute left-4 top-4 rounded-[var(--radius-main)] bg-white px-4 py-2 shadow-[0_4px_16px_rgba(33,71,102,0.12)]">
    <Eyebrow>{small}</Eyebrow>
    <p className="text-[18px] font-bold leading-[22px] text-[var(--color-text-main)]">{big}</p>
  </div>
)

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-label="Stäng" className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(33,71,102,0.12)]">
    <X size={20} className="text-[var(--color-secondary-main)]" />
  </button>
)

/** Ligger nere till vänster på kartan, ovanför arket, så den inte krockar med kartans etiketter. */
export const SavedChip = ({ children }: { children: ReactNode }) => (
  <div className="absolute bottom-[72px] left-4 flex max-w-[calc(100%-32px)] items-center gap-2 rounded-full bg-[var(--color-primary-dark)] px-3 py-1.5 text-[12px] font-bold text-white">
    <Check size={14} strokeWidth={3} className="shrink-0" />
    <span className="truncate">{children}</span>
  </div>
)

export const Sheet = ({ step, total, title, sub, children }: { step: number; total: number; title: string; sub?: string; children: ReactNode }) => (
  <div className="relative -mt-14 rounded-t-[28px] bg-white px-5 pb-8 pt-3">
    <span className="mx-auto block h-1.5 w-10 rounded-full bg-[var(--color-inactive-main)]" />
    <div className="mt-5 flex items-center justify-between">
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
