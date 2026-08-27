import { HTMLAttributes, createContext, useCallback, useContext, useEffect, useState } from 'react'
import ReactGA4 from 'react-ga4'
import { useTranslation } from 'react-i18next'
import { TODO_TYPE_HANDYMAN, TodoActivityType, TodoType } from 'types/todo'
import getChecklist, {
  addTodoToChecklist,
  hideChecklistItem,
  markActivityAsDone,
  markAsStarted,
  removeTodoFromChecklist,
  resetActivity,
  showChecklistItem,
} from '@/common/api/checklist'
import { CreateOrder, cancelTodo, createOrder, getActiveTodos, todoSkip } from '@/common/api/todo'
import { SourceSystemEnum } from '@/common/enums/SourceSystemEnum'
import { ActivityEnum } from '@/common/types/activity'
import { isActivityBooked } from '@/utils/activity'
import { ORDER_STATUS_CANCELED } from '@/constants/order'
import { ChecklistItem } from '../../../types/checklist'
import { todoTypes } from '../../../types/todo'
import { useToastContext } from '../toast/toast.provider'
import { useUserContext } from '../user/UserProvider'

/* eslint-disable @typescript-eslint/no-empty-function */
const defaultValue: ChecklistContextType = {
  skippedTodos: [],
  activitiesList: [],
  skippedActivities: [],
  resetTodo: () => {},
  skipTodo: () => {},
  setActivitiesList: () => {},
  skipChecklistItem: () => {},
  addTodo: () => {},
  hideItem: () => {},
  showItem: () => {},
  removeItem: () => {},
  resetItem: () => {},
  startChecklistItem: () => {},
  hasFetchedActivites: false,
  createTodoOrder: () => undefined,
  skippedExternalActivitesList: [],
  isChecklistItemOrderedOrSkipped: () => false,
}

export type ChecklistContextType = {
  skippedTodos: TodoActivityType[]
  resetTodo: (arg0: TodoType, arg1: string) => void
  skipTodo: (arg0: TodoType) => void
  activitiesList: ChecklistItem[]
  skippedActivities: ChecklistItem[]
  setActivitiesList: (arg0: ChecklistItem[]) => void
  skipChecklistItem: (arg0: string, arg1: string, arg2: boolean, arg3?: () => void) => void
  addTodo: (arg0: TodoType) => void
  hideItem: (arg0: string, arg1: string) => void
  showItem: (arg0: string) => void
  removeItem: (arg0: TodoType, arg1: string) => void
  resetItem: (arg0: string) => void
  createTodoOrder: (arg0: TodoType, order: CreateOrder) => Promise<boolean> | undefined
  hasFetchedActivites: boolean
  startChecklistItem: (arg0: string, arg1: string) => void
  skippedExternalActivitesList: ChecklistItem[]
  isChecklistItemOrderedOrSkipped: (type: string) => boolean
}

export type ChecklistProviderProps = {
  context: React.Context<ChecklistContextType>
} & HTMLAttributes<HTMLDivElement>

const ChecklistContext = createContext(defaultValue)

export const ChecklistContextProvider = ({ children }: ChecklistProviderProps) => {
  const userData = useUserContext()
  const { showToast } = useToastContext()
  const { t } = useTranslation(['common'])
  const {
    user: {
      profile: { leadDetails },
      currentMove: { id },
      currentMove,
    },
    getCurrentMove,
  } = userData
  const [skippedTodos, setSkippedTodos] = useState<TodoActivityType[]>([])
  const [skippedActivities, setSkippedActivities] = useState<ChecklistItem[]>([])
  const [activitiesList, setActivitiesList] = useState<ChecklistItem[]>([])
  const [hasFetchedActivites, setHasFetchedActivites] = useState<boolean>(false)
  const getChecklistItems = useCallback(async () => {
    const checklist = await getChecklist()
    const skipped: ChecklistItem[] = []
    if (!!checklist.items.length) {
      const itemsToShow = checklist.items
        //filtering diy because it's not in an offer anymore, but it may be in a future again
        .filter((item) => (process.env.NEXT_PUBLIC_DIY_MOVE_SHOW === 'false' ? item?.type !== ActivityEnum.DIY : true))
        .map((item) => {
          const status = item.status || ''
          const hasOnlyCanceledOrders = item.orders?.length && item.orders.every((order) => order.status === ORDER_STATUS_CANCELED)
          const hasActiveOrders = isActivityBooked(status) && !hasOnlyCanceledOrders

          let shouldShowInActive = false
          if (hasOnlyCanceledOrders && !item.skippedAt) {
            shouldShowInActive = true
          } else {
            shouldShowInActive = !hasActiveOrders && !item.hiddenAt && !item.skippedAt
          }

          if (shouldShowInActive) {
            return item
          } else {
            skipped.push(item)
          }
        })
      setSkippedActivities(skipped)
      if (itemsToShow.length) {
        setActivitiesList(
          itemsToShow
            .filter(
              // In agreement with fastighetsbyran we're not only allowed to show insurance activity
              (x) => x?.type !== ActivityEnum.INSURANCE || (x?.type === ActivityEnum.INSURANCE && leadDetails?.sourceSystem !== SourceSystemEnum.FASTIGHETSBYRAN),
            )
            .filter(
              // In agreement with fastighetsbyran ostermalm we're not allowed to show movehelp and/or moveclean for the time being
              (x) =>
                x?.type !== ActivityEnum.MOVECLEAN ||
                (x?.type === ActivityEnum.MOVECLEAN && leadDetails?.brokerOfficeName?.toLowerCase() !== SourceSystemEnum.FASTIGHETSBYRANOSTERMALM),
            )
            .filter(
              // In agreement with notar huddinge we're not allowed to show moveclean for the time being
              (x) =>
                x?.type !== ActivityEnum.MOVECLEAN ||
                (x?.type === ActivityEnum.MOVECLEAN && !leadDetails?.brokerOfficeName?.toLowerCase().includes(SourceSystemEnum.NOTAR_HUDDINGE)),
            )
            .filter(
              // In agreement with fastighetsbyran ostermalm we're not allowed to show movehelp and/or moveclean for the time being
              (x) =>
                x?.type !== ActivityEnum.MOVEHELP ||
                (x?.type === ActivityEnum.MOVEHELP && leadDetails?.brokerOfficeName?.toLowerCase() !== SourceSystemEnum.FASTIGHETSBYRANOSTERMALM),
            )
            .filter(
              // In agreement with fastighetsbyran ostermalm we're not allowed to show movehelp and/or moveclean for the time being
              (x) =>
                x?.type !== ActivityEnum.MOVEHELP_COMBINED ||
                (x?.type === ActivityEnum.MOVEHELP_COMBINED && leadDetails?.brokerOfficeName?.toLowerCase() !== SourceSystemEnum.FASTIGHETSBYRANOSTERMALM),
            )
            .filter(
              // In agreement with notar we're not allowed to show insurance activity
              (x) => x?.type !== ActivityEnum.INSURANCE || (x?.type === ActivityEnum.INSURANCE && !leadDetails?.brokerOfficeName?.toLowerCase().includes(SourceSystemEnum.NOTAR)),
            )
            .filter((x) => x) as ChecklistItem[],
        )
      }
      setHasFetchedActivites(true)
    }
  }, [currentMove, id])

  const getTodos = useCallback(async () => {
    const activeTodos = await getActiveTodos(id)
    const sorted = activeTodos.sort((a, b) => {
      return a.skippedAt > b.skippedAt ? -1 : a.skippedAt < b.skippedAt ? 1 : 0
    })
    setSkippedTodos(sorted)
  }, [id])

  useEffect(() => {
    if (!!id) {
      getTodos()
    }
  }, [id, getTodos])
  useEffect(() => {
    if (!!id) {
      getChecklistItems()
    }
  }, [id, getChecklistItems])

  const isChecklistItemOrderedOrSkipped = useCallback(
    (type: string) => {
      const currentItem = activitiesList.find((item) => item.type === type)
      const currentSkippedItem = skippedActivities.find((item) => item.type === type)

      const itemToCheck = currentItem || currentSkippedItem
      const hasOnlyCanceledOrders = itemToCheck?.orders?.length && itemToCheck.orders.every((order) => order.status === ORDER_STATUS_CANCELED)

      if ((currentItem && currentItem.status) || currentSkippedItem?.id?.length) {
        const isBooked = (currentItem?.status && isActivityBooked(currentItem.status) && !hasOnlyCanceledOrders) || (!!currentSkippedItem?.id?.length && !hasOnlyCanceledOrders)
        return isBooked
      } else return false
    },
    [activitiesList, skippedActivities],
  )

  const resetTodo = async (type: TodoType, todoId: string) => {
    const response = await cancelTodo(id, todoId, type)
    if (response) getTodos()
  }
  const skipTodo = async (type: TodoType) => {
    const response = await todoSkip(id, type)
    if (response) {
      ReactGA4.event('activity_marked_as_done', { type: type })
      getTodos()
    }
  }
  const createTodoOrder = async (type: TodoType, order: CreateOrder) => {
    const response = await createOrder(currentMove.id, type, order)
    if (response) {
      getChecklistItems()
      return true
    }
    return false
  }
  const addTodo = async (type: TodoType) => {
    const response = await addTodoToChecklist(type)
    if (response) {
      ReactGA4.event('activity_added', { type: type })
      getChecklistItems()
      showToast(t('common:addToChecklistToast'))
    } else {
      showToast(t('common:somethingWrong'), 'error')
    }
  }

  const hideItem = async (type: string, itemId: string) => {
    const response = await hideChecklistItem(itemId)
    if (response) {
      ReactGA4.event('activity_hidden', { type: type })
      getChecklistItems()
      showToast(t('common:removeFromChecklistToast'))
    } else {
      showToast(t('common:somethingWrong'), 'error')
    }
  }

  const showItem = async (itemId: string) => {
    const response = await showChecklistItem(itemId)
    if (response) {
      await getChecklistItems()
    }
  }

  const removeItem = async (type: TodoType, itemId: string) => {
    const response = await removeTodoFromChecklist(itemId)
    if (response) {
      ReactGA4.event('activity_removed', { type: type })
      getChecklistItems()
    }
  }

  const resetItem = async (itemId: string) => {
    const response = await resetActivity(itemId)
    if (response) {
      getChecklistItems()
    }
  }

  // eslint-disable-next-line max-params
  const skipChecklistItem = async (type: string, itemId: string, started: boolean, callback?: () => void) => {
    let response
    const isTodoItem = todoTypes.includes(type as TodoType)
    if (started && !isTodoItem) {
      await Promise.all([resetActivity(itemId)]).then(() => {
        response = markActivityAsDone(type, callback, itemId)
      })
    } else {
      response = markActivityAsDone(type, callback, itemId)
    }

    if (response) {
      ReactGA4.event('activity_marked_as_done', { type: type })
      getCurrentMove()
      await getChecklistItems()
    }
  }

  const startChecklistItem = async (type: string, itemId: string) => {
    const response = await markAsStarted(itemId)
    if (response) {
      ReactGA4.event('activity_started', { type: type })
    }
  }

  const contextValue: ChecklistContextType = {
    skippedTodos,
    skippedActivities: skippedActivities.filter((active) => active.type !== ActivityEnum.SHOWCLEANING),
    activitiesList: activitiesList
      .filter((active) => !skippedTodos.some((hidden) => active.type === hidden.type))
      .filter((active) => active.type !== TODO_TYPE_HANDYMAN)
      .filter((active) => active.type !== ActivityEnum.SHOWCLEANING)
      .filter((active) => active.type !== ActivityEnum.MOVEHELP_COMBINED),
    resetTodo,
    skipTodo,
    setActivitiesList,
    skipChecklistItem,
    addTodo,
    hideItem,
    showItem,
    resetItem,
    startChecklistItem,
    removeItem,
    createTodoOrder,
    hasFetchedActivites,
    skippedExternalActivitesList: skippedActivities,
    isChecklistItemOrderedOrSkipped,
  }

  return <ChecklistContext.Provider value={contextValue}>{children}</ChecklistContext.Provider>
}
export const CreateChecklistContext = () => {
  return createContext<ChecklistContextType>(defaultValue)
}

export const useChecklistContext = () => useContext(ChecklistContext)
