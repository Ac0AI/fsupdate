import { cva, type VariantProps } from 'class-variance-authority'

// Strömbrytare. Ritas av raden den sitter i (raden är knappen), så den här är
// bara utseendet.
export const switchTrackVariants = cva(
  ['w-11 h-[26px] p-[3px] rounded-full shrink-0 flex items-center', 'transition-colors duration-200 ease-standard motion-reduce:transition-none'],
  {
    variants: {
      on: {
        true: 'bg-[var(--color-primary-main)]',
        false: 'bg-[var(--color-inactive-grey-light)]',
      },
    },
    defaultVariants: { on: false },
  },
)

export const switchThumbVariants = cva(
  ['w-5 h-5 rounded-full bg-[var(--color-white-main)] shadow-[0_1px_3px_rgba(0,0,0,0.25)]', 'transition-transform duration-200 ease-standard motion-reduce:transition-none'],
  {
    variants: {
      on: {
        true: 'translate-x-[18px]',
        false: '',
      },
    },
    defaultVariants: { on: false },
  },
)

export type SwitchVariants = VariantProps<typeof switchTrackVariants>
