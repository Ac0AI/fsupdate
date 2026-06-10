import { useCallback, useEffect, useState } from 'react'
import { useLeadContext } from '@/common/context/lead/LeadProvider'
import useResponsive from '@/common/hooks/useResponsive'
import GoogleMapWithPin from '@/components/molecules/GoogleMapWithPin'
import LanguageSelectNew from '@/components/molecules/LanguageSelect/LanguageSelectNew'
import BrokerTrustBadge from '@/components/molecules/BrokerTrustBadge'
import OnboardingModal from '../MovePage/Onboarding/OnboardingModal'
import { languageSelectorWrapperVariants, noAddressBackgroundVariants } from './OnboardingDataSection.variants'

export interface OnboardingDataSectionProps {
  code: string
}

export const OnboardingDataSection = ({ code }: OnboardingDataSectionProps) => {
  const [coordinates, setCoordinates] = useState<Record<string, number | undefined>>({ lat: undefined, lng: undefined })
  const [isVisible, setIsVisible] = useState(false)
  const {
    lead: { leadDetails, partnerDetails },
    leadAddressData,
    setInvitationCode,
  } = useLeadContext()

  const { isTabletPortraitOrGreater } = useResponsive()

  useEffect(() => {
    if (!!code) setInvitationCode(code)
  }, [code, setInvitationCode])

  // Trigger entrance animation
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const [inviterLogoUrl, setInviterLogoUrl] = useState<string>('')

  const setCoordinatesFn = useCallback((leadAddress: Record<string, string>) => {
    const geoCoder = new window.google.maps.Geocoder()
    geoCoder.geocode({ address: `${leadAddress.street}, ${leadAddress.zip}, ${leadAddress.city}` }, (results) => {
      if (results?.[0].geometry) setCoordinates({ lat: results?.[0].geometry.location.lat(), lng: results?.[0].geometry.location.lng() })
    })
  }, [])

  useEffect(() => {
    if (leadAddressData.toCity?.length && !coordinates.lat && !coordinates.lng) {
      setCoordinatesFn({ street: leadAddressData.toStreet, zip: leadAddressData.toZip, city: leadAddressData.toCity })
    }
  }, [leadAddressData, coordinates, setCoordinatesFn])

  useEffect(() => {
    if (!inviterLogoUrl?.length && code) {
      setInviterLogoUrl(leadDetails.brokerAgencyLogo || '')
    }
  }, [inviterLogoUrl, leadDetails, partnerDetails, code])

  return (
    <div className="fixed inset-0 w-screen h-full overflow-hidden">
      <div className="relative w-full h-full">
        {coordinates?.lat && coordinates?.lng ? <GoogleMapWithPin lat={coordinates?.lat} lng={coordinates?.lng} /> : <div className={noAddressBackgroundVariants()} />}

        {/* Enhanced broker badge - positioned top center with safe area for notch */}
        {leadDetails?.brokerAgencyLogo && !!inviterLogoUrl?.length && (
          <div
            className={`
              absolute top-12 left-1/2 -translate-x-1/2 z-10
              transition-all duration-300 ease-out
              ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}
              md:top-8
            `}
          >
            <BrokerTrustBadge
              brokerAgencyLogo={inviterLogoUrl}
              brokerOfficeName={leadDetails.brokerOfficeName}
              variant={isTabletPortraitOrGreater ? 'default' : 'compact'}
            />
          </div>
        )}

        {/* Desktop modal */}
        <div
          className={`
            hidden md:flex md:absolute md:inset-0 md:items-center md:justify-center
            transition-all duration-300 ease-out delay-100
            ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
          `}
        >
          <OnboardingModal onSaveAddress={(leadAddress: Record<string, string>) => setCoordinatesFn(leadAddress)} />
        </div>
      </div>

      {/* Mobile modal */}
      <div
        className={`
          md:hidden
          transition-all duration-300 ease-out delay-150
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
        `}
      >
        <OnboardingModal onSaveAddress={(leadAddress: Record<string, string>) => setCoordinatesFn(leadAddress)} />
      </div>

      {/* Language selector */}
      <div className={languageSelectorWrapperVariants()}>
        <LanguageSelectNew variant="secondary" />
      </div>
    </div>
  )
}

export default OnboardingDataSection
