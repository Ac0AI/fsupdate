import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useIntercom } from 'react-use-intercom'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { sendErrorRequestQuotation } from '@/common/api/requestQuotation'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import { ThemeEnum } from '@/common/enums/ThemeEnum'
import useResponsive from '@/common/hooks/useResponsive'
import Button from '@/components/atoms/Button'
import ExitActivityButton from '@/components/atoms/ExitActivityButton'
import Flex from '@/components/atoms/Flex'
import Text from '@/components/atoms/Text'
import { LONG_DISTANCE_MOVE, RESIDENCE_TOO_BIG } from '@/constants/errorCodes'
import BirdSuccess from '@/public/images/Bird_success.svg'
import Phone from '@/public/images/Phone.svg'
import { toDemoPath } from '@/common/utils/demoNavigation'

export interface ErrorPageProps {
  error: string
  withTryAgainButton?: boolean
  onButtonClick?: () => void
}

const TailoredMoveInPreparation = ({ error, onButtonClick }: ErrorPageProps) => {
  const { theme } = useThemeContext()
  const { t } = useTranslation(['common', 'error'])
  const { show } = useIntercom()
  const {
    user: {
      profile: { id },
    },
  } = useUserContext()

  const { isTabletPortraitOrGreater } = useResponsive()

  const router = useRouter()

  const [hasConfirmed, setHasConfirmed] = useState(false)

  const getTitle = () => {
    if (error === RESIDENCE_TOO_BIG) {
      return t('common:TAILOREDMOVE.inPreperationTitleBigResidence')
    }
    if (error === LONG_DISTANCE_MOVE) {
      return t('common:TAILOREDMOVE.inPreperationTitleLongMove')
    }
    return t('common:TAILOREDMOVE.inPreperationTitleNoProviders')
  }
  const getSubtitle = () => {
    if (error === RESIDENCE_TOO_BIG) {
      return t('common:TAILOREDMOVE.inPreperationSubtitleBigResidence')
    }
    if (error === LONG_DISTANCE_MOVE) {
      return t('common:TAILOREDMOVE.inPreperationSubtitleLongMove')
    }
    return t('common:TAILOREDMOVE.inPreperationSubtitleNoProviders')
  }

  return (
    <Flex direction={isTabletPortraitOrGreater ? 'row' : 'column'} style={{ gap: isTabletPortraitOrGreater ? 0 : 16 }}>
      <Flex
        direction="column"
        alignItems="center"
        className={clsx(
          'flex-grow-0 flex-[0_0_66%] mx-auto w-full p-4 rounded-[var(--radius-border-radius-main)] h-auto',
          'shadow-[0px_4px_32px_0px_rgba(0,0,0,0.07)]',
          '[&_a]:text-[var(--color-primary-main)] [&_a]:font-bold',
          'md:px-12 md:py-8',
          'sm:max-w-[434px]',
        )}
        style={{
          backgroundColor: 'var(--color-background-secondary)',
        }}
      >
        {!hasConfirmed ? (
          <>
            <Flex direction="column" alignItems={isTabletPortraitOrGreater ? 'start' : 'center'} className="text-left md:justify-start md:items-start md:w-[400px]">
              <Text className="!m-0 !mb-5 !text-xl md:!text-2xl !font-bold !leading-6 text-left md:w-4/5" variant="body">
                {t(`${getTitle()}`)}
              </Text>
              <Text className="!m-0 !mb-6 !text-base text-left md:w-4/5" variant="body">
                {t(`${getSubtitle()}`)}
              </Text>
              <div className="flex w-full justify-center text-xs flex-col sm:flex-row lg:flex-row">
                <div className="h-12 min-w-[260px]">
                  <Button
                    onClick={async () => {
                      if (onButtonClick) {
                        onButtonClick()
                      } else {
                        await sendErrorRequestQuotation(id)
                        setHasConfirmed(true)
                      }
                    }}
                    text={t('common:TAILOREDMOVE.buttonText')}
                    variant="primary"
                    withFullWidth={theme === ThemeEnum.FASTIGHETSBYRAN || !isTabletPortraitOrGreater}
                  />
                </div>
              </div>
            </Flex>
          </>
        ) : (
          <Flex direction="column" alignItems="center">
            <BirdSuccess width="250" height="180" />
            <Flex direction="column" alignItems="center" className="text-left justify-start items-start sm:w-[400px]">
              <Text className="!m-0 !mb-10 !text-base w-4/5" variant="body">
                {t('confirmationText')}
              </Text>
              <div className="flex w-full justify-center text-xs flex-col sm:flex-row lg:flex-row">
                <div className="h-12 min-w-[260px]">
                  <ExitActivityButton
                    variant="primary"
                    padding="8px 32px !important"
                    text={t('toMovepage')}
                    onClick={() => {
                      router.push(toDemoPath('/app/movepage'))
                    }}
                  />
                </div>
              </div>
            </Flex>
          </Flex>
        )}
      </Flex>
      <Flex
        alignItems="center"
        direction="column"
        className={clsx('w-full border border-[rgba(33,71,102,0.20)] rounded-2xl h-max', isTabletPortraitOrGreater ? 'px-8 py-6 ml-8 my-0' : 'p-4 mx-0 my-auto')}
        style={{
          gap: 16,
        }}
      >
        <Text spacing="none" className="text-base" variant="bodyBold">
          {t('common:contactUsDirectly')}
        </Text>
        <Flex
          direction={isTabletPortraitOrGreater ? 'column' : 'row'}
          style={{
            gap: isTabletPortraitOrGreater ? 8 : 16,
            width: '100%',
          }}
        >
          <div className="h-12 w-full min-w-[134px] flex-grow [&_button]:text-xs [&_button]:min-w-auto md:w-[208px] md:text-base md:[&_button]:text-base">
            <Button
              padding="8px 14px"
              withFullWidth={!isTabletPortraitOrGreater}
              onClick={() => show()}
              text={t('common:MOVEPROFILE.CROSSBORDERMOVEMODAL.chatWithUs')}
              variant="outline"
            />
          </div>
          <div className="h-12 w-full min-w-[134px] flex-grow [&_button]:text-xs [&_button]:min-w-auto md:w-[208px] md:text-base md:[&_button]:text-base">
            <Button
              padding="8px 14px"
              withFullWidth={!isTabletPortraitOrGreater}
              iconLeft={<Phone />}
              onClick={() => window.open(`tel:${t('common:phoneNumber')}`)}
              text={t('common:callUs')}
              variant="outline"
            />
          </div>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default TailoredMoveInPreparation
