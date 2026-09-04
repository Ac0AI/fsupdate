'use client'

import React from 'react'
import { clsx } from 'clsx'
import { choiceCardVariants, choiceCardRingVariants } from './ChoiceCard.variants'

export type ChoiceCardProps = {
  active: boolean
  onClick: () => void
  title: string
  hint?: string
  className?: string
  dataTestId?: string
}

const ChoiceCard = ({ active, onClick, title, hint, className, dataTestId }: ChoiceCardProps) => (
  <button type="button" role="radio" aria-checked={active} onClick={onClick} data-testid={dataTestId} className={clsx(choiceCardVariants({ active }), className)}>
    <span className={choiceCardRingVariants({ active })} />
    <span className="flex flex-col gap-px">
      <span className={clsx('text-[length:var(--font-size-4)] text-[var(--color-text-main)]', active && 'font-bold')}>{title}</span>
      {hint && <span className="text-[length:var(--font-size-2)] text-[var(--color-inactive-dark)]">{hint}</span>}
    </span>
  </button>
)

export default ChoiceCard
