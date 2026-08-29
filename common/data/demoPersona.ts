import { demoUser } from './demoMovepage'

/**
 * Vem testar demon? En köpare har fått sin nya adress från mäklaren och sin
 * nuvarande från SPAR. En säljare har bara den bostad som sålts, och får fylla
 * i vart flytten går i onboardingen. Valet och det kunden fyller i ligger i
 * sessionStorage så att hela vägen från inbjudningslänk till checklista går
 * att köra om och om igen, utan backend.
 */
export type DemoPersona = 'kopare' | 'saljare'

export type DemoAddress = { street: string; apartmentNumber: string | null; zip: string; city: string }

export type DemoSession = {
  persona: DemoPersona
  toAddress: DemoAddress | null
  movingDate: string
  onboarded: boolean
}

// Bostaden som sålts via mäklaren. Köparen får den från SPAR, säljaren från affären.
export const SOLD_HOME: DemoAddress = { street: 'Storgatan 12', apartmentNumber: null, zip: '11435', city: 'Stockholm' }
// Bostaden köparen tillträder. Mäklaren skickar över den i inbjudan.
export const BOUGHT_HOME: DemoAddress = { street: 'Ekvägen 8', apartmentNumber: null, zip: '41320', city: 'Göteborg' }

export const PERSONAS: Record<DemoPersona, { title: string; lead: string; knows: string[]; asks: string }> = {
  kopare: {
    title: 'Köpare',
    lead: 'Anna har köpt Ekvägen 8 i Göteborg genom Demomäklaren.',
    knows: ['Nya adressen, från mäklaren', 'Nuvarande adressen, från SPAR', 'Tillträdesdagen'],
    asks: 'Onboardingen bekräftar adressen och frågar bara efter datum.',
  },
  saljare: {
    title: 'Säljare',
    lead: 'Anna har sålt Storgatan 12 i Stockholm genom Demomäklaren.',
    knows: ['Bostaden som sålts, från mäklaren', 'Tillträdesdagen för köparen'],
    asks: 'Onboardingen frågar vart flytten går, eller låter dig vänta med adressen.',
  },
}

export const DEMO_SESSION_KEY = 'flyttsmart-demo-session'
export const DEMO_SESSION_EVENT = 'flyttsmart-demo-session-change'

const emptyAddress: DemoAddress = { street: '', apartmentNumber: null, zip: '', city: '' }

const defaultSession = (persona: DemoPersona): DemoSession => ({
  persona,
  toAddress: persona === 'kopare' ? BOUGHT_HOME : null,
  movingDate: demoUser.currentMove.movingDate,
  onboarded: false,
})

export const readDemoSession = (): DemoSession | null => {
  if (typeof window === 'undefined') return null
  try {
    return JSON.parse(window.sessionStorage.getItem(DEMO_SESSION_KEY) || 'null')
  } catch {
    return null
  }
}

const save = (session: DemoSession) => {
  window.sessionStorage.setItem(DEMO_SESSION_KEY, JSON.stringify(session))
  window.dispatchEvent(new Event(DEMO_SESSION_EVENT))
  return session
}

export const writeDemoSession = (patch: Partial<DemoSession>) => save({ ...(readDemoSession() ?? defaultSession('kopare')), ...patch })

// Startar om demon som en ny inbjuden kund. Flyttsidans "välkommen" och
// "bråttom"-modal ska visas igen, så deras minnen i localStorage rensas också.
export const startDemoSession = (persona: DemoPersona) => {
  window.localStorage.removeItem('hasClosedWelcome')
  window.localStorage.removeItem('hasClosedUrgentServicesModal')
  return save(defaultSession(persona))
}

export const isDemoPersona = (value: string): value is DemoPersona => value === 'kopare' || value === 'saljare'

// demoUser med sessionens val inlagda. Utan session är det köparen, som förr.
export const getDemoUser = () => {
  const s = readDemoSession()
  if (!s) return demoUser
  return {
    ...demoUser,
    currentMove: {
      ...demoUser.currentMove,
      fromAddress: SOLD_HOME,
      toAddress: s.toAddress ?? emptyAddress,
      movingDate: s.movingDate,
      addressStatus: s.toAddress ? 'ready' : 'empty',
    },
    profile: {
      ...demoUser.profile,
      leadDetails: { ...demoUser.profile.leadDetails, type: s.persona === 'kopare' ? 'buyer' : 'seller' },
    },
  }
}

// Inbjudan som mäklaren skickat. Köparens har den nya adressen, säljarens
// har ingen adress att fylla i åt kunden.
export const demoLead = (code: string) => {
  const persona: DemoPersona = isDemoPersona(code) ? code : 'kopare'
  return {
    hasFetchedData: false,
    leadDetails: {
      id: `demo-lead-${persona}`,
      brokerOfficeId: 'demo-office',
      brokerOfficeName: 'Demomäklaren',
      brokerOfficePersonName: 'Erik Lind',
      pno: demoUser.profile.pno,
      sourceSystem: 'demo',
      type: persona === 'kopare' ? 'buyer' : 'seller',
      movingDate: new Date(demoUser.currentMove.movingDate),
      inviteCode: code,
      address: persona === 'kopare' ? BOUGHT_HOME : null,
    },
    partnerDetails: { partnerId: '', partnerName: '', agentName: '' },
  }
}
