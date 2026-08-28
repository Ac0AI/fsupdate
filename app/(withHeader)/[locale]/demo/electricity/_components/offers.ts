export type OfferId = 'skekraft' | 'tibber' | 'fortum' | 'vattenfall'

export type Offer = {
  id: OfferId
  name: string
  logo: string
  logoWidth: number
  kind: 'Rörligt elpris' | 'Kvartspris'
  markup: number // öre/kWh ovanpå spotpriset
  monthlyFee: number
  feeFreeMonths: number
  comparePrice: number // öre/kWh vid 5 000 kWh/år, inklusive påslag, elcertifikat och moms
  notice: string
  creditCheck?: boolean
}

// Siffrorna är de som ritats i Paper (Elavtal · A/B steg 1). Jämförpriset är
// det lagen kräver att vi visar: öre/kWh vid 5 000 kWh/år utan elnätsavgift.
export const OFFERS: Offer[] = [
  { id: 'skekraft', name: 'Skellefteå Kraft', logo: '/images/skekraft.svg', logoWidth: 112, kind: 'Rörligt elpris', markup: 6, monthlyFee: 49, feeFreeMonths: 12, comparePrice: 72.76, notice: '1 månads uppsägningstid' },
  { id: 'tibber', name: 'Tibber', logo: '/images/tibber-crop.svg', logoWidth: 96, kind: 'Kvartspris', markup: 8, monthlyFee: 49, feeFreeMonths: 0, comparePrice: 78.66, notice: '1 månads uppsägningstid', creditCheck: true },
  { id: 'fortum', name: 'Fortum', logo: '/images/fortum.svg', logoWidth: 100, kind: 'Rörligt elpris', markup: 7.5, monthlyFee: 69, feeFreeMonths: 0, comparePrice: 74.9, notice: '1 månads uppsägningstid' },
  { id: 'vattenfall', name: 'Vattenfall', logo: '/images/vattenfall.svg', logoWidth: 110, kind: 'Rörligt elpris', markup: 9, monthlyFee: 55, feeFreeMonths: 0, comparePrice: 80.05, notice: '1 månads uppsägningstid' },
]

export type ResidenceType = 'apartment' | 'house'

// Schablon i stället för nätbolagets historik: räcker för att jämföra avtal.
export const estimateKwh = (size: number, type: ResidenceType) => Math.max(1000, Math.round((type === 'house' ? 6000 + 60 * size : 1500 + 36 * size) / 100) * 100)

// Uppskattad månadskostnad vid dagens spotpris. Rörligt avtal har inget fast
// totalpris, så siffran är en uppskattning och märks som en.
export const monthlyCost = (o: Offer, kwh: number) => Math.round((o.comparePrice * kwh) / 1200 + (o.feeFreeMonths > 0 ? 0 : o.monthlyFee))

export const APARTMENTS = ['1001', '1002', '1101', '1102', '1201', '1202', '1301', '1302', '1401', '1402', '1501', '1502']

export const STEP_TITLES = ['Priser', 'Detaljer', 'Sammanfattning', 'BankID', 'Klart'] as const
export const STEP_HINTS = ['3 min', '1 min', '30 sek', 'Pågår', 'Avklarat'] as const

export const formatKr = (n: number) => `${new Intl.NumberFormat('sv-SE').format(n)} kr`
export const formatOre = (n: number) => `${new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)} öre/kWh`
