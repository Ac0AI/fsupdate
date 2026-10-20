/*
 * Siffror och texter för demon av det nya elflödet. Priserna (vid 2 900 kWh/år)
 * och rabattraderna är de som står i Paper, sidan "El · mätbar och tumvänlig
 * (20 okt)". Övriga texter kommer från flyttsmart-next live
 * (public/locales/sv/electricity.json och common.json). Inga egna siffror.
 */

export type OfferId = 'skekraft' | 'fortum' | 'vattenfall' | 'tibber'
export type HomeType = 'Lägenhet' | 'Radhus' | 'Villa'

type Segment = { t: string; b?: boolean }

export type Offer = {
  id: OfferId
  name: string
  logo: string
  /** Etiketten i kortets huvud, som live. */
  kind: string
  /** Raden under loggan i jämförelsen (Paper 1C). */
  compareSub: string
  /** ca kr/mån vid 2 900 kWh/år enligt Paper. */
  basePrice: number
  hasDiscount: boolean
  /** Rabattraden i sammanfattningen. Saknas siffran i Paper står bara rabattens form. */
  discountRow: { label: string; value: string } | null
  /** Live: STEP4SUMMARY.PROVIDERS.<id>Choice */
  choice: string
  terms: Segment[]
  about: { header: string; description: string; benefits: string[] }
}

const fullmakt: Segment[] = [{ t: 'och ger Flyttsmart' }, { t: 'fullmakt', b: true }, { t: 'att teckna ett nytt avtal på den angivna adressen.' }]

export const OFFERS: Offer[] = [
  {
    id: 'skekraft',
    name: 'Skellefteå Kraft',
    logo: '/images/el-demo/skekraft.svg',
    kind: 'Rörligt elpris',
    compareSub: 'Rörligt elpris · Rabatt i 12 mån',
    basePrice: 298,
    hasDiscount: true,
    discountRow: { label: 'Elprisrabatt', value: '8,75 öre/kWh i 12 månader' },
    choice: 'Skellefteå Kraft Rörligt pris',
    terms: [{ t: 'Jag godkänner' }, { t: 'Skellefteå Krafts allmänna avtalsvillkor', b: true }, ...fullmakt],
    about: {
      header: 'Om Skellefteå Kraft',
      description:
        'Skellefteå Kraft erbjuder förnybar el från sol, vind och vatten. De är en av Sveriges största producenter av förnybar energi och har dessutom en prisbelönt kundservice redo att hjälpa dig. I deras uppskattade app får du full koll på din förbrukning och smarta tjänster som gör vardagen enklare.',
      benefits: ['Förnybar el', 'Rörligt elpris', 'Ingen bindningstid', 'Prisvinnande kundservice'],
    },
  },
  {
    id: 'fortum',
    name: 'Fortum',
    logo: '/images/el-demo/fortum.svg',
    kind: 'Rörligt månadspris',
    compareSub: 'Rörligt månadspris · Rabatt i 15 mån',
    basePrice: 341,
    hasDiscount: true,
    discountRow: { label: 'Månadsavgift', value: 'Fri i 15 månader' },
    choice: 'Fortum Rörligt pris',
    terms: [{ t: 'Jag godkänner' }, { t: 'Fortums avtalsvillkor', b: true }, ...fullmakt],
    about: {
      header: 'Om Fortum',
      description:
        'Fortum är Nordens största elhandelsbolag med ett tydligt uppdrag: att göra det enkelt att välja trygg och hållbar el. Vi kombinerar hög leveranssäkerhet med konkurrenskraftiga villkor och ett av marknadens lägsta påslag. All el vi levererar är 100 % fossilfri som standard.',
      benefits: ['Hållbarhetsfokus', 'Rörligt månadspris', 'Ingen bindningstid'],
    },
  },
  {
    id: 'vattenfall',
    name: 'Vattenfall',
    logo: '/images/el-demo/vattenfall.svg',
    kind: 'Rörligt elpris',
    compareSub: 'Rörligt elpris · Rabatt i 12 mån',
    basePrice: 352,
    hasDiscount: true,
    discountRow: { label: 'Elprisrabatt', value: 'Rabatt på elpriset i 12 månader' },
    choice: 'Vattenfall Rörligt pris',
    terms: [{ t: 'Jag godkänner' }, { t: 'Vattenfalls avtalsvillkor', b: true }, { t: 'och' }, { t: 'Vattenfalls särskilda avtalsvillkor', b: true }, ...fullmakt],
    about: {
      header: 'Om Vattenfall',
      description:
        'Över en miljon kunder i Norden har valt Vattenfall för sin el. När du flyttar finns vi här för dig, vi ser till att elen fungerar i ditt nya hem, tryggt och enkelt. Vi har över 100 års erfarenhet av att elektrifiera Sverige och hos oss får du smarta lösningar, elavtal som passar din vardag och alltid 100% fossilfri el.',
      benefits: ['Bra kundförmåner', '100% Fossilfri el', 'Energirådgivning', 'Personlig kundservice'],
    },
  },
  {
    id: 'tibber',
    name: 'Tibber',
    logo: '/images/el-demo/tibber.svg',
    kind: 'Kvartspris',
    compareSub: 'Kvartspris · Ingen rabatt',
    basePrice: 379,
    hasDiscount: false,
    discountRow: null,
    choice: 'Tibber Timpris',
    terms: [
      { t: 'Jag godkänner' },
      { t: 'Tibbers allmänna avtalsvillkor', b: true },
      { t: 'och att en sedvanlig kreditprövning kommer att ske, samt ger Flyttsmart' },
      { t: 'fullmakt', b: true },
      { t: 'att teckna ett nytt avtal på den angivna adressen.' },
    ],
    about: {
      header: 'Om Tibber',
      description:
        'Framtidens el handlar om att använda den smartare. Med Tibber betyder det hjälp att styra elanvändning till tider då elen är billig och det finns mycket fossilfri energi i elnätet. Med Tibbers smarta teknik slipper du dessutom hålla koll på priser och schemalägga laddning, Tibber gör det åt dig. Din el styrs dit där den gör mest nytta – helt automatiskt och utan krångel. Resan till det lägsta priset just du och ditt boende kan uppnå, börjar med Tibber.',
      benefits: ['Styr din förbrukning till billiga tider', 'Få betalt genom att stötta elnätet', 'Få hjälp att ducka effektavgifter', 'Transparent prissättning'],
    },
  },
]

export const RECOMMENDED: OfferId = 'skekraft'
export const offerById = (id: OfferId) => OFFERS.find((o) => o.id === id) ?? OFFERS[0]

/* Bostaden i Paper. Förbrukningen 2 900 kWh/år hör till lägenheten på 96 kvm. */
export const HOME = { street: 'Ekvägen 8', zip: '123 45', city: 'Stockholm', kvm: 96 }
export const BASE_KWH = 2900

const round100 = (n: number) => Math.max(1000, Math.round(n / 100) * 100)
/** Lägenhet utgår från Paper (2 900 kWh vid 96 kvm). Hus använder schablonen i demo/electricity/offers.ts. */
export const kwhFor = (type: HomeType, kvm: number) => (type === 'Lägenhet' ? round100((BASE_KWH * kvm) / HOME.kvm) : round100(6000 + 60 * kvm))
/** Priserna i Paper gäller 2 900 kWh. Annan förbrukning räknas om i proportion. */
export const priceFor = (o: Offer, kwh: number) => Math.round((o.basePrice * kwh) / BASE_KWH)

/* Datum. Startdatum förväljs till flyttdagen men aldrig tidigare än 7 arbetsdagar fram. */
export const MOVE_DAY = '2026-10-30'

export const toIso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, (m || 1) - 1, d || 1)
}
export const addWorkdays = (from: Date, n: number) => {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  let left = n
  while (left > 0) {
    d.setDate(d.getDate() + 1)
    const wd = d.getDay()
    if (wd !== 0 && wd !== 6) left--
  }
  return d
}
export const today = () => new Date()
export const firstPossible = () => toIso(addWorkdays(today(), 7))
export const defaultStart = () => (MOVE_DAY > firstPossible() ? MOVE_DAY : firstPossible())
export const tooEarlyExample = () => toIso(addWorkdays(today(), 1))

/** Inom 3 arbetsdagar: för tidigt. 4 till 6 arbetsdagar: går, men då behövs anläggnings-ID. */
export const dateStatus = (iso: string): 'empty' | 'early' | 'facility' | 'ok' => {
  if (!iso) return 'empty'
  if (iso <= toIso(addWorkdays(today(), 3))) return 'early'
  if (iso < firstPossible()) return 'facility'
  return 'ok'
}

export const longDate = (iso: string) => new Intl.DateTimeFormat('sv-SE', { day: 'numeric', month: 'long', year: 'numeric' }).format(fromIso(iso))
export const formatKwh = (n: number) => new Intl.NumberFormat('sv-SE').format(n).replace(/\s/g, '')
