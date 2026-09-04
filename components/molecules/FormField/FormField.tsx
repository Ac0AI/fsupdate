import React from 'react'
import { clsx } from 'clsx'
import Text from '@/components/atoms/Text'
import FieldError from '@/components/atoms/FieldError'
import InfoTip from '@/components/molecules/InfoTip'

export type FormFieldProps = {
  label: string
  /** Kort tillägg efter etiketten, i navy. */
  hint?: string
  /** Förklaring bakom en i-ikon. */
  info?: string
  error?: string
  /** Markerar fältet som ogiltigt utan egen feltext (felet visas på annan rad). */
  invalid?: boolean
  className?: string
  children: React.ReactNode
}

/**
 * Etikett, reglage och fel som en enhet. data-invalid gör att flödet kan
 * scrolla till första felet.
 */
const FormField = ({ label, hint, info, error, invalid, className, children }: FormFieldProps) => (
  <div className={clsx('flex-1 flex flex-col gap-1.5', className)} data-invalid={error || invalid ? 'true' : undefined}>
    <Text as="span" variant="details" className="text-[var(--color-inactive-dark)] flex items-center gap-1">
      <span>
        {label}
        {hint && <span className="text-[var(--color-text-main)] font-semibold"> · {hint}</span>}
      </span>
      {info && <InfoTip text={info} />}
    </Text>
    {children}
    {error && <FieldError>{error}</FieldError>}
  </div>
)

export default FormField
