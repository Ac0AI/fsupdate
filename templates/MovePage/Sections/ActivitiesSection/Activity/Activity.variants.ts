import { cva, type VariantProps } from 'class-variance-authority'

// Activity Item styles
export const activityItemVariants = cva(
  [
    'p-3 md:p-4 rounded-[var(--radius-small)] shadow-[0px_2px_6px_rgba(1,22,39,0.06)]',
    'bg-white border-2 border-white mb-2 flex flex-col min-h-22 md:min-h-20 relative cursor-pointer',
    'transition-shadow duration-200 hover:shadow-[0px_6px_18px_rgba(1,22,39,0.10)]',
    'last:mb-2',
    '[&.ghostClass]:bg-[var(--color-ghost-background)] [&.ghostClass]:border-[var(--color-ghost-background)]',
    '[&.ghostClass]_*:hidden',
    'md:min-h-[84px]',
    'hover:[&_.activity-title]:underline',
    'flex ',
  ],
  {
    variants: {
      status: {
        locked: ['bg-[var(--color-orange-light)] border-[var(--color-accent-main)]', '[&_div]:text-[var(--color-accent-main)]'],
        not_started: 'bg-white',
        completed: 'hidden',
        skipped: 'hidden',
        hidden: '',
        reported: '',
        invoiced: '',
        under_process: '',
      },
      hidden: {
        true: 'hidden',
      },
      disabled: {
        true: 'hover:[&_.activity-title]:line-through items-center justify-center cursor-default',
        false: 'items-start justify-start',
      },
      disabledAndOpened: {
        true: 'h-auto min-h-[130px] items-center justify-center',
      },
      disabledAndOpenedAndExternalOffer: {
        true: 'h-auto min-h-[420px] md:min-h-[320px]',
      },
    },
  },
)

// Activity Content styles
export const activityContentVariants = cva(['flex items-center pr-2'])

// Activity Grabber styles
export const activityGrabberVariants = cva(
  [
    'w-6 bg-[#F5F5F7] absolute -right-0.5',
    'rounded-tr-[var(--radius-small)] rounded-br-[var(--radius-small)]',
    'cursor-move flex justify-center items-center h-[68px]',
    '[&_svg]:w-[14px] [&_svg]:h-[14px]',
    'md:h-[84px] md:w-8 md:[&_svg]:w-[21px] md:[&_svg]:h-[21px]',
  ],
  {
    variants: {
      status: {
        locked: ['bg-[#FFA65F33] border-2 border-[var(--color-accent-main)] border-l-[#FFA65F33]', '[&_div]:text-[var(--color-accent-main)]'],
        not_started: '',
        completed: '',
        skipped: '',
        hidden: '',
        reported: '',
      },
    },
  },
)

// Skip Button styles
export const skipButtonVariants = cva(['shadow-[inset_0px_4px_12px_rgba(0,0,0,0.25)]', 'w-7 h-7 border-[3px] border-[var(--color-secondary-main)] rounded-full mr-4'])

// Mobile Button styles
export const mobileButtonVariants = cva([
  'opacity-20 border-2 border-[var(--color-secondary-main)] rounded-full',
  'flex max-w-[39px] w-[39px] max-h-[39px] h-[39px]',
  'justify-center items-center pt-px',
  '[&_svg]:h-[22px] [&_svg]:w-[22px]',
])

// Drop List styles
export const dropListVariants = cva(['h-[150px] relative mt-8'])

// Drop Zone styles
export const dropZoneVariants = cva([
  'absolute top-0 bg-white/50 border-4 border-dashed border-[var(--color-secondary-main)]',
  'text-[var(--color-secondary-main)] text-2xl py-[59px] px-8 text-center',
  'rounded-lg z-[99] w-full bg-[#f8faf9]',
])

// Link Text Wrapper styles
export const linkTextWrapperVariants = cva(['text-[var(--color-secondary-main)] ml-2'], {
  variants: {
    disabled: {
      true: 'opacity-40',
    },
  },
})

// Broker Image Wrapper styles
export const brokerImageWrapperVariants = cva([
  'relative rounded-[var(--radius-main)]',
  'bg-white flex items-center justify-center mb-2',
  '[&.normal]:hidden',
  'md:py-0 md:pt-1 md:px-6',
])

// Arrow Wrapper styles
export const arrowWrapperVariants = cva(['relative w-[22px] h-[22px] flex ml-[10px] justify-center', 'hover:cursor-pointer'])

// Disabled Text Wrapper styles
export const disabledTextWrapperVariants = cva(['w-full text-[var(--color-grey-08)] text-sm pt-2', 'md:pl-[65px]'])

// Export types
export type ActivityItemVariants = VariantProps<typeof activityItemVariants>
export type ActivityGrabberVariants = VariantProps<typeof activityGrabberVariants>
export type LinkTextWrapperVariants = VariantProps<typeof linkTextWrapperVariants>
