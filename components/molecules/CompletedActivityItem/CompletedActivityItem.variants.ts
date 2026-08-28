import { cva } from 'class-variance-authority'

export const completedActivityItemWrapperVariants = cva(['w-full', 'flex', 'text-text-main', 'font-bold', 'px-2', 'py-1', 'motion-safe:animate-[rise_.4s_var(--ease-out-expo)_both]'], {
  variants: {
    type: {
      hidden: '',
      skipped: '',
      preChecked: '',
    },
  },
  defaultVariants: {
    type: 'skipped',
  },
})

export const nameWrapperVariants = cva(['ml-3', 'flex-1'], {
  variants: {
    type: {
      hidden: 'no-underline',
      skipped: '',
      preChecked: '',
    },
  },
  defaultVariants: {
    type: 'skipped',
  },
})

export const nameTextVariants = cva(['text-[#626263]', 'text-[15px]', 'font-semibold', 'leading-normal', 'line-through'])

export const modalHeaderVariants = cva(['w-full', 'flex', 'items-center', 'justify-between', 'pb-4'])

export const modalDividerVariants = cva(['w-[calc(100%+32px)]', 'ml-[-16px]', '', 'bg-[#E1E1E3]', 'h-[1px]'])

export const headerAndCheckboxVariants = cva(['h-10', 'pt-1.5', 'flex', 'items-center'], {
  variants: {
    type: {
      hidden: 'text-[#9F9FA1]',
      skipped: '',
      preChecked: '',
    },
  },
  defaultVariants: {
    type: 'skipped',
  },
})

export const headerWrapperVariants = cva(['[&_p]:leading-[1.1]'])

export const smallButtonWrapperVariants = cva(['w-[40%] md:w-[120px]'])

export const largeButtonWrapperVariants = cva(['w-[60%]', 'xs:w-48', 'md:w-[200px]'])

export const buttonWrapperVariants = cva(['mt-3', 'flex', 'gap-2', 'w-full', 'justify-between'])

export const activityWrapperVariants = cva(['flex', 'items-center', 'w-full'], {
  variants: {
    type: {
      preChecked: '',
      skipped: '',
      hidden: '[&_p]:text-[#9F9FA1]',
    },
  },
  defaultVariants: {
    type: 'skipped',
  },
})

export const checkmarkWrapperVariants = cva(['w-[16px]', 'h-[16px]', 'min-w-[16px]', 'min-h-[16px]', 'flex-shrink-0'])

export const modalCheckmarkWrapperVariants = cva(['w-6', 'h-[25px]'])

export const subtitleWrapperVariants = cva(['ml-2.5', 'text-gray-08', '[&_p]:text-xs', '[&_p]:leading-none'])
