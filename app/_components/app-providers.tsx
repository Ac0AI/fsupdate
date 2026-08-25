'use client'

import { memo, useEffect, useMemo, useState, useRef } from 'react'
import { IntercomProvider } from 'react-use-intercom'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { AutocompleteServiceProvider } from '@/common/context/autocompleteProvider/autocomplete.provider'
import { InfoMissingProvider } from '@/common/context/infoMissing/infoMissing.provider'
import { ColourModeProvider, CreateThemeContext } from '@/common/context/theme/themeContext.provider'
import { CreateUserContext, UserProvider } from '@/common/context/user/UserProvider'
import { CreateUtilityContext, UtilityProvider } from '@/common/context/utility/UtilityProvider'
import { isClientDemoMode } from '@/common/utils/demoMode'
import { CookieCategories } from '@/common/types/global'
import Flex from '@/components/atoms/Flex'
import Spinner from '@/components/atoms/Spinner'
import { ReactCookieFirst } from '@cookiefirst/cookiefirst-react'

const MemoizedUtilityProvider = memo(UtilityProvider)
const contextObject = CreateUserContext()
const utilityObject = CreateUtilityContext()
const themeObject = CreateThemeContext()

/**
 * Samma provider-träd som skarpa appen, minus Intercom-autoboot. Tjänstevyerna
 * kräver utility, infoMissing och autocomplete - saknas någon kastar templaten
 * i stället för att rendera, så listan måste hållas i takt med den nedan.
 */
const DemoProviders = ({ children }: { children: React.ReactNode }) => (
  <IntercomProvider appId={process.env.NEXT_PUBLIC_INTERCOM_ID as string} autoBoot={false}>
    <UserProvider context={contextObject}>
      <ColourModeProvider context={themeObject}>
        <MemoizedUtilityProvider context={utilityObject}>
          <InfoMissingProvider>
            <AutocompleteServiceProvider>{children}</AutocompleteServiceProvider>
          </InfoMissingProvider>
        </MemoizedUtilityProvider>
      </ColourModeProvider>
    </UserProvider>
  </IntercomProvider>
)

export function AppProviders({ children }: { children: React.ReactNode }) {
  const isDemoMode = isClientDemoMode()

  const [showCookie, setShowCookie] = useState(false)
  const [consentChecked, setConsentChecked] = useState(false)
  const [scriptBlocked, setScriptBlocked] = useState(false)
  const [hasTriedInitializingConsent, setHasTriedInitializingConsent] = useState(false)

  const [cookieConsent, setCookieConsent] = useState<CookieCategories | null>()

  const searchParams = useSearchParams()
  const cookiesAccepted = searchParams.get('cookiesAccepted')
  const cookiesAcceptedQuery = useMemo(() => cookiesAccepted || (typeof window !== 'undefined' && window.sessionStorage.getItem('cookiesAccepted')), [cookiesAccepted])

  const router = useRouter()
  const pathname = usePathname()

  // Store router and pathname in refs to avoid re-registering event listeners
  const routerRef = useRef(router)
  const pathnameRef = useRef(pathname)

  // Update refs when values change
  useEffect(() => {
    routerRef.current = router
    pathnameRef.current = pathname
  })

  useEffect(() => {
    if (isDemoMode) return
    if (!!cookiesAcceptedQuery?.toString().length) {
      window?.sessionStorage.setItem('cookiesAccepted', cookiesAcceptedQuery.toString())
    }
    const shouldShow = cookiesAcceptedQuery?.toString() !== 'false' && window.location.hostname.includes('flyttsmart.se')
    setShowCookie(shouldShow)
  }, [cookiesAcceptedQuery, isDemoMode])

  useEffect(() => {
    if (isDemoMode) return
    const checkConsentOnEvent = () => {
      const CF = window.CookieFirst
      if (CF?.consent) {
        setCookieConsent(CF.consent)
        setScriptBlocked(false)
        setConsentChecked(true)
      } else {
        setConsentChecked(true)
        setCookieConsent(null)
      }
      setHasTriedInitializingConsent(true)
    }
    // No need to test this locally since cookie consent is not required
    if (window.location.hostname.includes('flyttsmart.se')) {
      window.addEventListener('cf_init', checkConsentOnEvent)

      // Check if CookieFirst exists after 15 seconds
      setTimeout(() => {
        if (!window.CookieFirst) {
          console.warn('[Consent] CookieFirst script likely blocked (not loaded)')
          setCookieConsent(null)
          setScriptBlocked(true)
          setConsentChecked(true)
          if (pathnameRef.current !== '/adblock') {
            routerRef.current.replace('/adblock')
          }
        }
      }, 15000) // 15 seconds timeout
    } else {
      // Only needed to render locally
      setConsentChecked(true)
      setScriptBlocked(true)
    }

    return () => {
      if (window.removeEventListener) {
        window.removeEventListener('cf_init', checkConsentOnEvent)
      }
    }
  }, [isDemoMode])

  useEffect(() => {
    if (isDemoMode) return
    // No need to test this locally since cookie consent is not required
    if (window.location.hostname.includes('flyttsmart.se')) {
      if (cookieConsent) {
        if (pathname === '/adblock') {
          router.replace('/')
        }
      }

      if (!cookieConsent && scriptBlocked && hasTriedInitializingConsent) {
        if (pathname !== '/adblock') {
          router.replace('/adblock')
        }
      }
    }
  }, [cookieConsent, scriptBlocked, hasTriedInitializingConsent, pathname, router, isDemoMode])

  if (isDemoMode) {
    return <DemoProviders>{children}</DemoProviders>
  }

  if (!consentChecked && pathname.includes('/adblock')) {
    return (
      <Flex direction="column" justifyContent="center" alignItems="center" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
        <Spinner scale={2} color="green" />
      </Flex>
    )
  }

  return (
    <IntercomProvider appId={process.env.NEXT_PUBLIC_INTERCOM_ID as string} autoBoot>
      <UserProvider context={contextObject}>
        <ColourModeProvider context={themeObject}>
          <MemoizedUtilityProvider context={utilityObject}>
            <InfoMissingProvider>
              <AutocompleteServiceProvider>
                {showCookie && !scriptBlocked && <ReactCookieFirst url={process.env.NEXT_PUBLIC_COOKIE_FIRST_URL as string}>{children}</ReactCookieFirst>}
                {scriptBlocked && <>{children}</>}
              </AutocompleteServiceProvider>
            </InfoMissingProvider>
          </MemoizedUtilityProvider>
        </ColourModeProvider>
      </UserProvider>
    </IntercomProvider>
  )
}
