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
  /** Jämförpris vid 2 000 kWh/år enligt Paper, öre/kWh inkl. moms och rabatt första året. */
  compare2000: number
  /** Månadsavgift första året (kr), som live priceComparisonFooter. Rabattmånader som live discountPeriod. */
  firstYearFee: number
  discountMonths: number
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
    compare2000: 118.4,
    firstYearFee: 0,
    discountMonths: 12,
    hasDiscount: true,
    discountRow: { label: 'Elprisrabatt', value: '8,75 öre/kWh i 12 månader' },
    choice: 'Skellefteå Kraft Rörligt pris',
    terms: [{ t: 'Genom att signera godkänner du' }, { t: 'Skellefteå Krafts allmänna avtalsvillkor', b: true }, ...fullmakt],
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
    compare2000: 135.1,
    firstYearFee: 0,
    discountMonths: 15,
    hasDiscount: true,
    discountRow: { label: 'Månadsavgift', value: 'Fri i 15 månader' },
    choice: 'Fortum Rörligt pris',
    terms: [{ t: 'Genom att signera godkänner du' }, { t: 'Fortums avtalsvillkor', b: true }, ...fullmakt],
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
    compare2000: 139.6,
    firstYearFee: 55,
    discountMonths: 12,
    hasDiscount: true,
    discountRow: { label: 'Elprisrabatt', value: 'Rabatt på elpriset i 12 månader' },
    choice: 'Vattenfall Rörligt pris',
    terms: [{ t: 'Genom att signera godkänner du' }, { t: 'Vattenfalls avtalsvillkor', b: true }, { t: 'och' }, { t: 'Vattenfalls särskilda avtalsvillkor', b: true }, ...fullmakt],
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
    compare2000: 150.2,
    firstYearFee: 49,
    discountMonths: 0,
    hasDiscount: false,
    discountRow: null,
    choice: 'Tibber Timpris',
    terms: [
      { t: 'Genom att signera godkänner du' },
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
/*
 * Elnätsbolaget (nätägaren) på den nya adressen. Hämtas per adress via flyttsmart-api
 * (apis/el-omraden). EXEMPEL: Ellevio för demoadressen Ekvägen 8, Stockholm.
 * Saknas nätägaren står bara "elnätet".
 */
export const GRID_OWNER: string | null = 'Ellevio'

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

/*
 * Jämförpris (lagkrav, KOVFS 2018:1 9 §). Nivån följer live (ElectricityProviderCard):
 * förbrukning från 12 500 kWh ger 20 000, under 3 500 ger 2 000, annars 5 000.
 * EXEMPELSIFFROR: 2 000-värdet kommer från Paper. 5 000 och 20 000 räknas fram som
 * rörlig del + månadsavgift första året utslagen på nivån (fee * 12 * 100 / nivå öre/kWh).
 * Rörlig del = Paper-värdet minus avgiftsdelen vid 2 000 kWh. Månadsavgifterna för
 * Vattenfall (55 kr) och Tibber (49 kr) kommer från demo/electricity/offers.ts.
 */
export type CompareLevel = 2000 | 5000 | 20000
export const compareLevel = (kwh: number): CompareLevel => (kwh >= 12500 ? 20000 : kwh > 0 && kwh < 3500 ? 2000 : 5000)
const feeOre = (fee: number, level: number) => (fee * 12 * 100) / level
/*
 * Vattenfalls rabatt ligger på påslaget och kommer från Vattenfalls API per förbrukning
 * (flyttsmart-api vattenfall.service.ts, TK-681). EXEMPEL: ingen rabatt vid 2 000 kWh,
 * −5,25 vid 5 000 och −7,00 öre/kWh vid 20 000. Under 2 500 kWh/år ingen rabatt alls
 * (gränsen är också ett exempel). Paper-värdet vid 2 000 kWh är därför utan rabatt.
 */
export const VATTENFALL_LEVEL_DISCOUNT: Record<CompareLevel, number> = { 2000: 0, 5000: 5.25, 20000: 7 }
export const VATTENFALL_MIN_KWH = 2500
const levelDiscount = (o: Offer, level: CompareLevel) => (o.id === 'vattenfall' ? VATTENFALL_LEVEL_DISCOUNT[level] : 0)
export const comparePrice = (o: Offer, level: CompareLevel) => o.compare2000 - feeOre(o.firstYearFee, 2000) + feeOre(o.firstYearFee, level) - levelDiscount(o, level)
export const formatOre = (n: number) => new Intl.NumberFormat('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
/** Förra månaden, som live (previousMonth), skriven som i Paper: "September". */
export const previousMonthName = () => {
  const d = new Date()
  d.setDate(1)
  d.setMonth(d.getMonth() - 1)
  const m = new Intl.DateTimeFormat('sv-SE', { month: 'long' }).format(d)
  return m.charAt(0).toUpperCase() + m.slice(1)
}
/** Raden under jämförpriset, byggd av live-texterna comparisonPriceDescription(NoDiscount) och priceComparisonFooter. */
export const compareNote = (o: Offer) =>
  `${o.discountMonths > 0 ? `Första ${o.discountMonths} månaderna, inkl. rabatt och moms.` : 'Inkl. moms.'} ${previousMonthName()}, SE3. Månadsavgiften är ${o.firstYearFee} kr första året. Elnätskostnad tillkommer.`

/*
 * Prisspecifikationen på Sammanfattningen, uppställd som live (PROVIDERDETAILS).
 * EXEMPELSIFFROR. Spotpriset (62,40 öre/kWh exkl. moms) och elcertifikatet är exempel.
 * Påslagen för Skellefteå, Fortum och Tibber kommer från elsidans prisspecifikation 17/10,
 * Vattenfalls påslag och öresrabatt är exempel. Månadsavgifterna följer jämförpriset
 * (firstYearFee) och rabattraden på steg 1 (Skellefteå ord. 39 kr). Siffrorna går inte att
 * stämma av exakt mot jämförpriset, som är satt från Paper.
 */
export const SPOT_ORE = 62.4
export const CERT_ORE = 0.6
export type PriceSpec = { markup: number; kwhDiscount?: { ore: number; months: number; byUsage?: boolean }; fee: number; feeDiscount?: { kr: number; months: number } }
export const PRICE_SPEC: Record<OfferId, PriceSpec> = {
  skekraft: { markup: 8.3, kwhDiscount: { ore: 8.75, months: 12 }, fee: 39, feeDiscount: { kr: 39, months: 12 } },
  fortum: { markup: 13.3, fee: 69, feeDiscount: { kr: 69, months: 15 } },
  /* Vattenfalls öresrabatt trappas efter förbrukningen. Stegen är okända: 5,25 är ett EXEMPEL ur skissen 23/9. */
  vattenfall: { markup: 11, kwhDiscount: { ore: 5.25, months: 12, byUsage: true }, fee: 55 },
  tibber: { markup: 11.9, fee: 49 },
}
const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100
/** Raderna exkl. moms, momsen och summan inkl. moms. Momsen är summan minus raderna, så att allt går jämnt ut. */
export const priceSpecTotals = (id: OfferId) => {
  const sp = PRICE_SPEC[id]
  const ex = round2(SPOT_ORE + sp.markup + CERT_ORE)
  const total = round2(ex * 1.25)
  return { ex, vat: round2(total - ex), total }
}

/*
 * Besparingen i Ett bra val, som rabattrutan på steg 1 och live-texterna discountBanner*.
 * EXEMPEL: Skellefteå 890 kr är rutan på steg 1 (Paper). Fortum är fri månadsavgift
 * 69 kr i 15 månader (live: värde 1 035 kr). Vattenfall är öresrabatten i PRICE_SPEC
 * gånger förbrukningen. Tibber har ingen rabatt och får ingen rad.
 */
export const savings = (id: OfferId, kwh: number): { kr: number; period: string } | null => {
  const sp = PRICE_SPEC[id]
  if (id === 'skekraft') return { kr: 890, period: 'första året' }
  const kd = kwhDiscountFor(id, kwh)
  if (sp.feeDiscount && !sp.kwhDiscount) return { kr: sp.feeDiscount.kr * sp.feeDiscount.months, period: `de första ${sp.feeDiscount.months} månaderna` }
  if (kd) return { kr: Math.round((kd.ore * kwh) / 100 / 5) * 5, period: kd.months === 12 ? 'första året' : `de första ${kd.months} månaderna` }
  return null
}

/** Öresrabatten vid kundens förbrukning. Vattenfall har ingen rabatt under VATTENFALL_MIN_KWH. */
export const kwhDiscountFor = (id: OfferId, kwh: number) => {
  const d = PRICE_SPEC[id].kwhDiscount
  if (!d) return null
  if (id === 'vattenfall' && kwh < VATTENFALL_MIN_KWH) return null
  return d
}
