import { cva, type VariantProps } from 'class-variance-authority'

export const toastViewportVariants = cva([
  'fixed top-[10px] right-0 left-1/2 transform -translate-x-1/2',
  'flex justify-center items-center flex-col p-0 h-10 max-w-full w-full',
  'margin-0 list-none z-[2147483647] outline-none',
  'md:left-0 md:transform-none md:p-[0_25px_25px_25px]',
])

export const toastVariants = cva(
  [
    'rounded-lg h-10 w-[343px] flex items-center shadow-[0px_8px_8px_rgba(0,0,0,0.12)] p-2',
    // Animation classes for reduced motion preference
    'motion-safe:data-[state=open]:animate-[slideIn_250ms_cubic-bezier(0.16,1,0.3,1)]',
    'motion-safe:data-[state=closed]:animate-[swipeOut_250ms_ease-in]',
    'motion-safe:data-[swipe=move]:transform',
    'motion-safe:data-[swipe=move]:translate-y-[var(--radix-toast-swipe-move-y)]',
    'motion-safe:data-[swipe=cancel]:transform',
    'motion-safe:data-[swipe=cancel]:translate-y-0',
    'motion-safe:data-[swipe=cancel]:transition-transform',
    'motion-safe:data-[swipe=cancel]:duration-200',
    'motion-safe:data-[swipe=cancel]:ease-out',
    'motion-safe:data-[swipe=end]:animate-[swipeOut_100ms_ease-out]',
  ],
  {
    variants: {
      // Grå bekräftar, röd säger att något gick fel. Fler toner än så gör
      // meddelandet till en färgkod kunden måste lära sig.
      tone: {
        confirm: 'bg-[#869AA9]',
        error: 'bg-[var(--color-error-red)]',
      },
    },
    defaultVariants: {
      tone: 'confirm',
    },
  },
)

export const toastTitleVariants = cva(['font-medium text-white text-base'])

export const toastDescriptionVariants = cva(['ml-[10px] text-base font-medium text-white'])

export const toastActionVariants = cva(['grid-area-action'])

export type ToastViewportVariants = VariantProps<typeof toastViewportVariants>
export type ToastVariants = VariantProps<typeof toastVariants>
export type ToastTitleVariants = VariantProps<typeof toastTitleVariants>
export type ToastDescriptionVariants = VariantProps<typeof toastDescriptionVariants>
export type ToastActionVariants = VariantProps<typeof toastActionVariants>
