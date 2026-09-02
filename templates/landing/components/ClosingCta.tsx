'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import Button from '@/components/atoms/Button'

const LOGIN_URL = '/i/testmode'
const MICROCOPY = 'Kostnadsfritt · 2 min · logga in med BankID'

const Arrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
    <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/**
 * Sista knappen. Sidan slutar med samma handling som den börjar med, så den
 * som läst hela vägen ner inte behöver scrolla upp igen.
 */
const ClosingCta = () => {
  const router = useRouter()
  return (
    <section id="closing-cta" aria-labelledby="closing-cta-heading" className="w-screen bg-[var(--color-secondary-main)]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-16 md:py-24 flex flex-col items-center text-center">
        <h2 id="closing-cta-heading" className="text-white font-bold leading-[1.08] text-[32px] md:text-[44px] lg:text-[52px] mb-4 max-w-[720px]">
          Redo? Det tar två minuter.
        </h2>
        <p className="text-lg text-white/75 leading-relaxed max-w-[520px] mb-8">
          Logga in med BankID, så har du din checklista och ett förslag per tjänst.
        </p>
        <div className="flex flex-col items-center gap-3 w-full sm:w-auto">
          <Button
            className="!text-[var(--color-secondary-main)] shadow-[0_10px_24px_rgba(1,22,39,0.3)]"
            padding="16px 32px"
            variant="primaryAltInverted"
            iconRight={<Arrow />}
            text="Starta din flytt"
            onClick={() => router.push(LOGIN_URL)}
            withFullWidth
          />
          <span className="text-[13px] leading-4 text-white/70">{MICROCOPY}</span>
        </div>
      </div>
    </section>
  )
}

/**
 * Sticky knapp på mobil. Visas när herons knapp har scrollat ur bild och döljs
 * igen när slutknappen är i bild, så det aldrig står två knappar på skärmen.
 */
export const StickyCta = () => {
  const router = useRouter()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const targets = [...Array.from(document.querySelectorAll<HTMLElement>('[data-hero-cta]')), document.getElementById('closing-cta')].filter(
      (el): el is HTMLElement => !!el,
    )
    if (!targets.length || !('IntersectionObserver' in window)) return
    const visible = new Map<Element, boolean>()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => visible.set(e.target, e.isIntersecting))
        setShow(!Array.from(visible.values()).some(Boolean))
      },
      { threshold: 0.2 },
    )
    targets.forEach((t) => io.observe(t))
    return () => io.disconnect()
  }, [])

  if (!show) return null
  return (
    <div
      data-sticky-cta
      className={clsx(
        'md:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-[var(--color-secondary-main)]/10',
        'px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))]',
        'animate-[rise_.3s_ease-out_both] motion-reduce:animate-none',
      )}
    >
      <Button
        className="!text-[var(--color-secondary-main)]"
        padding="14px 24px"
        variant="primaryAltInverted"
        iconRight={<Arrow />}
        text="Starta din flytt"
        onClick={() => router.push(LOGIN_URL)}
        withFullWidth
      />
    </div>
  )
}

export default ClosingCta
