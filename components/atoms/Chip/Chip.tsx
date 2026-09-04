'use client'

import React from 'react'
import { clsx } from 'clsx'
import { chipVariants, chipHintVariants } from './Chip.variants'

export type ChipProps = {
  active: boolean
  onClick: () => void
  /** Andra raden: en kort förklaring. Gör chipet tvåradigt. */
  hint?: string
  size?: 'md' | 'sm'
  className?: string
  dataTestId?: string
  children: React.ReactNode
}

const Chip = ({ active, onClick, hint, size = 'md', className, dataTestId, children }: ChipProps) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    data-testid={dataTestId}
    className={clsx(chipVariants({ active, size, stacked: !!hint }), className)}
  >
    <span className="flex items-center gap-1.5">
      {active && (
        // shrink-0: i trånga chips (sex våningar på en rad) krymper bocken annars till noll.
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden className="shrink-0">
          <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {children}
    </span>
    {hint && <span className={chipHintVariants({ active })}>{hint}</span>}
  </button>
)

export default Chip
