import { cva, type VariantProps } from 'class-variance-authority'

export const stepBarVariants = cva('block h-1 rounded-full transition-colors duration-500 motion-reduce:transition-none', {
  variants: {
    state: {
      done: 'bg-[var(--color-primary-main)]',
      current: 'bg-[var(--color-secondary-main)]',
      todo: 'bg-[var(--color-inactive-main)]',
    },
  },
  defaultVariants: { state: 'todo' },
})

export const stepLabelVariants = cva('hidden md:flex items-center gap-1.5 text-[length:var(--font-size-2)] leading-4 truncate transition-colors duration-500 motion-reduce:transition-none', {
  variants: {
    state: {
      done: 'text-[var(--color-primary-dark)]',
      current: 'font-bold text-[var(--color-text-main)]',
      todo: 'text-[var(--color-inactive-dark)]',
    },
  },
  defaultVariants: { state: 'todo' },
})

export type StepState = NonNullable<VariantProps<typeof stepBarVariants>['state']>
