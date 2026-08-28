import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Skeleton from 'react-loading-skeleton'
import { useIntercom } from 'react-use-intercom'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import loadSuppliersOptions from '@/common/api/getInsuranceSuppliers'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import { SourceSystemEnum } from '@/common/enums/SourceSystemEnum'
import { ThemeEnum } from '@/common/enums/ThemeEnum'
import useResponsive from '@/common/hooks/useResponsive'
import { ActivityEnum } from '@/common/types/activity'
import ArrowForward from '@/components/atoms/ArrowForward'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import ServiceFlowHeader from '@/components/atoms/ServiceFlowHeader'
import Spinner, { SpinnerWrapper } from '@/components/atoms/Spinner'
import Text from '@/components/atoms/Text'
import ServiceAlreadyBooked from '@/components/molecules/ServiceAlreadyBooked'
import { ORDER_TYPE_INSURANCE } from '@/constants/order'
import {
  wrapperVariants,
  spinnerBgWrapperVariants,
  headerTextBlueVariants,
  headerTextGreenVariants,
  topHeaderTextWrapperVariants,
  textWrapperVariants,
  buttonsWrapperVariants,
  imageWrapperVariants,
  largeButtonWrapperVariants,
  goBackButtonVariants,
  serviceFlowStepOneTemplateWrapperVariants,
  innerWrapperVariants,
} from './Insurance.variants'
import SupplierSection from './SupplierSection'
import { toDemoPath } from '@/common/utils/demoNavigation'

interface ElectricityPageProps {
  isExternalModule?: boolean
}

export const InsurancePage = ({ isExternalModule }: ElectricityPageProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const {
    user: {
      profile: { leadDetails },
    },
  } = useUserContext()
  const { trackEvent } = useIntercom()
  const { isTabletPortraitOrGreater } = useResponsive()
  const { setNewTheme, iconSet, hasSetTheme } = useThemeContext()
  const { skipChecklistItem, activitiesList, isChecklistItemOrderedOrSkipped } = useChecklistContext()
  const [allSuppliers, setAllSuppliers] = useState<InsuranceSupplier[] | []>([])
  const { push } = useRouter()

  const themeQuery = useSearchParams().get('theme')
  const { t } = useTranslation(['insurance', 'common'])
  const [isInsuranceLockedOrCompleted, setIsInsuranceLockedOrCompleted] = useState(false)

  useEffect(() => {
    const getSuppliers = async () => {
      const suppliers = await loadSuppliersOptions()
      if (suppliers?.length) {
        setAllSuppliers(suppliers)
      }
    }
    if (!allSuppliers.length) getSuppliers()
  }, [allSuppliers])

  useEffect(() => {
    if (activitiesList?.length) {
      const insuranceItem = isChecklistItemOrderedOrSkipped(ActivityEnum.INSURANCE)
      if (insuranceItem) {
        setIsInsuranceLockedOrCompleted(true)
      } else {
        trackEvent('insurance_landing')
      }
      setIsLoading(false)
    }
  }, [activitiesList])

  const markAsDone = () => {
    try {
      const checklistObj = activitiesList.find((item) => item.type === ActivityEnum.INSURANCE)
      skipChecklistItem(ORDER_TYPE_INSURANCE, checklistObj?.id || '', checklistObj?.status !== 'not_started')
      push(toDemoPath('/app/movepage'))
    } catch (error: unknown) {
      console.error(error)
    }
  }

  useEffect(() => {
    if (themeQuery === ThemeEnum.FASTIGHETSBYRAN) {
      setNewTheme(ThemeEnum.FASTIGHETSBYRAN)
    }
  }, [themeQuery, setNewTheme])

  if (isLoading || !hasSetTheme)
    return (
      <div className={spinnerBgWrapperVariants()}>
        {isExternalModule ? (
          <Skeleton style={{ height: '100vh', lineHeight: 'unset' }} />
        ) : (
          <SpinnerWrapper>
            <Spinner scale={2} color="green" />
          </SpinnerWrapper>
        )}
      </div>
    )

  return (
    <div className={wrapperVariants()}>
      {isInsuranceLockedOrCompleted ? (
        <ServiceAlreadyBooked />
      ) : (
        <>
          <ServiceFlowHeader imageUrl={iconSet.INSURANCE} isExternalModule={isExternalModule} text={t('homeInsurance')} />
          <div className={serviceFlowStepOneTemplateWrapperVariants()} data-testid="service-flow-step-one-template-container">
            <div className={innerWrapperVariants()}>
              {iconSet.HOUSE && (
                <div className={imageWrapperVariants()}>
                  <Image src={iconSet.HOUSE_LARGE} alt="" width={isTabletPortraitOrGreater ? 190 : 98} height={isTabletPortraitOrGreater ? 190 : 48} />
                </div>
              )}
              {!leadDetails?.sourceSystem?.toLowerCase()?.includes(SourceSystemEnum.FASTIGHETSBYRAN) &&
              !leadDetails?.brokerOfficeName?.toLowerCase().includes(SourceSystemEnum.NOTAR) &&
              !leadDetails?.brokerOfficeName?.toLowerCase().includes(SourceSystemEnum.LANSFORSAKRINGAR) ? (
                <Flex justifyContent="start" direction="column">
                  <div className={topHeaderTextWrapperVariants()}>
                    <span className={headerTextBlueVariants()}>{t('insure')}</span>
                    <span className={headerTextGreenVariants()}>{t('yourHome')}</span>
                  </div>
                  <div className={textWrapperVariants()}>
                    <Text className="mt-4" variant="body">
                      {t('introductionTextTop')}
                    </Text>
                    <Text spacing="top" className="mt-4" variant="body">
                      {t('weWillHelp')}
                    </Text>
                    <div style={{ borderBottom: '1px solid var(--fs-colors-inactiveMain', width: '100%', margin: '32px 0 12px' }} />
                    <Flex className="mb-4" alignItems="end" style={{ gap: 16, width: '100%' }}>
                      <div
                        style={{
                          width: isTabletPortraitOrGreater ? 160 : 140,
                          height: isTabletPortraitOrGreater ? 46 : 40,
                          position: 'relative',
                          marginTop: 16,
                        }}
                      >
                        <Image src="/images/hedvig_logotype_black.png" alt="Hedvig logo" fill objectFit="contain" style={{ marginLeft: 0 }} />
                      </div>
                    </Flex>
                    <Text spacing="top" variant="body">
                      {t('hedvigInsurance')}
                    </Text>

                    <Text className="!mb-4" spacing="none" variant="body">
                      {t('withoutBindingTime')}
                    </Text>
                    <Text className="mb-4" spacing="top" variant="body">
                      {t('exclusiveOffer')}
                    </Text>
                    <Text style={{ color: 'var(--fs-colors-primaryMain) !important', fontWeight: 'bolder' }}>{t('firstMonthFree')}</Text>
                    <Flex style={{ marginTop: 16, maxWidth: isTabletPortraitOrGreater ? 'fit-content' : '100%' }}>
                      <Button
                        iconRight={<ArrowForward color="#ffffff" />}
                        padding="8px 32px"
                        withFullWidth
                        text={t('viewYourPrice')}
                        onClick={() => window.open('https://www.hedvig.com/se/partner/flyttsmart', '_blank')}
                      />
                    </Flex>
                    <div style={{ borderBottom: '1px solid var(--fs-colors-inactiveMain', width: '100%', margin: '32px 0 0px' }} />
                    <Flex style={{ padding: '26px 0 16px' }}>
                      <span className={headerTextBlueVariants({ small: true })}>{t('keepInsurance')}</span>
                    </Flex>
                    <Text spacing="none" variant="body">
                      {t('bottomText')}
                    </Text>
                  </div>
                </Flex>
              ) : (
                <Flex justifyContent="start" direction="column">
                  <div className={topHeaderTextWrapperVariants()}>
                    <span className={headerTextBlueVariants()}>{t('insure')}</span>
                    <span className={headerTextGreenVariants()}>{t('home')}</span>
                  </div>
                  <div className={textWrapperVariants()}>
                    <Text variant="body">{t('introductionTextTop')}</Text>
                    <Text spacing="top" variant="body">
                      {t('introductionTextBottom')}
                    </Text>
                  </div>
                </Flex>
              )}
              <SupplierSection />
              <Flex className={buttonsWrapperVariants()} justifyContent="space-between" alignItems="end">
                <div className={goBackButtonVariants()} style={{ height: 'unset' }} onClick={() => push(toDemoPath('/app/movepage'))}>
                  {
                    <Text spacing="none" variant="linkBig">
                      {t('common:goBack')}
                    </Text>
                  }
                </div>
                <div className={largeButtonWrapperVariants()}>
                  <Button padding="10px 32px" text={t('common:markAsDone')} onClick={() => markAsDone()} />
                </div>
              </Flex>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default InsurancePage
