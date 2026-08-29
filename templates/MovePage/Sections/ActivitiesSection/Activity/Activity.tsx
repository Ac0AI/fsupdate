import { useRef, useState } from 'react'
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
import { type TodoType, todoTypes } from '../../../../../types/todo'
import { ChecklistItem } from '../../../../../types/checklist'
import { toDemoPath } from '@/common/utils/demoNavigation'
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
  const [isLeaving, setIsLeaving] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const { isTabletPortraitOrGreater } = useResponsive()
  const {
    user: {
      currentMove: { movehelp, fromAddress, toAddress },
    },
  } = useUserContext()

  const { theme } = useThemeContext()
  const { activitiesList, startChecklistItem, skippedActivities, hideItem, chooseSelf, requestHelp, cancelHelp, removeItem } = useChecklistContext()
  const { movingDistanceTooFar } = movehelp
  const status = (item.type && activitiesList.find((activity) => activity.type === item.type)?.status) || ''
  const isTodo = item.type === 'custom' || (todoTypes as readonly string[]).includes(item.type)
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
      if (translationItem?.linkUrl) router.push(toDemoPath(translationItem.linkUrl))
    } else {
      setIsOpened(!isOpened)
    }
  }

  // Kortet ska inte bara försvinna: det viks ihop och glider mot klart-listan,
  // så man förstår vart det tog vägen. Web Animations API i stället för
  // CSS-klasser eftersom höjden måste mätas i stunden.
  const markAsDone = () => {
    const el = cardRef.current
    const reduceMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!el || reduceMotion || isLeaving || typeof el.animate !== 'function') {
      hideItem(item.type, item.id)
      return
    }
    setIsLeaving(true)
    el.classList.add('overflow-hidden', 'pointer-events-none')
    const box = getComputedStyle(el)
    const open = {
      height: `${el.offsetHeight}px`,
      minHeight: box.minHeight,
      marginBottom: box.marginBottom,
      paddingTop: box.paddingTop,
      paddingBottom: box.paddingBottom,
      borderTopWidth: box.borderTopWidth,
      borderBottomWidth: box.borderBottomWidth,
    }
    const closed = { height: '0px', minHeight: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px', borderTopWidth: '0px', borderBottomWidth: '0px' }
    const finish = () => hideItem(item.type, item.id)
    el.animate(
      [
        { ...open, opacity: 1, transform: 'none' },
        { ...open, opacity: 0, transform: 'translateX(28px) scale(0.98)', offset: 0.5 },
        { ...closed, opacity: 0, transform: 'translateX(28px) scale(0.98)' },
      ],
      { duration: 460, easing: 'cubic-bezier(0.16, 1, 0.3, 1)', fill: 'forwards' },
    ).finished.then(finish, finish)
  }

  const getSubtitle = () => {
    let translation
    if (item.type === 'custom') {
      return [item.note ?? t('CHECKLIST_SECTION.ownItem')]
    }
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
      ref={cardRef}
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
              {item.type === 'custom' ? <OwnItemIcon /> : !!theme && <ImageKit src={`${ActivitiesIcons?.[theme]?.[item.type as keyof IconsUrls]}`} />}
            </div>
            <div>
              <div className={activityTitleVariants({ disabled: isUserExcludedFromService })}>{translationItem?.title ?? item.title ?? ''}</div>
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
                  {isTodo && (
                    <button
                      type="button"
                      className="relative mt-2 inline-flex items-center gap-1 text-[12px]! font-medium text-[var(--color-inactive-dark)] underline-offset-2 transition-colors duration-200 ease-out hover:text-[var(--color-error-red)] hover:underline after:content-[''] after:absolute after:-inset-3"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeItem(item.type as TodoType, item.id)
                      }}
                    >
                      {t('CHECKLIST_SECTION.remove')}
                    </button>
                  )}
                  <button
                    type="button"
                    className="relative mt-2 inline-flex items-center gap-1 text-[12px]! font-medium text-[var(--color-inactive-dark)] underline-offset-2 transition-colors duration-200 ease-out hover:text-[var(--color-secondary-main)] hover:underline after:content-[''] after:absolute after:-inset-3"
                    onClick={(e) => {
                      e.stopPropagation()
                      markAsDone()
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" aria-hidden>
                      <path d="M5 13l4 4L19 7" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t('CHECKLIST_SECTION.alreadyDone')}
                  </button>
                </div>
              )}
              {isTodo && item.helpStatus && (
                <TodoChoice
                  item={item}
                  onSelf={() => chooseSelf(item)}
                  onHelp={() => requestHelp(item)}
                  onCancel={() => cancelHelp(item)}
                />
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
                <ArrowRightThin className="transition-transform duration-200 ease-out group-hover:translate-x-0.5" />
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

/* ---------- egna punkter ---------- */

const MS_PER_DAY = 1000 * 60 * 60 * 24

// Nästa vardag efter en tidpunkt. Helgen räknas inte, röda dagar får backend ta.
const nextWorkingDay = (from: Date) => {
  const d = new Date(from.getTime() + MS_PER_DAY)
  while (d.getDay() === 0 || d.getDay() === 6) d.setTime(d.getTime() + MS_PER_DAY)
  return d
}

const TodoChoice = ({ item, onSelf, onHelp, onCancel }: { item: ChecklistItem; onSelf: () => void; onHelp: () => void; onCancel: () => void }) => {
  const { t, i18n } = useTranslation(['movePage'])
  const locale = i18n.language === 'en' ? 'en-GB' : 'sv-SE'
  const requestedAt = item.helpRequestedAt ? new Date(item.helpRequestedAt) : new Date()
  const time = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' }).format(requestedAt)
  const date = new Intl.DateTimeFormat(locale, { weekday: 'long', day: 'numeric', month: 'long' }).format(nextWorkingDay(requestedAt))
  const stop = (fn: () => void) => (e: React.MouseEvent) => {
    e.stopPropagation()
    fn()
  }
  const link = 'text-[12px]! font-medium underline underline-offset-2 text-[var(--color-inactive-dark)] hover:text-[var(--color-secondary-main)] transition-colors'

  if (item.helpStatus === 'pending') {
    return (
      <div className="mt-3 flex flex-col gap-2 motion-safe:animate-[rise_.3s_var(--ease-out-expo)_both]">
        <span className="text-[13px] font-semibold text-[var(--color-text-main)]">{t('CHECKLIST_SECTION.howToProceed')}</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={stop(onSelf)}
            className="h-10 rounded-full px-4 border-2 border-[var(--color-secondary-main)] bg-white text-[13px]! font-bold text-[var(--color-secondary-main)] transition-[background-color,transform] duration-200 ease-out hover:bg-[#F4FCFA] motion-safe:active:scale-[0.97]"
          >
            {t('CHECKLIST_SECTION.doItMyself')}
          </button>
          <button
            type="button"
            onClick={stop(onHelp)}
            className="h-10 rounded-full px-4 border-2 border-[var(--color-secondary-main)] bg-[var(--color-secondary-main)] text-[13px]! font-bold text-white transition-[background-color,transform] duration-200 ease-out hover:bg-[var(--color-secondary-main-dark)] motion-safe:active:scale-[0.97]"
          >
            {t('CHECKLIST_SECTION.wantHelp')}
          </button>
        </div>
      </div>
    )
  }
  if (item.helpStatus === 'self') {
    return (
      <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-[var(--color-inactive-dark)]">
        <span>{t('CHECKLIST_SECTION.youDoIt')}</span>
        <button type="button" onClick={stop(onHelp)} className={link}>
          {t('CHECKLIST_SECTION.wantHelpAnyway')}
        </button>
      </div>
    )
  }
  if (item.helpStatus === 'requested') {
    return (
      <div className="mt-3 rounded-lg bg-[#EAF6F3] border border-[#9EE0D5] px-3.5 py-3 flex flex-col gap-1.5 motion-safe:animate-[rise_.3s_var(--ease-out-expo)_both]">
        <span className="flex items-start gap-2 text-[13px] leading-[19px] font-semibold text-[var(--color-primary-dark)]">
          <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 shrink-0" aria-hidden>
            <circle cx="12" cy="12" r="10" fill="var(--color-primary-main)" />
            <path d="M7 12.5l3 3 7-7" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {t('CHECKLIST_SECTION.helpSent', { time, date })}
        </span>
        <button type="button" onClick={stop(onCancel)} className={`${link} self-start`}>
          {t('CHECKLIST_SECTION.undoHelp')}
        </button>
      </div>
    )
  }
  if (item.helpStatus === 'in_progress') {
    return (
      <div className="mt-3 rounded-lg bg-[#EAF6F3] border border-[#9EE0D5] px-3.5 py-3 text-[13px] leading-[19px] font-semibold text-[var(--color-primary-dark)]">
        {t('CHECKLIST_SECTION.helpInProgress', { name: item.handledBy || 'Nina', date })}
      </div>
    )
  }
  if (item.helpStatus === 'failed') {
    return (
      <div className="mt-3 rounded-lg bg-[#FFF5F5] border border-[var(--color-error-red)] px-3.5 py-3 flex flex-col gap-1.5">
        <span className="text-[13px] leading-[19px] font-semibold text-[var(--color-error-red)]">{t('CHECKLIST_SECTION.helpFailed')}</span>
        <button type="button" onClick={stop(onHelp)} className={`${link} self-start`}>
          {t('CHECKLIST_SECTION.tryAgain')}
        </button>
      </div>
    )
  }
  return null
}

// Egna punkter har ingen ikon i uppsättningen: en tom lista med bock i samma manér.
const OwnItemIcon = () => (
  <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
    <rect x="7" y="4" width="22" height="28" rx="4" fill="#FFD4B3" stroke="#214766" strokeWidth="1.8" />
    <path d="M12 12h12M12 18h12M12 24h7" stroke="#214766" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="26" cy="26" r="6" fill="#51C8B4" stroke="#FFFFFF" strokeWidth="1.5" />
    <path d="m23.3 26 1.9 1.9 3.6-3.6" fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default Activity
