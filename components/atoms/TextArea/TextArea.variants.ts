import { cva, type VariantProps } from 'class-variance-authority'

export const textAreaWrapperVariants = cva([
  // Base wrapper styles
  'w-full max-w-full relative box-border h-full',
])

export const textAreaVariants = cva(
  [
    // Base textarea styles
    'h-[80px] w-full pt-[22px] pb-[8px] px-[10px] outline-none',
    'rounded-[var(--radius-input)] border-[1.9px] border-solid border-[rgba(118,118,118,0.4)]',
    'font-[var(--font-weight-extra-small)] text-base transition-[border-color,border-width] ease-standard duration-150',
    'text-[var(--color-text-main)]',
    'relative bg-white',
    'resize-none',
    // Remove spin buttons
    '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none',
    '[&::-webkit-outer-spin-button]:m-0 [&::-webkit-inner-spin-button]:m-0',
    // Focus styles
    'focus:border-2 focus:border-[var(--color-tertiary-main)] focus:transition-[border-color,border-width] ease-standard focus:duration-150',
    // Placeholder trick for label animation
    'peer',
  ],
  {
    variants: {
      withLessHeight: {
        true: [
          // Focus + label for reduced height
          'focus:~.label:top-[-7.5px]',
        ],
      },
      hasValue: {
        true: ['border-[1.9px] border-solid border-[rgba(118,118,118,0.4)]', 'transition-[border-color,border-width] ease-standard duration-150'],
      },
      error: {
        true: ['border-[1.9px] border-solid border-[var(--color-error-red)]', 'transition-[border-color,border-width] ease-standard duration-150'],
      },
    },
  },
)

export const textAreaLabelVariants = cva(
  [
    // Base label styles
    'absolute text-gray-500 font-normal text-base',
    'pointer-events-none transition-all duration-200 ease-out',
    'transform-origin-[0_0]',
    // Use peer to detect textarea state
    'peer-focus:top-[-8px] peer-focus:scale-75 peer-focus:bg-white peer-focus:px-[4px] peer-focus:text-[var(--color-tertiary-main)]',
    'peer-[:not(:placeholder-shown)]:top-[-8px] peer-[:not(:placeholder-shown)]:scale-75 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-[4px]',
  ],
  {
    variants: {
      withLessHeight: {
        true: ['top-[10px]'],
        false: [],
      },
      isActive: {
        true: ['!top-[-8px]', '!left-[-11px]', '!scale-75', '!bg-white', '!px-[4px]', '!text-[rgba(0,0,0,0.7)]'],
        false: ['left-[11px] top-[18px]'],
      },
      isFocused: {
        true: ['!text-[var(--color-tertiary-main)]'],
        false: [],
      },
      error: {
        true: ['!text-[var(--color-error-red)]'],
        false: [],
      },
    },
  },
)

export const textAreaIconVariants = cva([
  // Icon positioning
  'absolute top-[6px] right-2',
])

export const textAreaErrorVariants = cva([
  // Error text styles
  'text-[var(--color-error-red)] absolute text-[12px]',
])

export type TextAreaWrapperVariants = VariantProps<typeof textAreaWrapperVariants>
export type TextAreaVariants = VariantProps<typeof textAreaVariants>
export type TextAreaLabelVariants = VariantProps<typeof textAreaLabelVariants>
export type TextAreaIconVariants = VariantProps<typeof textAreaIconVariants>
export type TextAreaErrorVariants = VariantProps<typeof textAreaErrorVariants>
