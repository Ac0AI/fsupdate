import { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLeadContext } from '@/common/context/lead/LeadProvider'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import Text from '@/components/atoms/Text'
import CommonAddressFormI18N from '@/components/organisms/CommonAddressFormI18N'
import ArrowRight from '@/public/images/ArrowRight_white.svg'
import PencilSimple from '@/public/images/PencilSimple.svg'
import { createAddressSchema } from './OnboardingForm.schema'
import {
  buttonWrapperVariants,
  styledToAddressSectionVariants,
  toAddressWrapperVariants,
  confirmButtonWrapperVariants,
  penWrapperVariants,
  addressSectionHeaderTextVariants,
  noNewAddressVariants,
  formContainerVariants,
  buttonRowVariants,
  buttonGroupVariants,
} from './OnboardingForm.variants'

interface OnboardingFormAddressProps {
  leadAddress: LeadAddressData
  onSubmitCallback: (address: Record<string, string>) => void
  setCurrentStep: (step: number) => void
  setFullHeight: (fullHeight: boolean) => void
}

export const OnboardingFormAddress = ({
  leadAddress,
  onSubmitCallback,
  setCurrentStep,
  setFullHeight,
}: OnboardingFormAddressProps) => {
  const { t } = useTranslation(['movePage', 'common', 'error'])
  const { leadAddressData, setLeadAddressData, setWithoutNewAddress } = useLeadContext()

  const [showInputs, setShowInputs] = useState(false)

  const currentMove = {
    toAddress: {
      street: leadAddress.toStreet,
      zip: leadAddress.toZip,
      city: leadAddress.toCity,
    },
  }

  const hasToAddress = Boolean(
    currentMove.toAddress?.street?.length && currentMove.toAddress?.zip?.length && currentMove.toAddress?.city?.length
  )

  const schema = createAddressSchema(t)

  const methods = useForm<FormValuesOnboarding>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      showToAddressInput: !hasToAddress,
      hasNewToAddress: true,
      autoCompleteAddress: currentMove.toAddress?.street,
      street: currentMove.toAddress?.street || '',
      zip: currentMove.toAddress?.zip || '',
      city: currentMove.toAddress?.city || '',
    },
  })

  const {
    handleSubmit,
    formState: { errors, dirtyFields },
  } = methods

  const handleAddressSubmit = handleSubmit((data: FormValuesOnboarding) => {
    const street = `${data.street || ''} ${data.streetNumber || ''}`.trim()
    setLeadAddressData({ ...leadAddressData, toStreet: street, toCity: data.city, toZip: data.zip })
    setWithoutNewAddress(false)
    onSubmitCallback({ street, city: data.city, zip: data.zip })
    setShowInputs(false)
    setFullHeight(false)
  })

  const handleNoNewAddress = () => {
    setWithoutNewAddress(true)
    setCurrentStep(2)
  }

  const handleContinue = () => {
    setWithoutNewAddress(false)
    setCurrentStep(2)
  }

  const handleShowInputs = () => {
    setShowInputs(true)
    setFullHeight(true)
  }

  const handleHideInputs = () => {
    setShowInputs(false)
    setFullHeight(false)
  }

  const canSaveAddress = Boolean(dirtyFields.autoCompleteAddress) && Object.keys(errors).length === 0

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  return (
    <FormProvider {...methods}>
      <form onKeyDown={handleKeyDown} className={formContainerVariants()}>
        {/* No address yet - adding it is the primary action */}
        {!hasToAddress && !showInputs && (
          <div className={styledToAddressSectionVariants({ isFirstStep: true })}>
            <Flex direction="column" alignItems="center" justifyContent="center">
              <div className={confirmButtonWrapperVariants()}>
                <Button text={t('ONBOARDINGMODAL.newAddress')} onClick={handleShowInputs} />
              </div>
              <Text className={noNewAddressVariants()} onClick={handleNoNewAddress} spacing="none">
                {t('ONBOARDINGMODAL.noNewAddress')}
              </Text>
            </Flex>
          </div>
        )}

        {/* Address input form */}
        {showInputs && (
          <div className={styledToAddressSectionVariants({ isFirstStep: true })}>
            <div className={toAddressWrapperVariants()}>
              <CommonAddressFormI18N />
            </div>
          </div>
        )}

        {/* Address display */}
        {hasToAddress && !showInputs && (
          <div className={styledToAddressSectionVariants({ isFirstStep: true })}>
            <div className={penWrapperVariants()} onClick={handleShowInputs}>
              <PencilSimple />
              <Text variant="bodyBold" spacing="none">
                {t('ONBOARDINGMODAL.change')}
              </Text>
            </div>
            <Flex direction="column" alignItems="center" justifyContent="center" className="gap-3">
              <Text className={addressSectionHeaderTextVariants()} spacing="none">
                {currentMove.toAddress.street}
              </Text>
              <Text className="mt-0.5" spacing="none">
                {currentMove.toAddress.zip}, {currentMove.toAddress.city}
              </Text>
            </Flex>
          </div>
        )}

        {/* Action buttons */}
        {(showInputs || hasToAddress) && (
          <div className={buttonRowVariants()}>
            {showInputs ? (
              <div className={buttonGroupVariants()}>
                <div className={buttonWrapperVariants()}>
                  <Button text={t('ONBOARDINGMODAL.abort')} variant="ghost" withFullWidth onClick={handleHideInputs} />
                </div>
                <div className={buttonWrapperVariants()}>
                  <Button text={t('ONBOARDINGMODAL.save')} disabled={!canSaveAddress} onClick={handleAddressSubmit} withFullWidth />
                </div>
              </div>
            ) : (
              <div className={confirmButtonWrapperVariants()}>
                <Button
                  text={t('ONBOARDINGMODAL.continueStep')}
                  onClick={handleContinue}
                  largerArrowRight
                  iconRight={<ArrowRight color="white" />}
                />
              </div>
            )}
          </div>
        )}
      </form>
    </FormProvider>
  )
}
