import { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx'
import { format } from 'date-fns'
import en from 'date-fns/locale/en-GB'
import sv from 'date-fns/locale/sv'
import { useElectricityProvider } from '@/common/context/electricity/electricityContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import Input from '@/components/atoms/Input'
import Text from '@/components/atoms/Text'
import PencilSimple from '@/public/images/PencilSimple.svg'
import { ToAddress } from '@/components/organisms/AddressForm'
import { UpdatedMoveValues, CancelOldContractFromAddress } from '@/templates/Electricity/types'
import { ElectricityValues } from '@/templates/Electricity/types'
import { FromAddress } from '@/components/organisms/AddressForm'
import { ContactDetailsForm } from '@/components/molecules/ContactDetailsForm'

interface Props {
  formMethods: UseFormReturn<{ phone: string; email: string }>
  formFullWidth?: boolean
  showAddressInput: boolean
  setShowAddressInput: (show: boolean) => void
  showContactInput: boolean
  setShowContactInput: (show: boolean) => void
}

export const BookingDetails = ({ formMethods, formFullWidth, showAddressInput, setShowAddressInput, setShowContactInput, showContactInput }: Props) => {
  const { t, i18n } = useTranslation(['common', 'electricity'])
  const {
    currentProvider,
    facilityId,
    apartmentNumber: selectedApartmentNumber,
    setApartmentNumber,
    cancelOldContract,
    cancelOldContractDate,
    startDate,
    setFacilityId,
  } = useElectricityProvider()
  const {
    user: { currentMove },
    user: {
      currentMove: {
        toAddress: { street: toStreet, zip: toZip, city: toCity },
        fromAddress,
        residenceSize,
        residenceType,
        apartmentType,
      },
      hasFetchedData,
    },
    updateCurrentToAddress,
    updateCurrentFromAddress,
  } = useUserContext()

  const [cancelOldContractFromData, setCancelOldContractFromData] = useState<CancelOldContractFromAddress>({
    street: '',
    zip: '',
    city: '',
  })

  const [data, setData] = useState<ElectricityValues>({
    facilityId: '',
    toAddress: {
      street: '',
      zip: '',
      city: '',
      residenceSize: Number(residenceSize) ?? 0,
      residenceType: residenceType,
      apartmentNumber: selectedApartmentNumber?.toString(),
      apartmentType: apartmentType ?? '',
    },
  })

  useEffect(() => {
    if (hasFetchedData) {
      setData({
        facilityId: facilityId,
        toAddress: {
          street: toStreet,
          zip: toZip,
          city: toCity,
          residenceSize: Number(residenceSize) ?? 0,
          residenceType: residenceType,
          apartmentNumber: selectedApartmentNumber?.toString() ?? null,
          apartmentType: apartmentType ?? '',
        },
      })
      if (cancelOldContract) {
        setCancelOldContractFromData({
          street: fromAddress?.street ?? '',
          zip: fromAddress?.zip ?? '',
          city: fromAddress?.city ?? '',
        })
      }
    }
  }, [hasFetchedData])

  const handleSave = async () => {
    if (cancelOldContract) {
      await updateCurrentFromAddress({ ...cancelOldContractFromData })
    }
    const response = await updateCurrentToAddress({
      ...data.toAddress,
      apartmentType,
      residenceType,
      residenceSize,
      apartmentNumber: selectedApartmentNumber?.toString()?.length ? selectedApartmentNumber?.toString() : null,
    })
    if (response?.id) {
      setShowAddressInput(false)
    }
  }

  const getFacilityIdError = () => {
    if (facilityId.length > 0 && facilityId.length !== 0 && !facilityId.startsWith('735999')) {
      return t('electricity:STEP3DETAILS.facilityIdError')
    }
    if (facilityId.startsWith('735999') && facilityId.length < 18) {
      return t('electricity:STEP3DETAILS.facilityIdLengthError')
    } else return undefined
  }

  const monthlyFee = Math.max(Number(currentProvider?.subscriptionFee ?? 0) - Number(currentProvider?.subscriptionFeeDiscount ?? 0), 0)
  const hasMonthlyFeeDiscount = Number(currentProvider?.subscriptionFeeDiscount ?? 0) > 0 && Number(currentProvider?.discountPeriod ?? 0) > 0

  return (
    <>
      <div className={clsx('w-full h-full relative', showAddressInput ? 'max-w-[400px]' : 'max-w-full')}>
        <div className="flex flex-row items-center font-bold leading-[25px] text-left justify-start text-[var(--color-text-main)] pb-4">
          <h2 className="h-[18px] font-bold text-xl leading-[18px] flex items-center text-center font-feature-settings-[pnum_on,lnum_on] text-[var(--color-text-main)] flex-none order-0 flex-grow-0 m-0">
            {t('orderDetails')}
          </h2>
        </div>
        {!showAddressInput && (
          <div className="absolute right-0 top-0 text-[var(--color-primary-main)] cursor-pointer" onClick={() => setShowAddressInput(!showAddressInput)}>
            <PencilSimple />
          </div>
        )}
        <div className="pb-4 flex flex-col items-start">
          <Text spacing="none" className="!text-[16px] !font-bold pb-1">
            {t('electricity:pageTitle')}
          </Text>
          <Text spacing="none" className="!text-[16px] pb-1">
            {t(`electricity:STEP3DETAILS.PROVIDERS.${currentProvider?.provider}`)}
          </Text>
          <dl className="grid grid-cols-[auto,1fr] gap-x-3 gap-y-1 text-[16px]">
            <dt className="font-bold">{t('electricity:STEP3DETAILS.agreementType')}</dt>
            <dd>{t('electricity:STEP3DETAILS.variablePriceAgreement')}</dd>
            <dt className="font-bold">{t('electricity:STEP3DETAILS.monthlyFee')}</dt>
            <dd>
              {hasMonthlyFeeDiscount
                ? t('electricity:STEP3DETAILS.discountedMonthlyFee', {
                    price: monthlyFee,
                    months: currentProvider?.discountPeriod,
                    regularPrice: currentProvider?.subscriptionFee,
                  })
                : t('electricity:STEP3DETAILS.regularMonthlyFee', { price: monthlyFee })}
            </dd>
            <dt className="font-bold">{t('electricity:STEP3DETAILS.bindingTime')}</dt>
            <dd>{t('electricity:STEP3DETAILS.noBindingTime')}</dd>
            <dt className="font-bold">{t('electricity:STEP3DETAILS.spotPrice')}</dt>
            <dd>{t('electricity:STEP3DETAILS.variableSpotPrice')}</dd>
          </dl>
        </div>
        {currentMove?.toAddress && (
          <>
            {showAddressInput ? (
              <>
                <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                  {cancelOldContract ? t('electricity:STEP3DETAILS.addressNewContract') : t('common:COMMONADDRESS.address')}
                </Text>
                <ToAddress
                  setData={(moveData: UpdatedMoveValues) =>
                    setData({
                      facilityId: facilityId,
                      toAddress: {
                        street: moveData?.toAddress?.street ?? '',
                        zip: moveData?.toAddress?.zip ?? '',
                        city: moveData?.toAddress?.city ?? '',
                        apartmentNumber: selectedApartmentNumber?.toString() ?? null,
                        residenceSize: moveData?.toAddress?.residenceSize ?? 0,
                        residenceType: moveData?.toAddress?.residenceType ?? '',
                        apartmentType: moveData?.toAddress?.apartmentType ?? '',
                      },
                    })
                  }
                  moveData={data}
                />
              </>
            ) : (
              <div className="pb-4 flex flex-col items-start">
                <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                  {cancelOldContract ? t('electricity:STEP3DETAILS.addressNewContract') : t('common:COMMONADDRESS.address')}
                </Text>
                <Text spacing="none" className=" pb-1 !text-[16px]">{`${currentMove?.toAddress?.street}, ${currentMove?.toAddress?.zip} ${currentMove?.toAddress.city}`}</Text>
              </div>
            )}
          </>
        )}
        {currentMove?.fromAddress && cancelOldContract && (
          <>
            {showAddressInput ? (
              <>
                <Text className="!font-bold" spacing="none">
                  {t('electricity:STEP3DETAILS.addressOldContract')}
                </Text>
                <FromAddress
                  moveData={{ fromAddress: { ...cancelOldContractFromData } }}
                  withoutPadding
                  setData={(moveData: UpdatedMoveValues) =>
                    setCancelOldContractFromData({
                      street: moveData.fromAddress?.street ?? '',
                      zip: moveData.fromAddress?.zip ?? '',
                      city: moveData.fromAddress?.city ?? '',
                    })
                  }
                />
              </>
            ) : (
              <div className="pb-4 flex flex-col items-start">
                <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                  {t('electricity:STEP3DETAILS.addressOldContract')}
                </Text>
                <Text spacing="none" className="!text-[16px] pb-1">{`${currentMove?.fromAddress?.street}, ${currentMove?.fromAddress?.zip} ${currentMove?.fromAddress.city}`}</Text>
              </div>
            )}
          </>
        )}
        <>
          {selectedApartmentNumber && (
            <>
              {showAddressInput ? (
                <>
                  <Text className="!text-[16px] !font-bold pb-1 m-0 mb-4">{t('common:apartmentNumber')}</Text>
                  <Input
                    type="numberWithValidation"
                    maxLength={4}
                    placeholder="XXXX"
                    style={{ marginBottom: 16 }}
                    error={
                      (selectedApartmentNumber.toString().length > 0 && selectedApartmentNumber.toString().length < 4) ||
                      (!Number(selectedApartmentNumber) && selectedApartmentNumber.toString().length !== 0)
                        ? t('STEP3DETAILS.aptNumberError')
                        : undefined
                    }
                    label={t('electricity:STEP3DETAILS.addApartmentNumber')}
                    onChange={(event) => {
                      setApartmentNumber(event.currentTarget.value)
                    }}
                    value={selectedApartmentNumber}
                  />
                </>
              ) : (
                <div className="pb-4 flex flex-col items-start">
                  <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                    {t('common:apartmentNumber')}
                  </Text>
                  <Text spacing="none" className="!text-[16px] pb-1">
                    {selectedApartmentNumber}
                  </Text>
                </div>
              )}
            </>
          )}
        </>
        {facilityId && (
          <>
            {showAddressInput ? (
              <>
                <Text className="!text-[16px] !font-bold pb-1 mb-4" spacing="none">
                  {t('electricity:STEP3DETAILS.addFacilityId')}
                </Text>
                <Input
                  value={facilityId}
                  type="numberWithValidation"
                  maxLength={18}
                  placeholder="735999XXXXXXXXXX"
                  error={getFacilityIdError()}
                  label={t('electricity:STEP3DETAILS.addFacilityId')}
                  alwaysActiveLabel={true}
                  onChange={(event) => setFacilityId(event.currentTarget.value)}
                />
              </>
            ) : (
              <div className="pb-4 flex flex-col items-start">
                <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                  {t('electricity:STEP3DETAILS.addFacilityId')}
                </Text>
                <Text spacing="none" className="!text-[16px] pb-1">
                  {facilityId}
                </Text>
              </div>
            )}
          </>
        )}
        {startDate && (
          <>
            {showAddressInput ? (
              <></>
            ) : (
              <>
                <div className="flex flex-col items-start">
                  <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                    {t(cancelOldContract ? 'electricity:STEP3DETAILS.startingDateNewContract' : 'electricity:CONFIRMATIONPAGE.startingDate')}
                  </Text>
                  {startDate && (
                    <Text spacing="none" className="text-[var(--fs-fontSizes-5)] !important pb-1">
                      {' '}
                      {format(new Date(startDate), 'dd MMMM yyyy', { locale: i18n.language === 'sv' ? sv : en })}
                    </Text>
                  )}
                </div>
                {cancelOldContract && (
                  <div className="mt-4 flex flex-col items-start">
                    <Text spacing="none" className="!text-[16px] !font-bold pb-1">
                      {t('electricity:STEP3DETAILS.finishDateOldContract')}
                    </Text>
                    {cancelOldContract && (
                      <Text spacing="none" className="text-[var(--fs-fontSizes-5)] !important pb-1">
                        {format(new Date(cancelOldContractDate), 'dd MMMM yyyy', { locale: i18n.language === 'sv' ? sv : en })}
                      </Text>
                    )}
                  </div>
                )}
              </>
            )}
          </>
        )}
        {showAddressInput && (
          <Flex direction="row" justifyContent="space-between" alignItems="center" style={{ marginTop: '16px' }}>
            <div className="w-full h-12 mt-[10px] mr-auto md:w-[200px]">
              <Button
                type="submit"
                padding="8px 64px"
                text={t('common:INFOMISSING.save')}
                onClick={async (event) => {
                  event.preventDefault()
                  await handleSave()
                }}
              />
            </div>
          </Flex>
        )}
      </div>
      <ContactDetailsForm
        formMethods={formMethods}
        formFullWidth={formFullWidth}
        showContactInput={showContactInput}
        setShowContactInput={setShowContactInput}
        buttonPadding="8px 64px"
      />
    </>
  )
}
