import { cva, type VariantProps } from 'class-variance-authority'

// Container styles
export const containerVariants = cva(['max-w-[818px] mx-auto max-w-full min-h-[220px] pt-6 px-3', 'sm:min-h-[270px] sm:pt-6', 'md:w-[818px] md:px-0'], {
  variants: { isFullList: { true: 'pb-6', false: '' } },
  defaultVariants: { isFullList: true },
})

// Skip Button styles
export const skipButtonVariants = cva(['shadow-[inset_0px_4px_12px_rgba(0,0,0,0.25)]', 'w-7 h-7 border-[3px] border-[var(--color-secondary-main)] rounded-full mr-4'])

// Empty List styles
export const emptyListVariants = cva([
  'text-[var(--color-text-main)] text-base p-10 rounded-lg',
  'flex flex-col justify-center items-center text-center',
  '[&>div:first-of-type]:text-2xl [&>div:first-of-type]:font-medium',
])

// Drop List styles
export const dropListVariants = cva(['h-[150px] relative mt-8'])

// Drop Zone styles
export const dropZoneVariants = cva([
  'absolute top-0 bg-white/50 border-4 border-dashed border-[var(--color-secondary-main)]',
  'text-[var(--color-secondary-main)] text-2xl py-[18px] px-8 text-center',
  'rounded-[var(--radius-small)] z-[99] w-full bg-[#f8faf9]',
  'sm:py-[59px] sm:px-8',
])

// Activity Title styles
export const activityTitleVariants = cva(
  [
    'activity-title', // Add class for hover targeting
    'font-bold text-[15px] text-[var(--color-text-main)] leading-4 pb-1',
    'md:text-[18px]',
  ],
  {
    variants: {
      disabled: {
        true: 'line-through opacity-40 hover:line-through',
      },
    },
  },
)

// Activity Description styles
export const activityDescriptionVariants = cva(['font-normal text-[13px] !text-[#626263]', 'md:text-[15px]'], {
  variants: {
    textLong: {
      true: 'xxs:text-[11px] largeMobile:text-[13px] md:text-[15px]',
      false: '',
    },
  },
})

// Skälet eller siffran under beskrivningen - gör rekommendationen konkret
export const activityHighlightVariants = cva([
  'inline-flex items-center gap-1.5 mt-2 px-2.5 py-1 rounded-full',
  'bg-[var(--color-primary-main)]/12 text-[var(--color-primary-dark)]',
  'font-semibold text-[12px] leading-none w-fit',
  'md:text-[13px]',
])

// Activity Icon styles
export const activityIconVariants = cva(['p-[9px] w-7 h-7 relative mr-2', '[&_img]:h-full [&_img]:w-full', 'md:mr-[14px] md:ml-[14px] md:w-9 md:h-9'], {
  variants: {
    disabled: {
      true: 'opacity-40',
    },
  },
})

// Spinner Wrapper styles
export const spinnerWrapperVariants = cva(['left-1/2', 'sm:top-[400px]'])

// Export types
export type ContainerVariants = VariantProps<typeof containerVariants>
export type ActivityTitleVariants = VariantProps<typeof activityTitleVariants>
export type ActivityDescriptionVariants = VariantProps<typeof activityDescriptionVariants>
export type ActivityIconVariants = VariantProps<typeof activityIconVariants>
