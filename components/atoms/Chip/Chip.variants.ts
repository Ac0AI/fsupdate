import { cva, type VariantProps } from 'class-variance-authority'

// Chip: ett val i en rad av val. Innehållsbrett, 36 px högt, navy när valt.
// Ägarens val 2026-09-04: "mindre knappar i blå snarare än grön". Träffytan
// är ändå 44 px via ett osynligt pseudo-element 4 px ovanför och nedanför,
// så raderna behöver 8 px mellanrum.
// Bakgrund och kantfärg sätts bara i varianten active, annars slår
// basklassen och varianten mot varandra och ordningen i CSS:en avgör.
export const chipVariants = cva(
  [
    "relative before:absolute before:inset-x-0 before:-inset-y-1 before:content-['']",
    'inline-flex items-center justify-center gap-1.5 whitespace-nowrap cursor-pointer',
    'border-[1.5px] text-[length:var(--font-size-2)]',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-standard motion-reduce:transition-none',
    'motion-safe:active:scale-[0.97]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-main)] focus-visible:ring-offset-2',
  ],
  {
    variants: {
      active: {
        true: 'bg-[var(--color-secondary-main)] border-[var(--color-secondary-main)] text-[var(--color-white-main)] font-semibold',
        false: 'bg-[var(--color-white-main)] border-[var(--color-inactive-main)] text-[var(--color-text-main)] hover:border-(--color-secondary-main)/40',
      },
      size: {
        md: '',
        sm: '',
      },
      // Tvåradigt chip: etikett och en kort förklaring, som starttider. Fyller sin kolumn.
      stacked: {
        true: 'flex-1 flex-col gap-px min-h-[44px] py-[7px] px-2 rounded-[var(--radius-small)]',
        false: 'rounded-[var(--radius-button)]',
      },
    },
    compoundVariants: [
      { stacked: false, size: 'md', class: 'h-9 px-3 min-w-[56px]' },
      { stacked: false, size: 'sm', class: 'h-8 px-2.5 min-w-[48px]' },
    ],
    defaultVariants: { active: false, size: 'md', stacked: false },
  },
)

export const chipHintVariants = cva('text-[length:var(--font-size-1)] leading-[14px] transition-colors duration-200', {
  variants: {
    active: {
      true: 'text-[var(--color-white-main)] opacity-80',
      false: 'text-[var(--color-inactive-dark)]',
    },
  },
  defaultVariants: { active: false },
})

export type ChipVariants = VariantProps<typeof chipVariants>
