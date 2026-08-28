import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ChecklistCardItem } from 'types/checklist'
import { useChecklistContext } from '@/common/context/checklist/checklistContext.provider'
import { useThemeContext } from '@/common/context/theme/themeContext.provider'
import { useUserContext } from '@/common/context/user/UserProvider'
import CompletedActivityItem from '@/components/molecules/CompletedActivityItem'
import ResetChecklistItemModal from '@/components/organisms/ResetChecklistItemModal'
import { ChecklistItem } from '../../../../types/checklist'
import { activityListWrapperVariants, completedListHeaderVariants, completedListContainerVariants } from './CompletedItemsList.variants'

interface CompletedItemsListProps {
  checklistItems: ChecklistCardItem[]
}

const CompletedItemsList = ({ checklistItems }: CompletedItemsListProps) => {
  const { skippedActivities, resetItem } = useChecklistContext()
  const { t } = useTranslation(['movePage', 'checklistItems'])
  const {
    user: {
      currentMove,
      profile: { leadDetails, partnerDetails },
    },
  } = useUserContext()
  const { theme } = useThemeContext()
  const [showAll, setShowAll] = useState(false)
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const userType = leadDetails?.type === 'seller' ? 'seller' : 'buyer'
  const inviterName = leadDetails?.brokerOfficeName ?? partnerDetails?.partnerName ?? ''
  const invitedBy = inviterName ? inviterName : ''
  const power = { id: 'preChecked', type: t('powerWithFortum'), hiddenAt: null, sortOrder: -1 }
  const preCheckedItem = {
    id: 'preChecked',
    type: `${userType === 'seller' ? `${t('sellResidence')} ${invitedBy}` : `${t('buyResidence')} ${invitedBy}`}`,
    hiddenAt: null,
    sortOrder: -1,
  }
  const mergedLists = [...skippedActivities]
  const isAdvancedServiceOrderType = (toBeDetermined: ChecklistItem | AdvancedServiceState | null | string | number | boolean | Date | ToAddress | FromAddress | ServiceState) => {
    if (toBeDetermined && toBeDetermined.hasOwnProperty('contractData')) {
      const AdvancedService = toBeDetermined as AdvancedServiceState
      if (AdvancedService?.skippedAt) return AdvancedService.skippedAt
      if (AdvancedService?.completedAt) return AdvancedService.completedAt
      if (AdvancedService?.lockedAt) return AdvancedService.lockedAt
    }
  }

  // Redan fixat (hiddenAt) räknas i "x av y klara" och ska därför synas här också,
  // annars försvinner kortet spårlöst när man klickar bort det.
  const skippedItems = mergedLists.sort((a, b) => {
      const aValue = isAdvancedServiceOrderType(currentMove[a.type as keyof CurrentMove]) || a?.hiddenAt
      const bValue = isAdvancedServiceOrderType(currentMove[b.type as keyof CurrentMove]) || b?.hiddenAt

      if (aValue && bValue) {
        return new Date(bValue).getTime() - new Date(aValue).getTime()
      }
      return -1
    })

  const sorted = skippedItems.concat(theme === 'fortum' ? power : []).concat(invitedBy ? preCheckedItem : [])
  const restOfItems = sorted?.slice(5, sorted?.length)
  const itemsToDisplay = sorted?.slice(0, 5)

  const handleItemClick = (item: ChecklistItem) => {
    setSelectedItem(item)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedItem(null)
  }

  const handleResetItem = () => {
    if (selectedItem?.id) {
      resetItem(selectedItem.id)
      handleCloseModal()
    }
  }

  const viewListOfCompletedItems = (list: ChecklistItem[]) => {
    return list.map((item, index) => {
      const translationItem = checklistItems.find((activityItem) => {
        if (activityItem.name === item.type) return item
      })
      const isHidden = item?.hiddenAt
      return <CompletedActivityItem key={`${item?.id}-${index}`} item={item} translationItem={translationItem} isHidden={!!isHidden} onClick={handleItemClick} />
    })
  }

  // Don't render if no items
  if (!sorted?.length) {
    return null
  }

  // Get translation for selected item title
  const getItemTitle = () => {
    if (!selectedItem) return ''
    const translationItem = checklistItems.find((activityItem) => activityItem.name === selectedItem.type)
    return translationItem?.title ?? selectedItem.type
  }

  return (
    <div className="w-full px-3 md:px-0">
      <div className={completedListContainerVariants()} data-testid="activity-list-container">
        <h3 className={completedListHeaderVariants()}>{t('movePage:CHECKLIST_SECTION.quickOverview').toUpperCase()}</h3>
        <div className={activityListWrapperVariants()}>
          {itemsToDisplay && !!itemsToDisplay.length && viewListOfCompletedItems(itemsToDisplay)}
          {restOfItems && !!restOfItems.length && viewListOfCompletedItems(restOfItems)}
        </div>
      </div>
      <ResetChecklistItemModal item={selectedItem} itemTitle={getItemTitle()} isOpen={isModalOpen} onClose={handleCloseModal} onReset={handleResetItem} />
    </div>
  )
}

export default CompletedItemsList
