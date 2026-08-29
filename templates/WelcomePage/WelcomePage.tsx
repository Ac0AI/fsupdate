'use client'

import { useEffect } from 'react'
import ReactGA4 from 'react-ga4'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { isClientDemoMode } from '@/common/utils/demoMode'
import { MOVEPAGEURL } from '@/constants/urls'
import { toDemoPath } from '@/common/utils/demoNavigation'
import Button from '@/components/atoms/Button'
import Spinner from '@/components/atoms/Spinner'

export const WelcomePage = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const isDemoMode = isClientDemoMode()

  useEffect(() => {
    if (isDemoMode) {
      return
    }

    if (!pathname || typeof window === 'undefined') return

    // Clear session storage
    sessionStorage.removeItem('REF_URL')
    sessionStorage.removeItem('REQUEST_SENT')

    // Track analytics event
    const userCreated = searchParams.get('userCreated')
    ReactGA4.event(userCreated === 'true' ? 'signup_success_user' : 'login_success_user')

    // Determine redirect destination
    const refUrl = searchParams.get('refUrl')
    const hasSentRequest = searchParams.get('hasSentRequest')

    if (!refUrl || ['/', '/en'].includes(refUrl)) {
      router.push(toDemoPath(MOVEPAGEURL))
    } else {
      const queryString = hasSentRequest ? `?hasSentRequest=${hasSentRequest}` : ''
      router.push(`${refUrl}${queryString}`)
    }
  }, [isDemoMode, pathname, router, searchParams])

  if (isDemoMode) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-6">
        <div className="w-full max-w-[560px] rounded-[28px] bg-white p-8 text-center shadow-[0_24px_80px_rgba(34,55,81,0.12)]">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-[var(--color-primary-main)]">Demo</p>
          <h1 className="mb-4 text-3xl font-semibold text-[var(--color-secondary-dark)]">Onboarding klar</h1>
          <p className="mb-8 text-base leading-7 text-[var(--color-text-primary)]">
            Den här demon stannar innan den riktiga appens backend-flöden startar. Du kan visa startsidan och onboarding utan BankID, orders, moves eller
            övriga externa API:er.
          </p>
          <div className="flex flex-col gap-3 md:flex-row md:justify-center">
            <Button text="Till startsidan" onClick={() => router.push('/')} />
            <Button variant="ghost" text="Till login igen" onClick={() => router.push('/login')} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <Spinner />
    </div>
  )
}

export default WelcomePage
