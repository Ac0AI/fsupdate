import React from 'react'
import RoundCheckmark from '@/components/atoms/RoundCheckmark'
import Text from '@/components/atoms/Text'
import { ChecklistCardItem, ChecklistItem } from '../../../types/checklist'
import { completedActivityItemWrapperVariants, nameWrapperVariants, nameTextVariants, activityWrapperVariants, checkmarkWrapperVariants } from './CompletedActivityItem.variants'
import clsx from 'clsx'

export interface CompletedActivityItemProps {
  translationItem?: ChecklistCardItem
  isHidden: boolean
  item: ChecklistItem
  onClick?: (item: ChecklistItem) => void
}

const CompletedActivityItem = ({ isHidden = false, item, translationItem, onClick }: CompletedActivityItemProps) => {
  const type = isHidden ? 'hidden' : item.id === 'preChecked' ? 'preChecked' : 'skipped'

  const icon = <RoundCheckmark />

  const getItemName = () => {
    return translationItem?.title ?? item.type
  }

  // Determine if item is clickable (non-order items can be reset)
  const hasOrders = item.orders && item.orders.length > 0
  const isClickable = !hasOrders && item.id !== 'preChecked' && onClick

  const handleClick = () => {
    if (isClickable && onClick) {
      onClick(item)
    }
  }

  return (
    <div
      data-testid="completed-activity-item-container"
      className={clsx(
        completedActivityItemWrapperVariants({ type: type as 'hidden' | 'skipped' | 'preChecked' }),
        isClickable &&
          'group cursor-pointer rounded-lg border-2 border-transparent transition-[background-color,border-color,box-shadow,transform] duration-200 ease-out hover:bg-[#E8F9F6] hover:border-[#51c8b4] hover:shadow-sm motion-safe:active:scale-[0.99]',
      )}
      onClick={handleClick}
    >
      <div className={activityWrapperVariants({ type: type as 'preChecked' | 'skipped' | 'hidden' })}>
        <div className={checkmarkWrapperVariants()}>{icon}</div>
        <div className={nameWrapperVariants({ type: type as 'hidden' | 'skipped' | 'preChecked' })}>
          <Text as="p" spacing="none" className={nameTextVariants()}>
            {getItemName()}
          </Text>
        </div>
        {isClickable && (
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:flex items-center bg-[#E8F9F6] group-hover:bg-white px-3 py-1.5 rounded-full transition-colors duration-200 ease-out">
              <span className="text-[12px] text-[#51c8b4] font-semibold">Återställ</span>
            </div>
            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#E8F9F6] text-[#1F6156] transition-colors duration-200 ease-out group-hover:bg-[#51c8b4] group-hover:text-white">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform duration-200 ease-out group-hover:translate-x-px">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompletedActivityItem
