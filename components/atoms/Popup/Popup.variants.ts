import { cva } from 'class-variance-authority'

const backgroundVariants = cva(['fixed h-screen w-full bg-black/30 top-0 left-0 z-[999999]', 'hover:cursor-pointer'], {
  variants: {
    visible: {
      true: 'block',
      false: 'hidden',
    },
  },
  defaultVariants: {
    visible: false,
  },
})

const triggerVariants = cva(['underline decoration-gray-300 p-0 bg-none cursor-pointer border-none flex'], {
  variants: {
    noUnderline: {
      true: '!no-underline !decoration-none',
    },
  },
})

const contentVariants = cva(
  [
    'bg-white font-sans z-[1000000] w-[311px] max-w-[90vw]',
    'shadow-[0_0_5px_rgba(0,0,0,0.3)] rounded-[5px] p-4 text-left',
    'text-gray-800 font-normal text-xs mx-[15px]',
    '[&_p]:text-sm [&_p]:m-0',
    '[&_li]:text-sm [&_li]:font-normal',
  ],
  {
    variants: {
      textMargin: {
        true: '[&_p]:my-2',
      },
      withFluidWidth: {
        true: ['min-w-[311px] w-auto', 'lg:w-[400px]'],
      },
      hoverFadeIn: {
        true: 'animate-[fadeIn_0.2s_cubic-bezier(0.23,1,0.32,1)]',
      },
    },
  },
)

const arrowVariants = cva('fill-white')

export const popupVariants = {
  background: backgroundVariants,
  trigger: triggerVariants,
  content: contentVariants,
  arrow: arrowVariants,
}

export type PopupVariants = {
  visible?: boolean
  noUnderline?: boolean
  textMargin?: boolean
  withFluidWidth?: boolean
  hoverFadeIn?: boolean
}
