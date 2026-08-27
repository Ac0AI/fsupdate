import { isDemoPath } from './demoApi'

// Tjänstesidor som finns under /demo. Saknas en väg här hamnar man på
// demoflyttsidan i stället för att kastas ut till inloggningen.
const DEMO_ROUTES = ['addresschange', 'bookings', 'broadband', 'electricity', 'fixarenovera', 'insurance', 'moveclean', 'movehelp', 'movepage']

// Checklistan pekar på /app/showcleaning, som inte finns som egen route.
const ROUTE_ALIASES: Record<string, string> = {
  showcleaning: 'moveclean',
}

const LOCALES = ['sv', 'en']

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
  return `${prefix}/demo/${target}${query ? `?${query}` : ''}`
}
