import { ActivityEnum } from '@/common/types/activity'
import { ALL_MC_ADMINS } from '@/common/utils/mcAdminHelpers'

/**
 * Data för /demo/movepage. Ren frontendvisning av checklistesidan utan backend,
 * auth eller BankID. Rör inte produktionsflödet: fixturerna serveras bara när
 * webbläsarens sökväg ligger under /demo (se common/utils/api.ts).
 */

const inTwoWeeks = () => {
  const d = new Date()
  d.setDate(d.getDate() + 21)
  return d.toISOString()
}

const notStarted = { state: 'not_started' }

export const demoUser = {
  currentMove: {
    id: 'demo-move-0001',
    fromAddress: { street: 'Storgatan 12', apartmentNumber: null, zip: '11435', city: 'Stockholm' },
    toAddress: { street: 'Ekvägen 8', apartmentNumber: null, zip: '41320', city: 'Göteborg' },
    movingDate: inTwoWeeks(),
    residenceType: 'apartment',
    residenceSize: 86,
    fromResidenceSize: 62,
    apartmentType: null,
    wizardDone: true,
    power: notStarted,
    insurance: notStarted,
    internet: notStarted,
    addresschange: notStarted,
    movehelp: notStarted,
    moveclean: notStarted,
    movehelpCombined: notStarted,
    moveDiy: notStarted,
    diy: notStarted,
    createdAt: '2026-08-01T08:00:00.000Z',
    updatedAt: '2026-08-01T08:00:00.000Z',
    addressStatus: 'ready',
  },
  profile: {
    id: 'demo-user-0001',
    pno: '199001019999',
    firstName: 'Anna',
    lastName: 'Karlsson',
    fullName: 'Anna Karlsson',
    meta: { onboardingChannel: 'email' },
    createdAt: '2026-08-01T08:00:00.000Z',
    updatedAt: '2026-08-01T08:00:00.000Z',
    intercomHash: '',
    leadDetails: {
      id: 'demo-lead-0001',
      brokerOfficeId: null,
      brokerOfficeName: 'Demomäklaren',
      brokerOfficePersonName: 'Erik Lind',
      sourceSystem: 'demo',
      pno: '199001019999',
      type: 'buyer',
      assignedMcAdmin: ALL_MC_ADMINS[3],
    },
  },
  contact: { email: 'anna@example.se', emailVerified: true, phone: '+46701234567' },
  domesticServicesBalance: { data: null, isBankIdLoading: false },
  currentMoveLoading: false,
  hasFetchedData: true,
}

const item = (type: string, sortOrder: number, extra: Record<string, unknown> = {}) => ({
  checklistId: 'demo-checklist-0001',
  id: `demo-item-${type}`,
  hiddenAt: null,
  skippedAt: undefined,
  status: 'not_started',
  sortOrder,
  type,
  orders: [],
  ...extra,
})

/**
 * Två avbockade och resten kvar att göra, så både aktiv lista och klarlista syns.
 * Elavtalet ligger först och obockat med flit: det är tjänsten där rekommendationen
 * skiljer sig mest mellan kunder, och den vi konverterar sämst på.
 */
export const demoChecklist = {
  items: [
    item(ActivityEnum.POWER, 1),
    item(ActivityEnum.MOVEHELP, 2),
    item(ActivityEnum.MOVECLEAN, 3),
    item(ActivityEnum.INSURANCE, 4),
    item(ActivityEnum.INTERNET, 5, { status: 'completed', skippedAt: '2026-08-12T09:00:00.000Z' }),
    item(ActivityEnum.ADDRESSCHANGE, 6, { status: 'completed', skippedAt: '2026-08-14T09:00:00.000Z' }),
  ],
}
