import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChecklistCardItem } from 'types/checklist'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import { ActivityEnum } from '@/common/types/activity'
import MoltoBeneIcon from '@/components/atoms/MoltoBeneIcon'
import Spinner from '@/components/atoms/Spinner'
import Text from '@/components/atoms/Text'
import { ORDER_TYPE_INSURANCE, ORDER_TYPE_MOVECLEAN, ORDER_TYPE_POWER, ReducedServiceTypes } from '@/constants/order'
import { SERVICE_DENY_LIST } from '@/constants/serviceDenyList'
import { Themes } from '@/constants/themes'
import Activity from '@/templates/MovePage/Sections/ActivitiesSection/Activity/Activity'
import { containerVariants, emptyListVariants, spinnerWrapperVariants } from './ActivitiesSection.variants'

/** De vanligaste sakerna kunden lägger till själv. Typerna finns redan i backend. */
const ADDABLE_TODOS = ['mail', 'tv', 'parking', 'waste', 'alarm', 'school'] as const

interface ActivitiesSectionProps {
  movehelpFirst?: boolean
  showElHook?: boolean
  highlightNext?: boolean
  checklistItems: ChecklistCardItem[]
}

const ActivitiesSection = ({ checklistItems, highlightNext = false, movehelpFirst = false, showElHook = false }: ActivitiesSectionProps) => {
  const {
    user: {
      currentMove: { movehelp },
      profile: { partnerDetails, leadDetails },
    },
  } = useUserContext()
  const { theme } = useThemeContext()
  const { t } = useTranslation(['serviceDenyList', 'movePage'])
  const { activitiesList, hasFetchedActivites, addTodo, addOwnTodo } = useChecklistContext()
  const [isAdding, setIsAdding] = useState(false)
  const [ownTitle, setOwnTitle] = useState('')

  const partnerId = leadDetails?.brokerOfficeId ?? partnerDetails?.partnerId ?? ''
  const movingDistanceTooFar = movehelp?.movingDistanceTooFar ?? false
  const partnerName = leadDetails?.brokerOfficeName ?? ''
  const isExcludedBroker = useCallback((value: string) => partnerName?.toLowerCase()?.includes(value?.toLowerCase()), [partnerName])
  const inviterLogoUrl = leadDetails?.brokerAgencyLogo

  const isEmptyList = () => {
    // Check if there are any activities that should be shown
    const visibleActivities = activitiesList.filter((item) => {
      switch (item.type) {
        case ActivityEnum.MOVEHELP:
          // Hide if moving distance is too far
          return !movingDistanceTooFar
        case ActivityEnum.MOVECLEAN:
          // Hide if partner is in moveclean deny list
          return !(SERVICE_DENY_LIST.moveclean?.length && SERVICE_DENY_LIST?.moveclean?.includes(partnerId))
        case ActivityEnum.POWER:
          // Hide power if theme is fortum
          return theme !== Themes.fortum
        default:
          // Show all other activities
          return true
      }
    })

    return visibleActivities.length === 0
  }
  if (isEmptyList() && hasFetchedActivites) {
    return (
      <div className={containerVariants()}>
        <div className={emptyListVariants()}>
          <MoltoBeneIcon />
          <div>{t('movePage:CHECKLIST_SECTION.emptyChecklistTitle')}</div>
          <Text spacing="none">{t('movePage:CHECKLIST_SECTION.emptyChecklistDescription')}</Text>
        </div>
      </div>
    )
  }

  const isUserExcludedFromService = (service: ReducedServiceTypes) => {
    return (
      (!!partnerId?.length && SERVICE_DENY_LIST[service]?.length && SERVICE_DENY_LIST[service]?.includes(partnerId)) ||
      (!!partnerId?.length && isExcludedBroker('Notar') && (service === ORDER_TYPE_POWER || service === ORDER_TYPE_INSURANCE)) ||
      (!!partnerId?.length && service === ORDER_TYPE_MOVECLEAN && SERVICE_DENY_LIST['moveclean_seperate_provider']?.includes(partnerId))
    )
  }

  // Ordningen: stor eller lång flytt sätter flytthjälpen överst, annars städet.
  // Sedan el, bredband, flyttanmälan och sist försäkring. Egna punkter ligger kvar sist.
  const rank = (type: string) => {
    const base: Record<string, number> = movehelpFirst
      ? { movehelp: 10, moveclean: 11, power: 20, internet: 30, addresschange: 40, insurance: 50 }
      : { moveclean: 10, movehelp: 11, power: 20, internet: 30, addresschange: 40, insurance: 50 }
    return base[type] ?? 90
  }
  const displayList = [...activitiesList].sort((a, b) => rank(a.type) - rank(b.type))

  // Första öppna tjänstekortet är nästa steg och får den orangea knappen.
  const nextId = highlightNext
    ? displayList.find((item) => {
        const tr = checklistItems.find((a) => a.name === item.type)
        return !!tr?.linkUrl && item.type !== 'custom' && !isUserExcludedFromService(item.type as ReducedServiceTypes)
      })?.id
    : undefined

  return (
    <div className={containerVariants({ isFullList: activitiesList?.length === 6 })}>
      <Text className="text-[var(--color-secondary-dark)] text-lg md:text-xl leading-tight tracking-wider pb-3 text-center md:text-left" spacing="none">
        {t('movePage:CHECKLIST_SECTION.leftToDo')}
      </Text>
      {!hasFetchedActivites ? (
        <div className={spinnerWrapperVariants()}>
          <Spinner scale={2} color="green" />
        </div>
      ) : (
        <>
          <div className="stagger-rise">
            {displayList?.map((item) => (
              <Activity
                item={item}
                key={item.id}
                isNext={item.id === nextId}
                logoToDisplay={isUserExcludedFromService(item.type as ReducedServiceTypes) && inviterLogoUrl ? inviterLogoUrl : undefined}
                isUserExcludedFromService={isUserExcludedFromService(item.type as ReducedServiceTypes)}
                isExternalMovecleanOfferCustomer={SERVICE_DENY_LIST.moveclean_seperate_provider?.includes(partnerId)}
                translationItem={(() => {
                  const tr = checklistItems.find((activityItem) => activityItem.name === item.type)
                  // Motprestationen: bokat städ ger 100 kr rabatt vid el-teckning. Bara då byter pillen budskap.
                  if (tr && item.type === 'power' && showElHook) return { ...tr, highlight: t('movePage:CHECKLIST_SECTION.elHookAfterClean') }
                  return tr
                })()}
              />
            ))}
          </div>

          {/* Lägg till något eget - listan är kundens, inte vår */}
          <div className="mt-3">
            {isAdding ? (
              <div className="bg-white rounded-[var(--radius-small)] shadow-[0px_2px_6px_rgba(1,22,39,0.06)] p-4">
                <p className="text-[13px] text-[var(--color-inactive-dark)] mb-3">{t('movePage:CHECKLIST_SECTION.addOwnHint')}</p>
                <div className="flex flex-wrap gap-2">
                  {ADDABLE_TODOS.map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => {
                        addTodo(type)
                        setIsAdding(false)
                      }}
                      className="px-3 py-2 rounded-full text-[13px]! font-medium border border-[var(--color-inactive-main)] text-[var(--color-secondary-main)] hover:border-[var(--color-primary-main)] hover:bg-[var(--color-primary-main)]/8 transition-colors"
                    >
                      {t(`movePage:TODO_LABELS.${type}`)}
                    </button>
                  ))}
                </div>
                {/* Eget förslag: allt som inte finns i listan ovan */}
                <form
                  className="mt-3 pt-3 border-t border-[var(--color-inactive-main)] flex flex-col gap-1.5"
                  onSubmit={(e) => {
                    e.preventDefault()
                    if (!ownTitle.trim()) return
                    addOwnTodo(ownTitle)
                    setOwnTitle('')
                    setIsAdding(false)
                  }}
                >
                  <label htmlFor="own-todo" className="text-[13px] text-[var(--color-inactive-dark)]">
                    {t('movePage:CHECKLIST_SECTION.addOwnOther')}
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="own-todo"
                      type="text"
                      autoFocus
                      maxLength={80}
                      placeholder={t('movePage:CHECKLIST_SECTION.addOwnPlaceholder')}
                      value={ownTitle}
                      onChange={(e) => setOwnTitle(e.target.value)}
                      className="flex-1 min-w-0 h-11 rounded-[5px] border-[1.9px] border-[rgba(118,118,118,0.4)] px-3 text-base text-[var(--color-text-main)] focus:outline-none focus:border-[var(--color-tertiary-main)] transition-colors"
                    />
                    <button
                      type="submit"
                      disabled={!ownTitle.trim()}
                      className="h-11 shrink-0 rounded-full px-5 bg-[var(--color-secondary-main)] text-white text-[14px]! font-bold transition-[opacity,transform,background-color] duration-200 ease-out hover:bg-[var(--color-secondary-main-dark)] motion-safe:active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none"
                    >
                      {t('movePage:CHECKLIST_SECTION.addOwnButton')}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="flex items-center gap-2 text-[14px]! font-semibold text-[var(--color-secondary-main)] underline underline-offset-4 hover:text-[var(--color-primary-dark)] transition-colors"
              >
                <span aria-hidden className="text-[18px] leading-none">
                  +
                </span>
                {t('movePage:CHECKLIST_SECTION.addOwn')}
              </button>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ActivitiesSection
