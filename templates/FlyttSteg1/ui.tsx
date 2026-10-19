'use client'

import { Check, ChevronRight, X } from 'lucide-react'
import clsx from 'clsx'
import type { ReactNode } from 'react'

export const NAVY = '#214766'

export const StatusBar = ({ dark = true }: { dark?: boolean }) => (
  <div className={clsx('flex items-center justify-between px-7 pt-3 pb-1 text-[15px] font-semibold', dark ? 'text-white' : 'text-[#214766]')}>
    <span>19:32</span>
    <span className="flex items-center gap-1.5">
      <span className="flex items-end gap-[2px]">
        <i className="block h-[5px] w-[3px] rounded-sm bg-current" />
        <i className="block h-[8px] w-[3px] rounded-sm bg-current" />
        <i className="block h-[11px] w-[3px] rounded-sm bg-current" />
        <i className="block h-[14px] w-[3px] rounded-sm bg-current" />
      </span>
      <span className="ml-1 block h-[11px] w-[24px] rounded-[3px] border-[1.5px] border-current p-[1.5px]">
        <i className="block h-full w-full rounded-[1px] bg-current" />
      </span>
    </span>
  </div>
)

export const AppHeader = () => (
  <div className="bg-[#214766] text-white">
    <StatusBar />
    <div className="flex items-center justify-between px-5 pb-4 pt-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/images/Logo.svg" alt="Flyttsmart" className="h-[22px] w-auto brightness-0 invert" />
      <span className="block h-8 w-8 rounded-full bg-white" />
    </div>
  </div>
)

export const Eyebrow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <p className={clsx('text-[11px] font-bold uppercase tracking-[0.12em] text-[#5B6873]', className)}>{children}</p>
)

export const PrimaryButton = ({
  children,
  onClick,
  tone = 'orange',
  disabled,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  tone?: 'orange' | 'navy' | 'outline' | 'ghost'
  disabled?: boolean
  className?: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    className={clsx(
      'flex h-14 w-full items-center justify-center gap-2 rounded-full text-[16px] font-bold transition-opacity',
      tone === 'orange' && 'bg-[#FFA65F] text-[#214766]',
      tone === 'navy' && 'bg-[#214766] text-white',
      tone === 'outline' && 'border-[1.5px] border-[#214766] bg-white text-[#214766]',
      tone === 'ghost' && 'border-[1.5px] border-white/80 bg-transparent text-white',
      disabled && 'cursor-not-allowed opacity-50',
      className,
    )}
  >
    {children}
  </button>
)

export const TextLink = ({ children, onClick, className }: { children: ReactNode; onClick?: () => void; className?: string }) => (
  <button type="button" onClick={onClick} className={clsx('text-[14px] text-[#214766] underline underline-offset-4', className)}>
    {children}
  </button>
)

export const Chip = ({ children, selected, onClick, className }: { children: ReactNode; selected?: boolean; onClick?: () => void; className?: string }) => (
  <button
    type="button"
    onClick={onClick}
    aria-pressed={selected}
    className={clsx(
      'flex h-11 items-center justify-center rounded-full px-4 text-[13px] whitespace-nowrap transition-colors',
      selected ? 'bg-[#214766] font-bold text-white' : 'border-[1.5px] border-[#D5DEE6] bg-white text-[#214766]',
      className,
    )}
  >
    {children}
  </button>
)

export const JaNejRow = ({
  label,
  value,
  onChange,
}: {
  label: string
  value?: 'ja' | 'nej'
  onChange: (v: 'ja' | 'nej') => void
}) => (
  <div className="flex items-center justify-between gap-4 border-t border-[#EEF1F4] py-3 first:border-t-0">
    <span className="text-[15px] leading-[21px] text-[#214766]">{label}</span>
    <div className="flex shrink-0 gap-2">
      {(['ja', 'nej'] as const).map((v) => (
        <button
          key={v}
          type="button"
          onClick={() => onChange(v)}
          aria-pressed={value === v}
          className={clsx(
            'h-11 w-14 rounded-full text-[14px] transition-colors',
            value === v ? 'bg-[#214766] font-bold text-white' : 'border-[1.5px] border-[#D5DEE6] bg-white text-[#214766]',
          )}
        >
          {v === 'ja' ? 'Ja' : 'Nej'}
        </button>
      ))}
    </div>
  </div>
)

export const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <button
    type="button"
    role="switch"
    aria-checked={on}
    onClick={() => onChange(!on)}
    className={clsx('relative h-7 w-12 rounded-full transition-colors', on ? 'bg-[#51C8B4]' : 'bg-[#D5DEE6]')}
  >
    <span className={clsx('absolute top-[3px] h-[22px] w-[22px] rounded-full bg-white shadow transition-all', on ? 'left-[23px]' : 'left-[3px]')} />
  </button>
)

export const CheckCircle = ({ className }: { className?: string }) => (
  <span className={clsx('flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#CDEFE8] text-[#1F6156]', className)}>
    <Check size={14} strokeWidth={3} />
  </span>
)

export const ListRow = ({ title, sub, onClick }: { title: string; sub?: string; onClick?: () => void }) => (
  <button type="button" onClick={onClick} className="flex w-full items-center gap-3 border-t border-[#EEF1F4] px-4 py-3 text-left first:border-t-0">
    <span className="flex-1">
      <span className="block text-[15px] font-bold text-[#214766]">{title}</span>
      {sub && <span className="block text-[13px] text-[#5B6873]">{sub}</span>}
    </span>
    <ChevronRight size={18} className="text-[#214766]" />
  </button>
)

export const GreenHead = ({ title, sub }: { title: string; sub: string }) => (
  <div className="bg-[#2F6B5E] px-6 pb-7 pt-8 text-white">
    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#9EE0D5] text-[#1F6156]">
      <Check size={20} strokeWidth={3} />
    </span>
    <h1 className="mt-5 text-[30px] font-bold leading-[36px]">{title}</h1>
    <p className="mt-3 text-[16px] leading-[24px] text-white/90">{sub}</p>
  </div>
)

export const Timeline = ({ rows }: { rows: { when: string; what: string }[] }) => (
  <div className="px-5">
    <h2 className="text-[16px] font-bold text-[#214766]">Så här blir det nu</h2>
    <dl className="mt-2 grid grid-cols-[96px_1fr] gap-x-3 gap-y-2">
      {rows.map((r) => (
        <div key={r.when} className="contents">
          <dt className="text-[14px] font-bold leading-[20px] text-[#1F6156]">{r.when}</dt>
          <dd className="text-[15px] leading-[21px] text-[#214766]">{r.what}</dd>
        </div>
      ))}
    </dl>
  </div>
)

export const ContactBox = () => (
  <div className="mx-5 rounded-xl bg-[#EAF2F8] px-4 py-3">
    <p className="text-[15px] font-bold text-[#214766]">Vi finns med hela vägen</p>
    <p className="text-[13px] text-[#5B6873]">Dyker frågor upp är det bara att ringa eller skriva till oss.</p>
  </div>
)

/** Stillbild av kartan bakom frågorna, i våra färger. */
export const MapBackdrop = ({ children }: { children?: ReactNode }) => (
  <div className="relative h-[300px] overflow-clip bg-[#E6ECEF]">
    <svg viewBox="0 0 390 300" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="390" height="300" fill="#E6ECEF" />
      <rect x="0" y="235" width="390" height="65" fill="#C9D9E3" />
      <rect x="20" y="40" width="120" height="110" rx="6" fill="#D6E2D8" />
      <rect x="250" y="130" width="140" height="90" rx="6" fill="#D6E2D8" />
      <g stroke="#F6F8F9" strokeWidth="14" strokeLinecap="round">
        <path d="M-10 190 L400 170" />
        <path d="M70 -10 L120 310" />
        <path d="M280 -10 L250 310" />
        <path d="M-10 90 L400 60" />
      </g>
      <path d="M96 160 C 170 110, 220 70, 300 52" stroke="#214766" strokeWidth="2.5" strokeDasharray="6 6" fill="none" />
      <circle cx="96" cy="160" r="9" fill="#214766" />
      <circle cx="96" cy="160" r="4" fill="#fff" />
      <path d="M300 52 m-12 -2 a12 12 0 1 1 24 0 c0 9 -12 20 -12 20 s-12 -11 -12 -20 z" fill="#51C8B4" />
      <circle cx="300" cy="50" r="4" fill="#fff" />
      <g fontFamily="inherit" fontSize="11" fill="#5B6873">
        <text x="14" y="220">Storgatan</text>
        <text x="300" y="112">Ekvägen</text>
      </g>
      <rect x="170" y="98" width="62" height="22" rx="11" fill="#214766" />
      <text x="201" y="113" fontSize="11" fill="#fff" textAnchor="middle" fontWeight="700">
        12 km
      </text>
      <rect x="108" y="128" width="40" height="18" rx="9" fill="#fff" />
      <text x="128" y="141" fontSize="10" fill="#214766" textAnchor="middle" fontWeight="700">
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
  <div className="absolute left-4 top-11 rounded-xl bg-white px-4 py-2 shadow-[0_4px_16px_rgba(33,71,102,0.12)]">
    <Eyebrow>{small}</Eyebrow>
    <p className="text-[20px] font-bold leading-[24px] text-[#214766]">{big}</p>
  </div>
)

export const CloseButton = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-label="Stäng" className="absolute right-4 top-11 flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-[0_4px_16px_rgba(33,71,102,0.12)]">
    <X size={20} className="text-[#214766]" />
  </button>
)

export const SavedChip = ({ children }: { children: ReactNode }) => (
  <div className="absolute left-4 top-[110px] flex items-center gap-2 rounded-full bg-[#1F6156] px-3 py-1.5 text-[12px] font-bold text-white">
    <Check size={14} strokeWidth={3} />
    {children}
  </div>
)

export const Sheet = ({ step, total, title, sub, children }: { step: number; total: number; title: string; sub?: string; children: ReactNode }) => (
  <div className="relative -mt-14 rounded-t-[28px] bg-white px-6 pb-8 pt-3">
    <span className="mx-auto block h-1.5 w-10 rounded-full bg-[#D5DEE6]" />
    <div className="mt-5 flex items-center justify-between">
      <Eyebrow>{step === total ? 'Sista frågan' : `Fråga ${step} av ${total}`}</Eyebrow>
      <span className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <i key={i} className={clsx('block h-1 w-5 rounded-full', i < step ? 'bg-[#51C8B4]' : 'bg-[#D5DEE6]')} />
        ))}
      </span>
    </div>
    <h1 className="mt-4 text-[24px] font-bold leading-[30px] text-[#214766]">{title}</h1>
    {sub && <p className="mt-1 text-[15px] text-[#5B6873]">{sub}</p>}
    {children}
  </div>
)

export const FieldLabel = ({ children, sub }: { children: ReactNode; sub?: string }) => (
  <div className="mb-2">
    <p className="text-[15px] font-bold text-[#214766]">{children}</p>
    {sub && <p className="text-[13px] text-[#5B6873]">{sub}</p>}
  </div>
)
