import { useState } from 'react'
import { useTranslation, Trans } from 'react-i18next'
import { clsx } from 'clsx'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChecklistCardItem } from 'types/checklist'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import useResponsive from '@/common/hooks/useResponsive'
import isStockholmZipCode from '@/common/utils/zipCode'
import Flex from '@/components/atoms/Flex'
import ImageKit from '@/components/atoms/ImageKit'
import Text from '@/components/atoms/Text'
import { ActivitiesIcons, IconsUrls } from '@/enums/ActivitiesIconsEnum'
import ArrowDown from '@/public/images/Arrow-down-black.svg'
import ArrowUp from '@/public/images/Arrow-up-black.svg'
import ArrowRightThin from '@/public/images/ArrowRight_thin.svg'
import { activityDescriptionVariants, activityHighlightVariants, activityIconVariants, activityTitleVariants } from '@/templates/MovePage/Sections/ActivitiesSection/ActivitiesSection.variants'
import { ActivityEnum } from '@/types/activity'
import { isActivityLockedOrCompleted } from '@/utils/activity'
import { ChecklistItem } from '../../../../../types/checklist'
import {
  activityItemVariants,
  activityContentVariants,
  arrowWrapperVariants,
  brokerImageWrapperVariants,
  disabledTextWrapperVariants,
  linkTextWrapperVariants,
} from './Activity.variants'

export type ItemStatus = 'skipped' | 'not_started' | 'locked' | 'completed' | 'hidden' | 'reported' | 'invoiced' | 'under_process'

interface Props {
  item: ChecklistItem
  translationItem?: ChecklistCardItem
  isUserExcludedFromService?: boolean
  logoToDisplay?: string
  isExternalMovecleanOfferCustomer?: boolean
}

export const Activity = ({ item, translationItem, isUserExcludedFromService, logoToDisplay, isExternalMovecleanOfferCustomer }: Props) => {
  const { t, i18n } = useTranslation(['movePage'])
  const locale = i18n.language
  const router = useRouter()
  const [isOpened, setIsOpened] = useState(false)
  const { isTabletPortraitOrGreater } = useResponsive()
  const {
    user: {
      currentMove: { movehelp, fromAddress, toAddress },
    },
  } = useUserContext()

  const { theme } = useThemeContext()
  const { activitiesList, startChecklistItem, skippedActivities, hideItem } = useChecklistContext()
  const { movingDistanceTooFar } = movehelp
  const status = (item.type && activitiesList.find((activity) => activity.type === item.type)?.status) || ''
  const isMovehelpCombinedLockedOrCompleted = isActivityLockedOrCompleted(skippedActivities.find((activity) => activity.type === ActivityEnum.MOVEHELP_COMBINED)?.status as string)

  const isHiddenItem = () => {
    switch (item.type) {
      case ActivityEnum.MOVEHELP_COMBINED:
        return true
      case ActivityEnum.MOVEHELP:
        return !!movingDistanceTooFar || isMovehelpCombinedLockedOrCompleted
      case ActivityEnum.MOVECLEAN:
        return isMovehelpCombinedLockedOrCompleted
      case ActivityEnum.DIY:
        return !isStockholmZipCode(fromAddress?.zip)
      case ActivityEnum.POWER:
        return theme === 'fortum'
      default:
        return false
    }
  }

  const handleClickOnActivity = () => {
    if (!isUserExcludedFromService) {
      startChecklistItem(item.type, item.id)
      if (translationItem?.linkUrl) router.push(translationItem.linkUrl)
    } else {
      setIsOpened(!isOpened)
    }
  }

  const getSubtitle = () => {
    let translation
    if (isUserExcludedFromService) {
      translation = t('CHECKLIST_SECTION.excludedService')
    } else {
      if (!!toAddress?.street?.length && (item.type === ActivityEnum.INTERNET || item.type === ActivityEnum.INSURANCE)) {
        translation = translationItem?.subtitle?.replace('{{address}}', toAddress?.street)
      } else if (!!fromAddress?.street?.length && item.type === ActivityEnum.MOVECLEAN) {
        translation = translationItem?.subtitle?.replace('{{address}}', fromAddress.street)
      } else {
        translation = translationItem?.subtitle?.replace('to {{address}}', '')?.replace('till {{address}}', '')?.replace('från {{address}}', '')?.replace('from {{address}}', '')
      }
    }
    return [translation?.replace('{{break}}', '') ?? '']
  }

  return (
    <div
      key={item.id}
      className={clsx(
        activityItemVariants({
          status: status as ItemStatus,
          hidden: isHiddenItem(),
          disabled: isUserExcludedFromService,
          disabledAndOpened: isUserExcludedFromService && isOpened,
          disabledAndOpenedAndExternalOffer: isUserExcludedFromService && isOpened && isExternalMovecleanOfferCustomer,
        }),
        `${item.type} item`,
      )}
      onClick={() => {
        !isExternalMovecleanOfferCustomer && handleClickOnActivity()
      }}
    >
      <Flex style={{ width: '100%' }} onClick={() => isExternalMovecleanOfferCustomer && handleClickOnActivity()} justifyContent="space-between" alignItems="center">
        <div className={activityContentVariants()}>
          <Flex alignItems="center" onClick={handleClickOnActivity}>
            <div className={activityIconVariants({ disabled: isUserExcludedFromService })}>
              {!!theme && <ImageKit src={`${ActivitiesIcons?.[theme]?.[item.type as keyof IconsUrls]}`} />}
            </div>
            <div>
              <div className={activityTitleVariants({ disabled: isUserExcludedFromService })}>{translationItem?.title ?? ''}</div>
              {getSubtitle()?.length &&
                !isUserExcludedFromService &&
                getSubtitle()?.map((trans: string, key: number) => {
                  return (
                    <div key={trans + key} className={activityDescriptionVariants({ textLong: trans?.length > 60 })}>
                      {trans}
                    </div>
                  )
                })}
              {!isUserExcludedFromService && (
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  {!!translationItem?.highlight && (
                    <div className={activityHighlightVariants()}>
                      <span aria-hidden className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary-main)] flex-shrink-0" />
                      {translationItem.highlight}
                    </div>
                  )}
                  <button
                    type="button"
                    className="mt-2 text-[11px] md:text-[12px] text-[var(--color-inactive-dark)]/80 hover:text-[var(--color-secondary-main)] hover:underline underline-offset-2 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      hideItem(item.type, item.id)
                    }}
                  >
                    {t('CHECKLIST_SECTION.alreadyDone')}
                  </button>
                </div>
              )}
            </div>
          </Flex>
        </div>
        <Flex className={linkTextWrapperVariants({ disabled: isUserExcludedFromService })} justifyContent="center" alignItems="center">
          {logoToDisplay ? (
            <div className={brokerImageWrapperVariants()}>
              {<Image src={logoToDisplay || ''} objectFit="contain" width="124" height="26" alt={`Logo of broker office`} />}
              <div className={arrowWrapperVariants()} onClick={() => setIsOpened(!isOpened)}>
                <>{isOpened ? <ArrowUp data-testid="Arrow up" alt="Arrow" /> : <ArrowDown data-testid="Arrow down" alt="Arrow" />}</>
              </div>
            </div>
          ) : (
            !!translationItem?.linkUrl && (
              <>
                {isTabletPortraitOrGreater && (
                  <Text style={{ paddingRight: 6, color: 'var(--color-secondary-main)', fontWeight: 600, textDecoration: 'underline', textUnderlineOffset: '3px' }}>
                    {translationItem?.linkText}
                  </Text>
                )}
                <ArrowRightThin />
              </>
            )
          )}
        </Flex>
      </Flex>
      {isUserExcludedFromService && isOpened && !isExternalMovecleanOfferCustomer && (
        <div className={disabledTextWrapperVariants()}>
          <div className={activityDescriptionVariants({ textLong: true })}>{t('CHECKLIST_SECTION.excludedService')}</div>
          <div className={activityDescriptionVariants({ textLong: true })}>{t('CHECKLIST_SECTION.excludedServicesContact')}</div>
        </div>
      )}
      {isUserExcludedFromService && isOpened && isExternalMovecleanOfferCustomer && (
        <div className={disabledTextWrapperVariants()}>
          <div className={activityDescriptionVariants()}>{t('CHECKLIST_SECTION.personalMovecleanOffer')}</div>
          <div className={activityDescriptionVariants()}>
            <Trans
              i18nKey="CHECKLIST_SECTION.personalMovecleanOfferDescription" // optional -> fallbacks to defaults if not provided
              components={{
                1: (
                  <a
                    style={{ color: 'var(--fs-colors-primaryMain)', fontWeight: 'var(--fs-fontWeights-bold)', textDecoration: 'underline' }}
                    href="https://www.stadgiganten.se/maklarhuset/"
                    target="_blank"
                  />
                ),
              }}
            />
          </div>
          <Flex direction={isTabletPortraitOrGreater ? 'row' : 'column'} style={{ width: '100%', gap: isTabletPortraitOrGreater ? 12 : 4 }}>
            <Flex direction="column" style={{ maxWidth: isTabletPortraitOrGreater ? '70%' : '100%' }}>
              <Text variant="bodyBold">{t('CHECKLIST_SECTION.cleaningGiant')}</Text>
              <Text spacing="none" style={{ fontStyle: 'italic' }}>
                {t('CHECKLIST_SECTION.cleaningGiantHeader')}
              </Text>
              <Text spacing="none" style={{ fontStyle: 'italic', paddingTop: '12px' }}>
                {t('CHECKLIST_SECTION.cleaningGiantDescription')}
              </Text>
            </Flex>
            <Flex style={{ height: isTabletPortraitOrGreater ? '168px' : '50px', width: isTabletPortraitOrGreater ? '25%' : '100%', position: 'relative' }}>
              <Link target="_blank" href="https://www.stadgiganten.se/maklarhuset/" passHref>
                <Image src="/images/stadgiganten.png" style={{ objectFit: 'contain' }} fill alt="Mäklarhuset logo" />
              </Link>
            </Flex>
          </Flex>
        </div>
      )}
    </div>
  )
}

export default Activity
