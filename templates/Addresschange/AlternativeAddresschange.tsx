import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChecklistItem } from 'types/checklist'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import Button from '@/components/atoms/Button'
import Checkmark from '@/components/atoms/Icons/Checkmark'
import Text from '@/components/atoms/Text'
import { ORDER_TYPE_ADDRESSCHANGE } from '@/constants/order'
import { buttonWrapperVariants, innerWrapperVariants, stepTemplateWrapperVariants } from './AddresschangePage.variants'
import { toDemoPath } from '@/common/utils/demoNavigation'

const AlternativeAddresschange = () => {
  const { t } = useTranslation(['addresschange', 'common'])
  const { skipChecklistItem, activitiesList } = useChecklistContext()
  const [checklistObj, setChecklistObj] = useState<ChecklistItem>()
  const router = useRouter()
  const markAddressChangeAsDone = () => {
    try {
      skipChecklistItem(ORDER_TYPE_ADDRESSCHANGE, checklistObj?.id || '', checklistObj?.status !== 'not_started')
      router.push(toDemoPath('/app/movepage'))
    } catch (error: unknown) {
      console.error(error)
    }
  }

  useEffect(() => {
    setChecklistObj(activitiesList.find((item) => item.type === ORDER_TYPE_ADDRESSCHANGE))
  }, [activitiesList])

  return (
    <div className={stepTemplateWrapperVariants()}>
      <div className={innerWrapperVariants()}>
        <Text style={{ marginTop: 0 }} variant={'bodyBold'}>
          {t('addresschange:MANUAL.subTitle1')}
        </Text>
        <Text style={{ marginTop: 0 }} variant={'body'}>
          {t('addresschange:MANUAL.text1')}
        </Text>
        <Text style={{ marginTop: 0 }} variant={'bodyBold'}>
          {t('addresschange:MANUAL.subTitle2')}
        </Text>
        <Text style={{ marginTop: 0 }} variant={'body'}>
          {t('addresschange:MANUAL.text2')}
        </Text>
        <Text style={{ marginTop: 0 }}>
          <Link href={'https://skatteverket.se/privat/folkbokforing/flyttanmalan'} className="!text-[var(--color-primary-main)] !font-bold" target="_blank">
            {t('addresschange:MANUAL.linkText')}
          </Link>
        </Text>
        <div className={buttonWrapperVariants({ justifyContent: 'between' })}>
          <Button onClick={() => markAddressChangeAsDone()} padding="10px 20px" text={t('common:markAsDone')} iconRight={<Checkmark />} iconColor="white" />
        </div>
      </div>
    </div>
  )
}

export default AlternativeAddresschange
