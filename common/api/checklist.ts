import { clearIntervalAsync, SetIntervalAsyncTimer, setIntervalAsync } from 'set-interval-async'
import { TodoType } from 'types/todo'
import { ActivityEnum } from '@/common/types/activity'
import * as analytics from '@/common/utils/analytics'
import { OrderServiceType } from '@/constants/order'
import createFetchInstance from '@/utils/api'
import { ChecklistItem } from '../../types/checklist'

export const getChecklist = async (): Promise<ChecklistReturnType> => {
  const getInstanceChecklist = createFetchInstance('GET')
  const CHECKLIST_API_URL = `/web/checklist/move/current`
  const data = await getInstanceChecklist<ChecklistReturnType>(CHECKLIST_API_URL)
  return data
}

export const getMoveNextBestAction = async (): Promise<ChecklistNextBestActionReturnType> => {
  const getInstance = createFetchInstance('GET')
  const CHECKLIST_API_URL = '/web/checklist/move/next-best-action'
  const data = await getInstance<ChecklistNextBestActionReturnType>(CHECKLIST_API_URL)
  return data
}

export const addTodoToChecklist = async (type: TodoType): Promise<ChecklistReturnType> => {
  const CHECKLIST_API_URL = `/web/checklist/item/add/${type}`
  const fetchInstance = createFetchInstance('POST')
  await fetchInstance<TodoChecklistReturnType>(CHECKLIST_API_URL)
  const data = await getChecklist()
  return data
}

// Egna punkter och hjälpvalet. Backend: add/custom skapar punkten, help skickar
// mejl till Flyttsmart och sätter helpStatus, self och DELETE help ändrar bara status.
export const addCustomTodo = async (title: string): Promise<ChecklistReturnType> => {
  const fetchInstance = createFetchInstance('POST')
  await fetchInstance<TodoChecklistReturnType>('/web/checklist/item/add/custom', { body: JSON.stringify({ title }) })
  const data = await getChecklist()
  return data
}

export const chooseTodoSelf = async (itemId: string): Promise<TodoChecklistReturnType> => {
  const fetchInstance = createFetchInstance('PATCH')
  return fetchInstance<TodoChecklistReturnType>(`/web/checklist/item/${itemId}/self`)
}

export const requestTodoHelp = async (itemId: string, note?: string): Promise<TodoChecklistReturnType> => {
  const fetchInstance = createFetchInstance('POST')
  return fetchInstance<TodoChecklistReturnType>(`/web/checklist/item/${itemId}/help`, { body: JSON.stringify({ note }) })
}

export const cancelTodoHelp = async (itemId: string): Promise<TodoChecklistReturnType> => {
  const fetchInstance = createFetchInstance('DELETE')
  return fetchInstance<TodoChecklistReturnType>(`/web/checklist/item/${itemId}/help`)
}

export const removeTodoFromChecklist = async (itemId: string): Promise<TodoChecklistReturnType> => {
  const CHECKLIST_API_URL = `/web/checklist/item/${itemId}/remove`
  const fetchInstance = createFetchInstance('DELETE')
  const data = await fetchInstance<TodoChecklistReturnType>(CHECKLIST_API_URL)
  return data
}

export const updateChecklistItemOrder = async (item: ChecklistItem, sortOrder = 0) => {
  const patchInstance = createFetchInstance('PATCH')
  const CHECKLIST_API_URL = `/web/checklist/item/${item.id}/sort-order`
  await patchInstance<ChecklistReturnType>(CHECKLIST_API_URL, {
    body: JSON.stringify({
      type: item.type,
      sortOrder,
    }),
  })
}

export const resetActivity = async (itemId: string, callback?: () => void) => {
  const patchInstance = createFetchInstance('PATCH')
  let CHECKLIST_API_URL = ''
  if (!!itemId) {
    CHECKLIST_API_URL = `/web/checklist/item/${itemId}/reset`
  }

  try {
    const data = await patchInstance<SkipCheckItemReturnType>(CHECKLIST_API_URL)
    if (callback) callback()
    return data
  } catch (e: unknown) {
    console.error(e)
  }
}

export const markActivityAsDone = async (type: string, callback?: () => void, itemId?: string) => {
  const patchInstance = createFetchInstance('PATCH')
  analytics.setEventParameter({ activity: type })
  let CHECKLIST_API_URL = ''
  if (!!itemId) {
    CHECKLIST_API_URL = `/web/checklist/item/${itemId}/skip`
  }

  try {
    const data = await patchInstance<SkipCheckItemReturnType>(CHECKLIST_API_URL)
    if (callback) callback()
    return data
  } catch (e: unknown) {
    console.error(e)
  }
}

export const markAsStarted = async (itemId?: string) => {
  const patchInstance = createFetchInstance('PATCH')
  try {
    const data = await patchInstance<StartCheckItemReturnType>(`/web/checklist/item/${itemId}/start`)
    return data
  } catch (e: unknown) {
    console.error(e)
  }
}

export const hideChecklistItem = async (itemId: string) => {
  const patchInstance = createFetchInstance('PATCH')
  if (!!itemId) {
    return patchInstance(`/web/checklist/item/${itemId}/hide`)
  }
}

export const showChecklistItem = async (itemId: string) => {
  const patchInstance = createFetchInstance('PATCH')
  const CHECKLIST_API_URL = !!itemId && `/web/checklist/item/${itemId}/show`
  if (!!itemId && CHECKLIST_API_URL) {
    return patchInstance(CHECKLIST_API_URL)
  }
}

const getEndpointEnding = (activity: string) => {
  if (activity === ActivityEnum.MOVECLEAN || activity === ActivityEnum.MOVEHELP) {
    return '/most-services'
  }
  return ''
}

type FetchInstanceReturnType<T> = {
  data: T
}

type ExamplePriceReturnType = {
  status: string
  name: string
  price?: number
  pricePerHour?: number
  isGroupDeal: boolean
  key: string
}

const fetchExamplePrice = async (activity: string): Promise<ExamplePriceReturnType> => {
  const getInstance = createFetchInstance('GET')
  const {
    data: { status, name, price, isGroupDeal, key, pricePerHour },
  } = await getInstance<FetchInstanceReturnType<ExamplePriceReturnType>>(`/moves/current/price/${activity}${getEndpointEnding(activity)}`)

  return {
    status,
    name,
    price,
    pricePerHour,
    isGroupDeal,
    key,
  }
}

let timer: SetIntervalAsyncTimer<[]> | null = null

// Returns example provider with lowest price (or highest rating for movehelp) for each activity
export const getExamplePrice = async (activity: string, callback?: (value: PriceItemType) => void) => {
  /**
   * To get this price we need to call Bredbandsvals API in backend, this takes a while
   * and we need to poll endpoint. Just as in loadBroadbandOptions()
   */
  let provider
  if (activity === ActivityEnum.INTERNET) {
    let finished = false
    let attempts = 0
    if (timer === null) {
      timer = setIntervalAsync(async () => {
        try {
          provider = await fetchExamplePrice(activity)
          if (provider.status === 'done') {
            finished = true
          }
          /**
           * We're having issues with bredbandsval API a lot so we limit the attempts
           * of polling since we will be polling for ever in worst cases.
           */
          if (finished || attempts > 20) {
            clearIntervalAsync(timer as SetIntervalAsyncTimer<[]>)
            timer = null
            if (callback) callback(provider)
          }
          attempts++
        } catch (e: unknown) {
          timer && clearIntervalAsync(timer)
          timer = null
        }
      }, 3000)
    }
  } else {
    try {
      provider = await fetchExamplePrice(activity)
      callback?.(provider)
    } catch (e: unknown) {
      callback?.({} as PriceItemType)
      /**
       * We don't need to handle this, we're simply showing '-' if we don't have
       * prices regardless of reason.
       */
    }
  }
}

type ChecklistReturnType = {
  items: ChecklistItem[]
}

type ChecklistNextBestActionReturnType = {
  nextBestAction: OrderServiceType | null
}
type TodoChecklistReturnType = {
  type: TodoType
  sortOrder: number
  hiddenAt: string
}

type SkipCheckItemReturnType = {
  completedAt: string
  contractData: string
  meta: string
  skippedAt: string
  state: string
}

type StartCheckItemReturnType = {
  items: ChecklistItem[]
}

export type PriceItemType = {
  name: string
  price?: number
  pricePerHour?: number
  status: string
  isGroupDeal: boolean
  key: string
}

export default getChecklist
