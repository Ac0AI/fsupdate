import React from 'react'
import { clsx } from 'clsx'
import RoundCheckmark from '@/components/atoms/RoundCheckmark'

export type TimelineItem = { state: 'done' | 'current' | 'todo'; title: string; hint: string }
export type TimelineProps = { items: TimelineItem[] }

/** Vad som hänt och vad som händer härnäst, som en lodrät tidslinje. */
const Timeline = ({ items }: TimelineProps) => (
  <div className="flex flex-col">
    {items.map((it, i) => (
      <div key={it.title} className="flex items-stretch gap-3">
        <div className="flex flex-col items-center gap-1 shrink-0 w-[22px] self-stretch">
          {it.state === 'done' && (
            <span className="w-[22px] h-[22px] animate-[pop_.45s_cubic-bezier(.2,.9,.3,1.3)_both] motion-reduce:animate-none">
              <RoundCheckmark />
            </span>
          )}
          {it.state === 'current' && <span className="w-[22px] h-[22px] rounded-full border-[6px] border-[var(--color-secondary-main)] bg-[var(--color-white-main)]" />}
          {it.state === 'todo' && <span className="w-[22px] h-[22px] rounded-full border-2 border-[var(--color-inactive-main)] bg-[var(--color-white-main)]" />}
          {i < items.length - 1 && <span className={clsx('w-0.5 flex-1 min-h-[14px]', it.state === 'done' ? 'bg-[var(--color-primary-main)]' : 'bg-[var(--color-inactive-main)]')} />}
        </div>
        <div className={clsx('flex flex-col gap-0.5', i < items.length - 1 && 'pb-3.5')}>
          <span className={clsx('text-[length:var(--font-size-2)] font-semibold', it.state === 'todo' ? 'text-[var(--color-inactive-dark)]' : 'text-[var(--color-text-main)]')}>{it.title}</span>
          <span className="text-[length:var(--font-size-1)] text-[var(--color-inactive-dark)]">{it.hint}</span>
        </div>
      </div>
    ))}
  </div>
)

export default Timeline
