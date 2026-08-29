import { Order } from './orders'

export type ChecklistItem = {
  checklistId?: string
  hiddenAt: string | null
  id: string
  sortOrder: number
  type: string
  skippedAt?: string
  status?: string
  orders?: Order[]
  /** Egen punkt: rubriken kunden skrev själv. */
  title?: string
  note?: string
  /** Tillagd punkt: fixar kunden den själv, eller vill hon ha vår hjälp? */
  helpStatus?: 'pending' | 'self' | 'requested' | 'in_progress' | 'failed'
  helpRequestedAt?: string | null
  handledBy?: string | null
}

declare type ChecklistCardItem = {
  name: string
  /** Skälet eller siffran som gör rekommendationen konkret. Valfritt. */
  highlight?: string
  linkText: string
  linkUrl: string
  MODAL_DESCRIPTION: string[]
  title: string
  subtitle: string
}
