import React from 'react'
import { clsx } from 'clsx'

export interface ChevronProps {
  direction?: 'right' | 'down'
  color?: string
  size?: number
  className?: string
}

const Chevron = ({ direction = 'right', color = 'currentColor', size = 18, className }: ChevronProps) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={clsx('shrink-0 transition-transform duration-200 ease-standard', direction === 'down' && 'rotate-90', className)} aria-hidden>
    <path d="M9 5l7 7-7 7" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default Chevron
