import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxLabelVariants = cva(['grid grid-cols-[1em_auto] items-center cursor-pointer'], {
  variants: {
    disabled: {
      true: [
        'text-[var(--color-inactive-text)]',
        // Input styles when disabled
        '[&_input]:cursor-default',
        '[&_input:focus]:outline-none',
      ],
    },
  },
})

export const checkboxInputVariants = cva(
  [
    // Reset native styles
    'appearance-none -webkit-appearance-none',
    // Basic styling
    'bg-white m-0 cursor-pointer font-inherit text-current',
    'w-[1.15em] h-[1.15em]',
    'border-[0.15em] border-solid border-[var(--color-radio-border)] rounded-[4px]',
    'transform translate-y-[-0.075em]',
    // Grid for centering checkmark
    'grid place-content-center',
    // Checkmark styling using before pseudo-element with CSS custom property
    'before:content-[""] before:w-[14px] before:h-[10px]',
    'before:[clip-path:var(--checkmark-path)]',
    'before:transform before:scale-0 before:origin-bottom-left',
    'before:transition-transform before:duration-200 before:ease-[var(--ease-spring)]',
    'transition-[background-color,border-color,transform] duration-150 ease-standard motion-safe:active:scale-90',
    'before:shadow-[inset_1em_1em_white] before:bg-[CanvasText]',
    // Focus styles
    'focus:outline-2 focus:outline-solid focus:outline-[var(--color-tertiary-light)] focus:outline-offset-0',
    // Checked state
    'checked:bg-[var(--color-tertiary-main)] checked:border-[var(--color-tertiary-main)]',
    'checked:before:scale-100',
  ],
  {
    variants: {
      bigger: {
        true: 'sm:w-[24px] sm:h-[24px]',
      },
      color: {
        orange: [
          // Override checked colors for orange variant
          'checked:bg-[var(--color-accent-main)] checked:border-[var(--color-accent-main)]',
          // Focus color override
          'focus:outline-[var(--color-accent-main)]',
          // Checkmark color override
          'before:bg-white',
          // Disabled states for orange
          'checked:disabled:bg-[var(--color-accent-main)] checked:disabled:border-[var(--color-accent-main)]',
          'checked:disabled:read-only:bg-[var(--color-accent-main)] checked:disabled:read-only:border-[var(--color-accent-main)]',
        ],
      },
      disabled: {
        true: [
          'border-[var(--color-inactive-grey-light)] bg-[var(--color-white-main)]',
          'hover:cursor-not-allowed',
          'checked:border-[var(--color-inactive-grey-light)] checked:bg-[var(--color-inactive-grey-light)]',
        ],
      },
      forceDisabled: {
        true: ['checked:disabled:border-[var(--color-inactive-grey-light)] checked:disabled:bg-[var(--color-inactive-grey-light)]'],
      },
    },
    compoundVariants: [
      // When disabled but not forceDisabled and checked and read-only, use original colors
      {
        disabled: true,
        forceDisabled: false,
        class: 'checked:read-only:bg-[var(--color-tertiary-main)] checked:read-only:border-[var(--color-tertiary-main)]',
      },
      // Orange variant disabled read-only override
      {
        color: 'orange',
        disabled: true,
        forceDisabled: false,
        class: 'checked:read-only:bg-[var(--color-accent-main)] checked:read-only:border-[var(--color-accent-main)]',
      },
    ],
  },
)

export const checkboxErrorVariants = cva('text-[var(--color-error-red)] text-[12px]')

export type CheckboxLabelVariants = VariantProps<typeof checkboxLabelVariants>
export type CheckboxInputVariants = VariantProps<typeof checkboxInputVariants>
export type CheckboxErrorVariants = VariantProps<typeof checkboxErrorVariants>
