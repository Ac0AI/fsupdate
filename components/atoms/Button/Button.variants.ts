import { cva, type VariantProps } from 'class-variance-authority'

// Base button styles
export const buttonWrapperVariants = cva('relative inline-flex', {
  variants: {
    withMaxContentWidth: {
      true: '!w-max',
    },
    withFullWidth: {
      true: 'w-full',
    },
  },
})

// Inner button component with all variants
export const buttonVariants = cva(
  [
    // Base styles
    'box-border font-[var(--font-family-button)] rounded-[var(--radius-button)]',
    'inline-flex justify-center items-center font-bold',
    // Bara de properties som faktiskt ändras. transition-all tvingar webbläsaren
    // att bevaka varje animerbar property på varje knapp i appen.
    'cursor-pointer transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-standard',
    // Tryckrespons. Utan den känns knappen som att den inte hörde klicket.
    'motion-safe:active:scale-[0.97] active:duration-100',
    // Reset button styles
    'border-0 outline-none appearance-none',
    // Default padding
    'px-6 py-3 min-h-[44px]',
  ],
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-secondary-main)] !text-[var(--color-white-main)]',
          'border-2 border-[var(--color-secondary-main)]',
          'hover:bg-[var(--color-secondary-dark)] hover:border-[var(--color-secondary-dark)]',
          'active:bg-[var(--color-secondary-dark)] active:border-[var(--color-secondary-dark)]',
        ],
        lightBlue: [
          'bg-[#4C96D0] text-[var(--color-white-main)]',
          'border-2 border-[#4C96D0]',
          'hover:bg-[#4C96D0] hover:border-[#4C96D0]',
          'active:bg-[var(--color-accent-main)] active:border-[var(--color-accent-main)]',
        ],
        ghost: [
          'bg-transparent !text-[var(--color-secondary-main)]',
          'border-2 border-[var(--color-secondary-main)]',
          'hover:bg-[var(--color-inactive-quite-light)] hover:border-[var(--color-secondary-main)]',
          'active:bg-[var(--color-inactive-quite-light)] active:border-[var(--color-secondary-main)]',
        ],
        ghostInverted: [
          'bg-transparent text-[var(--color-white-main)]',
          'border-2 border-[var(--color-white-main)]',
          'hover:bg-transparent hover:border-[var(--color-white-main)]',
          'active:bg-[var(--color-white-main)] active:border-[var(--color-white-main)]',
        ],
        green: [
          'bg-[var(--color-primary-main)] text-[var(--color-white-main)]',
          'border-2 border-[var(--color-primary-main)]',
          'hover:bg-[var(--color-inactive-main)] hover:text-[var(--color-inactive-super-dark)] hover:border-[var(--color-inactive-main)]',
          'active:bg-[var(--color-inactive-main)] active:text-[var(--color-inactive-super-dark)] active:border-[var(--color-inactive-main)]',
        ],
        primaryAlt: [
          'bg-[var(--color-accent-light)] text-[var(--color-inactive-super-dark)]',
          'border-2 border-[var(--color-accent-light)]',
          'hover:bg-[var(--color-accent-main)] hover:text-[var(--color-white-main)] hover:border-[var(--color-accent-main)]',
          'active:bg-[var(--color-accent-main)]',
        ],
        primaryAltInverted: [
          'bg-[var(--color-accent-main)] text-[var(--color-white-main)]',
          'border-2 border-[var(--color-accent-main)]',
          'hover:bg-[var(--color-accent-light)] hover:text-[var(--color-inactive-super-dark)] hover:border-[var(--color-accent-light)]',
          'active:bg-[var(--color-accent-main)]',
        ],
        gray: [
          'bg-[var(--color-inactive-grey-light)] text-[var(--color-white-main)]',
          'border-2 border-[var(--color-inactive-grey-light)]',
          'hover:bg-[var(--color-inactive-main)] hover:text-[var(--color-inactive-grey-light)] hover:border-[var(--color-inactive-main)]',
          'active:bg-[var(--color-inactive-main)] active:text-[var(--color-inactive-grey-light)] active:border-[var(--color-inactive-main)]',
        ],
        outline: [
          '!bg-[var(--color-white-main)] !text-[var(--color-secondary-main)]',
          'border-2 border-[var(--color-secondary-main)]',
          'hover:!bg-[var(--color-inactive-main)] hover:text-[var(--color-secondary-main)] hover:border-[var(--color-secondary-main)]',
          'active:bg-[var(--color-white-main)] active:text-[var(--color-secondary-main)] active:border-[var(--color-secondary-main)]',
        ],
        outlineHoverInverted: [
          'bg-[var(--color-white-main)] text-[var(--color-secondary-main)]',
          'border-2 border-[var(--color-secondary-main)]',
          'hover:bg-[var(--color-secondary-main)] hover:text-[var(--color-white-main)] hover:border-[var(--color-white-main)]',
          'active:bg-[var(--color-white-main)] active:text-[var(--color-secondary-main)] active:border-[var(--color-secondary-main)]',
        ],
        outlineHoverInvertedAlt: [
          'bg-[var(--color-secondary-main)] text-[var(--color-white-main)]',
          'border-2 border-[var(--color-white-main)]',
          'hover:bg-[var(--color-white-main)] hover:text-[var(--color-secondary-main)] hover:border-[var(--color-secondary-main)]',
          'active:bg-[var(--color-white-main)] active:text-[var(--color-white-main)] active:border-[var(--color-white-main)]',
        ],
        outlineHoverInvertedAlt2: [
          'bg-[var(--color-white-main)] text-[var(--color-text-main)]',
          'border-2 border-[var(--color-inactive-grey-light)]',
          'hover:bg-[var(--color-inactive-grey-light)] hover:text-[var(--color-white-main)] hover:border-[var(--color-inactive-grey-light)]',
          'active:bg-[var(--color-white-main)] active:text-[var(--color-secondary-main)] active:border-[var(--color-inactive-grey-light)]',
        ],
        fbPrimary: [
          'bg-[var(--color-secondary-main)] text-[var(--color-white-main)]',
          'border-2 border-[var(--color-secondary-main)]',
          'flex !w-max box-border px-6 py-2 h-10',
          'hover:bg-[var(--color-secondary-main)] hover:text-[var(--color-white-main)] hover:border-[var(--color-secondary-dark)]',
          'active:bg-[var(--color-secondary-dark)] active:border-[var(--color-secondary-dark)]',
        ],
        fb: [
          'bg-transparent text-[var(--color-text-main)] min-w-fit',
          'border border-[var(--color-tertiary-text)]',
          'px-6 py-2 h-10',
          'hover:bg-[var(--color-tertiary-text)] hover:text-[var(--color-text-main)] hover:border-[var(--color-tertiary-text)]',
          'active:bg-transparent active:text-[var(--color-text-main)] active:border-[var(--color-tertiary-text)]',
        ],
        fbNoPadding: [
          'bg-transparent text-[var(--color-text-main)] min-w-fit',
          'border border-[var(--color-tertiary-text)]',
          'h-10',
          'hover:bg-[var(--color-tertiary-text)] hover:text-[var(--color-text-main)] hover:border-[var(--color-tertiary-text)]',
          'active:bg-transparent active:text-[var(--color-text-main)] active:border-[var(--color-tertiary-text)]',
        ],
        noOutline: ['text-[var(--color-text-main)] underline', 'text-[length:var(--font-size-4)] font-normal'],
        noOutlineBold: ['text-[var(--color-text-main)]', 'text-[length:var(--font-size-4)] font-bold'],
      },
      withFullWidth: {
        true: 'w-full',
      },
      withSpaceBetween: {
        true: '!justify-between !px-8 !pl-8 !pr-4',
      },
      withMaxContentWidth: {
        true: '!w-max',
      },
      isDisabled: {
        true: [
          '!bg-[var(--color-disabled-button-bg)] !text-[var(--color-disabled-button-color)]',
          '!border-2 !border-[var(--color-disabled-button-border)]',
          'hover:!bg-[var(--color-disabled-button-bg)] hover:!text-[var(--color-disabled-button-color)]',
          'hover:!border-[var(--color-disabled-button-border)] hover:!cursor-default',
          '!cursor-default',
        ],
      },
      fbDisabled: {
        true: [
          '!bg-[var(--color-disabled-button-bg)] !text-[var(--color-disabled-button-color)]',
          '!border-2 !border-[var(--color-disabled-button-border)]',
          'flex !w-max box-border px-6 py-2 h-10',
          'hover:!bg-[var(--color-disabled-button-bg)] hover:!text-[var(--color-disabled-button-color)]',
          'hover:!border-[var(--color-disabled-button-border)] hover:!cursor-default',
          '!cursor-default',
        ],
      },
      fbDisabledFullWidth: {
        true: [
          '!bg-[var(--color-disabled-button-bg)] !text-[var(--color-disabled-button-color)]',
          '!border-2 !border-[var(--color-disabled-button-border)]',
          'flex !w-full box-border px-6 py-2 h-10',
          'hover:!bg-[var(--color-disabled-button-bg)] hover:!text-[var(--color-disabled-button-color)]',
          'hover:!border-[var(--color-disabled-button-border)] hover:!cursor-default',
          '!cursor-default',
        ],
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

export const iconLeftVariants = cva([
  'relative w-5 h-5 mr-2.5 z-[1] flex items-center justify-center',
  // Apply color to SVG children - only stroke for paths without fill
  '[&_svg]:text-current',
  '[&_svg_path[stroke]]:stroke-current',
  '[&_svg_circle[stroke]]:stroke-current',
  '[&_svg_line]:stroke-current',
  '[&_svg_polyline]:stroke-current',
  '[&_svg_polygon[stroke]]:stroke-current',
  // Only apply fill-current to elements that have a fill attribute
  '[&_svg_path[fill]:not([fill="none"])]:fill-current',
  '[&_svg_circle[fill]:not([fill="none"])]:fill-current',
  '[&_svg_rect[fill]:not([fill="none"])]:fill-current',
])

export const iconRightVariants = cva(
  [
    'relative ml-2.5 flex justify-center items-center z-[1] w-5 h-5',
    // Apply color to SVG children - only stroke for paths without fill
    '[&_svg]:text-current',
    '[&_svg_path[stroke]]:stroke-current',
    '[&_svg_circle[stroke]]:stroke-current',
    '[&_svg_line]:stroke-current',
    '[&_svg_polyline]:stroke-current',
    '[&_svg_polygon[stroke]]:stroke-current',
    // Only apply fill-current to elements that have a fill attribute
    '[&_svg_path[fill]:not([fill="none"])]:fill-current',
    '[&_svg_circle[fill]:not([fill="none"])]:fill-current',
    '[&_svg_rect[fill]:not([fill="none"])]:fill-current',
  ],
  {
    variants: {
      largerArrowRight: {
        true: 'w-6 h-6',
      },
    },
  },
)

export type ButtonVariants = VariantProps<typeof buttonVariants>
export type ButtonWrapperVariants = VariantProps<typeof buttonWrapperVariants>
export type IconRightVariants = VariantProps<typeof iconRightVariants>
