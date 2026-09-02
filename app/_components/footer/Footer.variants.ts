import { cva } from 'class-variance-authority'

export const wrapperVariants = cva(['bg-white', 'py-16', 'z-[1]'])

export const containerVariants = cva(['px-4', 'mx-auto', 'md:px-6', 'lg:max-w-[1280px]'])

export const marginTopWrapperVariants = cva(['md:mt-32'], {
  variants: {
    noMarginTop: {
      true: ['md:!mt-0'],
    },
  },
})

export const mainPartVariants = cva(['border-b-2', 'border-[var(--color-inactive-main)]', 'pb-[30px]', 'mb-[30px]', 'flex', 'flex-col', 'sm:flex-row', 'sm:justify-between'])

export const iconsWrapperVariants = cva(['flex', 'items-center', 'my-4'])

export const iconWrapperVariants = cva(['mr-2'], {
  variants: {
    noMargin: {
      true: ['m-0'],
    },
  },
})

export const rightSideVariants = cva(['text-[15px]', 'flex'])

export const linkButtonVariants = cva(['mr-0', 'mb-4', 'sm:mr-4', 'sm:mb-0', 'md:mr-12', 'md:mb-0'])

export const copyrightItemVariants = cva(['text-[var(--color-inactive-extra-dark)]', 'text-[11px]', 'text-center'])

export const flyttsmartAboutWrapperVariants = cva(['max-w-[629px]', 'px-4'])

export const flyttsmartDarkFooterWrapperVariants = cva(['flex', 'flex-col', 'items-center', 'bg-[var(--color-secondary-main)]', 'text-white', 'w-full'])

export const flyttsmartProsFooterWrapperVariants = cva(['flex', 'flex-col', 'justify-evenly', 'items-center', 'w-full', 'max-w-[1400px]', 'text-center', 'md:flex-row'])

export const infoVariants = cva(['my-4', 'md:p-16', 'flex', 'flex-col', 'justify-center', 'items-center', 'gap-0 md:gap-2'])

export const styledLinkVariants = cva(['text-[var(--color-tertiary-main)]', 'cursor-pointer', 'font-bold'])
