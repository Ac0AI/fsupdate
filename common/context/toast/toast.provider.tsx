import { useContext, createContext, useState, useCallback, useEffect, useRef } from 'react'
import Check from '@/public/images/Check.svg'
import { Toast, ToastDescription, ToastProvider as ToastPrimitiveProvider, ToastTitle, ToastViewport } from '@/components/atoms/Toast'

export type ToastContextType = {
  showToast: (message: string) => void
}

const defaultValue: ToastContextType = {
  showToast: () => null,
}

const ToastContext = createContext<ToastContextType>(defaultValue)

// Fyra sekunder räcker för en rad text och är kort nog att inte ligga kvar
// över nästa vy. Swipe uppåt stänger den tidigare.
const TOAST_DURATION = 4000

export type ToastProviderProps = {
  children: React.ReactNode
}

export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const reopenTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  const showToast = useCallback((next: string) => {
    // Byter vi bara texten på en toast som redan är öppen glider den inte in
    // igen, och det ser ut som att ingenting hände. Stäng först, öppna på
    // nästa tick.
    setOpen(false)
    clearTimeout(reopenTimer.current)
    reopenTimer.current = setTimeout(() => {
      setMessage(next)
      setOpen(true)
    }, 0)
  }, [])

  useEffect(() => () => clearTimeout(reopenTimer.current), [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      <ToastPrimitiveProvider swipeDirection="up" duration={TOAST_DURATION}>
        {children}
        {message !== null && (
          <Toast open={open} onOpenChange={setOpen}>
            <ToastTitle className="flex h-[18px] w-[18px] shrink-0 items-center justify-center [&>svg]:h-full [&>svg]:w-full">
              <Check />
            </ToastTitle>
            <ToastDescription>{message}</ToastDescription>
          </Toast>
        )}
        <ToastViewport />
      </ToastPrimitiveProvider>
    </ToastContext.Provider>
  )
}

export const useToastContext = () => useContext(ToastContext)
