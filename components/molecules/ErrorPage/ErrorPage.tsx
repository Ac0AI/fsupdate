'use client'

import React from 'react'
import { useTranslation } from 'react-i18next'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { BirdError } from '@/components/atoms/BirdError'
import Button from '@/components/atoms/Button'
import Text from '@/components/atoms/Text'
import { failedWrapperVariants, innerWrapperVariants, subButtonWrapperVariants, subLargeButtonWrapperVariants } from './ErrorPage.variants'
import { toDemoPath } from '@/common/utils/demoNavigation'


export interface ErrorPageProps {
  title: string
  subTitleOne: string
  subTitleTwo: string
  withInternalSubs?: boolean
  withTryAgainButton?: boolean
  withRouterReload?: boolean
  reset?: () => void
}

const ErrorPage = ({ title, subTitleOne, subTitleTwo, withTryAgainButton, withRouterReload, reset, withInternalSubs }: ErrorPageProps) => {
  const { t } = useTranslation(['common', 'error'])
  const router = useRouter()

  const handleTryAgain = () => {
    if (withRouterReload) {
      router.refresh()
    } else if (withTryAgainButton && !withRouterReload) {
      router.push(toDemoPath('/app/movehelp?step=1'))
    } else router.push(toDemoPath('/app/movepage'))
  }

  return (
    <div className={failedWrapperVariants()}>
      <BirdError />
      <div className={clsx(innerWrapperVariants(), '[&_a]:text-primary-main [&_a]:font-bold')}>
        <Text className="mb-5 !text-2xl !font-[var(--font-weight-bolder)]">{t(`${withInternalSubs ? 'error:errorPage' : title}`)}</Text>
        <Text className="mb-5 text-base text-center" variant="body">
          {t(`${withInternalSubs ? 'error:errorPageSubTitle' : subTitleOne}`)}
        </Text>
        <Text className="mb-10 text-base text-center" variant="body">
          {t(`${withInternalSubs ? 'error:clickHere' : subTitleTwo}`)}
        </Text>
        <div className={subButtonWrapperVariants()}>
          <div className={subLargeButtonWrapperVariants()}>
            <Button
              variant="primary"
              padding="8px 32px !important"
              text={t(`common:${withTryAgainButton ? 'tryAgain' : 'toMovepage'}`)}
              onClick={() => {
                if (reset) {
                  reset()
                }
                handleTryAgain()
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
