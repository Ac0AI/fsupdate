'use client'

import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import InfoIcon from '@/components/atoms/InfoIcon'

/**
 * Förklaring bakom en i-ikon. Mus: visas vid hovring, klick låser fast den.
 * Fingrar: ett tryck öppnar, nästa stänger, liksom tryck utanför och Escape.
 * Bubblan ritas i en portal med fast position, så den hamnar över grannkort
 * som har egna staplingskontexter. Träffytan är 44 px fast ikonen är 16.
 */
const BUBBLE_W = 264
const BUBBLE_H = 110

export type InfoTipProps = { text: string }

const InfoTip = ({ text }: InfoTipProps) => {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left?: number; right?: number } | null>(null)
  const ref = useRef<HTMLSpanElement>(null)
  const id = useId()

  useLayoutEffect(() => {
    if (!open || !ref.current) {
      setPos(null)
      return
    }
    const r = ref.current.getBoundingClientRect()
    const flipX = r.left + BUBBLE_W > window.innerWidth - 16
    const flipY = r.bottom + BUBBLE_H > window.innerHeight - 16
    setPos({
      ...(flipY ? { bottom: window.innerHeight - r.top + 4 } : { top: r.bottom + 4 }),
      ...(flipX ? { right: window.innerWidth - r.right } : { left: r.left }),
    })
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => {
      setOpen(false)
      setPinned(false)
    }
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const outside = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false)
        setPinned(false)
      }
    }
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setPinned(false)
      }
    }
    document.addEventListener('pointerdown', outside)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('pointerdown', outside)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <span ref={ref} className="relative inline-flex">
      <button
        type="button"
        aria-label="Mer information"
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerEnter={(e) => e.pointerType === 'mouse' && setOpen(true)}
        onPointerLeave={(e) => e.pointerType === 'mouse' && !pinned && setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => !pinned && setOpen(false)}
        onClick={() => {
          const next = !pinned
          setPinned(next)
          setOpen(next)
        }}
        className="w-11 h-11 -my-[14px] -mx-2.5 flex items-center justify-center rounded-full text-[var(--color-radio-border)] hover:text-[var(--color-text-main)] transition-colors"
      >
        <InfoIcon width={16} height={16} color="currentColor" />
      </button>
      {open &&
        pos &&
        createPortal(
          <span
            role="tooltip"
            id={id}
            style={pos}
            className="fixed z-50 w-max max-w-[264px] rounded-[var(--radius-small)] bg-[var(--color-secondary-dark)] px-3 py-2 text-[length:var(--font-size-1)] font-normal normal-case tracking-normal leading-[17px] text-[var(--color-white-main)] shadow-[0_6px_20px_rgba(1,22,39,0.25)] animate-[rise_.2s_ease-out_both] motion-reduce:animate-none"
          >
            {text}
          </span>,
          document.body,
        )}
    </span>
  )
}

export default InfoTip
