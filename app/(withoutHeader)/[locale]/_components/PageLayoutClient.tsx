'use client'

import { useEffect, useCallback, useState, useRef } from 'react'
import { useIntercom } from 'react-use-intercom'
import Footer from 'app/_components/footer/FooterClient'
import clsx from 'clsx'
import i18nConfig from 'i18nConfig'
import Cookies from 'js-cookie'
import { usePathname } from 'next/navigation'
import { isClientDemoMode } from '@/common/utils/demoMode'
import { useUserContext } from '@/common/context/user/UserProvider'
import { longLocale, ShortLocale } from '@/common/enums/LocaleEnum'
import useResponsive from '@/common/hooks/useResponsive'


export function PageLayoutClient({ children }: { children: React.ReactNode }) {
  const { boot } = useIntercom()
  const isDemoMode = isClientDemoMode()
  const pathname = usePathname()
  const withInneHeight = pathname?.includes('fixarenovera')
  // Standardspråket saknar prefix i URL:en men /sv/... är fortfarande nåbart, så matcha utan locale.
  const pathWithoutLocale = (pathname ?? '/').replace(new RegExp(`^/(${i18nConfig.locales.join('|')})(?=/|$)`), '')
  const noFooter = ['', '/', '/login', '/sso'].includes(pathWithoutLocale)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const { isTabletLandscapeOrGreater } = useResponsive()
  const [showBackground, setShowBackground] = useState(false)
  const {
    user: { profile, hasFetchedData, contact },
  } = useUserContext()
  const [hasBootedIntercom, setHasBootedIntercom] = useState(false)

  const bootFunction = useCallback(() => {
    if (hasFetchedData && profile?.id) {
      boot({
        userHash: profile && profile.intercomHash,
        name: profile && `${profile.firstName} ${profile.lastName}`,
        email: contact && contact.email,
        phone: contact && contact.phone,
        customAttributes: {
          user_id: profile && profile.id,
          sign_up_channel: profile?.meta?.onboardingChannel ?? (window.localStorage.getItem('channel') || 'unknown'),
          dashboard_language: Cookies.get('NEXT_LOCALE') === ShortLocale.SV ? longLocale.SV : longLocale.EN,
        },
      })
    } else {
      boot()
    }
  }, [hasFetchedData, profile, contact, boot])

  useEffect(() => {
    if (isDemoMode) return

    if (typeof window !== 'undefined' && !hasBootedIntercom) {
      setTimeout(() => {
        window.addEventListener(
          'storage',
          (e) => {
            if (e.key === 'intercom-allow') {
              bootFunction()
              setHasBootedIntercom(true)
            }
          },
          false,
        )
        if (window.localStorage.getItem('intercom-allow')) {
          bootFunction()
          setHasBootedIntercom(true)
        }
      }, 100)
    }
  }, [boot, bootFunction, hasBootedIntercom, isDemoMode])

  return (
    <>
      {!isTabletLandscapeOrGreater && (
        <div ref={backgroundRef} className={clsx('fixed h-screen w-full bg-black/30 top-0 left-0 z-[99999] cursor-pointer', showBackground ? 'block' : 'hidden')} />
      )}
      {/* Wrap main content in div, this will make the sticky header not disappear under the content */}
      {withInneHeight ? <div className="min-h-screen">{children}</div> : <div className="flex-1 flex flex-col">{children}</div>}
      {!noFooter && <Footer showBackground={showBackground} setShowBackground={setShowBackground} />}
    </>
  )
}
