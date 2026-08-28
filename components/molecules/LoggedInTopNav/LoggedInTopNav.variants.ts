import { cva } from 'class-variance-authority'

export const headerContentVariants = cva(['bg-secondary-main', 'h-[52px]', 'flex', 'justify-center', 'items-center', 'sm:h-[51px]'])

export const gridVariants = cva(['grid', 'w-full', 'grid-cols-[200px_1fr]', 'sm:grid-cols-[200px_1fr_auto]', 'sm:grid-rows-[51px]'])

export const imageWrapperVariants = cva(['relative', 'w-[114px]', 'h-5', 'mr-4', 'hover:cursor-pointer', 'sm:w-[137px]', 'sm:h-[27px]'], {
  variants: {
    display: {
      normal: 'block',
      hidden: 'hidden',
    },
  },
  defaultVariants: {
    display: 'normal',
  },
})

export const imagesWrapperVariants = cva(['flex', 'items-center'])

export const circleVariants = cva([
  'w-[34px]',
  'h-[34px]',
  'leading-[34px]',
  'rounded-full',
  'text-sm',
  'font-black',
  'text-secondary-main',
  'text-center',
  'bg-[rgb(238,238,240)]',
])

export const menuWrapperVariants = cva(['flex', 'h-full', 'items-center', 'leading-[23px]', 'tracking-[0.02rem]', 'cursor-pointer', 'transition-[opacity,transform] duration-200 ease-out', 'hover:opacity-85', 'motion-safe:active:scale-[0.97]'])

export const menuTextVariants = cva(['text-white-main', 'font-black', 'ml-4', 'text-sm', 'hidden', 'sm:block'])

export const brokerImageWrapperVariants = cva(['relative', 'w-[108px]', 'h-8', 'p-1', 'rounded', 'bg-white', 'flex', 'items-center', 'justify-center', 'sm:hidden'], {
  variants: {
    theme: {
      default: '',
      fortum: 'hidden',
    },
  },
  defaultVariants: {
    theme: 'default',
  },
})
