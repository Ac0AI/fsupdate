'use client'

import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntercom } from 'react-use-intercom'
import Image from 'next/legacy/image'
import { useRouter } from 'next/navigation'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import { logout } from '@/common/utils/userHelpers'
import DropdownMenu from '@/components/atoms/DropdownMenu'
import Flex from '@/components/atoms/Flex'
import ProfileModal from '@/components/organisms/ProfileModal'
import LanguageSelect from '../LanguageSelect/LanguageSelectNew'
import { toDemoPath } from '@/common/utils/demoNavigation'
import {
  headerContentVariants,
  gridVariants,
  imageWrapperVariants,
  imagesWrapperVariants,
  circleVariants,
  menuWrapperVariants,
  menuTextVariants,
  brokerImageWrapperVariants,
} from './LoggedInTopNav.variants'

const LoggedInTopNav = () => {
  const { t } = useTranslation('header')
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const {
    user: { profile },
  } = useUserContext()
  const { leadDetails, partnerDetails, firstName } = profile
  const router = useRouter()
  const { trackEvent } = useIntercom()
  const { theme } = useThemeContext()
  const [inviterLogoUrl, setInviterLogoUrl] = useState('')

  useEffect(() => {
    if (!isProfileModalOpen) {
      document.body.style.pointerEvents = 'auto'
    }
  }, [isProfileModalOpen])

  useEffect(() => {
    if (!inviterLogoUrl?.length && leadDetails?.pno) {
      setInviterLogoUrl(leadDetails?.brokerAgencyLogo || '')
    }
  }, [inviterLogoUrl, leadDetails, partnerDetails])

  const menuItems = [
    {
      label: t('profile'),
      onClick: () => setIsProfileModalOpen(true),
      icon: '/images/UserCircle.svg',
    },
    {
      label: t('logout'),
      onClick: () => logout(trackEvent),
      icon: '/images/ArrowSquareLeft.svg',
    },
    {
      label: <LanguageSelect />,
      icon: '/images/Globe.svg',
    },
  ]

  return (
    <>
      {isProfileModalOpen && (
        <ProfileModal
          onClickClose={() => {
            setIsProfileModalOpen(false)
          }}
          isOpen={isProfileModalOpen}
        />
      )}
      <div className={headerContentVariants()}>
        <Flex justifyContent="space-between" alignItems="center" className="w-[1168px] h-full">
          <div className={gridVariants()}>
            <Flex className="pl-4">
              <div className={imagesWrapperVariants()}>
                <div className={imageWrapperVariants({ display: 'normal' })} data-testid="image-wrapper" onClick={() => router.push(toDemoPath('/app/movepage'))}>
                  <Image src="/images/Flyttsmart_bird_white.svg" objectFit="contain" layout="fill" alt={'Flyttsmart fågel'} />
                </div>
                {leadDetails?.brokerAgencyLogo && (
                  <div className={brokerImageWrapperVariants({ theme: theme === 'fortum' ? 'fortum' : 'default' })}>
                    <Image src={leadDetails.brokerAgencyLogo || ''} objectFit="contain" width="104" height="28" alt={`Logo of broker office ${leadDetails.brokerOfficeName}`} />
                  </div>
                )}
              </div>
            </Flex>

            <Flex justifySelf="end" className="pr-4">
              <DropdownMenu items={menuItems}>
                <div className={menuWrapperVariants()}>
                  <div className={circleVariants()}>{firstName?.charAt(0)}</div>
                  <p className={menuTextVariants()}>{firstName}</p>
                </div>
              </DropdownMenu>
            </Flex>
          </div>
        </Flex>
      </div>
    </>
  )
}

export default LoggedInTopNav
