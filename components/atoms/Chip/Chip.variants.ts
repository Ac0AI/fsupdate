import { cva, type VariantProps } from 'class-variance-authority'

// Chip: ett val i en rad av val. Fyller sin kolumn, så raderna är jämna på alla
// bredder. Utseendet är ägarens val 2026-09-04 (läget 2 september 16:03): tunn
// ljus kant, mint med bock när vald. Ändra bara på ägarens ord.
export const chipVariants = cva(
  [
    // Bakgrund och kantfärg sätts bara i varianten active, annars slår
    // basklassen och varianten mot varandra och ordningen i CSS:en avgör.
    'flex-1 flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer',
    'border-[1.5px]',
    'text-[length:var(--font-size-2)] text-[var(--color-text-main)]',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-standard motion-reduce:transition-none',
    'motion-safe:active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-main)] focus-visible:ring-offset-2',
  ],
  {
    variants: {
      active: {
        true: 'bg-[var(--color-primary-main)] border-[var(--color-primary-main)] font-semibold',
        false: 'bg-[var(--color-white-main)] border-[var(--color-inactive-main)] hover:border-[var(--color-primary-border)]',
      },
      size: {
        md: '',
        sm: '',
      },
      // Tvåradigt chip: etikett och en kort förklaring, som starttider.
      stacked: {
        true: 'flex-col gap-px min-h-[44px] py-[7px] px-1 rounded-[var(--radius-small)]',
        false: 'rounded-[var(--radius-button)]',
      },
    },
    compoundVariants: [
      { stacked: false, size: 'md', class: 'h-11 px-3' },
      { stacked: false, size: 'sm', class: 'h-10 px-2' },
    ],
    defaultVariants: { active: false, size: 'md', stacked: false },
  },
)

export const chipHintVariants = cva('text-[length:var(--font-size-1)] leading-[14px] transition-colors duration-200', {
  variants: {
    active: {
      true: 'text-[var(--color-text-main)] opacity-80',
      false: 'text-[var(--color-inactive-dark)]',
    },
  },
  defaultVariants: { active: false },
})

export type ChipVariants = VariantProps<typeof chipVariants>
