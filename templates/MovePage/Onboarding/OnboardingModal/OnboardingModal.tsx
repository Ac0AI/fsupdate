'use client'

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLeadContext } from '@/common/context/lead/LeadProvider'
import useResponsive from '@/common/hooks/useResponsive'
import Flex from '@/components/atoms/Flex'
import TrustIndicatorsStrip from '@/components/molecules/TrustIndicatorsStrip'
import ArrowLeft from '@/public/images/ArrowLeft.svg'
import MapPin from '@/public/images/MapPin_filled.svg'
import { OnboardingFormAddress } from './OnboardingForm/OnboardingForm'
import { OnboardingFormDates } from './OnboardingForm/OnboardingFormDates'
import {
  styledModalVariants,
  styledHeaderSectionVariants,
  modalDividerVariants,
  styledHeaderVariants,
  termsTextVariants,
  termsTextLinkVariants,
  termsWrapperVariants,
  introSectionVariants,
  introTitleVariants,
  introDescriptionVariants,
  stepBarVariants,
  stepBackButtonVariants,
  stepIndicatorVariants,
  stepAddressSummaryVariants,
} from './OnboardingModal.variants'

export interface OnboardingModalProps {
  onSaveAddress: (address: Record<string, string>) => void
}

const TERMS_URL = 'https://flyttsmart.se/terms'
const TOTAL_STEPS = 2

const OnboardingModal = ({ onSaveAddress }: OnboardingModalProps) => {
  const { t } = useTranslation(['signup', 'movePage', 'common'])
  const { isTabletPortraitOrGreater } = useResponsive()
  const [currentStep, setCurrentStep] = useState(1)
  const [fullHeight, setFullHeight] = useState(false)
  const [showMovingInDate, setShowMovingInDate] = useState(false)

  const { leadAddressData } = useLeadContext()

  const isMobile = !isTabletPortraitOrGreater

  useEffect(() => {
    if (fullHeight && isMobile) {
      document.body.style.overflowY = 'hidden'
    }
    return () => {
      document.body.style.overflowY = 'auto'
    }
  }, [fullHeight, isMobile])

  const headerText = currentStep === 1 ? t('whereToMove') : t('whenToMove')
  const hasAddressSummary = currentStep === 2 && !!leadAddressData.toStreet?.length

  return (
    <div
      className={styledModalVariants({
        fullHeight: isMobile ? fullHeight : false,
        isStepTwo: currentStep === 2 && !showMovingInDate,
        isStepTwoAndTwoDates: currentStep === 2 && showMovingInDate,
      })}
    >
      <Flex direction="column" justifyContent="start" alignItems="stretch">
        <TrustIndicatorsStrip className="mb-4 -mx-2" />

        <div className={stepBarVariants()}>
          {currentStep === 2 ? (
            <button type="button" className={stepBackButtonVariants()} onClick={() => setCurrentStep(1)}>
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('movePage:ONBOARDINGMODAL.back')}
            </button>
          ) : (
            <span />
          )}
          <span className={stepIndicatorVariants()}>
            {t('movePage:ONBOARDINGMODAL.stepOf', { current: currentStep, total: TOTAL_STEPS })}
          </span>
        </div>

        {/* Intro section - only show on step 1 */}
        {currentStep === 1 && (
          <div className={introSectionVariants()}>
            <h1 className={introTitleVariants()}>{t('introTitle')}</h1>
            <p className={introDescriptionVariants()}>{t('introDescription')}</p>
          </div>
        )}

        <div className={styledHeaderSectionVariants()}>
          <MapPin className="mb-0.5" />
          <h2 className={styledHeaderVariants()}>{headerText}</h2>
        </div>

        {hasAddressSummary && (
          <p className={stepAddressSummaryVariants()}>
            {leadAddressData.toStreet}, {leadAddressData.toZip} {leadAddressData.toCity}
          </p>
        )}

        <div className={modalDividerVariants()} />

        {currentStep === 1 && (
          <OnboardingFormAddress
            setFullHeight={setFullHeight}
            setCurrentStep={setCurrentStep}
            leadAddress={leadAddressData}
            onSubmitCallback={onSaveAddress}
          />
        )}

        {currentStep === 2 && (
          <OnboardingFormDates
            setShowMovingInDate={setShowMovingInDate}
            showMovingInDate={showMovingInDate}
            leadAddress={leadAddressData}
          />
        )}

        <div className={`${termsWrapperVariants()} items-center mt-2.5`}>
          <p className={termsTextVariants()}>{t('terms')}</p>
          <a
            className={termsTextLinkVariants()}
            href={TERMS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t('termsLinkText')}
          </a>
        </div>
      </Flex>
    </div>
  )
}

export default OnboardingModal
