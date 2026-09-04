import { cva, type VariantProps } from 'class-variance-authority'

// Radiokort: ett av flera alternativ med rubrik och förklaring. Ring till
// vänster, ljus mintplatta när valt.
export const choiceCardVariants = cva(
  [
    'w-full flex items-center gap-3 px-3.5 py-3 text-left cursor-pointer',
    'rounded-[var(--radius-small)] border-[1.5px]',
    'transition-[background-color,color,border-color,box-shadow,transform] duration-200 ease-standard motion-reduce:transition-none',
    'motion-safe:active:scale-[0.99]',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-main)] focus-visible:ring-offset-2',
  ],
  {
    variants: {
      active: {
        true: 'border-[var(--color-primary-main)] bg-[var(--color-primary-extra-light)]',
        false: 'bg-[var(--color-white-main)] border-[var(--color-inactive-main)] hover:border-[var(--color-primary-border)]',
      },
    },
    defaultVariants: { active: false },
  },
)

export const choiceCardRingVariants = cva(
  ['w-5 h-5 rounded-full shrink-0 bg-[var(--color-white-main)]', 'transition-[border-width,border-color] duration-200 ease-standard motion-reduce:transition-none'],
  {
    variants: {
      active: {
        true: 'border-[6px] border-[var(--color-primary-main)]',
        false: 'border-[1.9px] border-[var(--color-radio-border)]',
      },
    },
    defaultVariants: { active: false },
  },
)

export type ChoiceCardVariants = VariantProps<typeof choiceCardVariants>
