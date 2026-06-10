import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { yupResolver } from '@hookform/resolvers/yup'
import formatDate from '@/appComponents/format'
import { useLeadContext } from '@/common/context/lead/LeadProvider'
import Button from '@/components/atoms/Button'
import Flex from '@/components/atoms/Flex'
import Text from '@/components/atoms/Text'
import DatePicker from '@/components/organisms/DatePicker'
import ArrowRight from '@/public/images/ArrowRight_white.svg'
import CaretDown from '@/public/images/CaretDown_small.svg'
import { createDatesSchema } from './OnboardingForm.schema'
import {
  styledToAddressSectionVariants,
  confirmButtonWrapperVariants,
  addressSectionHeaderTextVariants,
  noNewAddressVariants,
  formContainerVariants,
  buttonRowVariants,
  datePickerTriggerVariants,
} from './OnboardingForm.variants'

interface DatePickerFieldProps {
  label?: string
  value: Date | undefined
  defaultValue: Date | undefined
  onChange: (date: Date) => void
  placeholder: string
}

const DatePickerField = ({ label, value, defaultValue, onChange, placeholder }: DatePickerFieldProps) => (
  <Flex direction="column" alignItems="center" justifyContent="center" className={label ? 'mt-8' : ''}>
    {label && <Text spacing="none">{label}</Text>}
    <DatePicker
      noSpacing={Boolean(label)}
      defaultValue={defaultValue}
      setDatePicked={(val) => onChange(new Date(val.fullDate))}
      placeholder={placeholder}
      parentDefaultMonth={defaultValue || new Date()}
      parentSelectedDay={value}
      withoutDayInDate
      positionBottom
      customDateComponent={
        <div className={datePickerTriggerVariants()}>
          <Text className={addressSectionHeaderTextVariants()} spacing="none">
            {value ? formatDate(value, 'dd MMMM yyyy') : placeholder}
          </Text>
          <CaretDown className="mt-2" />
        </div>
      }
    />
  </Flex>
)

interface OnboardingFormDatesProps {
  leadAddress: LeadAddressData
  setShowMovingInDate: (arg0: boolean) => void
  showMovingInDate: boolean
}

export const OnboardingFormDates = ({
  leadAddress,
  setShowMovingInDate,
  showMovingInDate,
}: OnboardingFormDatesProps) => {
  const { t } = useTranslation(['movePage', 'common', 'error'])
  const { leadAddressData, setLeadAddressData, setIsLoadingCreateUser, setTriggerCreateUser } = useLeadContext()

  const schema = createDatesSchema()

  const methods = useForm<FormValuesOnboardingDates>({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      movingOutDate: leadAddress.movingOutDate,
      movingInDate: leadAddress.movingOutDate,
    },
  })

  const { watch, setValue, getValues, formState: { defaultValues } } = methods

  const handleSubmit = methods.handleSubmit((data: FormValuesOnboardingDates) => {
    setIsLoadingCreateUser(true)
    setLeadAddressData({
      ...leadAddressData,
      movingOutDate: data.movingOutDate,
      movingInDate: data.movingInDate,
    })
    setTriggerCreateUser(true)
  })

  const handleShowMovingInDate = () => {
    setLeadAddressData({ ...leadAddressData, hasMovingInDate: true })
    setShowMovingInDate(true)
  }

  const handleMovingOutDateChange = (date: Date) => {
    setValue('movingOutDate', date)
    const currentMovingInDate = getValues('movingInDate')
    if (!currentMovingInDate || new Date(currentMovingInDate) < date) {
      setValue('movingInDate', date)
    }
  }

  const handleMovingInDateChange = (date: Date) => {
    const currentMovingOutDate = getValues('movingOutDate')
    setValue('movingInDate', currentMovingOutDate && date < new Date(currentMovingOutDate) ? new Date(currentMovingOutDate) : date)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
    }
  }

  const movingOutDate = getValues('movingOutDate')
  const movingInDate = getValues('movingInDate')
  const defaultMovingOutDate = defaultValues?.movingOutDate ? new Date(defaultValues.movingOutDate) : new Date()

  return (
    <FormProvider {...methods}>
      <form onKeyDown={handleKeyDown} className={formContainerVariants()} onSubmit={handleSubmit}>
        {/* Single date mode */}
        {!showMovingInDate && (
          <div className={styledToAddressSectionVariants()}>
            <Flex direction="column" alignItems="center" justifyContent="center">
              <DatePickerField
                value={watch('movingOutDate') ? new Date(watch('movingOutDate')) : undefined}
                defaultValue={defaultMovingOutDate}
                onChange={handleMovingOutDateChange}
                placeholder={t('external:chooseDate')}
              />
              <Text className={noNewAddressVariants()} onClick={handleShowMovingInDate} spacing="none">
                {t('ONBOARDINGMODAL.twoMovingDates')}
              </Text>
            </Flex>
          </div>
        )}

        {/* Two dates mode */}
        {showMovingInDate && (
          <div className={styledToAddressSectionVariants()}>
            <DatePickerField
              label={t('ONBOARDINGMODAL.movingOutDate')}
              value={movingOutDate ? new Date(movingOutDate) : undefined}
              defaultValue={movingOutDate ? new Date(movingOutDate) : undefined}
              onChange={handleMovingOutDateChange}
              placeholder={t('external:chooseDate')}
            />
            <DatePickerField
              label={t('ONBOARDINGMODAL.movingInDate')}
              value={movingInDate ? new Date(movingInDate) : undefined}
              defaultValue={movingInDate ? new Date(movingInDate) : undefined}
              onChange={handleMovingInDateChange}
              placeholder={t('external:chooseDate')}
            />
          </div>
        )}

        {/* Submit button */}
        <div className={`${buttonRowVariants()} mt-auto`}>
          <div className={confirmButtonWrapperVariants()}>
            <Button
              text={t('ONBOARDINGMODAL.showMyMove')}
              largerArrowRight
              iconRight={<ArrowRight color="white" />}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  )
}
