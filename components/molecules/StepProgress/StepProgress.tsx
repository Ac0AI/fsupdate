import React from 'react'
import { clsx } from 'clsx'
import { stepBarVariants, stepLabelVariants, type StepState } from './StepProgress.variants'

export type StepProgressProps = {
  step: number
  titles: readonly string[]
  hints?: readonly string[]
  /** Ersätter "Steg X av Y", till exempel "Klart · 3 av 3". Markerar alla steg som klara. */
  label?: string
  complete?: boolean
  contentClassName?: string
}

/**
 * Stegraden överst i ett tjänsteflöde. Mobil: "Steg 1 av 3 · Namn" och strecken.
 * Desktop: strecken med stegnamnen under, så raden ovanför vore dubbel numrering.
 */
const StepProgress = ({ step, titles, hints = [], label, complete, contentClassName = 'max-w-[818px]' }: StepProgressProps) => (
  <div className="bg-[var(--color-white-main)] border-b border-[var(--color-inactive-main)]">
    <div className={clsx('w-full mx-auto px-4 py-3 md:py-4 flex flex-col gap-2 md:gap-2.5', contentClassName)}>
      <div className="flex items-baseline justify-between gap-3 md:hidden">
        <span className="text-[length:var(--font-size-2)] font-bold text-[var(--color-text-main)]">
          {label ?? `Steg ${step + 1} av ${titles.length}`}
          {!label && <span> · {titles[step]}</span>}
        </span>
        {hints[step] && <span className="text-[length:var(--font-size-1)] text-[var(--color-inactive-dark)] shrink-0">{hints[step]}</span>}
      </div>
      <ol className="flex gap-1.5 md:gap-2">
        {titles.map((t, i) => {
          const state: StepState = i < step || !!label || !!complete ? 'done' : i === step ? 'current' : 'todo'
          return (
            <li key={i} className="flex-1 min-w-0 flex flex-col gap-1.5" aria-current={state === 'current' ? 'step' : undefined}>
              <span className={stepBarVariants({ state })} />
              <span className={stepLabelVariants({ state })}>
                {state === 'done' && (
                  <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden className="shrink-0">
                    <path d="M5 12.5l4.5 4.5L19 8" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
                <span className="truncate">{t}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  </div>
)

export default StepProgress
