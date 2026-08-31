import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { useTranslation } from 'react-i18next'
import { useIntercom } from 'react-use-intercom'
import { ChecklistCardItem } from 'types/checklist'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import { ActivityEnum } from '@/common/types/activity'
import { Booking } from '@/types/booking'
import Spinner, { SpinnerWrapper } from '@/components/atoms/Spinner'
import { isBigOrLongMove } from '@/common/utils/moveProfile'
import { movePageWrapperClasses } from './MovePage.variants'
import ActivitiesSection from './Sections/ActivitiesSection/ActivitiesSection'
import CompletedItemsList from './Sections/CompletedItemsList'
import CompletedBookingsSection from './Sections/CompletedBookingsSection'
import TopSection from './Sections/TopSection'
import WelcomeSection from './Sections/WelcomeSection'
import MoveTimeline from './Components/MoveTimeline'
import UrgentServicesModal from './Components/UrgentServicesModal/UrgentServicesModal'

interface MovePageProps {
  completedBookings: Booking[]
}

const MovePage: React.FC<MovePageProps> = ({ completedBookings }) => {
  const { trackEvent, show: showIntercom } = useIntercom()
  const { theme } = useThemeContext()
  const userData = useUserContext()
  const { skippedActivities, activitiesList } = useChecklistContext()

  const [showWelcomeSection, setShowWelcomeSection] = useState(false)
  const [showUrgentServicesModal, setShowUrgentServicesModal] = useState(false)
  const [hasShownUrgentModal, setHasShownUrgentModal] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { t } = useTranslation(['checklistItems', 'movePage'])
  const checklistItems = t('checklistItems:CHECKLIST_ITEMS_MOVEPAGE', { returnObjects: true }) as ChecklistCardItem[]
  const checklistItemsCompleted = t('checklistItems:CHECKLIST_ITEMS', { returnObjects: true }) as ChecklistCardItem[]
  const {
    user: {
      profile: { phone, email, fullName, leadDetails },
      currentMove: { toAddress, fromAddress, fromResidenceSize, movingDate, createdAt, power, internet, movehelp, moveclean, insurance },
      hasFetchedData,
    },
  } = userData

  const assignedMcAdmin = leadDetails?.assignedMcAdmin

  const isProfileComplete = !!phone && !!email && !!fullName
  const [count, setCount] = useState(isProfileComplete ? 1 : 0)

  // Calculate progress for progress bar based on checklist items
  // Total = all unique checklist items (active + completed/skipped)
  // Completed = items that are booked, hidden, or skipped (in skippedActivities)
  const allActivities = [...activitiesList, ...skippedActivities]
  const totalTasks = new Set(allActivities.map((a) => a.id)).size
  const completedTasks = skippedActivities.length

  // Check if user has any services ordered, skipped, or hidden
  const hasOrderedServices = () => {
    const hasPower = power && (power.lockedAt || power.completedAt || power.skippedAt || power.canceledAt || power.state === 'completed')
    const hasInternet = internet && (internet.lockedAt || internet.completedAt || internet.skippedAt || internet.canceledAt || internet.state === 'completed')
    const hasMovehelp = movehelp && (movehelp.lockedAt || movehelp.completedAt || movehelp.skippedAt || movehelp.canceledAt || movehelp.state === 'completed')
    const hasMoveclean = moveclean && (moveclean.lockedAt || moveclean.completedAt || moveclean.skippedAt || moveclean.canceledAt || moveclean.state === 'completed')
    const hasInsurance = insurance && (insurance.lockedAt || insurance.completedAt || insurance.skippedAt || insurance.canceledAt || insurance.state === 'completed')

    // Also check if any services are in the skippedActivities list
    // The skippedActivities list includes items that have been marked as skipped/hidden
    const hasSkippedInsurance = skippedActivities.some((activity) => activity.type === 'insurance')

    return hasPower || hasInternet || hasMovehelp || hasMoveclean || hasInsurance || hasSkippedInsurance
  }

  // Check if moving date is less than 7 days away
  const isMovingSoon = () => {
    if (!movingDate) return false
    const moveDate = new Date(movingDate)
    const today = new Date()
    const daysUntilMove = Math.ceil((moveDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilMove < 7 && daysUntilMove >= 0
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hasClosedWelcome = window.localStorage.getItem('hasClosedWelcome')
      if (hasClosedWelcome) {
        setShowWelcomeSection(false)
      } else {
        setShowWelcomeSection(true)
      }
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isProfileComplete && count < 1) {
      setCount(count + 1)
      trackEvent('profile_settings_completed')
    }
  }, [isProfileComplete, count, trackEvent])

  useEffect(() => {
    // Check if we should show the urgent services modal
    // Only check after data has been fetched
    if (!hasFetchedData || isLoading) {
      return // Wait for data to be loaded
    }

    if (!hasShownUrgentModal && isMovingSoon() && !hasOrderedServices()) {
      const hasClosedUrgentModal = window.localStorage.getItem('hasClosedUrgentServicesModal')
      if (!hasClosedUrgentModal) {
        setShowUrgentServicesModal(true)
        setHasShownUrgentModal(true)
      }
    }
  }, [isLoading, movingDate, power, internet, movehelp, moveclean, insurance, skippedActivities, hasShownUrgentModal, hasFetchedData])

  const handleCloseUrgentModal = () => {
    setShowUrgentServicesModal(false)
    window.localStorage.setItem('hasClosedUrgentServicesModal', 'true')
  }

  const handleContactSupport = () => {
    setShowUrgentServicesModal(false)
    window.localStorage.setItem('hasClosedUrgentServicesModal', 'true')
    showIntercom()
  }

  const welcomeVisible = showWelcomeSection && !!toAddress?.street?.length && !skippedActivities.find((item) => item.type === ActivityEnum.MOVEHELP)

  // Stor eller lång flytt: flytthjälpen är den bästa affären och ligger överst.
  const movehelpFirst = isBigOrLongMove({ fromCity: fromAddress?.city, toCity: toAddress?.city, fromResidenceSize })
  // Rabattkroken på elkortet gäller när städet är bokat via oss, inte fixat själv.
  const cleanBooked = !!(moveclean?.lockedAt || moveclean?.completedAt)
  // Kalendern styr den orangea knappen: el när det är 14-30 dagar kvar, bredband och flyttanmälan därunder.
  const daysToMove = movingDate ? Math.ceil((new Date(movingDate).getTime() - Date.now()) / 86400000) : null

  if (!theme && isLoading)
    return (
      <div className={movePageWrapperClasses()}>
        <SpinnerWrapper>
          <Spinner scale={2} color="green" />
        </SpinnerWrapper>
      </div>
    )

  return (
    <>
      <div className={clsx(movePageWrapperClasses(), 'stagger-rise')} data-testid="move-page-container">
        <TopSection />
        {welcomeVisible && (
          <WelcomeSection
            movehelpFirst={movehelpFirst}
            setShowWelcomeSection={setShowWelcomeSection}
            assignedMcAdminId={assignedMcAdmin?.id}
            assignedMcAdminName={assignedMcAdmin?.name}
          />
        )}
        <MoveTimeline movingDate={movingDate} startedAt={createdAt} completed={completedTasks} total={totalTasks} />
        {/* En orange knapp per vy: välkomstkortet medan det syns, sedan första öppna kortet. */}
        <ActivitiesSection checklistItems={checklistItems} highlightNext={!welcomeVisible} movehelpFirst={movehelpFirst} showElHook={cleanBooked} daysToMove={daysToMove} />
        <CompletedBookingsSection initialBookings={completedBookings} />
        <CompletedItemsList checklistItems={checklistItemsCompleted} />
      </div>
      <UrgentServicesModal isOpen={showUrgentServicesModal} onClose={handleCloseUrgentModal} onContactSupport={handleContactSupport} />
    </>
  )
}

export default MovePage
