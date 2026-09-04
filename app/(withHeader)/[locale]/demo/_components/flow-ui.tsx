'use client'

import { useEffect } from 'react'
import { clsx } from 'clsx'
import Button from '@/components/atoms/Button'
import Chip from '@/components/atoms/Chip'
import ChoiceCard from '@/components/atoms/ChoiceCard'
import FieldError from '@/components/atoms/FieldError'
import Chevron from '@/components/atoms/Icons/Chevron'
import Paper from '@/components/atoms/Paper'
import Switch from '@/components/atoms/Switch'
import Text from '@/components/atoms/Text'
import FlowHero from '@/components/molecules/FlowHero'
import FormField from '@/components/molecules/FormField'
import InfoTip from '@/components/molecules/InfoTip'
import StepProgress from '@/components/molecules/StepProgress'
import Timeline from '@/components/molecules/Timeline'

/**
 * Tjänsteflödenas byggstenar under /demo, sammansatta av designsystemets
 * atomer och molekyler (components/atoms, components/molecules) och tokens
 * (styles/globals.css). Här finns inga egna färger: byter appen tema följer
 * flödena med. Namnen är de flödena redan använder.
 */

// Samma mjuka övergång på allt som går att trycka på. Tryck ger en liten
// nedskalning, val tonas in.
export const press =
  'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-standard motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-main)] focus-visible:ring-offset-2'
// Små reglage sjunker ihop tydligt. Hela rader och kort får bara en antydan.
export const pressScale = 'motion-safe:active:scale-[0.97]'
export const pressSoft = 'motion-safe:active:scale-[0.99]'
export const rise = 'animate-[rise_.35s_ease-out_both] motion-reduce:animate-none'

// Textfält med etiketten utanför (FormField), till skillnad från Input-atomen
// vars etikett flyter inne i fältet. Samma ram, radie och fokusfärg som Input.
export const areaInput =
  'w-full h-11 rounded-[var(--radius-input)] border-[1.9px] border-[rgba(118,118,118,0.4)] px-3 text-base text-[var(--color-text-main)] placeholder:text-[var(--color-radio-border)] bg-[var(--color-white-main)] focus:outline-none focus:border-[var(--color-tertiary-main)] transition-colors ease-standard'
export const textareaClass =
  'resize-none w-full min-h-[72px] rounded-[var(--radius-input)] border-[1.9px] border-[rgba(118,118,118,0.4)] px-3 py-2.5 text-base leading-[21px] text-[var(--color-text-main)] placeholder:text-[var(--color-radio-border)] bg-[var(--color-white-main)] focus:outline-none focus:border-[var(--color-tertiary-main)] transition-colors ease-standard'
export const errorBorder = 'border-[var(--color-error-red)] focus:border-[var(--color-error-red)]'
// Samma ram som textfälten, med systemets egen pil. Bakgrunden måste sättas,
// annars ärver select en grå ton på iOS.
export const selectClass = clsx(areaInput, 'bg-[var(--color-white-main)]')

export type Errors = Record<string, string>

export const StepBar = StepProgress
export const Hero = FlowHero
export const Field = FormField
export const ErrorText = FieldError
export const Info = InfoTip
export const Toggle = Switch
export const Radio = ChoiceCard
export { Chevron, Timeline }

export const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Paper variant="flat" className={clsx('rounded-[var(--radius-main)] border border-[var(--color-inactive-main)] p-4', className)}>
    {children}
  </Paper>
)

/** Ett val i en rad av val. `multi` finns kvar för äldre anrop, bocken visas alltid när chipet är valt. */
export const Pill = ({ small, multi: _multi, ...props }: { active: boolean; multi?: boolean; small?: boolean; className?: string; onClick: () => void; children: React.ReactNode }) => (
  <Chip size={small ? 'sm' : 'md'} {...props} />
)

/** Tvåradigt val: etikett och en liten förklaring, som starttider. */
export const Option = ({ label, hint, ...props }: { active: boolean; onClick: () => void; label: string; hint: string }) => (
  <Chip hint={hint} {...props}>
    {label}
  </Chip>
)

/** En fråga med Nej och Ja till höger. Radas på varandra som tillvalen. */
export const YesNo = ({ label, info, value, onChange }: { label: string; info?: string; value: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between gap-3 py-2 border-t border-[var(--color-inactive-main)]">
    <span className="text-[length:var(--font-size-2)] font-semibold text-[var(--color-text-main)] flex items-center gap-1">
      {label}
      {info && <InfoTip text={info} />}
    </span>
    <div className="flex gap-1 w-[124px] shrink-0">
      <Chip size="sm" active={!value} onClick={() => onChange(false)}>
        Nej
      </Chip>
      <Chip size="sm" active={value} onClick={() => onChange(true)}>
        Ja
      </Chip>
    </div>
  </div>
)

/** Bocken i en kryssruta som ritas av raden runt (raden bär den riktiga input:en). */
export const Checkbox = ({ checked }: { checked: boolean }) => (
  <span
    className={clsx(
      'w-[22px] h-[22px] rounded-[4px] shrink-0 mt-px flex items-center justify-center transition-colors duration-200 ease-standard motion-reduce:transition-none',
      checked ? 'bg-[var(--color-tertiary-main)]' : 'bg-[var(--color-white-main)] border-2 border-[var(--color-radio-border)]',
    )}
  >
    {checked && <Check size={13} pop />}
  </span>
)

export const Check = ({ size = 12, color = 'var(--color-white-main)', pop }: { size?: number; color?: string; pop?: boolean }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden className={clsx('shrink-0', pop && 'animate-[pop_.25s_ease-out_both] motion-reduce:animate-none')}>
    <path d="M5 13l4 4L19 7" fill="none" stroke={color} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

/** Flödets huvudknapp: Button-atomen, full bredd på mobil och 420 px på desktop. */
export const Primary = ({ variant = 'solid', loading, onClick, children }: { variant?: 'solid' | 'outline'; loading?: boolean; onClick: () => void; children: React.ReactNode }) => (
  <div className="w-full md:max-w-[420px]">
    <Button variant={variant === 'solid' ? 'primary' : 'outline'} withFullWidth fontSize={15} isLoading={loading} onClick={onClick} text={children as string} />
  </div>
)

// Den enda stilen för sekundära handlingar: navy text, 44 px hög rad, plus när något
// läggs till och chevron när något öppnas eller ändras.
export const MoreLink = ({ onClick, plus, className, children }: { onClick: () => void; plus?: boolean; className?: string; children: React.ReactNode }) => (
  <Button
    variant="noOutlineBold"
    padding="0"
    fontSize={13}
    onClick={onClick}
    className={clsx('min-h-11 -my-1 gap-0 text-left', className)}
    text={children as string}
    iconLeft={
      plus ? (
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ) : null
    }
    iconRight={plus ? null : <Chevron size={14} />}
  />
)

export const Foot = ({ tone, children }: { tone?: 'error'; children: React.ReactNode }) => (
  <Text variant="bodySmall" textAlign="center" className={clsx('leading-4', tone === 'error' ? 'font-semibold text-[var(--color-error-red)]' : 'text-[var(--color-inactive-extra-dark)]')}>
    {children}
  </Text>
)

// Sidan scrollar till första felet och sätter fokus där. Knappen är aldrig död:
// den säger vad som saknas i stället.
export const focusFirstInvalid = () => {
  // Två bildrutor så felraderna hunnit ritas och sidan fått sin nya höjd,
  // annars avbryts den mjuka scrollen halvvägs av layoutskiftet.
  window.requestAnimationFrame(() =>
    window.requestAnimationFrame(() => {
      const first = document.querySelector<HTMLElement>('[data-invalid="true"]')
      first?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      first?.querySelector<HTMLElement>('input, textarea, select')?.focus({ preventScroll: true })
    }),
  )
}

// Nytt steg börjar högst upp. globals.css sätter scroll-behavior: smooth på
// html, vilket gör varje programmatisk scroll till en animation som nästa
// anrop avbryter. Därför stängs den av under själva hoppet.
export const scrollFlowToTop = (root: HTMLElement | null) => {
  const reset = () => {
    const html = document.documentElement
    const previous = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'
    let node: HTMLElement | null = root
    while (node) {
      if (node.scrollTop > 0) node.scrollTop = 0
      node = node.parentElement
    }
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    html.style.scrollBehavior = previous
  }
  reset()
  window.requestAnimationFrame(reset)
}

// Chromes scrollförankring håller kvar sidfoten på samma plats när ett steg
// byts ut, och flyttar tillbaka scrollen efter att vi nollat den. Stäng av den
// på dokumentet så länge ett flöde är monterat.
export const useNoScrollAnchoring = () => {
  useEffect(() => {
    const html = document.documentElement
    const previous = html.style.overflowAnchor
    html.style.overflowAnchor = 'none'
    return () => {
      html.style.overflowAnchor = previous
    }
  }, [])
}
