import { cva } from 'class-variance-authority'

export const imageWrapperVariants = cva([
  'absolute top-6 left-1/2 transform -translate-x-1/2 bg-white z-[10]',
  'rounded-[var(--radius-main)]',
  'w-[210px] h-[50px]',
  '[&_svg]:ml-[-40px]',
  'sm:[&_svg]:ml-0',
  'md:top-[58px] md:w-[300px] md:h-[84px]',
])

export const styledFlexVariants = cva(['w-screen h-screen'])

export const languageSelectorWrapperVariants = cva(['absolute right-2.5 top-0', 'md:right-5 md:top-auto md:bottom-[90px]'])

export const noAddressBackgroundVariants = cva([
  'w-screen h-screen flex justify-center items-center',
  'absolute top-0 left-0 bottom-0 right-0',
  'bg-[url(/images/bg_onboarding_mobile.jpg)]',
  'bg-no-repeat bg-cover bg-center',
  'md:bg-[url(/images/bg_onboarding_desktop.jpg)]',
  'md:bg-no-repeat md:bg-cover',
])
