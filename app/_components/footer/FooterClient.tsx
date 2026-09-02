import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { GoogleReviewCountAndRating, GoogleReview } from 'app/_actions/googleReviews'
import { usePathname } from 'next/navigation'
import { useUserContext } from '@/common/context/user/UserProvider'
import useResponsive from '@/common/hooks/useResponsive'
import Flex from '@/components/atoms/Flex'
import { LanguageSelect } from '@/components/molecules/LanguageSelect'
import Link from '@/components/molecules/Link'
import ServiceFooter from '@/components/organisms/Footer/Footer'
import Facebook from '@/public/images/Facebook.svg'
import Globe from '@/public/images/Globe.svg'
import Instagram from '@/public/images/Instagram.svg'
import LinkedIn from '@/public/images/LinkedIn.svg'
import Logo from '@/public/images/Logo.svg'
import ContactSection from '@/templates/MovePage/Sections/ContactSection/ContactSection'
import { FlyttsmartGoogleRatingRowWithCards } from '../FlyttsmartGoogleRating/FlyttsmartGoogleRatingRowWithCards'
import ExternalPageFooterSection from './ExternalPageFooterSection'
import {
  wrapperVariants,
  containerVariants,
  mainPartVariants,
  iconWrapperVariants,
  iconsWrapperVariants,
  rightSideVariants,
  linkButtonVariants,
  copyrightItemVariants,
  marginTopWrapperVariants,
} from './Footer.variants'
import getCurrentServiceType from './getCurrentServiceType'

interface FooterProps {
  flyttsmartGoogleReviewCountAndRating?: GoogleReviewCountAndRating
  googleReviews?: GoogleReview[]
  showBackground?: boolean
  setShowBackground?: (show: boolean) => void
}
const Footer = ({ flyttsmartGoogleReviewCountAndRating, googleReviews, showBackground, setShowBackground }: FooterProps) => {
  const { t } = useTranslation('footer')
  const {
    user: {
      currentMove: { id },
      hasFetchedData,
    },
  } = useUserContext()
  const { isTabletPortraitOrGreater } = useResponsive()
  const aboutFlyttsmartFooterRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const backgroundRef = useRef<HTMLDivElement>(null)
  const currentServiceType = getCurrentServiceType(pathname)

  return (
    <>
      {(flyttsmartGoogleReviewCountAndRating || pathname.includes('app/movepage') || (currentServiceType && (pathname.includes('/app') || !!id))) && (
        <div className={marginTopWrapperVariants({ noMarginTop: pathname.includes('app/movepage') })}>
          {flyttsmartGoogleReviewCountAndRating && (
            <FlyttsmartGoogleRatingRowWithCards flyttsmartGoogleReviewCountAndRating={flyttsmartGoogleReviewCountAndRating} googleReviews={googleReviews} />
          )}
          {pathname.includes('app/movepage') && <ContactSection />}
          {currentServiceType && (pathname.includes('/app') || !!id) && pathname !== '/app/movepage' && (
            <ServiceFooter
              currentServiceType={currentServiceType}
              backgroundRef={backgroundRef}
              showBackground={showBackground}
              setShowBackground={setShowBackground}
              aboutFlyttsmartFooterRef={aboutFlyttsmartFooterRef}
            />
          )}
        </div>
      )}

      <div className={wrapperVariants()}>
        <div className={containerVariants()}>
          <div className={mainPartVariants()}>
            <Flex display="flex" direction="column" alignItems={!isTabletPortraitOrGreater ? 'center' : 'start'}>
              <Logo width={!isTabletPortraitOrGreater ? 116 : 177} height={!isTabletPortraitOrGreater ? 21 : 32} alt="logo" className="brightness-0 invert" />
              <div className={iconsWrapperVariants()}>
                <div className={iconWrapperVariants()}>
                  <Link href="https://www.instagram.com/flyttsmart" noUnderline>
                    <Instagram width={28} height={28} alt="instagram" className="brightness-[1.7]" />
                  </Link>
                </div>
                <div className={iconWrapperVariants()}>
                  <Link href="https://www.facebook.com/flyttsmart.se" noUnderline>
                    <Facebook width={22} height={22} alt="facebook" className="brightness-[1.7]" />
                  </Link>
                </div>
                <div className={iconWrapperVariants({ noMargin: true })}>
                  <Link href="https://www.linkedin.com/company/flyttsmart" noUnderline>
                    <LinkedIn width={24} height={24} alt="linkedin" className="brightness-[1.7]" />
                  </Link>
                </div>
              </div>
            </Flex>
            <Flex
              className={rightSideVariants()}
              direction={!isTabletPortraitOrGreater ? 'column' : 'row'}
              alignItems="center"
              justifyContent={!isTabletPortraitOrGreater ? 'center' : 'end'}
            >
              <div className={linkButtonVariants()}>
                <Link href="/blogg">{t('blog')}</Link>
              </div>
              <div className={linkButtonVariants()}>
                <Link href="/flytta-utomlands">{t('abroad')}</Link>
              </div>
              <div className={linkButtonVariants()}>
                <Link href={'/terms'}>{t('termsLinkText')}</Link>
              </div>
              <div className={linkButtonVariants()}>
                <Link href="https://jobb.flyttsmart.se/">{t('jobs')}</Link>
              </div>
              <div className={linkButtonVariants()}>
                <Link href="/cookie">{t('cookie')}</Link>
              </div>
              <Flex display="flex">
                <Flex display="flex" alignItems="center">
                  <Globe height={22} width={22} />
                </Flex>
                <LanguageSelect />
              </Flex>
            </Flex>
          </div>
          <Flex display="flex" direction="column" alignItems={!isTabletPortraitOrGreater ? 'center' : 'start'}>
            <div className={copyrightItemVariants()}>{t('copyRight', { year: new Date().getFullYear() })}</div>
            {!isTabletPortraitOrGreater ? (
              <>
                <div className={copyrightItemVariants()}>{t('companyAddres')}</div>
                <div className={copyrightItemVariants()}>{t('orgNumber')}</div>
              </>
            ) : (
              <div className={copyrightItemVariants()}>
                {t('companyAddres')}, {t('orgNumber')}
              </div>
            )}
            <div className={copyrightItemVariants()}>{t('footer:terms')}</div>
          </Flex>
        </div>
      </div>
    </>
  )
}

export default Footer
