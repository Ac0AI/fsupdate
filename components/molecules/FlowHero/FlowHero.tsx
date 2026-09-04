import React from 'react'
import { clsx } from 'clsx'
import { flowHeroVariants } from './FlowHero.variants'

export type FlowHeroProps = {
  /** Tjänstens namn som liten rad. Stegräknaren står redan i stegraden. */
  eyebrow?: string
  title: string
  copy?: string
  tone?: 'blue' | 'green'
  back?: { label: string; onClick: () => void }
  contentClassName?: string
  children?: React.ReactNode
}

const rise = 'animate-[rise_.35s_ease-out_both] motion-reduce:animate-none'

const FlowHero = ({ eyebrow, title, copy, tone = 'blue', back, contentClassName = 'max-w-[818px]', children }: FlowHeroProps) => (
  <div className={flowHeroVariants({ tone })}>
    <div className={clsx('w-full mx-auto px-4 pt-3 pb-5 md:pt-8 md:pb-7 flex flex-col gap-2', contentClassName)}>
      {back && (
        <button
          type="button"
          onClick={back.onClick}
          className="self-start -my-2.5 min-h-11 flex items-center gap-2 text-[length:var(--font-size-2)] leading-[18px] text-[var(--color-white-main)]/90 hover:text-[var(--color-white-main)] rounded-sm transition-colors duration-200 ease-standard focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-main)] focus-visible:ring-offset-2"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
            <path d="M15 19l-7-7 7-7" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {back.label}
        </button>
      )}
      {eyebrow && <span className="text-[length:var(--font-size-1)] md:text-[length:var(--font-size-2)] font-bold uppercase tracking-[0.12em] leading-4 text-[var(--color-white-main)] opacity-80">{eyebrow}</span>}
      <h1 key={title} className={clsx('text-[28px] md:text-[42px] font-[var(--font-weight-black)] tracking-[-0.02em] leading-8 md:leading-[48px] text-[var(--color-white-main)]', rise)}>
        {title}
      </h1>
      {copy && (
        <p key={copy} className={clsx('text-[length:var(--font-size-4)] md:text-[length:var(--font-size-6)] leading-[21px] md:leading-[25px] text-[var(--color-white-main)] max-w-[330px] md:max-w-[560px]', rise)}>
          {copy}
        </p>
      )}
      {children}
    </div>
  </div>
)

export default FlowHero
