import React from 'react'
import { clsx } from 'clsx'
import { switchTrackVariants, switchThumbVariants } from './Switch.variants'

export type SwitchProps = {
  on: boolean
  className?: string
}

/** Utseendet för en strömbrytare. Lägg den i en knapp med role="switch" och aria-checked. */
const Switch = ({ on, className }: SwitchProps) => (
  <span aria-hidden className={clsx(switchTrackVariants({ on }), className)} data-testid="switch">
    <span className={switchThumbVariants({ on })} />
  </span>
)

export default Switch
