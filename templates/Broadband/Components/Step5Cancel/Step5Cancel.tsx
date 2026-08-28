import React, { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InnerHTML from 'dangerously-set-html-content'
import { useRouter } from 'next/navigation'
import { CancellationOptions, Supplier, getSuppliers } from '@/common/api/suppliers'
import { useBroadbandProvider } from '@/common/context/broadband/broadbandProvider.provider'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { ThemeEnum } from '@/common/enums/ThemeEnum'
import Flex from '@/components/atoms/Flex'
import H3 from '@/components/atoms/H3'
import Text from '@/components/atoms/Text'
import { Autocomplete } from '@/components/molecules/Autocomplete'
import { toDemoPath } from '@/common/utils/demoNavigation'
import {
  cancelWrapperVariants,
  innerWrapperVariants,
  mainWrapperVariants,
  goToFindServiceButtonVariants,
  cancellationOptionsListVariants,
  autocompleteStyledVariants,
} from './Step5Cancel.variants'

const Cancel = () => {
  const { theme } = useThemeContext()
  const [broadbandSuppliers, setBroadbandSuppliers] = useState<Supplier[]>([])
  const [inputValue, setInputValue] = useState('')
  const [broadbandSupplier, setBroadbandSupplier] = useState<Supplier>()
  const { chosenOffer } = useBroadbandProvider()
  const { t } = useTranslation(['broadband', 'common'])
  const { push } = useRouter()

  const fetchSuppliers = async () => {
    const response = await getSuppliers('broadband')
    if (response) setBroadbandSuppliers(response)
  }

  const onClickButton = () => {
    if (theme === ThemeEnum.FASTIGHETSBYRAN) {
      window.top?.postMessage('complete', '*')
    } else push(toDemoPath('/app/movepage'))
  }

  useEffect(() => {
    if (broadbandSuppliers.length === 0) {
      fetchSuppliers()
    }
    if (chosenOffer) {
      setInputValue(chosenOffer.company.replace(chosenOffer.company.charAt(0), chosenOffer.company.charAt(0).toUpperCase()))
      broadbandSuppliers?.forEach((element) => {
        if (element.name === chosenOffer.company.replace(chosenOffer.company.charAt(0), chosenOffer.company.charAt(0).toUpperCase())) {
          setBroadbandSupplier(element)
        }
      })
    }
  }, [broadbandSuppliers])

  const onSelect = useCallback(
    (value: string) => {
      broadbandSuppliers?.forEach((element) => {
        if (element.name === value) {
          setBroadbandSupplier(element)
        }
      })
    },
    [setInputValue, setBroadbandSupplier, broadbandSuppliers],
  )

  const customOnChange = useCallback(
    (onChangeValue: string | undefined) => {
      if (onChangeValue) {
        setInputValue(onChangeValue)
        broadbandSuppliers?.forEach((element) => {
          if (element.name === onChangeValue) {
            setBroadbandSupplier(element)
          }
        })
      } else setInputValue('')
    },
    [setInputValue, setBroadbandSupplier],
  )

  return (
    <div className={cancelWrapperVariants()} data-testid="cancel-container">
      <div className={innerWrapperVariants()}>
        <div className={mainWrapperVariants()}>
          <H3>{t('CANCEL.title')}</H3>
          <div className={autocompleteStyledVariants()}>
            <Autocomplete
              items={broadbandSuppliers
                ?.filter((supplier) => {
                  if (inputValue.length === 0) return supplier
                  else return supplier.name.toLowerCase().includes(inputValue.toLowerCase())
                })
                .map((supplier: Supplier) => ({
                  value: supplier.name,
                  label: supplier.name,
                }))}
              label={t('CANCEL.labelText')}
              onChange={(event) => {
                customOnChange(event)
              }}
              onSelect={onSelect}
              noLastLink
              value={inputValue}
            />
          </div>
          {broadbandSupplier?.cancellationOptions && broadbandSupplier?.cancellationOptions?.length > 0 && (
            <>
              <Text variant="bodyBold" className="pb-2" spacing="top">
                {t('CANCEL.chooseOneOfTheOptions')}
              </Text>
              <ul className="list-disc pl-5">
                {broadbandSupplier?.cancellationOptions?.map((option: CancellationOptions) => (
                  <li key={option.id} className={cancellationOptionsListVariants()}>
                    <InnerHTML html={option.text} />
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
        <Flex direction="row" justifyContent="center" className="mt-10" alignItems="center">
          <div className={goToFindServiceButtonVariants()} onClick={() => onClickButton()}>
            <Text className="pb-1" variant="linkBig">
              {theme === ThemeEnum.FASTIGHETSBYRAN ? t('customCtaText') : t('common:toMovepage')}
            </Text>
          </div>
        </Flex>
      </div>
    </div>
  )
}

export default Cancel
