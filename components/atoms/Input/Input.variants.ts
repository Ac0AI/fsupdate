import { cva, type VariantProps } from 'class-variance-authority'

// Input wrapper styles
export const inputWrapperVariants = cva(['w-full max-w-full relative box-border h-full'])

// Main input component styles
export const inputVariants = cva(
  [
    // Base input styles
    'h-10 w-full px-2.5 py-3.5 outline-none',
    'rounded-[var(--radius-input)] border-[1.9px] border-[rgba(118,118,118,0.4)]',
    'font-thin text-base transition-[border-color,border-width] ease-standard duration-150',
    'text-[rgba(0,0,0,0.7)] bg-white',

    // Remove spinner buttons from number inputs
    '[&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0',
    '[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-spin-button]:m-0',

    // Focus styles
    'focus:border-2 focus:border-[var(--color-tertiary-main)] focus:transition-[border-color,border-width] ease-standard focus:duration-150',

    // Has value styles (applied via className)
    '[&.has-value]:border-[1.9px] [&.has-value]:border-[rgba(118,118,118,0.4)]',
    '[&.has-value]:transition-[border-color,border-width] ease-standard [&.has-value]:duration-150',
  ],
  {
    variants: {
      // Error state for non-FB themes
      hasError: {
        true: [
          'border-[1.9px] border-[var(--color-error-red)] transition-[border-color,border-width] ease-standard duration-150',
          '[&.has-value]:border-[1.9px] [&.has-value]:border-[var(--color-error-red)]',
          '[&.has-value]:transition-[border-color,border-width] ease-standard [&.has-value]:duration-150',
        ],
      },

      // Fastighetsbyran (FB) theme error state
      isFBError: {
        true: ['border-none border-b-2 border-b-[var(--color-error-red)]'],
      },

      // Apartment input (with start adornment)
      isApartment: {
        true: ['pl-[45px] border-[1.9px] border-[rgba(118,118,118,0.4)]', 'transition-[border-color,border-width] ease-standard duration-150'],
      },

      // Fastighetsbyran theme
      isFB: {
        true: [
          'border-none border-b-2 border-b-[var(--color-radio-border)]',
          'font-[var(--font-weight-normal)] text-[var(--color-main-font-color)]',

          // Focus styles for FB theme
          'focus:border-none focus:border-b-2 focus:border-b-[var(--color-secondary-main)]',
          'focus:transition-[border-color,border-width] ease-standard focus:duration-150',

          // Has value styles for FB theme
          '[&.has-value]:border-none [&.has-value]:border-b-2 [&.has-value]:border-b-[var(--color-accent-icon)]',
          '[&.has-value]:transition-[border-color,border-width] ease-standard [&.has-value]:duration-150',
          '[&.has-value]:focus:border-b-[var(--color-secondary-main)]',
        ],
      },
    },

    // Compound variants for complex combinations
    compoundVariants: [
      {
        hasError: true,
        isFB: true,
        class: ['border-none border-b-[1.9px] border-b-[var(--color-error-red)]'],
      },
    ],
  },
)

// Label styles
export const labelVariants = cva(
  [
    'absolute left-[11px] top-[7.5px] text-[var(--color-inactive-dark)]',
    'font-[var(--font-weight-normal)] text-base pointer-events-none flex',
    'transition-all duration-200 ease-in-out',

    // Prevent text wrapping and add ellipsis
    'whitespace-nowrap overflow-hidden text-ellipsis',
    'max-w-[calc(100%-22px)]', // Account for padding on both sides

    // Transform when input is not placeholder-shown (has content) or focused
    'peer-focus:top-[-9px] peer-focus:text-xs peer-focus:bg-white peer-focus:px-0.5',
    'peer-focus:text-[var(--color-tertiary-main)] peer-focus:left-2.5',
    'peer-focus:max-w-[calc(100%-5px)]', // Adjust max-width when transformed

    // Transform when input has value
    'peer-[.has-value]:top-[-9px] peer-[.has-value]:text-xs peer-[.has-value]:bg-white',
    'peer-[.has-value]:px-0.5 peer-[.has-value]:text-[rgba(0,0,0,0.7)] peer-[.has-value]:left-2.5',
    'peer-[.has-value]:max-w-[calc(100%-5px)]', // Adjust max-width when transformed

    // When input is not empty (using :not(:placeholder-shown) trick)
    'peer-[:not(:placeholder-shown)]:top-[-9px] peer-[:not(:placeholder-shown)]:text-xs',
    'peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-0.5',
    'peer-[:not(:placeholder-shown)]:text-[rgba(0,0,0,0.7)] peer-[:not(:placeholder-shown)]:left-2.5',
    'peer-[:not(:placeholder-shown)]:max-w-[calc(100%-5px)]', // Adjust max-width when transformed
  ],
  {
    variants: {
      hasError: {
        true: ['peer-focus:text-[var(--color-error-red)]', 'peer-[.has-value]:text-[var(--color-error-red)]', 'peer-[:not(:placeholder-shown)]:text-[var(--color-error-red)]'],
      },
      isFB: {
        true: ['text-[var(--color-accent-icon)]', 'peer-focus:text-[var(--color-main-font-color)]', 'peer-[.has-value]:text-[var(--color-accent-icon)]'],
      },
      isApartment: {
        true: [
          // Always keep label on top when there's a startAdornment
          '!top-[-9px] !text-xs !bg-white !px-0.5 !left-2.5',
          '!text-[rgba(0,0,0,0.7)]',
          // Keep the focus color change
          'peer-focus:!text-[var(--color-tertiary-main)]',
        ],
      },
      alwaysActive: {
        true: [
          // Always keep label on top
          '!top-[-9px] !text-xs !bg-white !px-0.5 !left-2.5',
          '!text-[rgba(0,0,0,0.7)]',
          // Keep the focus color change
          'peer-focus:!text-[var(--color-tertiary-main)]',
        ],
      },
    },
  },
)

// Start adornment (apartment label) styles
export const startAdornmentVariants = cva(['absolute top-[8px] left-2.5 mr-px text-[var(--color-black-main)]', 'font-normal text-base'], {
  variants: {
    isFB: {
      true: 'text-[var(--color-text-main)]',
    },
  },
})

// End icon styles
export const endIconVariants = cva(['absolute top-1.5 right-2'])

// Error text styles
export const errorTextVariants = cva(['text-[var(--color-error-red)] absolute text-xs whitespace-nowrap'])

// Export types for TypeScript
export type InputVariants = VariantProps<typeof inputVariants>
export type InputWrapperVariants = VariantProps<typeof inputWrapperVariants>
export type LabelVariants = VariantProps<typeof labelVariants>
export type StartAdornmentVariants = VariantProps<typeof startAdornmentVariants>
export type EndIconVariants = VariantProps<typeof endIconVariants>
export type ErrorTextVariants = VariantProps<typeof errorTextVariants>
