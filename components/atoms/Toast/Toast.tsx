import { clsx } from 'clsx'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { toastViewportVariants, toastVariants, toastTitleVariants, toastDescriptionVariants, toastActionVariants, type ToastVariants } from './Toast.variants'

// Create styled components using clsx
const StyledViewport = ({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Viewport>) => (
  <ToastPrimitive.Viewport className={clsx(toastViewportVariants(), className)} {...props} />
)

const StyledToast = ({ className, tone, ...props }: React.ComponentProps<typeof ToastPrimitive.Root> & ToastVariants) => (
  <ToastPrimitive.Root className={clsx(toastVariants({ tone }), className)} {...props} />
)

const StyledTitle = ({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Title>) => (
  <ToastPrimitive.Title className={clsx(toastTitleVariants(), className)} {...props} />
)

const StyledDescription = ({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Description>) => (
  <ToastPrimitive.Description className={clsx(toastDescriptionVariants(), className)} {...props} />
)

const StyledAction = ({ className, ...props }: React.ComponentProps<typeof ToastPrimitive.Action>) => (
  <ToastPrimitive.Action className={clsx(toastActionVariants(), className)} {...props} />
)

// Exports
export const ToastProvider = ToastPrimitive.Provider
export const ToastViewport = StyledViewport
export const Toast = StyledToast
export const ToastTitle = StyledTitle
export const ToastDescription = StyledDescription
export const ToastAction = StyledAction
export const ToastClose = ToastPrimitive.Close
