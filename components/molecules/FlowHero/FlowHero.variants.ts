import { cva, type VariantProps } from 'class-variance-authority'

// Färgplattan överst i ett tjänsteflöde: blå medan kunden fyller i, grön när det är klart.
export const flowHeroVariants = cva('transition-colors duration-700 motion-reduce:transition-none', {
  variants: {
    tone: {
      blue: 'bg-[var(--color-secondary-light)]',
      green: 'bg-[var(--color-primary-dark)]',
    },
  },
  defaultVariants: { tone: 'blue' },
})

export type FlowHeroVariants = VariantProps<typeof flowHeroVariants>
