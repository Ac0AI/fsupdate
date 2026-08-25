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
