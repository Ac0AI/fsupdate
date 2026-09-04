import React from 'react'
import { clsx } from 'clsx'

export type FieldErrorProps = {
  className?: string
  children: React.ReactNode
}

/** Felet står vid fältet och säger varför vi frågar. */
const FieldError = ({ className, children }: FieldErrorProps) => (
  <span role="alert" className={clsx('text-[length:var(--font-size-1)] leading-4 font-semibold text-[var(--color-error-red)]', 'animate-[rise_.35s_ease-out_both] motion-reduce:animate-none', className)}>
    {children}
  </span>
)

export default FieldError
