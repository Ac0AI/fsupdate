import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntercom } from 'react-use-intercom'
import { useRouter } from 'next/navigation'
import { useMovehelpContext } from '@/common/context/movehelpProvider/movehelp.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import { MoveService } from '@/common/enums/MoveServicesEnum'
import useResponsive from '@/common/hooks/useResponsive'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import ImageKit from '@/components/atoms/ImageKit'
import Spinner, { SpinnerWrapper } from '@/components/atoms/Spinner'
import Text from '@/components/atoms/Text'
import OrderFailError from '@/components/molecules/ErrorMessage'
import BackButtonDefault from '@/public/images/BackButtonDefault.svg'
import BackButtonHover from '@/public/images/BackButtonHover.svg'
import CloseButtonDefault from '@/public/images/CloseButtonDefault.svg'
import CloseButtonHover from '@/public/images/CloseButtonHover.svg'
import LargeCheckmark from '@/public/images/Large_checkmark.svg'
import {
  closeButtonWrapperVariants,
  contentContainerVariants,
  continueButtonWrapperVariants,
  dataSectionWrapperVariants,
  spinnerBgWrapperVariants,
  wrapperVariants,
} from './RequestQuotation.variants'
import AddonsSection from './Sections/AddonsSection'
import DetailsSection from './Sections/DetailsSection'
import FromSection from './Sections/FromSection'
import ToSection from './Sections/ToSection'
import { toDemoPath } from '@/common/utils/demoNavigation'

interface RequestQuotationProps {
  onCloseButtonClick: () => void
  type: 'movehelp' | 'movehelpAndmoveclean'
}

export const RequestQuotation = ({ onCloseButtonClick, type }: RequestQuotationProps) => {
  const { t } = useTranslation(['movehelp', 'common', 'error'])
  const [currentStep, setCurrentStep] = useState(1)
  const { isTabletPortraitOrGreater } = useResponsive()
  const { hasOrdered, emailAndPhone, orderError, setOrderError } = useMovehelpContext()
  const router = useRouter()
  const { show } = useIntercom()
  const {
    user: {
      hasFetchedData,
      contact: { email },
      profile: { leadDetails },
    },
  } = useUserContext()

  const assignedMcAdmin = leadDetails?.assignedMcAdmin

  const isWorkingHours = () => {
    const now = new Date()

    const swedenFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Europe/Stockholm',
      weekday: 'short',
      hour: 'numeric',
      hour12: false,
    })

    const parts = swedenFormatter.formatToParts(now)
    const dayName = parts.find((p) => p.type === 'weekday')?.value
    const hour = parseInt(parts.find((p) => p.type === 'hour')?.value || '0', 10)

    const dayMap: { [key: string]: number } = {
      Mon: 1,
      Tue: 2,
      Wed: 3,
      Thu: 4,
      Fri: 5,
      Sat: 6,
      Sun: 0,
    }
    const day = dayMap[dayName || 'Sun'] || 0

    return day >= 1 && day <= 5 && hour >= 8 && hour < 17
  }

  if (!hasFetchedData)
    return (
      <div className={spinnerBgWrapperVariants()}>
        <SpinnerWrapper>
          <Spinner scale={2} color="green" />
        </SpinnerWrapper>
      </div>
    )

  return orderError ? (
    <OrderFailError show={show} setOrderError={setOrderError} />
  ) : (
    <div className={wrapperVariants()}>
      <div className={contentContainerVariants()}>
        {hasOrdered ? (
          <>
            <div className={dataSectionWrapperVariants()} style={{ justifyContent: 'center', alignItems: 'center', padding: 32, marginTop: 0 }}>
              <Text style={{ margin: '0 0 16px', fontWeight: 'bold', fontSize: 24, lineHeight: '32px', textAlign: 'center' }}>{t('QUOTATIONS.confirmationHeader')}</Text>
              <LargeCheckmark />
              {emailAndPhone?.email !== email ? (
                <Text spacing="none" style={{ marginTop: '16px', fontSize: '18px', paddingTop: 4, fontWeight: 400, color: 'var(--fs-colors-secondaryDark)', textAlign: 'center' }}>
                  {t('QUOTATIONS.quotationIsSentToIn5Minutes', { email: emailAndPhone?.email })}
                </Text>
              ) : (
                <Text spacing="none" style={{ marginTop: '16px', fontSize: '18px', paddingTop: 4, fontWeight: 400, color: 'var(--fs-colors-secondaryDark)', textAlign: 'center' }}>
                  {t('QUOTATIONS.quotationIsSentTo')}
                </Text>
              )}
              {emailAndPhone?.email === email && (
                <Text spacing="none" style={{ fontSize: '18px', paddingTop: 4, fontWeight: 400, color: 'var(--fs-colors-secondaryDark)' }}>
                  {emailAndPhone?.email}
                </Text>
              )}
              <Text variant="larger" style={{ margin: '32px 0 0 0' }}>
                {t('QUOTATIONS.confirmationSubtitle')}
              </Text>
              <Text spacing="none" style={{ fontSize: '18px', paddingTop: 4, fontWeight: 400, textAlign: 'center', color: 'var(--fs-colors-secondaryDark)' }}>
                {isWorkingHours() ? t('QUOTATIONS.confirmationSecondSubtitle') : t('QUOTATIONS.confirmationSecondSubtitleOutsideWorkingHours')}
              </Text>
            </div>
            <div className={continueButtonWrapperVariants()}>
              <Button onClick={() => router.push(toDemoPath('/app/movepage'))} largerArrowRight text={t('common:backToMovepage')} padding="8px 16px !important" />
            </div>
          </>
        ) : (
          <>
            <Flex style={{ paddingBottom: 0, justifyContent: 'space-between', width: '100%' }}>
              {currentStep > 1 && (
                <div className={closeButtonWrapperVariants()} onClick={() => setCurrentStep(currentStep - 1)}>
                  <BackButtonDefault className="default" />
                  <BackButtonHover className="hover" />
                </div>
              )}
              <Text spacing="none" style={{ fontSize: isTabletPortraitOrGreater ? 32 : 24, lineHeight: '32px', margin: '0 auto', fontWeight: 'bold' }}>
                {type === 'movehelpAndmoveclean' ? t('QUOTATIONS.movehelpAndCleaning') : t('pageTitle')}
              </Text>
              <div className={closeButtonWrapperVariants()} onClick={() => onCloseButtonClick()}>
                <CloseButtonDefault className="default" />
                <CloseButtonHover className="hover" />
              </div>
            </Flex>
            {currentStep === 1 && (
              <Flex
                alignItems="center"
                direction="column"
                style={{
                  width: '100%',
                  gap: 16,
                  border: '1px solid rgba(33, 71, 102, 0.20)',
                  padding: isTabletPortraitOrGreater ? '12px 16px' : 16,
                  borderRadius: 12,
                  marginTop: 32,
                  height: 'max-content',
                }}
              >
                <Flex alignItems="center" justifyContent="start">
                  <div style={{ borderRadius: '50%', border: '1px solid #bfbfbf', width: 40, minWidth: 40, height: 40, overflow: 'hidden' }}>
                    <ImageKit src={`/Marketing/site_images/${assignedMcAdmin?.id}.jpg`} alt="Moving Coordinator" width={40} height={40} />
                  </div>
                  <Flex direction="column" className="w-auto pl-3">
                    <Text spacing="none">{t('QUOTATIONS.answerQuestions')}</Text>
                    <Text spacing="none">{t('QUOTATIONS.answerQuestions3Minutes')}</Text>
                  </Flex>
                </Flex>
              </Flex>
            )}
            <Flex style={{ width: '100%', marginTop: 32 }} justifyContent="space-between">
              <Text variant="bodyLarge" style={{ color: '#767678' }} spacing="none">
                <>{currentStep === 1 && <>{t('QUOTATIONS.movingFrom')}</>}</>
                <>{currentStep === 2 && <>{t('QUOTATIONS.movingTo')}</>}</>
                <>{currentStep === 3 && <>{t('QUOTATIONS.details')}</>}</>
                <>{currentStep === 4 && <>{t('QUOTATIONS.contact').toUpperCase()}</>}</>
              </Text>
              <Text variant="bodyLarge" style={{ color: '#767678' }} spacing="none">
                {t('QUOTATIONS.step', { step: currentStep })}
              </Text>
            </Flex>
            {currentStep === 1 && <FromSection setCurrentStep={setCurrentStep} currentStep={currentStep} />}
            {currentStep === 2 && <ToSection setCurrentStep={setCurrentStep} currentStep={currentStep} />}
            {currentStep === 3 && (
              <DetailsSection
                setCurrentStep={setCurrentStep}
                currentStep={currentStep}
                isMovehelp={type === MoveService.MOVEHELP}
                isMovehelpAndMoveclean={type === 'movehelpAndmoveclean'}
              />
            )}
            {currentStep === 4 && <AddonsSection isMovehelpAndMoveclean={type === 'movehelpAndmoveclean'} />}
          </>
        )}
      </div>
    </div>
  )
}

export default RequestQuotation
