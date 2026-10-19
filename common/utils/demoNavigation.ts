import { isDemoPath } from './demoApi'

// Tjänstesidor som finns under /demo. Saknas en väg här hamnar man på
// demoflyttsidan i stället för att kastas ut till inloggningen.
const DEMO_ROUTES = ['addresschange', 'bookings', 'broadband', 'electricity', 'fixarenovera', 'insurance', 'moveclean', 'movehelp', 'movepage', 'welcome']

// Checklistan pekar på /app/showcleaning, som inte finns som egen route.
const ROUTE_ALIASES: Record<string, string> = {
  showcleaning: 'moveclean',
}

const LOCALES = ['sv', 'en']

// Prototypen av flyttflödet steg 1 (utan pris) ligger under /demo/flytt. När den
// är påslagen leder flytthjälpen på demoflyttsidan dit i stället för till
// /demo/movehelp, så att vägen in är exakt dagens flyttsida.
export const FLYTT_VARIANT_KEY = 'flyttsmart-demo-flytt-variant'

export const isFlyttSteg1On = (): boolean => {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(FLYTT_VARIANT_KEY) === 'steg1'
  } catch {
    return false
  }
}

export const setFlyttSteg1 = (on: boolean) => {
  try {
    if (on) window.sessionStorage.setItem(FLYTT_VARIANT_KEY, 'steg1')
    else window.sessionStorage.removeItem(FLYTT_VARIANT_KEY)
  } catch {
    // sessionStorage kan saknas, då gäller dagens demoflöde
  }
}

/**
 * Byter /app mot /demo när vi står inne i demon, och lämnar vägen orörd
 * annars. Query och locale-prefix följer med. Skarpa appen påverkas inte:
 * isDemoPath läser location och är falsk överallt utom under /demo.
 */
export const toDemoPath = (path: string): string => {
  if (!isDemoPath() || !path.startsWith('/')) return path

  const [pathname, query] = path.split('?')
  const segments = pathname.split('/').filter(Boolean)

  const locale = LOCALES.includes(segments[0]) ? segments.shift() : undefined
  if (segments[0] === 'app' || segments[0] === 'demo') segments.shift()

  const requested = segments[0] ?? 'movepage'
  const service = ROUTE_ALIASES[requested] ?? requested
  const target = DEMO_ROUTES.includes(service) ? service : 'movepage'

  const prefix = locale ? `/${locale}` : ''
  if (target === 'movehelp' && isFlyttSteg1On()) return `${prefix}/demo/flytt?s=1`
  return `${prefix}/demo/${target}${query ? `?${query}` : ''}`
}
